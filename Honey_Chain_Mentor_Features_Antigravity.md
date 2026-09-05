# Honey Chain — Mentor Features & UX Development Spec
## SIH26021 | Antigravity Implementation Brief

## Mission
Modify the EXISTING Honey Chain application. Do not rebuild it from scratch. Preserve working AI, blockchain, provenance, batch, quality/lab, authentication, RBAC, dashboards, QR Passport, and backend functionality.

Implement:
1. Two provenance/business models:
   - DIRECT_BEEKEEPER: consumer buys directly from a registered beekeeper.
   - COMPANY_MANAGED: one company manages the chain from hive/beekeeper through processing/production/transport/quality/packaging.
2. Multilingual support, minimum English + Hindi.
3. A proper public landing page as the first experience, with Sign In and Verify/Scan Honey entry points, product information, and relevant visuals.

---

# 1. TWO BUSINESS MODELS

Both models must live inside the SAME Honey Chain platform. Do not build two separate applications.

Use an explicit batch/product field, preferably:

```text
provenanceModel
DIRECT_BEEKEEPER
COMPANY_MANAGED
```

Use existing naming conventions if an equivalent already exists.

## A. DIRECT_BEEKEEPER

Flow:

```text
Registered Beekeeper
      ↓
Hive
      ↓
Harvest
      ↓
Honey Batch/Product
      ↓
QR generated at beekeeper level
      ↓
Consumer buys directly
      ↓
Consumer scans QR
      ↓
Public Honey Passport
```

The beekeeper must be registered on the portal.

The Passport should show appropriate public information such as:
- beekeeper/display name
- hive
- origin/location
- harvest
- quantity
- available quality evidence
- provenance/blockchain status

Do not require processing, transport, or packaging stages for this model.

## B. COMPANY_MANAGED

Flow:

```text
Company
  ↓
Beekeepers
  ↓
Hives / Apiaries
  ↓
Harvest
  ↓
Processing
  ↓
Production
  ↓
Transport (if applicable)
  ↓
Quality/Lab
  ↓
Packaging
  ↓
Final Product
  ↓
QR
  ↓
Consumer Passport
```

The company may have data about its registered/authorized beekeepers, hives, processing, production, quality, transportation and packaging.

The Passport should display only information that the company has actually recorded and is authorized to publish.

Do not invent missing stages.

---

# 2. BATCH CREATION

When an authorized user creates a batch, provide:

**How will this honey be sold / managed?**

- Direct from Beekeeper
- Company Managed Production

Descriptions:

**Direct from Beekeeper**
"Consumer buys directly from the registered beekeeper."

**Company Managed Production**
"Company manages the production chain from hive/harvest through processing and packaging."

Store and validate the selected model server-side. Do not rely only on frontend state.

---

# 3. DATA MODEL

Inspect the existing schema first. Extend it instead of duplicating it.

A batch/product should support, where applicable:

- batch ID
- product ID
- provenance model
- hive ID
- beekeeper ID
- organization/company ID
- harvest
- quantity
- origin/location
- QR/passport identifier
- creation/publication information

DIRECT_BEEKEEPER should associate:

```text
Batch
 ├── Beekeeper
 ├── Hive
 ├── Harvest
 ├── Quantity
 ├── Quality evidence (if available)
 └── Passport
```

COMPANY_MANAGED should associate:

```text
Company
 ├── Beekeepers
 ├── Hives
 ├── Harvest
 ├── Processing
 ├── Production
 ├── Transport
 ├── Quality
 ├── Packaging
 └── Final Product/Batch
```

Do not add duplicate fields where equivalent existing fields already exist.

If a migration is needed:
- create a proper migration
- preserve existing data
- do not recreate the database
- give existing batches a safe default based on their actual data

---

# 4. DIRECT BEEKEEPER WORKFLOW

Provide a focused workflow where a beekeeper can:

1. Register/login.
2. Maintain beekeeper profile.
3. Register/select hive.
4. Record hive/origin information.
5. Record harvest.
6. Create a DIRECT_BEEKEEPER batch/product.
7. Add available quality evidence.
8. Generate QR.
9. Preview the Passport.
10. Share QR with consumer.

Consumer does not need an account to view the public Passport.

---

# 5. COMPANY WORKFLOW

Use the existing organization/company architecture.

Authorized company users should be able to manage/view:

```text
Company
 ↓
Beekeepers
 ↓
Hives
 ↓
Harvest
 ↓
Processing
 ↓
Transport
 ↓
Quality
 ↓
Packaging
 ↓
Final Product
```

Do not force optional stages to exist.

---

# 6. PASSPORT / QR

The existing QR Passport must support both models.

For DIRECT_BEEKEEPER:

```text
HONEY PASSPORT

Provenance Model:
Direct from Beekeeper

Beekeeper:
<public name>

Hive:
<hive>

Origin:
<location>

Harvest:
<date>

Quantity:
<quantity>

Quality Evidence:
<if available>

Blockchain Provenance:
<status>
```

For COMPANY_MANAGED:

```text
HONEY PASSPORT

Provenance Model:
Company Managed

Company:
<company>

Beekeeper / Source:
<authorized information>

Hive / Origin:
<information>

Harvest:
<information>

Processing:
<information>

Transport:
<information>

Quality:
<information>

Packaging:
<information>

Blockchain Provenance:
<status>
```

QR must contain a URL/identifier, not the entire dataset.

Existing `/passport/<batchId>` routes must continue working.

Passport must be public/read-only without login.

Never expose private/internal data.

---

# 7. PUBLIC VS PRIVATE DATA

Do not expose the entire database object through the public Passport.

Public data must be explicitly selected by the backend.

Never expose:
- passwords
- private credentials
- internal organization information
- private addresses/contact data
- internal admin notes
- private audit information
- Fabric credentials
- backend secrets

---

# 8. MULTILINGUAL SUPPORT

Implement proper i18n rather than scattered language conditionals.

Minimum:
- English
- Hindi

Design so additional Indian languages can be added later:
- Marathi
- Gujarati
- Bengali
- Tamil
- Telugu
- Kannada
- Malayalam
- Punjabi

Do not implement every language unless practical.

Use centralized translation resources, conceptually:

```text
locales/
  en/
  hi/
```

Support interpolation for dynamic values.

Translate:
- landing page
- navbar
- public Passport
- Verify Honey flow
- authentication screens
- major dashboard UI
- buttons
- errors
- empty/loading states
- batch/provenance labels

Do not leave major user-facing strings unintentionally hard-coded.

---

# 9. LANGUAGE SELECTOR

Add a visible language selector to:
- public landing page/navbar
- Passport
- authenticated application navigation/settings

Minimum options:

```text
English
हिन्दी
```

Persist the user's language choice across sessions where appropriate.

Language switching must not interfere with authentication or routing.

---

# 10. NEW LANDING PAGE

The root URL `/` must become the public Honey Chain landing page.

Unauthenticated users should NOT be dropped directly into an admin/dashboard screen.

Flow:

```text
/
Landing Page
  ├── Sign In
  ├── Verify / Scan Honey
  └── Learn About Honey Chain
```

After authentication, redirect the user to the correct role-based application.

---

# 11. LANDING PAGE CONTENT

Create a polished SIH-level landing page.

## Hero

Brand:
**Honey Chain**

Core message:
**Transparent and traceable honey provenance powered by Blockchain, AI and IoT.**

Primary CTA:
**Verify Honey**

Secondary CTA:
**Sign In**

Avoid unsupported claims such as "blockchain guarantees purity."

## How It Works

Show:

```text
Hive
 ↓
Harvest
 ↓
Processing
 ↓
Quality
 ↓
Packaging
 ↓
Honey Passport
```

Also explain the direct model:

```text
Hive
 ↓
Harvest
 ↓
Registered Beekeeper
 ↓
Honey Passport
```

## Why Honey Chain

Explain:
- traceability
- transparent provenance
- AI-powered anomaly detection
- blockchain-backed records
- quality evidence
- consumer verification

## Two Ways Honey Chain Works

Clearly explain:
- Direct from Beekeeper
- Company Managed Production

## Technology

Briefly introduce:
- Hyperledger Fabric
- AI/ML
- IoT telemetry
- QR Honey Passport

## Consumer Verification

"Scan the QR on your honey to view its recorded journey."

## Final CTA

- Verify Honey
- Sign In
- Explore Honey Chain

---

# 12. LANDING PAGE VISUALS

The landing page must contain relevant, high-quality visuals.

Use appropriate imagery such as:
- bees
- beehives
- beekeepers
- honey harvesting
- processing
- honey jars
- packaging
- QR scanning
- natural honey production

Prefer existing project assets when suitable.

Do not use random unrelated imagery.

Optimize images for performance and mobile.

Maintain a coherent Honey Chain visual identity.

---

# 13. VERIFY / SCAN HONEY

Add an obvious public entry point:

**Scan / Verify Honey**

Provide:
1. QR camera scanning where supported.
2. Manual Passport/Batch ID entry as fallback.

Flow:

```text
Landing Page
 ↓
Verify Honey
 ↓
Scan QR OR enter Passport ID
 ↓
Public Honey Passport
```

Camera permission denial/unavailability must not block manual verification.

No login should be required for public verification.

---

# 14. NAVBAR

Public navbar should include something similar to:

```text
Honey Chain
Home
How It Works
Technology
Verify Honey
About
Language
Sign In
```

Use the existing design system where possible.

After login, use role-aware authenticated navigation.

Do not expose admin navigation to consumers.

---

# 15. AUTHENTICATION / RBAC

Preserve the existing real authentication implementation.

Production flow:

```text
Login
 ↓
Firebase Authentication
 ↓
Backend authorization
 ↓
Role + Organization
 ↓
Correct dashboard
```

Do not reintroduce unrestricted persona switching as production authentication.

If a development persona switcher exists, it must remain development-only.

---

# 16. ROLE-AWARE APPLICATION

Preserve existing roles:

- ADMIN
- BEEKEEPER
- PROCESSOR
- TRANSPORTER
- PACKAGER
- QUALITY_LAB
- CONSUMER

Do not create duplicate dashboards.

Extend existing dashboards only where required for the new business models.

---

# 17. COMPANY PROFILE

Use the existing organization abstraction if it already exists.

A company/organization should be able to associate:
- authorized users
- beekeepers
- hives/apiaries
- production records

Do not create a second parallel company system.

---

# 18. BEEKEEPER PROFILE

For DIRECT_BEEKEEPER:
- beekeeper must be a registered participant
- profile should have appropriate public information
- do not expose private personal information

Potential public information:
- display name
- region
- apiary/origin
- verification/registration status if supported

---

# 19. BLOCKCHAIN

Do not bypass Hyperledger Fabric.

DIRECT_BEEKEEPER:

```text
Beekeeper/Hive
 ↓
Harvest/Batch
 ↓
Fabric provenance
 ↓
QR Passport
```

COMPANY_MANAGED:

```text
Hive/Beekeeper
 ↓
Harvest
 ↓
Processing
 ↓
Transport
 ↓
Packaging
 ↓
Fabric provenance
 ↓
QR Passport
```

Reuse existing chaincode/provenance structures wherever possible.

Only extend chaincode if genuinely required.

Do not create fake blockchain events.

---

# 20. AI / PROVENANCE CONSISTENCY

Preserve existing AI:
- hive health
- anomaly detection
- productivity/yield prediction
- provenance consistency

The verification logic must support both models.

DIRECT_BEEKEEPER should not be considered suspicious merely because processing/transport/packaging events do not exist.

COMPANY_MANAGED should be checked against applicable recorded events.

Do not claim AI proves purity or diagnoses disease.

---

# 21. API

Inspect current APIs first.

Likely affected:
- `/api/batches`
- `/api/passport`
- `/api/hives`
- `/api/users`
- `/api/organizations`
- `/api/quality`
- `/api/provenance`

Extend existing APIs instead of duplicating them.

Validate `provenanceModel` server-side.

Conceptually:

```json
{
  "provenanceModel": "DIRECT_BEEKEEPER"
}
```

or:

```json
{
  "provenanceModel": "COMPANY_MANAGED"
}
```

Use the actual project's validation conventions.

---

# 22. ADMIN

Admin should be able to distinguish the two models.

Where appropriate add:
- total batches
- Direct Beekeeper batches
- Company Managed batches
- registered beekeepers
- companies
- published Passports
- verified provenance
- suspicious provenance

Reuse existing dashboard components.

---

# 23. RESPONSIVE / ACCESSIBILITY

Prioritize mobile because consumers will scan QR codes on phones.

Test:
- mobile
- tablet
- desktop

Include:
- semantic controls
- keyboard access
- readable contrast
- alt text
- accessible language selector
- clear loading/error states

---

# 24. PERFORMANCE

- optimize landing images
- lazy-load large visuals where appropriate
- avoid unnecessary dependencies
- don't block initial rendering on nonessential API calls
- keep Passport fast

---

# 25. TESTING

Add/update tests for:

## Business models
- DIRECT_BEEKEEPER creation
- COMPANY_MANAGED creation
- invalid model rejected
- correct Passport for each
- existing batch compatibility

## Authorization
- beekeeper can create direct batch
- unauthorized user cannot act for another beekeeper
- company user can access authorized company data
- consumer can access public Passport
- consumer cannot access protected participant data

## QR
- direct Passport
- company Passport
- existing Passport route

## i18n
- English
- Hindi
- language switching
- persisted language
- dynamic values preserved

## Landing
- `/` is public
- Sign In works
- Verify Honey works
- manual Passport ID works
- QR scanning entry exists

---

# 26. HONEST PRODUCT CLAIMS

Use:
- Traceable honey provenance
- Blockchain-backed provenance records
- AI-powered anomaly detection
- Evidence-based verification
- Recorded journey from hive to jar
- Quality evidence

Avoid:
- Blockchain guarantees purity
- Blockchain prevents adulteration
- AI proves purity
- 100% pure because it is on blockchain

Blockchain preserves recorded provenance; it does not independently prove physical honey quality.

---

# 27. DO NOT MOCK

Do not add fake statistics or fake records just to make the landing page/dashboard look impressive.

Do not hard-code fake:
- beekeeper counts
- hive counts
- verification percentages
- company records
- lab results
- blockchain transactions

If a metric is illustrative, label it clearly as such.

---

# 28. IMPLEMENTATION ORDER

1. Audit current architecture and data model.
2. Identify reusable existing structures.
3. Add provenance model safely.
4. Update backend validation/API.
5. Add migration if required.
6. Update blockchain only if required.
7. Update batch creation UI.
8. Implement Direct Beekeeper workflow.
9. Implement Company Managed workflow.
10. Update Passport.
11. Implement centralized i18n.
12. Add English + Hindi.
13. Add language selector.
14. Build public landing page.
15. Add Verify/Scan Honey entry point.
16. Add relevant visuals.
17. Update public/authenticated routing.
18. Add tests.
19. Build and test.
20. Verify existing functionality has not regressed.

---

# 29. ACCEPTANCE CRITERIA

## Landing
- [ ] `/` opens public landing page
- [ ] Sign In works
- [ ] Verify Honey works
- [ ] relevant information is present
- [ ] relevant visuals are present
- [ ] mobile layout works

## Direct Beekeeper
- [ ] registered beekeeper can create direct batch
- [ ] hive and harvest can be associated
- [ ] QR can be generated
- [ ] consumer can open Passport without login
- [ ] Passport clearly says Direct from Beekeeper
- [ ] appropriate beekeeper/hive/harvest information is shown

## Company Managed
- [ ] company can manage authorized production data
- [ ] beekeeper/hive can be associated
- [ ] harvest works
- [ ] processing works
- [ ] transport works where applicable
- [ ] quality works
- [ ] packaging works
- [ ] QR Passport shows actual recorded stages
- [ ] Passport clearly says Company Managed

## Blockchain
- [ ] both models preserve blockchain provenance architecture
- [ ] no fake blockchain confirmation
- [ ] applicable provenance events use existing Fabric flow

## AI
- [ ] existing AI still works
- [ ] provenance verification supports both models
- [ ] missing optional stages are not falsely flagged

## Multilingual
- [ ] English works
- [ ] Hindi works
- [ ] language selector works
- [ ] selection persists
- [ ] Passport supports language switching

## Existing functionality
- [ ] authentication
- [ ] RBAC
- [ ] dashboards
- [ ] telemetry
- [ ] anomaly detection
- [ ] quality/lab
- [ ] quantity consistency
- [ ] existing QR routes

all continue to work.

---

# 30. FINAL REPORT

After implementation, report:

1. Files changed.
2. Database migrations.
3. API changes.
4. Frontend changes.
5. Blockchain changes.
6. i18n implementation.
7. New routes.
8. Tests executed.
9. Build status.
10. Known limitations.
11. Any deviation from this specification.

Do not claim completion if an acceptance criterion fails.

---

# FINAL PRODUCT MODEL

Honey Chain must now support:

### PATH A — DIRECT BEEKEEPER

```text
Registered Beekeeper
      ↓
Hive
      ↓
Harvest
      ↓
Honey Batch
      ↓
QR
      ↓
Consumer Passport
```

### PATH B — COMPANY MANAGED

```text
Company
   ↓
Beekeepers
   ↓
Hives
   ↓
Harvest
   ↓
Processing
   ↓
Transport
   ↓
Quality
   ↓
Packaging
   ↓
QR
   ↓
Consumer Passport
```

Both paths are part of the same Honey Chain platform.

START BY AUDITING THE CURRENT CODEBASE, THEN IMPLEMENT THE FEATURES WITHOUT BREAKING EXISTING FUNCTIONALITY.
