"""
POST /ai/anomaly

ML-powered explainable anomaly detection using real-world HOBOS telemetry model.
"""

from fastapi import APIRouter

from app.schemas.telemetry import AnomalyRequest, AnomalyResponse
from app.services.ml_service import ml_service

router = APIRouter(prefix="/ai", tags=["anomaly"])


@router.post("/anomaly", response_model=AnomalyResponse)
def get_anomaly(payload: AnomalyRequest) -> AnomalyResponse:
    """
    Evaluates latest hive telemetry using the trained Isolation Forest ML model.
    Returns anomaly status, calibrated severity (CRITICAL / WARNING / NONE), and explainable reasons.
    """
    return ml_service.analyze_anomaly(
        hive_id=payload.hiveId,
        telemetry=payload.telemetry
    )