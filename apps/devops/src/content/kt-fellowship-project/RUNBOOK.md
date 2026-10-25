<!--
Version A: a condensed English translation of the team's Phase 4 runbook
("운영 매뉴얼·런북 및 위기 대응 가이드", Notion, written by Dajeong Park on
2026-10-01, 884 lines). Commands are kept as written. Sections were shortened,
and the prod-only notes were folded into the teardown checklist. The account ID
and IP addresses were never in the original. An alternative written from
CLAUDE.md sits in drafts/RUNBOOK.mine.md and is not rendered.
-->

# Runbook: Midam staging on EKS

Target: `jangin-staging-eks-cluster` (EKS 1.35) in `ap-northeast-2`. Written on
October 1, 2026 from live AWS and kubectl queries and from the code in Git.
Values that change over time are marked ⏱.

- **Routine work:** Part 1 covers access, checks, deploys, backups, and node changes.
- **During an incident:** run the §2 checks first, set a grade in §6, and go to the matching scenario in §8.
- **At the end of the project:** use the teardown checklist in Appendix D.

⏱ State on October 1 at 11:4x: 10 nodes Ready, 110 pods Running, CNPG 3/3
healthy, the 11:20 backup completed, and zero GuardDuty findings. Every node
stopped on September 30 at 23:48 and started again on October 1 at 09:19.

Parts 1 and 2 describe staging. Production holds no EKS cluster, and its shared
resources and account-wide settings are real. The teardown checklist lists what
must never be destroyed there.

---

# Part 1: Operations

## 1. Access

```bash
export AWS_PROFILE=Infra-Admin AWS_REGION=ap-northeast-2 AWS_PAGER=""
export KUBECONFIG=/tmp/jangin.kube

aws sso login --profile Infra-Admin
aws eks update-kubeconfig --name jangin-staging-eks-cluster --kubeconfig $KUBECONFIG
```

- An SSO token lasts eight hours. `Token has expired and refresh failed` is an expired login and not an outage.
- The public endpoint accepts only each member's `/32`. A new network address times out kubectl until the infrastructure lead adds it to `eks_public_access_cidrs`. With zero nodes, SSM finds no node to connect to, and staging keeps the public endpoint for that reason.

Developers sign in with their own permission set and check their access first:

```bash
aws sso login --profile Backend-Dev
kubectl auth can-i --list -n app
```

Access comes from four SSO permission sets (Infra-Admin, Backend-Dev,
Security-Audit, and AI-Dev) and the node role. The account holds one emergency
IAM admin user and zero access keys.

## 2. Step zero before any investigation

Run these two checks first. Skipping them turns a planned stop into a false incident.

### 2-1. Is the cluster running?

```bash
CL=jangin-staging-eks-cluster
for NG in system-md system-lg app db gpu-a gpu-b; do
  printf '%-10s ' $NG
  aws eks describe-nodegroup --cluster-name $CL --nodegroup-name jangin-staging-ng-$NG \
    --query 'nodegroup.scalingConfig.[desiredSize,minSize,maxSize]' --output text
done
```

All zeros mean a planned stop. Go to scenario D in §8.

### 2-2. Are alerts alive?

```bash
kubectl get pods -n monitoring | grep -E 'prometheus-metrics-prometheus-0|alertmanager'
kubectl exec -n monitoring alertmanager-metrics-alertmanager-0 -c alertmanager -- \
  ls -l /mnt/alertmanager-secrets/
```

The webhook file exists and the pods show 2/2 when alerting is healthy.

> The alert stack is a single point of failure. Prometheus and Alertmanager run
> one replica each, and the Watchdog heartbeat goes to a null receiver. If that
> node stops, every alert stops with it, and nothing reports the silence. A quiet
> channel is never proof that the cluster is healthy.

## 3. Routine checks

### 3-1. The three-minute daily check

Discord receives the alerts, and several risks in §4-2 still lack a rule.
Run this once or twice a day.

```bash
# ① Restarts rising (early sign of OOMKilled)
kubectl get pods -A --sort-by=.status.containerStatuses[0].restartCount \
  -o custom-columns='NS:.metadata.namespace,POD:.metadata.name,R:.status.containerStatuses[0].restartCount' | tail -10

# ② Node headroom, visible before pods go Pending
kubectl top nodes
kubectl describe nodes | grep -A6 'Allocated resources'

# ③ Database and backups (the backup alerts cannot catch this, see §5-3)
kubectl get cluster -n database
kubectl -n database get backups.postgresql.cnpg.io --sort-by=.metadata.creationTimestamp | tail -3

# ④ GitOps drift
kubectl get applications.argoproj.io -n argocd | grep -v 'Synced.*Healthy'
```

`kubectl get cluster` alone is not enough. On October 1 at 00:0x it reported
`Cluster in healthy state` with zero pods running. Always confirm with
`kubectl get pods -n database`.

### 3-2. The weekly check

The daily check asks whether the service works now. The weekly check asks
whether it can recover from an incident and whether money is leaking.

```bash
# ① Backups really land in S3 (check the objects even when the CR says completed)
aws s3 ls s3://jangin-staging-s3-backup/cnpg/staging/ --recursive | tail -5

# ② Cost trend (⏱ 9/28 $42.55 → 9/29 $46.60 → 9/30 $49.37)
aws ce get-cost-and-usage --time-period Start=$(date -d '7 days ago' +%F),End=$(date +%F) \
  --granularity DAILY --metrics UnblendedCost \
  --query 'ResultsByTime[].[TimePeriod.Start,Total.UnblendedCost.Amount]' --output text

# ③ GPUs left running (most of the bill)
aws eks describe-nodegroup --cluster-name $CL --nodegroup-name jangin-staging-ng-gpu-a \
  --query 'nodegroup.scalingConfig.desiredSize' --output text
```

Cost Explorer settles about two days late. ⏱ September 30 first showed $43 and
later $49.37. Every reported figure carries the date it was read.

## 4. Thresholds and alert coverage

A Discord alert needs all three labels: `environment="stage"` (added by
Prometheus), `notify="discord"` (on the rule), and a `severity` of warning or
critical. About 134 chart rules carry no `notify` label and go to the null
receiver. The team copied only the rules it needed: 21 rules for 15 alerts.

| Target | Alert | Warning / critical |
| --- | --- | --- |
| Node CPU requests | 🔴 no rule | 80% / 90% |
| Node memory requests | 🔴 no rule | 80% / 85% |
| Pods per node (limit 17) | 🟢 `NodePodCapacityHigh` at 90% | 15 / 17 |
| Pod restarts | 🟢 `BackendPodRestartHigh` | 3 / 5 per hour |
| CNPG ready instances | 🟢 `CNPGPrimaryUnavailable` | 2/3 / 1/3 or fewer |
| CNPG connections (limit 200) | 🟢 `CNPGConnectionsHigh` | 140 / 180 |
| Backup age | 🟡 rule exists and never fires (§5-3) | 26 h / 48 h |
| WAL archive | 🟢 `CNPGWALArchiveUnhealthy` | failure / 15 min stalled |
| ALB 5XX | 🔴 ALB metrics not collected | 1% / 5% per 5 min |
| Node root disk | 🔴 chart rule goes to null | 80% / 90% |

On September 30, the team learned of a login lockout and 4,232 ALB 5XX
responses only afterward. Both sit in the 🔴 rows above.

A passing unit test does not prove that an alert arrives. All 15 alerts pass
their promtool tests (23 cases), and `GPUDeviceError` still never fires because
`DCGM_FI_DEV_XID_ERRORS` reports no series. Check that a metric exists before
writing a rule on it.

## 5. Main operating tasks

### 5-1. Deploy and roll back

```bash
# ① Put the image digest in k8s/overlays/stage/kustomization.yaml and merge
# ② Confirm the sync
kubectl get applications.argoproj.io -n argocd | grep -E 'workloads|backend'
# ③ Check the preview
kubectl argo rollouts get rollout backend -n app
# ④ Call the preview directly and expect 200 (never skip this)
kubectl port-forward -n app svc/backend-preview 18080:8080 &
curl -s -o /dev/null -w '%{http_code}\n' localhost:18080/actuator/health
# ⑤ Promote
kubectl argo rollouts promote backend -n app
# ⑥ Confirm the ALB targets move to the new pod IPs
kubectl get endpoints backend-active -n app
```

```bash
kubectl argo rollouts undo backend -n app                  # roll back now
kubectl argo rollouts abort backend -n app                 # stop a rollout in progress
kubectl argo rollouts retry rollout backend -n app         # resume after an abort
```

- `autoPromotionEnabled` is false. A new image runs only on `backend-preview` until a person promotes it. `BlueGreenPause` is the design working.
- `scaleDownDelaySeconds` is 60. The old ReplicaSet stays for one minute, and an `undo` after that starts new pods.
- A merge in Git does not deploy by itself. Fifteen of the 19 Argo CD applications sync by hand, and no app-of-apps watches `argocd/applications`.

### 5-2. Backups

```
ScheduledBackup  cnpg-daily    UTC 02:20 = KST 11:20
Method           barman-cloud plugin → s3://jangin-staging-s3-backup/cnpg/staging
```

The `0 0 18 * * *` in `values.yaml` is the chart default. `stage.yaml` sets the
real schedule. Reading the wrong file shifts the backup age by eight hours.

The restore report (Changwon Lee) records an isolated S3/WAL restore in 3 min 5 s
after a retry (8 min 4 s on the first run) and an EBS snapshot restore in 1 min 47 s.

### 5-3. The backup alerts do not work yet

The backups themselves are healthy. ⏱ The October 1 backup completed in six
seconds. Every backup timestamp metric reads zero, though. The plugin method
reports success only on the Backup CR. That CR is the one source of truth.

| Rule | Behavior |
| --- | --- |
| `CNPGBackupOverdue` | 🔴 never fires |
| `CNPGBackupFailed` | 🔴 never fires |
| `CNPGBackupTimestampUnavailable` | 🔴 always fires |
| `CNPGWALArchiveUnhealthy` | 🟢 works |

Check backup age in the daily check (§3-1 ③) until the team settles on a metric.

### 5-4. Scaling node groups

```bash
# Scale up (max must rise with desired)
aws eks update-nodegroup-config --cluster-name $CL \
  --nodegroup-name jangin-staging-ng-app \
  --scaling-config minSize=2,desiredSize=3,maxSize=3

# Stop a GPU (about $70 a day → 0)
aws eks update-nodegroup-config --cluster-name $CL \
  --nodegroup-name jangin-staging-ng-gpu-a \
  --scaling-config minSize=0,desiredSize=0,maxSize=1
```

- People add nodes. No Cluster Autoscaler runs, and a Pending pod waits forever.
- `terraform apply` reverts any CLI change. The node group module ignores no size changes.
- The GPU default in code is `desired_size = 1`. An apply starts both GPUs (about $70 a day), as it did on October 1 at 09:19.

### 5-5. Full stop and full start

Start in this order. A different order leaves PVCs unattached.

```
① system-md + system-lg   CoreDNS · EBS CSI controller · Argo CD · monitoring
② db                      CNPG, three nodes
③ app                     backend · redis
④ gpu-a + gpu-b           gpu-b also carries the chatbot and the vector DB
```

Stop in reverse: GPU, app, database, system. Stopping the GPUs first saves the
most. Expect CNPG at 3/3 in about 10 minutes and the backend at 2/2 in about 17.
Announce a full stop to the team first. The detection rules ignore
`UpdateNodegroupConfig` on purpose, and on September 30 an unannounced stop sent
the next person into a false investigation.

### 5-6. Registering and rotating secrets

```bash
aws ssm put-parameter --name "/staging/backend/<key>" --value "<value>" \
  --type SecureString --key-id alias/jangin-staging-app --overwrite
# Restart to pick up the new value (CSI reads it at mount time)
kubectl argo rollouts restart backend -n app
```

Keep `--key-id`. Without it, the value lands under `alias/aws/ssm` with no error
and outside the app key's policy. Ten staging parameters went in that way.

---

# Part 2: Incident response

## 6. Grades

| Grade | Definition | Response | Triggers (any one) |
| --- | --- | --- | --- |
| 🔴 Critical | Whole service down, or data or credentials at risk | Notify everyone now, update every 15 minutes | Cluster DNS down · CNPG ready instances ≤ 1 · credential leak · root sign-in · an unannounced full stop |
| 🟡 Warning | A feature down, or a recovery path broken | Notify within 30 minutes, update hourly | AI pipeline stopped · backup older than 48 h · alert stack down · a rollout left Degraded |
| 🟢 Notice | Slower service or shrinking headroom | Log in the channel the same day | 90% pod capacity · 180/200 connections · 80% disk · drift left alone · cost spike |

A broken backup or a dead alert stack harms nothing today and decides the
damage of the next incident. Both sit at Warning for that reason. When the
grade is unclear, start one level higher and lower it after checking.

## 7. Roles

| Role | Work | Owner |
| --- | --- | --- |
| Command | Sets the grade, approves actions, coordinates tracks, reports to the mentor | Infrastructure lead |
| Cluster work | Diagnoses and acts. Yunju Kang runs `terraform apply`, and Changwon Lee owns the database and restores | The infrastructure track |
| Updates | The finder posts first, and the commander posts every update after | Finder, then commander |
| Track response | Checks impact on its own area, stops retries, shares logs | BE, FE, and AI owners |

One voice in the channel keeps BE and FE from following different
instructions and retrying into a larger load.

## 8. Scenarios

Every scenario starts with §2 and narrows down with the daily check.

### A. Traffic spike, crashing pods, or an HPA that does not grow (🟢 to 🟡)

The HPA (`backend`, min 2, max 4, CPU 70%) rarely breaks. Node capacity does.
The app node group runs two `t3.medium` nodes and no autoscaler, and new pods
wait in Pending. Read the Pending reason:

| Message | Meaning and action |
| --- | --- |
| `Insufficient cpu / memory` | No room. Add a node. |
| `Too many pods` | The 17-pod limit. Add a node. |
| `didn't match node affinity` | The node group may be at zero (scenario E). |
| `untolerated taint` | The pod is aimed at a db or GPU node. Check tolerations. |

Add an app node first. It costs about $1 a day and is Ready in four to six minutes.

### B. Slow or failing database (🟡 to 🔴)

The database is CNPG inside the cluster, and the RDS console does not apply.
Read replicas are the CNPG replicas behind the `-ro` service. End only the
problem sessions, and never run `pg_terminate_backend` against everything.
Switch the primary with a switchover first. A forced node stop is a failover,
and the last commits can be lost. The primary's PodDisruptionBudget allows zero
disruptions by design: switch over, then drain.

### C. DNS or routing failure (🔴)

| Suspect | Symptom |
| --- | --- |
| Cluster DNS | `UnknownHostException` in pod logs |
| ALB to targets | 502 or 503 outside while pods are healthy |
| Route 53 or ACM | DNS failure from outside |
| NetworkPolicy | Only some pods fail |
| A new network address or a stopped cluster | kubectl itself times out |

The ALB attaches to pod IPs through a TargetGroupBinding. `kubectl get ingress`
shows nothing. CoreDNS is a Terraform-managed add-on, and the next apply
reverts a `kubectl edit`. A DNS failure affects every track: announce it before
the cause is known.

### D. Waking up to a full stop (🔴 when nobody knows)

This happened on September 30 at 23:48 and was recovered on October 1 at 09:19.
kubectl times out, or every pod is Pending, and the CNPG Cluster CR still reads
healthy. Confirm with §2-1, then find who scaled the groups down:

```bash
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=UpdateNodegroupConfig \
  --start-time "$(date -u -d '12 hours ago' +%FT%TZ)" --max-results 20 \
  --query 'Events[].[EventTime,Username]' --output table
```

Every PV uses `Retain`, and a restart reads the same volumes with no restore.
The September 30 stop lost no data, and the last WAL reached S3 fourteen seconds
before the database pod stopped. All six node groups and all PVs sit in
`ap-northeast-2a`, and rebinding failed zero times. That also means no zone
redundancy. Start in the §5-5 order and check the GPU `desired_size` first.

### E. One GPU group stopped and the AI pipeline froze (🟡)

| Role | Pod | Node group |
| --- | --- | --- |
| Product page generation | `ai-sglang` | gpu-a (g6e.xlarge) |
| Chatbot | `ai-ollama` | gpu-b (g4dn.xlarge) |
| Embeddings (pgvector) | `ai-vector-db` | gpu-b (g4dn.xlarge) |

Stopping gpu-b stops the chatbot and the vector DB together. On September 30 at
18:30, gpu-b was scaled down by hand, and the detection took 5 hours 23 minutes.

### F. Security incident (🔴)

The most realistic incident for this team is a credential shared in plain text.
During the September 30 DAST run, a test password and a JWT appeared in chat.

| Risk | Exposed | Action |
| --- | --- | --- |
| 🟡 | Test account password or JWT | Change the password and wait out the JWT |
| 🔴 | An SSM secret (DB or API key) | Rotate now (§5-6) |
| 🟡 | Discord webhook URL | Recreate the webhook and update SSM |

Rotate, restart the pods, and confirm the service works. An exposed value stays
valid until it is rotated. Both WAFs run their managed rules in Count mode: the
September 30 DAST run matched 2,633 requests and blocked none. Switching to
Block needs the lead's approval.

## 9. Postmortems

Critical and Warning incidents get a postmortem within 24 hours. A postmortem
asks why the mistake was possible and why the team learned of it late. The
detection gap is the core of the form: on September 30 the fix took minutes,
and the detection took 5 hours 23 minutes.

---

## Appendix C. Recent verification results

| Item | Result | Date |
| --- | --- | --- |
| Node SSH hardening | 10/10 PASS over SSM | 9/30 |
| Isolated restore | S3/WAL 3 min 5 s, EBS snapshot 1 min 47 s, 37 tables matched | 9/30 · 10/1 |
| DAST | 2,633 WAF matches, 0 blocked (Count mode) | 9/30 |
| Discord delivery | 3 sent, 0 failed | 9/30 |
| Alert rule tests | 15 alerts, 23 cases passed | 9/30 |
| Full stop and start | Zero data lost | 9/30 → 10/1 |
| Detection pattern tests | 11 passed, 0 failed | 10/1 |
| GuardDuty findings | 0 | 10/1 |

## Appendix D. Teardown checklist (October 6)

- [ ] Scale all six node groups to zero, GPUs first.
- [ ] Delete the EBS volumes. They use `Retain`, and deleting a PVC leaves them behind.
- [ ] Release the NAT EIP. It carries `prevent_destroy` for the courier allowlist, and a PR removes the guard before the destroy.
- [ ] Remove the ALB, CloudFront, and ACM resources.
- [ ] Confirm that the two SNS topics and six EventBridge rules go with the staging destroy. An "EKS deleted" detection email is expected.
- [ ] Turn off GuardDuty and Security Hub before the free period ends on October 28. The prod state manages both, and the console is the wrong tool.
- [ ] Delete the CloudWatch log groups.
- [ ] Empty the S3 buckets, including old versions in the versioned backup bucket.
- [ ] Confirm that the test credentials shared during DAST were rotated.
- [ ] Run `terraform destroy` only in the staging directory. The prod state owns ECR, the CI roles, CodeBuild, the shared buckets, and the account-wide security settings.
