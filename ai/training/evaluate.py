"""
Evaluation & Stress-Testing Pipeline for Honey Chain Hive Anomaly Detector.

Evaluates performance on held-out test data and controlled physical anomaly simulations
(temperature spikes, brood overheating, swarm weight drops, activity collapse).
"""

import os
import json
import joblib
import numpy as np
import pandas as pd

import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from training.feature_engineering import extract_dataframe_features, extract_point_features, FEATURE_COLUMNS
from app.services.ml_service import ml_service
from app.schemas.telemetry import TelemetryData

DATA_PATH = os.path.join("ai", "data", "processed", "hobos_aligned_telemetry.csv")
MODEL_PATH = os.path.join("ai", "models", "hive_anomaly.joblib")


def evaluate_model():
    print("==================================================")
    print("     HONEY CHAIN MODEL EVALUATION & TESTING       ")
    print("==================================================")

    bundle = joblib.load(MODEL_PATH)
    model = bundle['model']
    scaler = bundle['scaler']
    score_bounds = bundle['score_bounds']
    warning_thresh = bundle['thresholds']['warning']
    critical_thresh = bundle['thresholds']['critical']

    # 1. Evaluate on held-out test dataset
    df = pd.read_csv(DATA_PATH)
    df['dt'] = pd.to_datetime(df['timestamp'])
    test_df = df[df['dt'] >= '2019-01-01'].copy()

    X_test_raw = extract_dataframe_features(test_df)
    X_test_scaled = scaler.transform(X_test_raw)

    raw_scores = model.decision_function(X_test_scaled)
    anomaly_scores = np.clip(
        (score_bounds['max'] - raw_scores) / (score_bounds['max'] - score_bounds['min']),
        0.0, 1.0
    )

    print(f"\n[1/2] Evaluation on Held-out 2019 Test Set ({len(test_df):,} hourly records):")
    normal_pct = np.mean(anomaly_scores < warning_thresh) * 100
    warning_pct = np.mean((anomaly_scores >= warning_thresh) & (anomaly_scores < critical_thresh)) * 100
    critical_pct = np.mean(anomaly_scores >= critical_thresh) * 100

    print(f"  Mean Anomaly Score:   {np.mean(anomaly_scores):.4f}")
    print(f"  Normal Telemetry:     {normal_pct:.2f}% (Expected ~90-95% in regular operation)")
    print(f"  Warning Level:        {warning_pct:.2f}%")
    print(f"  Critical Anomalies:   {critical_pct:.2f}%")

    # 2. Stress-testing controlled biological/environmental anomaly scenarios via ML Service
    print("\n[2/2] Controlled Anomaly Scenario Stress Tests (ML Service Engine):")
    
    scenarios = [
        {
            "name": "Standard Spring Day (Normal Baseline)",
            "telemetry": TelemetryData(temperature=24.0, humidity=60.0, weight=54.0, activity=0.35),
            "expected_severity": "NONE"
        },
        {
            "name": "Standard Autumn Day (Normal Baseline)",
            "telemetry": TelemetryData(temperature=20.5, humidity=65.0, weight=53.0, activity=0.15),
            "expected_severity": "NONE"
        },
        {
            "name": "Severe Brood Overheating / Heatwave Spike (>41°C)",
            "telemetry": TelemetryData(temperature=41.5, humidity=45.0, weight=54.0, activity=0.30),
            "expected_severity": "CRITICAL"
        },
        {
            "name": "Sudden Colony Swarm / Honey Robbing (Weight Drop)",
            "telemetry": TelemetryData(temperature=24.0, humidity=60.0, weight=32.0, activity=0.80),
            "expected_severity": "CRITICAL"
        },
        {
            "name": "High Humidity & Rain Dampness",
            "telemetry": TelemetryData(temperature=26.0, humidity=88.0, weight=52.0, activity=0.20),
            "expected_severity": "WARNING"
        },
        {
            "name": "Elevated Hive Temperature Alert",
            "telemetry": TelemetryData(temperature=38.5, humidity=65.0, weight=54.0, activity=0.50),
            "expected_severity": "WARNING"
        }
    ]

    all_passed = True
    for sc in scenarios:
        res = ml_service.analyze_anomaly(
            hive_id="HIVE-TEST",
            telemetry=sc["telemetry"]
        )
        
        passed = (res.severity == sc["expected_severity"]) or (sc["expected_severity"] in ["WARNING", "CRITICAL"] and res.severity in ["WARNING", "CRITICAL"])
        status = "PASSED" if passed else "FAILED"
        if not passed:
            all_passed = False
            
        print(f"  Scenario: {sc['name']}")
        print(f"    Input:    T={sc['telemetry'].temperature}°C, H={sc['telemetry'].humidity}%, W={sc['telemetry'].weight}kg, Act={sc['telemetry'].activity}")
        print(f"    Result:   Severity={res.severity} (Expected: {sc['expected_severity']}) | Anomaly={res.anomaly} | Status={status}")
        if res.reasons:
            print(f"    Reasons:  {', '.join(res.reasons)}")

    print("\nOverall Status:", "ALL SCENARIO TESTS PASSED" if all_passed else "SOME TESTS FAILED")


if __name__ == '__main__':
    evaluate_model()
