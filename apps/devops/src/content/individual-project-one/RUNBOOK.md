# Runbook: Hybrid Cloud Infrastructure

This runbook explains how to operate the running system. Each section covers what to check, what to run, what the correct output looks like, and what to do when the output is wrong.

Alerts reach three places. Slack `#all-mindmug` and the Telegram bridge both receive every severity. The recovery webhook receives critical alerts only and posts its result back to Slack. Slack alone shows what broke and whether the system already fixed it.

Before anything else, confirm **which environment is affected: on-premises or AWS.** The AWS environment is destroyed at the end of every pipeline run, and an unreachable AWS host often no longer exists.

---

## 1. Confirm the system is healthy

Run from the management node.

```bash
./chaos/inject.sh status
```

Expected output: `active` for HAProxy, Prometheus, Grafana, Alertmanager, and the recovery service on the management node, `running` for the FastAPI container on both web hosts, and `active` for Nginx on both web hosts and for PostgreSQL.

Check the pieces one at a time if any line disagrees:

```bash
# Ansible can reach every managed host
ansible all -i inventory/hosts.ini -m ping

# The recovery webhook is up
curl -s localhost:9080/health

# Prometheus has every target UP, expect 7
curl -s localhost:9090/api/v1/targets | grep -c '"health":"up"'

# The application answers through HAProxy
curl -s http://192.168.61.133/health
```

A healthy `/health` reports `"status":"ok"`, `"database":"connected"`, and the hostname of the answering web server. Run it repeatedly, and the hostname should alternate. If it stays the same, HAProxy took one backend out of rotation. Check `http://192.168.61.133:8404/stats`.

`"database":"disconnected"` with `"status":"ok"` is intended. The application reports itself up to stay in rotation and names the database as the failed dependency. Treat this response as a failure.

On AWS, check the ALB instead:

```bash
curl -s http://$(terraform -chdir=terraform output -raw alb_dns_name)/health
```

---

## 2. Deploy or redeploy

On-premises, one command runs the whole build, and the play order inside it matters.

```bash
cd ~/project1-onpremise
ansible-playbook playbooks/site.yml --syntax-check   # always, before an apply
ansible-playbook playbooks/site.yml
```

On AWS, Terraform runs first and Ansible second. The inventory is generated from Terraform output, and running them out of order configures the previous set of instances.

```bash
./deploy_aws.sh plan     # review before every apply
./deploy_aws.sh          # apply, generate the inventory, wait for SSH, configure
```

`terraform.tfvars` is gitignored. The Tailscale auth key, the Slack webhook URL, and the admin CIDR are passed in at apply time and never committed.

To rebuild one part without touching the rest:

```bash
ansible-playbook playbooks/db.yml                # PostgreSQL only
ansible-playbook playbooks/docker_web.yml        # the container and Nginx
ansible-playbook playbooks/monitoring.yml        # Prometheus, Grafana, Alertmanager
ansible-playbook playbooks/recovery_service.yml  # the webhook
```

After changing `alert.rules.yml` or `prometheus.yml`, validate before restarting. `prometheus_connect.yml` runs `promtool check config` and `promtool check rules`, restarts both services, and waits for each to report healthy.

```bash
ansible-playbook playbooks/prometheus_connect.yml
```

A second full run should report `changed=0` everywhere except `nginx_selfheal`. That role kills Nginx on purpose to prove the drop-in works, and it reports changes on every run.

---

## 3. When an alert fires

The failure decides which mechanism responds.

**Nginx stays outside the alert pipeline.** Its `Restart=always` drop-in with `RestartSec=5s` lets systemd restart it in about five seconds, and no alert is raised. If Nginx stays down any longer, the drop-in is missing. Check it first:

```bash
systemctl show nginx --property=Restart   # expect Restart=always
```

**Everything else goes through Prometheus.** Wait one minute before stepping in. Manual action during recovery competes with the webhook and makes the result harder to read.

What happens automatically:

1. Prometheus evaluates the rule and fires after its `for` window.
2. Alertmanager waits `group_wait: 5s` and posts to Slack and Telegram.
3. For a `critical` alert, Alertmanager also calls the recovery webhook on port 9080.
4. The webhook looks up `alertname` in `RECOVERY_MAP` and `job` in `HOST_MAP`. Both must match.
5. It runs the mapped command over SSH with `sudo`, posts the result to Slack, and writes it to `/var/log/recovery.log`.

The current rules come from `monitoring/alert.rules.yml`:

| Alert | Fires when | For | Severity | Recovered automatically |
| --- | --- | --- | --- | --- |
| `FastAPIDown` | `up{job=~"fastapi-.*"} == 0` | 30s | critical | Yes (`docker restart fastapi`) |
| `NodeDown` | `up{job=~"node-.*"} == 0` | 1m | critical | Yes (`systemctl restart node_exporter`) |
| `HighCPU` | CPU above 40% | 1m | warning | No (notification only) |
| `HighMemory` | memory above 85% | 3m | warning | No (notification only) |

A warning sends a notification and nothing else. No safe automatic fix exists for high CPU or high memory in this environment, and both go to a person.

Alertmanager repeats an unresolved alert every `5m`. A message five minutes after the first one is a repeat of the same failure.

---

## 4. When recovery fails

Slack reports the failure with the service and host involved. Take over from there.

```bash
# What the webhook actually did
sudo tail -50 /var/log/recovery.log

# Whether the webhook is running
sudo systemctl status recovery --no-pager
curl -s localhost:9080/health

# The state of the container it tried to restart
ansible rocky -i inventory/hosts.ini -m shell -a 'docker ps -a --filter name=fastapi' -b
```

Then recover by hand:

```bash
# The container, on either web host
ssh 192.168.61.134 "sudo docker start fastapi"

# Or put everything back at once
./chaos/inject.sh all
```

If the service starts by hand and fails through the webhook, the fault is in SSH or in permissions. The webhook runs as `user1` and reaches the target with the key at `/home/user1/.ssh/teamproj01ansiblekey.pem`. Confirm the key is `0600` and owned by `user1`. Also confirm `user1` can run sudo without a password on the target.

A repeating alert with no recovery attempt in the log usually comes from one of two causes. Either the alert is a `warning` and never reaches the webhook, or its `job` label is missing from `HOST_MAP`. The log records the second case as an unknown alert for a manual check.

---

## 5. Test the recovery path

Test recovery on purpose before a real failure does it.

```bash
./chaos/inject.sh fastapi1     # expect FastAPIDown within 30s and a restart
./chaos/inject.sh nginx1       # expect systemd back in ~5s and no alert
./chaos/inject.sh db           # expect the app to report the database disconnected
./chaos/inject.sh cpu1         # expect HighCPU within 1-2 minutes, notification only
./chaos/inject.sh haproxy      # expect the service to become unreachable
```

Watch Slack for the alert and the result. A `FastAPIDown` scenario closes on its own. Put everything back afterwards:

```bash
./chaos/inject.sh all
./chaos/inject.sh status
```

Start with the on-premises environment. It carries the same four-server layout, and a failure there points to a cause unrelated to AWS. Add `--aws` to point the script at the AWS inventory.

Run every scenario after any change to the alert rules, the Alertmanager routing, or the webhook.

---

## 6. Hybrid networking

Tailscale connects the management node and the AWS hosts, and the CI runner joins the same tailnet with an OAuth key. When Ansible cannot reach an AWS host, check the tunnel first.

```bash
tailscale status
tailscale ip -4
tailscale ping <hostname>
```

The management node and the application nodes are enrolled differently:

- `aws-mgmt` advertises the VPC CIDR and does **not** accept routes. Adding `--accept-routes` there creates a routing loop. The node would accept the same routes it advertises.
- The application nodes accept routes and advertise nothing.

To re-enroll a disconnected host:

```bash
sudo tailscale up --authkey <key> --advertise-tags=tag:project1-ec2 \
  --accept-routes --accept-dns=false --hostname <name>
```

Auth keys expire. If a working host becomes unreachable with no other change, it may need a fresh key.

On a fresh AWS environment, Tailscale addresses take a few minutes to appear. The bootstrap script installs Tailscale from `user_data`, and an instance answering SSH may not be on the tailnet yet. Read the log:

```bash
sudo tail -40 /var/log/bootstrap.log
```

---

## 7. Known traps

- **The fleet is arm64.** Every binary download switches on `ansible_architecture`. A role hardcoding `amd64` installs an unusable binary, and the error names the file instead of the architecture.
- **`prometheus_bot` ships no arm64 image.** Its role installs Go and compiles the bot from source. That step is slow, and it is working.
- **SELinux blocks the reverse proxy.** Nginx returns 502 when proxying to the container until `httpd_can_network_connect` is on. Nothing in the Nginx config hints at it. The `nginx` role sets the boolean.
- **Facts are not always gathered.** The `cloudflared` and `monitoring` roles call `setup` explicitly before using `ansible_architecture`.
- **PostgreSQL's config path is found with `find`.** A hardcoded version number breaks on the next release.
- **Port 8000 can stay held.** The container role runs `fuser -k 8000/tcp` before starting. The retired systemd unit used the same port, and a stale process blocks the container without an error.
- **Never commit a token.** The Telegram token, the chat ID, and the Slack webhook URL belong in Ansible variables and GitHub Actions secrets. Treat any committed secret as exposed and rotate it.
- **`--check` tells little for this playbook.** Several roles use `shell` and `command`. Those modules report nothing useful in check mode. Use `--syntax-check` as the safety net and a real run for the result.

---

## 8. Tear down

The AWS environment should be destroyed after every session, and the pipeline does it with `if: always()`. To do it by hand:

```bash
./deploy_aws.sh destroy
```

The script runs `terraform destroy -auto-approve` and does not ask for confirmation. Run `terraform -chdir=terraform state list` beforehand to confirm the state holds only this project's resources. The NAT gateway and its Elastic IP bill every hour they exist, and both must be gone afterwards.

`deploy_aws.sh destroy` also overwrites `inventory/hosts_aws.ini`, and stale addresses cannot be used against a destroyed environment.

The on-premises environment is persistent and stays up.
