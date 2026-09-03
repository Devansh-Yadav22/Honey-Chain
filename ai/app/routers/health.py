from fastapi import APIRouter
from app.schemas.telemetry import HealthRequest, HealthResponse

router = APIRouter()

@router.post("/health", response_model=HealthResponse)
async def get_hive_health(req: HealthRequest):
    telemetry = req.telemetry
    if not telemetry:
        if req.hiveId == "HIVE-003":
            return HealthResponse(health="WARNING", healthScore=68)
        if req.hiveId == "HIVE-005":
            return HealthResponse(health="CRITICAL", healthScore=35)
        return HealthResponse(health="NORMAL", healthScore=92)

    temp, hum, act = telemetry.temperature, telemetry.humidity, telemetry.activity
    if temp > 40.0 or hum > 80.0 or act < 0.20:
        return HealthResponse(health="CRITICAL", healthScore=38)
    elif temp > 38.0 or hum > 75.0 or act < 0.40:
        return HealthResponse(health="WARNING", healthScore=65)

    return HealthResponse(health="NORMAL", healthScore=94)
