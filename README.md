# Cloud Security Posture & Intelligent Threat Detection Platform (CloudGuard SOC)

A production-grade, full-stack cloud security posture management (CSPM) and intelligent threat detection dashboard designed for enterprise environments.

---

## 🚀 Features

- **Real-time Security Posture Scoring:** Automated posture calculation based on resource compliance and critical threat exposure.
- **Cloud Resource Compliance (CIS Benchmarks):** Monitors S3 buckets, IAM users, security groups, and Lambda functions for misconfigurations (e.g., public read-access, overly permissive security groups).
- **Intelligent Threat Detection Feed:** Real-time logging of suspicious API calls, IAM privilege escalations, and abnormal data egress.
- **One-Click Automated Remediation:** Instantly apply corrective security policies to misconfigured cloud resources.

---

## 🛠️ Technology Stack

- **Backend:** FastAPI (Python), Uvicorn, Pydantic
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
- **Architecture:** Microservices-ready REST API with asynchronous evaluation engine

---

## ⚙️ Running the Application

### 1. Start the Backend API
```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend Dashboard
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🛡️ Workforce & Quality Assurance
- **Orchestration:** Michael (god)
- **Architecture & Build:** Chandler Bing (Agent 1)
- **UI/UX Polish:** Penny (Agent 2)
- **QA & Testing:** Leonard Hofstadter (Agent 3)
- **Documentation & Portfolio:** Monica Geller (Agent 15)
