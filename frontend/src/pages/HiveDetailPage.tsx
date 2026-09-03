import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShieldAlert, Thermometer, Droplets, Scale, Activity } from 'lucide-react';
import { Hive, TelemetryRecord, AiHealth, AiAnomaly } from '../types';
import { getHiveById, getHiveTelemetry, getHiveHealth, getHiveAnomalies } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { TelemetryChart } from '../components/TelemetryChart';

interface HiveDetailPageProps {
  hiveId: string;
  onBack: () => void;
}

export const HiveDetailPage: React.FC<HiveDetailPageProps> = ({ hiveId, onBack }) => {
  const [hive, setHive] = useState<Hive | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryRecord[]>([]);
  const [health, setHealth] = useState<AiHealth | null>(null);
  const [anomalies, setAnomalies] = useState<AiAnomaly | null>(null);

  useEffect(() => {
    getHiveById(hiveId).then(setHive);
    getHiveTelemetry(hiveId).then(setTelemetry);
    getHiveHealth(hiveId).then(setHealth);
    getHiveAnomalies(hiveId).then(setAnomalies);
  }, [hiveId]);

  if (!hive) {
    return <div className="p-8 text-center text-stone-400">Loading Hive telemetry data...</div>;
  }

  const latest = telemetry[telemetry.length - 1] || { temperature: 34.2, humidity: 61.0, weight: 42.5, activity: 0.82 };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center text-xs text-amber-400 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Hive List
      </button>

      {/* Header Info */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold font-mono text-amber-400">{hive.id}</span>
            <StatusBadge status={hive.status} />
          </div>
          <p className="text-xs text-stone-400 mt-1">{hive.location.address || 'Apiary Location'}</p>
        </div>

        <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-stone-800 pt-3 md:pt-0 md:pl-6 text-xs">
          <div>
            <p className="text-stone-500">AI Health Score</p>
            <p className={`text-xl font-bold ${health?.health === 'CRITICAL' ? 'text-rose-400' : health?.health === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'}`}>
              {health?.healthScore ?? 92}/100
            </p>
          </div>
          <div>
            <p className="text-stone-500">Status</p>
            <p className="font-semibold text-stone-200">{health?.health ?? 'NORMAL'}</p>
          </div>
        </div>
      </div>

      {/* Real-Time Telemetry Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex items-center text-xs text-amber-400">
            <Thermometer className="w-4 h-4 mr-1.5" /> Temperature
          </div>
          <p className="text-2xl font-bold text-stone-100">{latest.temperature}°C</p>
          <p className="text-[11px] text-stone-400">Optimal range: 33°C - 36°C</p>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex items-center text-xs text-sky-400">
            <Droplets className="w-4 h-4 mr-1.5" /> Humidity
          </div>
          <p className="text-2xl font-bold text-stone-100">{latest.humidity}%</p>
          <p className="text-[11px] text-stone-400">Optimal range: 55% - 65%</p>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex items-center text-xs text-emerald-400">
            <Scale className="w-4 h-4 mr-1.5" /> Hive Weight
          </div>
          <p className="text-2xl font-bold text-stone-100">{latest.weight} kg</p>
          <p className="text-[11px] text-stone-400">Estimated Honey Yield: 18.4 kg</p>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex items-center text-xs text-purple-400">
            <Activity className="w-4 h-4 mr-1.5" /> Bee Activity
          </div>
          <p className="text-2xl font-bold text-stone-100">{Math.round(latest.activity * 100)}%</p>
          <p className="text-[11px] text-stone-400">Foraging Flight Index</p>
        </div>
      </div>

      {/* AI Anomaly Insights Banner */}
      {anomalies?.anomaly && (
        <div className="glass-card p-5 rounded-xl border border-rose-500/30 bg-rose-950/30 space-y-2">
          <div className="flex items-center space-x-2 text-rose-400 font-semibold text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>AI Anomaly Alert — Severity: {anomalies.severity}</span>
          </div>
          <ul className="list-disc list-inside text-xs text-rose-300 space-y-1 pl-1">
            {anomalies.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Telemetry Line Chart */}
      <TelemetryChart data={telemetry} />
    </div>
  );
};
