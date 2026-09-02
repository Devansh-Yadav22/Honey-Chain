<p align="center">
  <h1 align="center">🐝 Honey Chain</h1>
  <p align="center">
    <strong>Blockchain-backed honey traceability & smart beekeeping platform</strong>
  </p>
  <p align="center">
    <em>SIH 2026 — Problem Statement SIH26021 | Team Bee-Tech</em>
  </p>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-team">Team</a>
</p>

---

## 🌟 Overview

**Honey Chain** creates a digital chain of trust from hive to consumer. It combines **permissioned blockchain** as a shared trust and provenance layer, **AI-driven hive intelligence** for health monitoring and anomaly detection, and a **QR-based Honey Passport** for consumer verification.

> **Blockchain preserves what was recorded. AI checks whether the recorded journey is consistent with available evidence.**

### Core USP

```
PERMISSIONED TRUST  +  HIVE INTELLIGENCE  +  PROVENANCE  +  EVIDENCE  +  CONSUMER VERIFICATION
```

### What Honey Chain Does

- 🐝 **Hive Intelligence** — Real-time health scoring, anomaly detection, and productivity insights from simulated IoT telemetry
- 🍯 **Honey Traceability** — Tracks honey journey: Hive → Harvest → Batch → Processing → Transport → Packaging
- ⛓️ **Blockchain Trust Layer** — Hyperledger Fabric records tamper-evident provenance events
- 🔍 **Provenance Consistency Engine** — Compares recorded provenance against available evidence to flag suspicious batches
- 📱 **Honey Passport** — QR-based consumer interface showing understandable provenance and verification status

---

## 🏗️ Architecture

```
┌──────────────────────────────┐
│       HIVE MONITORING        │
│ Simulated IoT Telemetry      │
│ Temperature / Humidity        │
│ Weight / Bee Activity         │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│       AI INTELLIGENCE        │
│ Health Score                  │
│ Anomaly Detection             │
│ Productivity Intelligence     │
│ Provenance Consistency        │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│      HONEY CHAIN PLATFORM    │
│ React + Node/Express          │
│ PostgreSQL + REST API         │
│ QR / Honey Passport           │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│      HYPERLEDGER FABRIC      │
│ Permissioned Provenance       │
│ Batch + Events + History      │
└──────────────┬───────────────┘
               ↓
         QR HONEY PASSPORT
               ↓
           CONSUMER
```

### Solution Flow

```
HIVE → IoT Telemetry → AI Intelligence → HARVEST → BATCH → PROCESSING → TRANSPORT → PACKAGING → BLOCKCHAIN → QR PASSPORT → CONSUMER
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript, Tailwind CSS, Vite |
| **Backend** | Node.js, TypeScript, Express |
| **Database** | PostgreSQL |
| **AI Service** | Python, FastAPI, scikit-learn |
| **Blockchain** | Hyperledger Fabric, Fabric CA/MSP |
| **IoT** | Simulated telemetry (Phase 1) |
| **Deployment** | Docker, Docker Compose |
| **Communication** | REST APIs |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.10+
- [Docker](https://www.docker.com/) & Docker Compose
- [PostgreSQL](https://www.postgresql.org/) 16+

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/Devansh-Yadav22/Honey-Chain.git
cd Honey-Chain

# Copy environment template
cp .env.example .env

# Start all services
docker-compose up --build
```

### Manual Setup

#### Backend
```bash
cd backend
npm install
npm run dev          # Runs on port 5000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev          # Runs on port 3000
```

#### AI Service
```bash
cd ai
python -m venv venv
source venv/bin/activate      # Linux/Mac
# venv\Scripts\activate       # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## 📁 Project Structure

```
honey-chain/
│
├── README.md                       # This file
├── 00_MASTER_SPEC.md               # Single source of truth
├── docker-compose.yml              # Service orchestration
├── .env.example                    # Environment variable template
├── .gitignore
│
├── docs/
│   ├── architecture/               # Architecture diagrams & docs
│   ├── api/                        # API reference documentation
│   └── decisions/                  # Decision log records
│
├── frontend/                       # React + TypeScript + Vite
│   ├── public/
│   └── src/
│       ├── components/             # Reusable UI components
│       ├── pages/                  # Dashboard, Hive, Batch, Passport
│       ├── services/               # API service layer
│       ├── hooks/                  # Custom React hooks
│       ├── types/                  # TypeScript definitions
│       ├── utils/                  # Utility functions
│       ├── App.tsx
│       └── main.tsx
│
├── backend/                        # Node.js + Express + TypeScript
│   └── src/
│       ├── config/                 # Database & env configuration
│       ├── models/                 # Database models
│       ├── routes/                 # Express route definitions
│       ├── controllers/            # Request handlers
│       ├── services/               # Business logic & service adapters
│       ├── middleware/             # Validation, auth, error handling
│       ├── types/                  # Shared TypeScript types
│       └── index.ts               # Server entry point
│
├── ai/                             # Python + FastAPI
│   ├── app/
│   │   ├── main.py                 # FastAPI entry point
│   │   ├── routers/                # Health, anomaly, yield, provenance
│   │   ├── models/                 # ML model loading & inference
│   │   ├── schemas/                # Pydantic schemas
│   │   └── utils/
│   ├── data/                       # Training datasets
│   ├── notebooks/                  # Jupyter exploration notebooks
│   ├── models/                     # Saved model artifacts
│   └── requirements.txt
│
├── blockchain/                     # Hyperledger Fabric
│   ├── chaincode/
│   │   └── honeychain-cc/          # Smart contract (TypeScript)
│   ├── network/                    # Fabric network configuration
│   ├── wallet/                     # Identity wallet (gitignored)
│   └── scripts/                    # Setup & deployment scripts
│
├── iot/                            # IoT Simulator
│   └── simulator/
│       ├── telemetry_generator.py  # Telemetry data generation
│       ├── scenarios.py            # Normal & anomaly scenarios
│       └── config.py               # Simulator configuration
│
├── data/                           # Seed data & generated datasets
│   └── seed/                       # Demo seed data
│
└── tests/                          # Test suites
    ├── unit/                       # Unit tests
    ├── integration/                # Cross-component tests
    └── e2e/                        # End-to-end flow tests
```

---

## 📡 API Reference

### Backend REST API (Port 5000)

| Endpoint | Method | Description |
|---|---|---|
| `/api/hives` | POST | Register a new hive |
| `/api/hives` | GET | List all hives |
| `/api/hives/:id` | GET | Get hive details |
| `/api/telemetry` | POST | Ingest telemetry data |
| `/api/hives/:id/telemetry` | GET | Get hive telemetry |
| `/api/hives/:id/health` | GET | AI health score |
| `/api/hives/:id/anomalies` | GET | Anomaly detection |
| `/api/hives/:id/productivity` | GET | Yield prediction |
| `/api/provenance/check` | POST | Provenance consistency check |
| `/api/batches` | POST | Create a batch |
| `/api/batches` | GET | List all batches |
| `/api/batches/:id` | GET | Get batch details |
| `/api/batches/:id/timeline` | GET | Batch provenance timeline |
| `/api/passport/:batchId` | GET | Honey Passport data |

### AI Service API (Port 8000)

| Endpoint | Method | Description |
|---|---|---|
| `/ai/health` | POST | Health score & status |
| `/ai/anomaly` | POST | Anomaly detection |
| `/ai/yield` | POST | Yield prediction |
| `/ai/provenance/check` | POST | Provenance consistency engine |

---

## 🎯 Demo

### Demo Story

1. **Start at the hive** — Open `HIVE-001`, view telemetry and AI health
2. **Harvest** — Create a harvest from the hive
3. **Create batch** — Create batch `HC-2026-0001`
4. **Supply chain** — Record processing, transport, packaging events
5. **Blockchain** — View provenance history on-chain
6. **QR Passport** — Scan the batch QR and open the Honey Passport
7. **Suspicious scenario** — Demonstrate provenance inconsistency (recorded: 18 kg, evidence: 31 kg → **SUSPICIOUS**)

### Demo Data

| Hives | Batches |
|---|---|
| HIVE-001 — Healthy | HC-2026-0001 — Verified |
| HIVE-002 — Healthy | HC-2026-0002 — Verified |
| HIVE-003 — Warning | HC-2026-0003 — Suspicious |
| HIVE-004 — Healthy | |
| HIVE-005 — Critical | |

---

## 🔑 Data Model

```
Beekeeper ──→ Hive ──→ Telemetry
                │
                ↓
             Harvest ──→ Batch ──→ ProcessingEvent
                                ──→ TransportEvent
                                ──→ PackagingEvent
                                ──→ Certification
```

---

## 🔐 Security

- Private consortium data protected via Fabric identity management
- Raw telemetry stored off-chain (database, not blockchain)
- Secrets managed through environment variables (never committed)
- API input validation on all endpoints
- Consumer-visible data separated from operational data

---

## 🤝 Git Workflow

### Branches

```
main
├── feature/fullstack/*
├── feature/ai/*
└── feature/blockchain/*
```

### Commit Convention

```
feat: add telemetry endpoint
fix: correct batch verification
docs: update master spec
refactor: simplify blockchain service
```

---

## 👥 Team

**Bee-Tech** — SIH 2026

---

## 📄 License

This project is part of the Smart India Hackathon 2026 submission.

---

<p align="center">
  <strong>🍯 Trust the Journey • Understand the Hive • Verify the Evidence 🍯</strong>
</p>
