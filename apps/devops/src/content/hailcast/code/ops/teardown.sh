#!/bin/bash
# =============================================================
# Location : ~/project3-hailcast/project3-hailcast-ops/scripts/teardown.sh
# ThisPod-ThatPod · hailcast — the 'conductor' for tearing everything down
# Role     : call each repository's teardown script in the *right order*.
#            The deletion logic itself is owned by each repository
#            (self-contained). All that is controlled here is order, safety,
#            and passing the gate values down.
# Order    : ① manifest (K8s, ALB) → ② infra (terraform destroy) → ③ app (local images, volumes)
#            ※ Delete the manifests first or a live ALB and its ENIs block the
#              VPC from being destroyed (hours of digging).
#            ※ app is a cleanup of *each person's local machine*, not the
#              cloud, so it goes last (failing there affects nothing in AWS).
#
#   ⚠️ [UNRESOLVED] app/scripts/teardown_infra.sh is not called by this
#      orchestrator. It appears to overlap with the manifest stage (ArgoCD) and
#      with what that stage deletes (the hailcast namespace), so it is
#      deliberately excluded until the team confirms. If we decide it is
#      needed: uncomment the "APP_INFRA stage (optional)" section below and
#      settle where in the order it goes.
#
# Run      : bash scripts/teardown.sh                  (confirm at each stage)
#            bash scripts/teardown.sh --yes             (skip confirmation — careful)
#            bash scripts/teardown.sh --only infra       (one stage only)
# Gates    : the team decisions in ch. 6 of teardown_체크리스트.md are passed
#            down to the child scripts as the environment variables below.
#            ARGOCD_DELETE_PATH=argocd|kubectl   (gate ② — read by the manifest stage, default kubectl)
#            CUR_HANDLING=keep|drop              (gate ① — read by the infra stage, default unset = hard stop)
#            e.g. ARGOCD_DELETE_PATH=argocd CUR_HANDLING=keep bash scripts/teardown.sh --yes
# Assumes  : you have read through teardown_체크리스트.md *first* (all five
#            gates settled — snapshots, Budgets and the rest).
# Safety   : CONFIRM=yes is injected into the infra stage so that it runs a
#            *real* destroy.
#            FORCE is not injected → if an ALB or a Karpenter node is still
#            alive, a person has to see the warning and make the call.
#            Before any of it, verify that this account is the project account
#            (this is what stops a full delete against the wrong one).
# =============================================================

set -u

# ── Shared constants and the account guard (PROJECT_ACCOUNT_ID · verify_project_account) ──
# shellcheck source=scripts/_lib.sh
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_lib.sh"

INFRA_DIR="${INFRA_DIR:-../project3-hailcast-infra}"
APP_DIR="${APP_DIR:-../project3-hailcast-app}"
MANIFESTS_DIR="${MANIFESTS_DIR:-../project3-hailcast-manifests}"

# ── Gate values (team decisions) — exported so the child scripts read them ──
export ARGOCD_DELETE_PATH="${ARGOCD_DELETE_PATH:-kubectl}"   # gate ② default
export CUR_HANDLING="${CUR_HANDLING:-}"                      # gate ① unset means the infra stage hard-stops

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()  { echo -e "${BLUE}[TEARDOWN]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC}       $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}     $1"; }
err()   { echo -e "${RED}[ERROR]${NC}    $1"; }

AUTO_YES=false
ONLY=""
while [ $# -gt 0 ]; do
    case "$1" in
        --yes|-y) AUTO_YES=true ;;
        # set -u means a missing argument blows up as 'unbound variable' → say what belongs there
        --only)   ONLY="${2:?--only needs one of manifest | infra | app after it}"; shift ;;
        *) err "Unknown option: $1"; exit 1 ;;
    esac
    shift
done

# Stage helper: (repository directory, path to its teardown script, human-readable name)
run_stage() {
    local dir="$1" script="$2" label="$3"
    [ -n "$ONLY" ] && [ "$ONLY" != "$label" ] && return 0

    echo ""
    info "───────── [$label] $dir/$script ─────────"
    if [ ! -d "$dir" ]; then
        warn "$dir not found → skipping this stage (not cloned, or check the path convention)"
        return 0
    fi
    if [ ! -f "$dir/$script" ]; then
        warn "$dir/$script not found → that repo has no teardown script yet. Skipping"
        return 0
    fi

    if [ "$AUTO_YES" = false ]; then
        read -rp "  [$label] Proceed? (y/N) " ans
        case "$ans" in y|Y) ;; *) warn "[$label] skipped"; return 0 ;; esac
    fi

    # CONFIRM=yes is injected into the infra stage only, so that it runs a *real* destroy.
    #   FORCE is not injected → if an ALB or a Karpenter node is still alive, the infra
    #   script stops and asks a person to decide.
    #   manifest and app follow their own scripts' defaults (no CONFIRM injected — each
    #   script keeps its own default, though ARGOCD_DELETE_PATH/CUR_HANDLING exported above
    #   have already reached all three stages).
    local rc=0
    if [ "$label" = "infra" ]; then
        CONFIRM=yes bash "$dir/$script" || rc=$?
    else
        bash "$dir/$script" || rc=$?
    fi

    if [ "$rc" -eq 0 ]; then
        ok "[$label] done"
    else
        err "[$label] failed → check the log and fix it by hand. (It does not continue to the next stage on its own.)"
        exit 1
    fi
}

echo ""
echo "============================================="
echo "  hailcast full teardown (conductor)"
echo "  order: manifest → infra → app"
echo "  gate ② (delete path)=${ARGOCD_DELETE_PATH}  gate ① (CUR)=${CUR_HANDLING:-<unset>}"
echo "============================================="

if [ -z "$CUR_HANDLING" ] && [ "$ONLY" != "manifest" ] && [ "$ONLY" != "app" ]; then
    warn "CUR_HANDLING is not set — if objects remain in the CUR bucket, the infra stage will stop right there."
    warn "  Once the team settles gate ①, run again with CUR_HANDLING=keep or CUR_HANDLING=drop."
fi

# ── ⭐ The account guard: check *which account* before deleting anything ──
# This is the most dangerous path in the repository. A destroy against the
# wrong account cannot be undone. So the account is blocked *before* the
# confirmation prompt, not after it.
# (--only app is a local Docker cleanup and never touches AWS → guard excluded)
if [ "$ONLY" != "app" ]; then
    rc=0; verify_project_account || rc=$?
    case "$rc" in
        0) info "Account confirmed : ${CURRENT_ACCOUNT} (the project account)" ;;
        1) err "This is not the project account → current ${CURRENT_ACCOUNT} / expected ${PROJECT_ACCOUNT_ID}"
           err "Stopping the teardown. That was about to delete another account's resources."
           exit 1 ;;
        2) err "No AWS credentials, or they have expired → bash scripts/setup.sh"
           err "Stopping the teardown."
           exit 1 ;;
    esac
fi

warn "Before starting: have you settled all five gates in ch. 6 of 'teardown_체크리스트.md' (CUR, delete path, RDS snapshot, who installed ArgoCD, real run vs rehearsal)?"
if [ "$AUTO_YES" = false ]; then
    read -rp "  Type y to continue: " go
    case "$go" in y|Y) ;; *) echo "Stopped."; exit 0 ;; esac
fi

# ① K8s workloads and the ALB (start with what blocks the VPC destroy)
run_stage "$MANIFESTS_DIR" "scripts/teardown_manifest.sh" "manifest"

# ② AWS resources (terraform destroy) — CONFIRM=yes is injected inside run_stage
run_stage "$INFRA_DIR"     "scripts/teardown_infra.sh"    "infra"

# ── APP_INFRA stage (optional, currently disabled) ────────────────
# Whether app/scripts/teardown_infra.sh belongs in the orchestration is unsettled.
# If we decide it does: in principle it goes *after* manifest completes and
# *before* infra starts — not immediately after manifest (deleting directly with
# kubectl while ArgoCD selfHeal is still alive would fight it), assuming its job
# is only to sweep up what ArgoCD already cleaned.
# run_stage "$APP_DIR" "scripts/teardown_infra.sh" "app-infra"

# ③ Local Docker images, volumes and caches (each person's own machine · last)
run_stage "$APP_DIR"       "scripts/teardown_app.sh"      "app"

echo ""
echo "============================================="
ok "Teardown conducted. Confirm what is left against the checklist."
echo "  (especially: ALB, ENI, EBS, Elastic IP, NAT, CloudWatch log groups)"
echo "============================================="
