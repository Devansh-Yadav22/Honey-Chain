"""
Honey Chain AI Service — entrypoint.

Bee-Tech | SIH26021 | Phase 1

Hive intelligence, anomaly detection, productivity estimation, and
provenance consistency checks.

The service identifies anomalies and inconsistencies in available evidence.
It does not claim to prove honey purity or prevent adulteration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import anomaly, health, provenance, yield_prediction

app = FastAPI(
    title="Honey Chain AI Service",
    description=(
        "Hive intelligence and provenance consistency engine for the "
        "Honey Chain platform (SIH26021). Identifies anomalies and "
        "inconsistencies in evidence — does not claim to prove honey "
        "purity or prevent adulteration."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "service": "honey-chain-ai",
        "status": "ok",
        "version": "1.0.0",
    }


@app.get("/health-check", tags=["meta"])
def service_health_check() -> dict:
    """Liveness probe for the AI service itself."""
    return {
        "service": settings.SERVICE_NAME,
        "status": "up",
        "env": settings.ENV,
    }


app.include_router(health.router)
app.include_router(anomaly.router)
app.include_router(yield_prediction.router)
app.include_router(provenance.router)