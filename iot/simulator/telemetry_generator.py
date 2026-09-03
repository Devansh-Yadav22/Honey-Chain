# Honey Chain — IoT Telemetry Generator
import time
import requests
from config import DEFAULT_HIVES, API_INGEST_URL
from scenarios import generate_normal_telemetry, generate_anomaly_telemetry

def generate_and_send_telemetry(hive_config, anomaly_type=None):
    """Generates telemetry payload for a hive and posts to the Honey Chain API."""
    if anomaly_type:
        telemetry = generate_anomaly_telemetry(anomaly_type)
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
        print(f"[{payload['timestamp']}] Sent telemetry for {payload['hiveId']} -> Status {response.status_code}")
        return payload
    except Exception as e:
        print(f"[{payload['timestamp']}] Local telemetry generated for {payload['hiveId']}: {telemetry}")
        return payload

def run_simulation(interval=10, iterations=5):
    """Runs periodic telemetry simulation for all configured hives."""
    print("🐝 Starting Honey Chain IoT Telemetry Simulator...")
    for i in range(iterations):
        print(f"\n--- Simulation Cycle {i+1}/{iterations} ---")
        for hive in DEFAULT_HIVES:
            anomaly = None
            if hive["id"] == "HIVE-003":
                anomaly = "WARNING"
            elif hive["id"] == "HIVE-005":
                anomaly = "HEAT_STRESS"

            generate_and_send_telemetry(hive, anomaly)
        time.sleep(interval)

if __name__ == "__main__":
    run_simulation(interval=2, iterations=2)
