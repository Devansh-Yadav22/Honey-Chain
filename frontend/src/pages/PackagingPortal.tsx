import React, { useEffect, useState } from 'react';
import { Batch } from '../types';
import { getBatches, recordBatchPackaging, publishBatchPassport } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { Package, QrCode, CheckCircle2, Hexagon, Tag, Sparkles } from 'lucide-react';
import { QrModal } from '../components/QrModal';

export const PackagingPortal: React.FC<{ onNavigateToBatch?: (id: string) => void }> = ({ onNavigateToBatch }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  // Packaging form state
  const [productId, setProductId] = useState('HONEY-RAW-ORGANIC-500G');
  const [containerType, setContainerType] = useState('Glass Hexagonal Jar (500g)');
  const [unitsCount, setUnitsCount] = useState('50');
  const [unitWeightGrams, setUnitWeightGrams] = useState('500');
  const [isPackaging, setIsPackaging] = useState(false);

  // QR Modal
  const [qrBatchId, setQrBatchId] = useState<string | null>(null);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    const list = await getBatches();
    setBatches(list);
    if (list.length > 0 && !selectedBatch) {
      const pkgBatch = list.find(b => b.status === 'RECEIVED' || b.status === 'PACKAGED' || b.status === 'PUBLISHED') || list[0];
      setSelectedBatch(pkgBatch);
      setUnitsCount(String(Math.floor((pkgBatch.quantity * 1000) / 500)));
    }
  };

  const handlePackaging = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;
    setIsPackaging(true);

    await recordBatchPackaging(selectedBatch.id, {
      productId,
      containerType,
      unitsCount: parseInt(unitsCount),
      unitWeightGrams: parseInt(unitWeightGrams)
    });

    setIsPackaging(false);
    await loadBatches();
  };

  const handlePublishPassport = async (batchId: string) => {
    await publishBatchPassport(batchId);
    await loadBatches();
    setQrBatchId(batchId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#EAE3D9]">
        <div className="flex items-center space-x-2">
          <span className="text-xl">📦</span>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Packaging & Passport Plant</h1>
        </div>
        <p className="text-xs text-stone-600 mt-1">
          PureFlora Packaging Hub • Food-grade jar bottling, tamper-evident sealing, and public Honey Passport QR generation.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batches Queue */}
        <div className="bg-white border border-[#EAE3D9] rounded-xl p-4 space-y-3">
          <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
            Packaging Batches ({batches.length})
          </h2>
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {batches.map(batch => {
              const isSelected = selectedBatch?.id === batch.id;
              return (
                <div
                  key={batch.id}
                  onClick={() => {
                    setSelectedBatch(batch);
                    setUnitsCount(String(Math.floor((batch.quantity * 1000) / 500)));
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                      : 'bg-[#FFFDF9] border-[#EAE3D9] hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-stone-900">{batch.id}</span>
                    <StatusBadge status={batch.status} type="batch" />
                  </div>
                  <div className="text-[11px] text-stone-600 mt-1 flex justify-between">
                    <span>{batch.floralSource || 'Floral Honey'}</span>
                    <span className="font-mono font-semibold">{batch.quantity} kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Packaging Form & Passport Publishing */}
        <div className="lg:col-span-2 space-y-5">
          {selectedBatch ? (
            <div className="bg-white border border-[#EAE3D9] rounded-xl p-6 space-y-6">
              {/* Batch Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE3D9]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-lg text-amber-800">{selectedBatch.id}</span>
                    <StatusBadge status={selectedBatch.status} type="batch" />
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">Total Volume: {selectedBatch.quantity} kg • {selectedBatch.origin}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQrBatchId(selectedBatch.id)}
                    className="inline-flex items-center px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-[#EAE3D9]"
                  >
                    <QrCode className="w-4 h-4 mr-1.5 text-stone-700" /> Preview QR
                  </button>

                  {selectedBatch.status !== 'PUBLISHED' && (
                    <button
                      onClick={() => handlePublishPassport(selectedBatch.id)}
                      className="inline-flex items-center px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      <Sparkles className="w-4 h-4 mr-1.5" /> Publish Digital Passport
                    </button>
                  )}
                </div>
              </div>

              {/* Packaging Form */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-stone-800 flex items-center">
                  <Package className="w-4 h-4 mr-1.5 text-amber-700" /> Record Jar Packaging & Labeling
                </h3>

                <form onSubmit={handlePackaging} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Public SKU / Product ID</label>
                    <input
                      type="text"
                      required
                      value={productId}
                      onChange={e => setProductId(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Container Packaging Spec</label>
                    <select
                      value={containerType}
                      onChange={e => setContainerType(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800"
                    >
                      <option value="Glass Hexagonal Jar (500g)">Glass Hexagonal Jar (500g)</option>
                      <option value="Glass Round Jar (250g)">Glass Round Jar (250g)</option>
                      <option value="Food-Grade Squeeze Bottle (350g)">Food-Grade Squeeze Bottle (350g)</option>
                      <option value="Bulk Stainless Steel Pail (5kg)">Bulk Stainless Steel Pail (5kg)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Bottled Units Count</label>
                    <input
                      type="number"
                      required
                      value={unitsCount}
                      onChange={e => setUnitsCount(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Unit Net Weight (Grams)</label>
                    <input
                      type="number"
                      required
                      value={unitWeightGrams}
                      onChange={e => setUnitWeightGrams(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={isPackaging}
                      className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-semibold rounded-lg shadow-sm text-xs flex items-center justify-center transition-colors"
                    >
                      <Tag className="w-3.5 h-3.5 mr-1.5" />
                      {isPackaging ? 'Committing Packaging to Fabric...' : 'Sign Packaging Event & Assign Consumer Batch'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Recorded Packaging Events */}
              <div className="space-y-2 pt-2 border-t border-[#EAE3D9]">
                <h4 className="text-xs font-mono font-bold text-stone-600 uppercase">Logged Packaging Records</h4>
                {selectedBatch.packagingEvents && selectedBatch.packagingEvents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedBatch.packagingEvents.map((pkg, idx) => (
                      <div key={pkg.id || idx} className="p-3.5 bg-[#FAF8F5] border border-[#EAE3D9] rounded-lg text-xs flex items-center justify-between">
                        <div>
                          <p className="font-bold text-stone-800">{pkg.productId}</p>
                          <p className="text-[11px] text-stone-500">{pkg.containerType || 'Glass Jar'} • {pkg.unitsCount || 40} Units</p>
                        </div>
                        <div className="text-right text-[11px] font-mono text-stone-600">
                          {new Date(pkg.packagingDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic">No packaging events logged yet for this batch.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#EAE3D9] rounded-xl p-8 text-center text-stone-500 text-xs">
              Select a batch from the queue to manage packaging operations.
            </div>
          )}
        </div>
      </div>

      {qrBatchId && (
        <QrModal
          batchId={qrBatchId}
          onClose={() => setQrBatchId(null)}
          onOpenPassport={(id) => {
            setQrBatchId(null);
            if (onNavigateToBatch) onNavigateToBatch(id);
          }}
        />
      )}
    </div>
  );
};
