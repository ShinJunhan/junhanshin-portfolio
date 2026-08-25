# =============================================================
# network.tf — VPC / subnets (multi-AZ) / IGW / routing
# The private 0.0.0.0/0 → NAT instance route is added in compute.tf
# File location: ~/project2-security/infra/terraform/network.tf
# =============================================================

locals {
  # Take the trailing letter of the AZ: "ap-northeast-2a" → "a"
  az_suffix = [for az in var.azs : replace(az, var.aws_region, "")]
}

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = { Name = "${var.project}-vpc" } # lb-vpc
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.project}-igw" } # lb-igw
}

# --- Subnets ---
resource "aws_subnet" "public_subnet" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.azs[count.index]
  map_public_ip_on_launch = true

  tags = { # lb-public-a / lb-public-c
    Name = "${var.project}-public-${local.az_suffix[count.index]}"
    Tier = "public"
  }
}

resource "aws_subnet" "app_subnet" {
  count             = length(var.app_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.app_subnet_cidrs[count.index]
  availability_zone = var.azs[count.index]

  tags = { # lb-app-a / lb-app-c
    Name = "${var.project}-app-${local.az_suffix[count.index]}"
    Tier = "app"
  }
}

resource "aws_subnet" "db_subnet" {
  count             = length(var.db_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.db_subnet_cidrs[count.index]
  availability_zone = var.azs[count.index]

  tags = { # lb-db-a
    Name = "${var.project}-db-${local.az_suffix[count.index]}"
    Tier = "db"
  }
}

# --- Public routing (IGW) ---
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = { Name = "${var.project}-public-rt" } # lb-public-rt
}

resource "aws_route_table_association" "public_assoc" {
  count          = length(aws_subnet.public_subnet)
  subnet_id      = aws_subnet.public_subnet[count.index].id
  route_table_id = aws_route_table.public_rt.id
}

# --- Private (App) routing: out through the NAT instance ---
# The 0.0.0.0/0 → NAT route is added in compute.tf as an aws_route, once the
# NAT instance exists.
resource "aws_route_table" "app_rt" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.project}-app-rt" } # lb-app-rt
}

resource "aws_route_table_association" "app_assoc" {
  count          = length(aws_subnet.app_subnet)
  subnet_id      = aws_subnet.app_subnet[count.index].id
  route_table_id = aws_route_table.app_rt.id
}

# --- Private (DB) routing ---
# No inbound internet at all (security isolation). Outbound only, through the
# db_nat route in compute.tf (egress-only).
# App→DB traffic uses the VPC's built-in local route plus the security group
# rule (5432 ← App).
resource "aws_route_table" "db_rt" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.project}-db-rt" } # lb-db-rt
}

resource "aws_route_table_association" "db_assoc" {
  count          = length(aws_subnet.db_subnet)
  subnet_id      = aws_subnet.db_subnet[count.index].id
  route_table_id = aws_route_table.db_rt.id
}
