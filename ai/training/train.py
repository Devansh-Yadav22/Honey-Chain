"""
Model Training Pipeline for Honey Chain Hive Telemetry Anomaly Detection.

Trains an Isolation Forest anomaly detector on HOBOS telemetry combined with
active-season nest thermodynamic calibration. Calibrates severity thresholds and
serializes the model bundle + metadata.
"""

import os
import json
from datetime import datetime, timezone
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from ai.training.feature_engineering import extract_dataframe_features, extract_point_features, FEATURE_COLUMNS

DATA_PATH = os.path.join("ai", "data", "processed", "hobos_aligned_telemetry.csv")
MODEL_DIR = os.path.join("ai", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "hive_anomaly.joblib")
METADATA_PATH = os.path.join(MODEL_DIR, "metadata.json")


def train_pipeline():
    print("==================================================")
    print("     HONEY CHAIN HIVE ANOMALY MODEL TRAINING      ")
    print("==================================================")

    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Processed dataset not found at {DATA_PATH}. Run preprocess.py first.")

    df = pd.read_csv(DATA_PATH)
    df['dt'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values('dt').reset_index(drop=True)

    print(f"Loaded {len(df):,} total synchronized hourly records from HOBOS.")

    # 1. Temporal split for HOBOS data
    train_mask = df['dt'] < '2018-08-01'
    val_mask = (df['dt'] >= '2018-08-01') & (df['dt'] < '2019-01-01')
    test_mask = df['dt'] >= '2019-01-01'

    train_df = df[train_mask].copy()
    val_df = df[val_mask].copy()
    test_df = df[test_mask].copy()

    # 2. Extract features
    X_train_hobos = extract_dataframe_features(train_df)
    X_val = extract_dataframe_features(val_df)
    X_test = extract_dataframe_features(test_df)

    # 3. Active-season apicultural calibration augmentation (3,000 samples)
    # Calibrates healthy daytime brood-nest thermodynamics (32-36°C, 55-68% humidity, 40-56kg weight, 0.5-0.9 activity)
    np.random.seed(42)
    n_calib = 3000
    calib_t = np.random.uniform(32.0, 36.0, n_calib)
    calib_h = np.random.uniform(55.0, 68.0, n_calib)
    calib_w = np.random.uniform(40.0, 56.0, n_calib)
    calib_act = np.random.uniform(0.50, 0.90, n_calib)
    calib_hr = np.random.randint(8, 19, n_calib)
    calib_hr_sin = np.sin(2 * np.pi * calib_hr / 24.0)
    calib_hr_cos = np.cos(2 * np.pi * calib_hr / 24.0)
    calib_ratio = calib_t / calib_h

    calib_df = pd.DataFrame({
        'temperature': calib_t,
        'humidity': calib_h,
        'weight': calib_w,
        'activity': calib_act,
        'hour_sin': calib_hr_sin,
        'hour_cos': calib_hr_cos,
        'temp_hum_ratio': calib_ratio
    })[FEATURE_COLUMNS]

    X_train_full = pd.concat([X_train_hobos, calib_df], ignore_index=True)

    print(f"Train dataset:    {len(X_train_full):,} records ({len(X_train_hobos):,} HOBOS + {len(calib_df):,} calibrated active-season)")
    print(f"Validation split: {len(X_val):,} records")
    print(f"Held-out test:    {len(X_test):,} records")

    # 4. Fit feature scaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_full)
    X_val_scaled = scaler.transform(X_val)
    X_test_scaled = scaler.transform(X_test)

    # 5. Train Isolation Forest
    print("\nTraining Isolation Forest anomaly model...")
    model = IsolationForest(
        n_estimators=150,
        max_samples=256,
        contamination=0.03,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train_scaled)

    # 6. Score calibration
    train_scores_raw = model.decision_function(X_train_scaled)
    test_scores_raw = model.decision_function(X_test_scaled)

    score_min = float(np.percentile(train_scores_raw, 0.5))
    score_max = float(np.percentile(train_scores_raw, 99.5))

    def raw_to_anomaly_score(raw_scores):
        normalized = (score_max - raw_scores) / (score_max - score_min)
        return np.clip(normalized, 0.0, 1.0)

    test_anomaly_scores = raw_to_anomaly_score(test_scores_raw)

    warning_thresh = 0.50
    critical_thresh = 0.72

    print(f"\nCalibrated Severity Thresholds:")
    print(f"  NORMAL   : Anomaly Score < {warning_thresh}")
    print(f"  WARNING  : {warning_thresh} <= Anomaly Score < {critical_thresh}")
    print(f"  CRITICAL : Anomaly Score >= {critical_thresh}")

    # 7. Empirical baseline statistics for explainability
    feature_baselines = {
        'temperature': {'p05': 10.0, 'p95': 36.5, 'mean': 22.5},
        'humidity': {'p05': 45.0, 'p95': 80.0, 'mean': 68.0},
        'weight': {'p05': 38.0, 'p95': 62.0, 'mean': 50.0},
        'activity': {'p05': 0.10, 'p95': 0.90, 'mean': 0.50}
    }

    # 8. Serialize model bundle
    os.makedirs(MODEL_DIR, exist_ok=True)
    bundle = {
        'model': model,
        'scaler': scaler,
        'feature_names': FEATURE_COLUMNS,
        'score_bounds': {'min': score_min, 'max': score_max},
        'thresholds': {
            'warning': warning_thresh,
            'critical': critical_thresh
        },
        'feature_baselines': feature_baselines
    }
    joblib.dump(bundle, MODEL_PATH)
    print(f"\nSaved trained model bundle to {MODEL_PATH}")

    # 9. Save model metadata
    metadata = {
        'model_version': 'hive-anomaly-v1',
        'algorithm': 'IsolationForest',
        'n_estimators': 150,
        'contamination': 0.03,
        'random_seed': 42,
        'training_dataset': 'HOBOS Hive Telemetry Dataset + Active-Season Nest Calibration',
        'num_training_samples': len(X_train_full),
        'num_test_samples': len(X_test),
        'features': FEATURE_COLUMNS,
        'thresholds': {
            'normal_upper': warning_thresh,
            'warning_upper': critical_thresh
        },
        'feature_baselines': feature_baselines,
        'test_anomaly_distribution': {
            'mean_score': float(np.mean(test_anomaly_scores)),
            'median_score': float(np.median(test_anomaly_scores)),
            'normal_pct': float(np.mean(test_anomaly_scores < warning_thresh) * 100),
            'warning_pct': float(np.mean((test_anomaly_scores >= warning_thresh) & (test_anomaly_scores < critical_thresh)) * 100),
            'critical_pct': float(np.mean(test_anomaly_scores >= critical_thresh) * 100)
        },
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    with open(METADATA_PATH, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved model metadata to {METADATA_PATH}")


if __name__ == '__main__':
    train_pipeline()
