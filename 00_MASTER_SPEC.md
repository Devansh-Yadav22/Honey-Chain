# 00 — MASTER SPEC
# Bee-Tech | Honey Chain
## SIH 2026 — SIH26021

> **Status:** Phase 1 Prototype — 48-hour build  
> **Team:** Bee-Tech  
> **Problem Statement:** SIH26021 — Honey Chain  
> **Document Role:** Single source of truth for product, architecture, APIs, data models, AI, blockchain, frontend, implementation status, known bugs, decisions, and future scope.

---

# 1. PROJECT IDENTITY

## 1.1 Problem Statement
**SIH26021 — Honey Chain**

The SIH problem context identifies challenges around counterfeit honey, consumer trust, weak market linkages, limited traceability, and the need for advanced hive management. The expected direction includes blockchain-based traceability with QR-based consumer authentication, IoT hive monitoring, AI analytics for disease/colony health/productivity, and scalability across rural beekeeping clusters.

## 1.2 Team
**Bee-Tech**

## 1.3 Product
**Honey Chain**

## 1.4 One-line Product Definition
A blockchain-backed honey traceability and smart beekeeping platform connecting hive intelligence, batch provenance, evidence-based consistency checking, and consumer verification.

## 1.5 Core USP

Honey Chain uses **permissioned blockchain as a shared trust and provenance layer** across participants who may not fully trust one another, while AI and hive telemetry provide evidence that can be checked against recorded provenance.

### Core message

> **Blockchain preserves what was recorded. AI checks whether the recorded journey is consistent with available evidence.**

The USP is therefore **not simply "we use blockchain."**

The USP is the combination of:

```text
PERMISSIONED TRUST
        +
HIVE INTELLIGENCE
        +
PROVENANCE
        +
EVIDENCE
        +
CONSUMER VERIFICATION
```

## 1.6 Accuracy Constraint

Honey Chain must **not** claim that blockchain itself proves honey purity or prevents adulteration.

Blockchain provides tamper-evident provenance/history for recorded events. Honey quality/authenticity requires appropriate quality data, laboratory testing, certification, or other evidence.

AI can identify anomalies and inconsistencies. It must not be presented as an absolute proof of physical honey purity.

---

# 2. SOURCE OF TRUTH

This file is the project's primary source of truth.

## 2.1 Rules

Before making a significant technical or product decision:

1. Check this document.
2. Check the existing implementation in GitHub.
3. Do not silently change an established architecture or contract.
4. Record material decisions in the Decision Log.
5. Update Current Implementation Status when work is completed.
6. Record known bugs instead of hiding them.
7. Clearly distinguish Phase 1 from future scope.

If a proposal conflicts with this specification, explicitly flag the conflict.

## 2.2 Source-of-truth hierarchy

```text
1. 00_MASTER_SPEC.md
2. Current GitHub implementation
3. MASTER chat decisions
4. AI / BLOCKCHAIN / FULLSTACK chat discussions
5. New AI suggestions
```

If a specialized chat conflicts with this specification, the specification wins until the decision is formally changed.

---

# 3. AI COLLABORATION STRUCTURE

The shared ChatGPT Project contains exactly four primary conversations.

```text
🐝 Bee-Tech — Honey Chain | SIH26021

├── 🧠 MASTER
├── 🤖 AI
├── ⛓️ BLOCKCHAIN
└── 💻 FULLSTACK
```

## 3.1 MASTER

The command center for:

- overall architecture
- cross-team decisions
- integration planning
- conflict resolution
- scope control
- Master Spec updates
- project status
- demo strategy
- PPT/pitch decisions
- cross-component debugging

### Rule

If a decision affects more than one technical stream, discuss it in MASTER.

---

## 3.2 AI

Responsible for:

- IoT simulator
- synthetic/realistic telemetry data
- hive health scoring
- anomaly detection
- productivity/yield intelligence
- provenance consistency engine
- AI service/API
- model development
- AI testing and debugging

---

## 3.3 BLOCKCHAIN

Responsible for:

- Hyperledger Fabric
- Fabric CA/MSP
- organizations
- channels
- chaincode
- ledger assets
- provenance events
- blockchain verification
- transaction history
- blockchain service interface
- Fabric integration

---

## 3.4 FULLSTACK

Responsible for:

- React frontend
- TypeScript
- Node.js/Express backend
- PostgreSQL
- REST APIs
- dashboard
- hive screens
- batch screens
- QR
- Honey Passport
- AI integration
- blockchain integration
- final end-to-end integration

**FULLSTACK is the integration lead.**

---

## 3.5 Cross-chat rule

No specialized chat may independently make a major architectural or cross-component contract change.

Examples requiring MASTER discussion:

- changing blockchain technology
- changing database
- changing API contracts
- changing Batch schema
- changing telemetry schema
- changing core user flow
- removing a P0 feature
- introducing a major new infrastructure dependency

---

# 4. PROBLEM CONTEXT

Honey Chain addresses the traceability and trust challenges surrounding honey and smart beekeeping.

Core problem areas:

- counterfeit/adulterated honey and consumer trust concerns
- weak traceability across the honey journey
- fragmented records between beekeepers, processors, transporters and packagers
- limited visibility into hive conditions
- limited hive-management intelligence
- weak market/consumer linkage
- difficulty verifying whether recorded provenance is consistent with available evidence

Honey Chain combines these capabilities rather than treating hive monitoring and supply-chain traceability as isolated systems.

---

# 5. SOLUTION VISION

Honey Chain creates a digital chain of trust:

```text
HIVE
  ↓
IoT / Simulated Telemetry
  ↓
AI Hive Intelligence
  ↓
HARVEST
  ↓
HONEY BATCH
  ↓
PROCESSING
  ↓
TRANSPORT
  ↓
PACKAGING
  ↓
PERMISSIONED BLOCKCHAIN
  ↓
QR HONEY PASSPORT
  ↓
CONSUMER
```

A parallel evidence path evaluates provenance consistency:

```text
Blockchain Record
       +
IoT / GPS / Timestamp / Quantity / Quality Evidence
       ↓
Provenance Consistency Engine
       ↓
Score + Explanation
       ↓
VERIFIED / SUSPICIOUS
```

---

# 6. CORE PRODUCT MODULES

## 6.1 Hive Intelligence

Tracks simulated hive telemetry:

- temperature
- humidity
- hive weight
- bee activity
- timestamp
- hive identity
- location

Provides:

- health score
- health status
- anomaly alerts
- telemetry trends
- productivity intelligence

---

## 6.2 Honey Traceability

Tracks the honey journey:

```text
Hive
 ↓
Harvest
 ↓
Batch
 ↓
Processing
 ↓
Transport
 ↓
Packaging
```

---

## 6.3 Blockchain Trust Layer

Hyperledger Fabric records important provenance events and provides a tamper-evident history.

---

## 6.4 Provenance Consistency Engine

Compares recorded provenance against available evidence.

Example:

```text
Recorded harvest: 18 kg
Observed/evidence quantity: 18 kg
        ↓
VERIFIED
```

Versus:

```text
Recorded harvest: 18 kg
Observed/evidence quantity: 31 kg
        ↓
SUSPICIOUS
```

---

## 6.5 Honey Passport

QR-based consumer interface showing understandable provenance and verification information.

---

# 7. PHASE 1 — 48-HOUR PROTOTYPE

## 7.1 Goal

The prototype must prove the complete concept without waiting for physical IoT hardware.

## 7.2 Must-have capabilities

- Hive registration
- simulated IoT telemetry
- telemetry ingestion
- hive dashboard
- health scoring
- anomaly detection
- harvest recording
- honey batch creation
- processing event
- transport event
- packaging event
- Hyperledger Fabric provenance
- blockchain verification
- blockchain history
- QR generation
- Honey Passport
- provenance consistency checking
- suspicious-batch demonstration

## 7.3 First vertical milestone

> **ONE HIVE → ONE HARVEST → ONE BATCH → ONE BLOCKCHAIN RECORD → ONE QR HONEY PASSPORT**

This must work before expanding to multiple entities.

---

# 8. PHASE 1 PRIORITIES

## P0 — Critical

- end-to-end integration
- Hyperledger Fabric working transaction
- hive telemetry
- AI health/anomaly
- batch provenance
- QR Honey Passport
- provenance consistency engine

## P1 — Important

- processing timeline
- transport timeline
- packaging timeline
- dashboard analytics
- blockchain history visualization
- multiple demo hives/batches
- polished UI
- seeded demo data
- demo mode

## P2 — Simplify if deadline pressure appears

- sophisticated authentication
- advanced analytics
- sophisticated yield prediction
- elaborate admin features

---

# 9. NOT A PHASE 1 BLOCKER

The following remain part of the larger product vision but must not block the 48-hour prototype:

- physical IoT sensors
- Raspberry Pi / edge infrastructure
- separate Edge/Gateway architecture layer
- MQTT/Kafka unless later proven necessary
- public Ethereum/Polygon blockchain
- advanced mobile application
- production-grade authentication/authorization
- complex microservices infrastructure
- large-scale cloud orchestration
- advanced disease-detection model
- storing raw telemetry directly on-chain

---

# 10. SYSTEM ARCHITECTURE

```text
┌──────────────────────────────┐
│       HIVE MONITORING        │
│ Simulated IoT Telemetry      │
│ Temperature / Humidity       │
│ Weight / Bee Activity        │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│       AI INTELLIGENCE        │
│ Health Score                 │
│ Anomaly Detection            │
│ Productivity Intelligence    │
│ Provenance Consistency       │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│      HONEY CHAIN PLATFORM    │
│ React + Node/Express         │
│ Database + REST API          │
│ QR / Honey Passport          │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│      HYPERLEDGER FABRIC      │
│ Permissioned Provenance      │
│ Batch + Events + History     │
└──────────────┬───────────────┘
               ↓
        QR HONEY PASSPORT
               ↓
           CONSUMER
```

---

# 11. ARCHITECTURAL PRINCIPLES

1. Hyperledger Fabric is the intended blockchain.
2. Blockchain is the shared trust/provenance layer.
3. Raw high-volume telemetry remains off-chain.
4. AI is the intelligence/evidence-analysis layer.
5. Backend/API is the integration layer.
6. Frontend must not directly depend on Fabric implementation details.
7. Simulated IoT must use the same conceptual ingestion interface that future real sensors can use.
8. No separate Edge/Gateway layer in Phase 1.
9. Consumers should not need to understand blockchain internals.
10. Every suspicious result should have an explanation.
11. Do not use unsupported claims or fake performance metrics.
12. Keep components modular but integrate them vertically.

---

# 12. TECHNOLOGY STACK

## Frontend

- React
- TypeScript
- Tailwind CSS or existing project styling
- charting library where useful

## Backend

- Node.js
- TypeScript
- Express

## Database

- PostgreSQL preferred
- SQLite acceptable only if PostgreSQL setup threatens the deadline

## Blockchain

- Hyperledger Fabric
- Fabric CA / MSP
- Fabric channels/private data capabilities where required
- Node.js/TypeScript chaincode

## AI

- Python
- FastAPI
- scikit-learn / PyTorch / other appropriate libraries

## IoT

- Phase 1: simulated telemetry
- Future: ESP32 or equivalent sensors

## Deployment

- Docker
- Docker Compose where practical

## Communication

- REST APIs initially

Do not add infrastructure without a clear reason.

---

# 13. REPOSITORY STRUCTURE

```text
honey-chain/
│
├── README.md
├── 00_MASTER_SPEC.md
├── docker-compose.yml
├── .env.example
├── .gitignore
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── decisions/
│
├── frontend/
├── backend/
├── ai/
├── blockchain/
├── iot/
├── data/
└── tests/
```

---

# 14. GIT COLLABORATION

## Branches

```text
main

feature/fullstack/*
feature/ai/*
feature/blockchain/*
```

Do not push experimental work directly to `main`.

## Workflow

```text
Implement
   ↓
Test
   ↓
Commit
   ↓
Push branch
   ↓
Pull Request
   ↓
Review
   ↓
Merge
```

## Commit convention

```text
feat: add telemetry endpoint
feat: implement batch chaincode
feat: add hive health model
fix: correct batch verification
docs: update master spec
refactor: simplify blockchain service
```

---

# 15. DATA MODEL

## 15.1 Beekeeper

```text
beekeeperId
name
contact
location
createdAt
```

## 15.2 Hive

```text
hiveId
beekeeperId
location
installationDate
status
```

## 15.3 Telemetry

```text
telemetryId
hiveId
timestamp
temperature
humidity
weight
activity
```

## 15.4 Harvest

```text
harvestId
hiveId
beekeeperId
harvestDate
quantity
location
```

## 15.5 Batch

```text
batchId
harvestId
quantity
origin
createdAt
status
```

## 15.6 ProcessingEvent

```text
eventId
batchId
processorId
timestamp
eventType
details
```

## 15.7 TransportEvent

```text
eventId
batchId
transporterId
source
destination
timestamp
```

## 15.8 PackagingEvent

```text
eventId
batchId
packagerId
packagingDate
productId
```

## 15.9 Certification

```text
certificationId
batchId
authority
certificateType
issuedAt
status
```

---

# 16. TELEMETRY CONTRACT

## Request

```json
{
  "hiveId": "HIVE-042",
  "beekeeperId": "BK-007",
  "location": {
    "lat": 28.6139,
    "lng": 77.2090
  },
  "telemetry": {
    "temperature": 34.2,
    "humidity": 61.0,
    "weight": 42.7,
    "activity": 0.84
  },
  "timestamp": "2026-09-02T18:30:00Z"
}
```

## Fields

| Field | Type | Meaning |
|---|---|---|
| hiveId | string | Unique hive |
| beekeeperId | string | Owner |
| location.lat | number | Latitude |
| location.lng | number | Longitude |
| temperature | number | Hive temperature |
| humidity | number | Relative humidity |
| weight | number | Hive weight |
| activity | number | Normalized bee activity |
| timestamp | ISO string | Observation time |

---

# 17. AI CONTRACTS

## 17.1 Health

### Endpoint

```http
POST /ai/health
```

### Output

```json
{
  "health": "NORMAL",
  "healthScore": 91
}
```

Possible states:

```text
NORMAL
WARNING
CRITICAL
```

---

## 17.2 Anomaly

### Endpoint

```http
POST /ai/anomaly
```

### Output

```json
{
  "anomaly": true,
  "severity": "HIGH",
  "reasons": [
    "Abnormal temperature",
    "High humidity",
    "Sudden weight change",
    "Reduced bee activity"
  ]
}
```

---

## 17.3 Productivity / Yield

### Endpoint

```http
POST /ai/yield
```

### Example

```json
{
  "predictedYieldKg": 18.4,
  "confidence": 0.82
}
```

This is secondary to anomaly detection and provenance consistency.

---

## 17.4 Provenance Consistency

### Endpoint

```http
POST /api/provenance/check
```

### Input

```json
{
  "batchId": "HC-2026-0001",
  "blockchainHarvestQuantity": 18,
  "observedQuantity": 18
}
```

### Verified

```json
{
  "status": "VERIFIED",
  "consistencyScore": 0.96,
  "anomalies": []
}
```

### Suspicious

```json
{
  "status": "SUSPICIOUS",
  "consistencyScore": 0.21,
  "anomalies": [
    "Recorded quantity inconsistent with available evidence"
  ]
}
```

---

# 18. BACKEND API

## Hive

```http
POST /api/hives
GET /api/hives
GET /api/hives/:id
```

## Telemetry

```http
POST /api/telemetry
GET /api/hives/:id/telemetry
```

## AI

```http
GET /api/hives/:id/health
GET /api/hives/:id/anomalies
GET /api/hives/:id/productivity
POST /api/provenance/check
```

## Batch

```http
POST /api/batches
GET /api/batches
GET /api/batches/:id
GET /api/batches/:id/timeline
```

## Passport

```http
GET /api/passport/:batchId
```

---

# 19. BLOCKCHAIN SERVICE INTERFACE

Backend interacts with Fabric through a service abstraction.

```text
registerHive()
createHarvest()
createBatch()
addProcessingEvent()
addTransportEvent()
addPackagingEvent()
getBatch()
getBatchHistory()
verifyBatch()
```

The frontend must not directly implement Fabric transaction logic.

---

# 20. BLOCKCHAIN ASSETS

Core ledger assets:

```text
Beekeeper
Hive
Harvest
Batch
ProcessingEvent
TransportEvent
PackagingEvent
Certification
```

## Batch ID

Recommended format:

```text
HC-YYYY-NNNN
```

Example:

```text
HC-2026-0001
```

Once integrated, the format should remain stable.

---

# 21. CHAINCODE FUNCTIONS

## Minimum

```text
registerHive()
createHarvest()
createBatch()
addEvent()
getBatch()
getBatchHistory()
verifyBatch()
```

## Expanded

```text
addProcessingEvent()
addTransportEvent()
addPackagingEvent()
```

`verifyBatch()` verifies the recorded provenance/history and ledger state. It does not independently prove honey purity.

---

# 22. ON-CHAIN VS OFF-CHAIN

## On-chain

- hive/batch identifiers
- harvest records
- provenance events
- timestamps
- actor/organization references
- relevant quantities
- hashes/references to external evidence where appropriate
- verification-relevant metadata

## Off-chain

- raw telemetry streams
- large datasets
- AI model files
- images/video
- high-volume sensor history
- application logs

Blockchain is an integrity/provenance layer, not a telemetry database.

---

# 23. IOT SIMULATOR

Phase 1 uses simulated telemetry.

Generate realistic time-series data for:

```text
temperature
humidity
weight
bee activity
timestamp
hiveId
location
```

## Normal scenario

Values change gradually.

## Anomaly scenario

Create plausible deviations such as:

```text
high temperature
high humidity
sudden weight change
reduced activity
```

The simulator should be deterministic/reproducible enough for a live demo.

---

# 24. PROVENANCE CONSISTENCY ENGINE

This is one of the project's major differentiating features.

## Flow

```text
Recorded provenance
        +
Available evidence
        ↓
Consistency analysis
        ↓
Score + explanation
        ↓
VERIFIED / SUSPICIOUS
```

## Normal scenario

```text
Blockchain quantity: 18 kg
Observed/evidence quantity: ~18 kg

Result:
VERIFIED
High consistency
```

## Suspicious scenario

```text
Blockchain quantity: 18 kg
Observed/evidence quantity: 31 kg

Result:
SUSPICIOUS
Low consistency

Reason:
Quantity mismatch
```

The UI must show **why** a batch is suspicious.

---

# 25. HONEY PASSPORT

QR points to a consumer-facing batch page.

Example:

```text
/p/HC-2026-0001
```

Display:

```text
HONEY PASSPORT

Batch ID
Origin
Hive
Harvest date
Harvest quantity
Processing
Transport
Packaging

Blockchain verification
Provenance status
Consistency status
```

## Consumer language

```text
✓ Origin Recorded
✓ Harvest Recorded
✓ Processing Recorded
✓ Chain of Custody Recorded
✓ Blockchain History Verified
```

## Suspicious state

```text
⚠ PROVENANCE INCONSISTENCY

The recorded quantity does not match
available evidence.

Review recommended.
```

---

# 26. FRONTEND SCREENS

## 26.1 Dashboard

Show:

- total hives
- healthy hives
- alerts
- active batches
- verified batches
- suspicious batches
- recent alerts
- high-level telemetry/AI information

## 26.2 Hive Dashboard

Show:

- hive identity
- location
- temperature
- humidity
- weight
- bee activity
- health score
- health status
- telemetry graph
- anomaly history

## 26.3 Batch Page

Show:

```text
Hive
 ↓
Harvest
 ↓
Processing
 ↓
Transport
 ↓
Packaging
```

Also:

- batch status
- quantity
- verification
- blockchain transaction/history

## 26.4 Consumer Passport

Prioritize clarity and trust.

## 26.5 Admin / Operations

Only if time permits:

- manage hives
- view batches
- inspect alerts
- inspect provenance

---

# 27. DEMO DATA

Seed the prototype with enough entities for a convincing operational UI.

## Hives

```text
HIVE-001 — Healthy
HIVE-002 — Healthy
HIVE-003 — Warning
HIVE-004 — Healthy
HIVE-005 — Critical
```

## Batches

```text
HC-2026-0001 — Verified
HC-2026-0002 — Verified
HC-2026-0003 — Suspicious
```

At least one batch must be designed specifically for the suspicious-provenance demonstration.

---

# 28. DEMO STORY

## Step 1 — Start at the hive

Open `HIVE-001`.

Show telemetry and AI health.

## Step 2 — Harvest

Create a harvest from the hive.

## Step 3 — Create batch

Create:

```text
HC-2026-0001
```

## Step 4 — Supply chain

Record:

```text
Processing
Transport
Packaging
```

## Step 5 — Blockchain

Show provenance history.

## Step 6 — QR

Scan the batch QR and open Honey Passport.

## Step 7 — Suspicious scenario

Open another batch:

```text
Recorded quantity: 18 kg
Available evidence: 31 kg
```

System returns:

```text
SUSPICIOUS
```

Explain:

> **Blockchain preserves what was recorded. Our intelligence layer checks whether that record is consistent with the available evidence.**

---

# 29. DEVELOPMENT PLAN — 48 HOURS

## Hours 0–2 — Freeze the foundation

All three developers:

- GitHub repository
- project structure
- Master Spec
- database model
- API contracts
- telemetry schema
- blockchain asset model
- AI inputs/outputs
- demo story

No major architecture changes after this point without MASTER review.

## Hours 2–8

### Full Stack
- backend foundation
- database
- basic frontend
- hive dashboard

### AI
- IoT simulator
- dataset
- health/anomaly logic

### Blockchain
- Fabric network
- identities
- chaincode foundation

## Hours 8–12

First vertical integration:

```text
Hive
→ Telemetry
→ Backend
→ AI
→ Batch
→ Fabric
```

## Hours 12–18

- batch timeline
- processing
- transport
- packaging
- blockchain history
- AI integration

## Hours 18–22

- QR
- Honey Passport
- consumer verification

## Hours 22–26

- provenance consistency engine
- suspicious batch scenario

## Hours 26–30

- dashboard polish
- blockchain visualization
- alerts
- demo mode

## Hours 30–34

- end-to-end testing
- API fixes
- integration fixes

## Hours 34–38

- UI polish
- screenshots
- PPT evidence

## Hours 38–42

- failure testing
- demo fallback
- seeded data validation

## Hours 42–46

- presentation
- pitch
- rehearsal

## Hours 46–48

- bug fixes only
- freeze
- final demo rehearsal

---

# 30. DEFINITION OF DONE

```text
[ ] User can view a hive
[ ] Telemetry can be generated
[ ] Telemetry reaches backend
[ ] AI can produce a health result
[ ] AI can detect a designed anomaly
[ ] Harvest can be created
[ ] Batch can be created
[ ] Batch can be written to Fabric
[ ] Processing can be recorded
[ ] Transport can be recorded
[ ] Packaging can be recorded
[ ] Batch history can be retrieved
[ ] Batch can be verified
[ ] QR can be generated
[ ] QR opens Honey Passport
[ ] Consumer can see provenance
[ ] Provenance consistency can be evaluated
[ ] Suspicious batch can be demonstrated
[ ] All components work together
```

---

# 31. TESTING STRATEGY

## Unit testing

- API validation
- AI outputs
- chaincode functions
- data validation

## Integration testing

- simulator → backend
- backend → AI
- backend → blockchain
- backend → frontend

## End-to-end

```text
Hive
→ Telemetry
→ AI
→ Harvest
→ Batch
→ Blockchain
→ QR
→ Passport
```

## Failure tests

- malformed telemetry
- missing hive
- missing batch
- blockchain transaction failure
- AI service unavailable
- invalid QR/batch ID
- suspicious provenance

The UI should fail gracefully.

---

# 32. SECURITY & PRIVACY

## Phase 1

- do not expose private consortium information unnecessarily
- do not place raw telemetry on-chain
- use authorized Fabric identities
- keep secrets in environment variables
- never commit credentials
- validate API inputs
- separate consumer-visible information from private operational data

## Future

- stronger authentication
- authorization
- key management
- audit controls
- privacy policies
- production-grade identity management

---

# 33. OBSERVABILITY / DEBUGGING

Every service should make it possible to trace:

```text
Request received
↓
Data validated
↓
AI called
↓
Blockchain called
↓
Response returned
```

For blockchain transactions, preserve:

```text
batchId
operation
timestamp
transaction ID
success/failure
```

Never expose secrets in logs.

---

# 34. ENVIRONMENT VARIABLES

Expected pattern:

```text
NODE_ENV=
PORT=
DATABASE_URL=

AI_SERVICE_URL=

FABRIC_NETWORK=
FABRIC_CHANNEL=
FABRIC_CHAINCODE=
FABRIC_MSP_ID=
FABRIC_CERT_PATH=
FABRIC_KEY_PATH=
FABRIC_CONNECTION_PROFILE=
```

Actual names may be adjusted during implementation.

Secrets must remain outside source control.

---

# 35. UI/UX PRINCIPLES

- clean professional dashboard
- clear status indicators
- minimal cognitive load
- useful data visualization
- consumer-friendly language
- blockchain information without unnecessary complexity
- anomalies visually obvious
- suspicious provenance explains why
- no fake metrics
- no unsupported impact numbers

---

# 36. SIH PRESENTATION ALIGNMENT

The official SIH 2026 template requires a maximum of six slides including the title slide.

Required structure:

```text
1. Title Page
2. Idea Title
3. Technical Approach
4. Feasibility and Viability
5. Impact and Benefits
6. Research and References
```

The template emphasizes concise points, diagrams, infographics and pictures rather than paragraphs.

Honey Chain's presentation should prioritize:

- problem clarity
- solution flow
- technical architecture
- feasibility and risk mitigation
- stakeholder impact
- research/references
- working prototype evidence

---

# 37. CLAIMS POLICY

Never use impressive-looking numbers without evidence.

Avoid unsupported claims such as:

```text
"reduces adulteration by 80%"
"improves yield by 30%"
"10,000+ users"
"70% cost reduction"
```

Prefer defensible statements:

```text
Tamper-evident provenance
Evidence-based anomaly detection
QR-based consumer verification
Permissioned multi-party trust layer
Extensible IoT ingestion
```

---

# 38. RESEARCH / REFERENCE AREAS

Primary research areas:

- KVIC Honey Mission
- Ministry of MSME Honey Mission initiatives
- FSSAI honey standards and methods of analysis
- Hyperledger Fabric documentation
- smart beekeeping / hive monitoring research
- honey authentication / quality research
- IoT-based apiculture monitoring
- AI/ML time-series anomaly detection

Final presentation references must be real, relevant and accessible.

---

# 39. FUTURE ARCHITECTURE

```text
REAL HIVE SENSORS
        ↓
IoT Ingestion
        ↓
AI / Digital Twin
        ↓
Honey Chain Platform
        ↓
Permissioned Blockchain Consortium
        ↓
Processors / Transporters / Packagers
        ↓
Certification / Quality Evidence
        ↓
Consumer Honey Passport
```

Potential Phase 2 capabilities:

- real ESP32 telemetry
- advanced disease/colony health detection
- richer yield prediction
- laboratory test integration
- certificate verification
- multi-cluster deployment
- advanced privacy/private data collections
- offline synchronization
- mobile applications
- government/industry integrations
- production cloud scaling

---

# 40. DECISION LOG

## D-001 — Blockchain

**Decision:** Hyperledger Fabric  
**Reason:** Permissioned consortium architecture and privacy requirements.

## D-002 — IoT

**Decision:** Simulated telemetry for Phase 1  
**Reason:** Physical sensors are not available during the prototype build.

## D-003 — Edge/Gateway

**Decision:** No separate Edge/Gateway architecture layer in Phase 1.  
**Reason:** Unnecessary complexity for the current prototype.

## D-004 — AI Priority

**Decision:** Health/anomaly detection + provenance consistency first.  
**Reason:** High product value and strong demonstration potential within the deadline.

## D-005 — Raw Telemetry

**Decision:** Raw telemetry stays off-chain.  
**Reason:** High-volume sensor data belongs in application/database storage; blockchain stores provenance/events and integrity references.

## D-006 — Blockchain Claim

**Decision:** Do not claim blockchain proves purity/adulteration.  
**Reason:** Blockchain proves the integrity/history of recorded records, not physical product composition.

## D-007 — API Layer

**Decision:** Backend abstracts blockchain and AI services from frontend.  
**Reason:** Keeps components modular and allows implementation changes without rewriting the UI.

## D-008 — Collaboration Structure

**Decision:** Four shared ChatGPT Project chats: MASTER, AI, BLOCKCHAIN, FULLSTACK.  
**Reason:** Keeps collaboration simple while maintaining specialized AI workspaces.

## D-009 — Integration Ownership

**Decision:** Full Stack developer is Integration Lead.  
**Reason:** Frontend/backend naturally connects the AI and blockchain services into one demonstrable product.

---

# 41. CHANGE CONTROL

Before making a major change, record:

```text
Change:
Reason:
Impact:
Affected components:
Decision:
Date:
```

Major changes include:

- changing blockchain technology
- changing database
- changing API contracts
- changing asset model
- changing telemetry schema
- changing core user flow
- removing a P0 feature
- adding a major infrastructure dependency

---

# 42. CURRENT IMPLEMENTATION STATUS

## Foundation

- [ ] GitHub repository initialized
- [ ] folder structure created
- [ ] Master Spec committed
- [ ] environment template created
- [ ] API contract frozen
- [ ] database schema frozen

## Full Stack

- [ ] backend initialized
- [ ] database connected
- [ ] hive APIs
- [ ] telemetry APIs
- [ ] dashboard
- [ ] hive detail
- [ ] batch APIs
- [ ] batch timeline
- [ ] Honey Passport
- [ ] QR generation
- [ ] blockchain integration
- [ ] AI integration

## AI

- [ ] IoT simulator
- [ ] dataset
- [ ] health score
- [ ] anomaly detection
- [ ] AI API
- [ ] provenance consistency
- [ ] yield prediction

## Blockchain

- [ ] Fabric network
- [ ] identities/MSP
- [ ] channel
- [ ] chaincode
- [ ] Batch asset
- [ ] createBatch
- [ ] event recording
- [ ] history
- [ ] verification
- [ ] backend integration

## Integration

- [ ] Hive → telemetry
- [ ] telemetry → backend
- [ ] telemetry → AI
- [ ] AI → backend
- [ ] backend → blockchain
- [ ] batch → QR
- [ ] QR → Passport
- [ ] suspicious provenance demo

## Presentation

- [ ] Slide 1
- [ ] Slide 2
- [ ] Slide 3
- [ ] Slide 4
- [ ] Slide 5
- [ ] Slide 6
- [ ] screenshots
- [ ] PDF export
- [ ] final rehearsal

---

# 43. KNOWN BUGS

Maintain:

```text
BUG-ID:
Description:
Severity:
Affected component:
Reproduction:
Status:
Owner:
```

Current:

```text
None recorded yet.
```

---

# 44. OPEN QUESTIONS

Only unresolved questions that materially affect implementation should be recorded here.

```text
None currently blocking Phase 1.
```

---

# 45. FINAL PRODUCT PRINCIPLE

Honey Chain should feel like **one coherent product**, not three technologies placed next to one another.

```text
TRUST THE JOURNEY
        +
UNDERSTAND THE HIVE
        +
VERIFY THE EVIDENCE
```

Blockchain provides the shared provenance layer.

IoT provides operational evidence.

AI provides intelligence and consistency analysis.

The Honey Passport makes the result understandable to the consumer.

---

---

# 46. FINAL DEMO SENTENCE

> **Honey Chain doesn't just record where honey came from — it builds a verifiable digital journey from hive to consumer and checks whether that journey is consistent with the evidence available along the way.**

---

# 47. LIVE DEMO ARCHITECTURE & DEMONSTRATION WORKFLOW (SIH 2026)

## 47.1 Purpose
The **Live Demo** interface (`🎬 Live Demo`) is a top-level, interactive operator tool built specifically for SIH judges and evaluators to execute and visibly verify the end-to-end Honey Chain pipeline:
`Frontend → Backend API → AI Inference → PostgreSQL Database → Hyperledger Fabric → Provenance Verification → Honey Passport QR`.

> [!IMPORTANT]
> **Operator Tool Constraint:** Live Demo is strictly a demonstration controller and **not** a production role. It introduces **no** new roles into RBAC and leaves existing participant workflows (`ADMIN`, `BEEKEEPER`, `PROCESSOR`, `TRANSPORTER`, `PACKAGER`, `QUALITY_LAB`, `CONSUMER`) intact.

## 47.2 Frontend Route & Navigation
- **Navigation Item:** `🎬 Live Demo` (prominently accessible at top of sidebar and global views)
- **Tab State ID:** `live-demo`
- **Passport Deep Link:** Automatically redirects to `/passport/{batchId}` upon packaging completion.

## 47.3 Guided Demonstration Flow
1. **Demo Session Setup:** Generates session-isolated identifiers (e.g., `HC-DEMO-2026-XXXX`, `HIVE-DEMO-001`) to prevent overwriting production batches while executing identical business logic.
2. **Hive Selection / Registration:** Checks backend API (`/api/hives`) and registers or selects a demo apiary.
3. **Telemetry Ingestion:** Real telemetry payloads dispatched to `POST /api/telemetry` with realistic environmental metrics (Normal: 34.2°C, 61% RH vs. Anomaly: 41.8°C, 82% RH, sudden weight drop).
4. **Real AI ML Inference:** Evaluates telemetry using the backend `/api/ai/health` and `/api/ai/anomaly` endpoints backed by the trained `IsolationForest` ML model on port 8000. Displays real confidence scores and feature attribution reasons without hardcoding.
5. **Harvest Batch Creation:** Submits `POST /api/batches` with botanical origin, yield, and beekeeper metadata.
6. **Hyperledger Fabric Provenance Recording:** Backend invokes Fabric Gateway chaincode (`createBatch`), returning actual blockchain confirmation status.
7. **Processing Step:** Submits `POST /api/batches/:id/events` for thermal extraction / filtration.
8. **Transport Step:** Submits logistics transit event with GPS route and cold-chain temperature telemetry.
9. **Packaging Step:** Submits packaging facility verification and batch sealing event.
10. **Fabric Provenance Verification:** Calls `GET /api/batches/:id/verify-provenance` to validate blockchain-backed history against recorded sensor evidence and compute a consistency score.
11. **Digital Honey Passport & QR:** Renders digital passport QR encoding `/passport/{batchId}` for consumer trust verification.

## 47.4 Relationship with AI & Blockchain
- **AI Service:** Evaluates physical sensor evidence (`IsolationForest` anomaly detector & health score). If AI daemon on port 8000 is unreachable, the step displays real service unavailability rather than fabricated scores.
- **Hyperledger Fabric:** Records immutable lifecycle events in channel `honeychannel` via chaincode `honeychain`. If Fabric network is unreachable, transaction errors are surfaced transparently.

## 47.5 Data Isolation & Safety
- Demo operations use safe prefixes (`HIVE-DEMO-` and `HC-DEMO-`).
- Resetting the demo clears local session state only; it never wipes Fabric ledgers, peer volumes, or production database records.

## 47.6 Current Implementation Status
- [x] Live Demo Page (`frontend/src/pages/LiveDemoPage.tsx`) implemented and active.
- [x] Top-level navigation integration in `Sidebar.tsx` and `App.tsx`.
- [x] Real API client integration in `frontend/src/services/api.ts`.
- [x] PostgreSQL database container (`honeychain-db`) connected and operational.
- [x] AI ML service running and connected on `http://127.0.0.1:8000`.
- [x] Warm linen/stone UI styling with zero neon colors.

---

# 48. TIER 1 & TIER 2 PRODUCTION ENGINE SPECIFICATION

## 48.1 Overview & Architectural Objectives
The Tier 1 and Tier 2 production enhancements transition Honey Chain from a rapid prototype to an enterprise-grade, multi-tenant supply chain platform.

```text
  [ FRONTEND (Vite / React / Tailwind) ]
            │ (Bearer JWT / Fast-Switch Headers)
            ▼
  [ BACKEND REST API (Express / TypeScript) ]
      ├── Auth & RBAC Guard (Bcrypt / JWT Secret)
      ├── Multi-Tenancy Engine (Organizations Registry & Approval Queue)
      ├── Geolocation Engine (Haversine Formula & Browser GPS Capture)
      ├── Off-Chain Evidence Manager (Multer / SHA-256 Cryptographic Hashing)
      ├── Custody State Machine (Handoffs: Harvest -> Processing -> Transport -> Packaging -> Lab)
      ├── Consistency Engine (Geo-Distance, Quantity Drift, Time Ordering, AI Anomaly)
      └── System Health & Tamper-Evident Audit Logging
            │                         │
            ▼                         ▼
  [ POSTGRESQL 16 (honeychain-db) ]   [ HYPERLEDGER FABRIC (honeychannel) ]
  (Relational state & evidence meta)  (Immutable transactions & tx IDs)
```

## 48.2 Tier 1 Upgrades (Foundational Architecture)
1. **Real Authentication & Bcrypt Password Hashing:**
   - 10-round bcrypt password hashing with `DEMO_PASSWORD = 'HoneyChain@2026!'`.
   - Real signed JWT Bearer tokens (`AuthService.generateToken()`, 24-hour expiry).
   - Strict `authenticate`, `requireAuth`, `requireRoles`, and `requireTenant` middleware.
2. **Multi-Tenancy & Onboarding Queue:**
   - Full Organization entity with status lifecycle: `PENDING` $\rightarrow$ `ACTIVE` $\rightarrow$ `SUSPENDED` $\rightarrow$ `REJECTED`.
   - Admin approval queue in Operations Command Center.
3. **Browser Geolocation API Capture:**
   - Real-time `navigator.geolocation.getCurrentPosition` with latitude, longitude, and accuracy ($\pm$ meters) tracking.
   - Fallback manual coordinate inputs and persistence via `/api/locations`.
4. **Role-Specific Dashboards:**
   - Beekeeper Portal (IoT thermodynamics, GPS capture, harvest batch creation).
   - Processor Portal (intake receipt, temperature & moisture regulation, evidence hashing).
   - Transport Portal (waybills, route tracking, custody handoffs).
   - Packaging Portal (containerization, unit manifests, passport publication).
   - Quality Lab Portal (FSSAI/Codex compliance assays, certificate SHA-256 verification).
   - Operations Command Center (live health probes, onboarding queue, alerts, audit log).

## 48.3 Tier 2 Upgrades (Evidence, Custody & Consistency)
1. **Off-Chain Evidence Management with SHA-256:**
   - Raw binary storage in `uploads/evidence/` with 256-bit SHA-256 cryptographic verification (`EvidenceService.verifyIntegrity`).
   - Immutable metadata linkage to blockchain batch records.
2. **State Machine Chain-of-Custody Handoffs:**
   - Formal custody transfer protocol: `initiateHandoff` $\rightarrow$ `acceptHandoff` / `rejectHandoff` (with dispute reason).
   - Multi-tenant tenant verification preventing unauthorized custody claims.
3. **Comprehensive Consistency Verification Engine:**
   - **Geo-Distance / Speed Plausibility:** Haversine formula calculation flagging transit rates $> 500$ km/h.
   - **Quantity Drift:** Compares harvested vs packaged volume, flagging variations $> 5.0\%$.
   - **Timestamp Ordering:** Enforces strict chronological pipeline order ($T_{\text{harvest}} < T_{\text{proc}} < T_{\text{trans}} < T_{\text{pack}}$).
   - **AI Anomaly Correlation:** Flags batches where AI isolation forest anomaly score $> 0.70$.
4. **Application Security & Quality Alerts:**
   - Automated anomaly alerts generated by the Consistency Engine (`AlertService.createAlert`).
   - Administrative resolution with required audit notes (`AlertService.resolveAlert`).
5. **Tamper-Evident Audit Logging:**
   - Append-only audit trail logging user ID, action, resource, timestamp, and IP address.

## 48.4 Automated Test Suites
- `backend/src/test_tier1_auth_rbac.ts`: Multi-role login, JWT validation, organization onboarding approval (9/9 passed).
- `backend/src/test_tier2_consistency_evidence.ts`: SHA-256 hashing, Haversine distance, consistency evaluation, alerts lifecycle (5/5 passed).
- `backend/src/test_tier1_tier2_e2e.ts`: End-to-end multi-tenant pipeline integration test (15/15 passed).

---

# 49. PRODUCTION FIXES: QUANTITY CONSISTENCY & LAB CERTIFICATION

## 49.1 Bug 1: Multi-Stage Quantity Consistency Engine

### Problem
Previously, processing events did not evaluate input vs output quantity drift, and backend consistency checks could allow volume expansion to pass silently or flag legitimate extraction evaporation as an error.

### Architectural Solution
1. **Typed Known Fields:** Processing events explicitly track `inputWeightKg` and `outputWeightKg` alongside stage event parameters.
2. **Multi-Stage Physical Progression:**
   $$\text{Harvest} \longrightarrow \text{Batch} \longrightarrow \text{Processing Input/Output} \longrightarrow \text{Transport} \longrightarrow \text{Packaging}$$
3. **Plausibility & Loss Model:**
   - **Legitimate Processing Loss:** Output volume $\le$ previous stage volume with shrinkage up to 35% (e.g. $24.5\text{ kg} \rightarrow 23.5\text{ kg}$) is classified as normal processing yield reduction (`isLoss: true`, `status: VERIFIED`).
   - **Volume Inflation / Discrepancy:** Output volume exceeding previous stage volume without legitimate blending/source declaration (e.g. $24.5\text{ kg} \rightarrow 32.0\text{ kg}$, $24.5\text{ kg} \rightarrow 25.0\text{ kg}$) triggers a high-severity `QUANTITY_INCONSISTENCY` anomaly.
4. **Structured Anomaly Payload Contract:**
```json
{
  "code": "QUANTITY_INCONSISTENCY",
  "severity": "HIGH",
  "message": "Processing quantity (32 kg) exceeds recorded harvest/batch quantity (24.5 kg).",
  "expected": 24.5,
  "actual": 32,
  "difference": 7.5,
  "unit": "kg"
}
```
5. **System-Wide Surfacing:**
   - **Processor Portal:** Real-time pre-submission warning and post-event anomaly banner displaying expected, actual, difference, and unit.
   - **Batch Detail & Timeline:** Highlights quantity discrepancies per stage and flags `SUSPICIOUS` status.
   - **Consistency Engine (`ConsistencyService.evaluateBatch`):** Marks `quantityDrift.passed = false` and attaches `quantityInconsistencies`.
   - **Security Alerts & Admin Dashboard:** Automatically emits `QUANTITY_DRIFT` alerts and logs an `AdminException`.

---

## 49.2 Bug 2: Quality Lab Test & FSSAI Certification Pipeline

### Problem
The Quality Lab Portal lacked end-to-end routing, payload validation, database persistence, certificate SHA-256 digest computation, and Hyperledger Fabric event anchoring for laboratory testing.

### Architectural Solution
1. **End-to-End Flow:**
   $$\text{Quality Lab UI} \longrightarrow \text{API Client} \longrightarrow \text{Backend Quality Routes} \longrightarrow \text{PostgreSQL} \longrightarrow \text{Fabric Gateway} \longrightarrow \text{Passport} \longrightarrow \text{Consumer UI}$$
2. **FSSAI Gazette 2018 & Codex Standard 12-1981 Parameters:**
   - `moisturePercent`: $\le 20.0\%$
   - `hmfMgPerKg`: $\le 40.0\text{ mg/kg}$
   - `sucrosePercent`: $\le 5.0\%$
   - `c4SugarPercent`: $\le 7.0\%$ (C4 plant adulteration test)
   - `pollenCountPerGram`: Informational ($\ge 25,000/\text{g}$ recommended for raw floral honey)
   - `antibioticResidue`: `NEGATIVE`
   - `leadPpm`: $\le 0.1\text{ ppm}$
3. **Off-Chain Certificate Storage & SHA-256 Anchoring:**
   - Raw PDF certificates are stored off-chain in `/uploads/evidence/` or designated URL.
   - A 256-bit SHA-256 cryptographic digest is generated over the lab parameters and certificate payload.
   - Fabric Gateway invokes `addEvent` with `eventType: 'CERTIFICATION'` and `evidenceRef: certificateHash`.
4. **PostgreSQL Relational Schema (`quality_tests` Table):**
```sql
CREATE TABLE IF NOT EXISTS quality_tests (
    id VARCHAR(64) PRIMARY KEY,
    batch_id VARCHAR(64) NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    lab_id VARCHAR(64) NOT NULL,
    lab_name VARCHAR(255) NOT NULL,
    sample_id VARCHAR(64) NOT NULL,
    tester_name VARCHAR(255) NOT NULL,
    test_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    moisture_percent NUMERIC(5, 2) NOT NULL,
    hmf_mg_per_kg NUMERIC(6, 2) NOT NULL,
    sucrose_percent NUMERIC(5, 2) NOT NULL,
    c4_sugar_percent NUMERIC(5, 2) DEFAULT 0.0,
    pollen_count_per_gram INTEGER DEFAULT 0,
    antibiotic_residue VARCHAR(32) NOT NULL DEFAULT 'NEGATIVE',
    lead_ppm NUMERIC(5, 3) DEFAULT 0.0,
    overall_status VARCHAR(32) NOT NULL DEFAULT 'PASSED',
    certificate_hash_sha256 VARCHAR(64) NOT NULL,
    report_url TEXT,
    certificate_ref VARCHAR(128),
    notes TEXT,
    blockchain_tx_id VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
5. **REST API Endpoints:**
   - `POST /api/quality/tests`: Submits lab assay and records test in PostgreSQL and Hyperledger Fabric.
   - `GET /api/quality/tests/:batchId`: Returns all lab test records for a specific batch.
   - `GET /api/quality/tests`: Returns all global lab tests.
6. **Honey Passport Integration:**
   - The Honey Passport aggregates the lab test records via `qualityService.getTests(batchId)`.
   - The Quality Pillar verifies purity strictly against factual FSSAI parameters without fabricated claims.

---

## 49.3 Verification & Test Execution Summary

| Test Suite | File | Tests Run | Result |
| :--- | :--- | :--- | :--- |
| **Quantity Consistency** | `backend/src/test_quantity_consistency.ts` | 24 | **24/24 Passed (100%)** |
| **Quality Lab Flow** | `backend/src/test_quality_lab_flow.ts` | 13 | **13/13 Passed (100%)** |
| **Tier 1 Auth & RBAC** | `backend/src/test_tier1_auth_rbac.ts` | 9 | **9/9 Passed (100%)** |
| **Tier 2 Consistency & Evidence** | `backend/src/test_tier2_consistency_evidence.ts` | 5 | **5/5 Passed (100%)** |
| **Tier 1 & Tier 2 E2E Pipeline** | `backend/src/test_tier1_tier2_e2e.ts` | 15 | **15/15 Passed (100%)** |
| **Firebase Auth & RBAC Suite** | `backend/src/test_firebase_auth_rbac.ts` | 15 | **15/15 Passed (100%)** |
| **Frontend Production Build** | `frontend/ (npm run build)` | TS & Vite Bundle | **Built in 9.77s (0 errors)** |

---

# 50. REAL FIREBASE AUTHENTICATION & MULTI-TENANT RBAC (PHASE 2)

## 50.1 Architecture Overview

Honey Chain Phase 2 implements real Email/Password Authentication using **Firebase Authentication as the Identity Provider (IdP)** coupled with **PostgreSQL for application authorization, multi-tenant organization profiles, and RBAC**.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION LAYER                          │
│                                                                         │
│   ┌───────────────────────────┐         ┌───────────────────────────┐   │
│   │   Firebase Web Client     │         │   Firebase Admin SDK      │   │
│   │   - Email / Password Auth │ ──────► │   - Token Verification    │   │
│   │   - Password Reset Email  │         │   - Decodes Firebase UID  │   │
│   │   - Session Persistence   │         │   - Central Auth Guard    │   │
│   └───────────────────────────┘         └─────────────┬─────────────┘   │
└───────────────────────────────────────────────────────┼─────────────────┘
                                                        │
                                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           AUTHORIZATION LAYER                           │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                     PostgreSQL Database                         │   │
│   │  - Users (`firebase_uid`, `role`, `org_id`, `status`, `name`)   │   │
│   │  - Organizations (`id`, `name`, `type`, `status`)               │   │
│   │  - Account Lifecycle (PENDING, ACTIVE, SUSPENDED, REJECTED)     │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## 50.2 Responsibilities

1. **Firebase Authentication (Identity)**:
   - User identity credentials (email and password).
   - Password reset workflow via verified emails (`sendPasswordResetEmail`).
   - Secure generation of JWT ID tokens signed by Google.
   - Session persistence across page reloads via `onAuthStateChanged`.

2. **PostgreSQL (Authorization & Multi-Tenancy)**:
   - Authoritative mapping of `firebase_uid` to internal user record.
   - Organization multi-tenancy and resource boundaries.
   - Participant role assignments (`ADMIN`, `BEEKEEPER`, `PROCESSOR`, `TRANSPORTER`, `PACKAGER`, `QUALITY_LAB`, `CONSUMER`).
   - Account lifecycle state (`PENDING`, `ACTIVE`, `SUSPENDED`, `REJECTED`).

3. **Backend Middleware Enforcement**:
   - `authenticate`: Extracts `Bearer <token>`, verifies ID token with Firebase Admin, resolves PostgreSQL user via `firebase_uid`, enforces account status (`ACTIVE`), and attaches `req.user`.
   - `requireRoles(...allowedRoles)`: Enforces role permissions server-side.
   - `requireTenant`: Prevents cross-tenant data leakage by validating `orgId`.
   - Never trusts roles, claims, or organization IDs supplied by the frontend.

## 50.3 PostgreSQL User Schema

```sql
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(64) NOT NULL, -- ADMIN, BEEKEEPER, PROCESSOR, TRANSPORTER, PACKAGER, QUALITY_LAB
    org_id VARCHAR(64) REFERENCES organizations(id) ON DELETE SET NULL,
    status VARCHAR(32) DEFAULT 'ACTIVE', -- PENDING, ACTIVE, SUSPENDED, DEACTIVATED, REJECTED
    phone VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
```

## 50.4 Route Authorization Matrix

| Route | Method | Required Role | Public / Protected |
| :--- | :--- | :--- | :--- |
| `/api/passport/:batchId` | `GET` | *Any / None* | **Public (Unauthenticated)** |
| `/api/hives` | `POST` | `BEEKEEPER`, `ADMIN` | Protected |
| `/api/batches` | `POST` | `BEEKEEPER`, `ADMIN` | Protected |
| `/api/batches/:id/intake` | `POST` | `PROCESSOR`, `ADMIN` | Protected |
| `/api/batches/:id/processing` | `POST` | `PROCESSOR`, `ADMIN` | Protected |
| `/api/batches/:id/ready-transport`| `POST` | `PROCESSOR`, `ADMIN` | Protected |
| `/api/batches/:id/transport` | `POST` | `TRANSPORTER`, `ADMIN` | Protected |
| `/api/batches/:id/packaging` | `POST` | `PACKAGER`, `ADMIN` | Protected |
| `/api/batches/:id/publish` | `POST` | `PACKAGER`, `ADMIN` | Protected |
| `/api/quality/tests` | `POST` | `QUALITY_LAB`, `ADMIN` | Protected |
| `/api/admin/*` | `*` | `ADMIN` | Protected |
| `/api/organizations/:id/status` | `PATCH` | `ADMIN` | Protected |
| `/api/users/:id/status` | `PATCH` | `ADMIN` | Protected |

## 50.5 Policy on Persona Switching

- **Production UI**: The simulation persona switcher dropdown has been permanently removed. The Navbar displays the verified authenticated user profile, organization name, role badge, and a Sign Out button.
- **Development & Live Demo**: The Login page includes one-click preset credentials for rapid evaluative login during presentations, authenticating through the standard identity pipeline without bypassing server-side authorization.

## 50.6 Automated Verification Summary (Tests A through L)

The comprehensive test suite in `backend/src/test_firebase_auth_rbac.ts` validates:
- **Test A**: Unauthenticated request → `401 Unauthorized`.
- **Test B**: Beekeeper authenticated → Can access beekeeper APIs (`POST /api/hives`, `POST /api/batches`).
- **Test C**: Beekeeper → Processor API → `403 Forbidden`.
- **Test D**: Processor → Packaging API → `403 Forbidden`.
- **Test E**: Quality Lab → Quality test API → `201 Created` / `200 OK`.
- **Test F**: Non-admin → Admin API → `403 Forbidden`. Admin → Admin API → `200 OK`.
- **Test G**: User from Org A accessing Org B private resource → `403 Forbidden` (Tenant isolation).
- **Test H**: Logout / unauthenticated request → Protected operations denied.
- **Test I**: Verified Firebase UID maps deterministically to PostgreSQL user profile.
- **Test J**: Invalid or forged Firebase token → `401 Unauthorized`.
- **Test K**: Suspended account attempting protected operation → `403 Forbidden`.
- **Test L**: Public Passport `GET /api/passport/:batchId` remains accessible without authentication (`200 OK`).
