# project1-aws: AWS-Based Self-Healing Infrastructure

Run this code in your own AWS account and the same infrastructure is built automatically, including **automatic recovery when a failure occurs**.

> 🎯 **Project Purpose**
> Implement, as infrastructure-as-code, a system that "detects a failure and recovers on its own, without an operator being paged."
> On-premises (VMware) learning → AWS automation → hybrid integration → self-healing infrastructure.

## ✨ Key Features

- **🔄 Self-Healing.** When a Prometheus alert fires, the Recovery Controller automatically runs an Ansible-based recovery script, with verification and up to 3 retries
- **🏗️ Full IaC.** 41 Terraform resources and 8 Ansible roles, deployed with a single `make apply` command (~10 min)
- **📊 Integrated Monitoring.** Prometheus, Grafana and AlertManager (5s scrape interval, 5s alert-for duration)
- **🔔 Separated Alerting.** Slack channels split by role: `#monitoring` (failure detection) / `#recovery` (recovery results)
- **🌐 Hybrid Networking.** Tailscale VPN unifying management of VMware (proj-mgmt) ↔ AWS
- **💰 Cost Optimization.** A NAT Instance carries outbound traffic at lower cost and better response time
- **🎬 Demo-Friendly.** Inject a failure and validate the full self-healing flow with one command via `chaos/inject.sh` (MTTD 5–10s, MTTR 30–60s)

## 📚 Documentation Guide

| Document | Purpose |
|---|---|
| README.md | This file, covering the project overview and quick start |
| setup_manual.md | Step-by-step **first deployment** manual (from installing Terraform/Ansible/Tailscale) |
| DEMO.md | **Demo** guide (automated `chaos/inject.sh` scenarios) |
| Chaos_Demo_Guide.md | **Grafana observation points** + detailed chaos scenarios (SRE perspective) |
| Git_workflow.md | **Git collaboration** workflow (branch strategy + PR process) |

---

## 🚀 Quick Start

> First time using this? Follow **setup_manual.md** instead. The flow below assumes your environment is already set up.

```bash
# 1. Get the code
git clone git@github.com:EchoChallengers/project1-aws.git
cd project1-aws
git checkout dev

# 2. Tailscale VPN (one-time)
TAILSCALE_AUTHKEY=tskey-auth-xxxxx ./bootstrap_tailscale.sh

# 3. Register AWS credentials + Slack URL
aws configure
cp ansible/group_vars/secrets.yml.example ansible/group_vars/secrets.yml
vi ansible/group_vars/secrets.yml   # enter Slack URL + DB password

# 4. Pre-deployment environment check
./check.sh

# 5. Deploy
make init
make apply   # runs Terraform + Ansible together (~10 min)

# 6. Manually import the Grafana dashboard
# Grafana UI (http://[MGMT-IP]:3000) → Dashboards → Import
# → paste the contents of grafana-dashboard.json

# 7. Demo (see DEMO.md / Chaos_Demo_Guide.md for detailed scenarios)
./chaos/inject.sh status        # overall service status
./chaos/inject.sh nginx1        # Nginx-down scenario
./chaos/inject.sh exporter1     # Nginx Exporter-down scenario
./chaos/inject.sh cpu_both      # CPU load (both servers at once)
./chaos/inject.sh memory1       # Memory load scenario

# 8. Clean up after use (required!)
make destroy
```

---

## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [📚 Documentation Guide](#-documentation-guide)
- [🚀 Quick Start](#-quick-start)
- [🏗️ Architecture](#️-architecture)
- [🔄 Self-Healing Flow](#-self-healing-flow)
- [📁 Folder Structure](#-folder-structure)
- [👥 Team Composition & Roles](#-team-composition--roles)
- [🌱 Git Collaboration Workflow](#-git-collaboration-workflow)
- [🚀 Getting Started (First Time)](#-getting-started-first-time)
- [⚙️ Infrastructure Deployment](#️-infrastructure-deployment)
- [🔍 Demo & Verification](#-demo--verification)
- [🛠️ Failure Scenario Demo](#️-failure-scenario-demo)
- [🔐 Security Configuration](#-security-configuration)
- [❗ Troubleshooting](#-troubleshooting)

---

## 🏗️ Architecture

### Overall Infrastructure Layout (Hybrid)

```
  VMware (On-premise)                       AWS (ap-northeast-2)
  ┌─────────────────────┐                   ┌──────────────────────────────────────────┐
  │  proj-mgmt           │                  │  VPC  10.0.0.0/16                        │
  │  172.16.1.x          │◄── Tailscale ───►│                                          │
  │  (Ansible exec node) │     VPN          │   ┌──────────────┐  ┌──────────────┐    │
  └─────────────────────┘                   │   │ Public AZ1   │  │ Public AZ2   │    │
                                            │   │ 10.0.1.0/24  │  │ 10.0.2.0/24  │    │
                                            │   │              │  │              │    │
                                            │   │  aws-web1    │  │  aws-web2    │    │
                          Internet          │   │  Nginx+API   │  │  Nginx+API   │    │
                            │               │   │  +Exporter   │  │  +Exporter   │    │
                            ▼               │   └──────┬───────┘  └──────┬───────┘    │
                   ┌──────────────┐         │          │                 │             │
                   │     ALB      │─────────┼──────────┴─────────────────┘             │
                   │  (HTTP :80)  │         │                                          │
                   └──────────────┘         │   ┌──────────────────────────────────┐  │
                                            │   │ Public AZ1                       │  │
                                            │   │  aws-mgmt  (Prometheus :9090)    │  │
                                            │   │            (Grafana :3000)        │  │
                                            │   │            (AlertManager :9093)   │  │
                                            │   │            (Recovery :5001)       │  │
                                            │   │  NAT instance ← Private Internet  │  │
                                            │   └──────────────┬───────────────────┘  │
                                            │                  │                       │
                                            │   ┌──────────────▼───────────────────┐  │
                                            │   │ Private Subnet  10.0.11.0/24     │  │
                                            │   │  aws-db  (PostgreSQL 16 :5432)   │  │
                                            │   │          (Node Exporter :9100)   │  │
                                            │   └──────────────────────────────────┘  │
                                            └──────────────────────────────────────────┘
```

### On-Premises and AWS: Key Differences

| Item | On-Premises (VMware) | AWS |
|---|---|---|
| Load balancer | HAProxy (manually installed) | ALB (managed) |
| NAT | n/a | NAT Instance (cost savings against a NAT Gateway) |
| DB location | Host-only `172.16.1.x` | Private Subnet `10.0.11.x` |
| SSH key | `project.pem` (manually generated) | `proj-key.pem` (auto-generated by Terraform) |
| Network | VMware Host-only | VPC / Subnet (split across AZs) |
| IP management | Static IP | Determined dynamically via Terraform output |
| DB access | Direct connection | Via mgmt as a jump host |
| External exposure | Cloudflare Tunnel | ALB DNS |
| Hybrid connectivity | n/a | Tailscale VPN (proj-mgmt ↔ AWS) |

---

## 🔄 Self-Healing Flow

```
  [Failure occurs]
      │
      ▼
  Exporter (node_exporter :9100 / nginx_exporter :9113)
      │  metric collection (scrape interval: 5s)
      ▼
  Prometheus
      │  alert rule evaluation (for: 5s)
      ├──► Slack #monitoring  (failure-detected alert, grouped by alertname+instance)
      │
      ▼
  AlertManager (group_wait: 5s, group_interval: 30s)
      │  webhook → Recovery Controller :5001
      ▼
  Recovery Controller (Flask / app.py)
      │  looks up recovery_map.yml → determines the recovery script
      ▼
  recover_*.sh (executed remotely via Ansible)
      │  run → verify → retry up to 3 times on failure
      ▼
  Slack #recovery  (recovery result: SUCCESS / FAILED / NO_MAP)
      │
      ▼
  [Alert resolved → back to normal]
```

### Self-Healing Scenario Matrix

| Scenario | Alert Condition | Recovery Script | Recovery Method |
|---|---|---|---|
| **NginxDown** | `nginx_up == 0` | `recover_nginx.sh` | `systemctl restart nginx` |
| **NginxExporterDown** | `up{job="nginx-exporters"} == 0` | `recover_nginx_exporter.sh` | restart nginx_exporter |
| **HighCPU** | `CPU > 80%` / severity: critical | `recover_cpu.sh` | `pkill -x stress-ng` + verify |
| **HighMemoryUsage** | `Memory > 70%` / for: 5s | `recover_memory.sh` | `pkill -x stress-ng` + verify |

> ⭐ **The `pkill -x` pattern:** `pkill -f` also matches the Ansible shell command line's own text, which can terminate the recovery command itself. That is a self-termination trap, and `pkill -x` avoids it by matching the exact process name only.

### Measured Results (Demo Environment)

| Metric | Value | Notes |
|---|---|---|
| **MTTD** (time to detect) | 5–10s | Prometheus scrape 5s + alert-for 5s |
| **MTTR** (time to full recovery) | 30–60s | Ansible execution + verify |

---

## 📁 Folder Structure

```
project1-aws/
├── setup.sh                        ← auto-installs AWS CLI + Terraform + Ansible
├── bootstrap_tailscale.sh          ← installs Tailscale + advertises subnet routes
├── check.sh                        ← pre-deployment environment check (5 steps)
├── Makefile                        ← shortcuts for common commands
├── README.md                       ← this file
├── DEMO.md                         ← demo guide
├── Chaos_Demo_Guide.md             ← Grafana observation points + SRE-perspective guide
├── setup_manual.md                 ← step-by-step first-deployment manual
├── Git_workflow.md                 ← Git collaboration workflow
├── grafana-dashboard.json          ← JSON for manually importing the Grafana dashboard
│                                      (job-based dynamic queries, no hardcoded IPs)
│
├── ansible/
│   ├── site.yml                    ← Ansible entry point
│   ├── playbooks/
│   │   ├── db.yml                  ← DB server playbook
│   │   ├── web.yml                 ← web server playbook
│   │   └── mgmt.yml               ← management server playbook (includes monitoring)
│   ├── group_vars/
│   │   ├── all.yml                 ← shared variables (tracked in GitHub)
│   │   ├── secrets.yml             ← Slack URL, DB password (gitignored)
│   │   └── secrets.yml.example    ← example for writing secrets.yml
│   └── roles/
│       ├── common/                 ← creates user1, vim/motd, timezone
│       ├── fastapi/                ← deploys the Python app (systemd)
│       ├── nginx/                  ← Nginx reverse proxy + virtual hosts
│       ├── postgresql/             ← PostgreSQL + pg_hba.conf + table creation
│       ├── node_exporter/          ← OS metrics collector (port 9100)
│       ├── nginx_exporter/         ← Nginx metrics collector (port 9113)
│       ├── chaos/                  ← installs stress-ng/stress/htop demo tools
│       └── monitoring/             ← Prometheus + Grafana + AlertManager
│           ├── files/
│           │   ├── alert.rules.yml           ← alert rules (4 total)
│           │   └── grafana_dashboard.json    ← dashboard JSON for Ansible auto-deploy
│           └── templates/
│               ├── prometheus.yml.j2         ← Prometheus config (5s scrape)
│               ├── alertmanager.yml.j2       ← AlertManager config (Slack integration)
│               └── *.service.j2             ← systemd service files
│
├── terraform/
│   ├── main.tf                     ← full infrastructure definition
│   │                                  (VPC, Subnet, IGW, Route Table, SG,
│   │                                   NAT Instance, ALB, Target Group,
│   │                                   4x EC2, IAM, Key Pair)
│   ├── variables.tf                ← AMI, instance type, region, etc.
│   ├── outputs.tf                  ← IP/DNS output + auto-generates inventory.yml
│   ├── backend.tf                  ← specifies local state
│   └── .gitignore                  ← excludes *.pem, inventory.yml, tfstate
│
├── chaos/
│   ├── inject.sh                   ← failure-injection script (4 main scenarios)
│   └── reference/
│       └── inject.sh               ← legacy scenarios preserved (benchmarks, etc.)
│
└── recovery/
    └── controller/
        ├── app.py                  ← Flask webhook server (port 5001)
        ├── config/
        │   └── recovery_map.yml   ← alert-to-recovery-script mapping policy
        └── scripts/
            ├── recover_nginx.sh           ← restarts Nginx
            ├── recover_nginx_exporter.sh  ← restarts the exporter
            ├── recover_cpu.sh             ← clears CPU load (pkill -x stress-ng)
            ├── recover_memory.sh          ← clears memory load (pkill -x stress-ng)
            ├── recover_db.sh              ← restarts the DB service
            ├── recover_service.sh         ← general-purpose service restart
            └── recover_fail_test.sh       ← for testing failure scenarios
```

---

## 👥 Team Composition & Roles

| Role | Member | Main Responsibilities |
|---|---|---|
| **Team Lead / Overall Coordination** | Hwijeong Cho | `main` branch management, PR review, presentation |
| **Infrastructure Build + PR Owner** | Junhan Shin | `terraform/`, `ansible/roles/common,chaos/`, `bootstrap_tailscale.sh`, `check.sh`, review/merge of `dev`-branch PRs |
| **Self-Healing System** | Jiyoon Lee | `recovery/`, stabilizing the alert flow, `recover_*.sh`, AlertManager integration |
| **Monitoring + Grafana** | Mingyu Kim | `ansible/roles/monitoring/`, `grafana-dashboard.json`, `chaos/inject.sh`, alert rules |
| **Exporters + Documentation** | Jiwoo Han | `ansible/roles/node_exporter,nginx_exporter/`, meeting-note archiving, documentation |

### Branch Strategy

```
main ──────────●────────────●────────────  (Hwijeong Cho, protected branch for release and presentation)
               ▲            ▲
               │ PR         │ PR
               │            │
dev ───────────●────●────●──●────────────  (Junhan Shin, PR Owner, integration development)
               ▲    ▲    ▲
               │    │    │ PR
               │    │    │
feature/* ─────●────●────●───────────────  (Jiwoo Han, Jiyoon Lee, Mingyu Kim)
fix/*      ────●────●────────────────────
docs/*     ────●─────────────────────────
```

**Principles:**
- `main`: only fully verified code (only Hwijeong Cho has merge rights)
- `dev`: integration and testing branch (Junhan Shin, PR Owner, who reviews, merges and syncs)
- `feature/fix/docs/*`: individual working branches → PR into `dev`

**PR Owner checklist:**
- Check the scope of changed files + potential for conflicts
- Security review (Slack URLs, Jinja2 escaping, `secrets.yml` gitignore status)
- Sync with `dev` + check `git log --oneline` before merging
- Notify the team (Discord)

---

## 🌱 Git Collaboration Workflow

> See **Git_workflow.md** for full details.

### 🔹 STEP 1 · One-time: Clone the Repository

```bash
# Confirm your SSH key is registered
ssh -T git@github.com

# Clone
git clone git@github.com:EchoChallengers/project1-aws.git
cd project1-aws

git config user.name "your name"
git config user.email "you@email.com"

git branch -a
```

### 🔹 STEP 2 · Starting Work: Create a Branch

```bash
# Update dev to the latest
git checkout dev
git pull origin dev

# Create a feature branch
git checkout -b feature/task-name
# e.g.: git checkout -b feature/add-memory-recovery
#       git checkout -b fix/alertmanager-grouping
#       git checkout -b docs/update-readme
```

**Branch naming convention:**

| Type of work | Prefix | Example |
|---|---|---|
| New feature | `feature/` | `feature/add-grafana-dashboard` |
| Bug fix | `fix/` | `fix/alertmanager-grouping` |
| Documentation | `docs/` | `docs/update-readme` |
| Refactor | `refactor/` | `refactor/extract-vpc-cidr` |

### 🔹 STEP 3 · Commit + Push + PR

```bash
git add <changed files>
git commit -m "feat: add automatic memory recovery script

- wrote recover_memory.sh (pkill -x stress-ng)
- added HighMemoryUsage mapping to recovery_map.yml"

git push origin feature/task-name
```

**Commit message convention:** `feat:` / `fix:` / `docs:` / `refactor:` / `chore:`

Creating a PR on GitHub:
- base: **`dev`** (never `main`)
- Title: same pattern as the commit message
- Reviewed and merged by the PR Owner (Junhan Shin)

---

## 🚀 Getting Started (First Time)

> See **setup_manual.md** for full details.

### 🔹 STEP A · Install Required Tools

```bash
./setup.sh
# auto-installs AWS CLI + Terraform + Ansible
# restart your terminal after installation
```

### 🔹 STEP B · Set Up Tailscale VPN

```bash
TAILSCALE_AUTHKEY=tskey-auth-xxxxx ./bootstrap_tailscale.sh
# recommend enabling "Pre-approved" in the Tailscale Admin Console

# confirm subnet routing
sudo tailscale status
ip route | grep "172.16"
```

### 🔹 STEP C · AWS Credentials

```bash
aws configure
# Access Key ID:     (issued from your IAM account)
# Secret Access Key: (issued from your IAM account)
# Default region:    ap-northeast-2
# Default output:    json

aws sts get-caller-identity   # confirm the connection
```

### 🔹 STEP D · Register Slack Webhooks

```bash
cp ansible/group_vars/secrets.yml.example ansible/group_vars/secrets.yml
vi ansible/group_vars/secrets.yml
```

```yaml
# example secrets.yml
slack_webhook_monitoring: "https://hooks.slack.com/services/xxx/yyy/zzz"
slack_webhook_recovery:   "https://hooks.slack.com/services/xxx/yyy/zzz"
grafana_admin_password:   "your-secure-password"
db_password:              "your-db-password"
```

### 🔹 STEP E · Pre-Deployment Environment Check

```bash
./check.sh
```

Checklist:
- ✅ AWS CLI installed + credentials configured
- ✅ Terraform installed
- ✅ Ansible installed
- ✅ Tailscale connected + subnet routing active
- ✅ `secrets.yml` present + region set to `ap-northeast-2`

Once everything is ✅, move to the next step.

---

## ⚙️ Infrastructure Deployment

### 🔹 STEP F · Run Terraform + Ansible

```bash
make init     # initialize Terraform
make plan     # preview changes (doesn't apply anything)
make apply    # provision infrastructure + auto-run Ansible (~10 min)
```

Deployment flow:
```
[1] VPC + Subnet + SG + Route Table + IGW      ← ~30s
[2] NAT Instance + ALB + Target Group           ← ~90s
[3] 4x EC2 (web1, web2, mgmt, db)               ← ~60s
[4] Key Pair + auto-generated inventory.yml
[5] Waiting for SSH availability (60s)          ← automatic
[6] Ansible run (site.yml)                      ← ~3–5 min
    - common role (all servers)
    - web role (nginx + fastapi + node_exporter + nginx_exporter + chaos)
    - mgmt role (prometheus + grafana + alertmanager + recovery)
    - db role (postgresql + node_exporter)
```

Check IP/DNS after deployment finishes:
```bash
make output
```

Example output:
```
alb_dns_name       = "proj-alb-xxx.ap-northeast-2.elb.amazonaws.com"
alb_url            = "http://proj-alb-xxx.ap-northeast-2.elb.amazonaws.com"
mgmt_public_ip     = "x.x.x.x"
web1_public_ip     = "x.x.x.x"
web2_public_ip     = "x.x.x.x"
db_private_ip      = "10.0.11.x"
grafana_url        = "http://x.x.x.x:3000"
prometheus_url     = "http://x.x.x.x:9090"
alertmanager_url   = "http://x.x.x.x:9093"
```

> Auto-generated files (gitignored):
> - `terraform/proj-key.pem`: EC2 SSH private key
> - `terraform/inventory.yml`: Ansible inventory
> - `terraform/ansible.cfg`: Ansible configuration

### 🔹 STEP G · Import the Grafana Dashboard

After deployment, manually import the Grafana dashboard.

```
1. Visit http://[MGMT-IP]:3000
2. Left menu → Dashboards → New → Import
3. Copy the contents of grafana-dashboard.json and paste them in
4. Data Source: select Prometheus → Import
```

> 📌 `grafana-dashboard.json` uses job-based dynamic queries, so it keeps working
> without edits even if IPs change after a Terraform re-apply.

### 🔹 STEP H · Always Tear Down After Use

```bash
make destroy
```

> ⚠️ **Cost note:**
> - t2.micro × 4 = free-tier 750h/month (running all 4 simultaneously uses that up in about 7 days)
> - NAT Instance: covered by the free tier (cheaper than NAT Gateway's $0.059/h)
> - Always run **`make destroy`** after practicing/demoing

---

## 🔍 Demo & Verification

### 1️⃣ Web Service & Load Balancing

| Check | URL | Expected Result |
|---|---|---|
| ALB health check | `http://[ALB-DNS]/health` | `{"status":"ok","server":"...","database":"connected"}` |
| ALB load balancing | `http://[ALB-DNS]/test` (refresh repeatedly) | alternates between web1 and web2 |
| FastAPI DB integration | `http://[ALB-DNS]/items` | JSON data from the `items` table |

### 2️⃣ Monitoring System

| Service | URL | Check |
|---|---|---|
| **Grafana** | `http://[MGMT-IP]:3000` | admin / the password from `secrets.yml` |
| **Prometheus** | `http://[MGMT-IP]:9090/targets` | confirm all targets are **UP** |
| **AlertManager** | `http://[MGMT-IP]:9093` | Status: ready |

**Prometheus targets, healthy state:**
```
web-servers     → web1:9100, web2:9100    (node_exporter)   UP
nginx-exporters → web1:9113, web2:9113   (nginx_exporter)  UP
alertmanager    → mgmt:9093               (alertmanager)    UP
```

**Key Grafana panels:**
- 🖥️ Nginx service status (ONLINE/OFFLINE indicator)
- 🖥️ Exporter liveness status (ONLINE/OFFLINE)
- 📈 Real-time CPU usage (%), threshold 80%
- 📈 Real-time memory usage (%), threshold 70%
- 📊 Per-instance CPU/memory overview (bar gauge)
- 🚨 Vertical chaos-alert markers (annotations visualizing when a failure occurred)

### 3️⃣ Metrics Collection Endpoints

```
Node Exporter    : http://[server-IP]:9100/metrics   (OS metrics)
Nginx Exporter   : http://[server-IP]:9113/metrics   (Nginx metrics)
```

### 4️⃣ Confirming DB Access

```bash
# DB is in a private subnet → access via mgmt as a jump host
ssh -i terraform/proj-key.pem \
    -o ProxyCommand='ssh -i terraform/proj-key.pem -W %h:%p ec2-user@[MGMT-IP]' \
    ec2-user@[DB-PRIVATE-IP]

# once connected
sudo -u postgres psql -d appdb -c "SELECT * FROM items;"
```

---

## 🛠️ Failure Scenario Demo

> 💡 See **Chaos_Demo_Guide.md** for Grafana observation points
> 💡 See **DEMO.md** for the full demo script

```bash
# help
./chaos/inject.sh

# check overall service status (required before demoing)
./chaos/inject.sh status
```

### 4 Main Scenarios

| Scenario | Command | Detection Condition | Auto-Recovery |
|---|---|---|---|
| **Nginx failure** | `./chaos/inject.sh nginx1` | `nginx_up == 0` | `systemctl restart nginx` |
| **Exporter failure** | `./chaos/inject.sh exporter1` | `up{job="nginx-exporters"} == 0` | restart nginx_exporter |
| **CPU overload** | `./chaos/inject.sh cpu_both` | `CPU > 80%` | `pkill -x stress-ng` |
| **Memory overload** | `./chaos/inject.sh memory1` | `Memory > 70% (for 5s)` | `pkill -x stress-ng` |

### Helper Commands

| Command | Description |
|---|---|
| `./chaos/inject.sh status` | see overall service status at a glance |
| `./chaos/inject.sh cpu_stop` | clear CPU load individually |
| `./chaos/inject.sh memory_stop` | clear memory load individually |
| `./chaos/inject.sh all` | clean up all services |

### Core Demo: Self-Healing Cycle

```bash
# 1. Pre-check
./chaos/inject.sh status    # confirm all services are ONLINE

# 2. Inject a failure (Nginx-down example)
./chaos/inject.sh nginx1

# 3. Watch in real time
# Grafana: Nginx panel goes ONLINE → OFFLINE (within seconds)
# Slack #monitoring: [FIRING] NginxDown alert
# (within ~5-10s) Recovery Controller runs automatically
# Slack #recovery: [RECOVERY SUCCESS]
# Grafana: OFFLINE → ONLINE, recovery confirmed
```

Expected flow:
```
run inject.sh nginx1
  ↓ (within 5-10s, MTTD)
Prometheus: detects nginx_up == 0
AlertManager: sends alert to Slack #monitoring
Recovery Controller: runs recover_nginx.sh
  ↓ (within 30-60s, MTTR)
Nginx recovers → passes verify
Slack #recovery: receives [RECOVERY SUCCESS]
Prometheus: nginx_up == 1 → alert resolved
```

---

## 🔐 Security Configuration

### 🔹 Gitignored Files

| File | Reason |
|---|---|
| `terraform/proj-key.pem` | EC2 SSH private key |
| `terraform/inventory.yml` | server IP information |
| `terraform/ansible.cfg` | local execution path |
| `terraform/terraform.tfstate*` | contains AWS account details |
| `ansible/group_vars/secrets.yml` | Slack URL, DB password |

### 🔹 Security Policy: Learning-Environment Baseline

| Item | Current Setting | Production Recommendation | Trade-off Reason |
|---|---|---|---|
| SSH 22 (web/mgmt) | `0.0.0.0/0` | own IP only (`x.x.x.x/32`) | avoids IP-update overhead from repeated apply/destroy cycles |
| Grafana/Prometheus/AlertManager | `0.0.0.0/0` | own IP only | same reason |
| DB SSH 22 | VPC-internal only (`10.0.0.0/16`) | ✅ same | protected by the private subnet |
| DB 5432 | VPC-internal only | ✅ same | blocks access from anything but FastAPI |
| Secrets separation | `secrets.yml` | ✅ same | gitignored |
| IAM Role | S3 ReadOnly only | ✅ same | FullAccess removed |
| Grafana default password | changed to the `secrets.yml` password | ✅ same | no admin/admin |

### 🔹 `secrets.yml` Handling Principles

```
✅ share directly with teammates via messaging apps
✅ keep only on each person's local machine
❌ never commit to GitHub
❌ never share in a public Slack channel
```

---

## ❗ Troubleshooting

| Symptom | Fix |
|---|---|
| `aws: command not found` | re-run `make setup` + restart your terminal |
| `terraform: command not found` | re-run `make setup` |
| `Permission denied` (scripts) | run `chmod +x *.sh` |
| `Unable to locate credentials` | re-run `aws configure` |
| Region isn't Seoul | `aws configure` → enter `ap-northeast-2` |
| `Error: creating EC2 Instance` | check your free-tier limits in the AWS console |
| Tailscale connects but aws-db SSH times out | check `sudo tailscale status` + confirm subnet routing (`172.16.1.0/24`) is approved in the Admin Console |
| Prometheus target DOWN | confirm the target IP is the private IP → `systemctl status node_exporter` |
| Slack alerts not arriving | check the webhook URL in `secrets.yml` → `curl -X POST <URL> -d '{"text":"test"}'` |
| Duplicate Slack alerts | check the `continue: true` setting in `alertmanager.yml.j2` |
| Auto-recovery isn't triggering | `sudo journalctl -u recovery -f` → check whether the webhook is being received |
| `pkill stress-ng` exits with rc=-15 | use `pkill -x` instead of `pkill -f` (command-line matching trap) |
| Memory scenario alert resolves too fast | confirm you're using the stress-ng-based approach (`/dev/shm` is unstable due to OOM Killer reclaiming it) |
| Empty Grafana dashboard panels | confirm queries are job-based → re-import `grafana-dashboard.json` |
| Grafana login fails | check `grafana_admin_password` in `secrets.yml` |
| FastAPI 500 error | check PostgreSQL status + permissions on the `items` table |
| ALB 504 Gateway Timeout | check target group health checks + Nginx status |
| `Error: pg_hba.conf entry` | confirm it matches the VPC CIDR (`10.0.0.0/16`) |

### 🔹 Common Debugging Commands

```bash
# re-run Ansible (infra stays as-is, only reapplies config)
cd terraform && ansible-playbook -i inventory.yml ../ansible/site.yml

# SSH into a specific server
ssh -i terraform/proj-key.pem ec2-user@[server-IP]

# access the DB server (via jump host)
ssh -i terraform/proj-key.pem \
    -o ProxyCommand='ssh -i terraform/proj-key.pem -W %h:%p ec2-user@[MGMT-IP]' \
    ec2-user@[DB-PRIVATE-IP]

# check service logs
sudo journalctl -u prometheus -n 50 --no-pager
sudo journalctl -u alertmanager -n 50 --no-pager
sudo journalctl -u recovery -f                    # live

# recovery log
sudo tail -f /opt/recovery/logs/recovery.log

# test a Prometheus query
curl -s 'http://localhost:9090/api/v1/query?query=up' | jq
curl -s 'http://localhost:9090/api/v1/query?query=nginx_up' | jq

# check active AlertManager alerts
curl -s http://localhost:9093/api/v2/alerts | jq

# test chaos inject.sh
./chaos/inject.sh status
./chaos/inject.sh nginx1
./chaos/inject.sh all     # recover everything

# check Tailscale routing
sudo tailscale status
ip route | grep "172.16"
```

---

## 💾 Terraform State Management

```
✅ each person manages their own state independently (terraform.tfstate)
❌ never commit to GitHub (in .gitignore)
❌ never use an S3 remote backend (incurs shared cost)
```

Since everyone runs this independently in their own AWS account, there's no need to share state.

---

## 🔗 References

- [AWS VPC Guide](https://docs.aws.amazon.com/vpc/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/tips_tricks/index.html)
- [Prometheus Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)
- [AlertManager Configuration](https://prometheus.io/docs/alerting/latest/configuration/)
- [Grafana Provisioning](https://grafana.com/docs/grafana/latest/administration/provisioning/)
- [Tailscale Subnet Routing](https://tailscale.com/kb/1019/subnets)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📝 Changelog

| Date | Change | Author |
|---|---|---|
| 2026-05-22 | Full README revision (updated folder structure/architecture/scenarios/measurements) | Junhan Shin |
| 2026-05-21 | Added Chaos_Demo_Guide.md (Grafana observation points + SRE perspective) | Mingyu Kim |
| 2026-05-21 | Added role/files/grafana_dashboard.json for Ansible auto-deploy | Junhan Shin |
| 2026-05-20 | Alert grouping by alertname+instance / finalized grafana-dashboard.json | Jiyoon Lee, Mingyu Kim |
| 2026-05-19 | Finalized memory auto-recovery v4 (stress-ng + pkill -x) / timing tuned | Jiyoon Lee |
| 2026-05-19 | Cleaned up chaos/inject.sh's 4 scenarios + preserved reference/ | Jiyoon Lee |
| 2026-05-19 | Switched NAT Gateway → NAT Instance (cost savings) | Junhan Shin |
| 2026-05-11 | Fixed 18 security/bug/demo items after code review | Junhan Shin |
| 2026-05-11 | Initial README + team collaboration guide | Junhan Shin |
| 2026-05-08 | On-premises presentation completed → began AWS-phase work | Whole team |

---

**Team 5. EchoChallengers**
Hwijeong Cho · Junhan Shin · Jiyoon Lee · Mingyu Kim · Jiwoo Han
`EchoChallengers/project1-aws`
