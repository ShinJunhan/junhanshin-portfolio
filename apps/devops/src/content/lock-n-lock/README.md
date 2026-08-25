# Security Event Detection and Automated Response Cloud Infrastructure for a Financial Service

### 🗨️ Project Introduction

>
>
>
> This project deploys a financial-service demo application as containers in an AWS cloud environment, and builds a DevSecOps system that automates operational security — detecting, visualising, alerting on, and responding to security events such as login failures and a flood of transfer requests, in real time.
>
> It is not web-service development. The focus is on detecting the abnormal traffic and security events that can occur while a service is running in a cloud environment, and connecting that detection through to automated response and recovery.
>

Beyond deploying a service, it builds a cloud operational-security platform that detects, responds to, and recovers from security events automatically.

### 💠 Team Name

- Lock & Lock

### 💠 Members

- Junhan Shin (Team Lead), Jeongeun Park, Jiyoon Lee, Jongwon Lim, Sangwoo Choi

### 💠 Division of Roles

`Each member's role and responsibilities`

- Junhan Shin / Jeongeun Park: AWS build-out, Terraform code, Security Group design, Auto Scaling integration review
- Sangwoo Choi / Jongwon Lim: FastAPI financial demo (login, balance, transfer), PostgreSQL integration, Prometheus custom metrics, Dockerfile + Ansible
- Jongwon Lim / Junhan Shin: GitHub Actions, Docker Hub / GHCR integration, Blue-Green deployment structure, SAST (Bandit) + Trivy + DAST (ZAP) + workflow integration
- Jiyoon Lee / Jeongeun Park: Prometheus, Grafana, Alertmanager, Telegram integration, dashboard build, alert rules
- Jeongeun Park / Jiyoon Lee: Locust load and attack scenarios, Nginx rate limiting, fail2ban, security event validation, detection → alert → response flow testing, health checks, cutover and rollback scripts


# Lock & Lock — Automated Security Response System for a Financial Service

A hybrid (on-premises ↔ AWS) security response system built on three core values: **security**, through automatic malicious-IP blocking and vulnerability-scan gates (the four-layer lock); **cost and availability**, through autoscaling that follows traffic load; and **operational stability**, through policy-driven automated response with state verification and recovery logging.

---

## Team & Tracks

| Track | Area | main / sub | Directory |
|------|------|------------|----------|
| A | Infrastructure · IaC | Junhan Shin / Jeongeun Park | `infra/terraform`, `infra/ansible` |
| B | App service · Containers | Sangwoo Choi / Jongwon Lim | `app/` |
| C | CI/CD · DevSecOps | Jongwon Lim / Junhan Shin | `.github/workflows`, `scripts/` |
| D | Monitoring · Alerting · Recovery | Jiyoon Lee / Jeongeun Park | `monitoring/` |
| E | Security scenarios · Response | Jeongeun Park / Jiyoon Lee | `security/` |

---

## 🚀 Getting Started (initial environment setup)

On proj-mgmt (VMware, Rocky 8), run the three scripts below in order.
**For the detailed procedure, prerequisites and troubleshooting, see [docs/guides/setup-guide.md](./docs/guides/setup-guide.md).**

```bash
cd ~/project2-security
chmod +x setup.sh check.sh bootstrap_tailscale.sh   # first time only
bash setup.sh             # ① install tooling + AWS credentials + Docker Hub login
./bootstrap_tailscale.sh  # ② Tailscale connection (node-to-node L3)
make check                # ③ environment check
```

| Script | Role |
|---|---|
| `setup.sh` | Installs AWS CLI, Terraform, Ansible, Docker + registers AWS credentials and Docker Hub |
| `bootstrap_tailscale.sh` | Tailscale hybrid connection (node-to-node L3) |
| `check.sh` | Checks tooling, credentials and connectivity |

> Once setup is complete, item `[4] Tailscale` in `make check` showing ✅ means everything is in order. See the [guide](./docs/guides/setup-guide.md) for the detailed procedure.

---

## Deployment (Terraform + Ansible + Monitoring)

Provision after the initial environment setup (`setup.sh`) is complete.
State uses a **per-person S3 backend + DynamoDB lock**, so the backend resources are created once through `init/`.

```bash
# ① (first time only) create the S3 bucket and DynamoDB lock table for state
cd infra/terraform/init
terraform init && terraform apply
terraform output s3_bucket_name        # note your own bucket name

# ② write backend.hcl (enter your own bucket name; gitignored)
cd ..
cp hcl/backend.hcl.example hcl/backend.hcl
#   put the bucket name from ① into bucket = "..." in hcl/backend.hcl

# ③ infrastructure + app + DB in one go
make init           # terraform init -backend-config=hcl/backend.hcl
make service        # build and push image → create infrastructure (app self-starts) → deploy DB container
make output         # print Bastion, EC2 IPs, ARNs

# ④ monitoring stack (local to proj-mgmt, requires sudo)
make monitoring-service   # Prometheus/Grafana/Loki/Alertmanager + nginx logs (:9105)

# ③ + ④ all at once
make full-service   # infrastructure + DB + monitoring together
```

### Individual commands

| Command | Description |
|---|---|
| `make apply` / `apply-auto` | Create infrastructure only (app self-starts via user_data) |
| `make deploy-db` | Deploy the replica DB container (after apply) |
| `make service` | build-push + apply-auto + deploy-db |
| `make monitoring-service` | Monitoring + nginx logs (:9105) |
| `make full-service` | Infrastructure + DB + monitoring, all of it |

### Teardown (required after each session)

```bash
make destroy        # delete monitoring (AWS + containers) + DB + all infrastructure
```

What `make destroy` does:
1. `monitoring teardown-force` — deletes the AWS resources bootstrap created (Lambda, IAM, CloudWatch alarms, SNS subscriptions); the SNS topic is left to Terraform
2. `monitoring destroy` — monitoring containers and volumes
3. `destroy-db` — replica DB stack (containers, volumes)
4. `terraform destroy` — VPC, EC2, ASG and the rest of the infrastructure

Partial teardown: `make destroy-db` (replica only), `cd monitoring && make teardown` (dry-run check of the AWS resources).

> ⚠️ Personal AWS account → always run `make destroy` after a session.
> `hcl/backend.hcl` and `infra/ansible/group_vars/database.yml` hold personal values and are gitignored → copy each from its `.example`.

---

## Directory Structure

```
project2-security/
├── README.md             # this document
├── setup.sh              # initial environment install script
├── check.sh              # environment check script
├── bootstrap_tailscale.sh# Tailscale node-to-node (L3) connection script
├── Makefile              # shortcuts for terraform and environment commands
├── docs/                 # design documents, diagrams, guides
│   ├── network-design.md # network design (CIDR and SG matrix) — Track A deliverable
│   ├── guides/           # per-track code walkthroughs + setup-guide.md
│   └── diagrams/         # architecture diagrams
├── infra/
│   ├── terraform/        # Track A — VPC, subnets, EC2, SGs (IaC)
│   └── ansible/          # Tracks A and B — configuration management
├── app/                  # Track B — FastAPI, Dockerfile, DB schema
├── monitoring/           # Track D — prometheus, grafana, alertmanager
├── security/             # Track E — locust, rate limiting, security policy
├── scripts/              # Track C — build-push-image.sh, deploy-app.sh, set-fail2ban.sh
└── .github/workflows/    # Track C — GitHub Actions (fixed path)
```

> `.github/workflows/` is a path GitHub Actions requires. Track C's workflow YAML must live there, and its deployment scripts in `scripts/`.

---

## Branch Strategy & PR Flow

```
feature/<track>-<topic>  →  dev (reviewed and merged by Jongwon Lim)  →  main (final approval by Junhan Shin)  →  automatic deployment
```

- **main**: the production branch. CI/CD deploys automatically on a push to main.
- **dev**: the integration branch. The day-to-day PR review and merge gate.
- **feature/**: personal working branches. No protection rules, so commit and push freely.

Track prefixes: `a` (infrastructure), `b` (app), `c` (CI/CD), `d` (monitoring), `e` (security).
For example: `feature/a-vpc`, `feature/b-login-api`, `feature/d-grafana`

**Protection rules in force (main and dev alike)**: PR required · at least one approving review · every review comment resolved · re-review required after a new commit lands on an approved PR · force pushes and branch deletion blocked.

> When opening a PR, set the base branch to **dev** (not main).

---

## Code Guide Document Rules

Each owner writes a guide in `docs/guides/` explaining how their own code works.

- **Naming**: `<track-letter-lowercase>-<area>.md` (for example `a-infra-terraform.md`)
- **Template**: copy `docs/guides/_TEMPLATE.md`
- **Required section**: "Interfaces with other tracks" — state what you take as input and what you publish as output

---

## Tech Stack

- Cloud: AWS (VPC, EC2, ASG, CloudWatch, SG/NACL, ALB, Route 53, ACM, S3)
- Hybrid connectivity: Tailscale (node-to-node L3, zero public ports)
- Containers: Docker, Docker Compose
- App: FastAPI + PostgreSQL
- Reverse proxy: Nginx
- IaC: Terraform, Ansible
- CI/CD: GitHub Actions, Docker Hub
- Monitoring: Prometheus, Grafana, Alertmanager / Alerting: Telegram, Slack
- Load and attack simulation: Locust
- DevSecOps (the four-layer lock): Bandit (SAST), Trivy (image), OWASP ZAP (DAST), fail2ban and Nginx rate limiting (runtime)

---
## GitHub Actions Secrets
#### Environment secrets
| Name | Description |
| --- | --- |
| `ACCESS_KEY` | AWS access key |
| `SECRET_KEY` | AWS secret key |
| `CF_TOKEN` | Cloudflare token |
| `DOMAIN` | Owned domain |
| `IP` | Allowed IP range |
| `MY_BUCKET` | S3 bucket name |
| `MY_TABLE` | DynamoDB table |
| `TAILNET` | Tailscale account |
| `TS_API_KEY` | Tailscale key |

#### Repository secrets
| Name | Example value |
| --- | --- |
| `DB_PASSWORD` | DB password |
| `DOCKERHUB_USERNAME` | Docker Hub ID |
| `DOCKERHUB_TOKEN` | Docker Hub token |
