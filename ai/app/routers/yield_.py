from fastapi import APIRouter
from app.schemas.telemetry import YieldRequest, YieldResponse

router = APIRouter()

@router.post("/yield", response_model=YieldResponse)
async def predict_yield(req: YieldRequest):
    return YieldResponse(predictedYieldKg=18.4, confidence=0.88)
