# teamproject01-hybrid-cloud-infra: A Hybrid Cloud Stack, Rebuilt Alone

### 🗨️ Project Introduction

>
>
>
> This is the EchoChallengers self-healing infrastructure, built a second time from an empty repository by one person.
>
> On the team project I owned the infrastructure build, which meant parts of the system reached me as a pull request to review rather than as something I had written. This repository is how I found out which parts those were. The architecture is deliberately the same, because the point was never a new design. The point was whether I could produce that design again without a team around me.
>

Nothing here was copied across from the team repository. Where I could not remember how something worked, I read the documentation and wrote it again.

### 💠 Project Type

- Individual study build, from an empty repository
- Same brief and the same four-server architecture as the EchoChallengers team project
- Built alongside that project rather than after it

### 💠 Scope & Ownership

`Solo build. Every area below is mine.`

| Area | What it covers | Directory |
|---|---|---|
| Infrastructure · IaC | VPC, subnets, NAT, ALB, four EC2 instances, CloudWatch alarms, SNS | `terraform/` |
| Configuration management | 15 roles covering the database, the web tier, the load balancer, monitoring and recovery | `roles/` |
| Orchestration | 17 playbooks, and the two site files that order them | `playbooks/` |
| Application | FastAPI with a Prometheus instrumentator, containerised and served behind Nginx | `roles/docker_fastapi/files/app/` |
| Monitoring · Alerting | Prometheus, Grafana, Alertmanager, Node Exporter, and a Telegram bridge | `monitoring/`, `roles/monitoring/` |
| Automated recovery | A webhook that maps an alert to a service and restarts it over SSH | `recovery/` |
| Failure injection | One script that breaks things on demand in either environment | `chaos/` |
| CI/CD | Checks, image build, both deployments, and an unconditional teardown | `.github/workflows/` |

### 💠 What Is Different From the Team Build

The team spent its final week rehearsing the demo rather than building a pipeline. That was the right call for the deliverable they were judged on, and it left the one thing I most wanted to practise unbuilt. So this repository has the pipeline, and the AWS environment it deploys destroys itself at the end of every run.

---

# Two Environments, One Set of Roles

The same four machines exist twice. On VMware they are `proj-mgmt`, `proj-rocky1`, `proj-rocky2` and `proj-ubuntu1` on `192.168.61.0/24`. On AWS they are the same four names against Terraform-assigned addresses inside `10.0.0.0/16`. One set of 15 Ansible roles configures both. The AWS run swaps the inventory file and nothing else.

## ✨ Key Features

- **One command per environment.** `ansible-playbook playbooks/site.yml` builds the on-premises stack. `./deploy_aws.sh` runs Terraform, generates the inventory from its outputs, waits for SSH, and runs Ansible.
- **Self-healing at two speeds.** Nginx recovers through a systemd drop-in in about five seconds. FastAPI and Node Exporter recover through Prometheus, Alertmanager and a webhook that restarts the service over SSH.
- **Alerts reach three places.** Slack and a Telegram bridge get every alert. The recovery webhook gets the critical ones only.
- **Failure on demand.** `chaos/inject.sh` breaks seven things and puts them all back, in either environment, from the same script.
- **A pipeline that cleans up after itself.** The AWS job ends in `terraform destroy` marked `if: always()`, so a failed run costs the same as a successful one.

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
  ALB :80  ── public subnets 10.0.1.0/24 (AZ a) · 10.0.2.0/24 (AZ c)
    │         health check: GET /health every 15s, 2 healthy / 3 unhealthy
    │         alongside: aws-mgmt (public, subnet router), NAT gateway
    │
    ├─► aws-rocky1   ── private subnet 10.0.11.0/24   Nginx → FastAPI :8000
    └─► aws-rocky2   ── private subnet 10.0.12.0/24   Nginx → FastAPI :8000
              │
              └─► aws-ubuntu1  ── private subnet 10.0.11.0/24   PostgreSQL :5432

  CloudWatch   4 CPU alarms · ALB 5xx · ALB unhealthy hosts → SNS → Slack
               plus a dashboard covering CPU, request count, latency and host health
```

All four instances are `t4g.small` on Graviton. The Rocky and Ubuntu AMIs are looked up dynamically by owner and name filter rather than pinned, so a rebuilt environment picks up the current image.

Security groups reference each other rather than CIDR ranges. The app group accepts `80` only from the ALB group, and `22`, `8000` and `9100` only from the mgmt group. The database group accepts `5432` only from the app group. SSH from the Tailscale range `100.64.0.0/10` is the one exception, and it is what lets the CI runner reach a private instance without a jump host.

### On-Premises and AWS: Key Differences

| Concern | On-premises | AWS |
|---|---|---|
| External load balancing | HAProxy on `proj-mgmt` | ALB across two availability zones |
| Internal load balancing | HAProxy, round robin over `/health` | HAProxy stays on `aws-mgmt`, so the same roles run |
| Addressing | Static addresses in `inventory/hosts.ini` | Terraform outputs, rewritten into `inventory/hosts_aws_ts.ini` |
| Reachability | Direct on the LAN | Tailscale mesh, so no jump host is needed |
| Outbound from private hosts | Not applicable | NAT gateway |
| Monitoring | Prometheus, Grafana, Alertmanager | The same stack, plus CloudWatch alarms and a dashboard |
| Lifetime | Persistent | Destroyed at the end of every pipeline run |

---

## 🚀 Quick Start

### Prerequisites

- Ansible on the control node, with the project key at `~/.ssh/teamproj01ansiblekey.pem`
- Terraform 1.5 or later and an AWS CLI profile for `ap-northeast-2`, for the AWS half
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

Run it a second time to confirm idempotency. A clean second run reports `changed=0` for everything except the self-healing test in the `nginx_selfheal` role, which kills Nginx on purpose every time.

### AWS

```bash
./deploy_aws.sh plan      # show what Terraform will create
./deploy_aws.sh infra     # Terraform only, then generate the inventory
./deploy_aws.sh ansible   # Ansible only, against existing infrastructure
./deploy_aws.sh           # the whole thing
./deploy_aws.sh destroy   # tear it down
```

`deploy_aws.sh` writes `inventory/hosts_aws.ini` from Terraform outputs, so the inventory can never describe the previous set of instances. The public key path, the admin CIDR, the Tailscale auth key and the Slack webhook URL all come in as Terraform variables, and none of them are committed.

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
teamproject01-hybrid-cloud-infra/
├── terraform/
│   ├── main.tf                  # VPC, subnets, NAT, 4 instances, ALB
│   ├── variables.tf
│   ├── outputs.tf               # emits a ready-to-use Ansible inventory
│   ├── locals.tf
│   ├── cloudwatch.tf            # 6 alarms, SNS to Slack, dashboard
│   ├── tailscale.tf
│   ├── mgmt_bootstrap.sh        # user_data: subnet router, advertises the VPC
│   └── app_bootstrap.sh         # user_data: joins the tailnet, accepts routes
├── playbooks/
│   ├── site.yml                 # on-premises, imports 11 in a fixed order
│   ├── site_aws.yml             # AWS, Tailscale first
│   ├── docker_install.yml
│   ├── db.yml
│   ├── mgmt.yml
│   ├── docker_web.yml
│   ├── nginx_selfheal.yml
│   ├── monitoring.yml
│   ├── prometheus_bot.yml
│   ├── prometheus_connect.yml   # promtool check, then restart
│   ├── recovery_service.yml
│   ├── cloudflared.yml
│   ├── certbot.yml
│   └── notify.yml
├── roles/                       # 15 roles, tasks and handlers each
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
│   ├── prometheus_aws.yml.j2
│   ├── alert.rules.yml          # 4 rules
│   ├── alertmanager.yml         # 3 receivers
│   └── docker-compose.yml
├── recovery/
│   ├── webhook_server.py        # :9080, alert name to systemctl restart
│   └── scripts/
│       └── restart_service.sh
├── chaos/
│   └── inject.sh                # 7 failures, plus all and status
├── .github/workflows/
│   └── deploy.yml               # checks, image, on-prem, AWS, destroy
├── ansible.cfg
├── deploy_aws.sh
└── README.md
```

### Why `site.yml` imports in a fixed order

The order is load bearing and the file says so at the top. Docker has to exist before the container role runs. The database has to exist before FastAPI starts, or the app logs a warning and retries on every request. Prometheus has to exist before `prometheus_connect.yml` validates its rules. The final notification only means something if everything above it succeeded.

---

## 🔄 Self-Healing Flow

Two mechanisms, chosen by how fast the failure can be seen.

**systemd, for a process that dies.** The `nginx_selfheal` role writes a `Restart=always` drop-in with `RestartSec=5s`. systemd already knows the process exited and does not need to be told, so Nginx is back in about five seconds and no alert ever fires. The role then kills Nginx and checks it came back, so every deployment leaves proof in its own output.

**The alert pipeline, for everything else.** Node Exporter and the FastAPI instrumentator are scraped every 15 seconds. A rule fires, Alertmanager fans it out, and the webhook restarts the service over SSH.

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
                                  ssh systemctl restart                        no mapping found
                                  fastapi | node_exporter                      logged for a person
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

The CPU threshold is 40% rather than a production figure, because the point of this environment is that `chaos/inject.sh cpu1` reliably crosses it.

### Recovery policy

| Alert | Service restarted | Where the host comes from |
|---|---|---|
| `FastAPIDown` | `fastapi` | `HOST_MAP`, keyed by the Prometheus job name |
| `NodeDown` | `node_exporter` | `HOST_MAP`, keyed by the Prometheus job name |

Both maps have to match. An alert the webhook does not recognise is logged and announced as needing a person, and nothing is restarted on a guess.

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
./chaos/inject.sh status       # print the state of all nine services
```

Add `--aws` to any of them to run against the AWS environment instead. The script reads host addresses out of whichever inventory file matches, so the targets can never drift away from what was actually deployed.

---

## 🔁 Delivery

One workflow on `.github/workflows/deploy.yml`, triggered by a push to `main`.

| Job | Runner | What it does |
|---|---|---|
| `test` | hosted | `ast.parse` on the application, `yaml.safe_load` on every playbook and role |
| `docker` | hosted | Builds the FastAPI image and pushes it tagged `latest` and by commit SHA |
| `deploy-onprem` | self-hosted, on `proj-mgmt` | `git pull`, `ansible-playbook site.yml --diff`, then a health check |
| `deploy-aws` | hosted | Terraform apply, join the tailnet, `ansible-playbook site_aws.yml`, check the ALB, then destroy |

Both deploy jobs wait on the image build and then run in parallel, so one push updates VMware and AWS from the same commit. Slack and Telegram get a message at every outcome: on-premises success, AWS success, destroy complete, and either failure.

The destroy step carries `if: always()`. The environment is not meant to outlive the run that created it.

---

## 🧠 What This Repository Taught Me

The architecture I could redraw from memory. The install details I could not.

- Every binary download needed switching on `ansible_architecture`, because the fleet is arm64 and most published release URLs assume it is not.
- `prometheus_bot` has no arm64 image at all, so the role installs Go and compiles it from source.
- `httpd_can_network_connect` is why Nginx returns 502 when it proxies to a container on a SELinux host, and no amount of reading the Nginx config finds that.
- Facts are not always gathered when a role expects them. Both `cloudflared` and `monitoring` call `setup` explicitly to get `ansible_architecture` before they use it.
- PostgreSQL's config path is found with `find` rather than hardcoded to a version number, because the version moved once and hardcoding it cost an afternoon.

The other lesson was about ordering, and it is the one I would carry to any project. Eleven playbooks import in a sequence, and every dependency in that sequence is invisible until the day it is wrong.

---

## Limits

This is a study build and it stops where a production system would keep going.

- Terraform state is local, so a second machine cannot pick up where the first left off.
- The recovery webhook restarts a service once, with no retry and no cooldown.
- Grafana dashboards are imported by hand.
- Secrets live in GitHub Actions secrets rather than in a vault.
- The AWS environment is expected to live for the length of a workflow run and nothing is backed up.
