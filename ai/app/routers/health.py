"""
POST /ai/health

ML-backed hive-health assessment evaluating real-world telemetry anomaly patterns.
"""

from fastapi import APIRouter

from app.schemas.telemetry import HealthRequest, HealthResponse
from app.services.ml_service import ml_service

router = APIRouter(prefix="/ai", tags=["health"])


@router.post("/health", response_model=HealthResponse)
def get_health(payload: HealthRequest) -> HealthResponse:
    """
    Computes hive health status (NORMAL / WARNING / CRITICAL), 0-100 health index,
    and explainable reasons using the trained ML model.
    """
    return ml_service.analyze_health(
        hive_id=payload.hiveId,
        telemetry=payload.telemetry
    )