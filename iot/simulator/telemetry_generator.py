# Honey Chain — IoT Telemetry Generator
import time
import requests
from config import DEFAULT_HIVES, API_INGEST_URL
from scenarios import generate_normal_telemetry, generate_anomaly_telemetry

# Hive to Scenario mapping for realistic demonstration
HIVE_SCENARIOS = {
    "HIVE-001": None,                     # Normal Baseline
    "HIVE-002": None,                     # Normal Baseline
    "HIVE-003": "WARNING",                # Elevated Temperature Warning
    "HIVE-004": "NECTAR_FLOW_SURGE",      # High Nectar Honey Flow
    "HIVE-005": "HEAT_STRESS",            # Critical Brood Overheating
    "HIVE-006": "SWARM_WEIGHT_DROP",      # Swarming Mass Drop
    "HIVE-007": "COLD_CHILLING_RISK",     # Cold Shock Chilling
    "HIVE-008": "ROBBING_AGITATION",      # Robbing Agitation
    "HIVE-009": "HIGH_MOISTURE_DAMPNESS", # Dampness Alert
    "HIVE-010": None,                     # Mangrove Monofloral Normal
}

def generate_and_send_telemetry(hive_config, scenario_type=None):
    """Generates telemetry payload for a hive and posts to the Honey Chain API."""
    if scenario_type:
        telemetry = generate_anomaly_telemetry(scenario_type)
    else:
        telemetry = generate_normal_telemetry()

    payload = {
        "hiveId": hive_config["id"],
        "beekeeperId": hive_config["beekeeperId"],
        "location": hive_config["location"],
        "telemetry": telemetry,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

    try:
        response = requests.post(API_INGEST_URL, json=payload, timeout=5)
        print(f"[{payload['timestamp']}] Sent telemetry for {payload['hiveId']} ({scenario_type or 'NORMAL'}) -> Status {response.status_code}")
        return payload
    except Exception as e:
        print(f"[{payload['timestamp']}] Generated telemetry for {payload['hiveId']} ({scenario_type or 'NORMAL'}): {telemetry}")
        return payload

def run_simulation(interval=10, iterations=5):
    """Runs periodic telemetry simulation for all configured hives."""
    print("[SIMULATOR] Starting Honey Chain IoT Telemetry Simulator (10 Hives)...")
    for i in range(iterations):
        print(f"\n--- Simulation Cycle {i+1}/{iterations} ---")
        for hive in DEFAULT_HIVES:
            scenario = HIVE_SCENARIOS.get(hive["id"])
            generate_and_send_telemetry(hive, scenario)
        if i < iterations - 1:
            time.sleep(interval)

if __name__ == "__main__":
    run_simulation(interval=2, iterations=2)
