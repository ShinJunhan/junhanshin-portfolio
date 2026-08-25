# Runbook — LockBank Security Response Platform

Operating instructions for the running system. Every section is written to be
followed under pressure: what to check, what to run, what the correct output
looks like, and what to do when it isn't.

Telegram is the notification channel, and there are two independent paths to
it. Prometheus alerts arrive through Alertmanager; anything that happens to the
instances themselves arrives through CloudWatch → SNS → Lambda. If you are
reading this because your phone buzzed, the message tells you which path fired.

One thing to know before anything else: **maintenance alerts are deliberately
silent.** `PrometheusDown`, `GrafanaDown`, `AlertmanagerDown` and
`NginxExporterDown` are routed straight to the recovery webhook and never reach
Telegram. Silence is not evidence that nothing has failed — check the
dashboard, not your phone.

---

## 1. Confirm the system is healthy

Run from proj-mgmt, the on-premises Rocky 8 host.

```bash
make check
```

`check.sh` walks five stages: required tooling, the Docker daemon and its
login, AWS credentials, Tailscale, and a cost reminder. Every line should be
green.

The one that matters most is `[4] Tailscale`. It has to report both a
connection *and* the advertised subnet:

```
✅ Tailscale 연결됨 (IP: 100.x.x.x)
✅ 서브넷 광고 : 172.16.1.0/24 (proj-mgmt)
```

A connected node that is not advertising `172.16.1.0/24` will pass a casual
glance and then fail every cross-environment scrape. If the advertisement is
missing, the route needs approving in the Tailscale admin console — the node is
fine.

Check the pieces individually if something is red:

```bash
# Every monitoring container up
cd monitoring && make ps

# Prometheus has its targets
curl -s localhost:9090/api/v1/targets | grep -c '"health":"up"'

# The recovery controller is listening
curl -s localhost:8000/health

# The app answers through Nginx, which is what BankAppDown actually measures
curl -s -o /dev/null -w '%{http_code}\n' http://<alb-dns>/health
```

That last one is the real test. Prometheus does not watch the container — it
probes the path a user takes, through Nginx. A running container that is
unreachable through the proxy is a failure by this system's definition, and
that is deliberate.

---

## 2. Deploy or redeploy

State lives in a **per-person S3 backend with a DynamoDB lock**, so the backend
resources have to exist before anything else. Once only:

```bash
cd infra/terraform/init
terraform init && terraform apply
terraform output s3_bucket_name

cd ..
cp hcl/backend.hcl.example hcl/backend.hcl   # put your bucket name in it
```

Then the normal path:

```bash
make init            # terraform init -backend-config=hcl/backend.hcl
make plan            # review before every apply — no exceptions
make service         # build-push → build-push-bootstrap → apply-auto → deploy-db
make output          # Bastion IP, EC2 IPs, target-group ARNs, SG IDs
```

`make service` does not deploy the app as a separate step. The App instances
pull their image and start it from `user_data` at boot, so the app comes up
with the infrastructure. `make wait-app` blocks until it answers.

The monitoring stack is separate and runs locally on proj-mgmt:

```bash
make monitoring-service   # bootstrap + nginx log exporter on :9105
```

`make full-service` runs both halves in one go.

`hcl/backend.hcl` and `infra/ansible/group_vars/database.yml` are gitignored
because they hold personal values. Copy each from its `.example` before the
first run.

---

## 3. When an alert fires

The controller handles this on its own. Do not intervene during the retry
window — manual action competes with the recovery script and makes the outcome
impossible to read.

What happens automatically:

1. Prometheus evaluates the rule and fires after its `for:` duration.
2. Alertmanager groups for 5s, then routes on the `category` label.
3. `category="maintenance"` goes **only** to the recovery webhook. Everything
   else goes to Telegram *and* the webhook.
4. The controller looks the alert up in `recovery_map.yaml`, runs the mapped
   action, then re-probes the `verify` URL to decide whether it worked.

The policy, from `monitoring/recovery/config/recovery_map.yaml`:

| Alert | Category | Telegram | Mode | Action | Retry | Cooldown |
| --- | --- | --- | --- | --- | --- | --- |
| `BankAppDown` | user_service | yes | auto_recovery | `restart_remote_container` on `aws-app` | 3 | 30s |
| `PrometheusDown` | maintenance | no | auto_recovery | `restart_container` | 3 | 300s |
| `GrafanaDown` | maintenance | no | auto_recovery | `restart_container` | 3 | 300s |
| `AlertmanagerDown` | maintenance | no | auto_recovery | `restart_container` | 3 | 300s |
| `NginxExporterDown` | maintenance | no | auto_recovery | `restart_container` | 3 | 300s |
| `HighLoginFailureRate` | security | yes | **notify_only** | — | — | — |
| `RateLimitTriggered` | security | yes | **notify_only** | — | — | — |

The two security alerts are notify-only by design. An attack is not a fault to
be repaired — restarting something would destroy the evidence and fix nothing.
fail2ban already blocked the source; the alert exists so a person knows.

What fires them:

| Alert | Expression | For |
| --- | --- | --- |
| `BankAppDown` | `max(probe_success{job="app-health"}) == 0` | 10s |
| `HighLoginFailureRate` | `nginx_login_401_count >= 3` | 10s |
| `RateLimitTriggered` | `nginx_status_429_count >= 5` | 30s |
| `*Down` (monitoring) | `up{job="..."} == 0` | 30s |

A recovered app was measured at **23.24s** from alert to verified healthy, on
the first attempt. Treat anything past a minute as a failure in progress.

---

## 4. When recovery fails

The controller reports a failure to Telegram after the last retry. Take over
there.

```bash
docker logs lb-monitoring-recovery --tail 100
tail -50 monitoring/recovery/logs/recovery.log
tail -50 monitoring/recovery/logs/maintenance.log   # the silent ones
```

`BankAppDown` is the one that fails in interesting ways, because it is the only
action that reaches out of the monitoring host. `aws_app_restart.sh` does this
before it restarts anything:

1. Finds the App instance by tag (`Name=lb-app*`, running) rather than trusting
   a stored IP — the ASG replaces instances, and a hardcoded address goes stale.
2. Checks the **replica DB** is reachable on 5432, and starts the local replica
   container if it is not.
3. Checks the **main DB** is reachable from the app host.
4. Only then restarts the container over SSH via the Bastion.

So a recovery failure is usually not the app. Work down that list — most often
it is step 2 or 3, and the app was never the problem.

Manual recovery, once you know what is broken:

```bash
ssh -i infra/terraform/lb-key.pem -J ec2-user@<bastion-ip> ec2-user@<app-ip>
docker restart lb-fastapi
curl -s -o /dev/null -w '%{http_code}\n' localhost/health
```

A cooldown suppresses repeat attempts for the same alert — 30s for the app,
300s for the monitoring components. An alert that keeps firing with no recovery
attempt in the log is inside its cooldown, not stuck.

**The controller cannot recover itself.** `RecoveryControllerDown` has no
policy, and this is recorded as an open question in the policy file rather than
solved. If the controller is down, nothing is watching — restart it by hand and
treat everything since as unmonitored.

---

## 5. Test the security path

Never wait for a real attack to find out whether the defences work. Generate
one.

```bash
# Brute-force login: expect 401s, then 429s, then a fail2ban ban
locust -f security/locust/login_attack.py --host https://<domain>

# API flooding: expect a wall of 429s and the service still up
locust -f security/locust/flood_attack.py --host https://<domain>

# Normal traffic, as the control
locust -f security/locust/normal_user.py --host https://<domain>
```

A quicker check without Locust:

```bash
./security/scripts/test-rate-limit.sh http://<app-ip>
```

Then confirm the block actually happened:

```bash
sudo fail2ban-client status nginx-login
sudo fail2ban-client status nginx-rate-limit
sudo fail2ban-client status nginx-scan
sudo iptables -L -n | grep f2b
```

The jails, from `docker/fail2ban/jail.local`:

| Jail | Trigger | Window | Ban |
| --- | --- | --- | --- |
| `nginx-login` | 5 × `401` on `/login` | 300s | 1 hour |
| `nginx-rate-limit` | 20 × `429` | 60s | 30 min |
| `nginx-scan` | 10 × PHP/WordPress `404` | 300s | 24 hours |

Unban yourself after testing, or you will spend twenty minutes debugging a
firewall rule you installed:

```bash
sudo fail2ban-client set nginx-login unbanip <your-ip>
```

---

## 6. Hybrid networking

AWS and proj-mgmt are joined by a Tailscale node-to-node L3 tunnel with no
public port open on either side. When a scrape fails across environments, check
the tunnel before anything else.

```bash
tailscale status
tailscale ping <hostname>
sudo tailscale debug prefs | grep -A2 AdvertiseRoutes
```

Re-enroll a host that has dropped off:

```bash
./bootstrap_tailscale.sh
```

Auth keys expire. A node that worked last week and is unreachable today with no
other change is almost always an expired key, not a network fault.

---

## 7. Known traps

- **A login failure must return `401`, not a redirect.** The app originally
  answered failed logins with a `302`, so no `401` ever reached the Nginx access
  log and `nginx_login_401_count` sat at zero *during a live brute-force run*.
  Nothing in the dashboard was wrong; the pipeline was watching the wrong thing.
  If detection reports nothing under attack, check the status code before you
  check the rule.
- **Health is measured through Nginx, not at the container.** After the reverse
  proxy went in, a running container told Prometheus nothing about whether the
  app was reachable. `BankAppDown` probes the user's path on purpose.
- **`DOCKER_CONFIG` is pinned to a repo-local folder in the Makefile.** The
  host's global Docker login collided with it and builds failed on one machine
  while passing on another. Do not `docker login` globally and assume the build
  will pick it up.
- **Restarting the app container is not recovery.** Early versions did only
  that and the service came back still broken, because its DB and network
  dependencies were down. That is why the action checks them first — do the
  same by hand.
- **The Tailscale tunnel needs traffic originated from inside.** Behind NAT the
  app-to-replica tunnel would not initialise, and the login page rendered while
  logins hung. Pinging out from the replica host registers the connection with
  the firewall and the direct peer-to-peer path comes up.
- **Public exposure draws automated scanners within minutes.** Not a drill —
  WordPress and PHP webshell probes started arriving on their own shortly after
  the EC2 went public. The `nginx-scan` jail exists because of that traffic, not
  in anticipation of it.
- **Maintenance alerts never reach Telegram.** See the top of this document.

---

## 8. Tear down

This runs on a personal AWS account. Tearing down is not optional.

```bash
make destroy
```

The order matters, and `make destroy` enforces it:

1. `monitoring teardown-force` — the AWS resources bootstrap created: Lambda,
   IAM, CloudWatch alarms, SNS subscriptions. The SNS topic is left to
   Terraform.
2. `monitoring destroy` — monitoring containers and volumes.
3. `destroy-db` — the replica DB stack.
4. `terraform destroy` — VPC, EC2, ASGs, and the rest.

Check the plan lists only this project's resources before approving, and that
the state bucket is not among them.

The DB backs up to S3 on a daily `pg_dump` cron. Confirm the latest dump exists
before destroying anything you would want back.

```bash
cd monitoring && make teardown   # dry-run: shows what would be deleted
```
