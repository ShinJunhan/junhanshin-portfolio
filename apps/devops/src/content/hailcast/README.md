# project3-hailcast-infra

> hailcast: the Terraform (IaC) repository for a project on AI demand-forecast
> predictive autoscaling and FinOps
> Org `ThisPod-ThatPod` / Region `ap-northeast-2` (Seoul) / Owner: Miseon Lee

## 1. What this repository builds

It builds, in Terraform, the AWS foundation for a system that predicts taxi-call
demand from weather and time-of-day patterns, adds pods before the traffic
arrives, and reclaims them once things go quiet.

```
Observe (Prometheus) → Predict (LightGBM) → Act (KEDA, Karpenter) → Verify (Grafana, OpenCost) → Predict again
```

- Proactive scaling: `predict` raises the KEDA `ScaledObject`'s `minReplicaCount`
  ahead of time, using the predicted value
- Reactive safety net: KEDA reads the SQS call-queue length directly, so it
  catches the load immediately even when the prediction is wrong
- Node supply: when pods grow and there is nowhere to put them, Karpenter
  supplies EC2 (Spot) capacity and reclaims it when things quieten down

This repository builds only that foundation: VPC, EKS, IRSA, the data stores,
and the CI roles. Installing the add-ons (KEDA, Karpenter, ArgoCD, the ALB
Controller) and deploying them belongs to the manifests repository (ArgoCD).
Installing them from the infrastructure Terraform with `helm_release` splits
ownership with ArgoCD and produces drift.

**Honesty declaration: this is a development environment rather than a live
service.** What is presented is the design, the implementation, and a simulated
expected effect. The saving figure is modelled.

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

VPC `10.0.0.0/16`, availability zones 2a and 2c.

| Layer | Composition |
| --- | --- |
| Entry | ALB (created by the deployment team's Ingress). In front of it, Route 53, ACM and CloudFront (`enable_edge` defaults to true; NS delegation and the ALB are prerequisites) |
| Compute | EKS. Platform pods on the managed system node group; application pods on the Spot nodes Karpenter supplies |
| Data | S3 (model, weather, traffic shards), RDS PostgreSQL Single-AZ (calls, predictions, scaling history), DynamoDB (the miss log), SQS (call queue and Karpenter interruption queue), Secrets Manager (the password RDS generates itself), Parameter Store (the RDS endpoint) |
| Cost | S3 CUR bucket (the AWS billing report and Athena query results). This is the path by which OpenCost reads real billed amounts |
| Access, security | No SSH inbound (SSM Session Manager). RDS 5432 accepts only traffic from the node security group. Pod permissions are separated per role through IRSA |

Node and subnet placement in detail:

![Cluster topology](./docs/images/cluster-topology.png)

## 4. Design highlights

- **Scaling is split into three layers.** Prediction (proactive) raises
  `minReplicaCount` in advance; when the prediction is wrong, KEDA's queue-length
  trigger (reactive) catches it; and when pods grow past the available room,
  Karpenter supplies nodes. One layer failing does not translate directly into a
  service outage.
- **Pod permissions are split by S3 prefix.** `predict`, for one, is not given
  write access to the model path. The application loads a pickle straight out of
  S3, so being able to write to that path is remote code execution.
- **The RDS password is kept away from people and repositories.** RDS generates
  it into Secrets Manager itself and ESO replicates it into a Kubernetes Secret
  in the cluster. The password is in no tfvars file, no CI variable, and nowhere
  in git.
- **CI permissions are split between plan and apply.** `plan` is read-only (the
  one exception being writing the tfstate lock file) and runs on every PR;
  `apply` is restricted to the `dev` branch behind an environment approval. The
  defensive line for the apply role is the trust policy, which pins the
  environment, the workflow file and the branch.
- **Cost is inside the design scope.** Cost tags on every resource, budget
  alerts, and a teardown-order runbook (`비용관리.md`) that reaches the resources
  Kubernetes created. All of it is the infrastructure's responsibility.
- **Development-period cost is reduced on a schedule.** EventBridge Scheduler
  calls the AWS API directly, with no Lambda, to take the system node group and
  RDS down and back up daily between 02:00 and 10:00 KST
  (`enable_night_shutdown`, default true). It is a budget device for the
  learning period.

## 5. Collaboration rules

- Branches: `main` (protected) ← `dev` (integration, PR + 1 approval) ← `feature/*`
- The approval count is 1 across every repository. There was a proposal to raise
  infra alone to 2, but a team reshuffle reduced the number of people available
  to review and it was dropped
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
  the cluster name (`hailcast-dev-eks`). The deployment team has to name the
  queue explicitly in `settings.interruptionQueue`.

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

The full flow, including the reactive branch taken when the prediction misses:

![Proactive scaling flow](./docs/images/scaling-flow.png)

- There is exactly one scaling target: `worker`. `predict` is pinned at 1 replica.
- Permissions come from two separate systems. Access to AWS resources is IRSA
  (AWS IAM); patching the `ScaledObject` is Kubernetes RBAC. They do not mix.
  Details in §5-3 and §8-4 of the convention document.

## 8. Getting started (dev)

Prerequisites: Terraform 1.11 or later (S3 native locking), and project account
credentials. The tfstate backend (S3, `backend.tf`) is already configured.

```bash
aws sts get-caller-identity   # confirm you are in the project account first
make init
make plan
make apply                    # a person types yes. Cost starts here
```

- There is one shared tfstate, so only one person applies at a time. Announce it
  in the team channel before you start.
- CI: `gha-tf-plan` (read-only, the one exception being writing the tfstate lock
  file) runs a plan on every PR. `apply` runs on the `dev` branch as
  `gha-tf-apply`, after an `infra-apply` environment approval. These roles only
  exist once the first apply has created them, so the first apply is done
  locally.
- Nobody handles the RDS password. RDS generates it into Secrets Manager, and
  ESO (External Secrets Operator) replicates it into a Kubernetes Secret in the
  cluster.
- To take it down, `make teardown`. The resources Kubernetes created (ALB,
  Karpenter nodes, EBS) are outside tfstate, so there is an order to clearing
  them first. See §5 of [`docs/비용관리.md`](./docs/비용관리.md).

## 9. Related documents

- [`docs/네이밍규약서.md`](./docs/네이밍규약서.md) is the SSOT for every name and every team contract
- [`docs/비용관리.md`](./docs/비용관리.md) covers the budget safety net, tag coverage and destroy order
