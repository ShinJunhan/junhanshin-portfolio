# ============================================================
# modules/eks_nodes/main.tf — EKS managed node groups (IaC ⑦)   💰 paid
# ------------------------------------------------------------
# What this module does, in plain terms:
#   The EKS cluster from ⑥ is only the management office. It has no servers where pods run.
#   This module creates those servers (EC2), grouped by role.
#
#   With "managed" node groups, AWS picks the AMI, joins the nodes, and replaces them.
#   That is much simpler than launching EC2 ourselves and attaching kubelet (self-managed).
#
# 💰 A large share of the total cost comes from here. The two GPUs alone are about 63% of it.
#    Working rule 17: apply everything together on 9/18.
#
# ------------------------------------------------------------
# 🔴 The values in this module were read back from CN's (Myungsoo Park's) actual manifests
#
#   k8s/base/backend/rollout.yaml        nodeSelector: workload-type=app
#   k8s/base/database/cluster.yaml       nodeSelector: workload-type=db
#                                        toleration:   workload=db:NoSchedule
#                                        podAntiAffinityType: required
#   k8s/base/ai/deployment.yaml          nodeSelector: workload-type=gpu, gpu-model=l40s
#   k8s/base/ai/ollama-deployment.yaml   nodeSelector: workload-type=gpu, gpu-model=t4
#                                        toleration:   nvidia.com/gpu=true:NoSchedule
#   platform/*/values.yaml               nodeSelector: workload-type=system
#
#   🔴 A one-character mismatch leaves that pod Pending forever. Do not change these on a guess.
# ============================================================


# ------------------------------------------------------------
# Node IAM role
# ------------------------------------------------------------
# The identity each node (EC2) presents to AWS.
# Every node group shares this one role. There is no reason to split it,
# and splitting it would copy the four policies once per group and invite gaps.
data "aws_iam_policy_document" "node_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "node" {
  name               = "${local.name}-eks-node-role"
  assume_role_policy = data.aws_iam_policy_document.node_assume_role.json

  tags = {
    Name = "${local.name}-eks-node-role"
  }
}

resource "aws_iam_role_policy_attachment" "node_base" {
  for_each = local.base_node_policies

  role       = aws_iam_role.node.name
  policy_arn = each.value
}

# Used only when an environment needs to attach an extra policy.
# (Empty for now. ⑧ IRSA grants permissions per pod, and nodes rarely need more.)
#
# 🔴 A permission on the node role belongs to every pod on that node.
#    Per-pod permissions belong in IRSA, not on the node.
resource "aws_iam_role_policy_attachment" "node_extra" {
  for_each = toset(var.node_role_extra_policy_arns)

  role       = aws_iam_role.node.name
  policy_arn = each.value
}


# ------------------------------------------------------------
# Node groups
# ------------------------------------------------------------
data "aws_default_tags" "current" {}

# The Launch Template applies the EC2 and EBS cost tags.
# Before attaching it to an existing node group, check the replacement plan and the DB volume AZ.
resource "aws_launch_template" "node" {
  for_each = local.enabled_groups

  name_prefix = "${local.name}-ng-${each.key}-"
  key_name    = var.ssh_key_name

  # 🔴 Without this line, nodes carry only the cluster SG.
  #    Three of the four SGs in modules/security (eks-node, db, gpu)
  #    and their 12 rules would then apply to nothing.
  #    sg-alb's only egress rule points to sg-eks-node.
  #    The ALB could not reach any pod, and its targets would stay unhealthy.
  vpc_security_group_ids = local.node_security_group_ids[each.key]

  # ── Enforce IMDSv2 ───────────────────────────────────────────
  # A custom LT gets the EC2 default (IMDSv1 allowed), not the EKS default.
  # The node role carries AmazonEKS_CNI_Policy.
  # One SSRF bug in the app would leak the node's credentials (a DAST finding).
  #
  # hop_limit = 1 cuts the path from pods to IMDS.
  # This repo grants every pod permission through IRSA, and workloads are unaffected.
  # (aws-node, kube-proxy, and ebs-csi-node use hostNetwork and keep working.)
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
    instance_metadata_tags      = "enabled"
  }

  # 🔒 Node SSH hardening (P2-1 / Ansible SSH-001·004·005)
  #    This LT serves managed node groups that do not set ami_id.
  #    EKS appends its own NodeConfig part after this MIME document.
  #    → It must be MIME multipart. A plain shell script
  #      stops EKS from attaching NodeConfig, and the node never joins the cluster.
  #
  # 🔴 Keep every non-ASCII character, Korean included, out of the shell part of the .mime file.
  #    cloud-init 22.2.2 processes user-data like this.
  #      user_data.py:385      email.message_from_string(bytes.decode("utf-8"))
  #      handlers/__init__.py  part.get_payload(decode=True)
  #                              .decode(charset, errors="surrogateescape")
  #      handlers/shell_script.py -> util.write_file -> text.encode("utf-8")
  #
  #    The second line is the problem. Python email's get_payload(decode=True)
  #    tries to encode the body as ASCII and falls back to raw-unicode-escape.
  #      Korean U+B178      -> "\ub178"  escaped as ASCII text (the content is corrupted)
  #      middle dot U+00B7  -> 0xB7      Latin-1, kept as a single byte
  #    The leftover 0xB7 is not valid UTF-8 and becomes \udcb7 through surrogateescape.
  #    Writing the file then raises UnicodeEncodeError in encode("utf-8").
  #    cloud-init drops the whole part, the script never runs,
  #    and /var/lib/cloud/instance/scripts/ stays empty.
  #
  #    The charset in Content-Type plays no part in this path.
  #    On 2026-09-28, us-ascii was changed to utf-8 (PR #94), and the result on all 10 nodes
  #    stayed the same: none of the three sshd -T settings applied (SSM CommandId 40528aac).
  #    The only fix is to keep this part pure ASCII.
  #
  #    Before every apply: python3 scripts/check_node_user_data.py
  user_data = base64encode(file("${path.module}/templates/node_user_data.mime"))

  # Root device of the AL2023 EKS AMI. Each group keeps its existing volume size.
  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size           = each.value.disk_size
      volume_type           = "gp3"
      encrypted             = true
      delete_on_termination = true
    }
  }

  dynamic "tag_specifications" {
    for_each = toset(["instance", "volume"])
    content {
      resource_type = tag_specifications.value
      tags          = local.node_tags[each.key]
    }
  }

  tags = { Name = "${local.name}-lt-${each.key}" }

  lifecycle {
    # 🔴 Catch a missing mapping here.
    #    If a new workload-type label is added without an SG mapping,
    #    the node quietly comes up with only the cluster SG.
    #    The only symptom is a failed ALB health check, which hides the SG cause.
    precondition {
      condition = contains(
        keys(var.security_groups_by_workload_type),
        lookup(each.value.labels, "workload-type", ""),
      )
      error_message = "Node group '${each.key}': the workload-type label is missing from security_groups_by_workload_type. Add the mapping in the environment's nodegroups.tf."
    }
  }
}

resource "aws_eks_node_group" "this" {
  for_each = local.enabled_groups

  cluster_name    = var.cluster_name
  node_group_name = "${local.name}-ng-${each.key}"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.subnet_ids
  version         = var.cluster_version

  # 🔴 One instance type per group is the rule.
  #    instance_types accepts several, but that list is a set of options for Spot.
  #    On-Demand gives no guarantee about which type launches.
  #    Splitting the groups is the only way to get exactly one medium and one large.
  instance_types = [each.value.instance_type]
  capacity_type  = each.value.capacity_type
  ami_type       = each.value.ami_type

  launch_template {
    id      = aws_launch_template.node[each.key].id
    version = tostring(aws_launch_template.node[each.key].latest_version)
  }

  scaling_config {
    desired_size = each.value.desired_size
    min_size     = each.value.min_size
    max_size     = each.value.max_size
  }

  # How many nodes may go down at once during a replacement.
  # 1 is slow and safe. That matters most for the DB group, which needs all three nodes.
  update_config {
    max_unavailable = 1
  }

  labels = each.value.labels

  # A taint is the node's "authorized personnel only" sign.
  # A pod passes it only with a matching toleration (its pass).
  dynamic "taint" {
    for_each = each.value.taints
    content {
      key    = taint.value.key
      value  = taint.value.value
      effect = taint.value.effect
    }
  }

  # key_name goes through the Launch Template, and no SSH inbound rule is added.
  tags = local.node_tags[each.key]

  lifecycle {
    # ── Size consistency ─────────────────────────────────────────
    precondition {
      condition = (
        each.value.desired_size >= each.value.min_size
        && each.value.desired_size <= each.value.max_size
      )
      error_message = "Node group '${each.key}': desired_size must be between min_size and max_size."
    }

    # ── 🔴 Three-node constraint for the DB group ───────────────────────────
    #
    # In CN's manifest, podAntiAffinityType: required with topologyKey: hostname
    # means the three CNPG pods must always sit on different nodes.
    # Three pods on three nodes leaves zero slack. Losing one node leaves one pod Pending for good.
    #
    # In operation, min_size must stay at 3 or more. A full stop is allowed only when min and desired are both 0.
    # The moment an autoscaler or a node replacement drops it to two, recovery fails.
    precondition {
      condition = (
        lookup(each.value.labels, "workload-type", "") != "db"
        || each.value.min_size >= 3
        || (each.value.min_size == 0 && each.value.desired_size == 0)
      )
      error_message = "Node group '${each.key}': the DB group needs min_size of 3 or more in operation. A full stop is allowed only when min_size and desired_size are both 0, and a partial scale-down to one or two nodes is blocked."
    }

    # ── 🔴 No Spot for the DB group ──────────────────────────────────
    #
    # AWS reclaims Spot capacity with a two-minute notice when it needs it.
    # The DB has zero spare nodes, and a reclaimed node leaves its pod nowhere to go.
    precondition {
      condition = (
        lookup(each.value.labels, "workload-type", "") != "db"
        || each.value.capacity_type == "ON_DEMAND"
      )
      error_message = "Node group '${each.key}': the DB group must be ON_DEMAND. A Spot reclaim leaves the CNPG pod unrecoverable."
    }
  }

  # 🔴 A node that starts before its IAM policies attach fails to join the cluster.
  #    This dependency cannot be expressed in references, and depends_on handles it (HashiCorp's documentation names this case).
  depends_on = [aws_iam_role_policy_attachment.node_base]
}
