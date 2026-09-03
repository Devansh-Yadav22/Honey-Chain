import React, { useEffect, useState } from 'react';
import { Hexagon, Package, ShieldCheck, ShieldAlert, ArrowRight, Zap } from 'lucide-react';
import { Hive, Batch } from '../types';
import { getHives, getBatches } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [hives, setHives] = useState<Hive[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    getHives().then(setHives);
    getBatches().then(setBatches);
  }, []);

  const healthyHives = hives.filter(h => h.status === 'ACTIVE').length;
  const verifiedBatches = batches.filter(b => b.status === 'VERIFIED').length;
  const suspiciousBatches = batches.filter(b => b.status === 'SUSPICIOUS').length;
  const totalHoneyKg = batches.reduce((acc, b) => acc + b.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="glass-card p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-stone-900 to-stone-900 border-amber-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold border border-amber-500/20 mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Honey Chain Core USP Operating</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-100 tracking-tight">
            Blockchain Traceability & AI Hive Intelligence
          </h1>
          <p className="text-stone-400 text-sm mt-2 leading-relaxed">
            Permissioned trust layer (Hyperledger Fabric) preserves tamper-evident provenance history.
            AI evidence engine verifies real-world consistency.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-xl border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Monitored Hives</p>
            <h3 className="text-2xl font-bold text-stone-100 mt-1">{hives.length}</h3>
            <p className="text-[11px] text-emerald-400 mt-1">{healthyHives} Healthy & Active</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <Hexagon className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Recorded Volume</p>
            <h3 className="text-2xl font-bold text-stone-100 mt-1">{totalHoneyKg} kg</h3>
            <p className="text-[11px] text-stone-400 mt-1">{batches.length} Total Batches</p>
          </div>
          <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">On-Chain Verified</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{verifiedBatches}</h3>
            <p className="text-[11px] text-emerald-500/80 mt-1">100% Provenance Match</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-rose-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Flagged Inconsistencies</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">{suspiciousBatches}</h3>
            <p className="text-[11px] text-rose-400 mt-1">AI Evidence Anomalies</p>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Hives Overview */}
        <div className="lg:col-span-2 glass-card p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-100 text-base">Smart Hive Intelligence</h3>
              <p className="text-xs text-stone-400">Real-time simulated telemetry & AI disease risk</p>
            </div>
            <button
              onClick={() => onNavigate('hives')}
              className="text-xs text-amber-400 hover:underline flex items-center"
            >
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hives.slice(0, 4).map((hive) => (
              <div
                key={hive.id}
                onClick={() => onNavigate(`hive-${hive.id}`)}
                className="p-4 bg-stone-900/60 rounded-xl border border-stone-800 hover:border-amber-500/40 cursor-pointer transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 text-sm">{hive.id}</span>
                  <StatusBadge status={hive.status} />
                </div>
                <p className="text-xs text-stone-400 mt-2 truncate">{hive.location.address || 'Apiary Location'}</p>
                <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Temp: 34.2°C</span>
                  <span>Humidity: 61%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Batches & Verification */}
        <div className="glass-card p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-100 text-base">Honey Batches</h3>
              <p className="text-xs text-stone-400">Provenance & passport records</p>
            </div>
            <button
              onClick={() => onNavigate('batches')}
              className="text-xs text-amber-400 hover:underline flex items-center"
            >
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {batches.map((batch) => (
              <div
                key={batch.id}
                onClick={() => onNavigate(`batch-${batch.id}`)}
                className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 hover:border-amber-500/40 cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <p className="font-mono text-xs text-amber-400 font-semibold">{batch.id}</p>
                  <p className="text-[11px] text-stone-400">{batch.quantity} kg • {batch.origin.substring(0, 20)}...</p>
                </div>
                <StatusBadge status={batch.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
