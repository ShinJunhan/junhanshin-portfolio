# storage module - glue.tf
# For OpenCost Cloud Costs (Level 2) to query the CUR parquet files through
# Athena, the Glue data catalog has to know those files as a table. A Glue
# crawler scans S3, infers the schema, and fills the catalog in.
#
# When AWS creates a CUR definition it also drops a CloudFormation template
# meant for the console and the docs (crawler-cfn.yml) into the CUR bucket
# (convention §5-9). This file is that template's core resources — database,
# crawler, crawler IAM role — moved into Terraform. The two Lambdas the
# template carries (re-run the crawler on an S3 event, and run it once at stack
# creation) are not moved: the Glue crawler's own schedule argument gives us
# periodic runs, so there is no reason to stand up two more Lambdas and their
# dedicated IAM roles (YAGNI · team decision 2026-08-18).

data "aws_partition" "current" {}
data "aws_region" "current" {}

locals {
  # A Glue/Athena database name is a Hive identifier, so it cannot contain a
  # hyphen. This is the kebab-case exception to §1's general rule — and it is
  # there because of Hive's grammar, not because of an AWS resource-name rule.
  glue_database_name = replace("${local.name_prefix}_cur", "-", "_")
}

resource "aws_glue_catalog_database" "cur" {
  name = local.glue_database_name
}

# The role the crawler assumes. This is not IRSA — the principal is the Glue
# service rather than a K8s pod (the trust policy's principal is
# glue.amazonaws.com).
data "aws_iam_policy_document" "glue_crawler_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["glue.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "glue_crawler" {
  name               = "${local.name_prefix}-glue-crawler-cur"
  assume_role_policy = data.aws_iam_policy_document.glue_crawler_assume.json

  tags = merge(var.tags, { Name = "${local.name_prefix}-glue-crawler-cur" })
}

# The AWS default template (crawler-cfn.yml) grants s3:GetObject and PutObject
# together. The crawler only reads, to infer a schema, and never writes back to
# the original CUR files — so PutObject comes out and this is narrowed to least
# privilege. If that turns out to block something (schema inference failing),
# the reason shows up in the crawler's own run log.
data "aws_iam_policy_document" "glue_crawler" {
  statement {
    sid    = "WriteCrawlerLogs"
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    # A Glue crawler's log group always appears under this prefix (fixed AWS rule).
    resources = ["arn:${data.aws_partition.current.partition}:logs:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:log-group:/aws-glue/*"]
  }

  # The inline policy in crawler-cfn.yml gives 5 actions Resource="*" and lets
  # the AWS managed policy (AWSGlueServiceRole) cover the rest — and we do not
  # attach that policy here (keeping least privilege). So the remaining actions
  # get added one at a time, each confirmed by an actual run. Every action in
  # this statement is authorised by the same catalog·database·table ARN triple
  # (per the AWS Glue fine-grained access docs) — narrowed the same way as
  # ReadGlueCatalog in irsa.tf.
  # glue:BatchGetPartition was added because a run actually failed on it
  # (2026-08-19 · AccessDeniedException). Which call needs it exactly was not
  # chased down.
  statement {
    sid    = "UpdateCurCatalog"
    effect = "Allow"
    actions = [
      "glue:UpdateDatabase",
      "glue:UpdatePartition",
      "glue:CreatePartition",
      "glue:CreateTable",
      "glue:UpdateTable",
      "glue:BatchCreatePartition",
      "glue:BatchGetPartition",
      "glue:GetDatabase",
      "glue:GetTable",
    ]
    resources = [
      "arn:${data.aws_partition.current.partition}:glue:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:catalog",
      aws_glue_catalog_database.cur.arn,
      "arn:${data.aws_partition.current.partition}:glue:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:table/${aws_glue_catalog_database.cur.name}/*",
    ]
  }

  statement {
    sid       = "ReadCurData"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.cur.arn}/${var.cur_prefix}/hailcast-dev-cur/hailcast-dev-cur*"]
  }

  # A run failed against the target path (2026-08-18 · "User does not have
  # access to target"). GetObject alone does not let the crawler enumerate the
  # objects beneath a folder — s3:ListBucket was missing. For the same reason as
  # predict's ListBucketForTrafficShards the target is the bucket itself,
  # narrowed by a condition.
  statement {
    sid       = "ListCurPrefix"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.cur.arn]

    condition {
      test     = "StringLike"
      variable = "s3:prefix"
      values   = ["${var.cur_prefix}/hailcast-dev-cur/hailcast-dev-cur*"]
    }
  }
}

resource "aws_iam_policy" "glue_crawler" {
  name        = "${local.name_prefix}-glue-crawler-cur-policy"
  description = "CUR Glue crawler role policy - write CloudWatch logs + update the catalog + read the CUR source (no writes)."
  policy      = data.aws_iam_policy_document.glue_crawler.json

  tags = merge(var.tags, { Name = "${local.name_prefix}-glue-crawler-cur-policy" })
}

resource "aws_iam_role_policy_attachment" "glue_crawler" {
  role       = aws_iam_role.glue_crawler.name
  policy_arn = aws_iam_policy.glue_crawler.arn
}

# The crawler itself. It takes a schedule argument, so no separate
# aws_glue_trigger resource is needed.
# The target path is the same actual data path crawler-cfn.yml points at
# (including the report name repeating as a folder name twice —
# cur/<report>/<report>/).
resource "aws_glue_crawler" "cur" {
  name          = "${local.name_prefix}-glue-crawler-cur"
  database_name = aws_glue_catalog_database.cur.name
  role          = aws_iam_role.glue_crawler.arn

  # Daily at 03:00 UTC (12:00 KST). The CUR refreshes once a day, and by this
  # hour the previous day's data is already in.
  schedule = "cron(0 3 * * ? *)"

  s3_target {
    path = "s3://${aws_s3_bucket.cur.id}/${var.cur_prefix}/hailcast-dev-cur/hailcast-dev-cur"
    # The same exclusion list as the AWS default template — the companion files
    # that are not data files (parquet) stay out of schema inference.
    exclusions = ["**.json", "**.yml", "**.sql", "**.csv", "**.gz", "**.zip"]
  }

  schema_change_policy {
    update_behavior = "UPDATE_IN_DATABASE"
    delete_behavior = "DELETE_FROM_DATABASE"
  }

  tags = merge(var.tags, { Name = "${local.name_prefix}-glue-crawler-cur" })
}

# The status table AWS creates automatically alongside a CUR definition. The
# crawler cannot make it — it is not a schema-inference target but a fixed
# schema the CUR delivery service manages itself. Which is also why
# crawler-cfn.yml defines this table by hand, separately from the crawler.
resource "aws_glue_catalog_table" "cur_status" {
  name          = "cost_and_usage_data_status"
  database_name = aws_glue_catalog_database.cur.name

  table_type = "EXTERNAL_TABLE"

  storage_descriptor {
    location      = "s3://${aws_s3_bucket.cur.id}/${var.cur_prefix}/hailcast-dev-cur/cost_and_usage_data_status/"
    input_format  = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat"
    output_format = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat"

    ser_de_info {
      serialization_library = "org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe"
    }

    columns {
      name = "status"
      type = "string"
    }
  }
}
