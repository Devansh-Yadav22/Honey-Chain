"""
Honey Chain AI Service — entrypoint.

Bee-Tech | SIH26021 | Phase 1

Wires together the four AI contracts defined in 00_MASTER_SPEC.md §17.
Run with:

    uvicorn app.main:app --reload --port 8001
"""

from fastapi import FastAPI

from app.config import settings
from app.routers import anomaly, health, provenance, yield_prediction

app = FastAPI(
    title="Honey Chain AI Service",
    description=(
        "Hive intelligence and provenance consistency engine for the "
        "Honey Chain platform (SIH26021). Identifies anomalies and "
        "inconsistencies in evidence — does not claim to prove honey "
        "purity or prevent adulteration (Master Spec §1.6)."
    ),
    version="0.1.0",
)

app.include_router(health.router)
app.include_router(anomaly.router)
app.include_router(yield_prediction.router)
app.include_router(provenance.router)


@app.get("/health-check", tags=["meta"])
def service_health_check() -> dict:
    """Liveness probe for this service itself (not hive health)."""
    return {"service": settings.SERVICE_NAME, "status": "up", "env": settings.ENV}
