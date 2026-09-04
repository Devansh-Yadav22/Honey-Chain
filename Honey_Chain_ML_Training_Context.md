# Honey Chain --- ML Model Training Context

## SIH26021 \| Bee-Tech \| HOBOS Hive Telemetry

### Purpose

This document is the working context/specification for the AI/ML
engineer or coding agent responsible for training and integrating the
first real ML model for Honey Chain.

**Important:** Preserve the existing Honey Chain architecture, API
boundaries, and integration contracts unless a change is necessary and
explicitly documented.

------------------------------------------------------------------------

# 1. Project Context

**Honey Chain --- SIH26021** is a blockchain-based honey traceability
and smart beekeeping management platform for Smart India Hackathon 2026.

## Core architecture

``` text
HIVE
  ↓
IoT / simulated telemetry
  ↓
AI / Hive Intelligence
  ↓
Backend
  ↓
Hyperledger Fabric
  ↓
Batch / Processing / Transport / Packaging
  ↓
Honey Passport / QR
  ↓
Consumer
```

The AI layer is the intelligence/evidence-analysis layer.

The blockchain is the provenance/trust layer.

IoT is the physical/evidence layer.

## Core principle

> **Blockchain preserves what was recorded. Our AI checks whether the
> record is consistent with available evidence.**

Do NOT claim: - blockchain prevents honey adulteration - blockchain
proves honey purity - an ML model diagnoses bee disease unless the
training data genuinely supports that claim

The first ML model should detect **abnormal hive telemetry patterns /
anomalies** and provide explainable evidence.

------------------------------------------------------------------------

# 2. Current ML Goal

Replace the current Phase-1 rule-based anomaly logic with a **real
trained ML model**.

## Primary task

### Hive telemetry anomaly detection

The model should identify unusual patterns such as: - abnormal
temperature - abnormal humidity - unusual hive-weight changes - unusual
bee activity/flow - unusual combinations of these signals - unusual
temporal behavior

## Desired conceptual output

``` json
{
  "anomaly": true,
  "severity": "HIGH",
  "anomalyScore": 0.91,
  "reasons": [
    "Abnormal temperature pattern",
    "Rapid weight change",
    "Unusual bee activity"
  ]
}
```

If the existing AI API uses different exact field names, inspect and
preserve the existing contract rather than introducing an incompatible
one.

------------------------------------------------------------------------

# 3. Dataset Decision

## Selected dataset

**HOBOS honey-bee hive telemetry dataset**, downloaded from Kaggle.

It was selected because its telemetry is closely aligned with Honey
Chain's planned IoT schema.

Expected/target signals include:

``` text
temperature
humidity
weight
bee activity / bee flow
timestamp
hive identifier
```

## Critical instruction

Do **NOT** assume the exact filenames, column names, units, sampling
interval, or event labels.

The Kaggle copy must be inspected first.

Before training:

1.  List all files.
2.  Identify the actual data files.
3.  Inspect schemas.
4.  Determine sampling frequency.
5.  Determine missing-value patterns.
6.  Determine units and value ranges.
7.  Identify hive identifiers.
8.  Identify whether documented abnormal events are present.
9.  Identify whether bee activity/flow is directly available or needs
    transformation.
10. Document the findings.

Do not silently fabricate or reinterpret dataset semantics.

------------------------------------------------------------------------

# 4. Dataset Integrity

Treat HOBOS as real-world telemetry.

Explicitly inspect: - missing values - duplicated timestamps - duplicate
records - sensor dropouts - impossible/clearly erroneous values -
irregular sampling - unit inconsistencies - long gaps - hive-specific
distributions - seasonal/time-of-day effects

Do not automatically delete unusual observations merely because they
look anomalous.

Unusual observations may be exactly what the anomaly detector should
learn about.

Distinguish:

``` text
sensor/data corruption
        vs
real biological/environmental anomaly
```

Document every important filtering rule.

------------------------------------------------------------------------

# 5. ML Strategy

## Preferred first model

Start with a classical anomaly-detection approach.

**Recommended candidate: Isolation Forest**

Why: - designed for anomaly detection - does not require exhaustive
anomaly labels - fast to train - lightweight - easy to deploy locally -
suitable for a FastAPI service - appropriate for an SIH prototype

However, **do not blindly commit to Isolation Forest before inspecting
the dataset**.

Consider alternatives only if the data supports them: - Local Outlier
Factor - One-Class SVM - robust statistical baseline - supervised
classifier if reliable event labels exist - time-series-specific anomaly
detection

Implement a simple baseline before adding complexity.

------------------------------------------------------------------------

# 6. Real ML Pipeline

We want a genuine reproducible ML pipeline, not a fake/demo model.

``` text
Raw HOBOS data
      ↓
Data validation
      ↓
Cleaning
      ↓
Feature engineering
      ↓
Train/validation/test split
      ↓
Model training
      ↓
Evaluation
      ↓
Threshold calibration
      ↓
Model serialization
      ↓
FastAPI inference
      ↓
Honey Chain backend
```

Record: - dataset version/source - preprocessing version - feature
list - model algorithm - hyperparameters - training date - random seed -
evaluation metrics - model version

------------------------------------------------------------------------

# 7. Avoid Data Leakage

This is mandatory.

Do NOT randomly split individual rows from the same continuous hive time
series into train and test and then claim strong generalization.

Prefer:

## Temporal split

``` text
Earlier period → training
Later period   → validation/test
```

and/or:

## Hive/generalization split

``` text
Hives A/B/C/... → training
Held-out hive(s) → test
```

A strong experiment may use both.

Document the actual strategy used.

------------------------------------------------------------------------

# 8. Feature Engineering

Start from the actual available HOBOS fields.

Target signals:

``` text
temperature
humidity
weight
activity/flow
```

Potential temporal features:

``` text
hour
day_of_week
day_of_year
month
```

Potential rolling/statistical features:

``` text
temperature_rolling_mean
temperature_rolling_std
humidity_rolling_mean
humidity_rolling_std
weight_change
activity_change
weight_rate
activity_rate
temperature_change
humidity_change
```

Window sizes must be selected according to the **actual dataset sampling
frequency**.

Do not hard-code a 5-minute/1-hour/etc. window until sampling frequency
is verified.

Weight should be treated as a time series; changes/rates/trends can be
more informative than its absolute value.

------------------------------------------------------------------------

# 9. Anomaly Scenarios

The model should be useful for:

### Temperature anomaly

``` text
normal hive temperature pattern
          ↓
sustained abnormal temperature
          ↓
anomaly
```

### Humidity anomaly

``` text
normal humidity
      ↓
unusual sustained increase
      ↓
anomaly
```

### Weight anomaly

``` text
normal weight trajectory
        ↓
unexpected rapid change
        ↓
potential anomaly
```

### Activity anomaly

``` text
normal activity
      ↓
sudden prolonged reduction
      ↓
potential anomaly
```

### Multivariate anomaly

``` text
temperature ↑
humidity ↑
activity ↓
weight changes unexpectedly
          ↓
     joint anomaly
```

The model should be capable of recognizing abnormal combinations, not
just independent threshold violations.

------------------------------------------------------------------------

# 10. Ground Truth and Synthetic Augmentation

First inspect whether HOBOS contains documented events.

Use documented events where appropriate.

Do NOT pretend: - every unusual point is ground-truth anomaly - every
synthetic point is a real-world observation

If controlled synthetic anomalies are added, keep them separate from
real observations and clearly label them.

Possible synthetic anomaly types: - temperature spike - humidity shift -
weight discontinuity - activity drop - combined multivariate disturbance

Synthetic anomalies should be plausible, not arbitrary random noise.

**Synthetic anomalies must not contaminate the final test set.**

------------------------------------------------------------------------

# 11. Evaluation

Where reliable labels exist, evaluate using: - precision - recall -
F1-score - ROC-AUC - PR-AUC - false-positive rate - false-negative rate

For anomaly scores, inspect: - score distribution - threshold behavior -
event detection rate - true positives - false positives - false
negatives

If reliable labels are unavailable, report appropriate unsupervised
diagnostics and clearly state the limitation.

**Never fabricate metrics.**

------------------------------------------------------------------------

# 12. Severity

Map the continuous anomaly score to:

``` text
NORMAL
WARNING
CRITICAL
```

Thresholds should be calibrated using validation data where possible,
rather than arbitrary numbers.

Conceptually:

``` text
low anomaly score    → NORMAL
medium anomaly score → WARNING
high anomaly score   → CRITICAL
```

The exact thresholds must be experimentally determined.

------------------------------------------------------------------------

# 13. Explainability

The AI output must be understandable to users and judges.

Prefer:

``` json
{
  "anomaly": true,
  "anomalyScore": 0.91,
  "severity": "HIGH",
  "reasons": [
    "Temperature deviated significantly from learned hive patterns",
    "Hive weight changed unusually rapidly",
    "Bee activity dropped below its expected pattern"
  ]
}
```

For Isolation Forest, use an appropriate explanation method or post-hoc
feature diagnostics.

Do not claim that a heuristic explanation is an exact mathematical
feature attribution unless it actually is.

------------------------------------------------------------------------

# 14. Global vs Hive-Specific Modeling

Investigate:

## Global model

One model across multiple hives.

Advantages: - simple deployment - easier scaling - works for new hives

## Hive-normalized approach

Account for each hive's baseline behavior.

Advantages: - different hives have different normal ranges - can reduce
false positives

A practical solution may be:

``` text
Global model
+
per-hive baseline/statistics
```

Do not create separate models for every hive unless the data clearly
justifies it.

------------------------------------------------------------------------

# 15. Honey Chain IoT Compatibility

Current application telemetry is approximately:

``` json
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

The model must ultimately accept the telemetry required by the existing
AI API.

Internal training representation may differ, but the external API
contract should remain clean and stable.

------------------------------------------------------------------------

# 16. Existing AI Service

The AI service is Python/FastAPI.

Existing conceptual endpoints include: - health - anomaly - provenance -
yield prediction

The current anomaly/health implementation is rule-based Phase-1 logic.

The trained model should replace or augment anomaly inference **without
breaking existing backend integration**.

Current backend configuration:

``` text
AI_SERVICE_URL=http://ai:8000
```

Do not change the service boundary just to train the model.

------------------------------------------------------------------------

# 17. Repository Context

``` text
honey-chain/
├── README.md
├── 00_MASTER_SPEC.md
├── docker-compose.yml
├── .env.example
├── docs/
├── backend/
├── frontend/
├── blockchain/
├── ai/
├── iot/
├── data/
└── tests/
```

The AI service already exists.

Inspect the actual current files before modifying them.

------------------------------------------------------------------------

# 18. Recommended ML Structure

Extend the existing AI service rather than creating a separate unrelated
project.

Suggested:

``` text
ai/
├── app/
│   ├── main.py
│   ├── routers/
│   ├── schemas/
│   └── services/
│       └── ml_model.py
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── README.md
│
├── models/
│   ├── hive_anomaly.joblib
│   └── metadata.json
│
├── training/
│   ├── inspect_dataset.py
│   ├── preprocess.py
│   ├── train.py
│   ├── evaluate.py
│   └── feature_engineering.py
│
├── tests/
├── requirements.txt
└── Dockerfile
```

Adapt this to the existing repository instead of creating duplicates.

------------------------------------------------------------------------

# 19. Model Artifact

Save the model in a reproducible format, for example:

``` text
models/hive_anomaly.joblib
```

Also save metadata:

``` json
{
  "model_version": "hive-anomaly-v1",
  "algorithm": "IsolationForest",
  "features": [],
  "training_dataset": "HOBOS Kaggle dataset",
  "random_seed": 42,
  "metrics": {}
}
```

The actual metadata must reflect reality.

**Never insert fake metrics.**

------------------------------------------------------------------------

# 20. Reproducibility

Training should be reproducible with a documented command such as:

``` bash
python training/train.py
```

Use: - fixed random seed - deterministic preprocessing where practical -
explicit feature list - explicit model parameters - recorded dataset
version/source

------------------------------------------------------------------------

# 21. Integration

After training:

``` text
HOBOS
  ↓
trained model
  ↓
models/hive_anomaly.joblib
  ↓
FastAPI ML service
  ↓
POST anomaly request
  ↓
prediction
  ↓
backend
  ↓
frontend dashboard
```

Load the model once when the service starts rather than
retraining/loading it on every request.

Training logic must remain separate from inference logic.

------------------------------------------------------------------------

# 22. Performance

The model must be lightweight enough for local Docker deployment.

Target: - no GPU required - quick model loading - near-real-time
inference - no external ML API - works inside the existing AI container

Measure inference time if useful.

------------------------------------------------------------------------

# 23. SIH Demo

### Normal example

``` text
HIVE-042

Temperature: 34.2°C
Humidity:    61%
Weight:      42.7 kg
Activity:     0.84

AI:
✓ NORMAL
Health Score: 91
Anomaly Score: low
```

### Anomalous example

``` text
HIVE-042

Temperature: 41.8°C
Humidity:    89%
Weight:      abnormal change
Activity:     0.21

AI:
⚠ CRITICAL ANOMALY

Reasons:
• Abnormal temperature pattern
• Unusual weight change
• Reduced bee activity
```

These are **illustrative examples only**. Do not hard-code them as model
results.

------------------------------------------------------------------------

# 24. Scope Limits

Do NOT expand the current ML task into: - disease diagnosis - honey
purity classification - adulteration detection - image-based bee disease
detection - audio classification - advanced deep learning without
evidence it is needed - LLM-based diagnosis - reinforcement learning -
complicated MLOps infrastructure - cloud model serving - Kubernetes
model deployment - separate AI gateway - real physical IoT integration

These can be future work.

------------------------------------------------------------------------

# 25. Production-Ready Direction

The architecture should be production-shaped even though this is an SIH
prototype.

``` text
Phase 1:
HOBOS-trained anomaly model
+
simulated IoT

Phase 2:
real hive sensors
+
real telemetry ingestion

Phase 3:
more diverse real-world datasets
+
model retraining/versioning

Phase 4:
production ML monitoring
+
drift detection
+
model registry
+
continuous evaluation
```

Do not make Phase 1 unnecessarily difficult to upgrade.

------------------------------------------------------------------------

# 26. Scientific Honesty

The model can say:

> **"This telemetry pattern is anomalous."**

It should NOT automatically say:

> **"The colony has disease X."**

unless a properly labeled dataset and validated supervised model support
that statement.

Likewise:

> **"Hive anomaly detected"**

is acceptable.

> **"Honey is pure"**

is NOT established by this model.

------------------------------------------------------------------------

# 27. Work Order

## Step 1 --- Inspect HOBOS

Before training code: - inspect files - inspect columns - inspect sample
rows - inspect dtypes - inspect timestamps - determine sampling
frequency - inspect missingness - inspect hive IDs - inspect event/label
information

Produce a short dataset report.

## Step 2 --- Build preprocessing

Create reproducible preprocessing.

## Step 3 --- Build baseline

Start with a simple anomaly detector.

## Step 4 --- Engineer temporal features

Only after understanding sampling frequency and data behavior.

## Step 5 --- Train

Use an appropriate leakage-safe split.

## Step 6 --- Evaluate

Do not report fabricated metrics.

## Step 7 --- Calibrate thresholds

Determine NORMAL/WARNING/CRITICAL mapping.

## Step 8 --- Serialize

Save model and metadata.

## Step 9 --- Integrate FastAPI

Load the trained model into the existing anomaly service.

## Step 10 --- End-to-end test

Verify:

``` text
IoT telemetry
    ↓
AI model
    ↓
anomaly response
    ↓
backend
    ↓
frontend
```

------------------------------------------------------------------------

# 28. Agent Behavior Rules

When an implementation decision is ambiguous:

1.  Inspect existing code first.
2.  Inspect the actual dataset before assuming schema.
3.  Preserve existing API contracts.
4.  Avoid breaking the working AI service.
5.  Prefer the smallest change that gives us a real trained model.
6.  Do not invent dataset labels.
7.  Do not invent metrics.
8.  Do not claim scientific capabilities unsupported by the data.
9.  Keep training code separate from inference code.
10. Document important decisions.

If a major architecture/API contract must change, stop and explain why
before making the change.

------------------------------------------------------------------------

# 29. Definition of Done

-   [ ] HOBOS dataset inspected
-   [ ] dataset schema documented
-   [ ] preprocessing pipeline exists
-   [ ] leakage-safe train/validation/test strategy exists
-   [ ] baseline anomaly model trained
-   [ ] evaluation performed
-   [ ] threshold calibrated
-   [ ] model artifact saved
-   [ ] model metadata saved
-   [ ] FastAPI loads the model successfully
-   [ ] anomaly endpoint returns ML predictions
-   [ ] explanations/reasons generated responsibly
-   [ ] existing backend integration still works
-   [ ] existing frontend can display the result
-   [ ] end-to-end telemetry → AI test passes
-   [ ] README/documentation explains training and limitations

------------------------------------------------------------------------

# 30. Final Product Principle

Honey Chain is not trying to say:

> **"AI proves that this honey is genuine."**

It is trying to say:

> **"AI analyzes hive and provenance evidence for inconsistencies and
> anomalies, while blockchain preserves the provenance records that were
> submitted."**

The HOBOS-trained anomaly model is the first serious implementation of
that intelligence layer.
