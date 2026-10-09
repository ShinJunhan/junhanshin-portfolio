import subprocess, os, logging
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime
import httpx

# Log file
logging.basicConfig(
    filename='/var/log/recovery.log',
    level=logging.INFO,
    format='%(asctime)s %(message)s'
)
log = logging.getLogger(__name__)

app = FastAPI(title="Auto Recovery Webhook Server")
SLACK = os.getenv("SLACK_WEBHOOK_URL", "")
SSH_KEY = "/home/user1/.ssh/teamproj01ansiblekey.pem"

# Alert name to (display name, recovery command).
# FastAPI is a Docker container and node_exporter is a systemd unit, so the
# two need different commands.
RECOVERY_MAP = {
    "FastAPIDown":     ("fastapi",       "docker restart fastapi"),
    "NodeDown":        ("node_exporter", "systemctl restart node_exporter"),
}

# Prometheus job name to the target host address
HOST_MAP = {
    "fastapi-rocky1": "192.168.61.134",
    "fastapi-rocky2": "192.168.61.135",
    "node-rocky1":    "192.168.61.134",
    "node-rocky2":    "192.168.61.135",
    "node-ubuntu1":   "192.168.61.136",
}

class Alert(BaseModel):
    status: str
    labels: dict
    annotations: dict

class Payload(BaseModel):
    alerts: List[Alert]

@app.post("/alert")
async def handle_alert(payload: Payload):
    for alert in payload.alerts:
        if alert.status != "firing":
            continue

        name    = alert.labels.get("alertname", "")
        job     = alert.labels.get("job", "")
        host    = HOST_MAP.get(job)
        entry   = RECOVERY_MAP.get(name)

        if not host or not entry:
            msg = f"Unknown alert: {name} / job={job}. Needs manual attention"
            log.warning(msg)
            await notify(f"UNKNOWN {msg}")
            continue

        service, command = entry

        ts = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log.info(f"Recovery started: {name} | {service}@{host} | {ts}")
        await notify(f"Auto recovery started: *{name}*\nHost: {host} | Service: {service} | {ts}")

        ok = run_ssh(host, f"sudo {command}")

        if ok:
            msg = f"Recovery complete ✅: {name} | {service}@{host}"
        else:
            msg = f"Recovery failed ❌: {name} | {service}@{host}. Manual intervention needed"

        log.info(msg)
        await notify(msg)

    return {"ok": True}

@app.get("/health")
def health():
    return {"status": "ok", "server": "recovery-webhook"}

def run_ssh(host: str, cmd: str) -> bool:
    try:
        result = subprocess.run(
            [
                "ssh", "-i", SSH_KEY,
                "-o", "StrictHostKeyChecking=no",
                "-o", "ConnectTimeout=10",
                f"user1@{host}", cmd
            ],
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode != 0:
            log.error(f"SSH error: {result.stderr.strip()}")
        return result.returncode == 0
    except Exception as e:
        log.error(f"SSH exception: {e}")
        return False

async def notify(msg: str):
    if not SLACK:
        return
    try:
        async with httpx.AsyncClient() as c:
            await c.post(SLACK, json={"text": msg}, timeout=5)
    except Exception as e:
        log.error(f"Slack notification failed: {e}")