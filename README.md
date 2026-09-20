# Cloud Security Posture & Intelligent Threat Detection Platform (CloudGuard SOC)

A production-grade, full-stack Cloud Security Posture Management (CSPM) and Intelligent Threat Detection Security Operations Center (SOC) dashboard designed for enterprise environments.

---

## 🚀 Key Features

1. **Real-Time Security Posture Scoring**: Automated security score calculation (0-100%) based on CIS AWS Benchmark compliance and active critical threat exposure.
2. **Cloud Resource Compliance**: Monitors S3 buckets (public read-access, encryption), IAM users (MFA, permissions), security groups (open ports like 0.0.0.0/0), and Lambda execution roles.
3. **Intelligent Threat Detection Feed**: Real-time logging and telemetry of suspicious API calls, IAM privilege escalations, and abnormal data egress.
4. **One-Click Automated Remediation**: Instantly apply corrective security policies and mitigation scripts to misconfigured cloud resources.
5. **Advanced Search & Risk Filtering**: Filter monitored resources instantly by risk level (Critical, High, Low) or search by name, region, and security issue.

---

## 🛠️ Technology Stack & Architecture

- **Backend API**: Python **FastAPI**, Uvicorn, Pydantic (High-performance async REST API with CORS middleware and in-memory mock state).
- **Frontend Dashboard**: **React**, **Vite**, **Tailwind CSS**, **Lucide Icons** (Modern dark glassmorphic SOC theme with PostCSS compilation).
- **API Endpoints**:
  - `GET /api/status`: Overall security score, resource counts, and threat summaries.
  - `GET /api/resources`: List of monitored cloud assets and compliance status.
  - `GET /api/threats`: Active security alerts and threat telemetry feed.
  - `POST /api/scan`: Triggers an automated cloud compliance posture scan.
  - `POST /api/remediate`: Executes automated remediation on a misconfigured resource.

---

## ⚙️ Running the Application Locally

### 1. Start the Backend API (Port 8000)
```bash
cd server
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend Dashboard (Port 3000)
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

---
*Production Release v1.0.0 — Fully Verified & Styled.*
