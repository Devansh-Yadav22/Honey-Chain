import React, { useEffect, useState } from 'react';
import { Batch } from '../types';
import { getBatches, recordBatchIntake, recordBatchProcessing, markBatchReadyTransport } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { Settings, CheckCircle2, Thermometer, Droplets, Filter, ArrowRight } from 'lucide-react';

export const ProcessorPortal: React.FC<{ onNavigateToBatch?: (id: string) => void }> = ({ onNavigateToBatch }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  // Processing form state
  const [eventType, setEventType] = useState('MOISTURE_EXTRACTION');
  const [tempC, setTempC] = useState('38.5');
  const [moisture, setMoisture] = useState('17.8');
  const [outputWeight, setOutputWeight] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    const list = await getBatches();
    setBatches(list);
    if (list.length > 0 && !selectedBatch) {
      const processingBatch = list.find(b => b.status === 'RECEIVED_FOR_PROCESSING' || b.status === 'PROCESSING' || b.status === 'HARVESTED') || list[0];
      setSelectedBatch(processingBatch);
      setOutputWeight(String(processingBatch.quantity));
    }
  };

  const handleIntake = async (batchId: string) => {
    await recordBatchIntake(batchId);
    await loadBatches();
  };

  const handleRecordProcessing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;
    setIsProcessing(true);

    await recordBatchProcessing(selectedBatch.id, {
      eventType,
      temperatureCelsius: parseFloat(tempC),
      moisturePercent: parseFloat(moisture),
      outputWeightKg: parseFloat(outputWeight || String(selectedBatch.quantity))
    });

    setIsProcessing(false);
    await loadBatches();
  };

  const handleReadyForTransport = async (batchId: string) => {
    await markBatchReadyTransport(batchId);
    await loadBatches();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#EAE3D9]">
        <div className="flex items-center space-x-2">
          <span className="text-xl">⚙️</span>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Processing Facility Portal</h1>
        </div>
        <p className="text-xs text-stone-600 mt-1">
          Nilgiri Pure Extraction Ltd • Raw honey intake, thermal moisture reduction (&le;45°C), filtration, and custody transfer.
        </p>
      </div>

      {/* Main Grid: Batches Queue + Active Batch Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batches Queue */}
        <div className="bg-white border border-[#EAE3D9] rounded-xl p-4 space-y-3">
          <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
            Facility Batches Queue ({batches.length})
          </h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {batches.map(batch => {
              const isSelected = selectedBatch?.id === batch.id;
              return (
                <div
                  key={batch.id}
                  onClick={() => {
                    setSelectedBatch(batch);
                    setOutputWeight(String(batch.quantity));
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
                    <span>{batch.floralSource || 'Honey'}</span>
                    <span className="font-mono font-semibold">{batch.quantity} kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Processing Actions Container */}
        <div className="lg:col-span-2 space-y-5">
          {selectedBatch ? (
            <div className="bg-white border border-[#EAE3D9] rounded-xl p-6 space-y-6">
              {/* Batch Overview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE3D9]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-lg text-amber-800">{selectedBatch.id}</span>
                    <StatusBadge status={selectedBatch.status} type="batch" />
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{selectedBatch.origin}</p>
                </div>

                {selectedBatch.status === 'HARVESTED' && (
                  <button
                    onClick={() => handleIntake(selectedBatch.id)}
                    className="inline-flex items-center px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Accept Intake & Log Receipt
                  </button>
                )}

                {(selectedBatch.status === 'PROCESSING' || selectedBatch.status === 'RECEIVED_FOR_PROCESSING') && (
                  <button
                    onClick={() => handleReadyForTransport(selectedBatch.id)}
                    className="inline-flex items-center px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    <ArrowRight className="w-4 h-4 mr-1.5" /> Mark Ready for Transport
                  </button>
                )}
              </div>

              {/* Step Form: Log Processing Run */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-stone-800 flex items-center">
                  <Settings className="w-4 h-4 mr-1.5 text-amber-700" /> Log Controlled Processing Event
                </h3>

                <form onSubmit={handleRecordProcessing} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Process Type</label>
                    <select
                      value={eventType}
                      onChange={e => setEventType(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-medium"
                    >
                      <option value="MOISTURE_EXTRACTION">Moisture Dehumidification (&le;40°C)</option>
                      <option value="MICRO_FILTRATION">Micro-Filtration (Pollen Retaining 80µm)</option>
                      <option value="THERMAL_STABILIZATION">Gentle Thermal Stabilization (38°C)</option>
                      <option value="SETTLING_DE_AERATION">Settling & Micro-Bubble Removal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1 flex items-center">
                      <Thermometer className="w-3.5 h-3.5 mr-1 text-amber-600" /> Target Heating Temperature (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      max="45"
                      required
                      value={tempC}
                      onChange={e => setTempC(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-mono"
                    />
                    <span className="text-[10px] text-stone-500 italic mt-0.5 block">Max 45°C to preserve bioactive diastase enzymes</span>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1 flex items-center">
                      <Droplets className="w-3.5 h-3.5 mr-1 text-sky-600" /> Target Moisture Content (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      max="20"
                      required
                      value={moisture}
                      onChange={e => setMoisture(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-mono"
                    />
                    <span className="text-[10px] text-stone-500 italic mt-0.5 block">FSSAI / Codex Alimentarius standard &le; 20.0%</span>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Processed Output Volume (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={outputWeight}
                      onChange={e => setOutputWeight(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-semibold rounded-lg shadow-sm transition-colors text-xs flex items-center justify-center"
                    >
                      <Filter className="w-3.5 h-3.5 mr-1.5" />
                      {isProcessing ? 'Recording Event on Blockchain...' : 'Commit Processing Event to Provenance Ledger'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Processing Events Table */}
              <div className="space-y-2 pt-2 border-t border-[#EAE3D9]">
                <h4 className="text-xs font-mono font-bold text-stone-600 uppercase">Recorded Processing Steps</h4>
                {selectedBatch.processingEvents && selectedBatch.processingEvents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedBatch.processingEvents.map((pe, idx) => (
                      <div key={pe.id || idx} className="p-3 bg-[#FAF8F5] border border-[#EAE3D9] rounded-lg text-xs flex items-center justify-between">
                        <div>
                          <p className="font-bold text-stone-800">{pe.eventType}</p>
                          <p className="text-[11px] text-stone-500">{pe.processorName || 'Nilgiri Processing'}</p>
                        </div>
                        <div className="text-right font-mono text-[11px] text-stone-600">
                          {pe.temperatureCelsius && <span>{pe.temperatureCelsius}°C • </span>}
                          {pe.moisturePercent && <span>{pe.moisturePercent}% Moisture • </span>}
                          <span>{new Date(pe.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic">No processing steps logged yet for this batch.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#EAE3D9] rounded-xl p-8 text-center text-stone-500 text-xs">
              Select a batch from the queue to manage processing events.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
