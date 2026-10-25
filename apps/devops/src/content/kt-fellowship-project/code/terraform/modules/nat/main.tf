# ============================================================
# modules/nat/main.tf — NAT Gateway + fixed EIP + alarms (IaC ⑤)   💰 paid
# ------------------------------------------------------------
# What this module does, in plain terms:
#   Nodes and pods in the app subnets have no public IP and cannot reach the internet.
#   The NAT Gateway acts as the office's main phone line.
#   Outbound traffic leaves under the NAT's public IP, and the NAT hands each reply back to the pod.
#   It never answers calls placed from outside (inbound). The path is one-way.
#
#   Traffic that leaves this way: ECR · STS · EC2 API · Toss Payments ·
#                        Kakao/Google/Naver OAuth · Smart Taekbae · Google SMTP
#   Traffic that does not: S3. The ④ Gateway Endpoint is the shorter route and wins (free).
#
# 🔄 2026-09-16 module split (from the team lead's review of PR #19)
#    Moved here from the old modules/network/nat.tf.
#    Two reasons:
#      1. Every other module (endpoints, security, eks, ecr, alb) holds one concern.
#         network alone held two, the VPC and the NAT.
#      2. 🔑 Everything in network is free, and everything in nat is paid.
#         When the module boundary matches the billing boundary, working rule 17
#         ("paid resources are applied together on 9/18") shows in the folder layout.
#
#    ⚠️ No moved block. moved is only for resources that are already deployed
#       (working rule 15). ⑤ was never applied and is not in State.
#
# 💰 Pricing: an hourly rate plus a rate per GB processed.
#    The cluster runs 9 hours a day, and the NAT still bills 24 hours. It is a fixed cost.
# ============================================================


# ------------------------------------------------------------
# Fixed public IP (EIP)
# ------------------------------------------------------------
# 🔴 This is the only resource without count. Its lifecycle is split from the NAT on purpose.
#
#    Reason: Smart Taekbae adds our source IP to its allowlist.
#    If this IP changes, delivery tracking stops the same day (working rule 9).
#
#    The NAT Gateway must be able to go down and come back to save money (10/1–10/4).
#    The EIP must stay up through that window to reattach with the same IP.
#    → count on the NAT, no count on the EIP.
#
# ⚠️ An EIP keeps billing as a public IPv4 address even when no NAT is attached.
#    (Already included in the cost estimate's "3 public IPv4 addresses" line.)
resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "${local.name}-eip-nat"
  }

  # 🔓 2026-10-06: prevent_destroy removed to end the project.
  #    It used lifecycle { prevent_destroy = true } to block an accidental destroy
  #    (working rule 9: "deleting this goes through review"). At shutdown the protected resource is the one being deleted,
  #    and this PR removes the line as the comment instructed.
  #    ⚠️ Restore lifecycle { prevent_destroy = true } before applying this module to a live environment again.
}


# ------------------------------------------------------------
# NAT Gateway
# ------------------------------------------------------------
resource "aws_nat_gateway" "main" {
  # Cost switch. Setting it to false removes only the NAT and keeps the EIP.
  count = var.enabled ? 1 : 0

  allocation_id     = aws_eip.nat.id
  connectivity_type = "public"
  subnet_id         = local.nat_subnet_id

  tags = {
    Name = "${local.name}-nat-${var.az_suffix}"
  }

  lifecycle {
    # ── precondition 1: catch an AZ typo ──────────────────────────
    # When the lookup in locals.tf misses a key, it returns an empty string.
    # AWS would then fail with an unrelated error such as "not a subnet id".
    # This check fails first with a message a person can read.
    precondition {
      condition     = local.nat_subnet_id != ""
      error_message = "az_suffix must be a key of public_subnet_ids_by_az. Check the available values (for example: a, c)."
    }

    # ── precondition 2: make the IGW come first ──────────────
    # 🔑 This is the part of the module split that took the most care.
    #
    # [Problem]
    #   The NAT needs the IGW to reach the internet, yet no argument on the NAT
    #   resource refers to the IGW. Terraform orders resources by reference.
    #   With no reference, it does not know the order and creates both at once.
    #   HashiCorp's documentation calls this a "hidden dependency"
    #   and recommends handling it explicitly.
    #
    # [Old approach]
    #   Inside one module, depends_on = [aws_internet_gateway.main] solved it.
    #   After the split, that resource address is out of reach.
    #
    # [Alternative not taken]
    #   The root could declare module "nat" { depends_on = [module.network] }.
    #   Module-level depends_on makes every resource in nat wait for every
    #   resource in network, and outputs turn "known after apply" during plan.
    #   The only requirement is that one NAT waits for one IGW.
    #
    # [Chosen approach]
    #   The precondition reads var.internet_gateway_id.
    #   The root wires it to module.network.internet_gateway_id, and
    #   at plan time the value is still unknown. Terraform cannot check an unknown value.
    #   It waits to start this resource until the IGW actually exists.
    #   → An exact order between two single resources.
    #
    # ⚠️ The check itself ("not empty") is effectively always true.
    #    Read this block knowing that its real purpose is the ordering.
    precondition {
      condition     = var.internet_gateway_id != ""
      error_message = "internet_gateway_id is empty. The NAT needs an Internet Gateway in the same VPC."
    }
  }
}


# ------------------------------------------------------------
# app route table → NAT route
# ------------------------------------------------------------
# The app subnets reach the internet only once this one route exists.
#
# modules/network creates the route table itself, and this module adds
# only the one route inside it. modules/endpoints attaches the S3 Gateway Endpoint
# to the same route table in the same way.
#
# 🔴 Never create this route in the data route table
#    (working rule 7 · security team NAT condition #2).
#    The security check is simple: confirm that rt-data has no 0.0.0.0/0.
resource "aws_route" "app_nat" {
  count = var.enabled ? 1 : 0

  route_table_id         = var.app_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.main[0].id
}


# ------------------------------------------------------------
# Two CloudWatch alarms: security team NAT approval condition #3
# ------------------------------------------------------------
# The condition as written: "Monitoring metrics: ErrorPortAllocation and PacketsDropCount are required"
#
# Why these two:
#   ErrorPortAllocation counts the times the NAT could not assign a port.
#     The NAT packs many connections behind one public IP and tells them apart by port.
#     When ports run out, the internet suddenly stops working,
#     and without this metric the cause takes hours to find.
#   PacketsDropCount counts the packets the NAT dropped. It follows from the case above.
#
# 💰 About $0.10 per alarm per month. Two cost about $0.20, which the cost estimate leaves out as negligible.
resource "aws_cloudwatch_metric_alarm" "nat_error_port_allocation" {
  count = var.enabled ? 1 : 0

  alarm_name        = "${local.name}-nat-error-port-allocation"
  alarm_description = "NAT Gateway port exhaustion. A value above 0 means outbound connections are failing."

  namespace   = "AWS/NATGateway"
  metric_name = "ErrorPortAllocation"
  statistic   = "Sum"
  period      = 300 # 5 minutes
  dimensions = {
    NatGatewayId = aws_nat_gateway.main[0].id
  }

  comparison_operator = "GreaterThanThreshold"
  threshold           = 0
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching" # a missing datapoint is normal (no port exhaustion)

  alarm_actions = var.alarm_sns_topic_arns
  ok_actions    = var.alarm_sns_topic_arns

  tags = {
    Name = "${local.name}-nat-error-port-allocation"
  }
}

resource "aws_cloudwatch_metric_alarm" "nat_packets_drop_count" {
  count = var.enabled ? 1 : 0

  alarm_name        = "${local.name}-nat-packets-drop-count"
  alarm_description = "NAT Gateway packet drops. If they persist, suspect a NAT fault or port exhaustion."

  namespace   = "AWS/NATGateway"
  metric_name = "PacketsDropCount"
  statistic   = "Sum"
  period      = 300
  dimensions = {
    NatGatewayId = aws_nat_gateway.main[0].id
  }

  comparison_operator = "GreaterThanThreshold"
  threshold           = 0
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"

  alarm_actions = var.alarm_sns_topic_arns
  ok_actions    = var.alarm_sns_topic_arns

  tags = {
    Name = "${local.name}-nat-packets-drop-count"
  }
}
