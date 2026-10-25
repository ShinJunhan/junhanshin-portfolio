# ============================================================
# modules/eks_addons/main.tf — EKS add-ons (part of IaC ⑧)
# ------------------------------------------------------------
# What this module does, in plain terms:
#   An EKS cluster needs a few parts before it can do its job:
#   networking (VPC CNI), name resolution (CoreDNS), service routing (kube-proxy), and disks (EBS CSI).
#
#   Helm could install them directly. As EKS "add-ons", AWS manages
#   version compatibility and upgrades instead, which is much safer.
#
# 💰 The add-ons are free. The EBS volumes that EBS CSI creates are billed.
#
# ------------------------------------------------------------
# 🔴 The most important line in this file
#
#   enableNetworkPolicy = "true" on vpc-cni
#
#   Without it, every NetworkPolicy in CN's (Myungsoo Park's) PR #24
#   is **ignored with no error.** The resources exist and block nothing.
# ============================================================


# ------------------------------------------------------------
# VPC CNI: pod networking + NetworkPolicy enforcement
# ------------------------------------------------------------
resource "aws_eks_addon" "vpc_cni" {
  cluster_name  = var.cluster_name
  addon_name    = "vpc-cni"
  addon_version = var.vpc_cni_version

  configuration_values = local.vpc_cni_config

  # 🔑 Takes over the self-managed copy EKS installed when it created the cluster.
  #    Without OVERWRITE, creation fails with "already exists".
  resolve_conflicts_on_create = "OVERWRITE"

  # Keeps our settings (enableNetworkPolicy) on top during updates as well.
  # PRESERVE would keep the old settings left in the cluster
  # and leave the code switched on while the live add-on stays off. (Working rule 21)
  resolve_conflicts_on_update = "OVERWRITE"

  tags = {
    Name = "${local.name}-addon-vpc-cni"
  }
}


# ------------------------------------------------------------
# CoreDNS: name resolution inside the cluster
# ------------------------------------------------------------
# 🔴 It runs as a Deployment of pods and stays Pending without nodes.
#    node_group_dependency makes the node groups come first.
resource "aws_eks_addon" "coredns" {
  count = var.manage_coredns_kube_proxy ? 1 : 0

  cluster_name  = var.cluster_name
  addon_name    = "coredns"
  addon_version = var.coredns_version

  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  tags = {
    Name = "${local.name}-addon-coredns"
  }

  lifecycle {
    precondition {
      condition     = var.node_group_dependency != null
      error_message = "CoreDNS needs nodes to start. Pass the module.eks_nodes output to node_group_dependency."
    }
  }
}


# ------------------------------------------------------------
# kube-proxy: connects each Service to real pod IPs
# ------------------------------------------------------------
resource "aws_eks_addon" "kube_proxy" {
  count = var.manage_coredns_kube_proxy ? 1 : 0

  cluster_name  = var.cluster_name
  addon_name    = "kube-proxy"
  addon_version = var.kube_proxy_version

  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  tags = {
    Name = "${local.name}-addon-kube-proxy"
  }
}


# ------------------------------------------------------------
# EBS CSI Driver: turns a PVC into a real EBS volume
# ------------------------------------------------------------
# 🔴 Without it, none of the three CNPG pods start.
#
#    Myungsoo Park added a StorageClass in k8s/base/storage/gp3-cnpg-storageclass.yaml.
#    A StorageClass is only an **order form** for a disk.
#    Without the **worker that builds the EBS volume (EBS CSI Driver)** and its **AWS permission (IRSA)**,
#    the PVC stays Pending forever.
#
#    ⚠️ EKS 1.23 removed the in-tree EBS provisioner.
#       A StorageClass alone no longer works.
resource "aws_eks_addon" "ebs_csi" {
  count = var.ebs_csi_enabled ? 1 : 0

  cluster_name  = var.cluster_name
  addon_name    = "aws-ebs-csi-driver"
  addon_version = var.ebs_csi_version

  # 🔑 Per-pod permission. The node role does not get EBS permissions as a shortcut
  #    because every pod on that node would then control EBS.
  service_account_role_arn = var.ebs_csi_irsa_role_arn
  configuration_values     = local.ebs_csi_config

  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  tags = {
    Name = "${local.name}-addon-ebs-csi"
  }

  lifecycle {
    precondition {
      condition     = var.ebs_csi_irsa_role_arn != null && var.ebs_csi_irsa_role_arn != ""
      error_message = "EBS CSI needs ebs_csi_irsa_role_arn. Installed without IRSA, it cannot create volumes and the PVC stays Pending."
    }

    precondition {
      condition     = var.node_group_dependency != null
      error_message = "The EBS CSI controller also runs as a pod and needs nodes. Pass node_group_dependency."
    }
  }
}
