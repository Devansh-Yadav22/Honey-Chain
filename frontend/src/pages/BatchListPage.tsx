import React, { useEffect, useState } from 'react';
import { Package, ArrowRight } from 'lucide-react';
import { Batch } from '../types';
import { getBatches } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

interface BatchListPageProps {
  onSelectBatch: (id: string) => void;
}

export const BatchListPage: React.FC<BatchListPageProps> = ({ onSelectBatch }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'VERIFIED' | 'SUSPICIOUS'>('ALL');

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE3D9] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center">
            <Package className="w-6 h-6 text-amber-600 mr-2.5" />
            Honey Batch Provenance Registry
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Tracked batch journey from hive harvest to packaging & on-chain verification
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 self-start shadow-2xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'ALL' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Batches ({batches.length})
          </button>
          <button
            onClick={() => setFilter('VERIFIED')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'VERIFIED' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Verified ({batches.filter(b => b.status === 'VERIFIED').length})
          </button>
          <button
            onClick={() => setFilter('SUSPICIOUS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'SUSPICIOUS' ? 'bg-white text-rose-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Suspicious ({batches.filter(b => b.status === 'SUSPICIOUS').length})
          </button>
        </div>
      </div>

      <div className="space-y-3.5">
        {filteredBatches.map((batch) => (
          <div
            key={batch.id}
            onClick={() => onSelectBatch(batch.id)}
            className="panel-card panel-card-hover p-5 rounded-2xl cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="space-y-1.5">
              <div className="flex items-center space-x-3">
                <span className="font-mono font-bold text-lg text-amber-900">{batch.id}</span>
                <StatusBadge status={batch.status} />
              </div>
              <p className="text-xs text-stone-700 font-medium">Origin: {batch.origin}</p>
              <p className="text-[11px] text-stone-400 font-mono">Blockchain Tx: {batch.blockchainTxId || 'Pending Confirmation'}</p>
            </div>

            <div className="flex items-center justify-between md:justify-end space-x-6 border-t md:border-t-0 border-stone-200 pt-3 md:pt-0">
              <div className="text-left md:text-right">
                <p className="text-xs text-stone-500 font-medium">Batch Quantity</p>
                <p className="font-bold text-stone-900 text-lg">{batch.quantity} kg</p>
              </div>

              <button className="px-4 py-2 bg-stone-50 hover:bg-amber-600 hover:text-white text-stone-800 border border-stone-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs">
                <span>Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
