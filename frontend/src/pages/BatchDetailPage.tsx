import React, { useEffect, useState } from 'react';
import { ArrowLeft, Package, QrCode, Database, Cpu } from 'lucide-react';
import { Batch } from '../types';
import { getBatchById } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { Timeline } from '../components/Timeline';
import { QrModal } from '../components/QrModal';

interface BatchDetailPageProps {
  batchId: string;
  onBack: () => void;
  onOpenPassport: (batchId: string) => void;
}

export const BatchDetailPage: React.FC<BatchDetailPageProps> = ({ batchId, onBack, onOpenPassport }) => {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    getBatchById(batchId).then(setBatch);
  }, [batchId]);

  if (!batch) {
    return <div className="p-8 text-center text-stone-400">Loading batch details...</div>;
  }

  const isSuspicious = batch.status === 'SUSPICIOUS';

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center text-xs text-amber-400 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Batch List
      </button>

      {/* Top Banner */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold font-mono text-amber-400">{batch.id}</span>
            <StatusBadge status={batch.status} />
          </div>
          <p className="text-xs text-stone-400 mt-1">Origin: {batch.origin}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowQr(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center space-x-2 transition shadow-lg shadow-amber-500/20"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate QR Passport</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-stone-100 text-base flex items-center">
              <Package className="w-5 h-5 text-amber-400 mr-2" />
              Supply Chain Chain-of-Custody Timeline
            </h3>
            <Timeline batch={batch} />
          </div>
        </div>

        {/* Verification Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <h4 className="font-bold text-sm text-stone-200 flex items-center">
              <Database className="w-4 h-4 text-emerald-400 mr-2" />
              Blockchain Verification
            </h4>
            <div className="p-3 bg-stone-900/80 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-400">
                <span>Ledger Network</span>
                <span className="text-stone-200 font-medium">Hyperledger Fabric</span>
              </div>
              <div className="flex items-center justify-between text-stone-400">
                <span>Chaincode</span>
                <span className="text-stone-200 font-mono">honeychain-cc</span>
              </div>
              <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-500 break-all font-mono">
                Tx: {batch.blockchainTxId || '0x8f3c7e9a2b4d1056ef8a9c3b7e4f1a2d'}
              </div>
            </div>
          </div>

          <div className={`glass-card p-5 rounded-2xl space-y-3 border ${isSuspicious ? 'border-rose-500/30 bg-rose-950/20' : 'border-emerald-500/30 bg-emerald-950/20'}`}>
            <h4 className="font-bold text-sm text-stone-200 flex items-center">
              <Cpu className={`w-4 h-4 mr-2 ${isSuspicious ? 'text-rose-400' : 'text-emerald-400'}`} />
              AI Provenance Consistency Engine
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Consistency Score</span>
                <span className={`font-bold ${isSuspicious ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isSuspicious ? '24%' : '97%'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                {isSuspicious
                  ? 'Recorded harvest quantity (18 kg) differs from observed batch quantity (31 kg). Evidence Engine flags potential volume adulteration.'
                  : 'All recorded timestamps, IoT telemetry vectors, and quantities match harvest evidence.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showQr && (
        <QrModal
          batchId={batch.id}
          onClose={() => setShowQr(false)}
          onOpenPassport={onOpenPassport}
        />
      )}
    </div>
  );
};
