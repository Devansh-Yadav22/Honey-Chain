"""
Provenance Consistency Engine contract.

Source of truth: 00_MASTER_SPEC.md §17.4 (AI Contracts — Provenance
Consistency) and §24 (Provenance Consistency Engine).
Endpoint: POST /api/provenance/check

This is the project's core differentiator (AI_CONTEXT.md Step 6,
Master Spec §6.4). It must never be framed as proving physical purity —
only as flagging whether recorded provenance is consistent with
available evidence (Master Spec §1.6, D-006).
"""

from enum import Enum

from pydantic import BaseModel, Field


class ProvenanceStatus(str, Enum):
    VERIFIED = "VERIFIED"
    SUSPICIOUS = "SUSPICIOUS"


class ProvenanceCheckRequest(BaseModel):
    """
    Phase 1 minimal input: a quantity comparison, matching the Master
    Spec example exactly. Designed to extend later (GPS-vs-route,
    yield-vs-sensor-history) without breaking this shape — new evidence
    fields should be added as optional.
    """

    batchId: str = Field(..., examples=["HC-2026-0001"])
    blockchainHarvestQuantity: float = Field(
        ..., description="Quantity recorded on-chain for this batch (kg)"
    )
    observedQuantity: float = Field(
        ..., description="Quantity implied by available IoT/sensor evidence (kg)"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "batchId": "HC-2026-0001",
                "blockchainHarvestQuantity": 18,
                "observedQuantity": 18,
            }
        }
    }


class ProvenanceCheckResponse(BaseModel):
    status: ProvenanceStatus
    consistencyScore: float = Field(..., ge=0, le=1)
    anomalies: list[str] = Field(default_factory=list)

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "status": "VERIFIED",
                    "consistencyScore": 0.96,
                    "anomalies": [],
                },
                {
                    "status": "SUSPICIOUS",
                    "consistencyScore": 0.21,
                    "anomalies": [
                        "Recorded quantity inconsistent with available evidence"
                    ],
                },
            ]
        }
    }
