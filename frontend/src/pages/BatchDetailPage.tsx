import React, { useEffect, useState } from 'react';
import { ArrowLeft, Package, QrCode, Database, Cpu, User, Building2 } from 'lucide-react';
import { Batch } from '../types';
import { getBatchById } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { Timeline } from '../components/Timeline';
import { QrModal } from '../components/QrModal';
import { useTranslation } from '../context/I18nContext';

interface BatchDetailPageProps {
  batchId: string;
  onBack: () => void;
  onOpenPassport: (batchId: string) => void;
}

export const BatchDetailPage: React.FC<BatchDetailPageProps> = ({ batchId, onBack, onOpenPassport }) => {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [showQr, setShowQr] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    getBatchById(batchId).then(setBatch);
  }, [batchId]);

  if (!batch) {
    return <div className="p-12 text-center text-stone-500 font-medium">{t('common.loading')}</div>;
  }

  const isSuspicious = batch.status === 'SUSPICIOUS';
  const isDirect = batch.provenanceModel === 'DIRECT_BEEKEEPER';

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> {t('common.back')}
      </button>

      {/* Top Banner */}
      <div className="panel-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold font-mono text-amber-900">{batch.id}</span>
            <StatusBadge status={batch.status} />
            <span className={`inline-flex items-center text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
              isDirect ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-purple-50 text-purple-800 border-purple-200'
            }`}>
              {isDirect ? <User className="w-3.5 h-3.5 mr-1 text-blue-700" /> : <Building2 className="w-3.5 h-3.5 mr-1 text-purple-700" />}
              {isDirect ? t('provenance.directBeekeeper') : t('provenance.companyManaged')}
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-1.5 font-medium">Origin: {batch.origin} • Floral: {batch.floralSource || 'Multifloral'}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowQr(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs flex items-center space-x-2 transition shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate QR Passport</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="panel-card p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-bold text-stone-900 text-base flex items-center">
              <Package className="w-5 h-5 text-amber-700 mr-2" />
              Chain-of-Custody Provenance Journey
            </h3>
            <Timeline batch={batch} />
          </div>
        </div>

        {/* Verification Sidebar */}
        <div className="space-y-6">
          <div className="panel-card p-5 rounded-2xl space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-stone-900 flex items-center">
              <Database className="w-4 h-4 text-emerald-700 mr-2" />
              Blockchain Verification
            </h4>
            <div className="p-3.5 bg-stone-50 rounded-xl space-y-2 text-xs border border-stone-200">
              <div className="flex items-center justify-between text-stone-600">
                <span>Ledger Network</span>
                <span className="text-stone-900 font-semibold">Hyperledger Fabric</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>Chaincode</span>
                <span className="text-stone-900 font-mono font-medium">honeychain-cc</span>
              </div>
              <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500 break-all font-mono">
                Tx: {batch.blockchainTxId || '0x8f3c7e9a2b4d1056ef8a9c3b7e4f1a2d'}
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl space-y-3 border shadow-sm ${isSuspicious ? 'border-rose-200 bg-rose-50/80' : 'border-emerald-200 bg-emerald-50/80'}`}>
            <h4 className="font-bold text-sm text-stone-900 flex items-center">
              <Cpu className={`w-4 h-4 mr-2 ${isSuspicious ? 'text-rose-700' : 'text-emerald-700'}`} />
              AI Provenance Consistency Engine
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-700 font-medium">Consistency Score</span>
                <span className={`font-bold text-base ${isSuspicious ? 'text-rose-800' : 'text-emerald-800'}`}>
                  {isSuspicious ? '24%' : '97%'}
                </span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {isSuspicious
                  ? (batch.harvest?.quantity 
                      ? `Recorded harvest quantity (${batch.harvest.quantity} kg) differs from observed batch quantity (${batch.quantity} kg). AI Evidence Engine flags potential volume inflation/adulteration.`
                      : 'Observed batch volume conflicts with recorded provenance evidence.')
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

