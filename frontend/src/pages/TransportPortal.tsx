import React, { useEffect, useState } from 'react';
import { Batch, Handoff, EvidenceRecord } from '../types';
import { 
  getBatches, 
  recordBatchTransport, 
  confirmBatchTransportReceipt, 
  getPendingHandoffs, 
  acceptCustodyHandoff, 
  rejectCustodyHandoff,
  uploadEvidenceFile,
  getBatchEvidence,
  initiateCustodyHandoff,
  getAuthUsers
} from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { Truck, CheckCircle2, Navigation, Thermometer, ShieldCheck, MapPin, UploadCloud, FileCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TransportPortal: React.FC<{ onNavigateToBatch?: (id: string) => void }> = ({ onNavigateToBatch }) => {
  const { currentUser } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [pendingHandoffs, setPendingHandoffs] = useState<Handoff[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);

  // Dispatch form state
  const [source, setSource] = useState('NectarPure Processing Facilities, Haridwar');
  const [destination, setDestination] = useState('EcoPack Honey Packaging Plant, Noida');
  const [vehicleNumber, setVehicleNumber] = useState('DL-01-AX-9922');
  const [transitTemp, setTransitTemp] = useState('22.5');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Evidence upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadBatches();
    loadHandoffs();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      getBatchEvidence(selectedBatch.id).then(setEvidenceList);
    }
  }, [selectedBatch]);

  const loadBatches = async () => {
    const list = await getBatches();
    setBatches(list);
    if (list.length > 0 && !selectedBatch) {
      const active = list.find(b => b.status === 'IN_TRANSIT' || b.status === 'READY_FOR_TRANSPORT') || list[0];
      setSelectedBatch(active);
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
    const reason = window.prompt('Specify dispute reason for rejecting custody handoff:');
    if (reason) {
      await rejectCustodyHandoff(handoffId, reason);
      await loadHandoffs();
      await loadBatches();
    }
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;
    setIsSubmitting(true);

    await recordBatchTransport(selectedBatch.id, {
      source,
      destination,
      vehicleNumber,
      transitTemperatureCelsius: parseFloat(transitTemp),
      conditionStatus: 'OPTIMAL'
    });

    setIsSubmitting(false);
    await loadBatches();
  };

  const handleConfirmDelivery = async (batchId: string) => {
    await confirmBatchTransportReceipt(batchId);

    // Initiate custody handoff to Packager
    const users = await getAuthUsers();
    const packager = users.find(u => u.role === 'PACKAGER');
    if (packager && currentUser && selectedBatch) {
      await initiateCustodyHandoff({
        batchId,
        receiverId: packager.id,
        fromStage: 'TRANSPORT',
        toStage: 'PACKAGING',
        quantity: selectedBatch.quantity,
        unit: 'kg'
      });
    }

    await loadBatches();
    await loadHandoffs();
  };

  const handleUploadWaybill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch || !uploadFile) return;
    setIsUploading(true);

    const record = await uploadEvidenceFile(
      selectedBatch.id,
      'TRANSPORT_WAYBILL',
      uploadFile,
      { vehicleNumber, source, destination, transitTemp }
    );

    setIsUploading(false);
    setUploadFile(null);
    if (record) {
      const updated = await getBatchEvidence(selectedBatch.id);
      setEvidenceList(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#EAE3D9]">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🚚</span>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Logistics & Cold-Chain Workspace</h1>
        </div>
        <p className="text-xs text-stone-600 mt-1">
          ColdRoute Agro Logistics • Temperature-controlled honey transit, waypoint logging, waybill SHA-256 evidence, and custody handoffs.
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipments List */}
        <div className="bg-white border border-[#EAE3D9] rounded-xl p-4 space-y-3">
          <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
            Shipment Batches ({batches.length})
          </h2>
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {batches.map(batch => {
              const isSelected = selectedBatch?.id === batch.id;
              return (
                <div
                  key={batch.id}
                  onClick={() => setSelectedBatch(batch)}
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
                    <span>Custodian: {batch.currentCustodian || 'Logistics'}</span>
                    <span className="font-mono font-semibold">{batch.quantity} kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Transport Management Panel */}
        <div className="lg:col-span-2 space-y-5">
          {selectedBatch ? (
            <div className="bg-white border border-[#EAE3D9] rounded-xl p-6 space-y-6">
              {/* Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE3D9]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-lg text-amber-800">{selectedBatch.id}</span>
                    <StatusBadge status={selectedBatch.status} type="batch" />
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">Origin: {selectedBatch.origin}</p>
                </div>

                {selectedBatch.status === 'IN_TRANSIT' && (
                  <button
                    onClick={() => handleConfirmDelivery(selectedBatch.id)}
                    className="inline-flex items-center px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Confirm Delivery & Handoff to Packager
                  </button>
                )}
              </div>

              {/* Dispatch Form if Ready */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-stone-800 flex items-center">
                  <Truck className="w-4 h-4 mr-1.5 text-amber-700" /> Log Cold-Chain Transit & Dispatch
                </h3>

                <form onSubmit={handleDispatch} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Pickup Location (Source)</label>
                    <input
                      type="text"
                      required
                      value={source}
                      onChange={e => setSource(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Destination Facility</label>
                    <input
                      type="text"
                      required
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Refrigerated Vehicle / Fleet ID</label>
                    <input
                      type="text"
                      required
                      value={vehicleNumber}
                      onChange={e => setVehicleNumber(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1 flex items-center">
                      <Thermometer className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Vehicle Cargo Temperature (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={transitTemp}
                      onChange={e => setTransitTemp(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg shadow-sm text-xs flex items-center justify-center transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 mr-1.5" />
                      {isSubmitting ? 'Signing Dispatch on Ledger...' : 'Dispatch Shipment & Commit Custody Transfer'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Waybill Evidence Upload */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-stone-800 flex items-center">
                  <UploadCloud className="w-4 h-4 mr-1.5 text-amber-700" /> Upload Signed Transport Waybill (SHA-256)
                </h4>
                <form onSubmit={handleUploadWaybill} className="flex gap-2 text-xs">
                  <input
                    type="file"
                    required
                    onChange={e => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"
                  />
                  <button
                    type="submit"
                    disabled={isUploading || !uploadFile}
                    className="px-3.5 py-1.5 bg-amber-700 text-white font-semibold rounded-lg text-xs hover:bg-amber-800 shrink-0"
                  >
                    {isUploading ? 'Hashing...' : 'Upload & Hash'}
                  </button>
                </form>

                {evidenceList.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-stone-200">
                    {evidenceList.map(e => (
                      <div key={e.id} className="p-2 bg-white rounded border border-stone-200 flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-semibold text-stone-800">{e.fileName}</span>
                        </div>
                        <span className="font-mono text-[10px] text-stone-500">SHA-256: {e.sha256Hash?.substring(0, 16)}...</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Transit History */}
              <div className="space-y-2 pt-2 border-t border-[#EAE3D9]">
                <h4 className="text-xs font-mono font-bold text-stone-600 uppercase">Recorded Transit Waypoints</h4>
                {selectedBatch.transportEvents && selectedBatch.transportEvents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedBatch.transportEvents.map((te, idx) => (
                      <div key={te.id || idx} className="p-3.5 bg-[#FAF8F5] border border-[#EAE3D9] rounded-lg text-xs flex items-center justify-between">
                        <div>
                          <p className="font-bold text-stone-800 flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-amber-700" />
                            {te.source} → {te.destination}
                          </p>
                          <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                            Vehicle: {te.vehicleNumber || 'Refrigerated Fleet'} • Temp: {te.transitTemperatureCelsius || 22}°C
                          </p>
                        </div>
                        <div className="text-right text-[11px] font-mono text-stone-600">
                          {new Date(te.timestamp).toLocaleDateString()} {new Date(te.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic">No transport events logged yet for this batch.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#EAE3D9] rounded-xl p-8 text-center text-stone-500 text-xs">
              Select a batch from the queue to view and log cold-chain transit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
