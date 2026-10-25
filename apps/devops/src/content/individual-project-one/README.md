# Project1-Self-Build: Rebuilding a Hybrid Cloud Stack

### 🗨️ Project Introduction

>
>
>
> This repository rebuilds the EchoChallengers architecture as a solo practice project. It keeps the same four-server design and adds a GitHub Actions pipeline to deploy both environments. The team project skipped this pipeline.
>

### 💠 Project Type

- Started from an empty repository as an individual practice build
- Uses the same brief and four-server architecture as the EchoChallengers team project
- Built during the same weeks as the team project

### 💠 Scope & Ownership

`Solo build. Every area below is mine.`

| Area | What it covers | Directory |
|---|---|---|
| Infrastructure · IaC | VPC, subnets, NAT, ALB, four EC2 instances, CloudWatch alarms, and SNS | `terraform/` |
| Configuration management | 15 roles for the database, the web tier, the load balancer, monitoring, and recovery | `roles/` |
| Orchestration | 17 playbooks and two site files to set their order | `playbooks/` |
| Application | A containerized FastAPI app behind Nginx with Prometheus metrics | `roles/docker_fastapi/files/app/` |
| Monitoring · Alerting | Prometheus, Grafana, Alertmanager, Node Exporter, and a Telegram bridge | `monitoring/`, `roles/monitoring/` |
| Automated recovery | A webhook matches each alert to a service and restarts it over SSH | `recovery/` |
| Failure injection | One script breaks a service on demand | `chaos/` |
| CI/CD | Checks, the image build, both deployments, and an automatic teardown | `.github/workflows/` |

### 💠 What Is Different From the Team Build

In the final week of EchoChallengers, the team chose to rehearse the demo and left the pipeline unbuilt. This repository adds the missing pipeline. Every run deploys VMware and AWS, and the AWS environment is destroyed when the run ends.

---

# Two Environments, Mostly Shared Roles

The same four machines exist twice. On VMware they are `proj-mgmt`, `proj-rocky1`, `proj-rocky2`, and `proj-ubuntu1` on `192.168.61.0/24`. On AWS they carry the same roles inside `10.0.0.0/16`. Both environments reuse most of the same 15 Ansible roles. The AWS playbook `site_aws.yml` joins Tailscale first, runs monitoring in Docker, and skips the Cloudflare tunnel.

## ✨ Key Features

- **One command per environment.** `ansible-playbook playbooks/site.yml` builds the on-premises stack. `./deploy_aws.sh` runs Terraform, generates the inventory from its outputs, waits for SSH, and runs Ansible.
- **Self-healing at two speeds.** Nginx recovers through a systemd drop-in in about five seconds. FastAPI and Node Exporter recover through Prometheus and Alertmanager, and a webhook restarts the service over SSH.
- **Alerts reach three places.** Slack and a Telegram bridge receive every alert. The recovery webhook receives the critical ones only.
- **Failure on demand.** `chaos/inject.sh` breaks a service in seven different ways and puts everything back with one command.
- **A self-cleaning pipeline.** The AWS job ends in `terraform destroy` marked `if: always()`, and a failed run leaves nothing behind to bill.

---

## Architecture at a Glance

```
On-premises (VMware) · 192.168.61.0/24
  proj-mgmt     .133   HAProxy :80 · stats :8404 · Ansible control node
                       Prometheus :9090 · Grafana :3000 · Alertmanager :9093
                       recovery webhook :9080 · prometheus_bot :9087 · cloudflared
  proj-rocky1   .134   Nginx :80 → FastAPI :8000 (Docker) · node_exporter :9100
  proj-rocky2   .135   Nginx :80 → FastAPI :8000 (Docker) · node_exporter :9100
  proj-ubuntu1  .136   PostgreSQL :5432 (appdb / appuser) · node_exporter :9100

        │
        │  Tailscale mesh (100.64.0.0/10, tag:project1-ec2)
        │  mgmt advertises the VPC CIDR; the CI runner joins with an OAuth key
        ▼

AWS · ap-northeast-2 · VPC 10.0.0.0/16
  ALB :80  ── public subnets 10.0.1.0/24 (AZ a) · 10.0.2.0/24 (AZ b)
    │         health check: GET /health every 15s, 2 healthy / 3 unhealthy
    │         alongside: aws-mgmt (public, subnet router), NAT gateway
    │
    ├─► aws-rocky1   ── private subnet 10.0.11.0/24   Nginx → FastAPI :8000
    └─► aws-rocky2   ── private subnet 10.0.12.0/24   Nginx → FastAPI :8000
              │
              └─► aws-ubuntu1  ── private subnet 10.0.11.0/24   PostgreSQL :5432

  CloudWatch   4 CPU alarms · ALB 5xx · ALB unhealthy hosts → SNS → Slack
               plus a dashboard covering CPU, request count, latency, and host health
```

All four instances are Arm-based `t4g.small` machines. Terraform looks up the Rocky and Ubuntu AMIs by owner and name filter, and a rebuilt environment always picks up the current image.

Security groups reference each other in place of CIDR ranges. The app group accepts `80` only from the ALB group, and `22`, `8000`, and `9100` only from the mgmt group. The database group accepts `5432` only from the app group. SSH from the Tailscale range `100.64.0.0/10` is the one exception, and it lets the CI runner reach a private instance without a jump host.

### On-Premises and AWS: Key Differences

| Concern | On-premises | AWS |
|---|---|---|
| External load balancing | HAProxy on `proj-mgmt` | ALB across two availability zones |
| Internal load balancing | HAProxy with round robin over `/health` | HAProxy on `aws-mgmt` from the same role |
| Addressing | Static addresses in `inventory/hosts.ini` | Terraform outputs written into `inventory/hosts_aws_ts.ini` |
| Reachability | Direct on the LAN | Tailscale mesh without a jump host |
| Outbound from private hosts | Not applicable | NAT gateway |
| Monitoring | Prometheus, Grafana, and Alertmanager under systemd | The same stack in Docker plus CloudWatch alarms and a dashboard |
| Public access | Cloudflare tunnel | The ALB |
| Lifetime | Persistent | Destroyed at the end of every pipeline run |

---

## 🚀 Quick Start

### Prerequisites

- Ansible on the control node and the project key at `~/.ssh/teamproj01ansiblekey.pem`
- Terraform 1.5 or later and an AWS CLI profile for `ap-northeast-2` (AWS only)
- A reusable Tailscale auth key tagged `tag:project1-ec2`
- A Slack incoming webhook URL

### On-premises

```bash
cd ~/project1-onpremise

# Confirm ansible.cfg is the one being used
ansible-config dump | grep DEFAULT_HOST_LIST

# Syntax only, then a dry run, then the real thing
ansible-playbook playbooks/site.yml --syntax-check
ansible-playbook playbooks/site.yml --check
ansible-playbook playbooks/site.yml
```

Run it a second time to check idempotency. A clean second run reports `changed=0` for everything except the `nginx_selfheal` role. That role kills Nginx on purpose every time to test the self-healing.

### AWS

```bash
./deploy_aws.sh plan      # show what Terraform will create
./deploy_aws.sh infra     # Terraform only, then generate the inventory
./deploy_aws.sh ansible   # Ansible only, against existing infrastructure
./deploy_aws.sh           # the whole thing
./deploy_aws.sh destroy   # tear it down
```

`deploy_aws.sh` writes `inventory/hosts_aws.ini` from Terraform outputs, and the inventory always describes the current instances. The public key path, the admin CIDR, the Tailscale auth key, and the Slack webhook URL come in as Terraform variables, and none of them are committed.

### Verify

```bash
# Through the ALB
curl -s http://$(terraform -chdir=terraform output -raw alb_dns_name)/health

# Through HAProxy on the management node
curl -s http://192.168.61.133/health

# Load balancing: run it repeatedly and watch the server name change
for i in $(seq 1 6); do curl -s http://192.168.61.133/health | python3 -m json.tool | grep server; done
```

---

## 📁 Folder Structure

```
project1-on-premise-self-build/
├── terraform/
│   ├── main.tf                  # VPC, subnets, NAT, 4 instances, ALB
│   ├── variables.tf
│   ├── outputs.tf               # prints an Ansible inventory
│   ├── locals.tf
│   ├── cloudwatch.tf            # 6 alarms, SNS to Slack, dashboard
│   ├── tailscale.tf
│   ├── mgmt_bootstrap.sh        # user_data: subnet router, advertises the VPC
│   └── app_bootstrap.sh         # user_data: joins the tailnet, accepts routes
├── playbooks/
│   ├── site.yml                 # on-premises, imports 12 in a fixed order
│   ├── site_aws.yml             # AWS, Tailscale first
│   ├── docker_install.yml
│   ├── db.yml
│   ├── mgmt.yml
│   ├── docker_web.yml
│   ├── web.yml                  # the systemd version, no longer imported
│   ├── nginx_selfheal.yml
│   ├── monitoring.yml
│   ├── monitoring-docker.yml    # the AWS monitoring stack
│   ├── prometheus_bot.yml
│   ├── prometheus_connect.yml   # promtool check, then restart
│   ├── prometheus_connect_docker.yml
│   ├── recovery_service.yml
│   ├── cloudflared.yml
│   ├── certbot.yml
│   └── notify.yml
├── roles/                       # 15 roles
│   ├── docker/                  # engine, plus EPEL and stress for load tests
│   ├── docker_fastapi/          # image build, container, app/
│   ├── nginx/                   # reverse proxy, SELinux boolean
│   ├── nginx_selfheal/          # Restart=always drop-in and its proof
│   ├── postgresql/              # appdb, appuser, remote access
│   ├── haproxy/                 # round robin over /health, stats on :8404
│   ├── node_exporter/
│   ├── monitoring/              # Prometheus, Grafana, Alertmanager
│   ├── prometheus_bot/          # compiled from Go source for arm64
│   ├── recovery_service/        # the webhook, as a systemd unit
│   ├── tailscale/
│   ├── cloudflared/
│   ├── certbot/
│   ├── fastapi/                 # the systemd version, kept for reference
│   └── telegram/
├── inventory/
│   ├── hosts.ini                # VMware, 192.168.61.133-136
│   └── hosts_aws_ts.ini         # AWS, rewritten by the workflow
├── monitoring/
│   ├── prometheus.yml
│   ├── prometheus-docker.yml
│   ├── prometheus_aws.yml.j2
│   ├── alert.rules.yml          # 4 rules
│   ├── test_alert.yml
│   ├── alertmanager.yml         # 3 receivers
│   └── docker-compose.yml
├── recovery/
│   ├── webhook_server.py        # :9080, alert name to a restart command
│   └── scripts/
│       └── restart_service.sh
├── chaos/
│   └── inject.sh                # 7 failures, plus all and status
├── .github/workflows/
│   └── deploy.yml               # checks, image, on-prem, AWS, destroy
├── ansible.cfg
├── deploy_aws.sh                # an earlier manual deploy through mgmt
└── README.md
```

### Why `site.yml` imports in a fixed order

The order matters, and the file says so at the top. Docker must exist before the container role runs. The database must exist before FastAPI starts, or the app logs a warning and retries on every request. Prometheus must exist before `prometheus_connect.yml` validates its rules. The final notification only means something after everything above it succeeds.

---

## 🔄 Self-Healing Flow

Two mechanisms handle failures. The choice depends on how fast the failure can be seen.

**systemd handles a crashed process.** The `nginx_selfheal` role writes a `Restart=always` drop-in with `RestartSec=5s`. systemd sees the exit on its own, and Nginx is back in about five seconds with no alert raised. The role then kills Nginx and confirms it came back, and every deployment leaves this proof in its own output.

**The alert pipeline handles everything else.** Prometheus scrapes Node Exporter and the FastAPI instrumentator every 15 seconds. A rule fires, Alertmanager sends it out, and the webhook restarts the service over SSH.

```
node_exporter :9100  ─┐
                      ├─► Prometheus ──► Alertmanager ──┬─► Slack #all-mindmug      (every severity)
FastAPI /metrics :8000┘   scrape 15s     group_wait 5s  ├─► prometheus_bot :9087    (every severity, Telegram)
                                                        └─► recovery webhook :9080  (critical only)
                                                                    │
                                                                    ▼
                                                      match alertname and job
                                                                    │
                                              ┌─────────────────────┴─────────────────────┐
                                              ▼                                           ▼
                                  ssh docker restart fastapi                   no mapping found
                                  ssh systemctl restart node_exporter          logged for a manual check
                                              │                                           │
                                              └─────────────────┬─────────────────────────┘
                                                                ▼
                                            /var/log/recovery.log  +  Slack result message
```

### Alert rules

| Alert | Expression | For | Severity |
|---|---|---|---|
| `FastAPIDown` | `up{job=~"fastapi-.*"} == 0` | 30s | critical |
| `NodeDown` | `up{job=~"node-.*"} == 0` | 1m | critical |
| `HighCPU` | CPU above 40% | 1m | warning |
| `HighMemory` | memory above 85% | 3m | warning |

The CPU threshold sits at 40% on purpose. A production figure would be higher, and 40% lets `chaos/inject.sh cpu1` cross it every time.

### Recovery policy

| Alert | Restart command | Where the host comes from |
|---|---|---|
| `FastAPIDown` | `docker restart fastapi` | `HOST_MAP` by Prometheus job name |
| `NodeDown` | `systemctl restart node_exporter` | `HOST_MAP` by Prometheus job name |

Both maps must match. An alert the webhook does not recognize is logged and reported for a manual check, and nothing is restarted on a guess.

### Failure injection

```bash
./chaos/inject.sh fastapi1     # stop the FastAPI container on rocky1
./chaos/inject.sh fastapi2     # the same on rocky2
./chaos/inject.sh nginx1       # pkill nginx, expect systemd back in ~5s
./chaos/inject.sh nginx2
./chaos/inject.sh db           # stop PostgreSQL
./chaos/inject.sh cpu1         # stress all cores on rocky1 for 120s
./chaos/inject.sh haproxy      # stop the load balancer
./chaos/inject.sh all          # put everything back
./chaos/inject.sh status       # print the state of all ten services
```

The script reads host addresses from the Ansible inventory. Adding `--aws` switches it to the AWS inventory file.

---

## 🔁 Delivery

One workflow in `.github/workflows/deploy.yml` runs on every push to `main`.

| Job | Runner | What it does |
|---|---|---|
| `test` | hosted | `ast.parse` on the application, `yaml.safe_load` on every playbook and role |
| `docker` | hosted | Builds the FastAPI image and pushes it tagged `latest` and by commit SHA |
| `deploy-onprem` | self-hosted, on `proj-mgmt` | `git pull`, `ansible-playbook site.yml --diff`, and a health check |
| `deploy-aws` | hosted | Terraform apply, join the tailnet, `ansible-playbook site_aws.yml`, check the ALB, and destroy |

Both deploy jobs start after the image build and run in parallel. One push updates VMware and AWS from the same commit. Slack receives a message at every outcome, and Telegram receives every success and failure. The destroy notice goes to Slack only.

The destroy step carries `if: always()`. The environment is never meant to outlive its own run.

---

## 🧠 What This Repository Taught Me

The architecture I could redraw from memory. The install details took real work.

- Every binary download needed a switch on `ansible_architecture`. The fleet is arm64, and most published release URLs assume x86.
- `prometheus_bot` ships no arm64 image, and its role installs Go to compile the bot from source.
- `httpd_can_network_connect` is why Nginx returns 502 when it proxies to a container on a SELinux host. Nothing in the Nginx config points to it.
- Facts are not always gathered when a role expects them. Both `cloudflared` and `monitoring` call `setup` explicitly to read `ansible_architecture` before using it.
- The PostgreSQL role finds its config path with `find`. A hardcoded version number broke once when the version moved.

The other lesson was about ordering, and I would carry it to any project. Twelve playbooks import in a sequence, and every dependency in the sequence stays invisible until the day it breaks.

---

## Limits

This is a study build, and it stops where a production system would keep going.

- Terraform state is local. A second machine cannot pick up where the first left off.
- The recovery webhook restarts a service only once. No retry or cooldown follows a failed restart.
- Grafana dashboards are imported by hand.
- Secrets live in GitHub Actions secrets and Ansible variables. No dedicated vault holds them.
- The AWS environment lives only for the length of a workflow run, and nothing in it is backed up.
