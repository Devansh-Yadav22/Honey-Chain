"""
POST /ai/anomaly

Placeholder implementation for Step 1 (contracts). Real detection logic
arrives in Step 4 (Anomaly Detection Engine).
"""

from fastapi import APIRouter

from app.schemas.anomaly import AnomalyRequest, AnomalyResponse

router = APIRouter(prefix="/ai", tags=["anomaly"])


@router.post("/anomaly", response_model=AnomalyResponse)
def get_anomaly(payload: AnomalyRequest) -> AnomalyResponse:
    # TODO (Step 4): replace with real deviation checks across
    # temperature / humidity / weight / activity + temporal consistency.
    return AnomalyResponse(anomaly=False, severity=None, reasons=[])
