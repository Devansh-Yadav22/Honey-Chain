import React, { useEffect, useState } from 'react';
import { Package, ArrowRight, User, Building2 } from 'lucide-react';
import { Batch } from '../types';
import { getBatches } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { useTranslation } from '../context/I18nContext';

interface BatchListPageProps {
  onSelectBatch: (id: string) => void;
}

export const BatchListPage: React.FC<BatchListPageProps> = ({ onSelectBatch }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'VERIFIED' | 'SUSPICIOUS'>('ALL');
  const { t } = useTranslation();

  useEffect(() => {
    getBatches().then(setBatches);
  }, []);

  const filteredBatches = batches.filter(b => {
    if (filter === 'VERIFIED') return b.status === 'VERIFIED';
    if (filter === 'SUSPICIOUS') return b.status === 'SUSPICIOUS';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Package className="w-6 h-6 text-[#3D5A3A] mr-2.5" />
            Honey Batch Provenance Registry
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Tracked batch journey from hive harvest to packaging & on-chain verification
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-1.5 bg-[#F5F0E8] p-1.5 rounded-full border border-stone-200/80 self-start shadow-2xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'ALL' ? 'bg-[#3D5A3A] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Batches ({batches.length})
          </button>
          <button
            onClick={() => setFilter('VERIFIED')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'VERIFIED' ? 'bg-[#3D5A3A] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Verified ({batches.filter(b => b.status === 'VERIFIED').length})
          </button>
          <button
            onClick={() => setFilter('SUSPICIOUS')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'SUSPICIOUS' ? 'bg-[#3D5A3A] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Suspicious ({batches.filter(b => b.status === 'SUSPICIOUS').length})
          </button>
        </div>
      </div>

      <div className="space-y-3.5">
        {filteredBatches.map((batch) => {
          const isDirect = batch.provenanceModel === 'DIRECT_BEEKEEPER';
          return (
            <div
              key={batch.id}
              onClick={() => onSelectBatch(batch.id)}
              className="panel-card panel-card-hover p-5 rounded-2xl cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-stone-200/80"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                  <span className="font-mono font-bold text-lg text-stone-900" style={{ fontFamily: "'Outfit', sans-serif" }}>{batch.id}</span>
                  <StatusBadge status={batch.status} />
                  <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    isDirect ? 'bg-forest-50 text-[#3D5A3A] border-forest-200' : 'bg-stone-100 text-stone-700 border-stone-200'
                  }`}>
                    {isDirect ? <User className="w-3 h-3 mr-1 text-[#3D5A3A]" /> : <Building2 className="w-3 h-3 mr-1 text-stone-600" />}
                    {isDirect ? t('provenance.directBeekeeper') : t('provenance.companyManaged')}
                  </span>
                </div>
                <p className="text-xs text-stone-700 font-medium">Origin: {batch.origin}</p>
                <p className="text-[11px] text-stone-400 font-mono">Blockchain Tx: {batch.blockchainTxId || 'Pending Confirmation'}</p>
              </div>

              <div className="flex items-center justify-between md:justify-end space-x-6 border-t md:border-t-0 border-stone-200 pt-3 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-xs text-stone-500 font-medium">Batch Quantity</p>
                  <p className="font-bold text-stone-900 text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>{batch.quantity} kg</p>
                </div>

                <button className="px-4 py-2 bg-stone-50 hover:bg-[#3D5A3A] hover:text-white text-stone-800 border border-stone-200 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs">
                  <span>Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

