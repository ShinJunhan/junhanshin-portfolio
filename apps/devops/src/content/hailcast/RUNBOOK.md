# hailcast: Operations Runbook

> How the system is run, taken down, and put back. The README says what
> hailcast is; this says what you do to it.
>
> Owner: the ops repository (`project3-hailcast-ops`). Every command below
> starts there.

**Every identifier in this document is a placeholder.** `<account-id>`,
`<vpc-id>`, `<cert-arn>` and the rest stand in for real values that live in the
team channel and in `.env`, never in a repository. The environment this was
written against has been destroyed; the procedure is the part that survives.

---

## 0. Before anything

Four repositories, cloned as siblings inside one basket. The layout is a
requirement. `make -C ../project3-hailcast-infra` and the Docker credential
swap both resolve by relative path, so a repository cloned elsewhere or under
another name silently takes the delegation with it.

```
~/project3-hailcast/
├── project3-hailcast-infra          # terraform apply
├── project3-hailcast-app            # docker build → ECR
├── project3-hailcast-manifests      # ArgoCD pulls
└── project3-hailcast-ops            # ← you are here
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

`make setup` installs AWS CLI v2, Terraform, kubectl 1.35, Helm 3 and Docker.
No Tailscale and no Ansible are involved. This is a single-account, EKS,
GitOps architecture.

### The account guard

Every command that touches AWS compares `sts get-caller-identity` against
`PROJECT_ACCOUNT_ID` before it does anything, and stops on a mismatch.

| Where | If the account is not the project account |
|---|---|
| `make setup` | stops immediately |
| `make check` | red, and `exit 1` at the end (the rest of the checks still print) |
| `make infra-init` / `plan` / `apply` / `destroy` | stops immediately |
| `make kubeconfig` / `app-build-push` / `deploy` | stops immediately |
| `make destroy-all` | stops immediately |
| `make infra-fmt` | no guard, because it needs no credentials at all |

Two things that catch people out:

- **Environment credentials beat profiles.** `AWS_ACCESS_KEY_ID` left in the
  shell wins over `AWS_PROFILE` and over `[default]`. If the wrong account is
  picked up, `unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN`
  first.
- **Set `AWS_PROFILE` in your shell, never in `.env`.** `.env` is read for one
  value and is deliberately not sourced. Put a profile in there and the guard
  and Terraform end up looking at different accounts, because `make infra-destroy`
  runs the guard and the delegation in separate shells.

---

## 1. Daily operation

### `make check-contract`: catching what dies quietly

The expensive failures on this project were the ones that produced no error. A
missing tag on a security group means pods cannot reach the database, and the
only symptom is a connection timeout. An IRSA role whose ServiceAccount name is
one character off produces "access denied" against an IAM policy that is
perfectly correct.

Run it daily, not the night before a demo.

```bash
make check-contract
```

| Stage | What it reads | Credentials | When |
|---|---|---|---|
| static | the Terraform source in `infra` | not needed | any time, before anything is created |
| runtime | real resources, via `aws describe` | needed | after apply (skipped if absent) |

The two answer different questions: static asks *is that what the code says*,
runtime asks *is that what actually got built*. The gap shows up when a feature
flag is off. IRSA declares ten roles in code, and only two exist while
`enable_app_irsa` is false.

What it checks:

- `karpenter.sh/discovery` on the private subnets and the **node** security
  group, and that the **value** itself is right
- `kubernetes.io/role/elb` and `internal-elb` for subnet discovery
- RDS 5432 inbound is a **security-group reference**, never a CIDR
- role key ↔ ServiceAccount for all ten IRSA roles
- `sqs:PurgeQueue` appears nowhere, including where a wildcard would pull it in.
  Attached, it empties the queue mid-demo and scaling collapses
- unreviewed wildcards (`Resource: "*"`, `actions = ["*"]`), **excluding**
  vendored upstream policies, which legitimately contain them
- missing `description` on security groups and IAM policies, which can only be
  added later by recreating the resource

> It reads *your local* `../project3-hailcast-infra` working tree. Run it on a
> stale branch and it checks stale code, which is why it prints the branch and
> commit it read at the top. Run it on `dev` to see the integrated state.

**Known limit:** it checks names, not values. A collection interval documented
as 2 hours and coded as 4 sat there the whole project.

### The night shutdown

EventBridge Scheduler calls the AWS API directly, with no Lambda in the path,
to stop the system node group and RDS overnight. On by default
(`enable_night_shutdown = true`).

| Time (KST) | Schedule | Action |
|---|---|---|
| 02:00 | `night-stop-nodes` | system node group min 0 · desired 0 |
| 02:05 | `night-stop-rds` | stop RDS |
| 09:50 | `morning-start-rds` | start RDS (takes several minutes to come up) |
| 10:00 | `morning-start-nodes` | node group min 2 · desired 2 |

**Check it every morning.** A schedule does not fail when you create it; it
fails at 02:00 when it runs, and it retries twice and then discards the event
with no DLQ. The only evidence is the state of the nodes and the database the
next morning:

```bash
kubectl get nodes
aws rds describe-db-instances --db-instance-identifier hailcast-dev-rds-postgres \
  --query 'DBInstances[0].DBInstanceStatus' --output text
```

**Expect leftover Karpenter nodes.** When the system node group goes to zero at
02:00, the Karpenter controller loses the node it was running on and cannot move
to a node it created itself. Any Spot node alive at that moment survives until
morning. At Spot prices the loss is small, and they are reclaimed once the
controller returns at 10:00.

**On a demo day, apply with `enable_night_shutdown = false`.**

---

## 2. Deploying a change

Three repositories deploy. The ops repository is local tooling, and it creates
no AWS resource and no deployment definition.

All three take the same route in: `feature/*` → PR → **one approval** → `dev`.

| Repository | What happens after the merge |
|---|---|
| `infra` | `plan` runs on every PR (read-only). `apply` runs on `dev` after an `infra-apply` environment approval |
| `app` | only the changed services rebuild; the image is pushed to ECR via OIDC, tagged with the commit SHA; a bot then updates that tag in `manifests` |
| `manifests` | ArgoCD is watching. It syncs on its own, with `selfHeal` and `prune` on |

So an application change is one PR approval from merge to running pods, with no
manual deploy step anywhere in the middle.

**The first `apply` is run locally, by a person.** The CI roles do not exist
until that apply creates them. And there is one shared tfstate, so only one
person applies at a time. Announce it in the team channel first.

**Nobody handles the RDS password.** RDS generates it into Secrets Manager and
ESO replicates it into a Kubernetes Secret. It is in no tfvars file, no CI
variable, and nowhere in git.

---

## 3. Watching it run

**Grafana, four dashboards:** predictive scaling · queue and KEDA · worker ·
operations summary. The one to read first pairs **Pending pods against Ready
nodes**, which is how a Karpenter supply delay becomes visible rather than
inferred.

**Prometheus** scrapes `predict /metrics` every 30 seconds alongside
kube-state-metrics. **Eight alert rules** reach Telegram: CrashLoop and
target-down as critical, queue depth and memory as warning.

Note the offset: the **queue alert fires at 1,000, twice the KEDA trigger at
500**. The page is meant to fire when scaling has failed to absorb the load, not
every time it starts working.

**OpenCost** splits cluster cost by namespace and pod, which is what makes
worker-only cost separable from cluster cost. It prices from the **AWS list
price**, because the CUR integration was scoped and never finished, so treat
every figure it reports as an estimate.

---

## 4. Tearing it down

### The principle

`terraform destroy` deletes **only what is in the state file**. The ALBs, ENIs
and Karpenter nodes that Kubernetes created are not in it: they survive, they
keep billing, and they block the VPC from being deleted for hours.

| Created by | Examples | How it goes |
|---|---|---|
| Terraform | VPC, subnets, EKS, node group, NAT, RDS | `terraform destroy` |
| Kubernetes | LoadBalancer → CLB/NLB, Ingress → ALB, VPC CNI → secondary ENIs | `kubectl` **first** |
| Karpenter | EC2 nodes, separate from the node group | delete the nodeclaims **first** |

Delete the Kubernetes objects while the cluster is still alive to run its
finalizers. Kill EKS first and the cleanup never runs.

### The five gates

Do not start until all five are settled. These are **team decisions**, not the
lead's to make alone.

| # | Decision | Options | Environment variable |
|---|---|---|---|
| 1 | Keep or drop the CUR bucket | keep / drop | `CUR_HANDLING=keep\|drop` |
| 2 | How the manifests are deleted | `argocd` CLI / `kubectl` | `ARGOCD_DELETE_PATH=argocd\|kubectl` |
| 3 | Take a manual RDS snapshot | yes / no (accepting the loss of all call, prediction and scaling history) | manual |
| 4 | Who installs ArgoCD on rebuild | a named person + the install manifest | n/a |
| 5 | Real destroy, or a `plan -destroy` rehearsal | rehearsal (read-only, ~1 min) / real | `CONFIRM=yes` (unset = rehearsal) |

Gate 5 matters most. On a rehearsal you stop after the Kubernetes deletions and
run `plan -destroy`. Misread it and you have destroyed the infrastructure the
day before a presentation.

### Before you start

```bash
aws sts get-caller-identity --query Account --output text   # not the project account → stop here
aws eks update-kubeconfig --region ap-northeast-2 --name hailcast-dev-eks
kubectl get nodes
terraform -chdir=envs/dev init
```

**Download the model artifacts first, always.** Without them the rebuild has no
model and prediction stops dead:

```bash
BUCKET=$(aws s3api list-buckets \
  --query "Buckets[?starts_with(Name,'hailcast-dev-model-artifacts')].Name" --output text)
aws s3 cp "s3://$BUCKET/models/latest/model.pkl" ~/hailcast-backup/
aws s3 cp "s3://$BUCKET/models/latest/metadata.json" ~/hailcast-backup/
terraform -chdir=envs/dev output > ~/hailcast-backup/output_before_destroy.txt
```

### The CUR bucket: settle this or the destroy fails early

The CUR bucket is `force_destroy = false`, meaning it will not delete unless it
is empty, and AWS keeps writing billing data into it so it is never empty. The
destroy stops there with `BucketNotEmpty`, and because the bucket sits early in
the dependency graph it stops **before** it has removed anything expensive.

To keep the cost history: delete the report definition, then drop the bucket and
its five companion resources out of state so they survive as resources outside
IaC. To discard it: delete the definition, flip `force_destroy` to `true` and
**apply that before starting the destroy**. In the other order, EKS, NAT and
RDS are all recreated.

### Deleting the Kubernetes resources

**Delete the ArgoCD Applications before the Ingresses.** `selfHeal` and `prune`
are on for every Application, so an Ingress removed with `kubectl` is
resurrected immediately.

Then wait until the ALBs and Ingresses are actually gone before continuing,
because load balancer deletion is asynchronous. If they are still listed, wait another
three minutes and check again.

### Running it

```bash
ARGOCD_DELETE_PATH=argocd CUR_HANDLING=keep bash scripts/teardown.sh --yes
```

The orchestrator conducts `manifest → infra → app`, confirms between stages, and
**does not continue past a failure**. It injects `CONFIRM=yes` into the infra
stage so the destroy is real, and it never injects `FORCE=yes`. While an ALB or
a Karpenter node is still alive, a person has to see the warning and decide.

> `make destroy-all` stopping at the infra ALB guard on the first run is
> **correct behaviour, not a fault**. It means the manifests have not been
> cleared yet. A failure to *query* the ALBs also stops the run, deliberately,
> because "there is no ALB" and "I could not find out" are different answers.

**Measured, 2026-08-03:** 140 resources, 21 minutes 40 seconds, zero errors and
zero warnings. One S3 bucket took 20m53s of that and effectively sets the
runtime on its own. The node group took 8m10s and CloudFront 3m14s, against an
estimate of "over ten minutes" that the runbook had carried until it was
measured.

Terraform shows no progress while it works through a bucket with hundreds of
thousands of objects. Repeated `Still destroying...` is not a hang. **Do not
interrupt it**, because that desynchronises state from reality.

### The residual scan

Run this even when the destroy ends cleanly. Hunt for anything still billing:
orphaned ENIs (`status=available`), EC2 nodes, NAT gateways, unassociated
Elastic IPs, detached EBS volumes, and load balancers of both kinds.

Filter on the **absence** of `ManagedBy=terraform`. One catch: the Karpenter
`EC2NodeClass` stamps that tag onto its own nodes, so Karpenter nodes pass the
filter and stay invisible. Count them separately by `karpenter.sh/nodepool`.

**Check the bill the next day.** That is the only verdict that counts.

---

## 5. Rebuilding from zero

Names are stable; internal identifiers are not. Terraform rewires most of it
inside the apply. **Five values are hardcoded in the manifests and have to be
edited by a person**. Infrastructure produces them, and the deployment track
applies them.

| Value | Where it lands | If you skip it |
|---|---|---|
| ACM certificate ARN | the three `ingress.yaml` files | points at a certificate that no longer exists → no HTTPS listener |
| VPC ID | `aws-load-balancer-controller/values.yaml` | the controller points at a VPC that does not exist → no ALB at all |
| RDS master secret ARN | `externalsecret-rds-credentials.yaml` | ESO queries a missing secret, a placeholder Secret is created with `DB_USER` and `DB_PASSWORD` empty, and call-api, predict and worker all fail with `CreateContainerConfigError` |
| Model bucket name | four `deployment.yaml` files + the manual IAM policy | `NoSuchBucket`, or the model upload is refused with `AccessDenied`, which the app displays as "file not found" |
| ALB inbound security-group ID | the `security-groups` annotation on three ingresses | the old group was destroyed with everything else, so the Ingress fails to reconcile |

Values that change but need no intervention: the EKS endpoint, the OIDC
provider ARN, cluster and node security-group IDs, the RDS endpoint, the
CloudFront domain, subnet IDs. None are hardcoded anywhere.

Values that do not change at all, because they are fixed by name: the cluster
name, all ten IRSA role ARNs, the SQS queue URL, the Karpenter interruption
queue name (`hailcast-dev`, deliberately **different** from the cluster name
`hailcast-dev-eks`, and the deployment track has to name it explicitly in
`settings.interruptionQueue`), the ECR addresses, the ingress host, the service
URL, the DynamoDB table, and the CUR definition name.

### Order

1. **infra**: reset `alb_dns_name` to `""`, then first apply, **locally and by
   a person** (if CI applies first, no human can use `kubectl`)
2. **infra**: hand the four outputs to the deployment track, reissue kubeconfig
3. **deployment**: `make bootstrap-all` installs ArgoCD, installs the ESO
   CRDs, and force-syncs the RDS secret in one command. Three steps that were
   done by hand during the 2026-08-18 rebuild, since absorbed into a script that
   prints its own recovery instructions on failure
4. **deployment**: apply the five values above, PR, merge, confirm every
   Application is Synced and Healthy
5. **app**: rebuild all six images with `workflow_dispatch`. A plain `dev` push
   builds only the changed services, and the rest stay on `ImagePullBackOff`
6. **infra**: update the bucket suffix in the manual IAM policy, **before** the
   app team uploads the model
7. **app**: re-upload `model.pkl` and `metadata.json`
8. **deployment** raises the Ingress → **infra** puts the new ALB address into
   `alb_dns_name` and applies a second time, creating CloudFront
9. **infra**: migrate the CUR bucket and recreate the definition. This can wait,
   because it collides with nothing above
10. **Done when**: nodes Ready · pods Running · every Application Healthy ·
    `plan` reports no changes · the service URL returns 200 · **all six ECR
    repositories contain an image**

That last check exists because of step 5. In the 2026-08-18 rebuild, `frontend`
was left with an empty repository and `ImagePullBackOff`.

### Two manual recoveries seen in practice

**`SecretSynced: True` but a key is empty.** The sync reports success and the
Secret exists, so nothing looks wrong until three pods fail to start. Check the
keys themselves rather than the sync status. All three of `DB_HOST`,
`DB_PASSWORD` and `DB_USER` have to be present.

**The ESO CRDs were applied at the wrong version first.** Reapplying over them
does not converge; the bundle has to match the `targetRevision` pinned in the
ArgoCD Application. Re-read that value before applying, rather than assuming it.

---

## 6. Cost guardrails

**Three things bill whether or not anyone is using them**: the EKS control
plane, the NAT gateway, and RDS. Destroy is the largest saving available; the
night shutdown is the second.

- **Budgets.** A monthly budget with alerts at 80% and 100%. The apply role is
  explicitly **denied** `budgets` permissions, so a scripted mistake cannot
  alter the budget that is supposed to catch it. Created by hand in the console.
- **Cost allocation tags.** `Project`, `Environment` and `ManagedBy`. Activated
  2026-07-25; usage before that date is unattributed and no backfill happens.
- **Runtime-created resources do not inherit `default_tags`.** Karpenter nodes
  and ALBs are created by Kubernetes, not Terraform, so the deployment track has
  to stamp the same three tags via `EC2NodeClass.tags` and the
  `alb.ingress.kubernetes.io/tags` annotation. Anything missed is a hole in the
  cost report, not an error anyone will see.

---

## 7. Known limits

Recorded rather than tidied away.

- **The runtime half of `check-contract` is skipped entirely in CI.** It expects
  an AWS profile; GitHub Actions OIDC supplies credentials as environment
  variables. The account comparison fails, only the static checks run, and the
  job **ends green**. Fix this before relying on it in CI.
- **The verifier checks names, not parameter values.**
- **The HCL parser mis-reads `#` or braces inside a string literal.** No current
  code hits this.
- **OpenCost prices from the list price.** The CUR integration is prepared but
  unfinished, so no figure it produces is a real billed amount.
- **The naming convention pointed at code by line number**, so any edit that
  shifted lines meant re-checking every citation by hand. Anchors, not line
  numbers.
- **A `SecurityGroup` inbound rule documented as "self only"** diverged from
  reality once the ALB controller began adding rules at runtime. Found while
  preparing the presentation.
