# Honey Chain — Production Deployment Guide

This guide covers the deployment, configuration, and verification of the Honey Chain platform across local and cloud environments.

---

## 1. System Topology

```text
                        ┌───────────────────────────────┐
                        │   Internet / Public Traffic   │
                        └───────────────┬───────────────┘
                                        │
                         HTTP/HTTPS (Port 80/443)
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │      Reverse Proxy (Nginx)    │
                        │    SSL / Termination Layer    │
                        └───────┬───────────────┬───────┘
                                │               │
                  Static SPA (3000)      API Requests (5000)
                                │               │
                                ▼               ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│     Frontend Web Application    │   │      Backend REST API Server    │
│  - React 18 + TypeScript        │   │  - Express.js + Node.js 20      │
│  - Vite + Tailwind CSS          │   │  - Firebase Admin SDK           │
│  - Firebase Client SDK (Auth)   │   │  - RBAC & Tenant Isolation      │
└─────────────────────────────────┘   └─────────┬──────────────┬────────┘
                                                │              │
                                                ▼              ▼
                              ┌───────────────────┐  ┌───────────────────┐
                              │    PostgreSQL     │  │     AI Service    │
                              │    Database       │  │  - Python FastAPI │
                              │    (Port 5432)    │  │  - IsolationForest│
                              └───────────────────┘  │  - HOBOS ML Engine│
                                                     │    (Port 8000)    │
                                                     └───────────────────┘
```

---

## 2. Prerequisites

| Tool | Minimum Version | Purpose |
| :--- | :--- | :--- |
| **Docker & Docker Compose** | 20.10+ / Compose v2+ | Containerized multi-service orchestration |
| **Node.js** | v18.x or v20.x | Backend API & Frontend runtime |
| **Python** | 3.10+ | AI anomaly detection service |
| **PostgreSQL** | 15+ or 16+ | Application database (RBAC, entities, logs) |
| **Firebase Project** | Web App + Admin Service Account | Identity Provider (Email/Password Auth) |

---

## 3. Environment Configuration

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=AIzaSyDNWGE1-3jgQIi0zb56okwNRmMSf3Rmwng
VITE_FIREBASE_AUTH_DOMAIN=honey-chain-f3563.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=honey-chain-f3563
VITE_FIREBASE_STORAGE_BUCKET=honey-chain-f3563.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=201774746282
VITE_FIREBASE_APP_ID=1:201774746282:web:5dac96fd114c44462a1ed3
VITE_FIREBASE_MEASUREMENT_ID=G-M6V3JJHK3R
```

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=production

# Database Connection
DATABASE_URL=postgresql://honeychain:honeychain2026@localhost:5432/honeychain

# AI Service Endpoint
AI_SERVICE_URL=http://localhost:8000

# Firebase Admin SDK
FIREBASE_PROJECT_ID=honey-chain-f3563
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@honey-chain-f3563.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 4. Deployment Methods

### Method A: One-Command Docker Compose (Recommended)

#### Linux / macOS:
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

#### Windows:
```powershell
.\scripts\deploy.ps1
```

#### Direct Docker Compose Command:
```bash
docker compose build
docker compose up -d
```

---

### Method B: Bare-Metal / Process Manager (PM2 / Systemd)

#### 1. Start PostgreSQL
Ensure PostgreSQL is running and initialize the schema:
```bash
psql -U honeychain -d honeychain -f backend/src/db/schema.sql
```

#### 2. Start AI Service
```bash
cd ai
python -m venv .venv
source .venv/bin/activate # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

#### 3. Build & Start Backend API
```bash
cd backend
npm install
npm run build
npm start
```

#### 4. Build & Serve Frontend
```bash
cd frontend
npm install
npm run build
# Serve the dist/ directory via Nginx or static file server
```

---

## 5. Health Verification & Smoke Tests

After launching the platform, verify each tier:

```bash
# 1. Check Backend Health
curl -s http://localhost:5000/api/health

# 2. Check AI Service Health
curl -s http://localhost:8000/

# 3. Check Public Passport Access
curl -s http://localhost:5000/api/passport/HC-2026-0001

# 4. Run Automated Auth & RBAC Test Suite
cd backend
npx ts-node src/test_firebase_auth_rbac.ts
```

---

## 6. Pre-Seeded Production Demo Accounts

All pre-seeded participant accounts are active and mapped to Firebase Authentication:

| Role | Email | Password | Assigned Portal |
| :--- | :--- | :--- | :--- |
| **🛡️ Platform Admin** | `admin@honeychain.demo` | `HoneyChain@2026!` | Admin Command Center |
| **🐝 Master Beekeeper** | `beekeeper@honeychain.demo` | `HoneyChain@2026!` | Beekeeper Workspace |
| **⚙️ Chief Processor** | `processor@honeychain.demo` | `HoneyChain@2026!` | Processing Facility |
| **🚚 Logistics Fleet** | `transporter@honeychain.demo` | `HoneyChain@2026!` | Logistics Management |
| **📦 Packaging Hub** | `packager@honeychain.demo` | `HoneyChain@2026!` | Packaging Hub |
| **🔬 Apex Quality Lab** | `lab@honeychain.demo` | `HoneyChain@2026!` | Quality & Lab Assay |
| **🍯 Public Consumer** | *(No Login Required)* | — | Digital Honey Passport (`/passport/HC-2026-0001`) |
