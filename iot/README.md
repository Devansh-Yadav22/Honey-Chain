# IoT Simulator — Honey Chain

Simulated hive telemetry generator for Honey Chain providing realistic multi-sensor telemetry without requiring physical IoT hardware.

---

## Purpose

Generates realistic time-series data for hive monitoring across diverse apicultural and regional conditions in India:
- **Core Signals**: Temperature (°C), Relative Humidity (%), Hive Weight (kg), Bee Entrance Traffic Activity Index ($0.0 \dots 1.0$)
- **Real-World Scenarios**: Brood overheating, swarming mass loss, cold chilling, high humidity dampness, robbing agitation, and high-yield nectar surges.
- **Backend & AI Ingestion**: Directly posts payloads to the Backend (`/api/telemetry`), which routes to the AI Anomaly Model (`/ai/anomaly` and `/ai/health`).

---

## Structure

```text
iot/
├── simulator/
│   ├── telemetry_generator.py  # Core telemetry generator & stream runner
│   ├── scenarios.py            # Normal & anomaly scenario definitions
│   └── config.py               # 10 demo hives & API endpoints
├── README.md
└── requirements.txt
```

---

## Demo Hives & Scenarios (10 Hives Across India)

| Hive ID | Location / Apiary | Scenario Type | Telemetry Characteristics | AI Anomaly / Health Outcome |
|---|---|---|---|---|
| **HIVE-001** | New Delhi Apiary #1 | Normal Baseline | $T\approx 34.5^\circ\text{C}, H\approx 60\%, W\approx 44.5\text{kg}, Act\approx 0.85$ | `NORMAL` (Health: 95) |
| **HIVE-002** | New Delhi Apiary #2 | Spring Mustard Bloom | $T\approx 34.0^\circ\text{C}, H\approx 58\%, W\approx 44.0\text{kg}, Act\approx 0.84$ | `NORMAL` (Health: 95) |
| **HIVE-003** | Chandigarh Apiary #1 | Elevated Temperature Warning | $T\approx 38.0^\circ\text{C}, H\approx 74\%, W\approx 37.0\text{kg}, Act\approx 0.48$ | `WARNING` (Health: 65) |
| **HIVE-004** | Chandigarh Apiary #2 | High Nectar Surge | $T\approx 34.8^\circ\text{C}, H\approx 58\%, W\approx 52.5\text{kg}, Act\approx 0.92$ | `NORMAL` (Health: 96) |
| **HIVE-005** | Amritsar Apiary #1 | Critical Heat Stress | $T\approx 41.8^\circ\text{C}, H\approx 82\%, W\approx 38.5\text{kg}, Act\approx 0.18$ | `CRITICAL` (Health: 38) |
| **HIVE-006** | Shimla Apiary #1 | Swarming Event (Weight Drop) | $T\approx 33.7^\circ\text{C}, H\approx 62\%, W\approx 28.2\text{kg}, Act\approx 0.85$ | `CRITICAL` (Health: 38) |
| **HIVE-007** | Kashmir Valley Apiary #1 | Cold Shock Chilling Risk | $T\approx 9.5^\circ\text{C}, H\approx 88\%, W\approx 45.5\text{kg}, Act\approx 0.03$ | `CRITICAL` (Health: 42) |
| **HIVE-008** | Kangra Apiary #2 | Robbing & Colony Agitation | $T\approx 37.8^\circ\text{C}, H\approx 68\%, W\approx 34.5\text{kg}, Act\approx 0.96$ | `WARNING` (Health: 62) |
| **HIVE-009** | Dehradun Apiary #1 | High Moisture / Dampness | $T\approx 25.5^\circ\text{C}, H\approx 92\%, W\approx 51.0\text{kg}, Act\approx 0.22$ | `WARNING` (Health: 65) |
| **HIVE-010** | Sundarbans Apiary #1 | Mangrove Monofloral Flow | $T\approx 33.6^\circ\text{C}, H\approx 63\%, W\approx 48.0\text{kg}, Act\approx 0.88$ | `NORMAL` (Health: 95) |

---

## Usage

```bash
cd iot
# Run simulation cycles
python simulator/telemetry_generator.py
```
