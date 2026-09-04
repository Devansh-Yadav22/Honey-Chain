"""
Telemetry contract.

Source of truth: 00_MASTER_SPEC.md §15.3 (Data Model — Telemetry) and
§16 (Telemetry Contract).

This is the single shape that the IoT simulator (Step 2), the backend's
/api/telemetry endpoint, and every AI engine (health, anomaly, yield)
agree on. Do not add fields here without recording the change in the
Master Spec Decision Log (§40) and flagging it in MASTER — telemetry
schema changes are explicitly listed as a "major change" in §41.
"""

from datetime import datetime

from pydantic import BaseModel, Field


class Location(BaseModel):
    lat: float = Field(..., description="Latitude")
    lng: float = Field(..., description="Longitude")


class TelemetryReading(BaseModel):
    """The `telemetry` sub-object of the ingestion contract."""

    temperature: float = Field(..., description="Hive temperature (°C)")
    humidity: float = Field(..., description="Relative humidity (%)")
    weight: float = Field(..., description="Hive weight (kg)")
    activity: float = Field(
        ..., description="Normalized bee activity, expected range 0.0–1.0"
    )


class TelemetryIngest(BaseModel):
    """
    Full request body accepted at POST /api/telemetry (backend) and used
    as the input unit for every AI engine downstream.
    """

    hiveId: str = Field(..., examples=["HIVE-042"])
    beekeeperId: str = Field(..., examples=["BK-007"])
    location: Location
    telemetry: TelemetryReading
    timestamp: datetime = Field(..., description="Observation time, ISO 8601")

    model_config = {
        "json_schema_extra": {
            "example": {
                "hiveId": "HIVE-042",
                "beekeeperId": "BK-007",
                "location": {"lat": 28.6139, "lng": 77.2090},
                "telemetry": {
                    "temperature": 34.2,
                    "humidity": 61.0,
                    "weight": 42.7,
                    "activity": 0.84,
                },
                "timestamp": "2026-09-02T18:30:00Z",
            }
        }
    }


class TelemetrySeriesPoint(BaseModel):
    """
    One point in a hive's telemetry history, as consumed internally by
    the Health and Anomaly engines (Steps 3–4) once they need more than
    a single reading (e.g. baselines, trend deviation).
    """

    hiveId: str
    timestamp: datetime
    temperature: float
    humidity: float
    weight: float
    activity: float
