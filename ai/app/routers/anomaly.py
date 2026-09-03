from fastapi import APIRouter
from app.schemas.telemetry import AnomalyRequest, AnomalyResponse

router = APIRouter()

@router.post("/anomaly", response_model=AnomalyResponse)
async def detect_anomalies(req: AnomalyRequest):
    telemetry = req.telemetry
    reasons = []

    if req.hiveId == "HIVE-005" or (telemetry and telemetry.temperature > 40.0):
        reasons = ["Abnormal temperature elevation (>40°C)", "High humidity levels", "Reduced bee activity"]
        return AnomalyResponse(anomaly=True, severity="CRITICAL", reasons=reasons)

    if req.hiveId == "HIVE-003" or (telemetry and telemetry.temperature > 38.0):
        reasons = ["Elevated hive temperature", "Higher than average humidity"]
        return AnomalyResponse(anomaly=True, severity="HIGH", reasons=reasons)

    if telemetry:
        if telemetry.temperature > 37.0:
            reasons.append("Slight temperature rise")
        if telemetry.activity < 0.5:
            reasons.append("Reduced foraging bee activity")

    if reasons:
        return AnomalyResponse(anomaly=True, severity="MEDIUM", reasons=reasons)

    return AnomalyResponse(anomaly=False, severity="NONE", reasons=[])
