"""
Shared telemetry and AI request/response contracts.

Telemetry shape is shared with the backend and IoT simulator.
AI health and anomaly endpoints accept the latest telemetry reading
when available.
"""

from typing import Optional

from pydantic import BaseModel, Field


class Location(BaseModel):
    lat: float = Field(..., description="Latitude")
    lng: float = Field(..., description="Longitude")


class TelemetryData(BaseModel):
    """Latest hive telemetry reading."""

    temperature: float = Field(..., description="Hive temperature (°C)")
    humidity: float = Field(..., description="Relative humidity (%)")
    weight: float = Field(..., description="Hive weight (kg)")
    activity: float = Field(
        ...,
        description="Normalized bee activity, expected range 0.0–1.0",
    )


class HealthRequest(BaseModel):
    hiveId: str = Field(..., examples=["HIVE-042"])
    telemetry: Optional[TelemetryData] = None


class HealthResponse(BaseModel):
    health: str
    healthScore: int = Field(..., ge=0, le=100)
    reasons: list[str] = Field(default_factory=list)


class AnomalyRequest(BaseModel):
    hiveId: str = Field(..., examples=["HIVE-042"])
    telemetry: Optional[TelemetryData] = None


class AnomalyResponse(BaseModel):
    anomaly: bool
    severity: str
    reasons: list[str] = Field(default_factory=list)


class YieldRequest(BaseModel):
    hiveId: str = Field(..., examples=["HIVE-042"])


class YieldResponse(BaseModel):
    predictedYieldKg: float = Field(..., ge=0)
    confidence: float = Field(..., ge=0, le=1)


class ProvenanceCheckRequest(BaseModel):
    batchId: str = Field(..., examples=["HC-2026-0001"])
    blockchainHarvestQuantity: float
    observedQuantity: float


class ProvenanceCheckResponse(BaseModel):
    status: str
    consistencyScore: float = Field(..., ge=0, le=1)
    anomalies: list[str] = Field(default_factory=list)