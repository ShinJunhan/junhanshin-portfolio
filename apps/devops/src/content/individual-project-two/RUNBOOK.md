# Runbook: ShimonVault Operations Platform

Operating instructions for the running system. Every section is written to be
followed under pressure: what to check, what to run, what the correct output
looks like, and what to do when it isn't.

Alerts reach you on two independent paths. Anything Prometheus sees arrives
through Alertmanager, which fans out to Slack and to a Telegram relay.
Anything the application itself detects, a burst of failed logins, an account
hitting the access-control wall, a bulk download, calls `notify_all()` directly
and reaches the same two channels without passing through Prometheus at all.
The wording of the message tells you which path fired: Alertmanager messages
carry an instance label, application messages carry an IP and a timestamp.

Two things to know before anything else.

**Nothing in this system recovers itself.** There is no recovery controller and
no alert-to-action map. Docker Swarm restarts a crashed container up to five
times and that is the entire extent of the automation. Every alert in this
document ends at a human. If you are reading this because your phone buzzed,
you are the recovery mechanism.

**A green ALB target does not mean a working application.** `/health` returns
HTTP 200 from the moment the process starts, before the database is reachable,
and the load balancer only reads the status code. The truth is in the body.
Always read the `db` field.

---

## 1. Confirm the system is healthy

Start here, from proj-mgmt.

```bash
curl -s http://<alb-dns>/health | python3 -m json.tool
```

The only fully healthy answer:

```json
{
  "status": "healthy",
  "version": "0.1.0",
  "project": "shimonvault",
  "environment": "production",
  "db": "ok"
}
```

The `db` field is the one that matters:

| `db` value | Means | Action |
| --- | --- | --- |
| `ok` | schema created, connections working | nothing |
| `initialising` | background thread still retrying | wait, normal for 1 to 3 minutes after a boot |
| `error: ...` | the retry loop gave up or is failing | section 4 |

`initialising` for more than five minutes is a failure, not a slow start. The
retry loop runs 20 times at 15 seconds and then stops trying, so a value that
never changes past the five minute mark means the loop has already exhausted
itself and nothing further will happen on its own.

Then the whole stack, end to end:

```bash
cd ansible
ansible-playbook playbooks/verify_stack.yml
```

It is read-only and safe to run at any time. It checks `/health`, `/metrics`
and node_exporter on every app instance, prints the Swarm node and service
lists, and then checks the four on-premises monitoring endpoints. Everything
should print `✅ OK`.

Check the pieces individually if something is red:

```bash
# The app service is running and has its replica
docker stack services shimonvault          # on the app instance
docker service ps shimonvault_app --no-trunc

# Prometheus has its targets
curl -s localhost:9090/api/v1/targets | grep -c '"health":"up"'

# The monitoring stack itself
curl -s localhost:9090/-/ready
curl -s localhost:9093/-/ready
curl -s localhost:3000/api/health
curl -s localhost:8001/health              # Telegram relay
```

---

## 2. Deploy or redeploy

State lives in an **S3 backend with a DynamoDB lock table**, and both are
created by hand and never managed by Terraform, so `terraform destroy` can
never delete the state it is writing to. Once only, before the first init:

```bash
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws s3 mb s3://shimonvault-tfstate-$AWS_ACCOUNT_ID --region ap-northeast-2
aws s3api put-bucket-versioning --bucket shimonvault-tfstate-$AWS_ACCOUNT_ID \
  --versioning-configuration Status=Enabled
aws dynamodb create-table --table-name shimonvault-tfstate-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST --region ap-northeast-2
```

Then the normal path. One command, about 15 minutes, and RDS is the slow part:

```bash
bash scripts/deploy.sh
```

`deploy.sh` is not just `terraform apply`. In order, it rewrites
`your_ip_cidr` in `terraform.tfvars` from your current public IP, applies,
generates `app/.env` from the Terraform outputs, rewrites your SSH config,
points the Cloudflare record at the new ALB, waits for the bastion and then for
a healthy target, seeds the three demo accounts, installs node_exporter through
Ansible, configures replication, runs `verify_stack.yml`, and refetches the
Docker TLS certificates for Portainer.

The app is **not** deployed as a separate step. Each instance installs Docker,
joins the tailnet, writes `/opt/shimonvault/stack.yml` from its `user_data`,
and runs `docker stack deploy` on its own at boot, so the application comes up
with the infrastructure.

The seeding step runs **after** the ALB reports 200, and the order is
load bearing: that 200 is the proof `init_db()` already created the schema.
Seeding any earlier means the `users` table does not exist yet.

The monitoring stack is separate and lives on proj-mgmt, which is never
destroyed:

```bash
cp .env.example monitoring/.env    # fill in DB, Grafana, Slack, Telegram
cd monitoring && docker compose up -d
```

`terraform.tfvars` and `monitoring/.env` are gitignored because they hold real
secrets. Copy each from its `.example` before the first run.

---

## 3. Blue/green: switch and roll back

Dispatching `cd.yml` (`gh workflow run cd.yml --ref main`, or the Run workflow
button) builds `:green`, brings a green instance
up behind the same ALB, waits for the green target group to report healthy on
its own health check, and only then moves the listener.

The switch is a **Terraform variable**, not an AWS CLI call:

```bash
terraform apply -auto-approve -var="deploy_green=true" -var="active_color=green"
```

Do not use `aws elbv2 modify-listener` for this. The listener target lives in
state, so a CLI switch is drift and the next `terraform apply` silently puts
traffic back on blue. That failure surfaces days later with no obvious cause.

Manual switch and rollback, for a demo or an emergency, is the same apply with
the colour changed:

```bash
cd terraform
terraform apply -auto-approve -var="deploy_green=true" -var="active_color=green"  # shift traffic to green
terraform apply -auto-approve -var="deploy_green=true" -var="active_color=blue"   # roll back
```

Rollback is cheap because **blue is never torn down by the deploy**. It keeps
running and simply receives no traffic until `terraform destroy` removes it at
the end of the session. If green is bad, switch back and investigate at
leisure.

If the pipeline stops at the health poll, green never came up. The poll runs 40
attempts at 15 seconds, so a failure there means roughly ten minutes have
already passed:

```bash
aws elbv2 describe-target-health --target-group-arn <green-tg-arn> \
  --region ap-northeast-2 \
  --query "TargetHealthDescriptions[].{Target:Target.Id,State:TargetHealth.State,Reason:TargetHealth.Reason}" \
  --output table
```

Blue is still live the whole time, so this is a failed deploy and not an
outage. Read the reason, fix it, push again.

---

## 4. When the application is unhealthy

Work down this list in order. Each step depends on the one above it.

```bash
# 1. Is the target registered and healthy at all?
aws elbv2 describe-target-health --target-group-arn <blue-tg-arn> --output table

# 2. Get onto the instance
ssh -F ~/.ssh/shimonvault_config shimonvault-app

# 3. Is the service running, and has it been restarting?
docker stack services shimonvault
docker service ps shimonvault_app --no-trunc
docker service logs shimonvault_app --tail 100

# 4. Is the database reachable from the instance?
systemctl status rds-relay
curl -s localhost:8000/health | python3 -m json.tool
```

The Swarm restart policy is `on-failure`, `delay: 10s`, `max_attempts: 5`. A
service that has burned all five attempts stays down and Swarm will not try
again. `docker service ps` shows the failed tasks; that history is the fastest
way to tell a crash loop from a single bad start.

Force a fresh start once you know what was wrong:

```bash
docker service update --force shimonvault_app
```

That also **clears every in-process counter**, which matters more than it
sounds: the login-failure, account-suspension and exfiltration counters all
live in module-level dictionaries and are wiped by any restart. See section 8.

If `/health` reports `db: error`, the application is up and the database is
not. The path from the app to RDS runs through a **socat relay** installed by
`user_data` as a systemd unit on the app instance itself:

```bash
systemctl status rds-relay
journalctl -u rds-relay --no-pager -n 50
```

Then check RDS directly through the bastion tunnel:

```bash
ssh -F ~/.ssh/shimonvault_config -L 5434:<rds-endpoint>:5432 shimonvault-bastion
psql -h localhost -p 5434 -U shimonvault -d shimonvault -c 'SELECT 1;'
```

---

## 5. When an alert fires

Four rules, and none of them triggers an action:

| Alert | Expression | For | Severity |
| --- | --- | --- | --- |
| `HighCPU` | CPU above 80% | 2m | warning |
| `HighMemory` | memory above 85% | 2m | warning |
| `NodeDown` | `up{job="ec2-nodes"} == 0` | 1m | critical |
| `FastAPIDown` | `up{job="fastapi-app"} == 0` | 1m | critical |

Routing, from `monitoring/alertmanager/alertmanager.yml`:

| Setting | Value |
| --- | --- |
| Group by | `alertname`, `instance`, `severity` |
| `group_wait` | 30s |
| `group_interval` | 5m |
| `repeat_interval` | 4h |
| Receiver | Slack `#shimonvault-alerts` **and** the Telegram relay |

One inhibit rule is worth knowing about: an instance already reporting
`NodeDown` has `HighCPU`, `HighMemory` and `FastAPIDown` suppressed on it. One
dead host therefore sends **one** alert and not four. If a host is down and you
expected a CPU alert that never came, that is the inhibit rule and not a
missing scrape.

The application's own detections are separate, and these are the live
thresholds:

| Trigger | Threshold | Where | Response |
| --- | --- | --- | --- |
| Failed logins | 5 from one IP | `auth_router.py` | warning to Slack and Telegram |
| Failed logins | 8 from one IP | `auth_router.py` | incident record, critical alert |
| Access denied | 5 for one account | `audit_middleware.py` | account suspended, incident, alert |
| Downloads | 10 in 60s per IP | slowapi on `/docs/download` | HTTP 429 |
| First 429 on a download | once per IP | `audit_middleware.py` | JSON report to the reports bucket, alert |
| Upload signature | any blocked magic bytes | `validate_file` Lambda | object deleted, incident record |

**Do not read the thresholds out of `services/rate_limiter.py`.** That module
defines a 20-and-50 login pair and a 10-download exfiltration check, and
nothing imports it. It is dead code. The numbers in the table above are the
ones that run.

After any security alert:

```bash
# What the app recorded
curl -s -H "Authorization: Bearer <admin-jwt>" http://<alb-dns>/audit/incidents

# The same thing from the source of truth
aws dynamodb scan --table-name shimonvault-incidents --region ap-northeast-2 \
  --max-items 20

# The exfiltration reports
aws s3 ls s3://shimonvault-reports-<account-id>/ --recursive
```

---

## 6. Database and replication

RDS is the write primary. A PostgreSQL 16 container on proj-ubuntu01 subscribes
to it over logical replication and serves the read-only routes.

```bash
bash scripts/setup_replica.sh
```

The script creates the replication user and publication on RDS, starts the
replica container on `proj-ubuntu01:5433`, applies the schema **before**
subscribing, drops any orphaned slot left by a previous session, creates the
subscription, and waits for the initial table sync to land actual rows.

The connection path is the part that surprises people. The replica does not
reach RDS directly. It goes through the **socat relay on the app instance**,
which is on the tailnet, so replication depends on the app instance existing.
Every `terraform destroy` therefore breaks replication and every `deploy.sh`
rebuilds it. A subscription that worked yesterday and is dead today, with no
other change, is almost always this.

Verify both ends:

```bash
# On RDS: the slot should exist and be active
psql -h <rds-endpoint> -U shimonvault -d shimonvault \
  -c "SELECT slot_name, active FROM pg_replication_slots;"

# On the replica: the subscription should exist
ssh user1@100.87.141.40 "docker exec shimonvault-postgres-replica \
  psql -U shimonvault -d shimonvault -p 5433 -c 'SELECT * FROM pg_stat_subscription;'"
```

End-to-end proof, which is better than either query: upload a document through
the API, then read it back off the replica.

```bash
ssh user1@100.87.141.40 "docker exec shimonvault-postgres-replica \
  psql -U shimonvault -d shimonvault -p 5433 -c 'SELECT filename FROM documents LIMIT 5;'"
```

---

## 7. Test the security path

Never wait for a real attack to find out whether the defences work. Generate
one. Every simulation logs in as a real seeded account and calls real endpoints
over HTTP, so what lands in the audit feed is the application running.

From the admin console, or by hand:

```bash
TOKEN=$(curl -s -X POST http://<alb-dns>/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@shimonvault.com","password":"Admin1234!"}' \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')

curl -s -X POST http://<alb-dns>/demo/test-notification   -H "Authorization: Bearer $TOKEN"
curl -s -X POST http://<alb-dns>/demo/credential-stuffing -H "Authorization: Bearer $TOKEN"
curl -s -X POST http://<alb-dns>/demo/access-control      -H "Authorization: Bearer $TOKEN"
curl -s -X POST http://<alb-dns>/demo/exfiltration        -H "Authorization: Bearer $TOKEN"
curl -s -X POST http://<alb-dns>/demo/ddos                -H "Authorization: Bearer $TOKEN"
```

What each one should produce:

| Simulation | Default volume | Expected result |
| --- | --- | --- |
| `test-notification` | 1 message | a message in Slack and in Telegram |
| `credential-stuffing` | 30 attempts | 401s, warning at 5, incident at 8 |
| `access-control` | 6 attempts | 403s, the viewer account suspended on the 5th |
| `exfiltration` | 15 downloads | 429 after 10, one S3 report, one alert |
| `ddos` | 200 requests, 20 concurrent | a visible spike in the Prometheus request rate |

The shell equivalents live in `scripts/` and take a base URL, for when the app
itself is the thing that is broken:

```bash
bash scripts/simulate_credential_stuffing.sh https://<domain>
bash scripts/simulate_access_control.sh https://<domain>
python3 scripts/simulate_exfiltration.py --base-url https://<domain> --token <jwt>
bash scripts/simulate_ddos.sh https://<domain>       # needs `hey` installed
```

Two things to do afterwards:

**Un-suspend the viewer account.** The access-control simulation genuinely sets
`users.suspended = true`, and the account stays suspended until you clear it.
Every later login as `viewer@shimonvault.com` returns 403 and it looks like a
broken app.

```sql
UPDATE users SET suspended = false WHERE email = 'viewer@shimonvault.com';
```

**Reset the counters** if you want to run a simulation twice in one session.
They are in-process, so a service restart is the reset:

```bash
docker service update --force shimonvault_app
```

The attacker address is `203.0.113.42` by default, inside the RFC 5737
documentation range, sent as `X-Forwarded-For`. It belongs to nobody, which is
the point.

**Set `DEMO_ENABLED=false` on anything you would not call a demo.** Every
`/demo/*` route then returns 403. An admin-only button that fires real attack
traffic is still a button that fires real attack traffic.

---

## 8. Hybrid networking

AWS and the two on-premises hosts are joined by a Tailscale mesh with no public
port open on either side. When a scrape fails across environments, check the
tunnel before anything else.

```bash
tailscale status
tailscale ping shimonvault-app-blue
```

The EC2 nodes join from `user_data` with an ephemeral auth key and self-expire
after a teardown, so stale nodes clear themselves within about 30 minutes. The
app joins with `--accept-routes=false` deliberately.

Three ports are open to the Tailscale range `100.64.0.0/10` and to nothing
else: `9100` for node_exporter, `2376` for the Docker TLS socket that Portainer
uses, and `2049` for NFS. A scrape failing from proj-mgmt while the instance is
otherwise fine is either an expired key or a node that never came up on the
mesh, and `tailscale status` tells you which.

Portainer needs its client certificates refetched **after every deploy**,
because `user_data` generates a fresh CA on each new instance:

```bash
bash scripts/fetch_docker_certs.sh <bastion-ip> <blue-ip>
```

Skipping this leaves Portainer pointed at an endpoint whose certificate no
longer verifies, which presents as a Portainer that connects to nothing while
Docker itself is perfectly healthy.

---

## 9. Known traps

- **A green target is not a working app.** `/health` answers 200 before the
  database is up, on purpose, because RDS takes 30 to 60 seconds after boot and
  the ALB would otherwise kill the instance before it ever became useful. The
  `db` field carries the truth. Read the body, never just the code.
- **A security group cannot deny anything.** Security groups hold allow rules
  only, so the automatic block lives in a network ACL instead, at the lowest
  free rule number between 1 and 99. If you go looking for a block rule in the
  app security group you will not find one and nothing is wrong.
- **`block_ip` has no live trigger.** The Lambda is deployed, subscribed to the
  security-alert topic and IAM-authorised, but nothing in `app/` ever publishes
  to SNS. `auth_router.py` still carries the `TODO`. The alerts you receive on
  a credential-stuffing run are sent directly by the application, and no IP is
  actually blocked. Do not report an attack as contained on the strength of
  that alert.
- **`block_ip` also no-ops when `NACL_ID` is unset.** It logs a warning and
  returns success. Check the environment variable before trusting the function
  even once the publish above is wired.
- **Every counter is in-process.** Login failures, access violations and the
  exfiltration alert set all live in module-level dictionaries. Two replicas
  count separately, and any restart forgets everything. A threshold that
  refuses to trip during a demo is usually a container that restarted.
- **`services/rate_limiter.py` is dead code.** Nothing imports it. Its
  thresholds are not the ones running. See the table in section 5.
- **The download limiter counts on the endpoint, not the URL.** slowapi's
  default `key_style="url"` keys on the resolved path, so 50 downloads of 50
  different document ids are 50 counters of 1 and the limit never trips, while
  50 downloads of the *same* id trips it immediately. `rate_limit.py` sets
  `key_style="endpoint"` for exactly this reason. If a bulk-download test
  produces no 429, check that setting before you check the rule.
- **`deploy.sh` rewrites your bastion rule from your current public IP.** Move
  to a different network and the old rule no longer matches you. Re-run
  `deploy.sh`, or edit `your_ip_cidr` and apply, rather than debugging SSH.
- **Alertmanager will not expand environment variables in its own config.**
  The compose entrypoint writes the Slack webhook to `/tmp/slack_url` first and
  the config reads it with `slack_api_url_file`. Putting `${SLACK_WEBHOOK_URL}`
  in the YAML fails silently and alerts simply never arrive.
- **A rejected upload lands in the bucket before it is deleted.** `validate_file`
  runs on `ObjectCreated:Put`, so the file exists for as long as the check
  takes. Treat the docs bucket as holding unvalidated content.
- **The auto scaling group is parked at `desired_capacity = 0`.** It has its
  launch template, both scaling policies and both CPU alarms, and it serves no
  traffic. Blue/green is the serving path. Do not expect a scale-out to answer
  a load problem here.
- **Passwords are SHA-256'd before bcrypt.** bcrypt truncates at 72 bytes, so
  `hash_password()` hashes once first. Any external tool generating a hash for
  this database must do the same or the login will fail with correct
  credentials.

---

## 10. Tear down

This runs on a personal AWS account. Tearing down is not optional.

**Pull the evidence out first.** `terraform destroy` deletes the DynamoDB
tables and both S3 buckets carry `force_destroy = true`, so the incident
history and every uploaded report go with them.

```bash
python3 scripts/generate_report.py --output-local incident-report.json
```

Then:

```bash
bash scripts/destroy.sh
```

It asks for a literal `yes`, runs `terraform destroy`, and then verifies rather
than trusts. It re-checks EC2 instances, RDS, load balancers, the NAT instance,
leftover EBS volumes, Lambda functions and stale Tailscale nodes, and prints
the console links for the checks worth a human eye.

Deliberately preserved, and never destroyed:

| Resource | Why |
| --- | --- |
| `shimonvault-tfstate-<account>` | Terraform state, outside Terraform on purpose |
| `shimonvault-tfstate-lock` | the state lock table, same reason |
| proj-mgmt | Prometheus, Grafana, Alertmanager, always on and free |
| proj-ubuntu01 | the read replica and the NFS share, always on and free |

Confirm the plan lists only this project's resources before approving, and that
the state bucket is not among them. Then check the billing console reads
`$0.00` for the day, because a NAT instance or an ALB left running is the one
mistake here that costs real money overnight.
