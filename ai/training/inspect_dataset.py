import os
import glob
import pandas as pd
import numpy as np

def inspect_all():
    print("==================================================")
    print("       HOBOS HIVE TELEMETRY DATASET AUDIT         ")
    print("==================================================")
    
    archive_files = sorted(glob.glob('archive/*.csv'))
    if not archive_files:
        print("No CSV files found in archive/ folder!")
        return

    summary = []
    for f in archive_files:
        df = pd.read_csv(f)
        val_col = [c for c in df.columns if c != 'timestamp'][0]
        null_count = df[val_col].isnull().sum()
        total_rows = len(df)
        
        df['dt'] = pd.to_datetime(df['timestamp'], errors='coerce')
        min_date = df['dt'].min()
        max_date = df['dt'].max()
        
        # Sampling interval
        intervals = df['dt'].diff().dropna().value_counts()
        primary_interval = intervals.index[0] if len(intervals) > 0 else "N/A"
        
        summary.append({
            'file': os.path.basename(f),
            'signal': val_col,
            'rows': total_rows,
            'nulls': null_count,
            'null_pct': (null_count / total_rows) * 100 if total_rows > 0 else 0,
            'min_val': df[val_col].min(),
            'mean_val': df[val_col].mean(),
            'median_val': df[val_col].median(),
            'max_val': df[val_col].max(),
            'min_date': str(min_date),
            'max_date': str(max_date),
            'primary_interval': str(primary_interval)
        })
        
        print(f"\n--- {os.path.basename(f)} ---")
        print(f"Signal: {val_col} | Rows: {total_rows:,} | Nulls: {null_count} ({null_count/total_rows*100:.2f}%)")
        print(f"Date Range: {min_date} to {max_date}")
        print(f"Primary Interval: {primary_interval} ({intervals.iloc[0]} occurrences)")
        print(f"Stats: Min={df[val_col].min()}, Mean={df[val_col].mean():.2f}, Median={df[val_col].median():.2f}, Max={df[val_col].max()}")

    summary_df = pd.DataFrame(summary)
    print("\n==================================================")
    print("                  SUMMARY TABLE                   ")
    print("==================================================")
    print(summary_df[['file', 'signal', 'rows', 'min_val', 'max_val', 'min_date', 'max_date', 'primary_interval']])

if __name__ == '__main__':
    inspect_all()
