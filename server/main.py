from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime

app = FastAPI(title="Cloud Security Posture & Threat Detection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock In-Memory Cloud Security State
resources_db = [
    {"id": "res-001", "name": "prod-customer-data-bucket", "type": "S3 Bucket", "region": "us-east-1", "status": "Misconfigured", "risk": "High", "issue": "Public read-access enabled"},
    {"id": "res-002", "name": "admin-iam-user-john", "type": "IAM User", "region": "global", "status": "Compliant", "risk": "Low", "issue": "MFA enabled, rotated keys"},
    {"id": "res-003", "name": "db-security-group-sql", "type": "Security Group", "region": "us-west-2", "status": "Misconfigured", "risk": "Critical", "issue": "Inbound port 3306 open to 0.0.0.0/0"},
    {"id": "res-004", "name": "lambda-auth-service", "type": "Lambda Function", "region": "eu-central-1", "status": "Compliant", "risk": "Low", "issue": "Secure execution role"},
    {"id": "res-005", "name": "legacy-backup-storage", "type": "S3 Bucket", "region": "us-east-1", "status": "Misconfigured", "risk": "Medium", "issue": "Server-side encryption disabled"}
]

threats_db = [
    {"id": "thr-101", "severity": "Critical", "title": "Unusual IAM Privilege Escalation", "source": "198.51.100.42 (Unknown IP)", "timestamp": datetime.datetime.now().isoformat(), "details": "User 'dev-service-account' executed AttachUserPolicy granting administrator access."},
    {"id": "thr-102", "severity": "High", "title": "Suspicious Data Exfiltration Pattern", "source": "s3://prod-customer-data-bucket", "timestamp": datetime.datetime.now().isoformat(), "details": "High volume egress traffic detected to external autonomous system (ASN 64512)."},
    {"id": "thr-103", "severity": "Medium", "title": "Brute-force SSH Attempt on Bastion", "source": "203.0.113.15", "timestamp": datetime.datetime.now().isoformat(), "details": "142 failed login attempts within 3 minutes on bastion host SG."}
]

class RemediationRequest(BaseModel):
    resource_id: str

@app.get("/api/status")
def get_security_status():
    total_resources = len(resources_db)
    misconfigured = sum(1 for r in resources_db if r["status"] == "Misconfigured")
    critical_threats = sum(1 for t in threats_db if t["severity"] == "Critical")
    score = max(40, 100 - (misconfigured * 12) - (critical_threats * 15))
    return {
        "security_score": score,
        "total_resources": total_resources,
        "misconfigured_resources": misconfigured,
        "active_threats": len(threats_db),
        "critical_threats": critical_threats,
        "last_scan": datetime.datetime.now().isoformat()
    }

@app.get("/api/resources")
def get_resources():
    return resources_db

@app.get("/api/threats")
def get_threats():
    return threats_db

@app.post("/api/scan")
def trigger_scan():
    return {"message": "Cloud posture scan completed successfully.", "scanned_items": len(resources_db), "timestamp": datetime.datetime.now().isoformat()}

@app.post("/api/remediate")
def remediate_resource(req: RemediationRequest):
    for r in resources_db:
        if r["id"] == req.resource_id:
            r["status"] = "Compliant"
            r["risk"] = "Low"
            r["issue"] = "Remediated: Policy applied successfully"
            return {"status": "success", "message": f"Successfully remediated resource {req.resource_id}"}
    raise HTTPException(status_code=404, detail="Resource not found")
