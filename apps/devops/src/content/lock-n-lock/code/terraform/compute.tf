# =============================================================
# compute.tf — NAT instance / Bastion / App ASG(Blue·Green) / DB
# AMI: Amazon Linux 2023 (latest, looked up through an SSM parameter)
# Bastion = the Tailscale subnet router, App = Swarm node
# File location: ~/project2-security/infra/terraform/compute.tf
# =============================================================

# ── SSH keypair (generated and managed by Terraform) ──────
resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "kp" {
  key_name   = "${var.project}-key" # lb-key
  public_key = tls_private_key.pk.public_key_openssh
}

resource "local_file" "ssh_key" {
  filename        = "${path.module}/${var.project}-key.pem"
  content         = tls_private_key.pk.private_key_pem
  file_permission = "0600"
}

# ── Latest AMI (Amazon Linux 2023) ────────────────────────
data "aws_ssm_parameter" "al2023" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

# ── NAT instance (cost: a t3.micro instead of a NAT Gateway) ─
resource "aws_instance" "nat" {
  ami                         = data.aws_ssm_parameter.al2023.value # reuses AL2023
  instance_type               = var.nat_instance_type
  subnet_id                   = aws_subnet.public_subnet[0].id
  vpc_security_group_ids      = [aws_security_group.nat_sg.id]
  associate_public_ip_address = true
  source_dest_check           = false
  key_name                    = aws_key_pair.kp.key_name
  user_data_replace_on_change = true # replaces the instance automatically when user_data changes

  user_data = <<-EOF
    #!/bin/bash
    set -uxo pipefail
    exec > >(tee -a /var/log/user_data_nat.log) 2>&1

    # AL2023 ships without iptables, so install it first. iptables-services
    # is not needed.
    dnf install -y iptables

    # IP forwarding
    echo "net.ipv4.ip_forward = 1" > /etc/sysctl.d/99-nat.conf
    sysctl -p /etc/sysctl.d/99-nat.conf

    # Applied immediately on this boot. There is a single NIC, so omitting -o
    # lets the egress interface be picked automatically — ens5 or eth0, it
    # makes no difference.
    iptables -P FORWARD ACCEPT
    iptables -t nat -A POSTROUTING -s ${var.vpc_cidr} -j MASQUERADE
    iptables -t mangle -A FORWARD -p tcp -m tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu

    # Re-applied on reboot: a oneshot unit standing in for iptables-services.
    # -C || -A keeps the rule from being added twice.
    cat <<'SYSTEMD' > /etc/systemd/system/nat.service
    [Unit]
    Description=NAT Instance MASQUERADE
    After=network-online.target
    Wants=network-online.target

    [Service]
    Type=oneshot
    RemainAfterExit=yes
    ExecStart=/usr/sbin/iptables -P FORWARD ACCEPT
    ExecStart=/bin/bash -c '/usr/sbin/iptables -t nat -C POSTROUTING -s ${var.vpc_cidr} -j MASQUERADE 2>/dev/null || /usr/sbin/iptables -t nat -A POSTROUTING -s ${var.vpc_cidr} -j MASQUERADE'
    ExecStart=/usr/sbin/iptables -t mangle -A FORWARD -p tcp -m tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu

    [Install]
    WantedBy=multi-user.target
    SYSTEMD

    systemctl daemon-reload
    systemctl enable nat.service
  EOF

  tags = { Name = "${var.project}-nat" } # lb-nat
}

# Private (App) 0.0.0.0/0 → NAT instance
resource "aws_route" "app_nat" {
  route_table_id         = aws_route_table.app_rt.id
  destination_cidr_block = "0.0.0.0/0"
  network_interface_id   = aws_instance.nat.primary_network_interface_id
}

# Private (DB) 0.0.0.0/0 → NAT instance (egress only)
resource "aws_route" "db_nat" {
  route_table_id         = aws_route_table.db_rt.id
  destination_cidr_block = "0.0.0.0/0"
  network_interface_id   = aws_instance.nat.primary_network_interface_id
}

# =============================================================
# The replacement Bastion block inside compute.tf
# =============================================================

# ── Bastion (public, the Tailscale subnet router) ─────────
resource "aws_instance" "bastion" {
  ami                         = data.aws_ssm_parameter.al2023.value
  instance_type               = var.bastion_instance_type
  subnet_id                   = aws_subnet.public_subnet[0].id
  vpc_security_group_ids      = [aws_security_group.bastion_sg.id]
  associate_public_ip_address = true
  key_name                    = aws_key_pair.kp.key_name
  source_dest_check           = false # required for the subnet router to work

  user_data = <<-EOF
    #!/bin/bash
    # Create the log file and capture every line of output
    exec > >(tee -a /var/log/user_data_tailscale.log) 2>&1
    # 1. Hostname and base system settings
    hostnamectl set-hostname "${var.project}-bastion"
    
    # Wait for outbound connectivity
    until ping -c 1 8.8.8.8 &> /dev/null; do sleep 5; done
    
    # Install Tailscale and start the service
    curl -fsSL https://tailscale.com/install.sh | sh
    systemctl enable --now tailscaled
    
    # Enable IP forwarding (the kernel parameter subnet routing requires)
    cat <<EOT > /etc/sysctl.d/99-tailscale.conf
    net.ipv4.ip_forward = 1
    net.ipv6.conf.all.forwarding = 1
    EOT
    sysctl -p /etc/sysctl.d/99-tailscale.conf
    
    # Join the tailnet and advertise the AWS VPC route
    tailscale up --authkey=${tailscale_tailnet_key.ec2_join.key} \
      --advertise-routes=${var.vpc_cidr} --accept-routes \
      --hostname=${var.project}-bastion
      
    # Install Docker Engine
    dnf install -y docker && systemctl enable --now docker
  EOF

  tags = { Name = "${var.project}-bastion" }
}

# ── App launch template (the shared Blue/Green base) ──────
resource "aws_launch_template" "app" {
  name_prefix = "${var.project}-app-"
  # Left empty, this takes the latest AL2023 from SSM (the shared default).
  # Set app_ami_id and it takes a Packer AMI instead — optional, and only to
  # speed the demo up.
  image_id      = var.app_ami_id != "" ? var.app_ami_id : data.aws_ssm_parameter.al2023.value
  instance_type = var.app_instance_type
  key_name      = aws_key_pair.kp.key_name

  vpc_security_group_ids = [aws_security_group.app_sg.id]

  # On boot the App EC2 joins Tailscale, installs Docker, pulls the deploy
  # script out of the bootstrap image and runs it — no separate deploy step.
  user_data = base64encode(templatefile("${path.module}/user_data_app.sh", {
    project         = var.project
    app_join_key    = tailscale_tailnet_key.app_join.key
    docker_user     = var.docker_user
    db_host_main    = aws_instance.db.private_ip
    db_host_replica = var.db_host_replica
    loki_host       = var.db_host_replica
}))

  tag_specifications {
    resource_type = "instance"
    tags          = { Name = "${var.project}-app" }
  }

  lifecycle {
    create_before_destroy = true
  }
}

# ── App ASG : Blue ────────────────────────────────────────
resource "aws_autoscaling_group" "blue" {
  name                      = "${var.project}-asg-blue"
  min_size                  = var.asg_min
  max_size                  = var.asg_max
  desired_capacity          = var.asg_desired
  vpc_zone_identifier       = aws_subnet.app_subnet[*].id
  target_group_arns         = [aws_lb_target_group.blue.arn]
  health_check_type         = "EC2"
  health_check_grace_period = 300 # room for a replacement instance to boot; 300s for the demo

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Color"
    value               = "blue"
    propagate_at_launch = true
  }

  depends_on = [aws_route.app_nat]
}

# ── App ASG: Green (desired=0 at first, scaled up at cutover) ─
resource "aws_autoscaling_group" "green" {
  name                      = "${var.project}-asg-green"
  min_size                  = 0
  max_size                  = var.asg_max
  desired_capacity          = 0
  vpc_zone_identifier       = aws_subnet.app_subnet[*].id
  target_group_arns         = [aws_lb_target_group.green.arn]
  health_check_type         = "EC2"
  health_check_grace_period = 300 # gives the first container time to come up
  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Color"
    value               = "green"
    propagate_at_launch = true
  }

  depends_on = [aws_route.app_nat]
}

# ── DB EC2 (the PostgreSQL container host) ────────────────
resource "aws_instance" "db" {
  ami                    = data.aws_ssm_parameter.al2023.value
  instance_type          = var.db_instance_type
  subnet_id              = aws_subnet.db_subnet[0].id
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  key_name               = aws_key_pair.kp.key_name
  iam_instance_profile   = aws_iam_instance_profile.db.name

  user_data = <<-EOF
    #!/bin/bash
    exec > >(tee -a /var/log/user_data_tailscale.log) 2>&1
    # 1. Hostname and base system settings
    hostnamectl set-hostname "${var.project}-db"
    until ping -c 1 8.8.8.8 &> /dev/null; do sleep 5; done
    curl -fsSL https://tailscale.com/install.sh | sh
    systemctl enable --now tailscaled
    tailscale up --authkey=${tailscale_tailnet_key.ec2_join.key} \
      --accept-routes=false --hostname=${var.project}-db
    dnf install -y docker && systemctl enable --now docker
  EOF

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    encrypted   = true
  }

  tags = { Name = "${var.project}-db" }

  depends_on = [aws_route.db_nat]
}