# Honey Chain — IoT Telemetry Simulator Configuration

DEFAULT_HIVES = [
    {"id": "HIVE-001", "beekeeperId": "BK-001", "name": "Delhi Apiary Alpha", "location": {"lat": 28.6139, "lng": 77.2090, "address": "New Delhi Apiary #1"}},
    {"id": "HIVE-002", "beekeeperId": "BK-001", "name": "Delhi Apiary Beta", "location": {"lat": 28.6150, "lng": 77.2100, "address": "New Delhi Apiary #2"}},
    {"id": "HIVE-003", "beekeeperId": "BK-002", "name": "Chandigarh North", "location": {"lat": 30.7333, "lng": 76.7794, "address": "Chandigarh Apiary #1"}},
    {"id": "HIVE-004", "beekeeperId": "BK-002", "name": "Chandigarh South", "location": {"lat": 30.7350, "lng": 76.7800, "address": "Chandigarh Apiary #2"}},
    {"id": "HIVE-005", "beekeeperId": "BK-003", "name": "Amritsar Border", "location": {"lat": 31.6340, "lng": 74.8723, "address": "Amritsar Apiary #1"}},
    {"id": "HIVE-006", "beekeeperId": "BK-003", "name": "Shimla Foothills", "location": {"lat": 31.1048, "lng": 77.1734, "address": "Shimla Apiary #1"}},
    {"id": "HIVE-007", "beekeeperId": "BK-004", "name": "Kashmir Highland", "location": {"lat": 34.0837, "lng": 74.7973, "address": "Kashmir Valley Apiary #1"}},
    {"id": "HIVE-008", "beekeeperId": "BK-004", "name": "Kangra Forest", "location": {"lat": 32.0998, "lng": 76.2691, "address": "Kangra Apiary #2"}},
    {"id": "HIVE-009", "beekeeperId": "BK-005", "name": "Dehradun Valley", "location": {"lat": 30.3165, "lng": 78.0322, "address": "Dehradun Apiary #1"}},
    {"id": "HIVE-010", "beekeeperId": "BK-005", "name": "Sundarbans Coastal", "location": {"lat": 21.9497, "lng": 89.1833, "address": "Sundarbans Apiary #1"}},
]

BASELINE_TELEMETRY = {
    "temperature": {"min": 33.0, "max": 35.5},
    "humidity": {"min": 55.0, "max": 65.0},
    "weight": {"min": 42.0, "max": 46.0},
    "activity": {"min": 0.75, "max": 0.92},
}

API_INGEST_URL = "http://localhost:5000/api/telemetry"
