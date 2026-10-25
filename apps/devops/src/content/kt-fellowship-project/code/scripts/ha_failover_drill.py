#!/usr/bin/env python3
"""Stage HA drill — measures automatic recovery time when one node is terminated or the CNPG primary fails.

Real changes (terminating an instance, deleting a pod) happen only with --execute and the target's name typed in by hand.
A run needs the team lead's approval and a Discord notice first (node termination does not trigger the security detection rules).

  # 0) Pre-checks only: changes nothing
  python3 scripts/ha_failover_drill.py node
  python3 scripts/ha_failover_drill.py cnpg

  # 1) Drill A: terminate one app node → the managed node group replaces it
  python3 scripts/ha_failover_drill.py node --execute

  # 2) Drill B (optional): delete the CNPG primary pod → automatic promotion
  python3 scripts/ha_failover_drill.py cnpg --execute

Results: summary.md, events.log, probe.csv, and before/after snapshots under ha-results/<drill>-<UTC time>/.
The tables in summary.md go into §4 and §5 of the HA validation report as they are.

Requires: aws CLI (Infra-Admin SSO login) · kubectl (staging kubeconfig) · Python 3.9+
"""

import argparse
import csv
import datetime as dt
import json
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from pathlib import Path

UTC = dt.timezone.utc
KST = dt.timezone(dt.timedelta(hours=9))

DEFAULTS = {
    "cluster": "jangin-staging-eks-cluster",
    "nodegroup": "jangin-staging-ng-app",
    "region": "ap-northeast-2",
    "health_url": "https://api.stg.midam.store/api/products",
    "db_url": "https://api.stg.midam.store/api/products",
    "cnpg_cluster": "jangingmall-postgres",
}
APP_LABEL = "workload-type=app"
BACKEND_SELECTOR = "app.kubernetes.io/name=backend"


# ------------------------------------------------------------------ shared helpers
def now():
    return time.time()


def kst(ts):
    return dt.datetime.fromtimestamp(ts, KST).strftime("%H:%M:%S")


def run(cmd, check=True):
    """Runs a command and returns stdout. On failure, prints stderr as is and stops."""
    p = subprocess.run(cmd, capture_output=True, text=True)
    if check and p.returncode != 0:
        sys.exit(f"[ABORT] Command failed: {' '.join(cmd)}\n{p.stderr.strip()}")
    return p.stdout


def kjson(*args):
    return json.loads(run(["kubectl", *args, "-o", "json"]))


class Log:
    def __init__(self, outdir):
        self.path = outdir / "events.log"
        self.fh = open(self.path, "a", encoding="utf-8")

    def __call__(self, msg):
        line = f"{kst(now())} KST  {msg}"
        print(line, flush=True)
        self.fh.write(line + "\n")
        self.fh.flush()


def snapshot(outdir, tag, namespaces):
    (outdir / f"{tag}-nodes.txt").write_text(
        run(["kubectl", "get", "nodes", "-L", "workload-type", "-o", "wide"], check=False))
    for ns in namespaces:
        (outdir / f"{tag}-pods-{ns}.txt").write_text(
            run(["kubectl", "get", "pods", "-n", ns, "-o", "wide"], check=False))


def confirm(expected, what):
    print(f"\n⚠️  {what}")
    print(f"   To continue, type the target name exactly: {expected}")
    if input("> ").strip() != expected:
        sys.exit("[CANCELLED] The input did not match, and nothing was changed.")


# ------------------------------------------------------------------ external availability probe
class Prober(threading.Thread):
    """Calls the URL every second and records (time, status code, latency). A failure is code=0."""

    def __init__(self, url, interval=1.0, timeout=3.0):
        super().__init__(daemon=True)
        self.url, self.interval, self.timeout = url, interval, timeout
        self.rows, self._halt = [], threading.Event()

    def run(self):
        while not self._halt.is_set():
            t0 = now()
            try:
                with urllib.request.urlopen(self.url, timeout=self.timeout) as r:
                    code = r.status
            except urllib.error.HTTPError as e:
                code = e.code
            except Exception:
                code = 0
            self.rows.append((t0, code, round(now() - t0, 3)))
            self._halt.wait(max(0.0, self.interval - (now() - t0)))

    def stop(self):
        self._halt.set()
        self.join(timeout=5)

    def save(self, path):
        with open(path, "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["epoch", "kst", "code", "latency_s"])
            for t, c, l in self.rows:
                w.writerow([f"{t:.3f}", kst(t), c, l])

    def stats(self, start, end):
        rows = [r for r in self.rows if start <= r[0] <= end]
        bad = [r for r in rows if not (200 <= r[1] < 400)]
        # The longest run of consecutive failures = the outage a user would notice
        longest, cur_start, prev_bad = 0.0, None, False
        for t, c, _ in rows:
            is_bad = not (200 <= c < 400)
            if is_bad and not prev_bad:
                cur_start = t
            if is_bad:
                longest = max(longest, t - cur_start + self.interval)
            prev_bad = is_bad
        return {"total": len(rows), "failed": len(bad), "longest_outage_s": round(longest, 1),
                "max_latency_s": max((r[2] for r in rows), default=0)}


# ------------------------------------------------------------------ Drill A: node termination
def node_ready(node):
    return any(c["type"] == "Ready" and c["status"] == "True" for c in node["status"]["conditions"])


def pod_ready(pod):
    return any(c["type"] == "Ready" and c["status"] == "True"
               for c in pod.get("status", {}).get("conditions", []))


def app_state():
    nodes = kjson("get", "nodes", "-l", APP_LABEL)["items"]
    pods = kjson("get", "pods", "-n", "app")["items"]
    backend = [p for p in pods if p["metadata"].get("labels", {}).get("app.kubernetes.io/name") == "backend"]
    return nodes, pods, backend


def drill_node(a, outdir, log):
    ng = json.loads(run(["aws", "eks", "describe-nodegroup", "--region", a.region,
                         "--cluster-name", a.cluster, "--nodegroup-name", a.nodegroup]))["nodegroup"]
    sc = ng["scalingConfig"]
    log(f"Node group {a.nodegroup}: desired={sc['desiredSize']} min={sc['minSize']} max={sc['maxSize']}")

    nodes, pods, backend = app_state()
    ready_nodes = [n for n in nodes if node_ready(n)]
    log(f"app nodes Ready {len(ready_nodes)}/{len(nodes)}: " + ", ".join(n["metadata"]["name"] for n in nodes))
    placement = {}
    for p in pods:
        placement.setdefault(p["spec"].get("nodeName", "-"), []).append(p["metadata"]["name"])
    for n, ps in placement.items():
        log(f"  {n}: {', '.join(ps)}")

    # --- Safety conditions: the drill does not run if any one fails
    problems = []
    if sc["desiredSize"] < 2 or len(ready_nodes) < 2:
        problems.append("Two app nodes are not Ready (the drill cannot run while nodes are down)")
    b_ready = [p for p in backend if pod_ready(p)]
    if len(b_ready) < 2 or len({p["spec"]["nodeName"] for p in b_ready}) < 2:
        problems.append("The two backend pods are not Ready on separate nodes → terminating one node would stop the service")
    redis_node = next((p["spec"].get("nodeName") for p in pods if p["metadata"]["name"] == "redis-0"), None)

    target = a.target_node
    if not target:
        cands = [n["metadata"]["name"] for n in ready_nodes if n["metadata"]["name"] != redis_node]
        target = cands[0] if cands else None
    if not target:
        problems.append("No app node without redis-0 was found → pass one with --target-node")
    if problems:
        for p in problems:
            log(f"🔴 {p}")
        sys.exit("[ABORT] Pre-checks failed")

    node_obj = next(n for n in nodes if n["metadata"]["name"] == target)
    instance_id = node_obj["spec"]["providerID"].rsplit("/", 1)[-1]
    log(f"Target: {target} ({instance_id})" + ("  ⚠️ redis-0 runs here, and the session store stops too" if target == redis_node else ""))
    snapshot(outdir, "before", ["app"])

    if not a.execute:
        log("✅ Pre-checks passed (run without --execute → stopping here, nothing changed)")
        return None

    confirm(instance_id, f"Terminating EC2 instance {instance_id} (one staging app node).")
    prober = Prober(a.health_url)
    prober.start()
    log(f"Availability probe started: {a.health_url} (every 1 s), baseline {a.baseline} s")
    time.sleep(a.baseline)

    marks = {}
    t0 = now()
    marks["T0 instance termination requested"] = t0
    run(["aws", "ec2", "terminate-instances", "--region", a.region, "--instance-ids", instance_id])
    log(f"T0 terminate-instances {instance_id}")

    original = {n["metadata"]["name"] for n in nodes}
    dropped = False
    while now() - t0 < a.timeout:
        time.sleep(3)
        try:
            nodes, pods, backend = app_state()
        except SystemExit:
            continue  # a transient API error retries on the next cycle
        names = {n["metadata"]["name"]: n for n in nodes}
        tgt = names.get(target)

        def mark(key, cond):
            if cond and key not in marks:
                marks[key] = now()
                log(f"{key}  (+{marks[key] - t0:.0f}s)")

        mark("T1 target node NotReady detected", tgt is None or not node_ready(tgt))
        mark("T2 target node object deleted", tgt is None)
        new = [n for k, n in names.items() if k not in original]
        mark("T3 replacement node registered", bool(new))
        mark("T4 replacement node Ready", any(node_ready(n) for n in new))
        rb = sum(1 for p in backend if pod_ready(p))
        if rb < 2:
            dropped = True
            mark("T5a backend Ready dropped to 1", True)
        mark("T5 backend Ready 2/2 restored", dropped and rb >= 2)
        all_ok = all(pod_ready(p) or p["status"].get("phase") == "Succeeded" for p in pods)
        mark("T6 whole app namespace Ready", "T4 replacement node Ready" in marks and dropped and all_ok)
        if "T6 whole app namespace Ready" in marks:
            break
    else:
        log("🟡 Timed out: summarizing up to the last recorded point")

    time.sleep(a.tail)
    prober.stop()
    t_end = now()
    snapshot(outdir, "after", ["app"])
    prober.save(outdir / "probe.csv")
    return {"title": "Drill A: one app node terminated", "target": f"{target} ({instance_id})",
            "t0": t0, "marks": marks, "probe": prober.stats(t0, t_end), "url": a.health_url}


# ------------------------------------------------------------------ Drill B: CNPG primary failure
def cnpg_state(a):
    c = kjson("get", "clusters.postgresql.cnpg.io", a.cnpg_cluster, "-n", "database")
    return c.get("status", {})


def drill_cnpg(a, outdir, log):
    st = cnpg_state(a)
    primary, ready = st.get("currentPrimary"), st.get("readyInstances", 0)
    log(f"CNPG {a.cnpg_cluster}: primary={primary} readyInstances={ready}/{st.get('instances')}")
    pods = kjson("get", "pods", "-n", "database", "-l", f"cnpg.io/cluster={a.cnpg_cluster}")["items"]
    for p in pods:
        log(f"  {p['metadata']['name']}  node={p['spec'].get('nodeName')}  ready={pod_ready(p)}")
    if ready < 3 or not primary:
        sys.exit("[ABORT] Not 3/3 Ready: the cluster must be healthy before a failure drill")
    snapshot(outdir, "before", ["database"])
    if not a.execute:
        log("✅ Pre-checks passed (run without --execute → stopping here, nothing changed)")
        return None

    confirm(primary, f"Deleting CNPG primary pod {primary} (asynchronous replication: the last commits may be lost).")
    prober = Prober(a.db_url)
    prober.start()
    log(f"Availability probe started: {a.db_url} (DB read API, every 1 s), baseline {a.baseline} s")
    time.sleep(a.baseline)

    marks = {}
    t0 = now()
    marks["T0 primary pod deleted"] = t0
    run(["kubectl", "delete", "pod", primary, "-n", "database", "--wait=false"])
    log(f"T0 delete pod {primary}")
    while now() - t0 < a.timeout:
        time.sleep(2)
        try:
            st = cnpg_state(a)
        except SystemExit:
            continue
        cur = st.get("currentPrimary")
        if cur and cur != primary and "T1 new primary promoted" not in marks:
            marks["T1 new primary promoted"] = now()
            log(f"T1 new primary = {cur}  (+{marks['T1 new primary promoted'] - t0:.0f}s)")
        if "T1 new primary promoted" in marks and st.get("readyInstances", 0) >= 3:
            marks["T2 3/3 Ready restored (the old primary rejoins as a replica)"] = now()
            log(f"T2 readyInstances 3/3  (+{now() - t0:.0f}s)")
            break
    else:
        log("🟡 Timed out: summarizing up to the last recorded point")

    time.sleep(a.tail)
    prober.stop()
    t_end = now()
    snapshot(outdir, "after", ["database"])
    prober.save(outdir / "probe.csv")
    return {"title": "Drill B: CNPG primary pod failure", "target": primary,
            "t0": t0, "marks": marks, "probe": prober.stats(t0, t_end), "url": a.db_url}


# ------------------------------------------------------------------ summary
def write_summary(res, outdir, log):
    lines = [f"## {res['title']}", "",
             f"- Target: `{res['target']}`",
             f"- Start (T0): {kst(res['t0'])} KST", "",
             "| Point | Time (KST) | Since T0 |", "| --- | --- | --- |"]
    for k, v in sorted(res["marks"].items(), key=lambda kv: kv[1]):
        lines.append(f"| {k} | {kst(v)} | +{v - res['t0']:.0f}s |")
    p = res["probe"]
    lines += ["", f"**External availability**: `{res['url']}` called every 1 s", "",
              "| Item | Value |", "| --- | --- |",
              f"| Calls (after T0) | {p['total']} |",
              f"| Failures (5xx, timeouts, connection errors) | {p['failed']} |",
              f"| Longest run of failures = **noticeable outage** | **{p['longest_outage_s']} s** |",
              f"| Maximum response latency | {p['max_latency_s']} s |", "",
              "> Times follow the clock of the machine that ran the drill. probe.csv and events.log are the raw evidence."]
    (outdir / "summary.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    log(f"Summary saved: {outdir / 'summary.md'}")
    print("\n" + "\n".join(lines))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("drill", choices=["node", "cnpg"], help="node = drill A, cnpg = drill B")
    ap.add_argument("--execute", action="store_true", help="actually terminate or delete (pre-checks only without it)")
    ap.add_argument("--target-node", help="drill A target node name (default: an app node without redis-0)")
    ap.add_argument("--timeout", type=int, default=1200, help="maximum wait in seconds (default 1200 = 20 minutes)")
    ap.add_argument("--baseline", type=int, default=30, help="seconds of healthy baseline measured before T0")
    ap.add_argument("--tail", type=int, default=60, help="seconds of extra measurement after recovery")
    ap.add_argument("--out", default="ha-results")
    for k, v in DEFAULTS.items():
        ap.add_argument("--" + k.replace("_", "-"), default=v, dest=k)
    a = ap.parse_args()

    ctx = run(["kubectl", "config", "current-context"]).strip()
    if "staging" not in ctx:
        sys.exit(f"[ABORT] The current kubectl context is not staging: {ctx}")
    who = json.loads(run(["aws", "sts", "get-caller-identity"]))["Arn"]

    stamp = dt.datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
    outdir = Path(a.out) / f"{a.drill}-{stamp}"
    outdir.mkdir(parents=True, exist_ok=True)
    log = Log(outdir)
    log(f"Operator {who.split('/')[-2] if '/' in who else who} · context {ctx} · mode {'EXECUTE' if a.execute else 'CHECK ONLY'}")

    res = drill_node(a, outdir, log) if a.drill == "node" else drill_cnpg(a, outdir, log)
    if res:
        write_summary(res, outdir, log)


if __name__ == "__main__":
    main()
