import time
import sys
from telemetry_generator import generate_and_send_telemetry
from config import DEFAULT_HIVES

HIVE_SCENARIOS = {
    "HIVE-001": None,
    "HIVE-002": None,
    "HIVE-003": "WARNING",
    "HIVE-004": "NECTAR_FLOW_SURGE",
    "HIVE-005": "HEAT_STRESS",
    "HIVE-006": "SWARM_WEIGHT_DROP",
    "HIVE-007": "COLD_CHILLING_RISK",
    "HIVE-008": "ROBBING_AGITATION",
    "HIVE-009": "HIGH_MOISTURE_DAMPNESS",
    "HIVE-010": None,
}

if __name__ == "__main__":
    print("[SIMULATOR DAEMON] Starting continuous IoT telemetry loop (15s interval)...", flush=True)
    while True:
        try:
            for hive in DEFAULT_HIVES:
                scenario = HIVE_SCENARIOS.get(hive["id"])
                generate_and_send_telemetry(hive, scenario)
            time.sleep(15)
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"[SIMULATOR DAEMON] Error: {e}", flush=True)
            time.sleep(5)
