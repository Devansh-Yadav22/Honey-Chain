"""
Anomaly contract.

Source of truth: 00_MASTER_SPEC.md §17.2 (AI Contracts — Anomaly).
Endpoint: POST /ai/anomaly
"""

from enum import Enum

from pydantic import BaseModel, Field


class AnomalySeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class AnomalyRequest(BaseModel):
    hiveId: str = Field(..., examples=["HIVE-042"])


class AnomalyResponse(BaseModel):
    anomaly: bool
    severity: AnomalySeverity | None = Field(
        None, description="Present only when anomaly is true"
    )
    reasons: list[str] = Field(default_factory=list)

    model_config = {
        "json_schema_extra": {
            "example": {
                "anomaly": True,
                "severity": "HIGH",
                "reasons": [
                    "Abnormal temperature",
                    "High humidity",
                    "Sudden weight change",
                    "Reduced bee activity",
                ],
            }
        }
    }
