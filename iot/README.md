# IoT Simulator — Honey Chain

Simulated hive telemetry generator for Phase 1 prototype.

## Purpose

Generates realistic time-series data for hive monitoring without physical hardware:
- Temperature, humidity, weight, bee activity
- Normal gradual changes and anomaly scenarios
- Deterministic/reproducible output for live demos

## Structure

```
iot/
├── simulator/
│   ├── telemetry_generator.py  # Core telemetry generation logic
│   ├── scenarios.py            # Normal & anomaly scenario definitions
│   └── config.py               # Simulator configuration
├── README.md
└── requirements.txt
```

## Demo Hives

| Hive ID | Scenario |
|---|---|
| HIVE-001 | Healthy |
| HIVE-002 | Healthy |
| HIVE-003 | Warning |
| HIVE-004 | Healthy |
| HIVE-005 | Critical |

## Usage

```bash
cd iot
python -m simulator.telemetry_generator
```
