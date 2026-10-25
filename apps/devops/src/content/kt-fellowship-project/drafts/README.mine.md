# Jangingmall infra

> The AWS infrastructure for Midam (working name 장인몰, Jangin Mall), a
> marketplace for nationally certified master artisans with two AI features.
> Integrated Team 3, KT Cloud TECH UP fellowship. Region `ap-northeast-2` (Seoul).

## 1. What this repository builds

It builds the AWS environment that runs Midam's store and its two AI models:

- A product page generator on SGLang (Qwen3.8 27B with FLUX.2 Klein 9B) on an NVIDIA L40S.
- A gift chatbot on Ollama (Gemma 4 12B) on an NVIDIA T4.

The front end runs on Vercel. Everything else runs in one EKS cluster per
environment, built by Terraform and deployed by Argo CD.

**Honesty declaration.** The full service ran only in staging. Production
exists as code and as shared resources (ECR, the CI roles, CodeBuild, and the
account-wide security settings). Production with the GPUs off was estimated at
about $786 a month, and the shared budget was $330.

## 2. Repository layout

```
infra/
├── terraform/
│   ├── modules/          # 19 modules, one concern each
│   └── environments/
│       ├── staging/      # calls the modules; one terraform.tfvars
│       └── prod/
├── k8s/                  # base, components, and stage/prod overlays (Kustomize)
├── platform/             # Helm values: CNPG, Argo Rollouts, ALB Controller, observability
├── argocd/               # Argo CD applications per environment
├── scripts/              # bootstrap, validation, and drill scripts
└── CLAUDE.md             # the track's decision log and working rules
```

Every resource is defined in `modules/`. An environment folder only calls
modules, and each environment keeps one `terraform.tfvars`. A second variable
file was rejected because a missing `-var-file` falls back to defaults with no
warning.

## 3. Architecture summary

| Layer | Composition |
| --- | --- |
| Edge | Route 53, ACM, WAF in front of one ALB for the API, and CloudFront with OAC for product images |
| Network | Two VPCs, `10.0.0.0/16` (prod) and `10.1.0.0/16` (staging), with no peering. Public, app, and data subnets in two AZs. One NAT Gateway with a fixed EIP and an S3 Gateway Endpoint |
| Compute | EKS 1.35 with six managed node groups: two system, app, db, and two GPU (L40S and T4). Every node runs in AZ-a |
| Data | CloudNativePG with one primary and two replicas on three dedicated nodes, Redis with AOF on EBS, and S3 for images, returns, backups, models, and logs |
| Access | SSM Session Manager only, with no bastion and port 22 closed. Six IRSA roles and Parameter Store secrets mounted through the Secrets Store CSI driver |
| Delivery | GitHub Actions and CodeBuild push images to ECR through OIDC. Argo CD syncs, and Argo Rollouts holds each release for a manual promote |

The diagrams are on the Architecture tab of this page.

## 4. Design highlights

- **Isolated environments.** Staging and production sit in separate VPCs with
  ranges that never overlap and no route between them.
- **Least privilege by workload.** The ALB is the only entry from the internet.
  Each pod reaches only its own AWS resources through IRSA, and no node holds a key.
- **Rules that fail `plan`.** The database node group must keep three
  On-Demand nodes. The public endpoint must list team IPs. Variables that are
  hard to undo carry no default. A `precondition` or a `validation` block
  enforces each rule before a value reaches AWS.
- **The billing boundary is the module boundary.** The free network resources
  and the paid NAT Gateway live in separate modules. Paid resources stayed at
  `plan` until one shared apply.
- **GPUs start at zero.** Both GPU node groups start empty and run only while
  the AI track tests.

## 5. Bootstrap order

```
① Terraform state     scripts/bootstrap-tfstate.sh (S3 + DynamoDB, KMS-encrypted)
② Network             VPC, six subnets, route tables, internet gateway
③ Security groups     four groups, referenced by group
④ S3 endpoint         on the app and data route tables
⑤ NAT Gateway         fixed EIP and two CloudWatch alarms        💰
⑥ EKS                 cluster, OIDC provider                      💰
⑦ Node groups         six groups and the node role                💰
⑧ Add-ons and IRSA    VPC CNI with NetworkPolicy, CoreDNS, EBS CSI
⑨ Buckets             seven buckets with their lifecycle rules
⑩ Edge                ALB, WAF, Route 53, ACM, CloudFront
```

```bash
cd terraform/environments/staging
cp terraform.tfvars.example terraform.tfvars   # then set the team IPs
terraform init
terraform plan                                 # read every destroy before applying
terraform apply
```

## 6. Track

| Member | Area |
| --- | --- |
| Yunju Kang | Lead. Edge (ALB, WAF, Route 53, ACM) and monitoring |
| Junhan Shin | Vice lead. Network and security (VPC, subnets, routing, NAT, security groups, SSM) and the EKS cluster |
| Dajeong Park | Accounts, IAM, cost analysis, and documentation |
| Changwon Lee | Database and recovery, ECR, and CI/CD |
| Myungsoo Park | Cloud native: Kubernetes workloads, Argo CD, and RBAC |
