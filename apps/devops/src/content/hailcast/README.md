# project3-hailcast-infra

> hailcast is a project on AI demand-forecast predictive autoscaling and FinOps.
> This is its Terraform (IaC) repository.
> Org `ThisPod-ThatPod` / Region `ap-northeast-2` (Seoul) / Owner: Miseon Lee

## 1. What this repository builds

It builds the AWS foundation in Terraform. The system predicts taxi-call demand
from weather and time-of-day patterns. It adds pods before the traffic
arrives and removes them when demand drops.

```
Observe (Prometheus) → Predict (LightGBM) → Act (KEDA, Karpenter) → Verify (Grafana, OpenCost) → Predict again
```

- Proactive scaling: `predict` raises the KEDA `ScaledObject`'s
  `minReplicaCount` ahead of time from the forecast.
- Reactive scaling: KEDA reads the SQS call-queue length directly. It catches
  the load even when the prediction is wrong.
- Node supply: Karpenter adds EC2 Spot nodes when the pods do not fit. It
  removes them when the load drops.

This repository builds only that foundation: VPC, EKS, IRSA, the data stores,
and the CI roles. Installing the add-ons (KEDA, Karpenter, ArgoCD, the ALB
Controller) and deploying them belongs to the manifests repository (ArgoCD).
Installing them from the infrastructure Terraform with `helm_release` splits
ownership with ArgoCD and produces drift.

**Honesty declaration: this is a development environment.** It never ran as a
live service. The 26.5% pod-hour saving is a simulation. The AWS bill that
OpenCost reads after the refinement is real.

## 2. Repository layout (4 repos)

Where the deployment method differs, the repository is split.

| Repository | Deployment method | Scope |
| --- | --- | --- |
| `project3-hailcast-infra` (this one) | `terraform apply` | Infrastructure |
| `project3-hailcast-app` | `docker build` then ECR push | Application, ML |
| `project3-hailcast-manifests` | ArgoCD pulls (GitOps) | Deployment |
| `project3-hailcast-ops` | Not a deployment target | The team's shared operations tooling (setup, check, teardown). Owned by the team lead |

Inside this repository:

```
project3-hailcast-infra/
├── envs/dev/                # assembly and state (backend.tf, main.tf, variables.tf, outputs.tf, …)
├── modules/
│   ├── network/             # VPC, subnets, NAT, routing, gateway endpoints (S3, DynamoDB)
│   ├── storage/             # S3 model bucket, S3 CUR bucket, ECR
│   ├── eks/                 # cluster, system node group, OIDC, IRSA, access entry
│   ├── data/                # RDS, SQS call queue, Karpenter interruption queue, DynamoDB, Parameter Store
│   ├── cicd/                # GitHub Actions OIDC roles (ECR push, tf plan, tf apply)
│   ├── edge/                # Route 53, ACM, CloudFront (enable_edge switch, default true)
│   └── schedule/            # night-shutdown EventBridge Scheduler (enable_night_shutdown switch, default true)
├── docs/
│   ├── 네이밍규약서.md        # the single source of truth (SSOT) for every name and every team contract
│   └── 비용관리.md            # budget, tag coverage, destroy-order runbook
├── scripts/teardown_infra.sh
├── Makefile                 # init, fmt, validate, plan, apply, teardown, …
└── .github/workflows/terraform.yml
```

## 3. Architecture summary

![Overall architecture](./docs/images/architecture.png)

The VPC is `10.0.0.0/16` and spans availability zones 2a and 2c.

| Layer | Composition |
| --- | --- |
| Entry | ALB (created by the deployment team's Ingress). In front of it, Route 53, ACM, and CloudFront (`enable_edge` defaults to true; NS delegation and the ALB are prerequisites) |
| Compute | EKS. Platform pods on the managed system node group; application pods on the Spot nodes Karpenter supplies |
| Data | S3 (model, weather, traffic shards), RDS PostgreSQL Single-AZ (calls, predictions, scaling history), DynamoDB (the miss log), SQS (call queue and Karpenter interruption queue), Secrets Manager (the password RDS generates itself), Parameter Store (the RDS endpoint) |
| Cost | S3 CUR bucket (the AWS billing report and Athena query results). This is the path by which OpenCost reads real billed amounts |
| Access, security | No SSH inbound (SSM Session Manager). RDS 5432 accepts only traffic from the node security group. Pod permissions are separated per role through IRSA |

Node and subnet placement in detail:

![Cluster topology](./docs/images/cluster-topology.png)

## 4. Design highlights

- **Scaling is split into three layers.** Prediction raises `minReplicaCount` in
  advance. When the prediction is wrong, KEDA's queue-length trigger catches
  the load. When pods outgrow the available nodes, Karpenter adds nodes. A
  failure in one layer does not cause a service outage by itself.
- **Pod permissions are split by S3 prefix.** `predict` cannot write to the model path. The application loads a pickle directly from S3. Write
  access to that path would allow remote code execution.
- **The RDS password is kept away from people and repositories.** RDS generates
  it into Secrets Manager itself and ESO replicates it into a Kubernetes Secret
  in the cluster. The password is in no tfvars file, no CI variable, and nowhere
  in git.
- **CI permissions are split between plan and apply.** `plan` is read-only,
  except for writing the tfstate lock file, and it runs on every PR. `apply`
  runs only on the `dev` branch after an environment approval. The apply
  role's trust policy pins the environment, the workflow file, and the branch.
- **Cost is inside the design scope.** Every resource carries cost tags, and a
  budget sends alerts. A teardown runbook (`비용관리.md`) also covers the
  resources that Kubernetes created. The infrastructure track owns all of it.
- **Development-period cost is reduced on a schedule.** EventBridge Scheduler calls the AWS API directly and uses no Lambda. It stops the system node group
  and RDS every day from 02:00 to 10:00 KST (`enable_night_shutdown`, default
  true). The shutdown kept the learning period within budget.

## 5. Collaboration rules

- Branches: `main` (protected) ← `dev` (integration, PR + 1 approval) ← `feature/*`
- Every repository requires one approval. The team proposed two approvals for
  infra alone. A team reshuffle left too few reviewers, and the proposal was
  dropped.
- Commits: `Type(scope): subject`. For example `Feat(eks): …`, `Docs(규약서): …`
- When a name changes, fix the convention document before the code and share it
  with the team. The convention document is the SSOT.

## 6. Naming (summary)

```
<project_name>-<environment>-<resource type>[-<identifier>]
e.g. hailcast-dev-vpc, hailcast-dev-eks, hailcast-dev-rds-postgres
```

- Terraform variables are snake_case, AWS resources are kebab-case, and S3
  buckets take a random suffix because the namespace is global
- Root variables: `project_name=hailcast`, `environment=dev` (a single
  environment), `aws_region=ap-northeast-2`
- Careful: the Karpenter interruption queue's name (`hailcast-dev`) differs from
  the cluster name (`hailcast-dev-eks`). The deployment team must name the queue explicitly in `settings.interruptionQueue`.

Every resource name, every IRSA role and the ServiceAccount it maps to, the tag
convention, and the shared team contracts (environment variables, paths) are all
in [`docs/네이밍규약서.md`](./docs/네이밍규약서.md). Where this summary and the
convention document disagree, the convention document is right.

## 7. The path from a prediction to a scale

```
weather-cron ─(4 hours)→ S3 weather/
Two schedulers inside predict:
  ForecastScheduler ─(4 hours)→ predict → RDS Prediction table
  ScalingScheduler  ─(60 seconds)→ query RDS → patch the KEDA ScaledObject's minReplicaCount
KEDA ─(continuously)→ reactive worker scaling on SQS call-queue length
Karpenter ─(as needed)→ node supply, Spot reclamation handled through the interruption queue
```

The full flow below also shows the reactive branch for a missed prediction:

![Proactive scaling flow](./docs/images/scaling-flow.png)

- There is exactly one scaling target: `worker`. `predict` is pinned at 1 replica.
- Permissions come from two separate systems. Access to AWS resources is IRSA
  (AWS IAM). Patching the `ScaledObject` is Kubernetes RBAC. They do not mix.
  Sections 5-3 and 8-4 of the convention document give the details.

## 8. Getting started (dev)

Prerequisites: Terraform 1.11 or later (S3 native locking), and project account
credentials. The tfstate backend (S3, `backend.tf`) is already configured.

```bash
aws sts get-caller-identity   # confirm the project account first
make init
make plan
make apply                    # a person types yes. Cost starts here
```

- There is one shared tfstate. Only one person applies at a time. Announce each apply in the team channel first.
- CI: `gha-tf-plan` runs a plan on every PR. It is read-only except for the
  tfstate lock file. `apply` runs on the `dev` branch as
  `gha-tf-apply` after an `infra-apply` environment approval. The first apply creates these roles. A person runs that first apply locally.
- Nobody handles the RDS password. RDS generates it into Secrets Manager, and
  ESO (External Secrets Operator) replicates it into a Kubernetes Secret in the
  cluster.
- Run `make teardown` to take it down. The resources Kubernetes created (ALB,
  Karpenter nodes, and EBS) are outside tfstate. They must be cleared first, in order. See §5 of [`docs/비용관리.md`](./docs/비용관리.md).

## 9. Related documents

- [`docs/네이밍규약서.md`](./docs/네이밍규약서.md) is the SSOT for every name and every team contract
- [`docs/비용관리.md`](./docs/비용관리.md) covers the budget alerts, tag coverage, and destroy order
