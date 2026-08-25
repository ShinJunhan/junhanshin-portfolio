# schedule module - the night shutdown (EventBridge Scheduler · convention §5-8)
# Stops the node and RDS hourly charges that accrue just by being switched on,
# overnight (02:00-10:00 KST by default).
# No Lambda: the schedule calls the AWS API directly (universal target).
#
# The Karpenter gap (team decision, 2026-07-21):
#    When the system node group goes to 0 at 02:00, the Karpenter controller
#    sitting on it loses the node it was running on. Its nodeAffinity excludes
#    the nodes Karpenter itself created, so it cannot move onto a live Spot
#    node either. Any Spot node alive at that moment therefore has nothing left
#    to reclaim it and survives until morning.
#    Leaving them costs little at Spot prices, and they are reclaimed once the
#    controller comes back at 10:00.
#    We are not extending this with a Lambda to force the cleanup (YAGNI).
#    Details in convention §5-8.

data "aws_caller_identity" "current" {}

locals {
  name_prefix    = "${var.project_name}-${var.environment}"
  account_id     = data.aws_caller_identity.current.account_id
  rds_identifier = "${local.name_prefix}-rds-postgres" # convention §5-4
  # A managed node group's ARN carries a further identifier that EKS appends
  # after the name → close it with a wildcard.
  nodegroup_arn = "arn:aws:eks:${var.aws_region}:${local.account_id}:nodegroup/${var.cluster_name}/${var.node_group_name}/*"
  rds_arn       = "arn:aws:rds:${var.aws_region}:${local.account_id}:db:${local.rds_identifier}"
}

# ── The execution role all four schedules share. Narrowed to exactly two
#    targets: that node group and that database instance ──
data "aws_iam_policy_document" "scheduler_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["scheduler.amazonaws.com"]
    }
    # Pin the account so a schedule in another account cannot assume this
    # role (confused-deputy prevention)
    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [local.account_id]
    }
  }
}

resource "aws_iam_role" "scheduler" {
  name               = "${local.name_prefix}-scheduler-night"
  description        = "EventBridge Scheduler role for nightly cost saving: scale system nodegroup and stop/start RDS. Targets are restricted to one nodegroup and one DB instance."
  assume_role_policy = data.aws_iam_policy_document.scheduler_assume.json
}

data "aws_iam_policy_document" "scheduler" {
  statement {
    sid       = "ScaleSystemNodegroup"
    effect    = "Allow"
    actions   = ["eks:UpdateNodegroupConfig"]
    resources = [local.nodegroup_arn]
  }

  statement {
    sid       = "StopStartRds"
    effect    = "Allow"
    actions   = ["rds:StopDBInstance", "rds:StartDBInstance"]
    resources = [local.rds_arn]
  }
}

resource "aws_iam_role_policy" "scheduler" {
  name   = "${local.name_prefix}-scheduler-night-policy"
  role   = aws_iam_role.scheduler.id
  policy = data.aws_iam_policy_document.scheduler.json
}

# ── Night: take the nodes down, switch RDS off ──
resource "aws_scheduler_schedule" "night_stop_nodes" {
  name                         = "${local.name_prefix}-night-stop-nodes"
  description                  = "Scale system nodegroup to 0 for the night."
  schedule_expression          = var.stop_nodes_cron
  schedule_expression_timezone = "Asia/Seoul"

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:eks:updateNodegroupConfig"
    role_arn = aws_iam_role.scheduler.arn
    # Field names follow the Scheduler universal-target spec (PascalCase),
    # which differs from the EKS API's own form (camelCase).
    # Measured 7/21: send camelCase and CreateSchedule returns a
    # ValidationException complaining that ClusterName is missing.
    input = jsonencode({
      ClusterName   = var.cluster_name
      NodegroupName = var.node_group_name
      ScalingConfig = {
        MinSize     = 0
        MaxSize     = var.node_max
        DesiredSize = 0
      }
    })

    retry_policy {
      maximum_retry_attempts       = 2
      maximum_event_age_in_seconds = 3600
    }
  }
}

resource "aws_scheduler_schedule" "night_stop_rds" {
  name                         = "${local.name_prefix}-night-stop-rds"
  description                  = "Stop RDS for the night."
  schedule_expression          = var.stop_rds_cron
  schedule_expression_timezone = "Asia/Seoul"

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:rds:stopDBInstance"
    role_arn = aws_iam_role.scheduler.arn
    # The Scheduler spec wants DbInstanceIdentifier (lower-case b in Db —
    # different from the RDS API's own DBInstanceIdentifier · measured 7/21).
    input = jsonencode({
      DbInstanceIdentifier = local.rds_identifier
    })

    retry_policy {
      maximum_retry_attempts       = 2
      maximum_event_age_in_seconds = 3600
    }
  }
}

# ── Morning: start RDS first (it takes a few minutes to come up), then
#    restore the nodes ──
resource "aws_scheduler_schedule" "morning_start_rds" {
  name                         = "${local.name_prefix}-morning-start-rds"
  description                  = "Start RDS before nodes come back."
  schedule_expression          = var.start_rds_cron
  schedule_expression_timezone = "Asia/Seoul"

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:rds:startDBInstance"
    role_arn = aws_iam_role.scheduler.arn
    input = jsonencode({
      DbInstanceIdentifier = local.rds_identifier
    })

    retry_policy {
      maximum_retry_attempts       = 2
      maximum_event_age_in_seconds = 3600
    }
  }
}

resource "aws_scheduler_schedule" "morning_start_nodes" {
  name                         = "${local.name_prefix}-morning-start-nodes"
  description                  = "Restore system nodegroup in the morning."
  schedule_expression          = var.start_nodes_cron
  schedule_expression_timezone = "Asia/Seoul"

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:eks:updateNodegroupConfig"
    role_arn = aws_iam_role.scheduler.arn
    input = jsonencode({
      ClusterName   = var.cluster_name
      NodegroupName = var.node_group_name
      ScalingConfig = {
        MinSize     = var.node_restore_min
        MaxSize     = var.node_max
        DesiredSize = var.node_restore_desired
      }
    })

    retry_policy {
      maximum_retry_attempts       = 2
      maximum_event_age_in_seconds = 3600
    }
  }
}
