# eks module - irsa.tf
# IRSA (IAM Roles for Service Accounts) = a restricted staff pass, issued per pod.
#
# How it works: STS validates the pod's ServiceAccount token (a JWT) against the
#   cluster's OIDC provider and hands back temporary credentials.
#   Use the node role (the one in iam.tf) and *every* pod on that node shares
#   the same permissions; IRSA splits them per ServiceAccount, which is what
#   makes least privilege possible at all.
# That is why the OIDC provider ARN is baked into the trust policy
#   (assume_role_policy) → and why this file lives in the eks module
#   (pull it out into a separate security module and the OIDC dependency tangles
#   the creation order = chicken-and-egg. Convention §5-3).
#
# ── This module does not *create* S3, SQS or DynamoDB — it only *receives* their ARNs ──
# The resources these policies point at (owned by the storage and data modules)
# are not wired up yet. Leaving them open as Resource="*" would collapse least
# privilege, so the ARNs arrive as variables (variables.tf) and envs/dev threads
# them through. It is exactly the pattern used for network's vpc_id (§4). A child
# module cannot see a sibling module (module.storage), so passing values via the
# root is the only route there is.
# Once the wiring is done, filling in four ARNs plus enable_app_irsa = true in
# envs/dev is all it takes — this file never needs touching.

data "aws_partition" "current" {}
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
  # The key in the trust policy's condition has to be the issuer URL with the
  # scheme stripped off — host plus path.
  #   https://oidc.eks.ap-northeast-2.amazonaws.com/id/ABC → oidc.eks.ap-northeast-2.amazonaws.com/id/ABC
  # (STS normalises the token's iss claim to this string before comparing.)
  oidc_issuer_host = replace(aws_iam_openid_connect_provider.eks.url, "https://", "")

  # The two that need no external ARN. Always created.
  irsa_base = {
    lbctrl     = "kube-system:aws-load-balancer-controller"
    monitoring = "monitoring:monitoring-sa"
  }

  # The five that only mean anything once the ARNs are wired.
  # The map's *key* is both the role-name suffix (§5-3) and the key manifests
  # looks up in irsa_role_arns.
  #   predict → hailcast-dev-irsa-predict. Change the key and the ServiceAccount
  #   annotation no longer matches, which surfaces as 'access denied'.
  # The value is the ServiceAccount the role attaches to ("namespace:name"). That
  # is the contract with serviceaccount.yaml in manifests.
  #
  # There is no forecast role (§5-3 · retired 2026-07-13). Decision 1 was to build
  #    it into predict, so producing a forecast and writing it to S3 is done by a
  #    scheduler inside the predict process.
  #    With no pod to carry forecast-sa, the role is not created either. predict
  #    absorbed its permissions.
  irsa_app = {
    predict        = "hailcast:predict-sa"
    "call-api"     = "hailcast:call-api-sa"
    worker         = "hailcast:worker-sa"
    "weather-cron" = "hailcast:weather-cron-sa"
    keda           = "keda:keda-operator"                # the KEDA Helm chart's default SA name (§5-3)
    karpenter      = "kube-system:karpenter"             # kube-system by convention
    simulator      = "hailcast:simulator-sa"             # writes simulator/status.json via the s3 backend (§5-3)
    eso            = "external-secrets:external-secrets" # the ESO controller SA (Helm default). Reads the RDS secret
  }

  # The for_each *keys* are determined only by the literal strings above and a
  # boolean settled at plan time.
  # The ARN *values* play no part whatsoever in computing the keys → which is how
  # `Invalid for_each argument` is avoided (see variables.tf).
  irsa_service_accounts = merge(
    local.irsa_base,
    var.enable_app_irsa ? local.irsa_app : {},
  )
}

# ── The shared trust policy ─────────────────────────────────
# Assume is allowed only when the OIDC provider signed it (Federated), the
# token's sub is this ServiceAccount, and its aud is sts.
#
# Do not drop the aud condition. Check sub alone and a token minted for a
#    different audience that trusts the same OIDC issuer can assume the role
#    too, which opens a confused deputy. The two conditions are always a pair.
data "aws_iam_policy_document" "irsa_assume" {
  for_each = local.irsa_service_accounts

  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.eks.arn]
    }

    # each.value is "kube-system:aws-load-balancer-controller", so the line
    # below resolves to
    # system:serviceaccount:kube-system:aws-load-balancer-controller.
    condition {
      test     = "StringEquals"
      variable = "${local.oidc_issuer_host}:sub"
      values   = ["system:serviceaccount:${each.value}"]
    }

    condition {
      test     = "StringEquals"
      variable = "${local.oidc_issuer_host}:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "irsa" {
  for_each = local.irsa_service_accounts

  name               = "${local.name_prefix}-irsa-${each.key}" # hailcast-dev-irsa-lbctrl (§5-3)
  assume_role_policy = data.aws_iam_policy_document.irsa_assume[each.key].json

  tags = merge(var.tags, { Name = "${local.name_prefix}-irsa-${each.key}" })
}

# ── 1) lbctrl - AWS Load Balancer Controller ────────────────
# The add-on that watches Ingress objects, creates the ALB, and registers pod
# IPs into the target groups (installing it belongs to manifests/ArgoCD).
#
# The policy body is vendored from upstream as-is rather than trimmed by hand:
#   Source: kubernetes-sigs/aws-load-balancer-controller · docs/install/iam_policy.json
#   Cut actions out arbitrarily and Ingress reconciliation fails silently, on
#   certain paths only.
# The original has 12 statements with Resource="*", five of which carry no Condition:
#   ec2:AuthorizeSecurityGroupIngress·RevokeSecurityGroupIngress / ec2:CreateSecurityGroup /
#   elasticloadbalancing:CreateListener·DeleteListener·CreateRule·DeleteRule /
#   SetWebAcl·ModifyListener·AddListenerCertificates·RemoveListenerCertificates·ModifyRule·SetRulePriorities /
#   detaching shield·wafv2
# So it reaches security-group rules across the account, and the listeners of
# other ALBs. We still chose not to trim the original.
resource "aws_iam_policy" "lbctrl" {
  name        = "${local.name_prefix}-irsa-lbctrl-policy"
  description = "AWS Load Balancer Controller official IAM policy (upstream iam_policy.json, verbatim)."
  policy      = file("${path.module}/policies/aws-load-balancer-controller.json")

  tags = merge(var.tags, { Name = "${local.name_prefix}-irsa-lbctrl-policy" })
}

resource "aws_iam_role_policy_attachment" "lbctrl" {
  role       = aws_iam_role.irsa["lbctrl"].name
  policy_arn = aws_iam_policy.lbctrl.arn
}

# ── 2) monitoring - reading CloudWatch ──────────────────────
# The Prometheus sidecar/exporter scrapes CloudWatch metrics. It is read-only,
# so an AWS managed policy is enough.
# (The ARN is a constant → no reason to write a custom policy. YAGNI)
resource "aws_iam_role_policy_attachment" "monitoring" {
  role       = aws_iam_role.irsa["monitoring"].name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchReadOnlyAccess"
}

# ════════════════════════════════════════════════════════════════════
# The eight application roles. Only when enable_app_irsa = true (after the
# three ARNs are wired · the DynamoDB miss log is optional)
#
# RDS is the SSOT for service state (calls, predictions, scaling history). The
#    cutover to RDS is complete (convention §0 and §8-3).
#    What stays in S3 is file artefacts and the JSON predict writes as its own state.
#    Only predictions uses RDS and S3 together (app team, 2026-07-20 · convention §0).
#
#   prefix                | predict | call-api | worker | weather-cron | simulator
#   ----------------------|---------|----------|--------|--------------|----------
#   models/*              |  read   |    -     |   -    |     -        |    -
#   predictions/*         |  read+write |  -   |   -    |     -        |    -
#   weather/*             |  read   |    -     |   -    |   write      |    -
#   traffic/instances/*   |  read   |   write  |   -    |     -        |    -
#   dashboard/*           |  read+write |  -   |   -    |     -        |    -
#   simulator/*           |  read   |    -     |   -    |     -        |   write
#
# The app's FileStore calls exists() before it reads, and exists() is a head_object
#    (app common/aws/s3_adapter.py:95-100 · head_object at :97). HeadObject is
#    authorised by the s3:GetObject permission, so it needs no action of its own.
#    GetObject on the prefixes being read is sufficient.
#
# Leave a read permission out and it does not surface as 'AccessDenied'. It
#    disguises itself as 'file not found', because exists() swallows every
#    ClientError and returns False (s3_adapter.py:98-100).
#    So the symptom presents as a data problem — "weather forecast CSV
#    empty/missing" (app predict/services/prediction_service.py:77) — and a
#    permission problem gets mistaken for a data problem.
#    → Treat the prefix table above as the answer key for this IAM policy. The
#      logs will not tell you the cause.
# CreateBucket never goes out in production. The adapter's auto_create defaults
#    to false for every service (s3_auto_create_bucket in app */config.py) and
#    the buckets are owned by IaC → s3:CreateBucket is unnecessary.
# ════════════════════════════════════════════════════════════════════

# ── 3) predict - the centre of prediction, aggregation and scaling. It uses
#       this bucket more widely than anything else ──
# On the queue it gets read access only. /metrics and the dashboard in
# predict/app.py merely display the backlog; KEDA makes the scaling decision →
# so no send, receive or delete (§5-3).
#
# predict holds the S3 write (2026-07-13 · decision 1 = built into predict).
#    Producing a forecast and publishing it to predictions/latest.json is done by
#    a scheduler inside the predict process, not by a separate CronJob
#    (app predict/dependencies.py:52-58 ForecastScheduler · :116-117 ScalingScheduler).
#    So the forecast role was retired and its permissions absorbed here (§5-3).
data "aws_iam_policy_document" "predict" {
  count = var.enable_app_irsa ? 1 : 0

  # Splitting read and write across *different sets of prefixes* is the whole
  #    point of this policy. models/ is in the read group and not in the write
  #    group. That is what makes it impossible for the forecast scheduler to
  #    overwrite models/latest/model.pkl and destroy the trained model.
  #    (The filename is model.pkl, not model.txt · confirmed in app
  #     model_loader.py:30. The convention document said model.txt for a while,
  #     but that string appears nowhere in the app. IAM cuts on the prefix, so
  #     the policy itself is unaffected by the filename.)
  #
  # The read-only prefix set. Things written by others that predict only reads.
  #   models/*            ML training output      (app predict/ml_runtime/model_loader.py)
  #   weather/*           the CSV weather-cron writes (app predict/services/prediction_service.py:130 · health_service.py:73)
  #   traffic/instances/* per-pod shards from call-api (app predict/services/traffic_aggregator_service.py:46)
  statement {
    sid     = "ReadOnlyPrefixes"
    effect  = "Allow"
    actions = ["s3:GetObject"]
    resources = [
      "${var.model_bucket_arn}/models/*",
      "${var.model_bucket_arn}/weather/*",
      "${var.model_bucket_arn}/traffic/instances/*",
      "${var.model_bucket_arn}/simulator/*",
    ]
  }

  # The read+write prefix set. State files predict writes for itself and reads
  # back for itself.
  #   predictions/*  forecast JSON/CSV + history (write prediction_service.py:157-177 / read prediction_reader.py:26)
  #                  Do not narrow this to latest.json alone. history/<timestamp>.json
  #                     goes up alongside it (prediction_keep_history_in_s3 defaults
  #                     to true). The whole prefix is required (§8).
  #   dashboard/*    traffic aggregation, history, pod history (traffic_aggregator_service.py:30,64,67 · pod_forecast_service.py:84,97)
  #   Scaling history finished its cutover to RDS (2026-07-20 · app scaling_repository.py:2). The S3 write is gone.
  statement {
    sid     = "ReadWritePrefixes"
    effect  = "Allow"
    actions = ["s3:GetObject", "s3:PutObject"]
    resources = [
      "${var.model_bucket_arn}/predictions/*",
      "${var.model_bucket_arn}/dashboard/*",
    ]
  }

  # Without ListBucket, traffic aggregation dies outright.
  #    predict sweeps the shards under traffic/instances/ — one per pod — with
  #    list_keys() and sums them (app traffic_aggregator_service.py:46 →
  #    s3_adapter.py:90 list_objects_v2).
  #    It is a sweep under a prefix, which GetObject cannot do.
  #    The target is the *bucket itself*, so no /* is appended. Append it and the
  #    listing is not authorised.
  #    With no condition it could list the entire bucket, so s3:prefix narrows it.
  #    Do not use StringEquals. The real value the app sends is
  #    "traffic/instances/", and a literal comparison does not match.
  #    If this is blocked the pod does not die. The scheduler swallows every
  #    exception and leaves only a log line and a failure_count
  #    (app common/core/scheduler.py:67-73), so it looks Healthy and returns 200
  #    while dashboard/traffic.json quietly stops updating.
  #    The symptom reads as "the graph is not moving", not as "permission error".
  statement {
    sid       = "ListBucketForTrafficShards"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [var.model_bucket_arn]

    condition {
      test     = "StringLike"
      variable = "s3:prefix"
      values   = ["traffic/instances/*"]
    }
  }

  # The miss log is *write-only*. Grant read, delete or Scan and the retraining
  # data can be erased.
  #
  # Attached only when the ARN arrives. The table is settled in convention §5-4
  #    but exists on no branch yet, and there is no app code using this
  #    permission (§5-3 marks it 'not implemented'). Making it mandatory would
  #    also block the 'karpenter' role tied to the same switch, and node supply
  #    would stop with it.
  #    → If it is absent, the statement is simply not created. When the data
  #      module later creates the table, passing the ARN from the root is enough
  #      to attach the permission (nothing in this file changes).
  #
  # An unknown ARN does not kill the plan either. But know exactly why.
  #    `unknown == null` is not false, it is unknown (confirmed on TF 1.15.5 ·
  #    the conditional's result comes out as "known after apply"). So this list
  #    is never *determined*.
  #
  #    There are two real reasons it is safe anyway.
  #    ① A dynamic block, unlike a *resource-level* for_each, permits an unknown
  #       for_each. The whole block goes unknown and the data source read is
  #       deferred to apply (confirmed: the plan succeeds).
  #    ② The for_each *keys* on aws_iam_policy.app, which consumes this
  #       document, are literals, so the unknown value never enters the key
  #       computation. What must not be unknown is the key, not the value.
  #
  #    Do not carry this reasoning over to a *resource-level* for_each/count.
  #       There it kills the plan with `Invalid for_each argument` (which is what
  #       the locals above exist to avoid).
  dynamic "statement" {
    for_each = var.prediction_log_table_arn == null ? [] : [var.prediction_log_table_arn]

    content {
      sid       = "WritePredictionLog"
      effect    = "Allow"
      actions   = ["dynamodb:PutItem", "dynamodb:UpdateItem"]
      resources = [statement.value]
    }
  }

  statement {
    sid       = "ObserveCallQueue"
    effect    = "Allow"
    actions   = ["sqs:GetQueueAttributes", "sqs:GetQueueUrl"]
    resources = [var.sqs_call_queue_arn]
  }
}

# ── 4) call-api - *only* puts onto the queue, plus the traffic shard (write) ──
# The point of least privilege: give the call API receive and delete and it can
# erase the calls it just enqueued.
# A permission with no use only produces accidents → which is why the role is
# split from the worker's (§5-3).
# Looking a call up (GET /call/{id}) reads the RDS Call table, so it needs no S3
# permission (convention §8-1).
data "aws_iam_policy_document" "call_api" {
  count = var.enable_app_irsa ? 1 : 0

  statement {
    sid       = "SendCallToQueue"
    effect    = "Allow"
    actions   = ["sqs:SendMessage", "sqs:GetQueueUrl"]
    resources = [var.sqs_call_queue_arn]
  }

  # Every pod writes its own share of the call count to a shard file every 10
  # seconds (app call-api/services/traffic_counter.py:34).
  # predict gathers and sums them. predict is the reader, so call-api needs
  # write and nothing else.
  statement {
    sid       = "WriteTrafficShard"
    effect    = "Allow"
    actions   = ["s3:PutObject"]
    resources = ["${var.model_bucket_arn}/traffic/instances/*"]
  }
}

# ── 5) worker - *only* takes from the queue and deletes ─────
# Saving the call record writes the RDS Call table, so there is no S3 permission
# (convention §8-1). RDS authenticates with a username and password (via ESO)
# and a security group, not with IRSA (convention §5-4).
data "aws_iam_policy_document" "worker" {
  count = var.enable_app_irsa ? 1 : 0

  statement {
    sid       = "ConsumeCallQueue"
    effect    = "Allow"
    actions   = ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueUrl"]
    resources = [var.sqs_call_queue_arn]
  }
}

# ── 6) weather-cron - *only* writes the weather CSV ─────────
# Added 2026-07-14. It is the head of the prediction pipeline, so without this
#    role the CSV never lands, predict cannot read it, and forecasting stops
#    entirely (app predict/services/prediction_service.py:77 dies with
#    "weather forecast CSV empty/missing").
#
# This service touches nothing in AWS except S3 (zero SQS and DynamoDB use ·
# verified). It makes no read calls either, so it does not get GetObject. Each
# cycle it overwrites the CSV wholesale (app weather-cron/services/weather_service.py:58).
# Hence a role this thin.
data "aws_iam_policy_document" "weather_cron" {
  count = var.enable_app_irsa ? 1 : 0

  statement {
    sid       = "WriteWeatherCsv"
    effect    = "Allow"
    actions   = ["s3:PutObject"]
    resources = ["${var.model_bucket_arn}/weather/*"]
  }
}

# ── 7) keda - reading the queue length (the lifeline of reactive scaling) ──
# Without this, reactive scaling dies *silently*. KEDA's aws-sqs-queue trigger
#    has the operator itself call GetQueueAttributes to read the queue length;
#    with no permission, the queue can back up as far as it likes and the pods
#    never grow and no error appears. The TriggerAuthentication in manifests
#    references this role.
#
# The absence of GetQueueUrl is not a typo. The ScaledObject is handed the whole
# queueURL, so there is no name→URL lookup to do. Unlike the three application
# roles, KEDA is the exception here (§5-3).
data "aws_iam_policy_document" "keda" {
  count = var.enable_app_irsa ? 1 : 0

  statement {
    sid       = "ReadCallQueueLength"
    effect    = "Allow"
    actions   = ["sqs:GetQueueAttributes"]
    resources = [var.sqs_call_queue_arn]
  }
}

# ── 9) simulator - *only* writes the simulator status file ──
# Running on Kubernetes with the s3 backend, it writes simulator/status.json to
# S3 every two seconds (app simulator/schedulers/status_scheduler.py). Write on
# that one prefix is all it needs.
data "aws_iam_policy_document" "simulator" {
  count = var.enable_app_irsa ? 1 : 0

  statement {
    sid       = "WriteSimulatorStatus"
    effect    = "Allow"
    actions   = ["s3:PutObject"]
    resources = ["${var.model_bucket_arn}/simulator/*"]
  }
}

# ── 10) eso - the External Secrets controller reads the RDS password secret
#        and the database address parameter ──
# The password from Secrets Manager (GetSecretValue) and the address from
# Parameter Store (GetParameter): one each.
# ESO merges the two into a single Kubernetes Secret in the hailcast namespace
# (hailcast-rds-secret), which call-api, worker and predict then read as
# environment variables (the contract table in §5-4).
# No application pod calls AWS directly. This controller is the only one that does.
data "aws_iam_policy_document" "eso" {
  count = var.enable_app_irsa ? 1 : 0

  statement {
    sid    = "ReadRdsMasterSecret"
    effect = "Allow"
    # DescribeSecret added ahead of need (7/21): ESO has a path that reads the
    # metadata before the value, and without it the first sync fails quietly and
    # costs an apply round-trip. The target is the same single secret.
    actions   = ["secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret"]
    resources = [var.rds_master_secret_arn]
  }

  statement {
    sid       = "ReadRdsEndpointParameter"
    effect    = "Allow"
    actions   = ["ssm:GetParameter"]
    resources = [var.rds_endpoint_param_arn]
  }
}

# Create and attach all seven policies above in one go.
# The for_each keys are determined only by literals and a boolean settled at
# plan time (the policy *body* may be unknown — what must not be unknown is the
# key, not the value).
locals {
  irsa_app_policies = var.enable_app_irsa ? {
    predict        = data.aws_iam_policy_document.predict[0].json
    "call-api"     = data.aws_iam_policy_document.call_api[0].json
    worker         = data.aws_iam_policy_document.worker[0].json
    "weather-cron" = data.aws_iam_policy_document.weather_cron[0].json
    keda           = data.aws_iam_policy_document.keda[0].json
    simulator      = data.aws_iam_policy_document.simulator[0].json
    eso            = data.aws_iam_policy_document.eso[0].json
  } : {}

  # AWS has no API for modifying an aws_iam_policy description, so Terraform
  #    deletes and recreates the policy instead (Forces new resource). During
  #    that recreation the policy detaches from the role and reattaches, and a
  #    pod can catch an AccessDenied in the gap. Adding it later costs
  #    something; adding it now costs nothing → so it is filled in from the
  #    start. (Same property as a security group's description.)
  irsa_app_policy_desc = {
    predict        = "predict-sa: S3 read (models, weather, traffic, simulator) + read/write (predictions, dashboard) + ListBucket + DynamoDB miss-log write + SQS queue backlog read."
    "call-api"     = "call-api-sa: send to the SQS call queue + write S3 traffic/instances/ (no receive, no delete)."
    worker         = "worker-sa: receive and delete on the SQS call queue only (no send, no S3)."
    "weather-cron" = "weather-cron-sa: write S3 weather/ only (no read, no SQS, no DynamoDB)."
    keda           = "keda-operator: read the SQS queue length only (the reactive scale trigger)."
    simulator      = "simulator-sa: write S3 simulator/ only (status.json)."
    eso            = "external-secrets: GetSecretValue on the RDS password secret + GetParameter on the endpoint parameter."
  }
}

resource "aws_iam_policy" "app" {
  for_each = local.irsa_app_policies

  name        = "${local.name_prefix}-irsa-${each.key}-policy"
  description = local.irsa_app_policy_desc[each.key]
  policy      = each.value

  tags = merge(var.tags, { Name = "${local.name_prefix}-irsa-${each.key}-policy" })
}

resource "aws_iam_role_policy_attachment" "app" {
  for_each = local.irsa_app_policies

  role       = aws_iam_role.irsa[each.key].name
  policy_arn = aws_iam_policy.app[each.key].arn
}

# ── 8) karpenter - the node supply controller ───────────────
# The policy body is vendored from upstream rather than written by hand (the
# same principle as lbctrl):
#   Source: aws/karpenter-provider-aws · getting-started/.../cloudformation.yaml
#   Its conditions (aws:ResourceTag/kubernetes.io/cluster/<cluster> = owned and
#   others) are dense, and trimming them arbitrarily means nodes fail to come up,
#   or come up and can never be reclaimed.
#
# The way upstream *splits* the policy into six is followed as well. An IAM
# managed policy has a 6,144-character ceiling, and merged into one block it
# could overflow. CloudFormation substitutions such as ${AWS::Partition} were
# moved to templatefile variables.
locals {
  karpenter_policy_files = var.enable_app_irsa ? toset([
    "node-lifecycle",     # create, tag and terminate EC2 (scoped by the cluster tag)
    "iam-integration",    # PassRole on the node role + instance profile management
    "eks-integration",    # eks:DescribeCluster (finding the API endpoint)
    "interruption",       # receive the 2-minute Spot interruption warning. Without it, interruption handling is off entirely (§5-4)
    "zonal-shift",        # read zonal shift status during an AZ failure
    "resource-discovery", # look up instance types, prices and AMIs (read-only)
  ]) : toset([])
}

resource "aws_iam_policy" "karpenter" {
  for_each = local.karpenter_policy_files

  name        = "${local.name_prefix}-irsa-karpenter-${each.key}-policy"
  description = "Karpenter controller policy (upstream cloudformation.yaml, verbatim) - ${each.key}."
  policy = templatefile("${path.module}/policies/karpenter-${each.key}.json.tftpl", {
    partition              = data.aws_partition.current.partition
    region                 = data.aws_region.current.region
    account_id             = data.aws_caller_identity.current.account_id
    cluster_name           = aws_eks_cluster.this.name
    node_role_arn          = aws_iam_role.node.arn
    interruption_queue_arn = var.karpenter_interruption_queue_arn
  })

  tags = merge(var.tags, { Name = "${local.name_prefix}-irsa-karpenter-${each.key}-policy" })
}

resource "aws_iam_role_policy_attachment" "karpenter" {
  for_each = local.karpenter_policy_files

  role       = aws_iam_role.irsa["karpenter"].name
  policy_arn = aws_iam_policy.karpenter[each.key].arn
}
