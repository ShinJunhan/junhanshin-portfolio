# Runbook: Terraform and the staging cluster

Operating rules for the infrastructure in `Jangingmall/infra`. Each rule came
from a real incident during the project, and the incident is named under it.
The cluster runbook for daily checks and incident response is the team's
Phase 4 runbook.

## 1. Before every `plan`

```bash
aws sts get-caller-identity               # the right SSO profile?
git status | head -1                      # the right branch?
grep -E '^(eks_cluster_version|eks_authentication_mode|ecr_enabled)' terraform.tfvars
```

`terraform.tfvars` is ignored by Git, and a pull request never updates it.
Compare it with `terraform.tfvars.example` after every merge that changes a
default.

> **Incident, September 17.** A local file from September 15 still held EKS
> `1.33` and `API_AND_CONFIG_MAP`. An apply from it would create the cluster
> at a version that cannot be lowered.

## 2. Reading a plan

- **Stop at any unexpected destroy.** A migration PR attaches its `0 to add, 0 to change, 0 to destroy` output.
- **Stop when `public_access_cidrs` changes.** The local IP list differs from the live one, and an apply would cut a teammate's kubectl access. Compare the count of entries and never the addresses.
- **Share only the summary line.** The full plan output carries teammates' IPs.

```bash
terraform plan -no-color -lock=false | grep -E '^Plan:'
terraform plan -no-color -lock=false | grep -E '^\s+# '
```

> **Incident, September 27.** A prod plan showed five ECR repositories and 82
> images to destroy. The first explanation, a recent rename, was wrong. The
> real cause was a commented `ecr_enabled` line in the example file: the
> default `false` gave the module's `for_each` an empty set. PR #84 fixed it
> before any apply.

## 3. Changing node counts

- **Node counts change through the CLI. Code changes apply with `-target`.**
  The node group module ignores no size changes, and a full apply resets all
  six groups to the values in code.
- **The GPU default is `desired_size = 1`.** A full apply starts both GPUs at
  about $70 a day.
- **The database group moves all at once.** Three CNPG pods require three
  separate nodes. Scale it to zero or to three and never to one or two.

```bash
aws eks update-nodegroup-config --cluster-name jangin-staging-eks-cluster \
  --nodegroup-name jangin-staging-ng-gpu-a \
  --scaling-config minSize=0,desiredSize=0,maxSize=1
```

> **Incident, October 1 at 09:19.** An apply to start the cluster also started
> both GPUs.

## 4. Node user-data

Keep the shell part of `templates/node_user_data.mime` pure ASCII. A Korean
comment or a middle dot breaks cloud-init's decoding, and the hardening script
never runs. Nothing reports the failure.

```bash
python3 scripts/check_node_user_data.py
```

> **Incident, September 28.** The first SSH hardening (PR #80) carried a Korean
> comment and applied on zero nodes. Changing the charset (PR #94) did not
> help. The ASCII-only version (PR #110) passed on all 10 nodes on September 30.

## 5. Security group changes

The effect of a security group change is the union of every group on the node.
Every node also carries the EKS cluster security group. Terraform does not
manage that group, and it allows all egress.

```bash
SG=$(aws eks describe-cluster --name jangin-staging-eks-cluster \
  --query cluster.resourcesVpcConfig.clusterSecurityGroupId --output text)
aws ec2 describe-security-groups --group-ids $SG \
  --query 'SecurityGroups[0].IpPermissionsEgress'
```

> **Incident, September 27.** Removing the allow-all egress rules from our
> groups (PR #83) narrowed the rules on paper. The cluster group still allowed
> all egress. The security response reported the change as reduced, with the
> remainder as a recorded exception.

## 6. Permission errors

Confirm a permission error by query before reporting it.

```bash
aws sts get-caller-identity
aws sso login --profile jangin
aws iam simulate-principal-policy \
  --policy-source-arn <the SSO role ARN, never the assumed-role ARN> \
  --action-names eks:CreateCluster iam:PassRole
```

> **Incident, September 21.** One `AccessDenied` was reported as missing IAM
> permissions. The cause was an expired SSO session, and the simulator showed
> every action allowed.

## 7. Console changes

A fix made in the console is coded in a pull request the same day. The next
apply reverts a console change, or the plan before a destroy shows it as an
unexpected change.

> **Example, October 1.** The CloudFront path for `ai-generated/*` went in
> through the console first, and PR #145 put it in code the same day.

## 8. Teardown

A single `terraform destroy` stops partway in this environment. Clear these first:

| Blocker | Action |
| --- | --- |
| `prevent_destroy` on the NAT EIP | Merge the PR that removes it (PR #150) |
| EBS volumes created by the CSI driver | Delete them by hand. They sit outside the Terraform state |
| Versioned backup bucket | Delete old versions before the bucket |
| GuardDuty and Security Hub in the prod state | Turn them off before the free period ends on October 28 |
| Detection rules in two regions | Expect the "EKS deleted" alert and announce it |

Run `terraform destroy` only in `environments/staging`. The prod state owns
ECR, the CI roles, CodeBuild, and the account-wide security settings.
