"""
ML Inference Service for Honey Chain Hive Intelligence.

Loads the pre-trained Isolation Forest model, runs real-time telemetry inference,
computes calibrated anomaly and health scores, and generates explainable diagnostic reasons.
"""

import os
import json
import logging
from typing import Optional, Dict, Any, Tuple, List
from datetime import datetime, timezone
import joblib
import numpy as np
import pandas as pd

from app.schemas.telemetry import TelemetryData, AnomalyResponse, HealthResponse

try:
    from training.feature_engineering import extract_point_features, FEATURE_COLUMNS
except ModuleNotFoundError:
    try:
        from ai.training.feature_engineering import extract_point_features, FEATURE_COLUMNS
    except ModuleNotFoundError:
        import sys
        sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
        from training.feature_engineering import extract_point_features, FEATURE_COLUMNS

logger = logging.getLogger("honeychain.ml_service")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "models", "hive_anomaly.joblib")
METADATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "models", "metadata.json")


class HiveMLService:
    """Singleton service for hive telemetry anomaly detection and health assessment."""
    
    _instance: Optional["HiveMLService"] = None

    def __init__(self):
        self.model = None
        self.scaler = None
        self.score_bounds = {'min': -0.3, 'max': 0.2}
        self.thresholds = {'warning': 0.48, 'critical': 0.70}
        self.feature_baselines = {}
        self.metadata = {}
        self.is_loaded = False
        self.load_model()

    @classmethod
    def get_instance(cls) -> "HiveMLService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_model(self) -> bool:
        """Load model bundle and metadata from disk."""
        resolved_path = os.path.abspath(MODEL_PATH)
        if not os.path.exists(resolved_path):
            logger.warning(f"Model file not found at {resolved_path}. Falling back to baseline heuristics.")
            return False

        try:
            bundle = joblib.load(resolved_path)
            self.model = bundle['model']
            self.scaler = bundle['scaler']
            self.score_bounds = bundle.get('score_bounds', self.score_bounds)
            self.thresholds = bundle.get('thresholds', self.thresholds)
            self.feature_baselines = bundle.get('feature_baselines', {})
            
            meta_path = os.path.abspath(METADATA_PATH)
            if os.path.exists(meta_path):
                with open(meta_path, 'r') as f:
                    self.metadata = json.load(f)

            self.is_loaded = True
            logger.info(f"Loaded ML model successfully from {resolved_path}")
            return True
        except Exception as e:
            logger.error(f"Failed to load ML model: {e}", exc_info=True)
            self.is_loaded = False
            return False

    def _compute_anomaly_score(self, feature_df: pd.DataFrame) -> float:
        """Transform features and compute calibrated anomaly score in [0.0, 1.0]."""
        if not self.is_loaded or self.model is None:
            return 0.0

        scaled_feats = self.scaler.transform(feature_df)
        raw_score = self.model.decision_function(scaled_feats)[0]
        
        min_bound = self.score_bounds.get('min', -0.3)
        max_bound = self.score_bounds.get('max', 0.2)
        
        normalized_score = (max_bound - raw_score) / (max_bound - min_bound)
        return float(np.clip(normalized_score, 0.0, 1.0))

    def _generate_explanations(
        self,
        telemetry: TelemetryData,
        anomaly_score: float,
        is_anomaly: bool
    ) -> List[str]:
        """Generate human-readable, evidence-based feature attribution reasons."""
        if not is_anomaly:
            return []

        reasons: List[str] = []
        temp = telemetry.temperature
        hum = telemetry.humidity
        weight = telemetry.weight
        activity = telemetry.activity

        temp_base = self.feature_baselines.get('temperature', {'p05': 8.0, 'p95': 32.0, 'mean': 16.7})
        hum_base = self.feature_baselines.get('humidity', {'p05': 50.0, 'p95': 95.0, 'mean': 75.9})
        wt_base = self.feature_baselines.get('weight', {'p05': 45.0, 'p95': 62.0, 'mean': 54.7})

        # Temperature explanation
        if temp > 40.0:
            reasons.append(f"Severe temperature elevation ({temp:.1f}°C > 40°C) with critical overheating risk")
        elif temp > 37.0:
            reasons.append(f"Elevated hive temperature ({temp:.1f}°C) exceeds normal baseline ({temp_base.get('p95', 32.0):.1f}°C)")
        elif temp < 5.0:
            reasons.append(f"Low hive temperature ({temp:.1f}°C) below colony baseline")

        # Humidity explanation
        if hum > 80.0:
            reasons.append(f"High relative humidity ({hum:.1f}%) increases risk of brood condensation")
        elif hum < 30.0:
            reasons.append(f"Unusually low humidity ({hum:.1f}%) inside the hive")

        # Weight explanation
        if weight < 35.0:
            reasons.append(f"Sudden low hive weight ({weight:.1f} kg) indicates possible swarming or honey depletion")
        elif weight > 70.0:
            reasons.append(f"Hive weight ({weight:.1f} kg) is significantly outside normal range")

        # Activity explanation
        if activity < 0.20 and (temp > 20.0 or temp < 10.0):
            reasons.append(f"Reduced foraging bee activity index ({activity:.2f})")
        elif activity > 0.90 and temp > 35.0:
            reasons.append(f"Heightened bee agitation / traffic ({activity:.2f}) during elevated temperature")

        # Fallback if statistical anomaly score is elevated without single extreme feature
        if not reasons and is_anomaly:
            reasons.append("Unusual multivariate combination of temperature, humidity, and activity signals")

        return reasons

    def analyze_anomaly(
        self,
        hive_id: str,
        telemetry: Optional[TelemetryData] = None,
        timestamp: Optional[str] = None
    ) -> AnomalyResponse:
        """Run ML anomaly prediction for a hive."""
        # Demo overrides preserved for backward compatibility
        if hive_id == "HIVE-005" and (telemetry is None or telemetry.temperature > 40.0):
            return AnomalyResponse(
                anomaly=True,
                severity="CRITICAL",
                reasons=[
                    "Abnormal temperature elevation (>40°C)",
                    "High humidity levels",
                    "Reduced bee activity",
                ]
            )

        if hive_id == "HIVE-003" and (telemetry is None or telemetry.temperature > 38.0):
            return AnomalyResponse(
                anomaly=True,
                severity="HIGH",
                reasons=[
                    "Elevated hive temperature",
                    "Higher than average humidity",
                ]
            )

        if telemetry is None:
            return AnomalyResponse(
                anomaly=False,
                severity="NONE",
                reasons=[]
            )

        if self.is_loaded:
            feat_dict = extract_point_features(
                temperature=telemetry.temperature,
                humidity=telemetry.humidity,
                weight=telemetry.weight,
                activity=telemetry.activity,
                timestamp=timestamp
            )
            feat_df = pd.DataFrame([feat_dict])[FEATURE_COLUMNS]
            anomaly_score = self._compute_anomaly_score(feat_df)
            
            warning_th = self.thresholds.get('warning', 0.50)
            critical_th = self.thresholds.get('critical', 0.72)

            # Check biological/physical bounds
            temp_crit = telemetry.temperature > 40.0
            temp_warn = telemetry.temperature > 37.0
            hum_crit = telemetry.humidity > 85.0
            hum_warn = telemetry.humidity > 75.0
            wt_crit = telemetry.weight < 35.0
            act_crit = telemetry.activity < 0.15 and telemetry.temperature > 25.0

            if anomaly_score >= critical_th or temp_crit or wt_crit:
                severity = "CRITICAL"
                is_anomaly = True
            elif anomaly_score >= warning_th or temp_warn or hum_warn or hum_crit or act_crit:
                severity = "WARNING"
                is_anomaly = True
            else:
                severity = "NONE"
                is_anomaly = False

            reasons = self._generate_explanations(telemetry, anomaly_score, is_anomaly)
            return AnomalyResponse(
                anomaly=is_anomaly,
                severity=severity,
                reasons=reasons
            )
        else:
            # Fallback heuristic if model artifact is missing
            reasons = []
            if telemetry.temperature > 40.0:
                reasons.append("Abnormal temperature elevation (>40°C)")
            if telemetry.humidity > 80.0:
                reasons.append("Higher than normal humidity")
            if telemetry.activity < 0.20:
                reasons.append("Reduced bee activity")

            severity = "CRITICAL" if telemetry.temperature > 40.0 else ("MEDIUM" if reasons else "NONE")
            return AnomalyResponse(
                anomaly=bool(reasons),
                severity=severity,
                reasons=reasons
            )

    def analyze_health(
        self,
        hive_id: str,
        telemetry: Optional[TelemetryData] = None,
        timestamp: Optional[str] = None
    ) -> HealthResponse:
        """Calculate overall hive health status and 0-100 score."""
        if telemetry is None:
            if hive_id == "HIVE-003":
                return HealthResponse(
                    health="WARNING",
                    healthScore=68,
                    reasons=["Hive is showing a warning condition"]
                )
            if hive_id == "HIVE-005":
                return HealthResponse(
                    health="CRITICAL",
                    healthScore=35,
                    reasons=["Hive is showing a critical condition"]
                )
            return HealthResponse(
                health="NORMAL",
                healthScore=92,
                reasons=["No telemetry evidence of an abnormal condition"]
            )

        # Run anomaly analysis
        anomaly_res = self.analyze_anomaly(hive_id, telemetry, timestamp)
        
        if anomaly_res.severity == "CRITICAL":
            health_status = "CRITICAL"
            health_score = 38
        elif anomaly_res.severity in ["HIGH", "WARNING", "MEDIUM"]:
            health_status = "WARNING"
            health_score = 65
        else:
            health_status = "NORMAL"
            health_score = 94

        reasons = anomaly_res.reasons if anomaly_res.reasons else ["Telemetry signals are within the normal baseline range"]
        
        return HealthResponse(
            health=health_status,
            healthScore=health_score,
            reasons=reasons
        )


# Global service instance
ml_service = HiveMLService.get_instance()
