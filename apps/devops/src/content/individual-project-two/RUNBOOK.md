# Runbook: ShimonVault Operations Platform

> 📘 Each procedure lists its steps in order. A ✅ callout shows the expected result. A ⚠️ callout marks a step that can go wrong.

### Alert sources

| Message shows | Sent by | Path |
| --- | --- | --- |
| An instance label | Alertmanager | Prometheus rules reach Slack and the Telegram relay through Alertmanager. |
| An IP with a timestamp | The application | `notify_all()` posts straight to both channels without Prometheus. |

### Two rules before any procedure

1. **Recovery is mostly manual.** Swarm restarts a crashed container up to five times. High CPU scales the auto scaling group out. Every other alert needs an operator.
2. **A green ALB target can hide a broken database.** `/health` returns 200 from process start. Only its `db` field reports the database.

---

## 1. Confirm the System Is Healthy

### Step 1. Read the health body from proj‑mgmt

```bash
curl -s http://<alb-dns>/health | python3 -m json.tool
```

> ✅ The body matches this example with `"db": "ok"`.

```json
{
  "status": "healthy",
  "version": "0.1.0",
  "project": "shimonvault",
  "environment": "production",
  "db": "ok"
}
```

| `db` value | Meaning | Action |
| --- | --- | --- |
| `ok` | The schema exists. Connections work. | No action is needed. |
| `initialising` | The background thread is still retrying. | Wait up to three minutes after a boot. |
| `error: ...` | The retry loop failed or gave up. | Go to section 4. |

> ⚠️ Past five minutes, `initialising` means failure. The loop has used all 20 tries at 15‑second intervals.

### Step 2. Run the stack playbook

```bash
cd ansible
ansible-playbook playbooks/verify_stack.yml
```

> ✅ Every line prints `✅ OK`. The playbook only reads state.

### Step 3. Check any red piece alone

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

## 2. Deploy or Redeploy

### Step 1. Create the state backend once

The S3 bucket and the DynamoDB lock table sit outside Terraform. A destroy never touches them.

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

### Step 2. Run the deploy script

```bash
bash scripts/deploy.sh
```

> ✅ The script finishes in about 10 minutes. The README's Deployment table lists its twelve steps.

The app has no deploy step of its own. Each instance starts the Swarm stack from its `user_data` at boot. Seeding waits for a 200 from the ALB. That response proves the schema exists.

### Step 3. Start monitoring on proj‑mgmt

```bash
cp .env.example monitoring/.env    # fill in DB, Grafana, Slack, Telegram
cd monitoring && docker compose up -d
```

> ℹ️ Both `terraform.tfvars` and `monitoring/.env` are gitignored. Each one starts from its `.example` file.

---

## 3. Blue/Green: Switch and Roll Back

### Step 1. Dispatch the pipeline

Run `gh workflow run cd.yml --ref main` or press Run workflow. The pipeline builds `:green` behind the same ALB.

> ✅ The listener moves after the green target group passes its health check.

### Step 2. Switch or roll back by hand

```bash
cd terraform
terraform apply -auto-approve -var="deploy_green=true" -var="active_color=green"  # shift traffic to green
terraform apply -auto-approve -var="deploy_green=true" -var="active_color=blue"   # roll back
```

> ⚠️ Avoid `aws elbv2 modify-listener`. A CLI switch drifts from state. The next apply sends traffic back to blue.

**The deploy never tears blue down.** Blue idles until `terraform destroy`. A rollback is one apply away.

### Step 3. Read the reason after a failed poll

A stop at the health poll means green never came up. The poll gives up after 40 tries at 15 seconds.

```bash
aws elbv2 describe-target-health --target-group-arn <green-tg-arn> \
  --region ap-northeast-2 \
  --query "TargetHealthDescriptions[].{Target:Target.Id,State:TargetHealth.State,Reason:TargetHealth.Reason}" \
  --output table
```

> ✅ Blue keeps serving traffic. Dispatch the workflow again after the fix.

---

## 4. Application Troubleshooting

### Step 1. Work down the checks in order

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

> ⚠️ Swarm stops after five failed restarts under `on-failure`. The task history in `docker service ps` shows a crash loop.

### Step 2. Force a fresh start after the fix

```bash
docker service update --force shimonvault_app
```

> ⚠️ A forced restart **clears every in‑process counter** (section 9).

### Step 3. Trace a `db: error` to the relay

The app reaches RDS through a **socat relay** on its own instance.

```bash
systemctl status rds-relay
journalctl -u rds-relay --no-pager -n 50
```

### Step 4. Test RDS through the bastion

```bash
ssh -F ~/.ssh/shimonvault_config -L 5434:<rds-endpoint>:5432 shimonvault-bastion
psql -h localhost -p 5434 -U shimonvault -d shimonvault -c 'SELECT 1;'
```

---

## 5. Alert Response

### Step 1. Identify the rule

Four Prometheus rules raise alerts. None of them triggers an action.

| Alert | Expression | For | Severity |
| --- | --- | --- | --- |
| `HighCPU` | CPU above 80% | 2m | warning |
| `HighMemory` | memory above 85% | 2m | warning |
| `NodeDown` | `up{job="ec2-nodes"} == 0` | 1m | critical |
| `FastAPIDown` | `up{job="fastapi-app"} == 0` | 1m | critical |

| Setting | Value |
| --- | --- |
| Group by | `alertname`, `instance`, `severity` |
| `group_wait` | 30s |
| `group_interval` | 5m |
| `repeat_interval` | 4h |
| Receiver | Slack `#shimonvault-alerts` **and** the Telegram relay |

> ℹ️ `NodeDown` silences the other three alerts on the same instance. A dead host sends a single alert.

### Step 2. Match an application detection

| Trigger | Threshold | Where | Response |
| --- | --- | --- | --- |
| Failed logins | 5 from one IP | `auth_router.py` | Slack and Telegram receive a warning. |
| Failed logins | 8 from one IP | `auth_router.py` | The router opens an incident with a critical alert. |
| Access denied | 5 for one account | `audit_middleware.py` | The middleware suspends the account and opens an incident. |
| Downloads | 10 in 60s per IP | slowapi on `/docs/download` | The route returns HTTP 429. |
| First 429 on a download | Once per IP | `audit_middleware.py` | One JSON report lands in the reports bucket with one alert. |
| Upload signature | Any blocked magic bytes | `validate_file` Lambda | The Lambda deletes the object and opens an incident. |

> ⚠️ `services/rate_limiter.py` holds stale numbers. Nothing imports it.

### Step 3. Read what the alert left behind

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

## 6. Database and Replication

### Step 1. Build the replica

RDS is the write primary. A PostgreSQL 16 replica on `proj-ubuntu01:5433` serves the read‑only routes.

```bash
bash scripts/setup_replica.sh
```

> ✅ The script applies the schema **before** subscribing. It drops any orphaned slot from an earlier session.

### Step 2. Verify both ends

```bash
# On RDS: the slot should exist and be active
psql -h <rds-endpoint> -U shimonvault -d shimonvault \
  -c "SELECT slot_name, active FROM pg_replication_slots;"

# On the replica: the subscription should exist
ssh user1@100.87.141.40 "docker exec shimonvault-postgres-replica \
  psql -U shimonvault -d shimonvault -p 5433 -c 'SELECT * FROM pg_stat_subscription;'"
```

> ⚠️ The replica reaches RDS through the **socat relay on the app instance**. Each teardown breaks replication. Each `deploy.sh` rebuilds it.

### Step 3. Prove the full path

Upload a document through the API. Read it back from the replica.

```bash
ssh user1@100.87.141.40 "docker exec shimonvault-postgres-replica \
  psql -U shimonvault -d shimonvault -p 5433 -c 'SELECT filename FROM documents LIMIT 5;'"
```

---

## 7. Security Path Testing

### Step 1. Run the simulations

Each simulation signs in as a seeded account with real HTTP calls. The admin console buttons run the same calls.

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

| Simulation | Default volume | Expected result |
| --- | --- | --- |
| `test-notification` | 1 message | One message arrives in Slack and in Telegram. |
| `credential-stuffing` | 30 attempts | Every attempt returns 401. A warning fires at 5 before an incident opens at 8. |
| `access-control` | 6 attempts | Each attempt returns 403. The fifth one suspends the viewer account. |
| `exfiltration` | 15 downloads | Downloads return 429 after the tenth. One S3 report and one alert follow. |
| `ddos` | 200 requests at 20 concurrent | The Prometheus request rate shows a clear spike. |

The shell versions in `scripts/` take a base URL. Use them when the app itself is broken.

```bash
bash scripts/simulate_credential_stuffing.sh https://<domain>
bash scripts/simulate_access_control.sh https://<domain>
python3 scripts/simulate_exfiltration.py --base-url https://<domain> --token <jwt>
bash scripts/simulate_ddos.sh https://<domain>       # needs `hey` installed
```

### Step 2. Un‑suspend the viewer

```sql
UPDATE users SET suspended = false WHERE email = 'viewer@shimonvault.com';
```

> ⚠️ The suspension persists after the run. The `ddos` simulation signs in as the viewer too.

### Step 3. Reset the counters

```bash
docker service update --force shimonvault_app
```

> ℹ️ The default attacker address is `203.0.113.42` from the RFC 5737 range. It arrives as `X-Forwarded-For`.

> ⚠️ Set `DEMO_ENABLED=false` outside a demo. Every `/demo/*` route then returns 403.

---

## 8. Hybrid Networking

### Step 1. Check the tunnel

A Tailscale mesh joins AWS with the two on‑premises hosts.

```bash
tailscale status
tailscale ping shimonvault-app-blue
```

> ✅ Ports `9100` and `2376` answer from the Tailscale range `100.64.0.0/10`. NFS on `2049` follows the same rule.

### Step 2. Refetch the Portainer certificates

Each new instance generates its own CA. Run this **after every deploy**.

```bash
bash scripts/fetch_docker_certs.sh <bastion-ip> <blue-ip>
```

---

## 9. Known Traps

1. **`/health` answers before the database.** RDS needs 30 to 60 seconds after boot. Read the `db` field.
2. **Security groups cannot deny traffic.** The automatic block lives in a network ACL at rules 1 to 99.
3. **`block_ip` has no live trigger.** Nothing in `app/` publishes to SNS yet. The alert line `IP block Lambda triggered` describes the plan.
4. **`block_ip` succeeds without `NACL_ID`.** The function logs a warning only.
5. **Counters live in process memory.** Two instances count separately. A restart forgets everything.
6. **`rate_limiter.py` is dead code.** Section 5 lists the live thresholds.
7. **The limiter keys on the endpoint.** A bulk download test without a 429 points to `key_style` in `rate_limit.py`.
8. **`deploy.sh` pins the bastion to your IP.** Re‑run it after a move to another network.
9. **Alertmanager ignores `${SLACK_WEBHOOK_URL}`.** The webhook has to come from `/tmp/slack_url`.
10. **Uploads land before validation.** The docs bucket can briefly hold a rejected file.
11. **The auto scaling group serves traffic.** One to two instances sit in the blue target group. The zero‑capacity comment in `asg.tf` is outdated.
12. **Passwords pass through SHA-256 before bcrypt.** An external hash has to repeat that step.

---

## 10. Tear Down

### Step 1. Export the evidence

```bash
python3 scripts/generate_report.py --output-local incident-report.json
```

> ⚠️ `terraform destroy` deletes the DynamoDB tables. Both S3 buckets carry `force_destroy = true`.

### Step 2. Run the teardown

```bash
bash scripts/destroy.sh
```

> ✅ The script asks for a literal `yes`. It checks seven resource types for leftovers afterward.

### Step 3. Confirm what stays

| Resource | Why it stays |
| --- | --- |
| `shimonvault-tfstate-<account>` | It holds the Terraform state outside Terraform. |
| `shimonvault-tfstate-lock` | The state lock table stays for the same reason. |
| proj‑mgmt | The monitoring stack runs here around the clock at no cost. |
| proj‑ubuntu01 | The read replica and the NFS share live here at no cost. |

> ✅ The billing console reads `$0.00` the next day.
