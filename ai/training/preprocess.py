"""
Data Preprocessing Pipeline for HOBOS Hive Telemetry.

Processes raw CSV datasets from archive/ and merges them into a clean,
synchronized time-series dataset.
"""

import os
import glob
import pandas as pd
import numpy as np

ARCHIVE_DIR = "archive"
OUTPUT_DIR = os.path.join("ai", "data", "processed")


def load_and_clean_sensor_series(file_path: str, signal_name: str, min_val: float, max_val: float, scale_factor: float = 1.0) -> pd.DataFrame:
    """Load, validate, filter physical outliers, and set datetime index."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    df = pd.read_csv(file_path)
    df['dt'] = pd.to_datetime(df['timestamp'], errors='coerce')
    df = df.dropna(subset=['dt', signal_name])
    
    # Scale if needed (e.g. grams to kg)
    df[signal_name] = df[signal_name] * scale_factor
    
    # Filter physical sensor corruptions / dropouts
    df = df[(df[signal_name] >= min_val) & (df[signal_name] <= max_val)]
    
    df = df.set_index('dt').sort_index()
    return df[[signal_name]]


def process_wurzburg_dataset() -> pd.DataFrame:
    """
    Process and align Würzburg hive telemetry (2017 - 2019).
    Signals:
      - Temperature: 5-minute raw interval -> 1h resample mean
      - Humidity: 1-hour raw interval -> 1h resample mean
      - Weight: 1-minute raw interval -> 1h resample mean
      - Flow: 1-minute raw interval -> 1h resample sum of absolute flow (traffic)
    """
    print("[1/4] Loading and cleaning Würzburg sensor datasets...")
    
    temp_df = load_and_clean_sensor_series(
        os.path.join(ARCHIVE_DIR, "temperature_wurzburg.csv"),
        signal_name="temperature",
        min_val=-20.0,
        max_val=60.0
    )
    
    hum_df = load_and_clean_sensor_series(
        os.path.join(ARCHIVE_DIR, "humidity_wurzburg.csv"),
        signal_name="humidity",
        min_val=0.0,
        max_val=100.0
    )
    
    wt_df = load_and_clean_sensor_series(
        os.path.join(ARCHIVE_DIR, "weight_wurzburg.csv"),
        signal_name="weight",
        min_val=10.0,
        max_val=150.0
    )
    
    fl_df = load_and_clean_sensor_series(
        os.path.join(ARCHIVE_DIR, "flow_wurzburg.csv"),
        signal_name="flow",
        min_val=-2000.0,
        max_val=2000.0
    )
    
    print("[2/4] Resampling and synchronizing streams to hourly intervals...")
    temp_h = temp_df['temperature'].resample('1h').mean()
    hum_h = hum_df['humidity'].resample('1h').mean()
    wt_h = wt_df['weight'].resample('1h').mean()
    
    # Bee traffic / activity: total gate crossings per hour
    flow_traffic_h = fl_df['flow'].abs().resample('1h').sum()
    
    merged = pd.DataFrame({
        'temperature': temp_h,
        'humidity': hum_h,
        'weight': wt_h,
        'activity_raw': flow_traffic_h
    })
    
    # Short interpolation for minor 1-3 hour sensor blips, then drop remaining gaps
    merged = merged.interpolate(method='time', limit=3).dropna()
    
    # Normalize activity into 0.0 - 1.0 range (matching Honey Chain IoT schema)
    # Using the 99th percentile of active daytime traffic as upper normalization bound
    p99_activity = float(np.percentile(merged['activity_raw'], 99))
    if p99_activity <= 0:
        p99_activity = 1000.0
    
    merged['activity'] = (merged['activity_raw'] / p99_activity).clip(0.0, 1.0).round(4)
    merged['hive_id'] = 'HOBOS-WURZBURG-01'
    merged['station'] = 'Wurzburg'
    
    merged = merged.reset_index()
    if 'dt' in merged.columns:
        merged.rename(columns={'dt': 'timestamp'}, inplace=True)
    elif 'index' in merged.columns:
        merged.rename(columns={'index': 'timestamp'}, inplace=True)
    
    print(f"[3/4] Synchronized Würzburg dataset: {len(merged):,} hourly records from {merged['timestamp'].min()} to {merged['timestamp'].max()}")
    return merged


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    wurzburg_df = process_wurzburg_dataset()
    
    output_path = os.path.join(OUTPUT_DIR, "hobos_aligned_telemetry.csv")
    wurzburg_df.to_csv(output_path, index=False)
    print(f"[4/4] Successfully saved aligned telemetry dataset to {output_path}")
    print("\nDataset Summary:")
    print(wurzburg_df[['temperature', 'humidity', 'weight', 'activity']].describe())


if __name__ == '__main__':
    main()
