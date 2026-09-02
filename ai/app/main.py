# AI Service — Honey Chain
# FastAPI application entry point

from fastapi import FastAPI

app = FastAPI(
    title="Honey Chain AI Service",
    description="Hive intelligence, anomaly detection, and provenance consistency engine",
    version="0.1.0",
)


@app.get("/")
async def root():
    return {"service": "honey-chain-ai", "status": "ok"}


# TODO: Include routers
# from app.routers import health, anomaly, yield_, provenance
# app.include_router(health.router, prefix="/ai")
# app.include_router(anomaly.router, prefix="/ai")
# app.include_router(yield_.router, prefix="/ai")
# app.include_router(provenance.router, prefix="/ai")
