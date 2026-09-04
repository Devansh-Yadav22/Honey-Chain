"""
Honey Chain — AI Service Unit Tests
Tests FastAPI routers: /ai/health, /ai/anomaly, /ai/yield, /ai/provenance/check
"""

import sys
from pathlib import Path
import unittest

# Ensure 'ai' package is importable
AI_DIR = Path(__file__).resolve().parent.parent.parent / "ai"
if str(AI_DIR) not in sys.path:
    sys.path.insert(0, str(AI_DIR))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestAiRouters(unittest.TestCase):

    def test_root_and_health_check(self):
        res = client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "ok")

        res_check = client.get("/health-check")
        self.assertEqual(res_check.status_code, 200)
        self.assertEqual(res_check.json()["status"], "up")

    def test_health_router_normal(self):
        payload = {
            "hiveId": "HIVE-001",
            "telemetry": {
                "temperature": 34.2,
                "humidity": 61.0,
                "weight": 42.7,
                "activity": 0.84,
            },
        }
        res = client.post("/ai/health", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["health"], "NORMAL")
        self.assertGreaterEqual(data["healthScore"], 90)

    def test_health_router_critical(self):
        payload = {
            "hiveId": "HIVE-005",
            "telemetry": {
                "temperature": 41.5,
                "humidity": 82.0,
                "weight": 28.2,
                "activity": 0.15,
            },
        }
        res = client.post("/ai/health", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["health"], "CRITICAL")
        self.assertLessEqual(data["healthScore"], 40)

    def test_anomaly_router(self):
        payload = {
            "hiveId": "HIVE-005",
            "telemetry": {
                "temperature": 41.5,
                "humidity": 82.0,
                "weight": 28.2,
                "activity": 0.15,
            },
        }
        res = client.post("/ai/anomaly", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["anomaly"])
        self.assertEqual(data["severity"], "CRITICAL")
        self.assertTrue(len(data["reasons"]) > 0)

    def test_yield_router(self):
        payload = {"hiveId": "HIVE-001"}
        res = client.post("/ai/yield", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("predictedYieldKg", data)
        self.assertIn("confidence", data)

    def test_provenance_check_verified(self):
        payload = {
            "batchId": "HC-2026-0001",
            "blockchainHarvestQuantity": 18.0,
            "observedQuantity": 18.0,
        }
        res = client.post("/ai/provenance/check", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "VERIFIED")
        self.assertEqual(len(data["anomalies"]), 0)

    def test_provenance_check_suspicious(self):
        payload = {
            "batchId": "HC-2026-0003",
            "blockchainHarvestQuantity": 18.0,
            "observedQuantity": 31.0,
        }
        res = client.post("/ai/provenance/check", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "SUSPICIOUS")
        self.assertTrue(len(data["anomalies"]) > 0)


if __name__ == "__main__":
    unittest.main()
