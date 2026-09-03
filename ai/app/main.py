# AI Service — Honey Chain
# FastAPI application entry point

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, anomaly, yield_, provenance

app = FastAPI(
    title="Honey Chain AI Service",
    description="Hive intelligence, anomaly detection, and provenance consistency engine",
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
    return {"service": "honey-chain-ai", "status": "ok", "version": "1.0.0"}

app.include_router(health.router, prefix="/ai", tags=["Health"])
app.include_router(anomaly.router, prefix="/ai", tags=["Anomaly"])
app.include_router(yield_.router, prefix="/ai", tags=["Yield"])
app.include_router(provenance.router, prefix="/ai", tags=["Provenance"])
