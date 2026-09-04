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
    return <div className="p-12 text-center text-stone-500 font-medium">Loading Hive telemetry data...</div>;
  }

  const latest = telemetry[telemetry.length - 1] || { temperature: 34.2, humidity: 61.0, weight: 42.5, activity: 0.82 };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Hive List
      </button>

      {/* Header Info */}
      <div className="panel-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold font-mono text-amber-900">{hive.id}</span>
            <StatusBadge status={hive.status} />
          </div>
          <p className="text-xs text-stone-600 mt-1 font-medium">{hive.location.address || 'Apiary Location'}</p>
        </div>

        <div className="flex items-center space-x-6 border-t md:border-t-0 md:border-l border-stone-200 pt-3 md:pt-0 md:pl-6 text-xs">
          <div>
            <p className="text-stone-500 font-medium">AI Health Score</p>
            <p className={`text-2xl font-bold ${health?.health === 'CRITICAL' ? 'text-rose-800' : health?.health === 'WARNING' ? 'text-amber-800' : 'text-emerald-800'}`}>
              {health?.healthScore ?? 92}/100
            </p>
          </div>
          <div>
            <p className="text-stone-500 font-medium">Status</p>
            <p className="font-bold text-stone-800 text-sm mt-0.5">{health?.health ?? 'NORMAL'}</p>
          </div>
        </div>
      </div>

      {/* Real-Time Telemetry Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel-card p-4 rounded-xl space-y-1">
          <div className="flex items-center text-xs font-semibold text-amber-700">
            <Thermometer className="w-4 h-4 mr-1.5" /> Temperature
          </div>
          <p className="text-2xl font-bold text-stone-900">{latest.temperature}°C</p>
          <p className="text-[11px] text-stone-500">Optimal range: 33°C - 36°C</p>
        </div>

        <div className="panel-card p-4 rounded-xl space-y-1">
          <div className="flex items-center text-xs font-semibold text-sky-700">
            <Droplets className="w-4 h-4 mr-1.5" /> Humidity
          </div>
          <p className="text-2xl font-bold text-stone-900">{latest.humidity}%</p>
          <p className="text-[11px] text-stone-500">Optimal range: 55% - 65%</p>
        </div>

        <div className="panel-card p-4 rounded-xl space-y-1">
          <div className="flex items-center text-xs font-semibold text-emerald-700">
            <Scale className="w-4 h-4 mr-1.5" /> Hive Weight
          </div>
          <p className="text-2xl font-bold text-stone-900">{latest.weight} kg</p>
          <p className="text-[11px] text-stone-500">Estimated Honey Yield: 18.4 kg</p>
        </div>

        <div className="panel-card p-4 rounded-xl space-y-1">
          <div className="flex items-center text-xs font-semibold text-purple-700">
            <Activity className="w-4 h-4 mr-1.5" /> Bee Activity
          </div>
          <p className="text-2xl font-bold text-stone-900">{Math.round(latest.activity * 100)}%</p>
          <p className="text-[11px] text-stone-500">Foraging Flight Index</p>
        </div>
      </div>

      {/* AI Anomaly Insights Banner */}
      {anomalies?.anomaly && (
        <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/90 text-rose-900 space-y-2 shadow-sm">
          <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0" />
            <span>AI Anomaly Alert — Severity: {anomalies.severity}</span>
          </div>
          <ul className="list-disc list-inside text-xs text-rose-900/90 space-y-1 pl-1 font-medium">
            {anomalies.reasons.map((r: string, i: number) => (
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
