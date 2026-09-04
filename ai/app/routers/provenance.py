"""
POST /ai/provenance/check

Phase 1 provenance consistency engine.

This compares recorded quantity with available observed evidence.
It does not prove physical honey purity or adulteration.
"""

from fastapi import APIRouter

from app.schemas.telemetry import (
    ProvenanceCheckRequest,
    ProvenanceCheckResponse,
)

router = APIRouter(prefix="/ai", tags=["provenance"])

_QUANTITY_TOLERANCE_RATIO = 0.10


@router.post("/provenance/check", response_model=ProvenanceCheckResponse)
def check_provenance(
    payload: ProvenanceCheckRequest,
) -> ProvenanceCheckResponse:
    claimed = payload.blockchainHarvestQuantity
    observed = payload.observedQuantity

    if claimed <= 0:
        return ProvenanceCheckResponse(
            status="SUSPICIOUS",
            consistencyScore=0.0,
            anomalies=[
                "Recorded harvest quantity is not a positive value.",
            ],
        )

    deviation = abs(claimed - observed) / claimed

    if deviation <= _QUANTITY_TOLERANCE_RATIO:
        return ProvenanceCheckResponse(
            status="VERIFIED",
            consistencyScore=round(max(0.0, 1.0 - deviation), 2),
            anomalies=[],
        )

    return ProvenanceCheckResponse(
        status="SUSPICIOUS",
        consistencyScore=round(max(0.0, 1.0 - deviation), 2),
        anomalies=[
            (
                f"Recorded harvest quantity ({claimed} kg) differs from "
                f"observed quantity ({observed} kg) beyond the allowed "
                "consistency tolerance."
            ),
            (
                "Available evidence is inconsistent with the recorded "
                "provenance quantity; further verification is required."
            ),
        ],
    )