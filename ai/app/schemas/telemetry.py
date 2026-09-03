from pydantic import BaseModel
from typing import Optional, List

class TelemetryData(BaseModel):
    temperature: float
    humidity: float
    weight: float
    activity: float

class HealthRequest(BaseModel):
    hiveId: str
    telemetry: Optional[TelemetryData] = None

class HealthResponse(BaseModel):
    health: str # NORMAL, WARNING, CRITICAL
    healthScore: int

class AnomalyRequest(BaseModel):
    hiveId: str
    telemetry: Optional[TelemetryData] = None

class AnomalyResponse(BaseModel):
    anomaly: bool
    severity: str # LOW, MEDIUM, HIGH, CRITICAL, NONE
    reasons: List[str]

class YieldRequest(BaseModel):
    hiveId: str

class YieldResponse(BaseModel):
    predictedYieldKg: float
    confidence: float

class ProvenanceCheckRequest(BaseModel):
    batchId: str
    blockchainHarvestQuantity: float
    observedQuantity: float

class ProvenanceCheckResponse(BaseModel):
    status: str # VERIFIED, SUSPICIOUS
    consistencyScore: float
    anomalies: List[str]
