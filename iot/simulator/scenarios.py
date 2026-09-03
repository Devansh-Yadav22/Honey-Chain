# Honey Chain — Telemetry Scenarios (Normal & Anomaly)
import random
from config import BASELINE_TELEMETRY

def generate_normal_telemetry():
    """Generates realistic telemetry within expected parameters."""
    return {
        "temperature": round(random.uniform(BASELINE_TELEMETRY["temperature"]["min"], BASELINE_TELEMETRY["temperature"]["max"]), 1),
        "humidity": round(random.uniform(BASELINE_TELEMETRY["humidity"]["min"], BASELINE_TELEMETRY["humidity"]["max"]), 1),
        "weight": round(random.uniform(BASELINE_TELEMETRY["weight"]["min"], BASELINE_TELEMETRY["weight"]["max"]), 1),
        "activity": round(random.uniform(BASELINE_TELEMETRY["activity"]["min"], BASELINE_TELEMETRY["activity"]["max"]), 2),
    }

def generate_anomaly_telemetry(anomaly_type="HEAT_STRESS"):
    """Generates telemetry simulating disease, heat stress, or hive loss."""
    if anomaly_type == "HEAT_STRESS":
        return {
            "temperature": round(random.uniform(39.5, 42.0), 1),
            "humidity": round(random.uniform(75.0, 85.0), 1),
            "weight": round(random.uniform(38.0, 41.0), 1),
            "activity": round(random.uniform(0.20, 0.40), 2),
        }
    elif anomaly_type == "COLONY_COLLAPSE":
        return {
            "temperature": round(random.uniform(25.0, 30.0), 1),
            "humidity": round(random.uniform(40.0, 50.0), 1),
            "weight": round(random.uniform(25.0, 30.0), 1),
            "activity": round(random.uniform(0.05, 0.15), 2),
        }
    else: # Warning level
        return {
            "temperature": round(random.uniform(37.5, 39.0), 1),
            "humidity": round(random.uniform(70.0, 75.0), 1),
            "weight": round(random.uniform(35.0, 39.0), 1),
            "activity": round(random.uniform(0.40, 0.60), 2),
        }
