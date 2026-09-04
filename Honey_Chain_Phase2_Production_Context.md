# Honey Chain --- Phase 2 Production-Ready Platform Context

## SIH26021 \| Bee-Tech

**Purpose:** Master implementation context for evolving the existing
Honey Chain SIH prototype into an almost-production-ready platform with
a central Admin/Operations Dashboard and role-specific
applications/interfaces for every stage of honey production.

**Do not rebuild from scratch.** Inspect the current repository and
extend/refactor it deliberately. Preserve working API contracts and
architecture unless a change is necessary and documented.

------------------------------------------------------------------------

## 1. Product Vision

Honey Chain connects:

Beekeeper → Hive/Apiary → Harvest → Honey Batch → Processing → Transport
→ Packaging → Consumer.

Core technologies:

-   Hyperledger Fabric --- shared provenance/trust layer
-   PostgreSQL --- operational/application data
-   FastAPI/ML --- hive telemetry anomaly detection and evidence
    consistency
-   IoT --- physical-world telemetry/evidence
-   Backend REST APIs --- business logic/integration
-   Role-specific applications --- participant workflows
-   Admin Dashboard --- operations, monitoring, exceptions
-   QR Honey Passport --- controlled public provenance view

Core principle:

> **Blockchain preserves what was recorded. Our AI checks whether the
> record is consistent with available evidence.**

Do not claim blockchain proves honey purity, prevents adulteration, or
guarantees truthful input. Do not claim AI proves purity/authenticity or
diagnoses disease without validated evidence.

------------------------------------------------------------------------

## 2. Phase 2 Target Architecture

``` text
                    Consumer / QR
                         |
                  Honey Passport
                         |
        +----------------+----------------+
        |       Application Layer         |
        |                                 |
        | Admin | Beekeeper | Processor   |
        | Transport | Packaging | Quality |
        +----------------+----------------+
                         |
                  Backend / API
                Auth + RBAC + Domain
                   /                            /                      PostgreSQL          AI/ML
              |                 |
              |              IoT/Evidence
              |
              +------ Fabric Gateway
                         |
                  Hyperledger Fabric
                   Provenance Ledger
```

One coherent platform, not disconnected applications.

------------------------------------------------------------------------

## 3. User Roles

### Platform Admin

Manage organizations/users/roles, monitor batches/hives, investigate
anomalies and provenance issues, inspect audit logs, system health, and
exceptions.

### Beekeeper

Manage apiaries/hives, view telemetry and AI results, record harvests,
create batches, view history.

### Processor

Receive batches, confirm intake, record processing, quantity changes,
location/time, and submit processing provenance events.

### Transporter

Accept shipments, record dispatch/arrival, source/destination, custody
transfer, and transport conditions where available.

### Packaging Partner

Receive processed batches, record packaging, assign public product/batch
ID, generate/publish Honey Passport and QR.

### Quality/Lab

Associate quality/test evidence with batches, including test
type/date/result/report reference. This is evidence, not an automatic
purity guarantee.

### Consumer

No account required for normal Passport access. Scans QR and sees only
approved public provenance/evidence.

------------------------------------------------------------------------

## 4. Organization Model

Support configurable organizations:

``` text
Organization
  ├── Users
  ├── Roles
  ├── Apiaries
  ├── Hives
  ├── Batches
  └── Operations
```

Examples include beekeeper, processor, transport, packaging, laboratory,
and platform organizations.

Enforce organization isolation server-side.

------------------------------------------------------------------------

## 5. Authentication and Authorization

Implement real authentication and backend-enforced RBAC.

``` text
User → Authentication → Role + Organization → Backend authorization → Operation
```

Frontend checks are only UX; they are never the security boundary.

Users must not directly access Fabric CLI or submit arbitrary chaincode
transactions.

Every important action should have actor identity, organization, role,
resource, timestamp, and result.

------------------------------------------------------------------------

## 6. Participant Applications

Use one shared platform/codebase with role-specific navigation/views.

### Beekeeper

Home, Apiaries, Hives, Telemetry, AI Alerts, Harvests, Batches, Profile.

### Processor

Home, Incoming Batches, Processing, History, Profile.

### Transport

Home, Shipments, Active Transport, History, Profile.

### Packaging

Home, Incoming Batches, Packaging, Products, QR Passports, History.

### Quality/Lab

Home, Assigned Batches, Tests, Evidence, Reports.

Do not create separate disconnected backends or duplicate components.

------------------------------------------------------------------------

## 7. Admin Dashboard

Build one central Admin/Operations Dashboard.

Recommended sections:

### Overview

-   active hives
-   active batches
-   batches in transit
-   processing/packaging volume
-   AI alerts
-   suspicious provenance
-   blockchain status
-   recent events

### Users & Organizations

-   organizations
-   users
-   roles
-   approval/revocation
-   access status

### Hives / Apiaries

-   hive list
-   telemetry status
-   last reading
-   anomaly state
-   AI score

### Batches

-   status
-   current custodian
-   quantity
-   provenance state
-   AI consistency
-   Passport state

### Supply Chain Timeline

Harvest → Processing → Transport → Packaging.

### AI Monitoring

-   anomalies
-   severity
-   reasons
-   model version
-   inference time

### Provenance

-   confirmed
-   pending
-   failed
-   quantity/timestamp inconsistencies
-   suspicious transitions

### Quality

-   quality records
-   lab evidence
-   evidence status

### Audit

-   authentication
-   role changes
-   data submissions
-   provenance actions
-   admin corrections

### System Health

-   backend
-   database
-   AI
-   Fabric Gateway/network

------------------------------------------------------------------------

## 8. Canonical Batch Lifecycle

``` text
CREATED
  ↓
HARVESTED
  ↓
RECEIVED_FOR_PROCESSING
  ↓
PROCESSING
  ↓
READY_FOR_TRANSPORT
  ↓
IN_TRANSIT
  ↓
RECEIVED
  ↓
PACKAGED
  ↓
PUBLISHED
```

Validate state transitions in backend/domain logic. Do not allow
arbitrary jumps.

------------------------------------------------------------------------

## 9. Provenance Event Model

Treat supply-chain history as append-oriented.

Core events may include:

``` text
HIVE_REGISTERED
HARVEST_RECORDED
BATCH_CREATED
BATCH_RECEIVED
PROCESSING_STARTED
PROCESSING_COMPLETED
TRANSPORT_DISPATCHED
TRANSPORT_RECEIVED
PACKAGING_RECORDED
QUALITY_RESULT_RECORDED
PASSPORT_PUBLISHED
```

Ordinary users cannot silently edit/delete historical provenance.
Corrections should create controlled new events and audit records.

------------------------------------------------------------------------

## 10. Blockchain Responsibilities

Fabric stores shared provenance/custody information:

-   batch creation
-   harvest association
-   custody/ownership events
-   processing
-   transport
-   packaging
-   relevant quality evidence references/hashes
-   Passport publication state
-   integrity-relevant provenance events

Do not store raw high-volume telemetry or large reports directly
on-chain.

Prefer hashes, references, identifiers, and essential event metadata.

Architecture:

``` text
Frontend → Backend → Fabric Gateway → Hyperledger Fabric
```

Production direction includes multiple organizations/MSPs, CAs,
endorsement policies, identity lifecycle, TLS, key protection, private
data where necessary, and network redundancy. Do not migrate to full
production Fabric topology before application workflows are stable.

------------------------------------------------------------------------

## 11. PostgreSQL Responsibilities

PostgreSQL is the application/read-model layer, not the authoritative
shared provenance ledger.

Store: - users - organizations - roles/permissions - apiaries - hive
metadata - telemetry/read-model/cache - AI inference results -
anomalies - batch read models - notifications - audit metadata -
Passport read models - evidence/file metadata - configuration

Principle:

``` text
Fabric = authoritative shared provenance history
PostgreSQL = application data/read model/cache
```

Use migrations, foreign keys, indexes, unique constraints, timestamps,
and appropriate retention/soft-delete strategies.

------------------------------------------------------------------------

## 12. AI/ML Layer

The real HOBOS-trained hive anomaly model is now part of the platform.

Primary purpose:

> Detect abnormal hive telemetry patterns and provide evidence-oriented
> anomaly signals.

Inputs may include:

``` text
temperature
humidity
weight
activity/flow
timestamp-derived features
```

Outputs conceptually:

``` text
anomaly
anomaly score
severity
reasons
model version
timestamp
```

Do not present it as a honey-purity detector.

Persist model version and inference results where useful.

------------------------------------------------------------------------

## 13. AI Failure Behavior

If AI is unavailable:

``` text
AI_STATUS = UNAVAILABLE
```

Never convert an AI outage into NORMAL.

Similarly:

``` text
Fabric unavailable → blockchain status is not falsely shown as verified
Telemetry stale/offline → not treated as healthy telemetry
```

------------------------------------------------------------------------

## 14. IoT Architecture

Maintain a clean physical-device boundary:

``` text
Sensor
  ↓
Device identity
  ↓
Telemetry ingestion
  ↓
Validation
  ↓
Storage
  ↓
AI inference
  ↓
Dashboard
```

The simulator should use the same logical contract as real sensors so
real hardware can later replace it without rewriting the AI/backend
architecture.

Current conceptual telemetry:

``` json
{
  "hiveId": "HIVE-042",
  "beekeeperId": "BK-007",
  "location": {"lat": 28.6139, "lng": 77.2090},
  "telemetry": {
    "temperature": 34.2,
    "humidity": 61.0,
    "weight": 42.7,
    "activity": 0.84
  },
  "timestamp": "2026-09-02T18:30:00Z"
}
```

------------------------------------------------------------------------

## 15. Provenance + AI Consistency

A key differentiator:

``` text
Blockchain claims
      +
Available evidence
      ↓
AI consistency analysis
      ↓
VERIFIED / SUSPICIOUS
```

Example:

``` text
Claimed quantity: 500 kg
Observed/evidence quantity: 470 kg
        ↓
Difference exceeds tolerance
        ↓
Consistency warning
```

Distinguish:

``` text
Blockchain integrity ≠ physical truth
AI consistency ≠ purity proof
```

------------------------------------------------------------------------

## 16. Honey Passport + QR

QR should encode a stable public URL/identifier, not the entire record.

Conceptually:

``` text
https://honeychain.app/passport/HC-2026-0099
```

Passport should show approved public information:

-   public batch ID
-   origin
-   harvest
-   source hive/apiary where appropriate
-   processing timeline
-   transport timeline
-   packaging
-   provenance status
-   AI consistency status
-   public quality evidence where available
-   timestamps

Never expose private participant information, internal IDs, secrets, or
sensitive reports.

Use public IDs rather than database primary keys.

------------------------------------------------------------------------

## 17. Passport Statuses

Do not collapse all evidence into one boolean.

Use separate concepts:

``` text
PROVENANCE:
CONFIRMED | PENDING | FAILED

AI CONSISTENCY:
NORMAL | WARNING | SUSPICIOUS

QUALITY:
NOT_AVAILABLE | AVAILABLE | PASSED | REVIEW_REQUIRED
```

Example:

``` text
Provenance confirmed
AI consistency warning
Quality evidence unavailable
```

This must not be rendered as "fake honey".

------------------------------------------------------------------------

## 18. Backend Architecture

Evolve toward clear modules:

``` text
backend/src/
├── config/
├── middleware/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── organizations/
│   ├── hives/
│   ├── telemetry/
│   ├── ai/
│   ├── batches/
│   ├── provenance/
│   ├── transport/
│   ├── processing/
│   ├── packaging/
│   ├── quality/
│   ├── passports/
│   ├── notifications/
│   └── audit/
├── services/
├── repositories/
├── blockchain/
└── index.ts
```

Adapt incrementally to the existing implementation rather than blindly
restructuring.

------------------------------------------------------------------------

## 19. API Direction

Existing core APIs should be preserved unless a breaking change is
justified:

``` http
POST /api/hives
GET /api/hives/:id
GET /api/hives/:id/telemetry
POST /api/telemetry
GET /api/hives/:id/health
GET /api/hives/:id/anomalies
GET /api/hives/:id/productivity

POST /api/provenance/check

POST /api/batches
GET /api/batches/:id
GET /api/batches/:id/timeline

POST /api/batches/:id/processing
POST /api/batches/:id/transport
POST /api/batches/:id/packaging

GET /api/passport/:batchId
```

Phase 2 may add:

``` text
/api/auth
/api/users
/api/organizations
/api/roles
/api/apiaries
/api/quality
/api/audit
/api/notifications
/api/admin
```

Exact routes must follow the current codebase.

------------------------------------------------------------------------

## 20. API Security

Implement: - authentication - backend authorization - schema
validation - input sanitization - rate limiting - secure headers -
CORS - request size limits - structured errors - audit logging for
sensitive actions - HTTPS in production - secrets management

Never trust client-supplied role, organization, ownership, or Fabric
identity claims without server-side authorization.

------------------------------------------------------------------------

## 21. Distributed Consistency

For operations touching PostgreSQL and Fabric, define success/failure
states explicitly.

Example:

``` text
Create batch
  ↓
Validate
  ↓
Create pending application record
  ↓
Submit Fabric transaction
  ↓
Confirm
  ↓
Mark provenance confirmed
```

If Fabric fails:

``` text
PENDING_PROVENANCE / FAILED_PROVENANCE
```

not false success.

Where needed use: - idempotency keys - transaction status -
outbox/retry - reconciliation jobs

Do not add unnecessary distributed complexity.

------------------------------------------------------------------------

## 22. File / Evidence Storage

Large files belong off-chain:

-   lab PDFs
-   certificates
-   quality reports
-   photos

Store:

``` text
file metadata
storage reference
content hash
batch/event association
```

Store integrity-relevant hash/reference on Fabric where appropriate.

------------------------------------------------------------------------

## 23. Audit Logging

Audit sensitive/provenance actions:

``` text
LOGIN
USER_CREATED
ROLE_CHANGED
ORGANIZATION_CREATED
HIVE_REGISTERED
HARVEST_RECORDED
BATCH_CREATED
PROCESSING_RECORDED
TRANSPORT_RECORDED
PACKAGING_RECORDED
QUALITY_RESULT_RECORDED
PASSPORT_PUBLISHED
ADMIN_CORRECTION
```

Include:

``` text
actor
organization
action
resource
timestamp
result
request/correlation ID
```

Never log secrets.

------------------------------------------------------------------------

## 24. Notifications

Support role-aware alerts:

``` text
AI anomaly detected
Batch consistency issue
Transport overdue
Custody transfer pending
Quality evidence missing
Blockchain transaction failed
```

Route only to authorized stakeholders.

------------------------------------------------------------------------

## 25. Frontend Architecture

Use one frontend/design system with feature areas:

``` text
frontend/
├── components/
├── layouts/
├── pages/
├── features/
│   ├── auth/
│   ├── admin/
│   ├── beekeeper/
│   ├── processor/
│   ├── transport/
│   ├── packaging/
│   ├── quality/
│   └── passport/
├── services/
├── hooks/
├── types/
└── utils/
```

Prefer reusable components and configuration-driven role navigation.

Participant UI should optimize for task completion and mobile use; Admin
UI can be information-dense.

------------------------------------------------------------------------

## 26. UX Requirements

Every operational screen should make clear:

``` text
Current state
What happened
What happens next
Who must act
What evidence is required
```

Batch timeline example:

``` text
✓ Harvest recorded
✓ Processing completed
✓ Transport dispatched
● Awaiting receipt
○ Packaging
○ Passport publication
```

------------------------------------------------------------------------

## 27. Admin Exception Handling

Admins investigate exceptions, but do not silently rewrite history.

Examples: - Fabric transaction failed - batch stuck - missing custody
receipt - AI anomaly - quantity mismatch - missing quality evidence -
duplicate submission

Administrative correction must: - require permission - preserve original
history - create an audit event - explain the correction

------------------------------------------------------------------------

## 28. Multi-Tenant Isolation

All protected resources must be scoped appropriately, typically by
organization.

Server-side authorization must prevent:

``` text
Organization A → Organization B private data
```

Do not rely on frontend filtering or query parameters alone.

------------------------------------------------------------------------

## 29. Observability

Use structured logs with: - timestamp - level - service - request ID -
actor/resource where appropriate

Track useful metrics: - API request count/latency/errors - AI inference
count/latency - anomaly count - Fabric success/failure - database
health - relevant operational activity

Add meaningful health/readiness checks.

------------------------------------------------------------------------

## 30. Testing

### Unit

-   business rules
-   validation
-   state transitions
-   permissions
-   feature engineering
-   ML inference adapter

### Integration

-   API ↔ PostgreSQL
-   API ↔ AI
-   API ↔ Fabric
-   QR ↔ Passport
-   role workflows

### E2E

``` text
Beekeeper
 → Hive
 → Telemetry
 → AI
 → Harvest
 → Batch

Processor
 → Receive
 → Process

Transporter
 → Dispatch
 → Receive

Packager
 → Package
 → Passport
 → QR

Consumer
 → Scan
 → Passport
```

### Security

-   unauthorized access
-   cross-organization access
-   malformed inputs
-   token/session abuse
-   public data leakage

------------------------------------------------------------------------

## 31. Deployment Direction

Prototype can continue using Docker Compose.

Production direction:

``` text
CDN/reverse proxy
      ↓
Frontend
      ↓
Backend services
   ↙       ↘
PostgreSQL   AI
      \       /
       Fabric
```

Future infrastructure may include managed PostgreSQL, object storage,
secrets manager, CI/CD, container registry, monitoring, backups, and
disaster recovery.

Do not introduce Kubernetes merely for appearance.

------------------------------------------------------------------------

## 32. Environment Management

Separate development/test/production configuration.

Never commit real secrets.

Document configuration such as:

``` text
DATABASE_URL
AUTH/JWT configuration
AI_SERVICE_URL
Fabric connection configuration
storage configuration
CORS origins
public application URL
```

------------------------------------------------------------------------

## 33. CI/CD

Target pipeline:

``` text
Push
 ↓
Lint
 ↓
Type check
 ↓
Unit tests
 ↓
Build
 ↓
Integration tests
 ↓
Container build
 ↓
Security checks
 ↓
Deploy
```

------------------------------------------------------------------------

## 34. Database and Backup

Use versioned migrations.

Define backup/recovery for: - PostgreSQL - Fabric/world state/ledger
infrastructure - configuration - evidence files

The system must not depend on one developer laptop.

------------------------------------------------------------------------

## 35. Domain Rules

Centralize important business rules.

Examples:

``` text
A batch cannot be packaged before required processing.
A transporter cannot handle unauthorized shipments.
A user cannot modify another organization's private data.
A provenance event cannot be silently deleted.
A Passport cannot be published without required data.
A failed Fabric transaction cannot be shown as confirmed.
```

These rules belong in backend/domain logic.

------------------------------------------------------------------------

## 36. Production-Ready Security Principles

Minimum: - TLS/HTTPS - strong authentication - RBAC - tenant isolation -
input validation - secure secret storage - Fabric key protection - audit
logs - dependency/container scanning - file validation - rate limiting -
safe error handling

------------------------------------------------------------------------

## 37. Phase 2 Implementation Order

### A --- Stabilize

Run and inspect the current system. Verify frontend/backend/AI/Fabric
end-to-end. Establish tests and environment configuration.

### B --- Identity

Users, organizations, authentication, roles, permissions, tenant
isolation.

### C --- Domain

Apiaries, hives, batches, states, events, custody.

### D --- Participant workflows

Beekeeper → Processor → Transport → Packaging → Quality.

### E --- Admin

Overview, users, organizations, hives, batches, anomalies, provenance,
audit, health.

### F --- Provenance hardening

Fabric identity mapping, policies, transaction status,
failure/reconciliation.

### G --- AI/IoT hardening

Real ML inference adapter, model versioning, telemetry ingestion,
anomaly persistence, alerts.

### H --- Passport

Public IDs, publication, QR, privacy filtering, public timeline.

### I --- Security/testing

Authorization, tenant isolation, integration/E2E/security tests.

### J --- Deployment

Production configuration, CI/CD, observability, backups, deployment
docs.

------------------------------------------------------------------------

## 38. What NOT to Do

Do not: - rebuild the entire project unnecessarily - create duplicate
dashboards - create disconnected role-specific backends - rely on
frontend authorization - let users access Fabric CLI - put raw telemetry
on-chain - put large files on-chain - put ML inference in chaincode -
claim blockchain proves physical truth - claim AI proves purity -
fabricate metrics - fabricate provenance - silently mutate historical
events - introduce Kubernetes only for appearance - introduce
microservices without need - over-engineer before core workflows work

------------------------------------------------------------------------

## 39. Definition of Done

### Identity

-   [ ] authentication
-   [ ] organizations
-   [ ] server-side RBAC
-   [ ] tenant isolation

### Beekeeper

-   [ ] apiaries
-   [ ] hives
-   [ ] telemetry
-   [ ] AI alerts
-   [ ] harvest
-   [ ] batch creation

### Processor

-   [ ] incoming batches
-   [ ] receipt
-   [ ] processing
-   [ ] provenance event

### Transport

-   [ ] shipments
-   [ ] dispatch
-   [ ] receipt
-   [ ] custody

### Packaging

-   [ ] packaging
-   [ ] public ID
-   [ ] Passport
-   [ ] QR

### Quality

-   [ ] quality evidence
-   [ ] evidence status separate from provenance

### Admin

-   [ ] overview
-   [ ] user/org management
-   [ ] hive monitoring
-   [ ] batch monitoring
-   [ ] AI alerts
-   [ ] provenance exceptions
-   [ ] audit
-   [ ] system health

### AI

-   [ ] trained HOBOS model integrated
-   [ ] model versioning
-   [ ] persisted anomaly results
-   [ ] explicit AI failure state
-   [ ] explainable reasons

### Blockchain

-   [ ] stable Fabric Gateway
-   [ ] append-oriented provenance
-   [ ] explicit transaction failures
-   [ ] identity mapping
-   [ ] no direct user Fabric access

### Consumer

-   [ ] QR
-   [ ] public Passport
-   [ ] provenance timeline
-   [ ] privacy filtering
-   [ ] separate AI/provenance/quality statuses

### Engineering

-   [ ] unit tests
-   [ ] integration tests
-   [ ] E2E tests
-   [ ] security tests
-   [ ] environment separation
-   [ ] migrations
-   [ ] structured logs
-   [ ] health checks
-   [ ] deployment documentation
-   [ ] backup/recovery plan

------------------------------------------------------------------------

## 40. Final Product Statement

> **Honey Chain is a digital trust and traceability platform for honey
> supply chains that connects beekeepers, processors, logistics
> providers, packagers, quality stakeholders, and consumers through a
> shared provenance layer, AI-assisted evidence analysis, IoT telemetry,
> and QR-based product passports.**

The platform does not create truth through blockchain.

Blockchain creates a durable, auditable record of what authorized
participants submitted.

AI analyzes available evidence and identifies anomalies or
inconsistencies.

IoT supplies physical-world telemetry.

The Passport presents a controlled, understandable public traceability
view.

------------------------------------------------------------------------

## 41. Immediate Next Action

Before any major Phase 2 refactor, inspect the current implementation
and produce a current-state report covering:

``` text
Frontend:
- pages
- existing dashboard
- role assumptions
- Passport/QR

Backend:
- routes
- modules/services
- database state
- authentication
- current workflows

AI:
- trained model
- inference endpoint
- model artifact/version
- anomaly/health behavior

Blockchain:
- network state
- chaincode functions
- Gateway
- identities
- transaction handling

IoT:
- simulator
- telemetry contract
- ingestion path

Tests:
- existing
- critical gaps

Deployment:
- Docker Compose
- environment variables
- blockers
```

**Do not start a major refactor until this report exists.**

The first implementation objective is to close the gap between the
current working system and this Phase 2 architecture without destroying
working functionality.
