#!/bin/bash
# =============================================================
# Location : project3-hailcast-manifests/scripts/replace_rebuild_values.sh
# Owner    : Group C (Yongbin)
# Role     : after a destroy→apply rebuild, swap the 6 values that changed
#            through the manifests in one pass. The automated form of
#            재구축_체크리스트.md §8-1 ("the lines the deploy team has to fix").
# Why      : in the 8/18 rebuild we edited 5 of them by hand, and one python
#            substitution did it in under a minute.
#            The 8/25 recording session is one where the time spent swapping
#            values *is* the recording, so improvised handling on the day is
#            what this removes (condition D-4 (a)).
# Use      : fill in the 6 "new values" below and run it. It does not commit —
#            a person checks the diff first.
#            ./scripts/replace_rebuild_values.sh
# Safety   : value format → target count → substitution → leftover check.
#            One thing out of line and it stops immediately.
# =============================================================
set -euo pipefail

# ─────────────────────────────────────────────
# Fill in here only (from the apply output / an AWS CLI lookup)
# ─────────────────────────────────────────────
NEW_CERT_UUID=""      # ACM certificate UUID   e.g. ac119b3a-0135-4ce2-b6d3-024f9d2acda2
NEW_SG_ID=""          # the CloudFront-only SG for the ALB   e.g. sg-02050c3eb49f83935
NEW_MODEL_SUFFIX=""   # model artifact bucket suffix   e.g. 58b4f8fd
NEW_VPC_ID=""         # VPC ID   e.g. vpc-03fe7938497b3ed0c
NEW_RDS_SECRET=""     # RDS master secret suffix   e.g. 1530d81c-e164-48df-83d2-06f4d952552e-sVe4XH
NEW_CUR_SUFFIX=""     # CUR bucket suffix   e.g. 15c95bad   (for the opencost Athena integration)

# ─────────────────────────────────────────────
# Lookup commands (for when you do not know a value)
# ─────────────────────────────────────────────
#   certificate  aws acm list-certificates --region ap-northeast-2 \
#                  --query "CertificateSummaryList[?DomainName=='hailcast.myminiinfra.store'].CertificateArn" --output text
#   SG           aws ec2 describe-security-groups --region ap-northeast-2 \
#                  --filters Name=group-name,Values=hailcast-dev-sg-alb-cloudfront --query 'SecurityGroups[0].GroupId' --output text
#   VPC          aws ec2 describe-vpcs --region ap-northeast-2 \
#                  --filters Name=tag:Name,Values=hailcast-dev-vpc --query 'Vpcs[0].VpcId' --output text
#   RDS          aws rds describe-db-instances --region ap-northeast-2 \
#                  --db-instance-identifier hailcast-dev-rds-postgres \
#                  --query 'DBInstances[0].MasterUserSecret.SecretArn' --output text
#   buckets      aws s3 ls | grep hailcast-dev-model-artifacts
#                aws s3 ls | grep hailcast-dev-cur

info() { printf '[replace] %s\n' "$*"; }
err()  { printf '[replace][ERROR] %s\n' "$*" >&2; }

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# ── 1. Empty-value check ──
MISSING=0
for V in NEW_CERT_UUID NEW_SG_ID NEW_MODEL_SUFFIX NEW_VPC_ID NEW_RDS_SECRET NEW_CUR_SUFFIX; do
  if [[ -z "${!V}" ]]; then err "$V is empty"; MISSING=1; fi
done
[[ $MISSING -eq 0 ]] || { err "Fill the values above in and run it again."; exit 1; }

# ── 2. Format check (this is where a typo gets caught) ──
[[ "$NEW_CERT_UUID"    =~ ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ ]] \
  || { err "NEW_CERT_UUID is not in UUID form: $NEW_CERT_UUID"; exit 1; }
[[ "$NEW_SG_ID"        =~ ^sg-[0-9a-f]{17}$ ]] \
  || { err "NEW_SG_ID malformed (sg- + 17 chars): $NEW_SG_ID"; exit 1; }
[[ "$NEW_VPC_ID"       =~ ^vpc-[0-9a-f]{17}$ ]] \
  || { err "NEW_VPC_ID malformed (vpc- + 17 chars): $NEW_VPC_ID"; exit 1; }
[[ "$NEW_MODEL_SUFFIX" =~ ^[0-9a-f]{8}$ ]] \
  || { err "NEW_MODEL_SUFFIX malformed (8 hex chars): $NEW_MODEL_SUFFIX"; exit 1; }
[[ "$NEW_CUR_SUFFIX"   =~ ^[0-9a-f]{8}$ ]] \
  || { err "NEW_CUR_SUFFIX malformed (8 hex chars): $NEW_CUR_SUFFIX"; exit 1; }
[[ "$NEW_RDS_SECRET"   =~ ^[0-9a-f-]{36}-[A-Za-z0-9]{6}$ ]] \
  || { err "NEW_RDS_SECRET malformed (UUID + 6 chars): $NEW_RDS_SECRET"; exit 1; }

info "value formats verified"

# ── 3. Substitution (stops if the count is not what was expected) ──
python3 - "$NEW_CERT_UUID" "$NEW_SG_ID" "$NEW_MODEL_SUFFIX" "$NEW_VPC_ID" "$NEW_RDS_SECRET" "$NEW_CUR_SUFFIX" <<'PYEOF'
import io, re, sys

cert, sg, model, vpc, rds, cur = sys.argv[1:7]

# (file, old-value regex, new value, expected count)
JOBS = [
    ("apps/predict/ingress.yaml",   r"certificate/[0-9a-f-]{36}",        f"certificate/{cert}", 1),
    ("apps/call-api/ingress.yaml",  r"certificate/[0-9a-f-]{36}",        f"certificate/{cert}", 1),
    ("apps/frontend/ingress.yaml",  r"certificate/[0-9a-f-]{36}",        f"certificate/{cert}", 1),
    ("apps/predict/ingress.yaml",   r"sg-[0-9a-f]{17}",                  sg, 1),
    ("apps/call-api/ingress.yaml",  r"sg-[0-9a-f]{17}",                  sg, 1),
    ("apps/frontend/ingress.yaml",  r"sg-[0-9a-f]{17}",                  sg, 1),
    ("apps/predict/deployment.yaml",     r"model-artifacts-[0-9a-f]{8}", f"model-artifacts-{model}", 1),
    ("apps/call-api/deployment.yaml",    r"model-artifacts-[0-9a-f]{8}", f"model-artifacts-{model}", 1),
    ("apps/simulator/deployment.yaml",   r"model-artifacts-[0-9a-f]{8}", f"model-artifacts-{model}", 1),
    ("apps/weather-cron/deployment.yaml",r"model-artifacts-[0-9a-f]{8}", f"model-artifacts-{model}", 1),
    # The retraining CronJob (manifests #85, added 2026-08-21) uses the same
    # model bucket. It is the same class of miss as the build.yml glob that was
    # pinned to a fixed filename and skipped the new file (app #59), so Jiyoon
    # flagged it in review to make sure a new file does not get missed here either.
    ("apps/predict/retraining-cronjob.yaml", r"model-artifacts-[0-9a-f]{8}", f"model-artifacts-{model}", 1),
    ("addons/aws-load-balancer-controller/values.yaml", r"vpc-[0-9a-f]{17}", vpc, 1),
    ("platform/external-secrets/externalsecret-rds-credentials.yaml",
     r"rds!db-[0-9a-f-]{36}-[A-Za-z0-9]{6}", f"rds!db-{rds}", 2),
    # The opencost Athena integration (PR#82). Before it is merged this is 0, so skip it.
    ("addons/opencost/values.yaml", r"hailcast-dev-cur-[0-9a-f]{8}", f"hailcast-dev-cur-{cur}", None),
]

# ── Pass 1: verify everything, write nothing ──
# Doing "verify → write immediately" per target leaves the earlier files
# substituted when a later one fails. In the middle of the 8/25 recording that
# means a half-and-half state — some new values, some old — and the cause is
# hard to find (Jiyoon's point).
plan = []
errors = []
for path, pat, new, expect in JOBS:
    optional = (expect is None)
    try:
        s = io.open(path, encoding="utf-8").read()
    except FileNotFoundError:
        # Only a target that may legitimately be absent (PR#82 unmerged) is skipped.
        # A required target that is missing is a failure — it must not pass silently.
        if optional:
            print(f"  SKIP {path} (no such file · optional)")
        else:
            errors.append(f"{path}: file not found (required target)")
        continue
    n = len(re.findall(pat, s))
    if optional:
        if n == 0:
            print(f"  SKIP {path} (0 matches — PR#82 looks unmerged)")
            continue
    elif n != expect:
        errors.append(f"{path}: found {n} matches for {pat} (expected {expect})")
        continue
    plan.append((path, pat, new, n))

if errors:
    print("\n[ERROR] verification failed — no file was modified:")
    for e in errors:
        print("  -", e)
    sys.exit(1)

# ── Pass 2: everything passed, so now write ──
total = 0
for path, pat, new, n in plan:
    s = io.open(path, encoding="utf-8").read()
    io.open(path, "w", encoding="utf-8").write(re.sub(pat, new, s))
    print(f"  OK   {path}  ({n})")
    total += n
print(f"\n{total} substitutions in total")
PYEOF

# ── 4. Leftover check ──
info "checking for values left behind after the substitution"
LEFT=$(grep -rEn "certificate/[0-9a-f-]{36}|sg-[0-9a-f]{17}|model-artifacts-[0-9a-f]{8}|vpc-[0-9a-f]{17}|rds!db-[0-9a-f-]{36}|hailcast-dev-cur-[0-9a-f]{8}" \
         --include='*.yaml' . 2>/dev/null \
       | grep -v "$NEW_CERT_UUID" | grep -v "$NEW_SG_ID" | grep -v "$NEW_MODEL_SUFFIX" \
       | grep -v "$NEW_VPC_ID" | grep -v "$NEW_RDS_SECRET" | grep -v "$NEW_CUR_SUFFIX" || true)
if [[ -n "$LEFT" ]]; then
  err "old values are still present:"
  printf '%s\n' "$LEFT" >&2
  exit 1
fi
info "0 old values left"

# ── 5. YAML syntax — only the files we touched, not the whole repo.
# Sweeping the repo makes PyYAML raise a false positive on an unrelated existing
# file (the emoji characters inside kube-prometheus-stack/values.yaml), and the
# script then reports failure when the substitution actually succeeded. In the
# middle of the 8/25 recording that misjudgement is the most dangerous one.
TOUCHED_FILES=(
  "apps/predict/ingress.yaml"
  "apps/call-api/ingress.yaml"
  "apps/frontend/ingress.yaml"
  "apps/predict/deployment.yaml"
  "apps/call-api/deployment.yaml"
  "apps/simulator/deployment.yaml"
  "apps/weather-cron/deployment.yaml"
  "apps/predict/retraining-cronjob.yaml"
  "addons/aws-load-balancer-controller/values.yaml"
  "platform/external-secrets/externalsecret-rds-credentials.yaml"
  "addons/opencost/values.yaml"
)
python3 -c "
import yaml, sys
files = sys.argv[1:]
bad=[]
for f in files:
    try: list(yaml.safe_load_all(open(f)))
    except Exception as e: bad.append(f)
if bad: sys.exit('[ERROR] YAML parse failed: ' + ', '.join(bad))
print(f'[replace] YAML syntax passed ({len(files)} files, substitution targets only)')
" "${TOUCHED_FILES[@]}"

info "Done. Check with git diff, then commit."
info "  git diff --stat"
