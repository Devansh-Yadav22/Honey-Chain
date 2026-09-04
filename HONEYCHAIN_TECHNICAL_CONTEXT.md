# HONEY CHAIN: TECHNICAL CONTEXT & SYSTEM ARCHITECTURE SPECIFICATION
**Project Code:** SIH26021 | **Team:** Bee-Tech | **System Version:** 2.0.0 (Phase 2 Production)

---

## 1. SYSTEM TOPOLOGY & SERVICE PORTS

| Component | Technology / Runtime | Port / Protocol | Container / Process | Primary Endpoint / Path |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend UI** | React 18.3 + TypeScript + Vite 5 + TailwindCSS | `3000` (HTTP) | Node process | `http://localhost:3000` |
| **Backend REST API** | Express 4.19 + TypeScript + Node.js 20 | `5000` (HTTP) | Node (`ts-node-dev`) | `http://localhost:5000/api` |
| **AI ML Engine** | FastAPI + Uvicorn + Python 3.11 + Scikit-Learn | `8000` (HTTP) | Python Uvicorn daemon | `http://127.0.0.1:8000` |
| **Primary Database** | PostgreSQL 16 Alpine | `5432` (TCP) | Docker (`honeychain-db`) | `localhost:5432/honeychain` |
| **Fabric Peer 0** | Hyperledger Fabric v2.5.9 Peer Node | `7051` (gRPC/TLS) | Docker (`peer0.org1.honeychain.local`) | `peer0.org1.honeychain.local:7051` |
| **Fabric Orderer** | Raft Consensus Orderer Node | `7050` (gRPC/TLS) | Docker (`orderer.honeychain.local`) | `orderer.honeychain.local:7050` |
| **Fabric CA** | Hyperledger Fabric Certificate Authority | `7054` (HTTP/TLS)| Docker (`ca.org1.honeychain.local`) | `ca.org1.honeychain.local:7054` |
| **Fabric Chaincode** | Node.js Chaincode Container | Internal Docker bridge | `dev-peer0...-honeychain_1.1` | gRPC via Fabric Shim |

---

## 2. HYPERLEDGER FABRIC BLOCKCHAIN ARCHITECTURE

### 2.1 Network Topology & Channel Configuration
- **Channel Name:** `honeychannel`
- **Consensus Type:** Raft (`etcdraft`), 1 Orderer Node (`orderer.honeychain.local:7050`)
- **Organizations:**
  - **Org1MSP:** `peer0.org1.honeychain.local:7051`
  - **OrdererOrg:** `orderer.honeychain.local:7050`
- **Chaincode ID:** `honeychain` (Version: `1.1`, Sequence: `1`)
- **Endorsement Policy:** `OR('Org1MSP.peer')`

### 2.2 Client Gateway & Cryptographic Signing
- **SDK:** `@hyperledger/fabric-gateway` (v1.12.1)
- **Transport Security:** Mutual TLS using gRPC (`@grpc/grpc-js`) with `grpc.ssl_target_name_override: peer0.org1.honeychain.local`
- **Identity:** `Admin@org1.honeychain.local` (X.509 certificate)
- **Key Cryptography:** ECDSA on NIST P-256 curve (`secp256r1`) signed via `@noble/curves/nist.js` with DER formatting and low-S normalization.

### 2.3 Ledger Asset Data Models & Key Namespaces
1. **Hive Asset:**
   - **Key:** `HIVE_{hiveId}`
   - **Fields:** `docType: "Hive"`, `hiveId: string`, `beekeeperId: string`, `location: Location | string`, `installationDate: string`, `status: "NORMAL" | "WARNING" | "CRITICAL"`, `createdAt: string`, `updatedAt: string`
2. **Harvest Asset:**
   - **Key:** `HARVEST_{harvestId}`
   - **Fields:** `docType: "Harvest"`, `harvestId: string`, `hiveId: string`, `beekeeperId: string`, `harvestDate: string`, `quantity: number`, `unit: "kg"`, `location: string`, `evidenceRef: string`, `createdAt: string`
3. **Batch Asset:**
   - **Key:** `BATCH_{batchId}` (Validation Regex: `/^HC-\d{4}-\d{4}$/`)
   - **Fields:** `docType: "Batch"`, `batchId: string`, `harvestId: string`, `hiveId: string`, `beekeeperId: string`, `quantity: number`, `unit: "kg"`, `origin: string`, `status: "CREATED" | "PROCESSING" | "IN_TRANSIT" | "PACKAGED" | "VERIFIED" | "SUSPICIOUS"`, `events: ProvenanceEvent[]`, `verification: { status: string, reasons: string[], disclaimer: string }`, `createdAt: string`, `updatedAt: string`
4. **Provenance Event Object:**
   - **Fields:** `eventId: string`, `eventType: "PROCESSING" | "TRANSPORT" | "PACKAGING" | "CERTIFICATION"`, `actorId: string`, `timestamp: string`, `details: Record<string, unknown>`, `evidenceRef?: string`

### 2.4 Smart Contract Transactions (`HoneyChainContract`)
- `registerHive(hiveJson: string): Promise<string>`
- `createHarvest(harvestJson: string): Promise<string>`
- `createBatch(batchJson: string): Promise<string>`
- `addEvent(batchId: string, eventJson: string): Promise<string>`
- `addProcessingEvent(batchId: string, eventJson: string): Promise<string>`
- `addTransportEvent(batchId: string, eventJson: string): Promise<string>`
- `addPackagingEvent(batchId: string, eventJson: string): Promise<string>`
- `addQualityTest(batchId: string, testJson: string): Promise<string>`
- `getBatch(batchId: string): Promise<string>`
- `getBatchHistory(batchId: string): Promise<string>` (Iterates Fabric Key History to return full mutation trail with Transaction IDs)
- `verifyBatch(batchId: string): Promise<string>`

---

## 3. POSTGRESQL DATABASE SCHEMA & INDEXING

### 3.1 Relational Architecture (`backend/src/db/schema.sql`)
```sql
CREATE TABLE organizations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    organization_id VARCHAR(50) REFERENCES organizations(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hives (
    id VARCHAR(50) PRIMARY KEY,
    beekeeper_id VARCHAR(50) REFERENCES organizations(id),
    apiary_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    installed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    health_status VARCHAR(50) DEFAULT 'NORMAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE telemetry (
    id BIGSERIAL PRIMARY KEY,
    hive_id VARCHAR(50) REFERENCES hives(id),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    temperature DECIMAL(5, 2) NOT NULL,
    humidity DECIMAL(5, 2) NOT NULL,
    weight DECIMAL(6, 2) NOT NULL,
    bee_activity DECIMAL(5, 2) NOT NULL,
    ambient_temp DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE batches (
    id VARCHAR(50) PRIMARY KEY,
    harvest_id VARCHAR(50),
    hive_id VARCHAR(50) REFERENCES hives(id),
    beekeeper_id VARCHAR(50) REFERENCES organizations(id),
    quantity DECIMAL(8, 2) NOT NULL,
    origin TEXT NOT NULL,
    floral_source VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    current_custodian VARCHAR(255),
    custodian_role VARCHAR(50),
    blockchain_tx_id VARCHAR(255),
    blockchain_status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE processing_events (
    id VARCHAR(50) PRIMARY KEY,
    batch_id VARCHAR(50) REFERENCES batches(id),
    processor_id VARCHAR(50) REFERENCES organizations(id),
    processor_name VARCHAR(255),
    event_type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transport_events (
    id VARCHAR(50) PRIMARY KEY,
    batch_id VARCHAR(50) REFERENCES batches(id),
    transporter_id VARCHAR(50) REFERENCES organizations(id),
    transporter_name VARCHAR(255),
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    vehicle_number VARCHAR(100),
    temperature DECIMAL(5, 2),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE packaging_events (
    id VARCHAR(50) PRIMARY KEY,
    batch_id VARCHAR(50) REFERENCES batches(id),
    packager_id VARCHAR(50) REFERENCES organizations(id),
    packaging_facility VARCHAR(255),
    units_packed INTEGER NOT NULL,
    unit_volume_ml INTEGER NOT NULL,
    packaging_type VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quality_tests (
    id VARCHAR(50) PRIMARY KEY,
    batch_id VARCHAR(50) REFERENCES batches(id),
    lab_id VARCHAR(50) REFERENCES organizations(id),
    lab_name VARCHAR(255),
    test_type VARCHAR(100) NOT NULL,
    moisture_percentage DECIMAL(5, 2),
    sucrose_percentage DECIMAL(5, 2),
    fructose_glucose_ratio DECIMAL(5, 2),
    hmf_content DECIMAL(6, 2),
    pollen_count INTEGER,
    c4_sugar_adulteration BOOLEAN DEFAULT FALSE,
    result VARCHAR(50) NOT NULL,
    tested_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id VARCHAR(50) NOT NULL,
    actor_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    organization_id VARCHAR(50),
    organization_name VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    result VARCHAR(50) NOT NULL,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 Performance Indexes
- `CREATE INDEX idx_telemetry_hive_time ON telemetry(hive_id, timestamp DESC);`
- `CREATE INDEX idx_batches_status ON batches(status);`
- `CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);`

---

## 4. AI / ML ENGINE & CALIBRATION SPECIFICATION

### 4.1 Model Architecture & Training Set
- **Algorithm:** `sklearn.ensemble.IsolationForest`
- **Training Artifact:** `ai/models/hive_anomaly.joblib` (2.46 MB)
- **Metadata:** `ai/models/metadata.json`
- **Calibration Dataset:** 16,948 aligned HOBOS (Honeybee Online Studies) sensor telemetry rows.
- **Contamination Rate:** `0.05` (5%)
- **Estimators (`n_estimators`):** `100`
- **Random State Seed:** `42`

### 4.2 Feature Vector Representation
1. `temperature`: Core brood temperature ($^\circ\text{C}$)
2. `humidity`: Internal relative humidity ($\%$)
3. `weight`: Hive gross mass ($\text{kg}$)
4. `bee_activity`: Foraging entrance flux rate (normalized frequency / count)
5. `temp_rolling_std_6h`: 6-hour temperature thermal variance
6. `weight_delta_24h`: 24-hour weight drift (nectar flow vs consumption)

### 4.3 Baseline Ranges & Feature Deviation Thresholds
- **Normal Brood Temperature:** $32.0^\circ\text{C} - 36.5^\circ\text{C}$ (Optimal: $34.5^\circ\text{C}$)
- **Normal Internal Humidity:** $45\% - 75\%$
- **Normal Hive Weight:** $20.0\,\text{kg} - 90.0\,\text{kg}$
- **Normal Activity Index:** $\ge 0.40$ (Active foraging window)

### 4.4 Health Score Formula & Explainability Attribution
$$\text{Score} = \text{clamp}\left(100 - (|\Delta T| \times 4.0 + |\Delta H| \times 0.6 + \text{anomaly\_penalty}), 0, 100\right)$$
- If `decision_function < -0.15` $\rightarrow$ Severity: `CRITICAL`
- If `decision_function < 0.0` $\rightarrow$ Severity: `HIGH`
- If `decision_function < 0.08` $\rightarrow$ Severity: `MEDIUM`

### 4.5 AI API Endpoints (FastAPI `8000`)
- `GET /health-check` $\rightarrow$ Service status, model load status, model version.
- `POST /api/v1/anomaly/detect` $\rightarrow$ Accepts telemetry array; returns `is_anomaly: bool`, `anomaly_score: float`, `severity: str`, `reasons: str[]`.
- `POST /api/v1/health/score` $\rightarrow$ Computes continuous health index $[0-100]$ and categorical state.
- `POST /api/v1/provenance/check` $\rightarrow$ Cross-references blockchain harvest yields against physical hive weight curves.

---

## 5. BACKEND REST API & SERVICE LAYER

### 5.1 Authentication & RBAC Matrix
- **Mechanism:** Bearer Header Token (`Authorization: Bearer <ROLE_OR_JWT>`)
- **Roles:**
  - `ADMIN`: Global access, system health, audit log viewing, exception overrides.
  - `BEEKEEPER`: Hive registration, harvest recording, batch creation (`createBatch`).
  - `PROCESSOR`: Batch intake, thermal filtration, moisture extraction event recording.
  - `TRANSPORTER`: Transport dispatch, GPS waypoint logging, cold-chain temperature submission.
  - `PACKAGER`: Packaging event submission, unit count validation, passport QR publishing.
  - `QUALITY_LAB`: NABL lab assay submission (C4 sugar, HMF, moisture, sucrose, pollen).
  - `CONSUMER`: Read-only access to `/api/passport/:batchId`.

### 5.2 Complete Endpoint Index (`backend/src/routes/`)

```text
/api/auth
  ├── GET  /me               -> Current authenticated session user & role
  ├── GET  /users            -> User directory
  └── GET  /organizations    -> Enrolled supply chain organizations

/api/hives
  ├── GET  /                 -> List all registered hives
  ├── POST /                 -> Register new hive (DB + Fabric)
  ├── GET  /:id              -> Get hive by ID with recent telemetry
  ├── GET  /:id/health       -> Current AI health score
  └── GET  /:id/anomalies    -> Current AI anomaly detection inference

/api/telemetry
  ├── POST /                 -> Ingest IoT telemetry record
  └── GET  /latest           -> Query latest telemetry per hive

/api/batches
  ├── GET  /                 -> List all batches with relational aggregates
  ├── POST /                 -> Create batch and invoke Fabric 'createBatch'
  ├── GET  /:id              -> Single batch detail
  ├── GET  /:id/timeline     -> Aggregated timeline (DB events + Fabric TX history)
  ├── POST /:id/intake       -> Record processor intake
  ├── POST /:id/processing   -> Record processing event (DB + Fabric 'addProcessingEvent')
  ├── POST /:id/transport    -> Record transport event (DB + Fabric 'addTransportEvent')
  ├── POST /:id/packaging    -> Record packaging event (DB + Fabric 'addPackagingEvent')
  └── POST /:id/publish      -> Publish digital passport

/api/quality
  ├── POST /tests            -> Submit lab assay report
  └── GET  /tests/:batchId   -> Fetch lab test results for batch

/api/passport
  └── GET  /:batchId         -> Public Digital Honey Passport payload

/api/provenance
  └── POST /check            -> Consistency check between blockchain ledger & physical evidence

/api/admin
  ├── GET  /overview         -> Aggregated metrics (active hives, batches, anomalies)
  ├── GET  /health           -> Full system health probe (DB, AI, Fabric, Backend)
  ├── GET  /audit            -> Immutable operational audit logs
  └── GET  /exceptions       -> Flagged suspicious batches and anomaly alerts
```

---

## 6. FRONTEND APPLICATION ARCHITECTURE

### 6.1 Design Tokens & Palette (Strict Warm Light Theme - No Neon)
- **Background Base:** Linen / Parchment (`#FAF8F5`)
- **Card Background:** Pure Warm White (`#FFFFFF`) with borders (`#EAE3D9`)
- **Primary Brand Amber:** Amber 700/800 (`#B45309` / `#92400E`)
- **Secondary Accent:** Honey Gold (`#F59E0B`), Terracotta (`#C2410C`)
- **Text:** Deep Stone 900 (`#1C1917`), Muted Stone 600 (`#57534E`)
- **State Badges:** Soft Emerald (`#ECFDF5`), Soft Amber (`#FFFBEB`), Soft Rose (`#FFF1F2`)

### 6.2 Component Hierarchy & Routing (`frontend/src/`)
- **`App.tsx`:** Root component managing tab state and passport deep-linking.
- **`components/Navbar.tsx`:** Persona switcher, batch search input, status indicator.
- **`components/Sidebar.tsx`:** Live Demo launcher (`🎬 Live Demo`), participant workspaces, explorer shortcuts.
- **`context/AuthContext.tsx`:** Persona context with mock user persistence and credential switching.
- **`pages/LiveDemoPage.tsx`:** Step-by-step unmocked pipeline orchestrator:
  - Step 1: Hive Selection / Registration
  - Step 2: Telemetry Ingestion (Normal 34.2°C vs Spike 41.8°C)
  - Step 3: AI Model Inference (`IsolationForest` evaluation)
  - Step 4: Harvest Batch Creation (`HC-YYYY-NNNN`)
  - Step 5: Fabric Gateway Blockchain Confirmation
  - Step 6: Thermal Extraction Processing
  - Step 7: Cold-Chain Logistics Transit
  - Step 8: Food-Grade Packaging & Passport Publish
  - Step 9: Fabric Ledger Verification & Consistency Check
  - Step 10: QR Code Generation & Passport Viewer
  - Live System Health Probe Bar (Backend 5000, AI 8000, PostgreSQL 5432, Fabric Gateway 7051)
  - Real-time Activity Event Log stream.

---

## 7. DIGITAL HONEY PASSPORT SPECIFICATION

### 7.1 QR Code Format
- **Encoding Target:** URL / path `https://honeychain.org/passport/{batchId}` (or `/passport/{batchId}`)
- **Constraint:** Encodes only the identifier URL; does **not** dump entire JSON provenance into QR bitmap.

### 7.2 Three-Pillar Trust Model
1. **Blockchain Custody (Hyperledger Fabric):**
   - Verifies tamper-evident chronological event signatures from Beekeeper $\rightarrow$ Processor $\rightarrow$ Transporter $\rightarrow$ Packager.
   - Disclaimer: *Blockchain verifies recorded chain-of-custody; it does not physical purity.*
2. **AI Telemetry Consistency (`IsolationForest`):**
   - Validates that reported yield corresponds with observed hive weight curves and brood temperatures.
3. **NABL Chemical Laboratory Assay:**
   - C4 Sugar Adulteration Test (Negative / Positive)
   - Moisture content ($\le 20\%$)
   - Hydroxymethylfurfural (HMF) ($\le 40\,\text{mg/kg}$)
   - Fructose/Glucose Ratio ($> 0.95$)
   - Pollen spectrum floral authentication.

---

## 8. ENVIRONMENT VARIABLES & RUNTIME CONFIGURATION

### Backend (`backend/.env`)
```ini
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=honeychain
DB_USER=postgres
DB_PASSWORD=postgres
AI_SERVICE_URL=http://127.0.0.1:8000
FABRIC_CHANNEL=honeychannel
FABRIC_CHAINCODE=honeychain
FABRIC_MSP_ID=Org1MSP
FABRIC_PEER_ENDPOINT=localhost:7051
FABRIC_PEER_HOST_ALIAS=peer0.org1.honeychain.local
```

### AI Engine (`ai/.env`)
```ini
PORT=8000
HOST=127.0.0.1
MODEL_PATH=models/hive_anomaly.joblib
METADATA_PATH=models/metadata.json
CONTAMINATION_RATE=0.05
```

### Frontend (`frontend/.env`)
```ini
VITE_API_URL=http://localhost:5000/api
VITE_AI_URL=http://127.0.0.1:8000
```
