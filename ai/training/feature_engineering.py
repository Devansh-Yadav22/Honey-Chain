"""
Feature Engineering Module for Honey Chain Hive Telemetry.

Extracts core sensor signals, cyclic diurnal indicators, and interaction ratios
for training, batch evaluation, and real-time API inference.
"""

import numpy as np
import pandas as pd
from typing import Union, Dict, Any, List
from datetime import datetime, timezone


FEATURE_COLUMNS = [
    'temperature',
    'humidity',
    'weight',
    'activity',
    'hour_sin',
    'hour_cos',
    'temp_hum_ratio'
]


def extract_point_features(
    temperature: float,
    humidity: float,
    weight: float,
    activity: float,
    timestamp: Union[str, datetime, None] = None
) -> Dict[str, float]:
    """
    Extract feature dictionary for a single real-time telemetry observation.
    """
    if timestamp is None:
        # Default to mid-day (14:00) peak activity window if no timestamp is provided
        hour = 14
    elif isinstance(timestamp, str):
        try:
            dt = pd.to_datetime(timestamp)
            hour = dt.hour
        except Exception:
            hour = 14
    else:
        hour = timestamp.hour if hasattr(timestamp, 'hour') else 14

    hour_sin = np.sin(2 * np.pi * hour / 24.0)
    hour_cos = np.cos(2 * np.pi * hour / 24.0)

    safe_hum = max(float(humidity), 1.0)
    temp_hum_ratio = float(temperature) / safe_hum

    return {
        'temperature': float(temperature),
        'humidity': float(humidity),
        'weight': float(weight),
        'activity': float(np.clip(activity, 0.0, 1.0)),
        'hour_sin': float(hour_sin),
        'hour_cos': float(hour_cos),
        'temp_hum_ratio': float(temp_hum_ratio)
    }


def extract_dataframe_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extract feature matrix from a historical DataFrame.
    """
    df = df.copy()
    if 'timestamp' in df.columns:
        dt_series = pd.to_datetime(df['timestamp'], errors='coerce')
        hours = dt_series.dt.hour.fillna(14)
    elif isinstance(df.index, pd.DatetimeIndex):
        hours = df.index.hour
    else:
        hours = 14

    df['hour_sin'] = np.sin(2 * np.pi * hours / 24.0)
    df['hour_cos'] = np.cos(2 * np.pi * hours / 24.0)

    safe_hum = df['humidity'].clip(lower=1.0)
    df['temp_hum_ratio'] = df['temperature'] / safe_hum
    df['activity'] = df['activity'].clip(lower=0.0, upper=1.0)

    return df[FEATURE_COLUMNS]
