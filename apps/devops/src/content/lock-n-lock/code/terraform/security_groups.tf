# ================================================================
# security_groups.tf — one group per tier (least privilege)
# ALB → App → DB in one direction only; Bastion is the SSH gateway,
# NAT carries the App tier's outbound traffic.
# The app ships as a bootstrap image run with docker run on the lb-net
# bridge — no Compose, no Swarm.
# File location: ~/project2-security/infra/terraform/security_groups.tf
# ================================================================

# ── ALB SG: internet → 80/443 ─────────────────────────────
resource "aws_security_group" "alb_sg" {
  name        = "${var.project}-alb-sg"
  description = "ALB ingress 80/443 from internet"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  dynamic "ingress" {
    for_each = var.enable_https ? [1] : []
    content {
      description = "HTTPS"
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project}-alb-sg" } # lb-alb-sg
}

# ── Bastion SG: admin IP → SSH ────────────────────────────
resource "aws_security_group" "bastion_sg" {
  name        = "${var.project}-bastion-sg"
  description = "Bastion SSH from admin"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH from admin"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_ingress_cidr]
  }

  # Tailscale needs no inbound port opened: it traverses NAT on outbound
  # UDP/443.
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project}-bastion-sg" } # lb-bastion-sg
}

# ── App SG: ALB → 80, Bastion → SSH ──
resource "aws_security_group" "app_sg" {
  name        = "${var.project}-app-sg"
  description = "App tier: from ALB, Bastion"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  ingress {
    description     = "SSH from Bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project}-app-sg" } # lb-app-sg
}

# ── DB SG: App → 5432, Bastion → SSH ──
resource "aws_security_group" "db_sg" {
  name        = "${var.project}-db-sg"
  description = "DB tier: PostgreSQL from App only"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from App"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }

  ingress {
    description     = "SSH from Bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project}-db-sg" } # lb-db-sg
}

# ── NAT instance SG: relays the App subnets out to the internet ───
resource "aws_security_group" "nat_sg" {
  name        = "${var.project}-nat-sg"
  description = "NAT instance: forward private subnet egress"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "from app subnets"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    # The egress path for the DB's S3 backups and package updates
    cidr_blocks = concat(var.app_subnet_cidrs, var.db_subnet_cidrs)
  }

  ingress {
    description     = "SSH from Bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project}-nat-sg" } # lb-nat-sg
}