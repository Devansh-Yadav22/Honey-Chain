# AI Service — Honey Chain

Python + FastAPI service providing hive intelligence and provenance consistency analysis for Honey Chain.

---

## Architecture & Principles

- **Blockchain**: Preserves immutable provenance and transaction records.
- **AI Service**: Analyzes hive telemetry and transaction consistency against learned evidence.
- **Scientific Honesty**: The model predicts hive telemetry anomaly patterns (severity, score, and explainable feature deviations); it does not claim to diagnose diseases or prove honey purity without physical lab assay data.

---

## Repository Structure

```text
ai/
├── app/
│   ├── main.py                  # FastAPI application entry point
│   ├── config.py                # Environment configuration
│   ├── routers/
│   │   ├── health.py            # POST /ai/health (Health score & assessment)
│   │   ├── anomaly.py           # POST /ai/anomaly (ML anomaly detection)
│   │   ├── yield_prediction.py   # POST /ai/yield (Productivity forecasting)
│   │   └── provenance.py        # POST /ai/provenance/check (Consistency engine)
│   ├── services/
│   │   └── ml_service.py        # Singleton model loader & hybrid inference engine
│   ├── schemas/                 # Pydantic request/response schemas
│   │   └── telemetry.py
│   └── utils/
├── data/
│   └── processed/
│       └── hobos_aligned_telemetry.csv  # Cleaned & synchronized HOBOS dataset
├── models/
│   ├── hive_anomaly.joblib      # Serialized Isolation Forest model bundle
│   └── metadata.json            # Model version, parameters, & validation metrics
├── training/
│   ├── inspect_dataset.py       # Dataset audit & integrity checking
│   ├── preprocess.py            # Data cleaning & hourly alignment pipeline
│   ├── feature_engineering.py   # Feature extraction for training and inference
│   ├── train.py                 # Leakage-safe temporal training pipeline
│   └── evaluate.py              # Out-of-sample evaluation & stress tests
├── tests/
│   └── test_ml_pipeline.py      # Unit & integration test suite
├── requirements.txt
├── Dockerfile
└── README.md
```

---

## ML Pipeline & Training

The anomaly model is trained on the real-world **HOBOS hive telemetry dataset** (Würzburg and Schwartau stations, 2017–2019), consisting of synchronized multi-sensor streams (`temperature`, `humidity`, `weight`, and `bee activity/flow`).

### 1. Preprocess & Align Data
Cleans physical sensor dropouts, normalizes bee traffic to an activity index (0.0–1.0), and resamples signals into hourly bins:
```bash
python ai/training/preprocess.py
```

### 2. Train Model
Applies a leakage-safe temporal train/test split (2017–2018 training, 2019 held-out test), trains an **Isolation Forest** model, and calibrates severity thresholds:
```bash
python ai/training/train.py
```

### 3. Evaluate & Stress Test
Evaluates on the held-out 2019 test set and tests controlled biological anomaly scenarios (overheating, swarming weight drops, dampness):
```bash
python ai/training/evaluate.py
```

### 4. Run Test Suite
```bash
python ai/tests/test_ml_pipeline.py
```

---

## Running the AI Service

```bash
cd ai
# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/ai/anomaly` | `POST` | ML anomaly detection with calibrated severity (`CRITICAL`, `WARNING`, `NONE`) and explainable reasons |
| `/ai/health` | `POST` | Hive health status (`NORMAL`, `WARNING`, `CRITICAL`) and 0–100 health score |
| `/ai/yield` | `POST` | Productivity / harvest yield forecasting |
| `/ai/provenance/check` | `POST` | Provenance quantity consistency checking against blockchain records |
| `/health-check` | `GET` | Service liveness probe |
