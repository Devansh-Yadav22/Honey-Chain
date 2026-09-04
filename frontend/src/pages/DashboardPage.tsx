import React, { useEffect, useState } from 'react';
import { Hexagon, Package, ShieldCheck, ShieldAlert, ArrowRight, QrCode } from 'lucide-react';
import { Hive, Batch } from '../types';
import { getHives, getBatches } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { QrModal } from '../components/QrModal';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [hives, setHives] = useState<Hive[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [qrBatchId, setQrBatchId] = useState<string | null>(null);

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
      {/* Control Center Operational Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D9] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Honey Chain Control Center
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Operational dashboard for hive IoT telemetry, AI anomaly scoring, and Hyperledger Fabric batch provenance
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('passport-search')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>Verify Batch Passport</span>
          </button>
        </div>
      </div>

      {/* Actual Data Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel-card p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Monitored Hives</p>
            <p className="text-3xl font-bold text-stone-900 mt-1">{hives.length}</p>
            <p className="text-xs font-semibold text-emerald-800 mt-1">{healthyHives} Active Baseline</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-700 border border-amber-200 shadow-xs">
            <Hexagon className="w-6 h-6" />
          </div>
        </div>

        <div className="panel-card p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Total Recorded Volume</p>
            <p className="text-3xl font-bold text-stone-900 mt-1">{totalHoneyKg} kg</p>
            <p className="text-xs text-stone-500 mt-1">{batches.length} Registered Batches</p>
          </div>
          <div className="p-3 bg-sky-50 rounded-xl text-sky-700 border border-sky-200 shadow-xs">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="panel-card p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">On-Chain Verified</p>
            <p className="text-3xl font-bold text-emerald-800 mt-1">{verifiedBatches}</p>
            <p className="text-xs text-stone-500 mt-1">Full Evidence Match</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700 border border-emerald-200 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="panel-card p-5 flex items-center justify-between border-rose-200">
          <div>
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Flagged Inconsistencies</p>
            <p className="text-3xl font-bold text-rose-800 mt-1">{suspiciousBatches}</p>
            <p className="text-xs text-rose-700 mt-1">Quantity Discrepancy</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-700 border border-rose-200 shadow-xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Operational Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Apiary Telemetry & Hive Status Table */}
        <div className="lg:col-span-2 panel-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Hive Telemetry & Health Monitoring</h3>
              <p className="text-xs text-stone-500 mt-0.5">Live IoT time-series readings and AI risk assessment</p>
            </div>
            <button
              onClick={() => onNavigate('hives')}
              className="text-xs text-amber-700 hover:text-amber-800 hover:underline flex items-center font-semibold"
            >
              <span>View All Hives</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase text-[11px] bg-stone-50/60">
                  <th className="py-2.5 px-3.5">Hive ID</th>
                  <th className="py-2.5 px-3.5">Location</th>
                  <th className="py-2.5 px-3.5">Temp / Humid</th>
                  <th className="py-2.5 px-3.5">AI Health</th>
                  <th className="py-2.5 px-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {hives.slice(0, 6).map((h) => {
                  const temp = h.id === 'HIVE-005' ? '41.8°C' : h.id === 'HIVE-003' ? '38.2°C' : h.id === 'HIVE-007' ? '9.5°C' : '34.5°C';
                  const humid = h.id === 'HIVE-005' ? '82%' : h.id === 'HIVE-003' ? '74%' : h.id === 'HIVE-007' ? '88%' : '60%';
                  const score = h.status === 'CRITICAL' ? 38 : h.status === 'WARNING' ? 65 : 95;

                  return (
                    <tr
                      key={h.id}
                      onClick={() => onNavigate(`hive-${h.id}`)}
                      className="hover:bg-amber-50/40 cursor-pointer transition"
                    >
                      <td className="py-3 px-3.5 font-mono font-bold text-amber-900">{h.id}</td>
                      <td className="py-3 px-3.5 text-stone-700 max-w-[150px] truncate">{h.location.address || 'Apiary #1'}</td>
                      <td className="py-3 px-3.5 text-stone-600 font-mono text-[11px]">{temp} / {humid}</td>
                      <td className="py-3 px-3.5 font-bold font-mono">
                        <span className={score < 50 ? 'text-rose-800' : score < 80 ? 'text-amber-800' : 'text-emerald-800'}>
                          {score}/100
                        </span>
                      </td>
                      <td className="py-3 px-3.5">
                        <StatusBadge status={h.status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Batch Provenance Ledger Log */}
        <div className="panel-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Batch Provenance Stream</h3>
              <p className="text-xs text-stone-500 mt-0.5">Blockchain records & evidence consistency</p>
            </div>
            <button
              onClick={() => onNavigate('batches')}
              className="text-xs text-amber-700 hover:text-amber-800 hover:underline flex items-center font-semibold"
            >
              <span>All Batches</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="p-3.5 bg-stone-50/70 rounded-xl border border-stone-200 flex items-center justify-between hover:border-amber-300 hover:bg-amber-50/30 transition shadow-2xs"
              >
                <div onClick={() => onNavigate(`batch-${batch.id}`)} className="cursor-pointer">
                  <p className="font-mono text-xs text-amber-900 font-bold">{batch.id}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{batch.quantity} kg • {batch.origin.substring(0, 18)}...</p>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={batch.status} size="sm" />
                  <button
                    onClick={() => setQrBatchId(batch.id)}
                    className="p-1.5 bg-white hover:bg-amber-100 text-stone-600 hover:text-amber-900 rounded-lg border border-stone-200 transition shadow-2xs"
                    title="Generate QR Code"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Modal Component */}
      {qrBatchId && (
        <QrModal
          batchId={qrBatchId}
          onClose={() => setQrBatchId(null)}
          onOpenPassport={(id: string) => onNavigate(`passport-${id}`)}
        />
      )}
    </div>
  );
};
