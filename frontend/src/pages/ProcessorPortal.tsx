import React, { useEffect, useState } from 'react';
import { Batch, Handoff, EvidenceRecord } from '../types';
import { 
  getBatches, 
  recordBatchIntake, 
  recordBatchProcessing, 
  markBatchReadyTransport, 
  getPendingHandoffs, 
  acceptCustodyHandoff, 
  rejectCustodyHandoff,
  uploadEvidenceFile,
  getBatchEvidence,
  initiateCustodyHandoff,
  getAuthUsers
} from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { Settings, CheckCircle2, Thermometer, Droplets, Filter, ArrowRight, UploadCloud, FileCheck, XCircle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProcessorPortal: React.FC<{ onNavigateToBatch?: (id: string) => void }> = ({ onNavigateToBatch }) => {
  const { currentUser } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [pendingHandoffs, setPendingHandoffs] = useState<Handoff[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);

  // Processing form state
  const [eventType, setEventType] = useState('MOISTURE_EXTRACTION');
  const [tempC, setTempC] = useState('38.5');
  const [moisture, setMoisture] = useState('17.8');
  const [outputWeight, setOutputWeight] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [quantityAnomaly, setQuantityAnomaly] = useState<any | null>(null);

  // File upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState('TEMPERATURE_LOG');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadBatches();
    loadHandoffs();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      getBatchEvidence(selectedBatch.id).then(setEvidenceList);
      setQuantityAnomaly(null);
    }
  }, [selectedBatch]);

  const loadBatches = async () => {
    const list = await getBatches();
    setBatches(list);
    if (list.length > 0 && !selectedBatch) {
      const processingBatch = list.find(b => b.status === 'RECEIVED_FOR_PROCESSING' || b.status === 'PROCESSING' || b.status === 'HARVESTED') || list[0];
      setSelectedBatch(processingBatch);
      setOutputWeight(String(processingBatch.quantity));
    }
  };

  const loadHandoffs = async () => {
    const handoffs = await getPendingHandoffs();
    setPendingHandoffs(handoffs);
  };

  const handleAcceptHandoff = async (handoffId: string) => {
    await acceptCustodyHandoff(handoffId);
    await loadHandoffs();
    await loadBatches();
  };

  const handleRejectHandoff = async (handoffId: string) => {
    const reason = window.prompt('Please specify dispute reason for rejecting custody handoff:');
    if (reason) {
      await rejectCustodyHandoff(handoffId, reason);
      await loadHandoffs();
      await loadBatches();
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
    setQuantityAnomaly(null);

    const outQty = parseFloat(outputWeight || String(selectedBatch.quantity));
    const previousQty = selectedBatch.harvest?.quantity || selectedBatch.quantity;

    // Check if client-side or server flags volume inflation
    const res = await recordBatchProcessing(selectedBatch.id, {
      eventType,
      temperatureCelsius: parseFloat(tempC),
      moisturePercent: parseFloat(moisture),
      outputWeightKg: outQty
    });

    if (res && res.inconsistency) {
      setQuantityAnomaly(res.inconsistency);
    } else if (outQty > previousQty) {
      const diff = parseFloat((outQty - previousQty).toFixed(2));
      setQuantityAnomaly({
        code: 'QUANTITY_INCONSISTENCY',
        severity: 'HIGH',
        message: `Processing quantity (${outQty} kg) exceeds recorded harvest/batch quantity (${previousQty} kg).`,
        expected: previousQty,
        actual: outQty,
        difference: diff,
        unit: 'kg'
      });
    }

    setIsProcessing(false);
    await loadBatches();
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch || !uploadFile) return;
    setIsUploading(true);

    const record = await uploadEvidenceFile(
      selectedBatch.id,
      fileType,
      uploadFile,
      { temperatureCelsius: parseFloat(tempC), moisturePercent: parseFloat(moisture) }
    );

    setIsUploading(false);
    setUploadFile(null);
    if (record) {
      const updated = await getBatchEvidence(selectedBatch.id);
      setEvidenceList(updated);
    }
  };

  const handleReadyForTransport = async (batchId: string) => {
    await markBatchReadyTransport(batchId);

    // Initiate custody handoff to Transporter
    const users = await getAuthUsers();
    const transporter = users.find(u => u.role === 'TRANSPORTER');
    if (transporter && currentUser && selectedBatch) {
      await initiateCustodyHandoff({
        batchId,
        receiverId: transporter.id,
        fromStage: 'PROCESSING',
        toStage: 'TRANSPORT',
        quantity: parseFloat(outputWeight || String(selectedBatch.quantity)),
        unit: 'kg'
      });
    }

    await loadBatches();
    await loadHandoffs();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#EAE3D9]">
        <div className="flex items-center space-x-2">
          <span className="text-xl">⚙️</span>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Processing Facility Workspace</h1>
        </div>
        <p className="text-xs text-stone-600 mt-1">
          NectarPure Processing Facilities • Raw honey intake, thermal moisture reduction (&le;45°C), filtration, off-chain evidence hashing, and custody handoffs.
        </p>
      </div>

      {/* Pending Custody Transfers Banner */}
      {pendingHandoffs.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center font-mono">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-700" /> Pending Inbound Custody Transfers ({pendingHandoffs.length})
            </span>
            <span className="text-[11px] text-amber-800">State Machine Action Required</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingHandoffs.map(h => (
              <div key={h.id} className="p-3 bg-white border border-amber-200 rounded-lg text-xs flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-amber-900">{h.batchId}</span>
                  <span className="text-stone-500 block text-[11px]">
                    From: {h.fromStage} &rarr; To: {h.toStage} • {h.quantity} {h.unit || 'kg'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRejectHandoff(h.id)}
                    className="px-2.5 py-1 text-rose-700 border border-rose-200 rounded hover:bg-rose-50 font-medium text-[11px]"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAcceptHandoff(h.id)}
                    className="px-3 py-1 bg-emerald-700 text-white rounded hover:bg-emerald-800 font-semibold text-[11px]"
                  >
                    Accept Custody
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                    <ArrowRight className="w-4 h-4 mr-1.5" /> Mark Ready & Dispatch to Transporter
                  </button>
                )}
              </div>

              {/* Anomaly / Quantity Inconsistency Banner */}
              {(quantityAnomaly || selectedBatch.status === 'SUSPICIOUS') && (
                <div className="p-4 rounded-xl bg-rose-50/90 border border-rose-300 text-rose-900 text-xs space-y-2 shadow-xs">
                  <div className="flex items-start space-x-2.5">
                    <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs bg-rose-200 text-rose-800 px-2 py-0.5 rounded">
                          QUANTITY_INCONSISTENCY
                        </span>
                        <span className="font-mono text-[10px] text-rose-600 uppercase font-bold">
                          Severity: HIGH
                        </span>
                      </div>
                      <p className="font-semibold text-rose-950 text-xs">
                        {quantityAnomaly?.message || `Processing volume inflation flagged for batch ${selectedBatch.id}.`}
                      </p>
                      <p className="text-[11px] text-rose-800/90">
                        {quantityAnomaly ? (
                          <>Expected: <span className="font-mono font-bold">{quantityAnomaly.expected} {quantityAnomaly.unit}</span> | Actual Observed: <span className="font-mono font-bold">{quantityAnomaly.actual} {quantityAnomaly.unit}</span> | Discrepancy: <span className="font-mono font-bold">+{quantityAnomaly.difference} {quantityAnomaly.unit}</span></>
                        ) : (
                          <>Observed quantity exceeds recorded harvest volume. Batch flagged as SUSPICIOUS on ledger.</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                      <Thermometer className="w-3.5 h-3.5 mr-1 text-amber-600" /> Heating Temperature (°C)
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
                      <Droplets className="w-3.5 h-3.5 mr-1 text-sky-600" /> Moisture Content (%)
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

              {/* Off-Chain Evidence Upload (SHA-256) */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-stone-800 flex items-center">
                  <UploadCloud className="w-4 h-4 mr-1.5 text-amber-700" /> Upload Processing Evidence & Generate SHA-256
                </h4>
                <form onSubmit={handleUploadEvidence} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Evidence Category</label>
                    <select
                      value={fileType}
                      onChange={e => setFileType(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#EAE3D9] bg-white text-stone-800"
                    >
                      <option value="TEMPERATURE_LOG">Thermal Datalogger Log</option>
                      <option value="LAB_REPORT">Internal Moisture Assay</option>
                      <option value="SEAL_IMAGE">Batch Vat Seal Photo</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-600 font-medium mb-1">Select Document / Calibration File</label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        required
                        onChange={e => setUploadFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"
                      />
                      <button
                        type="submit"
                        disabled={isUploading || !uploadFile}
                        className="px-3 py-1.5 bg-amber-700 text-white font-semibold rounded-lg text-xs hover:bg-amber-800 shrink-0"
                      >
                        {isUploading ? 'Hashing...' : 'Upload & Hash'}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Evidence list */}
                {evidenceList.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-stone-200">
                    <span className="text-[10px] font-mono text-stone-500 uppercase">Cryptographic Evidence Records</span>
                    {evidenceList.map(e => (
                      <div key={e.id} className="p-2 bg-white rounded border border-stone-200 flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-semibold text-stone-800">{e.fileName}</span>
                          <span className="text-stone-400 font-mono">({e.fileType})</span>
                        </div>
                        <span className="font-mono text-[10px] text-stone-500">SHA-256: {e.sha256Hash?.substring(0, 16)}...</span>
                      </div>
                    ))}
                  </div>
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
