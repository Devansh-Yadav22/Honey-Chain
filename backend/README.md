# Backend — Honey Chain

Node.js + TypeScript + Express backend for the Honey Chain platform.

## Setup

```bash
cd backend
npm install
npm run dev
```

## Structure

```
backend/
├── src/
│   ├── config/        # Database, env, Fabric config
│   ├── models/        # Database models / ORM entities
│   ├── routes/        # Express route definitions
│   ├── controllers/   # Request handlers
│   ├── services/      # Business logic & external service adapters
│   ├── middleware/     # Express middleware (validation, auth, error)
│   ├── types/         # Shared TypeScript types
│   ├── utils/         # Utility functions
│   └── index.ts       # Server entry point
├── package.json
├── tsconfig.json
└── Dockerfile
```

## API Endpoints

### Hives
- `POST /api/hives` — Register a new hive
- `GET  /api/hives` — List all hives
- `GET  /api/hives/:id` — Get hive details

### Telemetry
- `POST /api/telemetry` — Ingest telemetry data
- `GET  /api/hives/:id/telemetry` — Get telemetry for a hive

### AI
- `GET  /api/hives/:id/health` — Get AI health score
- `GET  /api/hives/:id/anomalies` — Get anomaly detection
- `GET  /api/hives/:id/productivity` — Get yield prediction
- `POST /api/provenance/check` — Provenance consistency check

### Batches
- `POST /api/batches` — Create a batch
- `GET  /api/batches` — List all batches
- `GET  /api/batches/:id` — Get batch details
- `GET  /api/batches/:id/timeline` — Get batch timeline

### Passport
- `GET  /api/passport/:batchId` — Get Honey Passport data
