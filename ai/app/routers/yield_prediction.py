"""
POST /ai/yield

Placeholder implementation. Secondary priority per Master Spec D-004 —
implement last if time is short.
"""

from fastapi import APIRouter

from app.schemas.yield_prediction import YieldRequest, YieldResponse

router = APIRouter(prefix="/ai", tags=["yield"])


@router.post("/yield", response_model=YieldResponse)
def get_yield(payload: YieldRequest) -> YieldResponse:
    # TODO: real yield model, once Steps 3-4 are stable and time permits.
    return YieldResponse(predictedYieldKg=18.4, confidence=0.82)
