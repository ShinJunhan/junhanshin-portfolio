# project1-aws — AWS 기반 자동복구(Self-Healing) 인프라

각자의 AWS 계정에서 이 코드를 실행하면 동일한 인프라가 자동으로 구축되고, **장애 발생 시 자동 복구**가 동작합니다.

> 🎯 **프로젝트 목적**  
> "운영팀 호출 없이 장애를 감지하고 스스로 복구할 수 있는 자동복구 시스템"을 IaC로 구현  
> on-premise(VMware) 학습 → AWS 자동화 → 하이브리드 통합 → 자가 치유 인프라

## ✨ 핵심 특징

- **🔄 자동복구(Self-Healing)** — Prometheus alert 발화 시 Recovery Controller가 Ansible 기반 복구 스크립트 자동 실행 + verify + retry 3회
- **🏗️ Full IaC** — Terraform으로 AWS 41개 리소스 + Ansible 8개 role을 `make apply` 한 줄로 배포 (~10분)
- **📊 모니터링 통합** — Prometheus + Grafana + AlertManager (scrape 5s, alert for 5s)
- **🔔 분리된 알림** — `#monitoring` (장애 감지) / `#recovery` (복구 결과)로 Slack 채널 역할 분리
- **🌐 하이브리드 네트워크** — Tailscale VPN으로 VMware(proj-mgmt) ↔ AWS 통합 관리
- **💰 비용 최적화** — NAT Gateway 대신 NAT Instance 도입 (비용 절감 + 속도 향상)
- **🎬 시연 친화적** — `chaos/inject.sh` 한 줄로 장애 주입 + 자동복구 흐름 검증 (MTTD 5~10초, MTTR 30~60초)

## 📚 문서 가이드

| 문서 | 용도 |
|---|---|
| README.md | 이 파일 — 프로젝트 개요 및 빠른 시작 |
| setup_manual.md | **첫 배포** 단계별 매뉴얼 (terraform/ansible/Tailscale 설치부터) |
| DEMO.md | **시연** 가이드 (chaos/inject.sh 시나리오 자동화) |
| Chaos_Demo_Guide.md | **Grafana 관전 포인트** + 카오스 시나리오 상세 (SRE 관점) |
| Git_workflow.md | **Git 협업** 워크플로우 (브랜치 전략 + PR 절차) |

---

## 🚀 빠른 시작 (Quick Start)

> 처음 사용한다면 **setup_manual.md** 를 따라하세요. 아래는 이미 환경이 갖춰진 경우의 흐름입니다.

```bash
# 1. 코드 받기
git clone git@github.com:EchoChallengers/project1-aws.git
cd project1-aws
git checkout dev

# 2. Tailscale VPN (최초 1회)
TAILSCALE_AUTHKEY=tskey-auth-xxxxx ./bootstrap_tailscale.sh

# 3. AWS 자격증명 + Slack URL 등록
aws configure
cp ansible/group_vars/secrets.yml.example ansible/group_vars/secrets.yml
vi ansible/group_vars/secrets.yml   # Slack URL + DB 패스워드 입력

# 4. 환경 사전 점검
./check.sh

# 5. 배포
make init
make apply   # Terraform + Ansible 통합 실행 (~10분)

# 6. Grafana 대시보드 수동 import
# Grafana UI(http://[MGMT-IP]:3000) → Dashboards → Import
# → grafana-dashboard.json 내용 붙여넣기

# 7. 시연 (자세한 시나리오는 DEMO.md / Chaos_Demo_Guide.md)
./chaos/inject.sh status        # 전체 서비스 상태
./chaos/inject.sh nginx1        # Nginx 다운 시나리오
./chaos/inject.sh exporter1     # Nginx Exporter 다운 시나리오
./chaos/inject.sh cpu_both      # CPU 부하 (양쪽 동시)
./chaos/inject.sh memory1       # Memory 부하 시나리오

# 8. 사용 후 정리 (필수!)
make destroy
```

---

## 📑 목차

- [✨ 핵심 특징](#-핵심-특징)
- [📚 문서 가이드](#-문서-가이드)
- [🚀 빠른 시작](#-빠른-시작-quick-start)
- [🏗️ 아키텍처](#️-아키텍처)
- [🔄 Self-Healing 흐름도](#-self-healing-흐름도)
- [📁 폴더 구조](#-폴더-구조)
- [👥 팀 구성 및 담당](#-팀-구성-및-담당)
- [🌱 Git 협업 워크플로우](#-git-협업-워크플로우)
- [🚀 시작하기 (최초 1회)](#-시작하기-최초-1회)
- [⚙️ 인프라 배포](#️-인프라-배포)
- [🔍 시연 및 동작 확인](#-시연-및-동작-확인)
- [🛠️ 장애 시나리오 시연](#️-장애-시나리오-시연)
- [🔐 보안 설정](#-보안-설정)
- [❗ 트러블슈팅](#-트러블슈팅)

---

## 🏗️ 아키텍처

### 전체 인프라 구성도 (하이브리드)

```
  VMware (On-premise)                       AWS (ap-northeast-2)
  ┌─────────────────────┐                   ┌──────────────────────────────────────────┐
  │  proj-mgmt           │                  │  VPC  10.0.0.0/16                        │
  │  172.16.1.x          │◄── Tailscale ───►│                                          │
  │  (Ansible 실행 노드)  │     VPN          │   ┌──────────────┐  ┌──────────────┐    │
  └─────────────────────┘                   │   │ Public AZ1   │  │ Public AZ2   │    │
                                            │   │ 10.0.1.0/24  │  │ 10.0.2.0/24  │    │
                                            │   │              │  │              │    │
                                            │   │  aws-web1    │  │  aws-web2    │    │
                          인터넷             │   │  Nginx+API   │  │  Nginx+API   │    │
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
                                            │   │  NAT instance ← Private 인터넷    │  │
                                            │   └──────────────┬───────────────────┘  │
                                            │                  │                       │
                                            │   ┌──────────────▼───────────────────┐  │
                                            │   │ Private Subnet  10.0.11.0/24     │  │
                                            │   │  aws-db  (PostgreSQL 16 :5432)   │  │
                                            │   │          (Node Exporter :9100)   │  │
                                            │   └──────────────────────────────────┘  │
                                            └──────────────────────────────────────────┘
```

### On-premise vs AWS 주요 차이

| 항목 | On-premise (VMware) | AWS |
|---|---|---|
| 로드밸런서 | HAProxy (직접 설치) | ALB (관리형) |
| NAT | — | NAT Instance (비용 절감, NAT GW 대신) |
| DB 위치 | Host-only `172.16.1.x` | Private Subnet `10.0.11.x` |
| SSH 키 | `project.pem` (수동 생성) | `proj-key.pem` (Terraform 자동 생성) |
| 네트워크 | VMware Host-only | VPC / Subnet (AZ 분리) |
| IP 관리 | 고정 IP | Terraform output 동적 확인 |
| DB 접근 | 직접 접속 | mgmt를 jump host로 경유 |
| 외부 노출 | Cloudflare Tunnel | ALB DNS |
| 하이브리드 연결 | — | Tailscale VPN (proj-mgmt ↔ AWS) |

---

## 🔄 Self-Healing 흐름도

```
  [장애 발생]
      │
      ▼
  Exporter (node_exporter :9100 / nginx_exporter :9113)
      │  메트릭 수집 (scrape interval: 5s)
      ▼
  Prometheus
      │  Alert Rule 평가 (for: 5s)
      ├──► Slack #monitoring  (장애 감지 알림, grouping: alertname+instance)
      │
      ▼
  AlertManager (group_wait: 5s, group_interval: 30s)
      │  Webhook → Recovery Controller :5001
      ▼
  Recovery Controller (Flask / app.py)
      │  recovery_map.yml 조회 → 복구 스크립트 결정
      ▼
  recover_*.sh (Ansible 원격 실행)
      │  실행 → verify → 실패 시 retry 최대 3회
      ▼
  Slack #recovery  (복구 결과 알림: SUCCESS / FAILED / NO_MAP)
      │
      ▼
  [Alert Resolved → 정상화]
```

### 자동복구 시나리오 매트릭스

| 시나리오 | Alert 조건 | 복구 스크립트 | 복구 방식 |
|---|---|---|---|
| **NginxDown** | `nginx_up == 0` | `recover_nginx.sh` | `systemctl restart nginx` |
| **NginxExporterDown** | `up{job="nginx-exporters"} == 0` | `recover_nginx_exporter.sh` | nginx_exporter 재시작 |
| **HighCPU** | `CPU > 80%` / severity: critical | `recover_cpu.sh` | `pkill -x stress-ng` + verify |
| **HighMemoryUsage** | `Memory > 70%` / for: 5s | `recover_memory.sh` | `pkill -x stress-ng` + verify |

> ⭐ **pkill -x 패턴**: `pkill -f`는 Ansible shell command line 내부 문자열까지 매칭하여 recovery command 자체를 종료시키는 함정이 있음. `pkill -x`로 정확한 프로세스명만 매칭.

### 측정 결과 (시연 환경 기준)

| 지표 | 값 | 비고 |
|---|---|---|
| **MTTD** (장애 감지 시간) | 5~10초 | Prometheus scrape 5s + Alert for 5s |
| **MTTR** (복구 완료 시간) | 30~60초 | Ansible 실행 + verify |

---

## 📁 폴더 구조

```
project1-aws/
├── setup.sh                        ← AWS CLI + Terraform + Ansible 자동 설치
├── bootstrap_tailscale.sh          ← Tailscale 설치 + 서브넷 라우팅 광고
├── check.sh                        ← 배포 전 환경 사전 점검 (5단계)
├── Makefile                        ← 자주 쓰는 명령어 단축키
├── README.md                       ← 이 파일
├── DEMO.md                         ← 시연 가이드
├── Chaos_Demo_Guide.md             ← Grafana 관전 포인트 + SRE 관점 가이드
├── setup_manual.md                 ← 첫 배포 단계별 매뉴얼
├── Git_workflow.md                 ← Git 협업 워크플로우
├── grafana-dashboard.json          ← Grafana 대시보드 수동 import용 JSON
│                                      (job 기반 동적 쿼리, 하드코딩 IP 없음)
│
├── ansible/
│   ├── site.yml                    ← Ansible 전체 실행 진입점
│   ├── playbooks/
│   │   ├── db.yml                  ← DB 서버 플레이북
│   │   ├── web.yml                 ← 웹 서버 플레이북
│   │   └── mgmt.yml               ← 관리 서버 플레이북 (monitoring 포함)
│   ├── group_vars/
│   │   ├── all.yml                 ← 공통 변수 (GitHub 관리)
│   │   ├── secrets.yml             ← Slack URL, DB 비밀번호 (gitignore)
│   │   └── secrets.yml.example    ← secrets.yml 작성 예시
│   └── roles/
│       ├── common/                 ← user1 생성, vim/motd, 타임존
│       ├── fastapi/                ← Python 앱 배포 (systemd)
│       ├── nginx/                  ← Nginx 리버스 프록시 + 가상 호스트
│       ├── postgresql/             ← PostgreSQL + pg_hba.conf + 테이블 생성
│       ├── node_exporter/          ← OS 메트릭 수집기 (포트 9100)
│       ├── nginx_exporter/         ← Nginx 메트릭 수집기 (포트 9113)
│       ├── chaos/                  ← stress-ng/stress/htop 시연 도구 설치
│       └── monitoring/             ← Prometheus + Grafana + AlertManager
│           ├── files/
│           │   ├── alert.rules.yml           ← Alert 규칙 (4가지)
│           │   └── grafana_dashboard.json    ← Ansible 자동배포용 대시보드 JSON
│           └── templates/
│               ├── prometheus.yml.j2         ← Prometheus 설정 (scrape 5s)
│               ├── alertmanager.yml.j2       ← AlertManager 설정 (Slack 연동)
│               └── *.service.j2             ← systemd 서비스 파일
│
├── terraform/
│   ├── main.tf                     ← 인프라 전체 정의
│   │                                  (VPC, Subnet, IGW, Route Table, SG,
│   │                                   NAT Instance, ALB, Target Group,
│   │                                   EC2 4대, IAM, Key Pair)
│   ├── variables.tf                ← AMI, instance type, 리전 등
│   ├── outputs.tf                  ← IP/DNS 출력 + inventory.yml 자동 생성
│   ├── backend.tf                  ← 로컬 state 명시
│   └── .gitignore                  ← *.pem, inventory.yml, tfstate 제외
│
├── chaos/
│   ├── inject.sh                   ← 장애 주입 스크립트 (4가지 주요 시나리오)
│   └── reference/
│       └── inject.sh               ← legacy 시나리오 보존 (benchmark 등)
│
└── recovery/
    └── controller/
        ├── app.py                  ← Flask webhook 서버 (포트 5001)
        ├── config/
        │   └── recovery_map.yml   ← Alert ↔ 복구 스크립트 매핑 정책
        └── scripts/
            ├── recover_nginx.sh           ← Nginx 재시작
            ├── recover_nginx_exporter.sh  ← Exporter 재시작
            ├── recover_cpu.sh             ← CPU 부하 정리 (pkill -x stress-ng)
            ├── recover_memory.sh          ← Memory 부하 정리 (pkill -x stress-ng)
            ├── recover_db.sh              ← DB 서비스 재시작
            ├── recover_service.sh         ← 범용 서비스 재시작
            └── recover_fail_test.sh       ← 실패 시나리오 테스트용
```

---

## 👥 팀 구성 및 담당

| 역할 | 팀원 | 주요 담당 |
|---|---|---|
| **팀장 / 통합 관리** | 조휘정 | `main` 브랜치 관리, PR 리뷰, 발표 |
| **인프라 구축 + PR Owner** | 신준한 | `terraform/`, `ansible/roles/common,chaos/`, `bootstrap_tailscale.sh`, `check.sh`, dev 브랜치 PR 검토/머지 |
| **자동복구 시스템** | 이지윤 | `recovery/`, Alert 흐름 안정화, recover_*.sh, alertmanager 연동 |
| **모니터링 + Grafana** | 김민규 | `ansible/roles/monitoring/`, `grafana-dashboard.json`, `chaos/inject.sh`, Alert 규칙 |
| **Exporter + 문서화** | 한지우 | `ansible/roles/node_exporter,nginx_exporter/`, 회의록 아카이빙, 문서 정리 |

### 브랜치 전략

```
main ──────────●────────────●────────────  (조휘정, 보호 브랜치 — 발표/릴리즈용)
               ▲            ▲
               │ PR         │ PR
               │            │
dev ───────────●────●────●──●────────────  (신준한 PR Owner — 통합 개발)
               ▲    ▲    ▲
               │    │    │ PR
               │    │    │
feature/* ─────●────●────●───────────────  (한지우, 이지윤, 김민규)
fix/*      ────●────●────────────────────
docs/*     ────●─────────────────────────
```

**원칙:**
- `main`: 검증 완료된 코드만 (조휘정만 머지 권한)
- `dev`: 통합 테스트 브랜치 (신준한 PR Owner — 검토 + 머지 + 동기화)
- `feature/fix/docs/*`: 각자 작업 브랜치 → dev로 PR

**PR Owner 체크리스트:**
- 변경 파일 범위 + 충돌 가능성 확인
- 보안 점검 (Slack URL, Jinja2 escape, secrets.yml gitignore)
- `dev` 동기화 + `git log --oneline` 확인 후 머지
- 팀원 노티 (디스코드)

---

## 🌱 Git 협업 워크플로우

> 자세한 내용은 **Git_workflow.md** 참고

### 🔹 STEP 1 · 최초 1회: 레포지토리 클론

```bash
# SSH 키 등록 확인
ssh -T git@github.com

# 클론
git clone git@github.com:EchoChallengers/project1-aws.git
cd project1-aws

git config user.name "본인이름"
git config user.email "본인@email.com"

git branch -a
```

### 🔹 STEP 2 · 작업 시작: 브랜치 만들기

```bash
# dev 최신화
git checkout dev
git pull origin dev

# feature 브랜치 생성
git checkout -b feature/작업명
# 예: git checkout -b feature/add-memory-recovery
#     git checkout -b fix/alertmanager-grouping
#     git checkout -b docs/update-readme
```

**브랜치 이름 규칙:**

| 작업 종류 | 접두사 | 예시 |
|---|---|---|
| 새 기능 | `feature/` | `feature/add-grafana-dashboard` |
| 버그 수정 | `fix/` | `fix/alertmanager-grouping` |
| 문서 | `docs/` | `docs/update-readme` |
| 리팩터링 | `refactor/` | `refactor/extract-vpc-cidr` |

### 🔹 STEP 3 · commit + push + PR

```bash
git add <변경한 파일>
git commit -m "feat: Memory 자동복구 스크립트 추가

- recover_memory.sh 작성 (pkill -x stress-ng)
- recovery_map.yml에 HighMemoryUsage 매핑 추가"

git push origin feature/작업명
```

**commit 메시지 규칙:** `feat:` / `fix:` / `docs:` / `refactor:` / `chore:`

GitHub에서 PR 생성:
- base: **`dev`** (절대 main 아님)
- 제목: commit 메시지와 동일 패턴
- PR Owner(신준한)가 검토 후 머지

---

## 🚀 시작하기 (최초 1회)

> 자세한 내용은 **setup_manual.md** 참고

### 🔹 STEP A · 필수 도구 설치

```bash
./setup.sh
# AWS CLI + Terraform + Ansible 자동 설치
# 설치 후 터미널 재시작 필요
```

### 🔹 STEP B · Tailscale VPN 설정

```bash
TAILSCALE_AUTHKEY=tskey-auth-xxxxx ./bootstrap_tailscale.sh
# Tailscale Admin Console에서 사전 승인(Pre-approved) 활성화 권장

# 서브넷 라우팅 확인
sudo tailscale status
ip route | grep "172.16"
```

### 🔹 STEP C · AWS 자격증명

```bash
aws configure
# Access Key ID:     (IAM 계정에서 발급)
# Secret Access Key: (IAM 계정에서 발급)
# Default region:    ap-northeast-2
# Default output:    json

aws sts get-caller-identity   # 연결 확인
```

### 🔹 STEP D · Slack Webhook 등록

```bash
cp ansible/group_vars/secrets.yml.example ansible/group_vars/secrets.yml
vi ansible/group_vars/secrets.yml
```

```yaml
# secrets.yml 작성 예시
slack_webhook_monitoring: "https://hooks.slack.com/services/xxx/yyy/zzz"
slack_webhook_recovery:   "https://hooks.slack.com/services/xxx/yyy/zzz"
grafana_admin_password:   "your-secure-password"
db_password:              "your-db-password"
```

### 🔹 STEP E · 환경 사전 점검

```bash
./check.sh
```

점검 항목:
- ✅ AWS CLI 설치 + 자격증명
- ✅ Terraform 설치
- ✅ Ansible 설치
- ✅ Tailscale 연결 + 서브넷 라우팅
- ✅ secrets.yml 존재 + 리전 ap-northeast-2

모든 항목 ✅이면 다음 단계로.

---

## ⚙️ 인프라 배포

### 🔹 STEP F · Terraform + Ansible 실행

```bash
make init     # Terraform 초기화
make plan     # 변경 미리보기 (실제 적용 안 함)
make apply    # 인프라 생성 + Ansible 자동 실행 (~10분)
```

배포 진행 흐름:
```
[1] VPC + Subnet + SG + Route Table + IGW     ← 약 30초
[2] NAT Instance + ALB + Target Group          ← 약 90초
[3] EC2 4대 (web1, web2, mgmt, db)             ← 약 60초
[4] Key Pair + inventory.yml 자동 생성
[5] SSH 접속 대기 (60초)                       ← 자동
[6] Ansible 실행 (site.yml)                    ← 약 3~5분
    - common role (모든 서버)
    - web role (nginx + fastapi + node_exporter + nginx_exporter + chaos)
    - mgmt role (prometheus + grafana + alertmanager + recovery)
    - db role (postgresql + node_exporter)
```

배포 완료 후 IP/DNS 확인:
```bash
make output
```

출력 예시:
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

> 자동 생성된 파일들 (gitignore):
> - `terraform/proj-key.pem` — EC2 SSH 개인키
> - `terraform/inventory.yml` — Ansible 인벤토리
> - `terraform/ansible.cfg` — Ansible 설정

### 🔹 STEP G · Grafana 대시보드 Import

배포 완료 후 Grafana 대시보드를 수동으로 import합니다.

```
1. http://[MGMT-IP]:3000 접속
2. 좌측 메뉴 → Dashboards → New → Import
3. grafana-dashboard.json 파일 내용을 복사하여 붙여넣기
4. Data Source: Prometheus 선택 → Import
```

> 📌 `grafana-dashboard.json`은 job 기반 동적 쿼리로 작성되어 있어,  
> Terraform re-apply 후 IP가 바뀌어도 별도 수정 없이 그대로 동작합니다.

### 🔹 STEP H · 사용 후 반드시 삭제

```bash
make destroy
```

> ⚠️ **비용 주의:**
> - t2.micro × 4 = 프리티어 750h/월 (4대 동시 → 약 7일치)
> - NAT Instance: t2.micro 프리티어 포함 (NAT Gateway $0.059/h 대비 비용 절감)
> - 실습/시연 후 **반드시 `make destroy`** 실행

---

## 🔍 시연 및 동작 확인

### 1️⃣ 웹 서비스 및 로드밸런싱

| 확인 항목 | URL | 기대 결과 |
|---|---|---|
| ALB 헬스체크 | `http://[ALB-DNS]/health` | `{"status":"ok","server":"...","database":"connected"}` |
| ALB 로드밸런싱 | `http://[ALB-DNS]/test` (반복 새로고침) | web1 ↔ web2 번갈아 표시 |
| FastAPI DB 연동 | `http://[ALB-DNS]/items` | items 테이블 데이터 JSON |

### 2️⃣ 모니터링 시스템

| 서비스 | URL | 확인 |
|---|---|---|
| **Grafana** | `http://[MGMT-IP]:3000` | admin / secrets.yml의 grafana_admin_password |
| **Prometheus** | `http://[MGMT-IP]:9090/targets` | 모든 타겟 **UP** 상태 확인 |
| **AlertManager** | `http://[MGMT-IP]:9093` | Status: ready |

**Prometheus Target 정상 상태:**
```
web-servers     → web1:9100, web2:9100    (node_exporter)   UP
nginx-exporters → web1:9113, web2:9113   (nginx_exporter)  UP
alertmanager    → mgmt:9093               (alertmanager)    UP
```

**Grafana 주요 패널:**
- 🖥️ Nginx 서비스 상태 (ONLINE/OFFLINE 신호등)
- 🖥️ Exporter 센서 생존 상태 (ONLINE/OFFLINE)
- 📈 실시간 CPU 사용률 (%) — threshold: 80%
- 📈 실시간 Memory 사용률 (%) — threshold: 70%
- 📊 인스턴스별 CPU/Memory 현황 (Bar Gauge)
- 🚨 Chaos Alert 세로 마킹 (Annotation — 장애 발생 시점 시각화)

### 3️⃣ 메트릭 수집 경로

```
Node Exporter    : http://[서버-IP]:9100/metrics   (OS 메트릭)
Nginx Exporter   : http://[서버-IP]:9113/metrics   (Nginx 메트릭)
```

### 4️⃣ DB 접속 확인

```bash
# DB는 Private subnet → mgmt를 jump host로 경유
ssh -i terraform/proj-key.pem \
    -o ProxyCommand='ssh -i terraform/proj-key.pem -W %h:%p ec2-user@[MGMT-IP]' \
    ec2-user@[DB-PRIVATE-IP]

# 접속 후
sudo -u postgres psql -d appdb -c "SELECT * FROM items;"
```

---

## 🛠️ 장애 시나리오 시연

> 💡 Grafana 관전 포인트는 **Chaos_Demo_Guide.md** 참고  
> 💡 전체 시연 시나리오는 **DEMO.md** 참고

```bash
# 도움말
./chaos/inject.sh

# 전체 서비스 상태 점검 (시연 전 필수)
./chaos/inject.sh status
```

### 4가지 주요 시나리오

| 시나리오 | 명령 | 감지 조건 | 자동복구 |
|---|---|---|---|
| **Nginx 장애** | `./chaos/inject.sh nginx1` | `nginx_up == 0` | systemctl restart nginx |
| **Exporter 장애** | `./chaos/inject.sh exporter1` | `up{job="nginx-exporters"} == 0` | nginx_exporter 재시작 |
| **CPU 과부하** | `./chaos/inject.sh cpu_both` | `CPU > 80%` | pkill -x stress-ng |
| **Memory 과부하** | `./chaos/inject.sh memory1` | `Memory > 70% (for 5s)` | pkill -x stress-ng |

### 보조 명령

| 명령 | 설명 |
|---|---|
| `./chaos/inject.sh status` | 전체 서비스 상태 한 눈에 |
| `./chaos/inject.sh cpu_stop` | CPU 부하 개별 해제 |
| `./chaos/inject.sh memory_stop` | Memory 부하 개별 해제 |
| `./chaos/inject.sh all` | 전체 서비스 정리 (cleanup) |

### 핵심 시연: Self-Healing 사이클

```bash
# 1. 사전 점검
./chaos/inject.sh status    # 모든 서비스 ONLINE 확인

# 2. 장애 주입 (Nginx Down 예시)
./chaos/inject.sh nginx1

# 3. 실시간 모니터링
# Grafana: Nginx 패널 ONLINE → OFFLINE (수초 내)
# Slack #monitoring: [FIRING] NginxDown 알림
# (약 5~10초 내) Recovery Controller 자동 실행
# Slack #recovery: [RECOVERY SUCCESS]
# Grafana: OFFLINE → ONLINE 복구 확인
```

기대 흐름:
```
inject.sh nginx1 실행
  ↓ (5~10초 이내, MTTD)
Prometheus: nginx_up == 0 감지
AlertManager: Slack #monitoring 알림 발송
Recovery Controller: recover_nginx.sh 실행
  ↓ (30~60초 이내, MTTR)
Nginx 정상화 → verify 통과
Slack #recovery: [RECOVERY SUCCESS] 수신
Prometheus: nginx_up == 1 → Alert resolved
```

---

## 🔐 보안 설정

### 🔹 gitignore 처리된 파일

| 파일 | 이유 |
|---|---|
| `terraform/proj-key.pem` | EC2 SSH 개인키 |
| `terraform/inventory.yml` | 서버 IP 정보 |
| `terraform/ansible.cfg` | 로컬 실행 경로 |
| `terraform/terraform.tfstate*` | AWS 계정 정보 포함 |
| `ansible/group_vars/secrets.yml` | Slack URL, DB 비밀번호 |

### 🔹 보안 정책 — 학습 환경 기준

| 항목 | 현재 설정 | 운영 환경 권장 | 트레이드오프 이유 |
|---|---|---|---|
| SSH 22 (web/mgmt) | `0.0.0.0/0` | 본인 IP만 (`x.x.x.x/32`) | apply/destroy 반복 시 IP 갱신 부담 |
| Grafana/Prometheus/AlertManager | `0.0.0.0/0` | 본인 IP만 | 동일 |
| DB SSH 22 | VPC 내부만 (`10.0.0.0/16`) | ✅ 동일 | Private subnet으로 보호 |
| DB 5432 | VPC 내부만 | ✅ 동일 | FastAPI 외 접근 차단 |
| Secrets 분리 | secrets.yml | ✅ 동일 | gitignore 처리 |
| IAM Role | S3 ReadOnly만 | ✅ 동일 | FullAccess 제거 적용 |
| Grafana 기본 비번 | secrets.yml 비번으로 변경 | ✅ 동일 | admin/admin 금지 |

### 🔹 secrets.yml 관리 원칙

```
✅ 팀원끼리 메신저로 직접 공유
✅ 각자 로컬에서만 보관
❌ GitHub commit 절대 금지
❌ Slack public 채널에 공유 금지
```

---

## ❗ 트러블슈팅

| 증상 | 해결 방법 |
|---|---|
| `aws: command not found` | `make setup` 재실행 + 터미널 재시작 |
| `terraform: command not found` | `make setup` 재실행 |
| `Permission denied` (스크립트) | `chmod +x *.sh` 실행 |
| `Unable to locate credentials` | `aws configure` 재실행 |
| 리전이 서울이 아님 | `aws configure` → `ap-northeast-2` 입력 |
| `Error: creating EC2 Instance` | AWS 콘솔에서 프리티어 한도 확인 |
| Tailscale 연결 후 aws-db SSH timeout | `sudo tailscale status` 확인 + Admin Console에서 서브넷 라우팅 승인 확인 (`172.16.1.0/24`) |
| Prometheus 타겟 DOWN | 타겟 IP 확인 (private IP 기준인지) → `systemctl status node_exporter` |
| Slack 알림 미수신 | `secrets.yml`의 webhook URL 확인 → `curl -X POST <URL> -d '{"text":"test"}'` |
| 중복 Slack 알림 | alertmanager.yml.j2의 `continue: true` 설정 확인 |
| Recovery 자동복구 안 됨 | `sudo journalctl -u recovery -f` → webhook 수신 여부 확인 |
| `pkill stress-ng` 후 rc=-15 종료 | `pkill -f` 대신 `pkill -x` 사용 (command line 매칭 함정) |
| Memory 시나리오 Alert 너무 빨리 해제 | stress-ng 기반 확인 (`/dev/shm` 방식은 OOM Killer 회수로 불안정) |
| Grafana 대시보드 빈 패널 | job 기준으로 query 되는지 확인 → grafana-dashboard.json 재import |
| Grafana 로그인 실패 | `secrets.yml`의 `grafana_admin_password` 확인 |
| FastAPI 500 에러 | DB PostgreSQL 상태 + `items` 테이블 권한 확인 |
| ALB 504 Gateway Timeout | Target Group 헬스체크 상태 + Nginx 상태 확인 |
| `Error: pg_hba.conf entry` | VPC CIDR(`10.0.0.0/16`) 매칭 확인 |

### 🔹 자주 쓰는 디버깅 명령

```bash
# Ansible 재실행 (인프라는 그대로, 설정만 다시 적용)
cd terraform && ansible-playbook -i inventory.yml ../ansible/site.yml

# 특정 서버 SSH 접속
ssh -i terraform/proj-key.pem ec2-user@[서버IP]

# DB 서버 접속 (jump host 경유)
ssh -i terraform/proj-key.pem \
    -o ProxyCommand='ssh -i terraform/proj-key.pem -W %h:%p ec2-user@[MGMT-IP]' \
    ec2-user@[DB-PRIVATE-IP]

# 서비스 로그 확인
sudo journalctl -u prometheus -n 50 --no-pager
sudo journalctl -u alertmanager -n 50 --no-pager
sudo journalctl -u recovery -f                    # 실시간

# Recovery log
sudo tail -f /opt/recovery/logs/recovery.log

# Prometheus 쿼리 테스트
curl -s 'http://localhost:9090/api/v1/query?query=up' | jq
curl -s 'http://localhost:9090/api/v1/query?query=nginx_up' | jq

# AlertManager 활성 알림 확인
curl -s http://localhost:9093/api/v2/alerts | jq

# chaos inject.sh 테스트
./chaos/inject.sh status
./chaos/inject.sh nginx1
./chaos/inject.sh all     # 전체 복구

# Tailscale 라우팅 확인
sudo tailscale status
ip route | grep "172.16"
```

---

## 💾 Terraform State 관리

```
✅ 각자 로컬에서 독립 관리 (terraform.tfstate)
❌ GitHub commit 금지 (.gitignore 등록)
❌ S3 remote backend 사용 금지 (공유 비용 발생)
```

각자 자기 AWS 계정에서 독립적으로 실행되므로 state 공유 불필요.

---

## 🔗 참고 자료

- [AWS VPC 가이드](https://docs.aws.amazon.com/vpc/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/tips_tricks/index.html)
- [Prometheus Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)
- [AlertManager Configuration](https://prometheus.io/docs/alerting/latest/configuration/)
- [Grafana Provisioning](https://grafana.com/docs/grafana/latest/administration/provisioning/)
- [Tailscale Subnet Routing](https://tailscale.com/kb/1019/subnets)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📝 주요 변경 이력

| 날짜 | 내용 | 담당 |
|---|---|---|
| 2026-05-22 | README 전면 개정 (폴더구조/아키텍처/시나리오/측정값 최신화) | 신준한 |
| 2026-05-21 | Chaos_Demo_Guide.md 추가 (Grafana 관전 포인트 + SRE 관점) | 김민규 |
| 2026-05-21 | Grafana 자동배포용 role/files/grafana_dashboard.json 추가 | 신준한 |
| 2026-05-20 | alert grouping: alertname+instance / grafana-dashboard.json 최종화 | 이지윤, 김민규 |
| 2026-05-19 | Memory 자동복구 v4 확정 (stress-ng + pkill -x) / timing 최적화 | 이지윤 |
| 2026-05-19 | chaos/inject.sh 4개 시나리오 정리 + reference/ 보존 | 이지윤 |
| 2026-05-19 | NAT Gateway → NAT Instance 전환 (비용 절감) | 신준한 |
| 2026-05-11 | 코드 리뷰 후 보안/버그/시연 18개 항목 수정 | 신준한 |
| 2026-05-11 | README 초기 작성 + 팀 협업 가이드 | 신준한 |
| 2026-05-08 | On-premise 발표 완료 → AWS 환경 작성 시작 | 팀 전체 |

---

**Team 5. EchoChallengers**  
조휘정 · 신준한 · 이지윤 · 김민규 · 한지우  
`EchoChallengers/project1-aws`