# Frontend — Honey Chain

React + TypeScript + Vite application for the Honey Chain platform.

## Setup

```bash
cd frontend
npm install
npm run dev
```

## Structure

```
frontend/
├── public/            # Static assets
├── src/
│   ├── assets/        # Images, icons, fonts
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page-level components
│   ├── services/      # API service layer
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Root application component
│   └── main.tsx       # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── Dockerfile
```

## Pages

- **Dashboard** — Overview of hives, batches, alerts
- **Hive Dashboard** — Individual hive telemetry and AI health
- **Batch Page** — Batch timeline and provenance
- **Honey Passport** — Consumer-facing QR verification page
