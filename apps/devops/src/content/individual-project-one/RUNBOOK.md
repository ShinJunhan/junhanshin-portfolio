# Runbook: Hybrid Cloud Infrastructure

Operating instructions for the running system. Every section is written to be
followed under pressure: what to check, what to run, what the correct output
looks like, and what to do when it isn't.

Alerts reach three places. Slack `#all-mindmug` and the Telegram bridge both
receive every severity. The recovery webhook receives critical alerts only, and
posts its result back to Slack. If you are reading this because something
paged you, Slack alone tells you what broke and whether the system already
fixed it.

One thing to establish before anything else: **is this the on-premises
environment or an AWS one?** The AWS environment is destroyed at the end of
every pipeline run. A host that is unreachable there is very often a host that
no longer exists.

---

## 1. Confirm the system is healthy

Run from the management node.

```bash
./chaos/inject.sh status
```

Expected output: `active` for HAProxy, Prometheus, Grafana, Alertmanager and
the recovery service on the management node, `running` for the FastAPI
container on both web hosts, and `active` for Nginx on both and for PostgreSQL.

Check the pieces individually if any line disagrees:

```bash
# Ansible can reach every managed host
ansible all -i inventory/hosts.ini -m ping

# The recovery webhook is up
curl -s localhost:9080/health

# Prometheus has every target UP, expect 7
curl -s localhost:9090/api/v1/targets | grep -c '"health":"up"'

# The application answers through HAProxy, which is what the ALB also measures
curl -s http://192.168.61.133/health
```

A healthy `/health` reports `"status":"ok"`, `"database":"connected"` and the
hostname of whichever web server answered. Run it repeatedly and the hostname
should alternate. If it does not, HAProxy has taken one backend out of
rotation; check `http://192.168.61.133:8404/stats`.

`"database":"disconnected"` with `"status":"ok"` is deliberate. The application
reports itself up so the load balancer keeps it in rotation, and names the
database as the failed dependency. Do not read that as a healthy system.

On AWS, use the ALB instead:

```bash
curl -s http://$(terraform -chdir=terraform output -raw alb_dns_name)/health
```

---

## 2. Deploy or redeploy

On-premises, one command, and the play order inside it matters.

```bash
cd ~/project1-onpremise
ansible-playbook playbooks/site.yml --syntax-check   # always, before an apply
ansible-playbook playbooks/site.yml
```

On AWS, Terraform first, then Ansible. The inventory is generated from
Terraform output, so running them out of order configures the previous set of
instances.

```bash
./deploy_aws.sh plan     # review before every apply, with no exceptions
./deploy_aws.sh          # apply, generate the inventory, wait for SSH, configure
```

`terraform.tfvars` is gitignored. The Tailscale auth key, the Slack webhook URL
and the admin CIDR are passed in at apply time and are never committed.

To rebuild one part without touching the rest:

```bash
ansible-playbook playbooks/db.yml                # PostgreSQL only
ansible-playbook playbooks/docker_web.yml        # the container and Nginx
ansible-playbook playbooks/monitoring.yml        # Prometheus, Grafana, Alertmanager
ansible-playbook playbooks/recovery_service.yml  # the webhook
```

After changing `alert.rules.yml` or `prometheus.yml`, validate before
restarting. `prometheus_connect.yml` runs `promtool check config` and
`promtool check rules`, restarts both services, and waits for each to report
healthy.

```bash
ansible-playbook playbooks/prometheus_connect.yml
```

A second full run should report `changed=0` everywhere except `nginx_selfheal`,
which kills Nginx on purpose to prove the drop-in works. That role is expected
to report changes on every run.

---

## 3. When an alert fires

Which mechanism handles it depends on what broke.

**Nginx is not in the alert pipeline at all.** It carries a `Restart=always`
drop-in with `RestartSec=5s`, so systemd restarts it in about five seconds and
no alert is ever raised. If Nginx is down for longer than that, the drop-in is
missing. Check it before looking anywhere else:

```bash
systemctl show nginx --property=Restart   # expect Restart=always
```

**Everything else goes through Prometheus.** Do not intervene for the first
minute. Manual action during recovery competes with the webhook and makes the
outcome harder to read.

What happens automatically:

1. Prometheus evaluates the rule and fires after its `for` window.
2. Alertmanager waits `group_wait: 5s`, then posts to Slack and Telegram.
3. If the alert is `critical`, Alertmanager also webhooks the recovery service
   on port 9080.
4. The webhook looks up `alertname` in `RECOVERY_MAP` and `job` in `HOST_MAP`.
   Both have to match.
5. It runs `sudo systemctl restart <service>` over SSH, then posts the result
   to Slack and writes it to `/var/log/recovery.log`.

Current rules, from `monitoring/alert.rules.yml`:

| Alert | Fires when | For | Severity | Recovered automatically |
| --- | --- | --- | --- | --- |
| `FastAPIDown` | `up{job=~"fastapi-.*"} == 0` | 30s | critical | Yes, restarts `fastapi` |
| `NodeDown` | `up{job=~"node-.*"} == 0` | 1m | critical | Yes, restarts `node_exporter` |
| `HighCPU` | CPU above 40% | 1m | warning | No, notification only |
| `HighMemory` | memory above 85% | 3m | warning | No, notification only |

A warning notifies and does nothing else. That is intended. Neither high CPU
nor high memory has a safe automatic fix in this environment, so both go to a
person.

Alertmanager repeats an unresolved alert every `5m`. A message arriving five
minutes after the first one is a repeat, not a second failure.

---

## 4. When recovery fails

Slack reports the failure with the service and host it was trying to fix. Take
over at that point.

```bash
# What the webhook actually did
sudo tail -50 /var/log/recovery.log

# Whether the webhook is even running
sudo systemctl status recovery --no-pager
curl -s localhost:9080/health

# The state of the service it was trying to fix
ansible rocky -i inventory/hosts.ini -m shell -a 'systemctl status fastapi' -b
```

Then recover by hand:

```bash
# The container, on either web host
ssh 192.168.61.134 "sudo docker start fastapi"

# Or put everything back at once
./chaos/inject.sh all
```

If the service starts by hand but not through the webhook, the fault is in SSH
or in permissions, not in the service. The webhook runs as `user1` and reaches
the target with the key at `/home/user1/.ssh/teamproj01ansiblekey.pem`. Confirm
that key is `0600` and owned by `user1`, and that `user1` has passwordless
sudo on the target.

An alert that keeps firing with no recovery attempt in the log is usually one
of two things. Either the alert is a `warning`, which is never routed to the
webhook, or the `job` label does not appear in `HOST_MAP`. The log records the
second case explicitly as an unknown alert needing manual attention.

---

## 5. Test the recovery path

Never wait for a real failure to find out whether recovery works. Inject one.

```bash
./chaos/inject.sh fastapi1     # expect FastAPIDown within 30s, then a restart
./chaos/inject.sh nginx1       # expect systemd back in ~5s and no alert at all
./chaos/inject.sh db           # expect the app to report database disconnected
./chaos/inject.sh cpu1         # expect HighCPU within 1-2 minutes, notify only
./chaos/inject.sh haproxy      # expect the service to become unreachable
```

Watch Slack for detection and for the result. A `FastAPIDown` scenario should
close on its own. Put everything back afterwards:

```bash
./chaos/inject.sh all
./chaos/inject.sh status
```

Run the on-premises environment first. It carries the same four-server layout,
so a scenario that fails there fails for a reason that has nothing to do with
AWS. Add `--aws` to run the same scenario against the cloud environment.

Run every scenario after any change to the alert rules, the Alertmanager
routing, or the webhook.

---

## 6. Hybrid networking

The two environments are joined over Tailscale, and the CI runner joins the
same tailnet with an OAuth key. When Prometheus cannot scrape across
environments, or when Ansible cannot reach an AWS host, check the tunnel before
checking anything else.

```bash
tailscale status
tailscale ip -4
tailscale ping <hostname>
```

The management node and the application nodes are enrolled differently, and the
difference matters:

- `aws-mgmt` advertises the VPC CIDR and does **not** accept routes. Adding
  `--accept-routes` there creates a routing loop, because the node would accept
  the very routes it is advertising.
- The application nodes accept routes and advertise nothing.

Re-enroll a host that has dropped off:

```bash
sudo tailscale up --authkey <key> --advertise-tags=tag:project1-ec2 \
  --accept-routes --accept-dns=false --hostname <name>
```

An auth key expires. A host that was fine last week and is unreachable today
with no other change is almost always an expired key.

On a fresh AWS environment, addresses take a few minutes to appear. The
bootstrap script installs Tailscale from `user_data`, so an instance that
answers SSH is not necessarily on the tailnet yet. Read the log:

```bash
sudo tail -40 /var/log/bootstrap.log
```

---

## 7. Known traps

- **The fleet is arm64.** Every binary download switches on
  `ansible_architecture`. A role that hardcodes `amd64` installs a binary that
  will not execute, and the error names the file rather than the architecture.
- **`prometheus_bot` has no arm64 image.** Its role installs Go and compiles the
  binary from source. That step is slow and it is not broken.
- **SELinux blocks the reverse proxy.** Nginx returns 502 proxying to the
  container until `httpd_can_network_connect` is on. Nothing in the Nginx config
  hints at this. The `nginx` role sets the boolean.
- **Facts are not always gathered.** The `cloudflared` and `monitoring` roles
  call `setup` explicitly before using `ansible_architecture`, because the play
  reaches them without it.
- **PostgreSQL's config path is found, not assumed.** The role locates
  `postgresql.conf` with `find`. Hardcoding a version number breaks on the next
  release.
- **Port 8000 gets held.** The container role runs `fuser -k 8000/tcp` before
  starting, because the retired systemd unit used the same port and a stale
  process blocks the container silently.
- **Never commit a token.** The Telegram token, the chat ID and the Slack
  webhook URL belong in Ansible variables and GitHub Actions secrets. Treat any
  that reached a commit as burned and rotate it.
- **`--check` is not meaningful for this playbook.** Several roles use `shell`
  and `command`, which report nothing useful in check mode. Use
  `--syntax-check` for a safety net and a real run for the truth.

---

## 8. Tear down

The AWS environment is expected to be destroyed after every session, and the
pipeline already does it with `if: always()`. To do it by hand:

```bash
./deploy_aws.sh destroy
```

Confirm the plan lists only this project's resources before approving. The NAT
gateway and its Elastic IP are the two that bill continuously whether or not
anything is routed through them, so confirm both are in the list.

`deploy_aws.sh destroy` also clears `inventory/hosts_aws.ini`, so stale
addresses cannot be used against an environment that no longer exists.

The on-premises environment is persistent and is not torn down.
