# Honey Chain — Tier 1 + Tier 2 Production Upgrade Specification
## SIH26021 | Bee-Tech | Antigravity Implementation Context

**Status:** IMPLEMENT NOW  
**Priority:** Critical before cloud deployment  
**Scope:** Tier 1 + Tier 2 production-shaped upgrades

---

## 1. Objective

Upgrade Honey Chain from a strong SIH prototype into a **production-shaped, multi-role traceability platform**.

The target workflow is:

```text
Identity
   ↓
Authorized participant
   ↓
Physical supply-chain action
   ↓
Location / timestamp / evidence
   ↓
AI analysis
   ↓
Blockchain provenance
   ↓
Authorized next participant
   ↓
Consumer Honey Passport
```

Do not add features mechanically. Every feature must strengthen traceability, beekeeping intelligence, supply-chain trust, or consumer verification.

---

## 2. Source of Truth / Non-Negotiables

Before modifying code, inspect:

1. `00_MASTER_SPEC.md`
2. `Honey_Chain_Complete_Context_PreDeployment.md`
3. README
4. Current backend/frontend/AI/blockchain implementation
5. Docker configuration
6. Existing API contracts/types
7. Existing Live Demo

Preserve the current architecture:

```text
HIVE
 ↓
IoT / simulated telemetry
 ↓
AI / Hive Digital Twin
 ↓
Backend / API
 ↓
Hyperledger Fabric
 ↓
Batch / Processing / Transport / Packaging
 ↓
Honey Passport / QR
 ↓
Consumer
```

Data ownership:

```text
Fabric       → provenance + custody events
PostgreSQL   → users + organizations + application metadata + cached telemetry
AI           → telemetry → health / anomaly / productivity / provenance consistency
IoT          → simulated telemetry in Phase 1
Storage      → evidence files off-chain
Frontend     → presentation only
Backend      → auth + authorization + business rules
```

Accuracy rule:

> Blockchain verifies recorded provenance and chain-of-custody state; it does not prove physical honey purity.

AI detects anomalies/inconsistencies; it is not laboratory purity certification.

---

# 3. Implementation Rules

- Inspect before editing.
- Reuse existing code/components/types.
- Do not silently replace architecture.
- Do not replace real AI or Fabric with mocks.
- Do not reset/delete Fabric network or volumes.
- Do not delete existing Live Demo functionality.
- Backend is authoritative for auth, roles, organizations, permissions and state transitions.
- Do not trust `role`, `userId`, or `organizationId` supplied by the frontend.
- Do not fabricate GPS, alerts, transaction IDs, verification results, or successful responses.
- Keep local development working after each milestone.
- Run tests/builds after each milestone.
- Update `00_MASTER_SPEC.md` after important architecture/schema/API changes.
- Work one logical milestone at a time.

---

# 4. TIER 1 — REAL AUTHENTICATION

Replace demo-only persona switching for normal application use with real authentication.

Required:

- Registration
- Login
- Logout
- Password hashing
- Password verification
- Secure session/JWT mechanism
- `GET /api/auth/me`
- Protected backend routes
- Protected frontend routes
- Persistent auth state
- Unauthorized handling
- Account status

User model:

```text
id
name
email
phone?
passwordHash
role
organizationId
status
createdAt
updatedAt
lastLoginAt
```

Account status:

```text
PENDING
ACTIVE
SUSPENDED
REJECTED
```

Never store plaintext passwords.

---

# 5. TIER 1 — RBAC

Roles:

```text
ADMIN
BEEKEEPER
PROCESSOR
TRANSPORTER
PACKAGER
QUALITY_LAB
```

Consumer does not require an authenticated account.

Suggested permissions:

```text
ADMIN:
  system.*
  organizations.*
  users.*
  hives.*
  batches.*
  provenance.*
  audit.*
  alerts.*
  verification.*

BEEKEEPER:
  hives.read
  hives.create
  telemetry.read
  telemetry.write
  health.read
  anomalies.read
  harvest.create
  batches.read

PROCESSOR:
  batches.read
  processing.accept
  processing.create
  processing.read
  batches.handoff

TRANSPORTER:
  shipments.read
  transport.accept
  transport.update
  transport.location.write
  transport.deliver

PACKAGER:
  batches.read
  packaging.accept
  packaging.create
  qr.publish

QUALITY_LAB:
  batches.read
  quality.read
  quality.upload
  quality.submit
```

Authorization must check:

```text
authenticated user
+
account status
+
role
+
organization
+
permission
+
resource access
```

Frontend hiding a button is NOT authorization.

---

# 6. TIER 1 — ORGANIZATIONS

Add an organization model.

Organization types:

```text
BEEKEEPER
PROCESSOR
TRANSPORT
PACKAGING
QUALITY_LAB
ADMIN/GOVERNMENT
```

Fields:

```text
id
name
type
registrationNumber
contactEmail
phone
address
status
createdAt
updatedAt
```

Status:

```text
PENDING
ACTIVE
SUSPENDED
REJECTED
```

Users belong to organizations.

Admin can:

- create/view organizations
- approve/reject
- suspend/reactivate
- view members
- assign users
- change roles

---

# 7. TIER 1 — ONBOARDING

Production flow:

```text
Registration
 ↓
PENDING
 ↓
Admin Review
 ↓
APPROVED
 ↓
ACTIVE
```

Admin must have a pending users/organizations view with:

- approve
- reject
- suspend
- reactivate

Seeded SIH demo accounts may be ACTIVE, but they must still authenticate normally.

---

# 8. TIER 1 — ROLE-SPECIFIC APPLICATIONS

## Beekeeper

```text
Dashboard
Hives
Telemetry
Hive Health
Anomalies
Harvests
Batches
Profile
```

Can register hives, capture location, inspect telemetry/AI, create harvests and view own batches.

## Processor

```text
Dashboard
Incoming Batches
Processing
Batch History
Handoffs
Profile
```

Can accept/reject incoming batches, record processing, attach evidence and hand batches onward.

## Transporter

```text
Dashboard
Assigned Shipments
Live Location
Transport History
Handoffs
Profile
```

Can accept shipments, capture location, record transport, update location and delivery.

## Packager

```text
Dashboard
Incoming Batches
Packaging
QR Publishing
Batch History
Profile
```

Can accept batches, package them, attach evidence and publish QR.

## Quality Lab

```text
Dashboard
Assigned Batches
Quality Tests
Evidence
Reports
Profile
```

Can submit quality evidence and lab report metadata.

## Admin

One central operations dashboard.

---

# 9. TIER 1 — BROWSER LOCATION

Use the Browser Geolocation API.

Flow:

```text
Register Hive
 ↓
Use My Current Location
 ↓
Browser permission
 ↓
navigator.geolocation
 ↓
lat/lng/accuracy
 ↓
Backend
 ↓
PostgreSQL + relevant Fabric provenance
```

Capture:

```text
latitude
longitude
accuracy
timestamp
source
```

Source:

```text
BROWSER_GPS
MANUAL
SIMULATED
```

If GPS permission is denied, allow manual entry. Never fabricate GPS.

---

# 10. TIER 1 — HIVE LOCATION

Hive registration must support:

- current location
- manual location
- seeded/demo location

Display:

```text
Latitude
Longitude
Accuracy
Captured At
Location Source
```

---

# 11. TIER 1 — TRANSPORT LOCATION

Transport records:

```text
batchId
transporterId
vehicleId
origin
destination
currentLocation
startedAt
deliveredAt
locationUpdates[]
```

A location update contains:

```json
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "accuracy": 12,
  "timestamp": "2026-09-04T12:30:00Z",
  "source": "BROWSER_GPS"
}
```

For SIH, a current-location capture plus origin/destination is enough. Do not build continuous background tracking.

---

# 12. TIER 2 — EVIDENCE MANAGEMENT

Events should support evidence:

```text
Harvest     → hive/harvest evidence
Processing  → processing photo/document
Transport   → dispatch/delivery proof
Packaging   → packaging evidence
Quality     → laboratory report
```

Raw files must NOT be stored on Fabric.

Use:

```text
File
 ↓
Off-chain storage
 ↓
SHA-256 hash + reference
 ↓
Backend metadata
 ↓
Evidence hash/reference on provenance where appropriate
```

Evidence metadata:

```text
id
batchId
eventId
uploadedBy
organizationId
fileName
mimeType
size
storageKey
sha256
uploadedAt
status
```

Status:

```text
UPLOADED
VERIFIED
REJECTED
```

Private evidence must not automatically become public.

---

# 13. TIER 2 — REAL CHAIN OF CUSTODY

Do not let arbitrary roles add arbitrary events.

Target lifecycle:

```text
HARVEST
 ↓
BATCH CREATED
 ↓
PROCESSOR ACCEPTS
 ↓
PROCESSING
 ↓
TRANSPORTER ACCEPTS
 ↓
TRANSPORT
 ↓
PACKAGER ACCEPTS
 ↓
PACKAGING
 ↓
QUALITY EVIDENCE
 ↓
QR/PASSPORT PUBLISHED
```

Handoff contains:

```text
fromActor
fromOrganization
toActor/toOrganization
batchId
status
timestamp
optional location
optional evidence
reason if rejected
```

---

# 14. TIER 2 — STATE MACHINE

Backend-enforced states may include:

```text
CREATED
 ↓
AWAITING_PROCESSOR
 ↓
PROCESSOR_ACCEPTED
 ↓
PROCESSING
 ↓
AWAITING_TRANSPORT
 ↓
TRANSPORT_ACCEPTED
 ↓
IN_TRANSIT
 ↓
DELIVERED
 ↓
AWAITING_PACKAGING
 ↓
PACKAGING
 ↓
PACKAGED
 ↓
PUBLISHED
```

Do not force unnecessary quality states into the primary batch state.

Core requirement:

> Invalid role/action/state combinations must be rejected server-side.

Rejections require a reason and must never delete historical provenance.

---

# 15. TIER 2 — LOCATION CONSISTENCY

Build reusable consistency checks using:

```text
registered hive location
+
event location
+
timestamp
+
batch
+
transport origin/destination
+
event sequence
```

Hive check:

```text
event location
vs
registered hive location
```

Transport check:

```text
captured location
vs
declared route/origin/destination
```

Use neutral language:

> Location evidence is inconsistent with the recorded provenance.

Do not call this proof of fraud.

---

# 16. TIER 2 — GEO DISTANCE

Implement a reusable Haversine distance helper.

Return:

```text
distanceMeters
withinExpectedRadius
thresholdMeters
```

Thresholds should be configurable.

Do not use one hard-coded threshold for every real-world scenario.

---

# 17. TIER 2 — AI + PROVENANCE CORRELATION

Extend the existing provenance consistency engine.

Inputs can include:

```text
blockchain event sequence
event timestamps
batch quantities
hive origin
GPS/location evidence
transport route
AI anomaly results
telemetry evidence
```

Output:

```json
{
  "status": "VERIFIED",
  "consistencyScore": 0.96,
  "anomalies": []
}
```

Possible anomaly codes:

```text
LOCATION_MISMATCH
TIMESTAMP_INCONSISTENCY
QUANTITY_INCONSISTENCY
TELEMETRY_ANOMALY
UNEXPECTED_EVENT_ORDER
MISSING_EVIDENCE
```

Severity:

```text
INFO
LOW
MEDIUM
HIGH
CRITICAL
```

Do not mark everything suspicious.

---

# 18. TIER 2 — QUANTITY CONSISTENCY

Compare where data exists:

```text
harvest quantity
→ processing quantity
→ transported quantity
→ packaged quantity
```

Example:

```text
Harvest: 100 kg
Processing input: 100 kg
Processing output: 98 kg
Transport: 98 kg
Packaging: 196 × 500g
```

Valid.

Example:

```text
Harvest: 100 kg
Packaging: 150 kg
```

Flag:

```text
QUANTITY_INCONSISTENCY
```

---

# 19. TIER 2 — TIMESTAMP CONSISTENCY

Expected order:

```text
harvest < processing < transport < packaging
```

If violated:

```text
TIMESTAMP_INCONSISTENCY
```

Never silently rewrite history.

---

# 20. TIER 2 — ALERTS

Create an application alert system.

Sources:

```text
HIGH AI anomaly
LOCATION mismatch
QUANTITY mismatch
TIMESTAMP inconsistency
failed blockchain operation
failed AI inference
rejected handoff
pending approval
```

Alert fields:

```text
id
type
severity
title
message
resourceType
resourceId
organizationId
createdAt
readAt
status
```

Statuses:

```text
UNREAD
READ
RESOLVED
```

Users see only relevant alerts; admin sees system-wide alerts.

---

# 21. TIER 2 — AUDIT LOGS

Application audit logs are separate from Fabric provenance.

Fabric answers:

> What supply-chain event was recorded?

Audit log answers:

> Which authenticated application user attempted which operation?

Fields:

```text
id
actorUserId
actorOrganizationId
actorRole
action
resourceType
resourceId
result
metadata
ipAddress (if safely available)
userAgent (if safely available)
createdAt
```

Log examples:

```text
USER LOGIN
USER LOGIN_FAILED
ADMIN APPROVED USER
PROCESSOR ACCEPTED BATCH
TRANSPORTER UPDATED LOCATION
PACKAGER PUBLISHED PASSPORT
QUALITY_LAB UPLOADED EVIDENCE
```

Never log passwords, tokens, private keys or secrets.

---

# 22. TIER 2 — ADMIN OPERATIONS DASHBOARD

Use ONE central dashboard:

```text
Overview
Organizations
Users
Hives
Batches
Supply Chain
AI Monitoring
Provenance
Quality Evidence
Alerts
Audit Logs
System Verification
```

KPIs:

```text
Active Organizations
Active Users
Registered Hives
Active Batches
Batches In Transit
Verified Batches
Suspicious Batches
Open Alerts
```

---

# 23. SYSTEM VERIFICATION

Admin → System Verification must show actual state.

## AI

```text
Model Loaded
Model Version
Dataset
Feature Count
Last Inference
Inference Latency
Last Prediction
```

## Blockchain

```text
Connection
Channel
Chaincode
Network Status
Gateway Status
Latest successful transaction
Latest batch history
```

## Database

```text
Connection
Latency
Migration status
```

## IoT

```text
Simulator status
Last telemetry
Last update
```

Never fabricate health values.

---

# 24. API EXTENSIONS

Extend the existing API rather than duplicating it.

Likely additions:

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

GET  /api/users
POST /api/users
PATCH /api/users/:id
PATCH /api/users/:id/status

GET  /api/organizations
POST /api/organizations
GET  /api/organizations/:id
PATCH /api/organizations/:id
POST /api/organizations/:id/approve
POST /api/organizations/:id/reject
POST /api/organizations/:id/suspend

GET  /api/handoffs
POST /api/handoffs
POST /api/handoffs/:id/accept
POST /api/handoffs/:id/reject

POST /api/batches/:id/location
GET  /api/batches/:id/locations

POST /api/batches/:id/evidence
GET  /api/batches/:id/evidence
GET  /api/evidence/:id

GET  /api/alerts
PATCH /api/alerts/:id/read
PATCH /api/alerts/:id/resolve

GET  /api/audit-logs

POST /api/provenance/check
```

Adapt names to the current codebase.

---

# 25. DATABASE

Extend PostgreSQL with appropriate normalized models:

```text
User
Organization
Role / Permission
Hive
Telemetry
Batch
BatchEvent
Handoff
Evidence
LocationRecord
Alert
AuditLog
```

Do not duplicate Fabric as a competing provenance source of truth.

Fabric remains the provenance ledger.

---

# 26. FABRIC

Application flow remains:

```text
Frontend
 ↓
Backend
 ↓
Fabric Gateway
 ↓
Chaincode
```

Never:

```text
Frontend → Fabric CLI
```

Potential provenance event metadata:

```text
actorId
organizationId
location
timestamp
evidenceHash
handoffId
```

Keep large telemetry and raw files off-chain.

The current Fabric network must not be reset.

If Fabric Gateway endorsement/signature issues remain, diagnose them honestly and fix them without replacing Fabric with an in-memory mock.

---

# 27. LIVE DEMO

Keep the existing top-level Live Demo.

It remains:

```text
Hive
 ↓
Telemetry
 ↓
AI
 ↓
Batch
 ↓
Fabric
 ↓
Processing
 ↓
Transport
 ↓
Packaging
 ↓
Verification
 ↓
QR
 ↓
Passport
```

Where practical, enhance it with:

```text
authenticated actor
organization
location
handoff
evidence
AI/provenance consistency
alerts
```

But keep Live Demo simple enough for judges.

Distinction:

```text
Live Demo       → guided judge-facing flow
Production UI   → real role-specific workflows
```

---

# 28. DEMO ACCOUNTS

Seed clearly labelled demo accounts, for example:

```text
admin@honeychain.demo
beekeeper@honeychain.demo
processor@honeychain.demo
transporter@honeychain.demo
packager@honeychain.demo
lab@honeychain.demo
```

Credentials must be environment-controlled or otherwise demo-safe.

Never commit real production credentials.

A `Use Demo Account` helper is acceptable only if normal authentication and authorization still run.

---

# 29. SECURITY

Implement:

- password hashing
- secure session/JWT handling
- protected routes
- backend authorization
- organization isolation
- input validation
- auth rate limiting if practical
- safe error responses
- CORS configuration
- environment secrets
- upload size limits
- MIME validation

Never expose:

```text
Fabric private keys
MSP credentials
JWT secrets
database passwords
```

to the frontend.

---

# 30. MULTI-TENANT ISOLATION

Organization-scoped users must only access permitted organization resources.

Example:

```text
Processor A
cannot access
Processor B private operational data
```

Admin may access all.

Consumer sees only published Passport information.

Derive identity from authenticated server-side context, not request body fields.

---

# 31. ERROR HANDLING

Handle at minimum:

```text
400 validation
401 unauthenticated
403 unauthorized
404 not found
409 invalid state/conflict
422 semantic validation
500 internal error
503 dependency unavailable
```

Fabric and AI failures must surface honestly.

Never return VERIFIED if verification actually failed.

---

# 32. TESTING

Add/update tests for:

## Auth

```text
register
login
wrong password
inactive user
/me
logout
```

## RBAC

```text
beekeeper cannot process
processor cannot package
transporter cannot approve users
packager cannot administer users
lab cannot edit transport
admin can administer
```

## Organization isolation

Users cannot access another organization's private resources.

## Location

```text
GPS accepted
manual fallback
invalid coordinates
location mismatch
distance calculation
```

## Handoff

```text
valid accept
invalid role
invalid state
reject with reason
duplicate accept
```

## Evidence

```text
upload
hash
metadata
invalid MIME
size limit
unauthorized access
```

## Consistency

```text
valid order
timestamp mismatch
quantity mismatch
location mismatch
AI anomaly correlation
```

## Alerts

```text
create
read
resolve
organization filtering
severity filtering
```

## Audit

Sensitive operations create audit records.

---

# 33. END-TO-END ACCEPTANCE

The following must work locally:

```text
ADMIN LOGIN
 ↓
approve organizations/users
 ↓
BEEKEEPER LOGIN
 ↓
register HIVE-042 with browser GPS
 ↓
IoT simulator sends normal telemetry
 ↓
real AI inference returns NORMAL
 ↓
create harvest
 ↓
create HC-2026-XXXX batch
 ↓
Fabric provenance transaction
 ↓
PROCESSOR LOGIN
 ↓
accept + process + evidence
 ↓
TRANSPORTER LOGIN
 ↓
accept + capture location + transport
 ↓
PACKAGER LOGIN
 ↓
accept + package + evidence
 ↓
QUALITY LAB LOGIN
 ↓
submit quality evidence
 ↓
Blockchain verification
+
AI consistency
+
location consistency
+
quantity consistency
+
timestamp consistency
 ↓
QR publication
 ↓
consumer opens Passport without login
```

---

# 34. REQUIRED FAILURE PROOFS

The system must demonstrate:

## AI anomaly

Normal telemetry → actual simulator → actual trained model → anomaly result.

## Location mismatch

Submit intentionally inconsistent coordinates → `LOCATION_MISMATCH`.

## Quantity mismatch

Create impossible quantity flow → `QUANTITY_INCONSISTENCY`.

## Unauthorized action

Beekeeper attempts packaging → backend returns `403`.

These are important judge-facing proofs.

---

# 35. MASTER SPEC UPDATE

Update `00_MASTER_SPEC.md` after implementation with:

- authentication
- roles
- permissions
- organizations
- onboarding
- location
- evidence
- handoffs
- state machine
- alerts
- audit logs
- consistency checks
- APIs
- database schema
- frontend routes
- environment variables
- implementation status
- limitations
- demo accounts
- test status

Do not mark incomplete features as complete.

---

# 36. IMPLEMENTATION ORDER

Use this order:

```text
A. Audit current code/schema/API

B. Database foundation
   User
   Organization
   Audit
   Alert
   Evidence
   Location metadata

C. Authentication
   Register
   Login
   Logout
   /me
   protected routes

D. RBAC
   permissions
   organization isolation
   resource authorization

E. Organization + onboarding
   admin approval
   user management

F. Role-specific dashboards

G. Location
   hive GPS
   transport GPS
   location records
   distance helper

H. Chain-of-custody
   accept
   reject
   handoff
   state transitions

I. Evidence
   upload
   hash
   metadata
   access control

J. Consistency engine
   location
   quantity
   timestamp
   AI anomaly correlation

K. Alerts

L. Audit logs

M. Admin System Verification

N. Live Demo integration

O. Full tests

P. Local E2E acceptance

ONLY THEN:
Cloud deployment
```

---

# 37. GIT COMMITS

Prefer logical commits:

```text
feat(auth): add production authentication
feat(rbac): add role and organization authorization
feat(orgs): add organization onboarding
feat(location): add browser location evidence
feat(workflow): add participant handoffs
feat(evidence): add evidence storage and hashing
feat(provenance): add consistency checks
feat(alerts): add alerts
feat(audit): add application audit logs
feat(admin): add operations dashboard
test(e2e): add production workflow tests
```

Never commit secrets, private keys, real passwords, private evidence or accidental generated artifacts.

---

# 38. DEFINITION OF DONE

Tier 1 + Tier 2 are complete only when:

- [ ] Real authentication works
- [ ] Passwords are hashed
- [ ] Backend authorization works
- [ ] RBAC works
- [ ] Organization isolation works
- [ ] Admin onboarding works
- [ ] Role-specific dashboards work
- [ ] Browser location works
- [ ] Hive location is recorded
- [ ] Transport location is recorded
- [ ] Location consistency works
- [ ] Chain-of-custody handoffs work
- [ ] Invalid actions are rejected
- [ ] Evidence uploads work
- [ ] Evidence is SHA-256 hashed
- [ ] Raw evidence stays off-chain
- [ ] Quantity consistency works
- [ ] Timestamp consistency works
- [ ] AI anomaly correlation works
- [ ] Alerts work
- [ ] Audit logs work
- [ ] Admin operations dashboard works
- [ ] System Verification shows real state
- [ ] Live Demo still works
- [ ] Honey Passport still works
- [ ] QR still works
- [ ] Fabric provenance still works
- [ ] Existing trained ML model still works
- [ ] Local E2E passes
- [ ] Unauthorized-action test passes
- [ ] AI anomaly test passes
- [ ] Location mismatch test passes
- [ ] No secrets committed
- [ ] Master Spec updated

---

# 39. FINAL PRODUCT STANDARD

The finished product should feel like:

```text
Authenticated ecosystem
        ↓
Organizations + roles
        ↓
Real participant actions
        ↓
Location + evidence
        ↓
AI intelligence
        ↓
Permissioned blockchain provenance
        ↓
Chain-of-custody
        ↓
Verification
        ↓
Consumer Honey Passport
```

The target is not "more features".

The target is:

**credible end-to-end honey traceability.**
