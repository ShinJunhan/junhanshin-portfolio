# ShimonVault: Self‑Directed Practice in Cloud Security on Hybrid Infrastructure

### 🗨️ Project Introduction

> ShimonVault is a secure internal operations platform on AWS. Users upload documents and schedule meetings. The platform records every request and defends against misuse as it happens.
>
> This practice project rebuilds the Lock‑N‑Lock brief as an individual build. On Lock‑N‑Lock, I led the team and owned the infrastructure track. This build adds the application to that scope. The detection rules and the response path come with it. Detection runs in application middleware, and automated checks run in Lambda. The audit trail lives in DynamoDB.

### 💠 Project Type

- The project started from an empty repository as individual practice.
- It keeps the four‑week Lock‑N‑Lock brief and changes the design behind it.

### 💠 Scope & Ownership

The table below maps each area of the platform to its directory.

| Area | What it covers | Directory |
|---|---|---|
| Infrastructure and IaC | Terraform builds every AWS resource in the project, starting with the VPC and ending with IAM. | `terraform/` |
| Application and API | FastAPI serves the API on SQLAlchemy models. Sign‑in uses JWT, and role checks guard each protected route. The audit middleware wraps every request. | `app/` |
| Frontend | A React single‑page app is compiled into the application image for a single deployable unit. | `frontend/` |
| Serverless response | Five Lambda handlers cover the serverless work. Three respond to security events, and two manage the meeting lifecycle. | `lambda/` |
| Monitoring and alerting | Prometheus and Grafana run on the on‑premises host. Alertmanager and a Telegram relay share the same machine. | `monitoring/` |
| Configuration management | Ansible roles install Docker and the CloudWatch agent. A dynamic EC2 inventory feeds them, and a separate playbook verifies the stack. | `ansible/` |
| CI/CD | Every push runs linting and tests before an image build. Blue/green deploys wait for a manual trigger. | `.github/workflows/` |
| Operations and demo | Scripts handle the one‑command deploy and teardown. They also set up replication and run four attack simulations. | `scripts/` |

### 💠 The Three Modules

| Module | What it does |
|---|---|
| **SecureDocs** | Users upload and version documents. Downloads and soft deletes run through the same module. Each file lives in S3 under `{owner_id}/{date}/{uuid}-{filename}` and stays encrypted at rest in a versioned bucket. Every download is a presigned URL with a 15‑minute expiry, and every access attempt is logged. |
| **ShimonMeet** | Users create and update meetings. They can also cancel a meeting or join one. Each meeting receives a random join token, and the platform refuses a wrong or expired token and logs it as a replay attempt. |
| **AuditStream** | AuditStream is the live feed of every action in the other two modules. The audit middleware writes each request to DynamoDB, and the admin console reads the feed back every four seconds. |

---

## Design Principles

**Every request reaches the audit trail.** The logger wraps every route as middleware. Health and metrics checks are the only exceptions.

**Automated responses run outside the servers they protect.** File checks and incident logging run in Lambda functions. Running them outside the instances keeps the response path available during an instance failure.

**Every defense faces a real attack.** Four built‑in attack simulations hit real endpoints with real requests.

## Architecture at a Glance

```
Internet
  │  Cloudflare DNS only, grey cloud (shimonvault.junhanshin.com)
  ▼
ALB  ── public subnets 10.0.1.0/24 (AZ a) · 10.0.4.0/24 (AZ c)
  │      alongside: Bastion (SSH from my IP only), NAT instance (t3.micro, iptables masquerade)
  │      health check: GET /health every 30s, 2 healthy / 2 unhealthy
  ▼
App EC2 (blue)   ── private subnets 10.0.2.0/24 (AZ a) · 10.0.3.0/24 (AZ c)
App EC2 (green)     Docker, uvicorn on :8000, node_exporter on :9100
  │
  ├─► RDS PostgreSQL 16 (db.t3.micro, private, logical replication enabled)
  ├─► S3   shimonvault-docs-<account>   ·   shimonvault-reports-<account>
  ├─► DynamoDB   audit-log · incidents · meetings
  ├─► SNS   security-alert · infra-alert · meeting-reminders
  └─► EventBridge   a scheduled health check every 5 minutes

Tailscale mesh (100.64.0.0/10)
  ├─ proj-mgmt      Prometheus · Grafana · Alertmanager · cAdvisor · Portainer · Telegram relay
  └─ proj-ubuntu01  PostgreSQL read replica on :5433 · NFS share
```

The security groups reference each other instead of CIDR ranges. The app group accepts `8000` from the ALB group and `22` from the bastion group. The RDS group accepts `5432` from the app group and the bastion group. Port `9100` serves the node exporter, and port `2376` serves Docker TLS. NFS listens on `2049`. All three accept traffic only from the Tailscale range.

---

## 🚀 Getting Started

### Prerequisites

- The AWS CLI is installed and configured with `aws configure`.
- Terraform 1.7 or later is installed.
- Docker Desktop is running.
- An EC2 key pair exists in `ap-northeast-2`, and an SSH key sits at `~/.ssh/id_ed25519_shimonvault`.
- Tailscale runs on the on‑premises hosts with an auth key from the admin console.

### One‑time state bootstrap

Terraform state lives on an S3 backend with a DynamoDB lock table. Both are created by hand and never managed by Terraform.

```bash
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

aws s3 mb s3://shimonvault-tfstate-$AWS_ACCOUNT_ID --region ap-northeast-2
aws s3api put-bucket-versioning \
  --bucket shimonvault-tfstate-$AWS_ACCOUNT_ID \
  --versioning-configuration Status=Enabled
aws s3api put-public-access-block \
  --bucket shimonvault-tfstate-$AWS_ACCOUNT_ID \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

aws dynamodb create-table \
  --table-name shimonvault-tfstate-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-northeast-2
```

Add your account ID to the backend block in `terraform/main.tf`.

### Configure

```bash
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
# fill in every CHANGEME value: your public IP /32, key pair name, DB password,
# JWT secret, Tailscale auth key, Docker Hub username, alert email,
# and the Tailscale IPs of proj-mgmt and proj-ubuntu01
```

`terraform.tfvars` is gitignored. `generate_env.sh` builds `app/.env` from the Terraform outputs.

---

## Deployment

One command provisions everything in about 10 minutes.

```bash
bash scripts/deploy.sh
```

`deploy.sh` runs these steps in order:

| Step | What happens |
|---|---|
| 1 | The script detects your current public IP and rewrites `your_ip_cidr` in `terraform.tfvars`. The bastion rule then follows you between networks. |
| 2 | The script reads the Tailscale address of `proj-mgmt` for the Prometheus URL. |
| 3 | The script runs `terraform init` and `terraform apply`. |
| 4 | `generate_env.sh` fills `app/.env` from the Terraform outputs with the RDS endpoint and every resource name the app needs. |
| 5 | `update_ssh_config.sh` rewrites the bastion jump‑host entry. |
| 6 | The script points the Cloudflare record for `shimonvault.junhanshin.com` at the current ALB without the proxy. |
| 7 | The script waits for bastion SSH and polls the app for up to 4 minutes until `/health` answers. A last request through the ALB confirms that the app is serving. |
| 8 | The script seeds the three demo accounts and skips any account that already exists. |
| 9 | The script points Ansible at the new bastion. Ansible then installs `node_exporter` on the EC2 instances. |
| 10 | `setup_replica.sh` sets up logical replication from RDS to `proj-ubuntu01`. |
| 11 | `ansible-playbook playbooks/verify_stack.yml` checks the whole stack from end to end. |
| 12 | The script fetches the Docker TLS certificates and points Portainer at the new instance. Prometheus reloads with the new targets at the end. |

### Monitoring stack on premises

The on‑premises host is never torn down.

```bash
cp .env.example monitoring/.env
# fill in DB_PASSWORD, GRAFANA_PASSWORD, SLACK_WEBHOOK_URL,
# TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
cd monitoring && docker compose up -d
```

Seven containers start on these ports.

| Container | Port |
|---|---|
| Prometheus | `:9090` |
| Grafana | `:3000` |
| Alertmanager | `:9093` |
| Node exporter | `:9100` |
| cAdvisor | `:8080` |
| Telegram relay | `:8001` |
| Portainer | `:9000` |

### Lambda packaging

Terraform zips each Lambda directory at apply time through `archive_file`. When a handler needs a real package installed, `scripts/package_lambdas.sh` builds the same five zips with their dependencies and the shared `notification.py` helper.

### Teardown after every session

```bash
bash scripts/destroy.sh
```

`destroy.sh` leaves the Tailscale mesh and runs `terraform destroy`. It then sweeps seven resource types for leftovers and prints two console links for manual checks.

State persists across sessions.

---

## Directory Structure

```
shimon-vault/
├── README.md
├── app/                          FastAPI application (Docker image root)
│   ├── main.py                   lifespan, routers, SPA fallback, /health
│   ├── config.py                 every setting read from the environment
│   ├── database.py               lazy write and read engines, psycopg2 only
│   ├── models.py                 5 tables, UUID keys, 13 audit event types
│   ├── auth.py                   bcrypt, JWT, require_role() dependency
│   ├── rate_limit.py             the one shared slowapi limiter
│   ├── routers/                  6 routers, 26 endpoints
│   │   ├── auth_router.py        register, login, logout
│   │   ├── docs_router.py        upload, list, download, delete, versions
│   │   ├── meetings_router.py    create, list, get, update, cancel, join, archive
│   │   ├── audit_router.py       feed, incidents, my-activity
│   │   ├── admin_router.py       dashboard summary, timeseries, infra
│   │   └── demo_router.py        4 attack simulations and a notification test
│   ├── services/                 S3, DynamoDB audit, EventBridge, Prometheus, notify, rate limiter
│   ├── middleware/
│   │   └── audit_middleware.py   logs every request, counts, suspends, alerts
│   └── Dockerfile                3 stages: Vite build, pip build, slim runtime
├── frontend/                     React SPA, built into the image
│   └── src/                      Login, Docs, Meetings, Console, api.js, toast
├── terraform/                    27 files, 90 resource blocks
│   ├── main.tf                   provider, S3 backend, caller identity
│   ├── vpc.tf                    VPC, 3 subnets, IGW, route tables
│   ├── alb.tf                    ALB, second public subnet, target groups, 80 and 443
│   ├── acm.tf                    the cert the 443 listener serves, DNS-validated
│   ├── app_ec2_blue.tf           the live instance
│   ├── app_ec2_green.tf          created only when deploy_green = true
│   ├── asg.tf                    launch template, scale policies, CPU alarms
│   ├── rds.tf                    PostgreSQL 16, logical replication parameters
│   ├── s3.tf                     docs versioned, reports expire in 30 days
│   ├── dynamodb.tf               audit-log, incidents, meetings
│   ├── lambda.tf                 5 functions, zipped at apply time
│   ├── sns.tf                    security-alert, infra-alert, meeting-reminders
│   ├── eventbridge.tf            a scheduled health check every 5 minutes
│   ├── iam.tf                    2 roles, 4 inline policies for 5 Lambdas
│   ├── security_groups.tf        5 groups, referencing each other
│   ├── nat_instance.tf           t3.micro with iptables masquerade
│   ├── bastion.tf                SSH from my IP only
│   ├── cloudwatch.tf             high CPU, instance status check, ALB 5xx
│   ├── backend.tf                the one-time state bootstrap, documented
│   └── templates/
│       └── app_user_data.sh.tpl  boot script: Tailscale, Docker, .env, container
├── lambda/                       5 handlers, python3.12
│   ├── block_ip/                 NACL deny rule, incident record, notify
│   ├── log_incident/             SNS message to the incidents table
│   ├── validate_file/            magic-byte check on S3 upload
│   ├── meeting_notify/           meeting reminder handler
│   ├── meeting_expire/           meeting archive handler
│   └── shared/notification.py    the Slack and Telegram helper
├── monitoring/                   on-premises stack, docker compose
│   ├── prometheus/
│   │   ├── prometheus.yml        4 scrape jobs, 15s interval
│   │   ├── rules/                4 alert rules
│   │   └── targets/              file_sd JSON, rewritten by fetch_docker_certs.sh
│   ├── alertmanager/             Slack receiver plus a webhook to the relay
│   ├── grafana/dashboards/       infra_health.json, auditstream.json
│   └── telegram_relay/           the bridge Alertmanager posts to
├── ansible/
│   ├── inventory.aws_ec2.yml     dynamic inventory, grouped by the Role tag
│   ├── playbooks/                setup_app, setup_monitoring, verify_stack
│   └── roles/                    docker_app, monitoring_stack, cloudwatch_agent
├── scripts/
│   ├── deploy.sh                 apply to healthy in one command
│   ├── destroy.sh                teardown, then 7 leftover checks
│   ├── generate_env.sh           app/.env from Terraform outputs
│   ├── setup_replica.sh          RDS to on-premises logical replication
│   ├── fetch_docker_certs.sh     the Docker TLS certs Portainer connects with
│   ├── update_ssh_config.sh      rewrites ~/.ssh/config for the new bastion
│   ├── package_lambdas.sh        zips the five functions with dependencies
│   ├── generate_report.py        incident report from DynamoDB
│   └── simulate_*.sh|.py         terminal versions of the attack demos
├── db/                           schema.sql, seed.sql, schema_from_rds.sql
├── tests/                        pytest on a SQLite file, no AWS needed
├── docs/                         the GitHub Pages landing page
└── .github/workflows/            ci.yml and cd.yml
```

---

## Security Controls

| Control | Where it lives | Trigger | Response |
|---|---|---|---|
| Request auditing | `middleware/audit_middleware.py` | Every request reaches the middleware. Only the health and metrics checks and the favicon skip it. | The middleware writes one row to the DynamoDB audit log. Each row records the request details and a severity level. |
| Role‑based access | `auth.require_role()` | A request reaches a route that declares required roles. | The route returns HTTP 403, and the middleware logs `doc_access_denied`. |
| Account suspension | `audit_middleware` | One account receives five access‑denied responses. | The middleware sets `users.suspended = true` and records an incident. Slack and Telegram receive the alert. |
| Download rate limit | `rate_limit.py` and `docs_router` | One IP requests more than 10 downloads in 60 seconds. | The route returns HTTP 429, and the middleware logs `rate_limit_hit`. |
| Exfiltration report | `audit_middleware` | An IP receives its first 429 on a `/docs/download` path. | The middleware writes a JSON report to the reports bucket and records an incident. One alert goes out for that IP. |
| Login failure tracking | `auth_router` | One IP fails to sign in five times and then eight times. | The route sends a warning alert at five failures and records an incident with a critical alert at eight. |
| Upload validation | `lambda/validate_file` | S3 reports `ObjectCreated:Put` on the docs bucket. | The Lambda reads the first 512 bytes of each upload. A blocked signature or size gets the object deleted and an incident recorded. |
| Automatic IP block | `lambda/block_ip` | A message arrives on the security‑alert SNS topic. | The Lambda inserts a DENY entry into the network ACL at the lowest free rule number between 1 and 99. |
| Presigned downloads | `services/s3_service.py` | A user downloads a document. | The service issues a URL with a 900‑second expiry, and a leaked link stops working quickly. |
| Password hashing | `auth.py` | A user registers or signs in. | The service hashes the password with SHA‑256 first and then with bcrypt at work factor 12. |
| Least‑privilege IAM | `terraform/iam.tf` | A Lambda function runs. | Two roles and four inline policies limit each function to the actions it needs. |

### Why the block uses a network ACL

A security group holds allow rules only and cannot express a deny. Network ACLs are stateless and ordered by rule number, and an automatic block needs both of those properties. `block_ip` reads the existing entries first. It then inserts a DENY for `<ip>/32` at the lowest free number between 1 and 99. Rule numbers 100 and above stay reserved for the ordinary allow rules.

---

## Detection to Response

```
request
  └─ AuditMiddleware (outermost layer, wraps every route)
       ├─ status 401 → login_failure    severity warning
       ├─ status 403 → doc_access_denied severity warning → count per account
       │                                   at 5: suspend + incident + notify
       ├─ status 429 → rate_limit_hit    severity warning
       │                on /docs/download: S3 report + incident + notify (once per IP)
       ├─ status 5xx → severity critical
       └─ every case  → DynamoDB audit-log row

incident record
  └─ DynamoDB incidents table
  └─ mirrored into the audit log as a critical `suspicious` event
  └─ Slack and Telegram through notify_all()

S3 upload
  └─ ObjectCreated:Put → validate_file Lambda → magic bytes → delete + incident on reject

SNS security-alert
  └─ block_ip Lambda      → NACL DENY entry
  └─ log_incident Lambda  → incidents table

SNS infra-alert
  └─ log_incident Lambda
  └─ email subscription
```

---

## Demo Scenarios

All five demos are admin‑only endpoints under `/demo`, and `DEMO_ENABLED` controls them. Each demo uses a seeded account and real HTTP calls. Every attack also has a terminal version in `scripts/` for runs where the app itself is under test.

| Act | Endpoint | Script | What it proves |
|---|---|---|---|
| 1 | `POST /demo/test-notification` | | The Slack and Telegram connections are live. |
| 2 | `POST /demo/credential-stuffing` | `simulate_credential_stuffing.sh` | Thirty login attempts with weak passwords return real 401s. The failure counter crosses both thresholds, and the alerts fire. |
| 3 | `POST /demo/access-control` | `simulate_access_control.sh` | A viewer account keeps requesting a document it does not own and receives real 403s. The fifth refusal suspends the account. |
| 4 | `POST /demo/exfiltration` | `simulate_exfiltration.py` | An editor downloads one real document until the limiter trips. The run ends in a 429. An S3 incident report and one alert follow. |
| 5 | `POST /demo/ddos` | `simulate_ddos.sh` | A concurrent burst against `/docs/list` raises the Prometheus request rate and the CPU. |

The demo sets `X-Forwarded-For` to `203.0.113.42` from the RFC 5737 range.

All demo endpoints require the admin role, and `DEMO_ENABLED=false` disables them.

---

## Monitoring and Alerting

Prometheus scrapes four jobs every 15 seconds. The node exporter and cAdvisor report on the on‑premises host. The other two jobs cover the EC2 nodes and the application's `/metrics` endpoint. The EC2 and application targets use file‑based service discovery, and `fetch_docker_certs.sh` rewrites those JSON files after each apply.

### Alert rules

| Alert | Expression | For | Severity |
|---|---|---|---|
| `HighCPU` | CPU above 80% | 2m | warning |
| `HighMemory` | memory above 85% | 2m | warning |
| `NodeDown` | `up{job="ec2-nodes"} == 0` | 1m | critical |
| `FastAPIDown` | `up{job="fastapi-app"} == 0` | 1m | critical |

Alertmanager groups alerts by name and instance as well as severity. Each group waits 30 seconds before it goes out, and an unresolved alert repeats every 4 hours. One receiver feeds Slack and a Telegram relay. An inhibit rule mutes the other three alerts on any instance reporting `NodeDown`.

The Slack webhook reaches Alertmanager through `/tmp/slack_url` and `slack_api_url_file` because the config file cannot expand environment variables.

### CloudWatch alarms

| Alarm | Watches | Action |
|---|---|---|
| `high-cpu` | ASG CPU above 80% for 2 periods | scale-out policy and the infra-alert topic |
| `instance-status-check` | EC2 status check failures | infra-alert topic |
| `alb-5xx-errors` | ALB 5xx count | infra-alert topic |
| `high-cpu-asg` | ASG CPU high | scale out |
| `low-cpu-asg` | ASG CPU low | scale in |

### Grafana

Grafana loads two provisioned dashboards. `infra_health` shows the node and container metrics, and `auditstream` shows the security events.

---

## Delivery

### CI on every push and every pull request to `main`

CI starts with flake8 and then pytest with a 50 percent coverage floor. A Docker build check that never pushes runs last. The build check runs the full multi‑stage Dockerfile and verifies the Vite frontend build as well.

### CD started by hand

```
build and push  mindmug/shimonvault-app:green  and  :green-<sha>   (amd64 and arm64)
      ↓
Slack: deployment started
      ↓
terraform apply -var deploy_green=true          green instance up, listener still on blue
      ↓
poll describe-target-health on the green target group, 40 attempts at 15s
      ↓
terraform apply -var deploy_green=true -var active_color=green      the switch
      ↓
retag :green as :blue
      ↓
Slack: complete, or failed with blue still live
```

`cd.yml` runs only on `workflow_dispatch` through `gh workflow run cd.yml --ref main`. CI still runs on every push because linting and testing cost nothing.

A `deploy-production` concurrency group runs deploys one at a time without cancelling any.

The listener moves through a Terraform variable. A CLI call would leave the change outside state, and the next apply would return traffic to blue.

A rollback is the same apply with `active_color=blue`. It goes through the same variable and leaves no drift behind.

---

## API Reference

| Method | Path | Role | Notes |
|---|---|---|---|
| POST | `/auth/register` | public | New accounts start with the viewer role. |
| POST | `/auth/login` | public | Each IP can try 10 times per minute. |
| POST | `/auth/logout` | any | The client discards its token. |
| POST | `/docs/upload` | admin, editor | S3 triggers `validate_file` on each upload. |
| GET | `/docs/list` | any | |
| GET | `/docs/download/{doc_id}` | any | Each IP can download 10 times per 60 seconds through a presigned URL. |
| DELETE | `/docs/{doc_id}` | admin, editor | The document is soft‑deleted. |
| GET | `/docs/{doc_id}/versions` | any | |
| POST | `/meetings/create` | admin, editor | The meeting receives a random join token. |
| GET | `/meetings/list` | any | |
| GET | `/meetings/{id}` | participant | |
| PUT | `/meetings/{id}` | organizer | |
| DELETE | `/meetings/{id}` | organizer | The meeting is cancelled. |
| POST | `/meetings/{id}/join` | participant | A join token is required. |
| GET | `/meetings/{id}/archive` | organizer | The route returns the attendance record. |
| GET | `/audit/feed` | admin | The route returns the live AuditStream. |
| GET | `/audit/incidents` | admin | |
| GET | `/audit/my-activity` | any | Each user sees only their own events. |
| GET | `/admin/metrics/summary` | admin | The route returns the headline numbers. |
| GET | `/admin/metrics/timeseries` | admin | The route returns counts per minute. |
| GET | `/admin/metrics/infra` | admin | The route reads from the Prometheus HTTP API. |
| POST | `/demo/*` | admin | Four attacks and a notification test run here, and `DEMO_ENABLED` controls them. |
| GET | `/health` | public | The route always returns 200, and its `db` field carries the real state. |
| GET | `/metrics` | public | The route serves metrics in Prometheus format. |

### Why `/health` returns 200 before the database is ready

RDS takes 30 to 60 seconds to answer after the instance boots, and the ALB marks a target unhealthy long before that. `init_db()` runs in a background thread with 20 retries at 15‑second intervals. `/health` answers 200 right away. Its `db` field starts at `initialising` and changes to `ok` or to the error text. The ALB reads the status code, and an operator reads the body.

---

## Data Model

All five PostgreSQL tables use UUID primary keys.

| Table | Holds |
|---|---|
| `users` | email, username, bcrypt hash, role, `is_active`, `suspended` |
| `documents` | filename, S3 key, content type, size, version, parent version, owner, status |
| `meetings` | title, organizer, join token, status, scheduled and end times, EventBridge rule name |
| `participants` | meeting, user, attended flag, join time |
| `audit_events` | event type, user, IP, resource, detail JSON, severity, timestamp |

DynamoDB holds three tables, and all three use on‑demand billing:

| Table | Keys | Notes |
|---|---|---|
| `audit-log` | `id` / `created_at` | It has a GSI on `event_type` and a 90‑day TTL. |
| `incidents` | `id` / `created_at` | It holds the dedicated incident view. |
| `meetings` | `meeting_id` | The two meeting Lambdas read it. |

The audit middleware writes to DynamoDB, and the security console reads its feed from there. The PostgreSQL models also define an `audit_events` table for future relational reports.

### Read and write split

`WRITE_DB_URL` points at the RDS primary and takes every write. `READ_DB_URL` points at the on‑premises replica on `proj-ubuntu01:5433` and serves the read‑only routes. Both engines start lazily with `pool_pre_ping`. Connections recycle every 30 minutes and time out after 10 seconds. `setup_replica.sh` builds the subscription over Tailscale and reaches RDS through a socat relay on the app instance.

The URL scheme must be `postgresql+psycopg2`. `asyncpg` fails at runtime instead of at import, and its `MissingGreenlet` error says nothing about the driver.

---

## Configuration

`generate_env.sh` writes `app/.env` from the Terraform outputs after every apply.

### Application environment

| Group | Variables |
|---|---|
| Identity | `PROJECT_NAME`, `APP_VERSION`, `ENVIRONMENT` |
| Database | `WRITE_DB_URL`, `READ_DB_URL` |
| Auth | `JWT_SECRET_KEY`, `JWT_ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES` |
| AWS | `AWS_REGION`, `AWS_ACCOUNT_ID` |
| S3 | `S3_BUCKET_DOCS`, `S3_BUCKET_REPORTS`, `S3_PRESIGNED_URL_EXPIRY` |
| DynamoDB | `DYNAMODB_AUDIT_TABLE`, `DYNAMODB_INCIDENTS_TABLE`, `DYNAMODB_MEETINGS_TABLE` |
| SNS | `SNS_TOPIC_SECURITY_ALERT`, `SNS_TOPIC_INFRA_ALERT`, `SNS_TOPIC_MEETING_REMINDERS` |
| Notifications | `SLACK_WEBHOOK_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |
| Monitoring | `PROMETHEUS_URL` |
| Rate limits | `RATE_LIMIT_LOGIN`, `RATE_LIMIT_DOWNLOAD`, `RATE_LIMIT_DEFAULT` |
| Demo | `DEMO_ENABLED`, `DEMO_BASE_URL`, `DEMO_ATTACKER_IP`, `DEMO_*_ATTEMPTS` |

### GitHub Actions secrets

| Secret | Where it comes from |
|---|---|
| `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` | The IAM user's security credentials |
| `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` | A Docker Hub access token |
| `DB_PASSWORD` and `JWT_SECRET_KEY` | The same values as `terraform.tfvars` |
| `SLACK_WEBHOOK_URL` | A Slack incoming webhook |
| `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` | BotFather, followed by `getUpdates` |
| `ALERT_EMAIL` and `YOUR_IP_CIDR` | The SNS email subscription and the bastion rule |
| `TAILSCALE_AUTH_KEY` and `ONPREM_TAILSCALE_IP` | The Tailscale admin console |
| `SSH_PUBLIC_KEY` | The public half of the deploy key |

Secrets reach Terraform as job‑level `TF_VAR_` values.

### Demo accounts

`db/seed.sql` creates one account per role. Each address follows the pattern `<role>@shimonvault.com`. These demo credentials belong to a build that is destroyed after every session, and the demo router reads them from the environment.

---

## Tech Stack

- **Cloud:** AWS runs every layer of the platform, and network ACLs carry the automatic block.
- **Hybrid connectivity:** A Tailscale mesh joins AWS and the on‑premises hosts.
- **DNS and TLS:** Cloudflare serves DNS without its proxy, and ACM provides the ALB certificate through the same DNS zone.
- **IaC:** Terraform 1.7 keeps its state in an S3 backend with a DynamoDB lock.
- **Configuration management:** Ansible configures the hosts through a dynamic EC2 inventory.
- **Containers:** Docker builds a multi‑stage image for amd64 and arm64 and pushes it to Docker Hub.
- **Application:** FastAPI runs on Python 3.12 with SQLAlchemy for data access and slowapi for rate limits. python‑jose and passlib handle tokens and password hashing.
- **Frontend:** React and Vite drive the interface, and Chart.js renders the console charts.
- **Database:** PostgreSQL 16 runs on RDS and replicates to an on‑premises copy.
- **Monitoring:** Prometheus and Grafana watch the platform with metrics from the node exporter and cAdvisor. Alertmanager routes the alerts, and Portainer manages the containers.
- **Alerting:** Slack and Telegram carry every alert to the operator.
- **CI/CD:** GitHub Actions runs the pipeline, and a Terraform variable handles the blue/green switch.

---

## Testing

```bash
cd app && pip install -r requirements.txt pytest pytest-cov && cd ..
pytest tests/ -v
```

Tests use a SQLite file and no AWS credentials. `conftest.py` prepares the environment and overrides both database dependencies. It also bypasses the rate limiter.

CI enforces 50 percent coverage. Authentication tests cover registration and login with their failure cases. Audit tests check what the middleware logs and who can read incidents.

---

## Roadmap

Detection and alerting are complete, as are account suspension and incident reporting. The roadmap below builds on them.

- **Automatic IP blocking.** `block_ip` is deployed and subscribed to the security‑alert topic. Its IAM permissions are in place as well. An SNS publish at the eighth failed login and a `NACL_ID` value would complete it.
- **Shared counters.** All three detection counters live in memory inside the application. Moving them to Redis or DynamoDB would let two instances share one count and keep it through a restart.
- **A wider test suite.** The 15 tests cover authentication and auditing. Real tests for documents and meetings are next in line for `tests/test_docs.py` and `tests/test_meetings.py`.
- **A quarantine step for uploads.** `validate_file` checks each file after it lands on `ObjectCreated:Put`. A quarantine bucket with a promotion step would check files before they reach the docs bucket.
- **Meeting reminders.** `eventbridge_service.py` and the two meeting Lambdas are in place. Calling the scheduler from `/meetings/create` would turn on the reminder and the attendance archive.
- **Service discovery for Prometheus.** `fetch_docker_certs.sh` rewrites `targets/*.json` after each apply. EC2 service discovery would remove that step.

### One bug worth recording

The bulk download simulation never produced a 429 while it requested 50 different document IDs. It produced one right away when it requested the same ID repeatedly. slowapi's default `key_style="url"` keys the counter on the resolved URL, and `/docs/download/doc-0001` and `/docs/download/doc-0002` count as different keys. Neither ever reaches two. Setting `key_style="endpoint"` keys the counter on the route function, and every `{doc_id}` shares that key. The limiter had decorated the route correctly the whole time and had counted the wrong thing.
