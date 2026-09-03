"""
POST /ai/health

Placeholder implementation for Step 1 (contracts). Real scoring logic
arrives in Step 3 (Hive Health Engine) — this must stay explainable and
avoid unnecessary ML complexity per AI_CONTEXT.md.
"""

from fastapi import APIRouter

from app.schemas.health import HealthRequest, HealthResponse, HealthStatus

router = APIRouter(prefix="/ai", tags=["health"])


@router.post("/health", response_model=HealthResponse)
def get_health(payload: HealthRequest) -> HealthResponse:
    # TODO (Step 3): replace with real baseline/deviation scoring using
    # recent TelemetrySeriesPoint history for payload.hiveId.
    return HealthResponse(
        health=HealthStatus.NORMAL,
        healthScore=91,
        reasons=["Placeholder response — Step 3 scoring not yet implemented"],
    )
