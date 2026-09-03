"""
Yield / productivity contract.

Source of truth: 00_MASTER_SPEC.md §17.3 (AI Contracts — Productivity / Yield).
Endpoint: POST /ai/yield

Explicitly secondary to health and anomaly detection (Master Spec D-004);
implement last if time is short.
"""

from pydantic import BaseModel, Field


class YieldRequest(BaseModel):
    hiveId: str = Field(..., examples=["HIVE-042"])


class YieldResponse(BaseModel):
    predictedYieldKg: float = Field(..., ge=0)
    confidence: float = Field(..., ge=0, le=1)

    model_config = {
        "json_schema_extra": {
            "example": {"predictedYieldKg": 18.4, "confidence": 0.82}
        }
    }
