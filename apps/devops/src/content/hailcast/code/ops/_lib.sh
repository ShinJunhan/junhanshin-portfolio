#!/bin/bash
# =============================================================
# Location : project3-hailcast-ops/scripts/_lib.sh
# ThisPod-ThatPod · hailcast — the constants and the guard that setup, check,
#                              teardown and guard all share
# Role     : the project account constant, plus the function that checks
#            "are the credentials I am holding right now that account?"
# Use      : source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"
#
# ⚠️ The account ID, the region and the cluster name are corrected here and
#    nowhere else. Scattered across three scripts, one gets fixed and the rest
#    go stale.
# =============================================================

# ── The project account ────────────────────────────────────
# ⚠️ Do not write the account ID in this file. This repository is PUBLIC.
#    Account ID + IAM user name is two of the three things a console login
#    needs, and the user name can be guessed from the commit log and from
#    CODEOWNERS → the only line of defence left is a single password.
#    Inject the value through .env (gitignored) or an environment variable.
#    See .env.example.
#
# ⚠️ Always handle it as a *string*. An account ID can have a leading zero, and
#    comparing it as a number drops that zero, leaves 11 digits, and makes the
#    check fail every single time.
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# ⚠️⚠️ Do not `source` .env. Parse PROJECT_ACCOUNT_ID out of it, that one line
#      and nothing else.
#
# Sourcing opens two holes. Both were demonstrated, not theorised:
#
#  ① The credentials the guard inspects and the credentials terraform actually
#     uses come apart. `make infra-destroy` is  guard-account  →
#     make -C ../infra destroy , and those are *two different shells*. One line
#     of `export AWS_PROFILE=x` in .env is enough:
#       guard     : checks the account with AWS_PROFILE=x  and gives it a ✅
#       terraform : AWS_PROFILE is UNSET → runs the destroy against [default]
#     → the guard clears account A and terraform destroys account B.
#       The guard creates, by itself, the exact accident it exists to prevent.
#
#  ② `source` is arbitrary code execution. Two lines of
#     `aws() { echo <expected account>; }` in .env and a fake function
#     intercepts the real aws and fools the guard completely (confirmed: it
#     passes).
#
# → Read the *value* only. Pull out one assignment line and strip the quotes.
#   Leave no room for anything to execute.
# → If the environment variable is already set, do not look at the file at all
#   (CI's GitHub Secret always wins).
if [ -z "${PROJECT_ACCOUNT_ID:-}" ] && [ -f "$REPO_ROOT/.env" ]; then
    PROJECT_ACCOUNT_ID="$(
        grep -E '^[[:space:]]*PROJECT_ACCOUNT_ID[[:space:]]*=' "$REPO_ROOT/.env" \
        | tail -n 1 | cut -d= -f2- | tr -d "\"' \t\r"
    )"
fi
PROJECT_ACCOUNT_ID="${PROJECT_ACCOUNT_ID:-}"

if [ -z "$PROJECT_ACCOUNT_ID" ]; then
    echo "❌ PROJECT_ACCOUNT_ID is not set." >&2
    echo "   Local :  cp .env.example .env   → fill in the account ID (the value is in the team channel)." >&2
    echo "   CI    :  inject the GitHub Secret as the environment variable PROJECT_ACCOUNT_ID (no .env file needed)." >&2
    # ⚠️ It must not pass quietly — running with no account check is the very
    #    accident this guard exists to prevent.
    #    But this file is 'source'd, so `exit` kills the caller's shell. Source
    #    it in an interactive shell and the whole terminal closes → if we are
    #    interactive, return instead.
    if [[ $- == *i* ]]; then return 1; else exit 1; fi
fi

# ── Where AWS credentials come from: not enforced ──────────
# Use the AWS default credential chain as it is (environment variables →
# AWS_PROFILE → [default]).
#
# The old design *forced* AWS_PROFILE=hailcast. That was to stop a shared key
# overwriting someone's personal [default], back when the project account and
# the owner's personal account were **different**. Since 2026-07-14 the project
# account *is* the owner's personal account, so that premise is gone — and
# leaving the enforcement in place now kills us in two places instead:
#   - the owner's server : uses [default] → there is no 'hailcast' profile, so
#     everything fails
#   - CI (GitHub Actions OIDC) : credentials arrive as environment variables →
#     no profile, so the runtime checks are skipped wholesale and *silently*
#     (green light, nothing checked)
#
# The real safety net is not the profile name but which account you are
# standing in right now.
#   → verify_project_account (below)

# ── Project constants ──────────────────────────────────────
AWS_REGION="${AWS_REGION:-ap-northeast-2}"          # Seoul
CLUSTER_NAME="${CLUSTER_NAME:-hailcast-dev-eks}"

# ── The account guard ──────────────────────────────────────
# Check whether the credentials in hand are the project account.
# This used to *print* the account ID and compare nothing, so sitting in the
# wrong account still lit setup and check green from end to end.
#
# Returns: 0 = correct / 1 = a different account / 2 = no credentials, or expired
# Side effect: puts the account ID it found in CURRENT_ACCOUNT, for the caller's message
verify_project_account() {
    CURRENT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text 2>/dev/null) || {
        CURRENT_ACCOUNT=""
        return 2
    }
    [ -n "$CURRENT_ACCOUNT" ] || return 2
    [ "$CURRENT_ACCOUNT" = "$PROJECT_ACCOUNT_ID" ]
}
