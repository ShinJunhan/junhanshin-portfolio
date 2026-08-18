# project1-aws/terraform/main.tf

# ──────────────────────────────────────────────
# Pinned versions (team project standard)
# ──────────────────────────────────────────────
terraform {
  required_version = ">= 1.14.0, < 2.0.0"
  required_providers {
    aws       = { source = "hashicorp/aws", version = "~> 6.0" }
    tls       = { source = "hashicorp/tls", version = "~> 4.0" }
    local     = { source = "hashicorp/local", version = "~> 2.0" }
    tailscale = { source = "tailscale/tailscale", version = "~> 0.17" }
  }
}

# ──────────────────────────────────────────────
# 1. Network configuration
# ──────────────────────────────────────────────

provider "aws" {
  region = var.region
}

# Register the Tailscale provider (its variables must be set)
provider "tailscale" {
  api_key = var.tailscale_api_key
  tailnet = var.tailnet_name
}

locals {
  # Host name Tailscale will use for this server
  host_name = "${var.project_name}-mgmt"
}

# Generate the auth key the mgmt server uses to join automatically
resource "tailscale_tailnet_key" "ec2_join_key" {
  reusable      = true
  ephemeral     = false
  preauthorized = true
  expiry        = 3600
}

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  tags                 = { Name = "${var.project_name}-vpc" }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.project_name}-igw" }
}

data "aws_availability_zones" "available" {
  state = "available"
}

# Public Subnets
resource "aws_subnet" "public_az1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true
  tags                    = { Name = "${var.project_name}-public-az1" }
}

resource "aws_subnet" "public_az2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = true
  tags                    = { Name = "${var.project_name}-public-az2" }
}

# Private Subnets
resource "aws_subnet" "private_az1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = data.aws_availability_zones.available.names[0]
  tags              = { Name = "${var.project_name}-private-az1" }
}

resource "aws_subnet" "private_az2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.12.0/24"
  availability_zone = data.aws_availability_zones.available.names[1]
  tags              = { Name = "${var.project_name}-private-az2" }
}

# Routing
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = { Name = "${var.project_name}-public-rt" }
}

resource "aws_route_table_association" "public_az1" {
  subnet_id      = aws_subnet.public_az1.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_az2" {
  subnet_id      = aws_subnet.public_az2.id
  route_table_id = aws_route_table.public_rt.id
}

# ──────────────────────────────────────────────
# NAT instance (cost saving: NAT Gateway -> t3.micro EC2)
# Why: 78% cheaper for a learning/demo environment ($43/mo -> $9.4/mo)
# Trade-off: a single point of failure (SPOF); not suitable for production
# ──────────────────────────────────────────────

# Security group for the NAT instance
resource "aws_security_group" "nat_sg" {
  name   = "${var.project_name}-nat-sg"
  vpc_id = aws_vpc.main.id

  # For SSH administration
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all traffic inside the VPC (the core of the NAT role)
  # Pass everything arriving at the NAT from the private subnets
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.vpc_cidr]
  }

  # Arbitrary outbound traffic from the private subnets
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "${var.project_name}-nat-sg" }
}

# NAT instance EC2 (placed in a public subnet)
resource "aws_instance" "nat_ec2" {
  ami                         = var.ami_id
  instance_type               = "t3.micro"
  subnet_id                   = aws_subnet.public_az1.id
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.nat_sg.id]
  key_name                    = aws_key_pair.kp.key_name

  # Required setting for a NAT instance
  # Why: so it accepts and forwards packets not addressed to its own IP
  source_dest_check = false

  # NAT setup at boot (iptables MASQUERADE)
  user_data = <<-EOF
    #!/bin/bash
    set -eux

    # 1. Enable IP forwarding
    echo "net.ipv4.ip_forward = 1" > /etc/sysctl.d/99-nat.conf
    sysctl -p /etc/sysctl.d/99-nat.conf

    # 2. Install iptables and allow forwarding
    dnf install -y iptables iptables-services
    systemctl enable --now iptables
    iptables -P FORWARD ACCEPT
    iptables -I FORWARD -j ACCEPT

    # 3. Masquerade the internal network (10.0.0.0/16) -> internet
    iptables -t nat -A POSTROUTING -s ${var.vpc_cidr} -j MASQUERADE
    service iptables save
  EOF

  tags = { Name = "${var.project_name}-nat-instance", Role = "nat" }
}

# Private subnet route table - internet traffic goes to the NAT instance
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block           = "0.0.0.0/0"
    network_interface_id = aws_instance.nat_ec2.primary_network_interface_id
  }
  tags = { Name = "${var.project_name}-private-rt" }
}

# Associate the private subnets with the private route table
resource "aws_route_table_association" "private_az1" {
  subnet_id      = aws_subnet.private_az1.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "private_az2" {
  subnet_id      = aws_subnet.private_az2.id
  route_table_id = aws_route_table.private_rt.id
}

# ──────────────────────────────────────────────────────
# Tailscale hybrid routing (AWS -> VMware 172.16.1.0/24)
# ──────────────────────────────────────────────────────
# Send traffic from the public subnet to 172.16.1.0/24 via the aws-mgmt server
resource "aws_route" "to_onpremise_public" {
  route_table_id         = aws_route_table.public_rt.id
  destination_cidr_block = "172.16.1.0/24"
  network_interface_id   = aws_instance.mgmt.primary_network_interface_id
}

# Send traffic from the private subnet to 172.16.1.0/24 via the aws-mgmt server
resource "aws_route" "to_onpremise_private" {
  route_table_id         = aws_route_table.private_rt.id
  destination_cidr_block = "172.16.1.0/24"
  network_interface_id   = aws_instance.mgmt.primary_network_interface_id
}


# ──────────────────────────────────────────────
# 2. SSH key management
# ──────────────────────────────────────────────

resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "kp" {
  key_name   = "${var.project_name}-key"
  public_key = tls_private_key.pk.public_key_openssh
}

resource "local_file" "ssh_key" {
  filename        = "${path.module}/${var.project_name}-key.pem"
  content         = tls_private_key.pk.private_key_pem
  file_permission = "0600"
}

# Create the directory automatically if it does not exist before saving the public key
resource "terraform_data" "create_common_files_dir" {
  provisioner "local-exec" {
    command = "mkdir -p ${path.module}/../ansible/roles/common/files"
  }
}

resource "local_file" "ssh_pub_key" {
  # Saved straight to ~/project1-aws/ansible/roles/common/files
  filename        = "${path.module}/../ansible/roles/common/files/${var.project_name}-key.pem.pub"
  content         = tls_private_key.pk.public_key_openssh
  file_permission = "0644"
}

# ──────────────────────────────────────────────
# 3. Security groups (with detailed per-port notes)
# ──────────────────────────────────────────────

# Security group for the web servers
resource "aws_security_group" "web_sg" {
  name   = "${var.project_name}-web-sg"
  vpc_id = aws_vpc.main.id
  # Remote SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # HTTP web service (Nginx)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # Application server (FastAPI and the like)
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Prometheus Node Exporter (collects monitoring data)
  ingress {
    from_port   = 9100
    to_port     = 9100
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  # Nginx Exporter (collects nginx metrics)
  ingress {
    description = "Allow nginx exporter from VPC"
    from_port   = 9113
    to_port     = 9113
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-web-sg" }
}

# Security group for the mgmt server
resource "aws_security_group" "mgmt_sg" {
  name   = "${var.project_name}-mgmt-sg"
  vpc_id = aws_vpc.main.id
  # Remote SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # Prometheus web UI
  ingress {
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # Grafana dashboard
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # Alertmanager (handles alert notifications)
  ingress {
    from_port   = 9093
    to_port     = 9093
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # Loki (log collection server)
  ingress {
    from_port   = 9080
    to_port     = 9080
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }
  # Monitoring of the mgmt server itself (Node Exporter)
  ingress {
    from_port   = 9100
    to_port     = 9100
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }
  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-mgmt-sg" }
}

# Security group for the database
resource "aws_security_group" "db_sg" {
  name   = "${var.project_name}-db-sg"
  vpc_id = aws_vpc.main.id
  # PostgreSQL database access
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }
  # SSH from inside the VPC (from the web and mgmt servers)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }
  # DB server monitoring (Node Exporter)
  ingress {
    from_port   = 9100
    to_port     = 9100
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }
  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-db-sg" }
}

# ──────────────────────────────────────────────
# 4. IAM Role & Profile
# ──────────────────────────────────────────────

resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-ec2-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

# Uncomment when using S3
# resource "aws_iam_role_policy_attachment" "s3_access" {
#   role       = aws_iam_role.ec2_role.name
#   policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
# }

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}


# ──────────────────────────────────────────────
# 5. EC2 creation (includes the mgmt server Tailscale integration)
# ──────────────────────────────────────────────

resource "aws_instance" "mgmt" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public_az1.id
  vpc_security_group_ids = [aws_security_group.mgmt_sg.id]
  key_name               = aws_key_pair.kp.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  # Required: it has to accept packets from other EC2s and hand them to Tailscale
  source_dest_check = false

  # Install and configure Tailscale automatically (subnet router)
  user_data = <<-EOF
    #!/bin/bash
    exec > >(tee -a /var/log/user_data_tailscale.log) 2>&1

    # 1. Set the hostname (so Terraform can find the machine easily)
    hostnamectl set-hostname "${local.host_name}"
    echo "127.0.0.1 ${local.host_name}" >> /etc/hosts

    # 2. Wait for internet access (wait for the NAT to be ready)
    until ping -c 1 8.8.8.8 &> /dev/null; do
        sleep 5
    done

    # 3. Install Tailscale
    curl -fsSL https://tailscale.com/install.sh | sh
    systemctl enable --now tailscaled

    # 4. Enable IP forwarding
    cat <<EOT > /etc/sysctl.d/99-tailscale.conf
    net.ipv4.ip_forward = 1
    net.ipv6.conf.all.forwarding = 1
    EOT
    sysctl -p /etc/sysctl.d/99-tailscale.conf

    # 5. Join Tailscale and advertise the AWS range (10.0.0.0/16)
    # --accept-routes=true picks up the 172.16.1.0/24 range advertised by proj-mgmt (VMware).
    tailscale up --authkey=${tailscale_tailnet_key.ec2_join_key.key} \
                 --advertise-routes=${var.vpc_cidr} \
                 --accept-routes=true
  EOF
  tags      = { Name = "${var.project_name}-mgmt", Role = "management" }
}

# ──────────────────────────────────────────────
# Auto-approve the mgmt server Tailscale routes
# ──────────────────────────────────────────────
# Where Terraform finds the machine and approves the routing
data "tailscale_device" "mgmt_device" {
  hostname   = local.host_name
  wait_for   = "180s" # Wait until the device is registered with Tailscale
  depends_on = [aws_instance.mgmt]
}
# Open the route into the VPC
resource "tailscale_device_subnet_routes" "approve_vpc_routes" {
  device_id = data.tailscale_device.mgmt_device.id
  routes    = [var.vpc_cidr]
}

resource "aws_instance" "web1" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public_az1.id
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  key_name               = aws_key_pair.kp.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  tags                   = { Name = "${var.project_name}-web1", Role = "webserver" }
}

resource "aws_instance" "web2" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public_az2.id
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  key_name               = aws_key_pair.kp.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  tags                   = { Name = "${var.project_name}-web2", Role = "webserver" }
}

resource "aws_instance" "db" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.private_az1.id
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  key_name               = aws_key_pair.kp.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  tags                   = { Name = "${var.project_name}-db", Role = "database" }
}

# ──────────────────────────────────────────────
# 6. ALB configuration
# ──────────────────────────────────────────────

resource "aws_lb" "alb" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.web_sg.id]
  subnets            = [aws_subnet.public_az1.id, aws_subnet.public_az2.id]
  tags               = { Name = "${var.project_name}-alb" }
}

resource "aws_lb_target_group" "web_tg" {
  name     = "${var.project_name}-web-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 10
  }
}

resource "aws_lb_target_group_attachment" "web1" {
  target_group_arn = aws_lb_target_group.web_tg.arn
  target_id        = aws_instance.web1.id
  port             = 80
}

resource "aws_lb_target_group_attachment" "web2" {
  target_group_arn = aws_lb_target_group.web_tg.arn
  target_id        = aws_instance.web2.id
  port             = 80
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web_tg.arn
  }
}

# ──────────────────────────────────────────────
# 7. Generate and run the Ansible files automatically (keeps the course pattern)
# ──────────────────────────────────────────────

resource "local_file" "ansible_inventory" {
  filename = "${path.module}/inventory.yml"
  content = yamlencode({
    all = {
      vars = {
        # Inline the contents of group_vars/all.yml into the inventory
        # Why: Ansible runs from the terraform/ directory and cannot find ansible/group_vars/
        project_name = var.project_name
        vpc_cidr     = var.vpc_cidr
        db_name      = "appdb"
        db_user      = "appuser"
      }
      children = {
        mgmt = {
          hosts = {
            "${aws_instance.mgmt.public_ip}" = {
              ansible_user                 = "ec2-user"
              ansible_ssh_private_key_file = "./${var.project_name}-key.pem"
              private_ip                   = "${aws_instance.mgmt.private_ip}"
            }
          }
        }
        webservers = {
          hosts = {
            "${aws_instance.web1.public_ip}" = {
              ansible_user                 = "ec2-user"
              ansible_ssh_private_key_file = "./${var.project_name}-key.pem"
              private_ip                   = "${aws_instance.web1.private_ip}"
            }
            "${aws_instance.web2.public_ip}" = {
              ansible_user                 = "ec2-user"
              ansible_ssh_private_key_file = "./${var.project_name}-key.pem"
              private_ip                   = "${aws_instance.web2.private_ip}"
            }
          }
        }
        databases = {
          hosts = {
            "${aws_instance.db.private_ip}" = {
              ansible_user                 = "ec2-user"
              ansible_ssh_private_key_file = "./${var.project_name}-key.pem"
              private_ip                   = "${aws_instance.db.private_ip}"
              ansible_ssh_common_args      = "-o ProxyCommand='ssh -i ./${var.project_name}-key.pem -o StrictHostKeyChecking=no -W %h:%p ec2-user@${aws_instance.mgmt.public_ip}'"
            }
          }
        }
      }
    }
  })
}

resource "local_file" "ansible_config" {
  filename = "${path.module}/ansible.cfg"
  content  = <<-EOF
    [defaults]
    inventory         = ./inventory.yml
    host_key_checking = False
    remote_user       = ec2-user
    private_key_file  = ./${var.project_name}-key.pem
    roles_path        = ../ansible/roles
    # State the group_vars location explicitly (run from terraform/, so point one level up)
    # Why: fixes secrets.yml db_password and slack URL not being found
    inventory_plugins = ../ansible/plugins/inventory
    
    stdout_callback   = yaml

    [privilege_escalation]
    become          = True
    become_method   = sudo
    become_user     = root
    become_ask_pass = False
  EOF
}

resource "terraform_data" "wait_for_instance" {
  depends_on       = [aws_instance.mgmt, aws_instance.web1, aws_instance.web2, aws_instance.db, local_file.ansible_inventory, local_file.ansible_config]
  triggers_replace = [aws_instance.mgmt.id, aws_instance.web1.id, aws_instance.web2.id, aws_instance.db.id]
  provisioner "local-exec" { command = "sleep 60" }
}

resource "terraform_data" "ansible_run" {
  depends_on = [terraform_data.wait_for_instance]
  triggers_replace = {
    instance_ids = join(",", [aws_instance.mgmt.id, aws_instance.web1.id, aws_instance.web2.id, aws_instance.db.id])
    always_run   = timestamp()
  }
  provisioner "local-exec" {
    # Inject group_vars/*.yml explicitly with the -e option
    # Why: it runs from the terraform/ directory and cannot find ../ansible/group_vars/ automatically
    command = "ANSIBLE_SSH_PIPELINING=1 ansible-playbook -i inventory.yml -e @../ansible/group_vars/all.yml -e @../ansible/group_vars/secrets.yml ../ansible/site.yml"
  }
}
