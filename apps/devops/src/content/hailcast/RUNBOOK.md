# hailcast: Operations Runbook

> This runbook covers how to run the system, take it down, and rebuild it. The
> README says what hailcast is. This document lists the operating steps.
>
> Owner: the ops repository (`project3-hailcast-ops`). Every command below
> starts there.

**Every identifier in this document is a placeholder.** `<account-id>`,
`<vpc-id>`, `<cert-arn>` and the rest stand in for real values. The real values
live in the team channel and in `.env`. They are never stored in a
repository. The team destroyed the environment behind this document. The procedure still applies.

---

## 0. Before anything

Clone the four repositories side by side in one parent folder. The layout is a
requirement. `make -C ../project3-hailcast-infra` and the Docker credential
swap both use relative paths. A repository cloned elsewhere or under another
name breaks them without an error.

```
~/project3-hailcast/
├── project3-hailcast-infra          # terraform apply
├── project3-hailcast-app            # docker build → ECR
├── project3-hailcast-manifests      # ArgoCD pulls
└── project3-hailcast-ops            # ← this repository
```

```bash
mkdir -p ~/project3-hailcast && cd ~/project3-hailcast
git clone https://github.com/ThisPod-ThatPod/project3-hailcast-ops.git
cd project3-hailcast-ops
cp .env.example .env          # fill in PROJECT_ACCOUNT_ID, the value is in the team channel
make clone-all                # the other three, as siblings
make setup                    # tooling, credentials, kubeconfig
make check                    # environment and EKS reachability
```

`make setup` installs AWS CLI v2, Terraform, kubectl 1.35, Helm 3, and Docker.
No Tailscale and no Ansible are involved. This is a single-account, EKS,
GitOps architecture.

### The account guard

Every command that touches AWS first compares `sts get-caller-identity` against `PROJECT_ACCOUNT_ID`. It stops on a mismatch.

| Where | If the account is not the project account |
|---|---|
| `make setup` | stops immediately |
| `make check` | shows red and exits with `1` at the end (the other checks still print) |
| `make infra-init` / `plan` / `apply` / `destroy` | stops immediately |
| `make kubeconfig` / `app-build-push` / `deploy` | stops immediately |
| `make destroy-all` | stops immediately |
| `make infra-fmt` | no guard (it needs no credentials) |

Watch for two common mistakes:

- **Environment credentials override profiles.** An `AWS_ACCESS_KEY_ID` left in
  the shell takes priority over `AWS_PROFILE` and `[default]`. If the wrong account is
  picked up, `unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN`
  first.
- **Set `AWS_PROFILE` in the shell. Never set it in `.env`.** The tooling reads one
  value from `.env` and does not source the file. A profile set there splits
  the guard and Terraform across different accounts. `make infra-destroy` runs
  the guard and the delegated command in separate shells.

---

## 1. Daily operation

### `make check-contract`: failures with no error message

The costliest failures on this project produced no error. A
missing tag on a security group means pods cannot reach the database, and the
only symptom is a connection timeout. An IRSA role whose ServiceAccount name is
one character off produces "access denied" against an IAM policy that is
perfectly correct.

Run it every day. A run the night before a demo is too late to fix what it finds.

```bash
make check-contract
```

| Stage | What it reads | Credentials | When |
|---|---|---|---|
| static | the Terraform source in `infra` | not needed | any time, before anything is created |
| runtime | real resources, via `aws describe` | needed | after apply (skipped if absent) |

The two stages answer different questions. Static asks whether the code says it.
Runtime asks whether it was actually built. The gap shows when a feature
flag is off. IRSA declares ten roles in code, and only two exist while
`enable_app_irsa` is false.

What it checks:

- the `karpenter.sh/discovery` tag on the private subnets and the **node** security group. The check also confirms the tag **value**.
- `kubernetes.io/role/elb` and `internal-elb` for subnet discovery
- RDS 5432 inbound uses a **security-group reference** and never a CIDR
- role key ↔ ServiceAccount for all ten IRSA roles
- `sqs:PurgeQueue` appears nowhere. No wildcard grants it either. A role with it
  could empty the queue during a demo and stop the scaling.
- unreviewed wildcards (`Resource: "*"`, `actions = ["*"]`). Vendored upstream
  policies are **excluded** because they contain wildcards on purpose.
- missing `description` on security groups and IAM policies. A description can
  only be added later by recreating the resource.

> It reads the local `../project3-hailcast-infra` working tree. On a stale branch, it checks stale code. It prints the branch
> and commit it read at the top for this reason. Run it on `dev` to see the integrated state.

**Known limit:** it checks names and does not check values. A collection
interval was documented as 2 hours and coded as 4. The mismatch stayed for
the whole project.

### The night shutdown

EventBridge Scheduler stops the system node group and RDS overnight. It calls the AWS API directly and uses no Lambda. The shutdown is on by default (`enable_night_shutdown = true`).

| Time (KST) | Schedule | Action |
|---|---|---|
| 02:00 | `night-stop-nodes` | system node group min 0, desired 0 |
| 02:05 | `night-stop-rds` | stop RDS |
| 09:50 | `morning-start-rds` | start RDS (takes several minutes to come up) |
| 10:00 | `morning-start-nodes` | node group min 2, desired 2 |

**Check it every morning.** A schedule does not fail at creation. It fails at 02:00 when it runs. It retries twice and then discards the event. No DLQ catches it. The only evidence is the state of the nodes and the database the
next morning:

```bash
kubectl get nodes
aws rds describe-db-instances --db-instance-identifier hailcast-dev-rds-postgres \
  --query 'DBInstances[0].DBInstanceStatus' --output text
```

**Expect leftover Karpenter nodes.** When the system node group goes to zero at
02:00, the Karpenter controller loses the node it was running on and cannot move
to a node it created itself. Any Spot node alive at that moment stays up until
morning. Spot pricing keeps this cost low. The controller removes the nodes when it restarts at 10:00.

**On a demo day, apply with `enable_night_shutdown = false`.**

---

## 2. Deploying a change

Three repositories deploy. The ops repository is local tooling, and it creates
no AWS resource and no deployment definition.

All three take the same route in: `feature/*` → PR → **one approval** → `dev`.

| Repository | What happens after the merge |
|---|---|
| `infra` | `plan` runs on every PR (read-only). `apply` runs on `dev` after an `infra-apply` environment approval |
| `app` | Only the changed services rebuild. Each image is pushed to ECR through OIDC and tagged with the commit SHA. A bot then updates that tag in `manifests`. |
| `manifests` | ArgoCD watches it and syncs automatically. `selfHeal` and `prune` are on. |

An application change needs one PR approval to reach running pods. No manual
deploy step sits between the merge and the pods.

**A person runs the first `apply` locally.** The CI roles do not exist
until that apply creates them. There is one shared tfstate. Only one person
applies at a time. Announce it in the team channel first.

**Nobody handles the RDS password.** RDS generates it into Secrets Manager and
ESO replicates it into a Kubernetes Secret. It is in no tfvars file, no CI
variable, and nowhere in git.

---

## 3. Watching it run

**Grafana runs five dashboards:** predictive scaling, queue and KEDA, worker and
Kubernetes, FinOps, and the operations summary. Read the panel that pairs
**Pending pods against Ready nodes** first. It shows a Karpenter supply
delay directly.

**Prometheus** scrapes `predict /metrics` every 30 seconds alongside
kube-state-metrics. **Ten alert rules** reach Telegram. Four rules are critical. They include CrashLoop and target-down. Six rules are warnings. They include queue depth and memory.

The **queue alert** waits for **1,000** messages. **KEDA** begins to scale at **500**. The alert fires only when scaling fails to absorb the load.

**OpenCost** divides cluster cost by namespace and pod. This division isolates the worker cost. After the refinement, OpenCost reads the **Cost and Usage Report** through Athena. The report includes Spot prices. Earlier, OpenCost priced resources from the AWS list price.

---

## 4. Tearing it down

### The principle

`terraform destroy` deletes **only what is in the state file**. The ALBs, ENIs,
and Karpenter nodes that Kubernetes created are not in it. They survive the
destroy and keep billing. They also block the VPC deletion for hours.

| Created by | Examples | How it goes |
|---|---|---|
| Terraform | VPC, subnets, EKS, node group, NAT, RDS | `terraform destroy` |
| Kubernetes | LoadBalancer → CLB/NLB, Ingress → ALB, VPC CNI → secondary ENIs | `kubectl` **first** |
| Karpenter | EC2 nodes, separate from the node group | delete the nodeclaims **first** |

Delete the Kubernetes objects while the cluster is still alive to run its
finalizers. Delete EKS first, and the cleanup never runs.

### The five gates

Do not start until all five are settled. These are **team decisions**. The lead
does not make them alone.

| # | Decision | Options | Environment variable |
|---|---|---|---|
| 1 | Keep or drop the CUR bucket | keep / drop | `CUR_HANDLING=keep\|drop` |
| 2 | How the manifests are deleted | `argocd` CLI / `kubectl` | `ARGOCD_DELETE_PATH=argocd\|kubectl` |
| 3 | Take a manual RDS snapshot | yes / no (accepting the loss of all call, prediction, and scaling history) | manual |
| 4 | Who installs ArgoCD on rebuild | a named person + the install manifest | n/a |
| 5 | Real destroy, or a `plan -destroy` rehearsal | rehearsal (read-only, ~1 min) / real | `CONFIRM=yes` (unset = rehearsal) |

Gate 5 matters most. A rehearsal deletes the Kubernetes objects, stops, and runs `plan -destroy`. A misread can destroy the infrastructure the day before a
presentation.

### Preparation

```bash
aws sts get-caller-identity --query Account --output text   # not the project account → stop here
aws eks update-kubeconfig --region ap-northeast-2 --name hailcast-dev-eks
kubectl get nodes
terraform -chdir=envs/dev init
```

**Always download the model artifacts first.** Without them, the rebuild lacks a model, and prediction stops:

```bash
BUCKET=$(aws s3api list-buckets \
  --query "Buckets[?starts_with(Name,'hailcast-dev-model-artifacts')].Name" --output text)
aws s3 cp "s3://$BUCKET/models/latest/model.pkl" ~/hailcast-backup/
aws s3 cp "s3://$BUCKET/models/latest/metadata.json" ~/hailcast-backup/
terraform -chdir=envs/dev output > ~/hailcast-backup/output_before_destroy.txt
```

### The CUR bucket: settle it before the destroy

The CUR bucket sets `force_destroy = false`. It deletes only when it is empty.
AWS keeps writing billing data into it, and it is never empty. The destroy
stops there with `BucketNotEmpty`. The bucket sits early in the dependency
graph, and the destroy stops **before** it removes anything expensive.

To keep the cost history, delete the report definition. Then remove the bucket
and its five companion resources from state. They survive as resources
outside IaC. To discard it, delete the definition and set `force_destroy` to
`true`. **Apply that before starting the destroy.** In the other order, EKS,
NAT, and RDS are all recreated.

### Deleting the Kubernetes resources

**Delete the ArgoCD Applications before the Ingresses.** `selfHeal` and `prune`
are on for every Application. An Ingress removed with `kubectl` comes back
immediately.

Load balancer deletion is asynchronous. Wait until the ALBs and Ingresses are
gone before continuing. If they are still listed, wait another three minutes
and check again.

### Running it

```bash
ARGOCD_DELETE_PATH=argocd CUR_HANDLING=keep bash scripts/teardown.sh --yes
```

The orchestrator runs `manifest → infra → app` in order. It asks for
confirmation between stages and **does not continue past a failure**. It passes `CONFIRM=yes` to the infra stage for a real destroy. It never passes `FORCE=yes`. While an ALB or
a Karpenter node is still alive, a person must read the warning and decide.

> On the first run, `make destroy-all` stops at the infra ALB guard. This is
> **correct behavior**. It means the manifests still exist. A
> failed ALB *query* also stops the run on purpose. "There is no ALB" and "I
> could not find out" are different answers.

**Measured on 2026-08-03:** the destroy removed 140 resources in 21 minutes 40
seconds with no errors or warnings. One S3 bucket took 20m53s of that time.
The node group took 8m10s, and CloudFront took 3m14s. The earlier runbook estimate said "over ten minutes."

Terraform shows no progress while it works through a bucket with hundreds of
thousands of objects. Repeated `Still destroying...` messages are normal. **Do
not interrupt it.** An interrupted destroy leaves the state out of sync with
AWS.

### The residual scan

Run this even when the destroy ends cleanly. Look for anything still billing:
orphaned ENIs (`status=available`), EC2 nodes, NAT gateways, unassociated
Elastic IPs, detached EBS volumes, and load balancers of both kinds.

Filter on the **absence** of `ManagedBy=terraform`. One exception applies. The
Karpenter `EC2NodeClass` adds that tag to its own nodes. Karpenter nodes
pass the filter and stay hidden. Count them separately by `karpenter.sh/nodepool`.

**Check the bill the next day.** The bill is the final check.

---

## 5. Rebuilding from zero

Names stay the same after a rebuild. Internal identifiers change. Terraform
rewires most of them inside the apply. **Six values are hardcoded in the
manifests.** `replace_rebuild_values.sh` in the manifests repository
replaces all six and stops on any mismatch.

| Value | Where it lands | If skipped |
|---|---|---|
| ACM certificate ARN | the three `ingress.yaml` files | points at a certificate that no longer exists → no HTTPS listener |
| VPC ID | `aws-load-balancer-controller/values.yaml` | the controller points at a VPC that does not exist → no ALB at all |
| RDS master secret ARN | `externalsecret-rds-credentials.yaml` | ESO queries a missing secret. A placeholder Secret appears with `DB_USER` and `DB_PASSWORD` empty. call-api, predict, and worker all fail with `CreateContainerConfigError`. |
| Model bucket name | four `deployment.yaml` files + the manual IAM policy | `NoSuchBucket` errors appear, or the model upload fails with `AccessDenied`. The app shows that error as "file not found". |
| ALB inbound security-group ID | the `security-groups` annotation on three ingresses | the old group was destroyed with everything else, and the Ingress fails to reconcile |
| CUR bucket suffix | `addons/opencost/values.yaml` | OpenCost queries a missing bucket, and the FinOps board shows no billed cost |

Values that change but need no intervention: the EKS endpoint, the OIDC
provider ARN, cluster and node security-group IDs, the RDS endpoint, the CloudFront domain, and the subnet IDs. None are hardcoded anywhere.

Values that do not change at all, because they are fixed by name: the cluster
name, all ten IRSA role ARNs, the SQS queue URL, the Karpenter interruption
queue name (`hailcast-dev`), the ECR addresses, the ingress host, the service
URL, the DynamoDB table, and the CUR definition name. The interruption queue
name is deliberately **different** from the cluster name `hailcast-dev-eks`.
The deployment track must name it explicitly in `settings.interruptionQueue`.

### Order

1. **infra**: reset `alb_dns_name` to `""`. A person then runs the first apply **locally**. If CI applies first, no human can use `kubectl`.
2. **infra**: hand the four outputs to the deployment track and reissue kubeconfig.
3. **deployment**: `make bootstrap-all` installs ArgoCD, installs the ESO
   CRDs, and force-syncs the RDS secret in one command. The team did these three
  steps by hand in the 2026-08-18 rebuild. A script now runs them and prints
  its own recovery steps on failure.
4. **deployment**: run `replace_rebuild_values.sh` with the six values above.
   Then open a PR, merge it, and confirm every Application is Synced and
   Healthy.
5. **app**: rebuild all six images with `workflow_dispatch`. A plain `dev` push
   builds only the changed services, and the rest stay on `ImagePullBackOff`
6. **infra**: update the bucket suffix in the manual IAM policy, **before** the
   app team uploads the model
7. **app**: re-upload `model.pkl` and `metadata.json`
8. **deployment** raises the Ingress → **infra** puts the new ALB address into
   `alb_dns_name` and applies a second time. This apply creates CloudFront.
9. **infra**: migrate the CUR bucket and recreate the definition. This step can
   wait. It does not conflict with any step above.
10. **Done when**: nodes are Ready, pods are Running, every Application is
    Healthy, `plan` reports no changes, the service URL returns 200, and **all
    six ECR repositories contain an image**

That last check exists because of step 5. In the 2026-08-18 rebuild, `frontend` ended with an empty repository and `ImagePullBackOff`.

### Two manual recoveries seen in practice

**`SecretSynced: True` but a key is empty.** The sync reports success, and the
Secret exists. Nothing looks wrong until three pods fail to start. Check the
keys themselves. The sync status is not enough. All three keys must be present: `DB_HOST`, `DB_PASSWORD`, and `DB_USER`.

**The ESO CRDs were applied at the wrong version first.** Reapplying over them
does not fix it. The bundle must match the `targetRevision` pinned in the
ArgoCD Application. Check that value again before applying.

---

## 6. Cost guardrails

**Three things bill whether or not anyone is using them**: the EKS control
plane, the NAT gateway, and RDS. Destroy is the largest saving available.
The night shutdown is the second largest.

- **Budgets.** A monthly budget sends alerts at 80% and 100%. The apply role is
  explicitly **denied** `budgets` permissions. A scripted mistake cannot
  change the budget meant to catch it. The budget was created by hand in the
  console.
- **Cost allocation tags.** The three tags are `Project`, `Environment`, and `ManagedBy`. The tags
  were activated on 2026-07-25. Usage before that date carries no tags, and AWS
  does not backfill it.
- **Runtime-created resources do not inherit `default_tags`.** Kubernetes
  creates the Karpenter nodes and ALBs. The deployment track must add the
  same three tags through `EC2NodeClass.tags` and the
  `alb.ingress.kubernetes.io/tags` annotation. A missed tag leaves a gap in
  the cost report. No error reports it.

---

## 7. Known limits

These limits are kept on record.

- **The runtime half of `check-contract` is skipped entirely in CI.** It expects
  an AWS profile. GitHub Actions OIDC supplies credentials as environment
  variables. The account comparison fails, only the static checks run, and the
  job **ends green**. Fix this before relying on it in CI.
- **The verifier checks names and skips parameter values.**
- **The HCL parser mis-reads `#` or braces inside a string literal.** No current
  code hits this.
- **The naming convention pointed at code by line number.** Any edit that
  shifted lines meant checking every citation again by hand. Citations should
  use anchors instead of line numbers.
- **A `SecurityGroup` inbound rule documented as "self only"** diverged from
  reality once the ALB controller began adding rules at runtime. The team found
  it while preparing the presentation.
