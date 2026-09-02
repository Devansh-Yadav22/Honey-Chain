# AI Service — Honey Chain

Python + FastAPI service providing hive intelligence and provenance consistency analysis.

## Setup

```bash
cd ai
python -m venv venv
source venv/bin/activate      # Linux/Mac
# venv\Scripts\activate       # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Structure

```
ai/
├── app/
│   ├── main.py            # FastAPI application entry point
│   ├── routers/
│   │   ├── health.py      # POST /ai/health
│   │   ├── anomaly.py     # POST /ai/anomaly
│   │   ├── yield_.py      # POST /ai/yield
│   │   └── provenance.py  # POST /ai/provenance/check
│   ├── models/            # ML model loading & inference
│   ├── schemas/           # Pydantic request/response schemas
│   └── utils/             # Helper functions
├── data/                  # Training data & datasets
├── notebooks/             # Jupyter notebooks for exploration
├── models/                # Saved model artifacts (.pkl, .pt)
├── requirements.txt
├── Dockerfile
└── README.md
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/ai/health` | POST | Hive health score & status (NORMAL / WARNING / CRITICAL) |
| `/ai/anomaly` | POST | Anomaly detection with severity & reasons |
| `/ai/yield` | POST | Productivity / yield prediction |
| `/ai/provenance/check` | POST | Provenance consistency engine |
