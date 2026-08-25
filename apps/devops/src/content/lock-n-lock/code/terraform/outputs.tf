# =============================================================
# outputs.tf — the interface to the other tracks
#              (Track E's "what A has to hand us")
# File location: ~/project2-security/infra/terraform/outputs.tf
# =============================================================

output "alb_dns_name" {
  description = "ALB DNS (B·C·E: service access / deployment verification)"
  value       = aws_lb.web_alb.dns_name
}

output "service_domain" {
  description = "Service domain (when enable_https = true)"
  value       = var.enable_https ? var.domain_name : "N/A (HTTP only)"
}

output "tg_blue_arn" {
  description = "Blue target group ARN (C·E: rollback cutover)"
  value       = aws_lb_target_group.blue.arn
}

output "tg_green_arn" {
  description = "Green target group ARN (C·E: cutover on a successful deploy)"
  value       = aws_lb_target_group.green.arn
}

output "bastion_public_ip" {
  description = "Bastion public IP (the SSH gateway)"
  value       = aws_instance.bastion.public_ip
}

output "bastion_private_ip" {
  description = "Bastion private IP"
  value       = aws_instance.bastion.private_ip
}

output "db_private_ip" {
  description = "DB EC2 private IP (B·D)"
  value       = aws_instance.db.private_ip
}

output "nat_public_ip" {
  description = "NAT instance public IP"
  value       = aws_instance.nat.public_ip
}

output "sg_ids" {
  description = "Security group IDs, collected (referenced by every track)"
  value = {
    alb     = aws_security_group.alb_sg.id
    app     = aws_security_group.app_sg.id
    db      = aws_security_group.db_sg.id
    bastion = aws_security_group.bastion_sg.id
    nat     = aws_security_group.nat_sg.id
  }
}

output "asg_names" {
  description = "Blue/Green ASG names (C: the deployment targets)"
  value = {
    blue  = aws_autoscaling_group.blue.name
    green = aws_autoscaling_group.green.name
  }
}

# bastion_ts_ip: assigned dynamically once the node joins Tailscale, so it is
# read on the bastion after apply. Terraform cannot capture it, so there is no
# output for it here — see bootstrap_tailscale.sh.

output "db_backup_bucket" {
  description = "S3 bucket for pg_dump backups (used by the DB backup script)"
  value       = aws_s3_bucket.db_backup.bucket
}

output "alerts_sns_arn" {
  description = "SNS topic ARN for CloudWatch alarms (D: alert integration)"
  value       = aws_sns_topic.alerts.arn
}

output "grafana_cw_access_key_id" {
  description = "Access key ID for the Grafana CloudWatch datasource (handed to D)"
  value       = aws_iam_access_key.grafana_cw.id
}

output "grafana_cw_secret_access_key" {
  description = "Secret for the Grafana CloudWatch datasource (handed to D) — read it with terraform output -raw"
  value       = aws_iam_access_key.grafana_cw.secret
  sensitive   = true
}

output "db_tailscale_ip" {
  description = "DB Tailscale IP (the proj-mgmt replica replicates from this 100.x:5432)"
  value       = data.tailscale_device.db_device.addresses
}
