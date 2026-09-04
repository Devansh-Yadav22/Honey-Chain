# Honey Chain — Telemetry Scenarios (Normal & Anomaly)
import random
from config import BASELINE_TELEMETRY

def generate_normal_telemetry():
    """Generates realistic baseline telemetry within optimal hive parameters."""
    return {
        "temperature": round(random.uniform(BASELINE_TELEMETRY["temperature"]["min"], BASELINE_TELEMETRY["temperature"]["max"]), 1),
        "humidity": round(random.uniform(BASELINE_TELEMETRY["humidity"]["min"], BASELINE_TELEMETRY["humidity"]["max"]), 1),
        "weight": round(random.uniform(BASELINE_TELEMETRY["weight"]["min"], BASELINE_TELEMETRY["weight"]["max"]), 1),
        "activity": round(random.uniform(BASELINE_TELEMETRY["activity"]["min"], BASELINE_TELEMETRY["activity"]["max"]), 2),
    }

def generate_anomaly_telemetry(scenario_type="HEAT_STRESS"):
    """
    Generates telemetry simulating specific apicultural conditions and anomalies.
    """
    if scenario_type == "HEAT_STRESS":
        # Severe overheating & brood danger (>40°C)
        return {
            "temperature": round(random.uniform(41.0, 42.8), 1),
            "humidity": round(random.uniform(78.0, 85.0), 1),
            "weight": round(random.uniform(38.0, 41.0), 1),
            "activity": round(random.uniform(0.12, 0.25), 2),
        }
    elif scenario_type == "SWARM_WEIGHT_DROP":
        # Swarming event: abrupt mass loss with agitated scout bee traffic
        return {
            "temperature": round(random.uniform(33.0, 35.0), 1),
            "humidity": round(random.uniform(58.0, 64.0), 1),
            "weight": round(random.uniform(28.0, 32.5), 1), # Dropped ~12kg
            "activity": round(random.uniform(0.80, 0.95), 2),
        }
    elif scenario_type == "COLD_CHILLING_RISK":
        # High altitude cold shock
        return {
            "temperature": round(random.uniform(8.0, 14.0), 1),
            "humidity": round(random.uniform(82.0, 92.0), 1),
            "weight": round(random.uniform(44.0, 48.0), 1),
            "activity": round(random.uniform(0.01, 0.08), 2),
        }
    elif scenario_type == "HIGH_MOISTURE_DAMPNESS":
        # Heavy dampness & rain condensation
        return {
            "temperature": round(random.uniform(24.0, 27.0), 1),
            "humidity": round(random.uniform(88.0, 96.0), 1),
            "weight": round(random.uniform(48.0, 52.0), 1),
            "activity": round(random.uniform(0.18, 0.32), 2),
        }
    elif scenario_type == "ROBBING_AGITATION":
        # Honey robbing by external wasps/bees: elevated traffic and temperature
        return {
            "temperature": round(random.uniform(37.2, 38.8), 1),
            "humidity": round(random.uniform(65.0, 72.0), 1),
            "weight": round(random.uniform(33.0, 36.0), 1),
            "activity": round(random.uniform(0.92, 0.99), 2),
        }
    elif scenario_type == "NECTAR_FLOW_SURGE":
        # Heavy honey flow: high weight accumulation and healthy strong foraging
        return {
            "temperature": round(random.uniform(34.2, 35.2), 1),
            "humidity": round(random.uniform(56.0, 62.0), 1),
            "weight": round(random.uniform(51.0, 55.0), 1),
            "activity": round(random.uniform(0.88, 0.96), 2),
        }
    else: # Warning level mild elevation
        return {
            "temperature": round(random.uniform(37.5, 38.8), 1),
            "humidity": round(random.uniform(72.0, 78.0), 1),
            "weight": round(random.uniform(36.0, 39.0), 1),
            "activity": round(random.uniform(0.40, 0.55), 2),
        }
