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

    # 1. Impossible Increase / Volume Inflation Check (Output > Input)
    if observed > claimed:
        diff = round(observed - claimed, 2)
        score = round(max(0.0, 1.0 - (diff / claimed)), 2)
        return ProvenanceCheckResponse(
            status="SUSPICIOUS",
            consistencyScore=score,
            anomalies=[
                (
                    f"Processing/observed quantity ({observed} kg) exceeds "
                    f"recorded harvest/batch quantity ({claimed} kg)."
                ),
                (
                    "Potential volume adulteration or unverified external "
                    "blending detected without authorized harvest record."
                ),
            ],
        )

    # 2. Legitimate Processing Loss Check (Output <= Input)
    loss = claimed - observed
    loss_ratio = loss / claimed
    if loss_ratio <= 0.35:
        return ProvenanceCheckResponse(
            status="VERIFIED",
            consistencyScore=round(max(0.85, 1.0 - (loss_ratio * 0.2)), 2),
            anomalies=[],
        )

    # 3. Excessive Unexplained Shrinkage
    return ProvenanceCheckResponse(
        status="SUSPICIOUS",
        consistencyScore=round(max(0.0, 1.0 - loss_ratio), 2),
        anomalies=[
            (
                f"Excessive volume shrinkage ({round(loss, 2)} kg, "
                f"{round(loss_ratio * 100, 1)}%) exceeds expected processing loss tolerance."
            ),
        ],
    )