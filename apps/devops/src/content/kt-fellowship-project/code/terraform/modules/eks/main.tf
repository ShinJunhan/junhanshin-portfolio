# ============================================================
# modules/eks/main.tf — EKS cluster + OIDC Provider (IaC ⑥)   💰 paid
# ------------------------------------------------------------
# What this module creates, in plain terms:
#   ① An IAM role for the control plane: AWS's permission to manage ENIs, ELBs, and more in our account
#   ② A CloudWatch log group: where the control plane's audit logs go
#   ③ The EKS cluster itself: the control tower. Nodes join in ⑦
#   ④ An OIDC Provider: lets AWS trust the identity tokens the cluster issues to pods (an IRSA prerequisite)
#
# 💰 The EKS control plane bills by the hour and **cannot be turned off.**
#    With every node down, the cluster still bills (the always-on 408 h line in the cost estimate).
#    Working rule 17: plan only until 9/17, and apply everything together on 9/18.
# ============================================================


# ------------------------------------------------------------
# ① Control plane IAM role
# ------------------------------------------------------------
# This role lets the AWS EKS service act on our behalf in our account,
# for example to plug control plane ENIs into our subnets.
data "aws_iam_policy_document" "cluster_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["eks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "cluster" {
  name               = "${local.name}-iam-role-eks-cluster"
  assume_role_policy = data.aws_iam_policy_document.cluster_assume_role.json

  tags = {
    Name = "${local.name}-iam-role-eks-cluster"
  }
}

# ⚠️ The account field in the ARN below reads "aws" because AWS owns this managed policy.
#    It is not our account ID hard-coded, and it does not break review checklist #8.
resource "aws_iam_role_policy_attachment" "cluster" {
  for_each = toset([
    "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
    # ↓ Required for per-pod security groups (Security Groups for Pods).
    #   Nothing uses them yet. Adding them later then takes a policy change instead of a new cluster,
    #   and the policy is attached now.
    "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
  ])

  role       = aws_iam_role.cluster.name
  policy_arn = each.value
}


# ------------------------------------------------------------
# ② CloudWatch log group: 🔴 created before the cluster
# ------------------------------------------------------------
# Why it comes first:
#   With enabled_cluster_log_types on, EKS creates the /aws/eks/<name>/cluster log group
#   **on its own**, with retention set to Never expire.
#   The logs outlive the cluster after the project ends and keep billing.
#
#   Terraform creates the group first with a set retention, and the cluster uses it.
#   This is easy to miss in practice, and it turns straight into cost.
resource "aws_cloudwatch_log_group" "cluster" {
  count = length(var.enabled_cluster_log_types) > 0 ? 1 : 0

  # 🔴 EKS fixes this naming rule. A different name makes the cluster create a second group elsewhere.
  name              = "/aws/eks/${var.cluster_name}/cluster"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${local.name}-log-eks-cluster"
  }
}


# ------------------------------------------------------------
# ③ EKS cluster
# ------------------------------------------------------------
resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  version  = var.cluster_version
  role_arn = aws_iam_role.cluster.arn

  vpc_config {
    # Subnets for the control plane ENIs. These are the app (private) subnets.
    subnet_ids = var.subnet_ids

    # 🔴 Even a public endpoint returns 401 to anyone missing from the access entries.
    #    This setting decides whether the line is connected. It does not open the door.
    endpoint_public_access = var.endpoint_public_access
    public_access_cidrs    = var.public_access_cidrs

    # Sends node ↔ control plane traffic over the VPC's internal path for stability.
    endpoint_private_access = var.endpoint_private_access

    # Usually left empty. EKS creates eks-cluster-sg-<name> on its own
    # and opens control plane ↔ node traffic itself.
    security_group_ids = var.additional_security_group_ids
  }

  access_config {
    authentication_mode                         = var.authentication_mode
    bootstrap_cluster_creator_admin_permissions = var.bootstrap_cluster_creator_admin_permissions
  }

  enabled_cluster_log_types = var.enabled_cluster_log_types

  # Envelope encryption for Secrets. The value arrives in the ⑧ KMS step.
  # 🔴 It can be added after the cluster exists, and it can never be removed.
  dynamic "encryption_config" {
    for_each = var.secrets_kms_key_arn == null ? [] : [1]

    content {
      resources = ["secrets"]

      provider {
        key_arn = var.secrets_kms_key_arn
      }
    }
  }

  tags = {
    Name = var.cluster_name
  }

  # ⚠️ The second and third justified uses of depends_on.
  #    (The first is the NAT → IGW order in modules/network.)
  #    Both are hidden dependencies that the code never references but that must exist first.
  #      - If the policy attachment lags, cluster creation fails for lack of permission
  #      - If the log group lags, EKS creates its own with unlimited retention
  depends_on = [
    aws_iam_role_policy_attachment.cluster,
    aws_cloudwatch_log_group.cluster,
  ]

  lifecycle {
    precondition {
      condition     = length(var.subnet_ids) >= 2
      error_message = "EKS needs at least two subnets in different AZs. Pass both app subnets (a and c)."
    }

    precondition {
      condition     = var.endpoint_public_access || var.endpoint_private_access
      error_message = "With both public and private access off, nobody can reach the cluster."
    }

    # 🔴 Added 2026-09-17: a guard against opening the endpoint to the whole internet by mistake
    #
    #    The team decision (option B) is to open public access during the build, limited to teammates' IPs.
    #    With public access on and no CIDRs, AWS treats the endpoint as open to 0.0.0.0/0.
    #    → The cluster becomes reachable from anywhere with no error and no warning.
    #
    #    ⚠️ If the endpoint truly must open to everyone, raise a PR that deletes this block.
    #       "Opening it goes through review" is the purpose of this guard.
    precondition {
      condition = (
        !var.endpoint_public_access
        || (length(var.public_access_cidrs) > 0 && !contains(var.public_access_cidrs, "0.0.0.0/0"))
      )
      error_message = "With endpoint_public_access = true, public_access_cidrs must list teammates' IPs. An empty list or 0.0.0.0/0 is rejected (team decision B, 2026-09-17)."
    }
  }
}


# ------------------------------------------------------------
# ④ OIDC Provider: an IRSA prerequisite
# ------------------------------------------------------------
# What it is, in plain terms:
#   A pod needs an identity to use AWS resources such as S3 and Parameter Store.
#   The cluster gives the pod a token stating "this pod is backend-sa in the app namespace."
#   AWS does not know the cluster that issued that token.
#   The OIDC Provider **registers that issuer with AWS as trusted.**
#
# 🔴 Without it, all six IRSA roles stop working,
#    and the only error is a failed sts:AssumeRoleWithWebIdentity, which hides the cause.
data "tls_certificate" "oidc" {
  url = aws_eks_cluster.main.identity[0].oidc[0].issuer
}

resource "aws_iam_openid_connect_provider" "oidc" {
  url = aws_eks_cluster.main.identity[0].oidc[0].issuer

  # The audience the issuer's tokens are meant for.
  # For IRSA it is always sts.amazonaws.com.
  client_id_list = ["sts.amazonaws.com"]

  # The fingerprint of the issuer's TLS certificate. AWS uses it to reject a forged issuer.
  thumbprint_list = [data.tls_certificate.oidc.certificates[0].sha1_fingerprint]

  tags = {
    Name = "${local.name}-oidc-eks"
  }
}
