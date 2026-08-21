# Runbook — Self-Healing AWS Infrastructure

Operating instructions for the running system. Every section is written to be
followed under pressure: what to check, what to run, what the correct output
looks like, and what to do when it isn't.

Slack is the primary notification channel. Detection alerts go to
`#monitoring`; recovery results go to `#recovery`. If you are reading this
because something paged you, the two channels together tell you what broke and
whether the system already fixed it.

---

## 1. Confirm the system is healthy

Run from the management server.

```bash
./check.sh
```

Expected output: every host reachable, every unit `active`, and the recovery
controller answering on port 5000.

Check the pieces individually if `check.sh` reports a failure:

```bash
# Ansible can reach every managed host
ansible all -i ansible/inventory.yml -m ping

# The controller is up and has loaded its policy
curl -s localhost:5000/health

# Prometheus has every target UP
curl -s localhost:9090/api/v1/targets | grep -c '"health":"up"'
```

If Prometheus reports a target DOWN and no alert has fired yet, wait 5 seconds.
Every rule in `alert.rules.yml` uses `for: 5s`, so detection is fast but not
instant.

---

## 2. Deploy or redeploy

Terraform first, then Ansible. The Ansible inventory is generated from
Terraform output, so running them out of order configures the previous set of
instances.

```bash
make plan      # review before every apply — no exceptions
make apply     # ~10 minutes for the full 41 resources
make configure # Ansible across mgmt, web, and db
```

`terraform.tfvars` and `group_vars/secrets.yml` are gitignored. Copy them from
`secrets.yml.example` and fill them in before the first run; `make configure`
fails immediately with a missing-variable error rather than deploying a
half-configured host.

To rebuild a single role without touching the rest:

```bash
ansible-playbook -i ansible/inventory.yml ansible/site.yml --tags monitoring
```

---

## 3. When an alert fires

The controller handles this on its own. Do not intervene for the first two
minutes — manual action during a retry window competes with the recovery
script and makes the outcome harder to read.

What happens automatically:

1. Prometheus evaluates the rule and fires after `for: 5s`.
2. Alertmanager posts to `#monitoring` and webhooks the controller.
3. The controller looks the `alertname` up in `recovery_map.yml`, runs the
   mapped script, and retries up to that alert's `retry` count.
4. Where the policy defines a `verify` command, the controller runs it and
   reports success or failure to `#recovery`.

Current policy, from `recovery/controller/config/recovery_map.yml`:

| Alert | Script | Retries | Cooldown |
| --- | --- | --- | --- |
| `NginxDown` | `recover_nginx.sh` | 3 | 60s |
| `NginxExporterDown` | `recover_nginx_exporter.sh` | 3 | 60s |
| `HighCPU` | `recover_cpu.sh` | 2 | 120s |
| `HighMemoryUsage` | `recover_memory.sh` | 2 | 120s |
| `PostgreSQLHighConnections` | `recover_db.sh` | 2 | 180s |

Expect recovery to complete in 30–60 seconds from the alert firing.

---

## 4. When recovery fails

`#recovery` reports a failure after the last retry. Take over at that point.

```bash
# What the controller actually did
sudo journalctl -u recovery-controller -n 100 --no-pager

# The state of the service it was trying to fix
ansible webservers -i ansible/inventory.yml -m shell -a 'systemctl status nginx' -b
```

Then recover by hand:

```bash
ansible webservers -i ansible/inventory.yml -m systemd \
  -a 'name=nginx state=restarted' -b
```

If the service starts by hand but not through the controller, the fault is in
the script or its permissions, not in the service. Check that the controller's
user can run the script and that the script is executable on the target host.

A cooldown suppresses repeat runs for the same alert. An alert that keeps
firing without a recovery attempt is inside its cooldown window — check the
timestamps in `#monitoring` against the cooldown column above before
concluding the controller is stuck.

---

## 5. Test the recovery path

Never wait for a real failure to find out whether recovery works. Inject one.

```bash
./chaos/inject.sh nginx-down
./chaos/inject.sh exporter-down
./chaos/inject.sh high-cpu
./chaos/inject.sh high-memory
```

Watch `#monitoring` for detection and `#recovery` for the result. A full
scenario should close in under a minute. Run all four after any change to the
recovery scripts, the alert rules, or the controller.

Inject on the on-premises environment first where one exists. It carries the
same four-server layout, so a scenario that fails there fails for a reason that
has nothing to do with AWS.

---

## 6. Hybrid networking

The on-premises and AWS environments are joined over a Tailscale VPN. When
Prometheus cannot scrape across environments, check the tunnel before checking
anything else.

```bash
tailscale status
tailscale ping <hostname>
```

Re-enroll a host that has dropped off:

```bash
sudo ./bootstrap_tailscale.sh
```

The auth key expires. A host that was fine last week and is unreachable today
with no other change is almost always an expired key.

---

## 7. Known traps

- **Use `pkill -x`, never `pkill -f`, in a recovery script.** `pkill -f` matches
  the full command line, which includes the Ansible shell invocation running
  the recovery script itself — the script kills its own process mid-run. This
  cost four iterations of `recover_memory.sh` to find.
- **Memory recovery behaves differently on AWS.** The OOM killer intervenes
  before the script's own threshold is reached. Validate memory scenarios on
  AWS specifically; an on-premises pass does not carry over.
- **Never commit a webhook URL.** Slack URLs belong in
  `group_vars/secrets.yml`, which is gitignored. One reached a pull request and
  was caught in review; assume the next one will not be.
- **Grafana dashboards are imported by hand.** Auto-provisioning is not
  finished. After a rebuild, re-import `grafana-dashboard.json` — the queries
  are job-based, so it works against a rebuilt fleet without editing.

---

## 8. Tear down

```bash
make destroy
```

Confirm the plan lists only this project's resources before approving. Check
that the S3 state bucket and anything holding real data are not in the list.
