"""
Health contract.

Source of truth: 00_MASTER_SPEC.md §17.1 (AI Contracts — Health).
Endpoint: POST /ai/health
"""

from enum import Enum

from pydantic import BaseModel, Field


class HealthStatus(str, Enum):
    NORMAL = "NORMAL"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class HealthRequest(BaseModel):
    """
    Input for a health assessment. Phase 1 accepts either a single latest
    reading or a short recent history — the engine (Step 3) decides how
    much context it needs; the contract only fixes hiveId as required.
    """

    hiveId: str = Field(..., examples=["HIVE-042"])


class HealthResponse(BaseModel):
    health: HealthStatus
    healthScore: int = Field(
        ..., ge=0, le=100, description="0–100, higher is healthier"
    )
    reasons: list[str] = Field(
        default_factory=list,
        description=(
            "Human-readable explanation for the score/status. Not part of "
            "the minimal Master Spec example response, but required by "
            "AI_CONTEXT.md Step 3 ('explainable hive health assessment')."
        ),
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "health": "NORMAL",
                "healthScore": 91,
                "reasons": ["All signals within normal baseline range"],
            }
        }
    }
