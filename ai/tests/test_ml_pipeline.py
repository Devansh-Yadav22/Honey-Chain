"""
Comprehensive Tests for Honey Chain AI Model & Endpoints.

Tests preprocessing, feature engineering, model inference, anomaly detection,
health evaluation, explainability, and FastAPI API routes using standard unittest.
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "app")))

from fastapi.testclient import TestClient
from app.main import app
from app.services.ml_service import ml_service
from training.feature_engineering import extract_point_features, FEATURE_COLUMNS

client = TestClient(app)


class TestHoneyChainMLPipeline(unittest.TestCase):

    def test_model_loaded(self):
        """Verify that the model artifact is successfully loaded in ml_service."""
        self.assertTrue(ml_service.is_loaded)
        self.assertIsNotNone(ml_service.model)
        self.assertIsNotNone(ml_service.scaler)
        self.assertIn("warning", ml_service.thresholds)
        self.assertIn("critical", ml_service.thresholds)

    def test_feature_engineering_point(self):
        """Verify feature dictionary construction and numeric bounds."""
        feats = extract_point_features(
            temperature=25.0,
            humidity=60.0,
            weight=52.0,
            activity=0.5,
            timestamp="2018-05-15T12:00:00Z"
        )
        for col in FEATURE_COLUMNS:
            self.assertIn(col, feats)
            self.assertIsInstance(feats[col], float)
        self.assertTrue(0.0 <= feats['activity'] <= 1.0)

    def test_api_anomaly_normal_telemetry(self):
        """Verify normal telemetry yields anomaly=False and severity=NONE."""
        payload = {
            "hiveId": "HIVE-042",
            "telemetry": {
                "temperature": 24.0,
                "humidity": 60.0,
                "weight": 54.0,
                "activity": 0.35
            }
        }
        response = client.post("/ai/anomaly", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertFalse(data["anomaly"])
        self.assertEqual(data["severity"], "NONE")

    def test_api_anomaly_critical_temperature(self):
        """Verify severe temperature spike triggers CRITICAL anomaly with reasons."""
        payload = {
            "hiveId": "HIVE-042",
            "telemetry": {
                "temperature": 42.5,
                "humidity": 55.0,
                "weight": 54.0,
                "activity": 0.30
            }
        }
        response = client.post("/ai/anomaly", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["anomaly"])
        self.assertEqual(data["severity"], "CRITICAL")
        self.assertGreater(len(data["reasons"]), 0)
        self.assertTrue(any("temperature" in r.lower() or "overheating" in r.lower() for r in data["reasons"]))

    def test_api_anomaly_swarming_weight_loss(self):
        """Verify sudden weight drop triggers anomaly with weight-related reason."""
        payload = {
            "hiveId": "HIVE-042",
            "telemetry": {
                "temperature": 24.0,
                "humidity": 60.0,
                "weight": 32.0,
                "activity": 0.80
            }
        }
        response = client.post("/ai/anomaly", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["anomaly"])
        self.assertIn(data["severity"], ["CRITICAL", "WARNING"])
        self.assertTrue(any("weight" in r.lower() for r in data["reasons"]))

    def test_api_health_endpoint(self):
        """Verify /ai/health returns valid health score and status."""
        normal_payload = {
            "hiveId": "HIVE-042",
            "telemetry": {
                "temperature": 24.0,
                "humidity": 60.0,
                "weight": 54.0,
                "activity": 0.35
            }
        }
        res_normal = client.post("/ai/health", json=normal_payload)
        self.assertEqual(res_normal.status_code, 200)
        data_normal = res_normal.json()
        self.assertEqual(data_normal["health"], "NORMAL")
        self.assertGreaterEqual(data_normal["healthScore"], 85)

        crit_payload = {
            "hiveId": "HIVE-042",
            "telemetry": {
                "temperature": 43.0,
                "humidity": 85.0,
                "weight": 54.0,
                "activity": 0.10
            }
        }
        res_crit = client.post("/ai/health", json=crit_payload)
        self.assertEqual(res_crit.status_code, 200)
        data_crit = res_crit.json()
        self.assertEqual(data_crit["health"], "CRITICAL")
        self.assertLessEqual(data_crit["healthScore"], 50)

    def test_api_demo_hive_backward_compatibility(self):
        """Verify HIVE-005 and HIVE-003 demo backwards compatibility without telemetry."""
        res_005 = client.post("/ai/anomaly", json={"hiveId": "HIVE-005"})
        self.assertEqual(res_005.status_code, 200)
        self.assertEqual(res_005.json()["severity"], "CRITICAL")

        res_003 = client.post("/ai/health", json={"hiveId": "HIVE-003"})
        self.assertEqual(res_003.status_code, 200)
        self.assertEqual(res_003.json()["health"], "WARNING")


if __name__ == '__main__':
    unittest.main(verbosity=2)
