# Honey Chain — IoT Telemetry Simulator Configuration

DEFAULT_HIVES = [
    {"id": "HIVE-001", "beekeeperId": "BK-001", "location": {"lat": 28.6139, "lng": 77.2090}},
    {"id": "HIVE-002", "beekeeperId": "BK-001", "location": {"lat": 28.6150, "lng": 77.2100}},
    {"id": "HIVE-003", "beekeeperId": "BK-002", "location": {"lat": 30.7333, "lng": 76.7794}},
    {"id": "HIVE-004", "beekeeperId": "BK-002", "location": {"lat": 30.7350, "lng": 76.7800}},
    {"id": "HIVE-005", "beekeeperId": "BK-003", "location": {"lat": 31.6340, "lng": 74.8723}},
]

BASELINE_TELEMETRY = {
    "temperature": {"min": 33.0, "max": 36.0},
    "humidity": {"min": 55.0, "max": 65.0},
    "weight": {"min": 40.0, "max": 45.0},
    "activity": {"min": 0.70, "max": 0.95},
}

API_INGEST_URL = "http://localhost:5000/api/telemetry"
