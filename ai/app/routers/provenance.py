"""
POST /api/provenance/check

Placeholder implementation for Step 1 (contracts). Real consistency
logic arrives in Step 6 (Provenance Consistency Engine) — the project's
core differentiator. Note the path prefix differs from the other AI
endpoints (/api/... not /ai/...), matching Master Spec §17.4 exactly.
"""

from fastapi import APIRouter

from app.schemas.provenance import (
    ProvenanceCheckRequest,
    ProvenanceCheckResponse,
    ProvenanceStatus,
)

router = APIRouter(prefix="/api/provenance", tags=["provenance"])

# Simple threshold for the Step 1 placeholder only. Step 6 replaces this
# with proper multi-signal consistency analysis (mass-balance, GPS-vs-
# ledger, yield-vs-sensor-history) per Master Spec §24.
_QUANTITY_TOLERANCE_RATIO = 0.10


@router.post("/check", response_model=ProvenanceCheckResponse)
def check_provenance(payload: ProvenanceCheckRequest) -> ProvenanceCheckResponse:
    claimed = payload.blockchainHarvestQuantity
    observed = payload.observedQuantity

    if claimed <= 0:
        deviation = 1.0
    else:
        deviation = abs(claimed - observed) / claimed

    if deviation <= _QUANTITY_TOLERANCE_RATIO:
        return ProvenanceCheckResponse(
            status=ProvenanceStatus.VERIFIED,
            consistencyScore=round(max(0.0, 1.0 - deviation), 2),
            anomalies=[],
        )

    return ProvenanceCheckResponse(
        status=ProvenanceStatus.SUSPICIOUS,
        consistencyScore=round(max(0.0, 1.0 - deviation), 2),
        anomalies=["Recorded quantity inconsistent with available evidence"],
    )
