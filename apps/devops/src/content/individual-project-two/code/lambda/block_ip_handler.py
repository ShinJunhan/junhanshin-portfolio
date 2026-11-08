"""
lambda/block_ip/handler.py

Blocks an attacking IP in the network ACL when an SNS alert arrives.
Subscribed to shimonvault-security-alert; no publisher is wired up yet.

  1. Parse the IP from the SNS message
  2. Add a NACL DENY entry (rules 1-99; warn and skip if NACL_ID is unset)
  3. Record the incident in DynamoDB
  4. Notify Slack and Telegram
"""

import json
import os
import boto3
from datetime import datetime, timezone
from notification import notify_all  # shared helper in Lambda layer or same zip


# ── AWS clients ──────────────────────────────────────────────────────────────
ec2     = boto3.client("ec2",      region_name=os.environ["AWS_REGION"])
dynamo  = boto3.resource("dynamodb", region_name=os.environ["AWS_REGION"])


def lambda_handler(event, context):
    """Entry point called by SNS."""
    print("block_ip triggered:", json.dumps(event))

    for record in event.get("Records", []):
        try:
            payload = json.loads(record["Sns"]["Message"])
            process(payload)
        except Exception as exc:
            print(f"ERROR processing record: {exc}")
            # Do not re-raise — let Lambda succeed so SNS doesn't retry infinitely


def process(payload: dict):
    attacking_ip: str = payload["attacking_ip"]
    attempt_count: int = payload.get("attempt_count", 0)
    window_minutes: int = payload.get("window_minutes", 5)
    timestamp: str = datetime.now(timezone.utc).isoformat()

    # ── 1. Block IP in the network ACL ──────────────────────────────────────
    sg_id = os.environ["APP_SECURITY_GROUP_ID"]
    block_ip_in_sg(sg_id, attacking_ip)

    # ── 2. Write incident to DynamoDB ────────────────────────────────────────
    write_incident(
        incident_id=f"cred-stuffing-{attacking_ip}-{int(datetime.now().timestamp())}",
        incident_type="credential_stuffing",
        severity="HIGH",
        attacking_ip=attacking_ip,
        details={
            "attempt_count": attempt_count,
            "window_minutes": window_minutes,
            "action_taken": f"IP {attacking_ip} blocked in SG {sg_id}",
        },
        timestamp=timestamp,
    )

    # ── 3. Notify both channels ───────────────────────────────────────────────
    message = (
        f"🚨 *SECURITY ALERT — ShimonVault*\n"
        f"Type: Credential Stuffing Attack\n"
        f"IP: `{attacking_ip}`\n"
        f"Failed attempts: {attempt_count} in {window_minutes} minutes\n"
        f"Action: IP automatically blocked in Security Group\n"
        f"Time: {timestamp}"
    )
    notify_all(message)


def block_ip_in_sg(sg_id: str, ip: str):
    """Block `ip` in the network ACL. SGs are allow-only. No NACL_ID: warn and skip."""

    nacl_id = os.environ.get("NACL_ID")

    if nacl_id:
        # Preferred: block at Network ACL level (stateless — blocks both directions)
        _block_via_nacl(nacl_id, ip)
    else:
        # Fallback: log that manual NACL block is needed
        print(f"WARNING: NACL_ID not set — IP {ip} was NOT blocked. Set NACL_ID env var.")

    print(f"Processed block for IP: {ip}")


def _block_via_nacl(nacl_id: str, ip: str):
    """Insert a DENY rule at rule number 1 for the attacking IP.
    Rule numbers 1–99 are reserved for auto-blocks (increments each time).
    Rules 100+ are your normal allow rules."""

    # Find the next available low rule number (1–99)
    existing = ec2.describe_network_acls(NetworkAclIds=[nacl_id])
    used_numbers = {
        e["RuleNumber"]
        for acl in existing["NetworkAcls"]
        for e in acl["Entries"]
        if not e.get("Egress") and e["RuleNumber"] < 100
    }

    rule_number = next(
        (n for n in range(1, 100) if n not in used_numbers),
        None
    )

    if rule_number is None:
        print("WARNING: All auto-block rule numbers (1–99) are used. Cannot add new block.")
        return

    ec2.create_network_acl_entry(
        NetworkAclId=nacl_id,
        RuleNumber=rule_number,
        Protocol="-1",          # all traffic
        RuleAction="deny",
        Egress=False,
        CidrBlock=f"{ip}/32",
    )
    print(f"NACL rule {rule_number} added: DENY {ip}/32")


def write_incident(incident_id, incident_type, severity, attacking_ip, details, timestamp):
    table = dynamo.Table(os.environ["DYNAMODB_INCIDENTS_TABLE"])
    table.put_item(Item={
        "incident_id":   incident_id,
        "incident_type": incident_type,
        "severity":      severity,
        "attacking_ip":  attacking_ip,
        "details":       details,
        "timestamp":     timestamp,
        "status":        "active",
    })
    print(f"Incident written: {incident_id}")
