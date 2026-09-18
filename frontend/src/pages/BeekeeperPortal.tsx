import React, { useEffect, useState } from 'react';
import { Hive, Batch, TelemetryRecord, AiAnomaly, AiHealth, ProvenanceModel } from '../types';
import { 
  getHives, 
  getBatches, 
  createBatch, 
  getHiveTelemetry, 
  getHiveHealth, 
  getHiveAnomalies, 
  recordLocationPoint, 
  initiateCustodyHandoff, 
  getAuthUsers 
} from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { TelemetryChart } from '../components/TelemetryChart';
import { PlusCircle, AlertTriangle, MapPin, Navigation, CheckCircle2, ArrowRight, User, Building2, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/I18nContext';

export const BeekeeperPortal: React.FC<{ 
  onNavigateToBatch?: (id: string) => void;
  onOpenPassport?: (id: string) => void;
}> = ({ onNavigateToBatch, onOpenPassport }) => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [hives, setHives] = useState<Hive[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedHiveId, setSelectedHiveId] = useState<string>('HIVE-001');
  const [telemetry, setTelemetry] = useState<TelemetryRecord[]>([]);
  const [health, setHealth] = useState<AiHealth | null>(null);
  const [anomalies, setAnomalies] = useState<AiAnomaly | null>(null);

  // Harvest modal state
  const [showModal, setShowModal] = useState(false);
  const [harvestHiveId, setHarvestHiveId] = useState('HIVE-001');
  const [quantity, setQuantity] = useState('24.5');
  const [floralSource, setFloralSource] = useState('Mustard Blossom');
  const [notes, setNotes] = useState('First seasonal harvest, clear amber honey');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Provenance Architecture (configured at Login/Organization level)
  const activeProvenanceModel: ProvenanceModel = typeof window !== 'undefined' 
    ? ((localStorage.getItem('honeychain_active_provenance_model') as ProvenanceModel) || 'DIRECT_BEEKEEPER')
    : 'DIRECT_BEEKEEPER';

  // GPS State
  const [gpsLat, setGpsLat] = useState<number>(30.0668);
  const [gpsLng, setGpsLng] = useState<number>(79.0193);
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(5.0);
  const [gpsStatus, setGpsStatus] = useState<string>('Ready for capture');
  const [isCapturingGps, setIsCapturingGps] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedHiveId) {
      getHiveTelemetry(selectedHiveId).then(setTelemetry);
      getHiveHealth(selectedHiveId).then(setHealth);
      getHiveAnomalies(selectedHiveId).then(setAnomalies);
    }
  }, [selectedHiveId]);

  const loadData = async () => {
    const [hList, bList] = await Promise.all([getHives(), getBatches()]);
    setHives(hList);
    setBatches(bList);
  };

  const captureBrowserGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation not supported by browser. Using apiary fallback.');
      return;
    }
    setIsCapturingGps(true);
    setGpsStatus('Requesting high-accuracy GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLat(pos.coords.latitude);
        setGpsLng(pos.coords.longitude);
        setGpsAccuracy(pos.coords.accuracy);
        setGpsStatus(`GPS Captured: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)} (±${pos.coords.accuracy.toFixed(1)}m)`);
        setIsCapturingGps(false);
      },
      (err) => {
        setGpsStatus(`GPS capture failed (${err.message}). Defaulted to apiary coordinates.`);
        setIsCapturingGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleCreateHarvestBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const selectedHive = hives.find(h => h.id === harvestHiveId);
    const originStr = selectedHive ? `${selectedHive.location.address || selectedHive.id} (${selectedHive.id})` : harvestHiveId;

    const newBatch = await createBatch({
      quantity: parseFloat(quantity),
      origin: originStr,
      floralSource,
      hiveId: harvestHiveId,
      provenanceModel: activeProvenanceModel
    });

    if (newBatch) {
      // Record GPS location point
      await recordLocationPoint({
        batchId: newBatch.id,
        stage: 'HARVEST',
        latitude: gpsLat,
        longitude: gpsLng,
        accuracy: gpsAccuracy,
        address: originStr,
        isMocked: false
      });

      // If COMPANY_MANAGED, initiate custody handoff to a processor
      if (activeProvenanceModel === 'COMPANY_MANAGED') {
        const users = await getAuthUsers();
        const processor = users.find(u => u.role === 'PROCESSOR');
        if (processor && currentUser) {
          await initiateCustodyHandoff({
            batchId: newBatch.id,
            receiverId: processor.id,
            fromStage: 'HARVEST',
            toStage: 'PROCESSING',
            quantity: parseFloat(quantity),
            unit: 'kg',
            location: { lat: gpsLat, lng: gpsLng, address: originStr }
          });
        }
      }

      await loadData();
      setIsSubmitting(false);
      setShowModal(false);
      if (onNavigateToBatch) onNavigateToBatch(newBatch.id);
    } else {
      setIsSubmitting(false);
    }
  };

  const selectedHive = hives.find(h => h.id === selectedHiveId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE3D9]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">🐝</span>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Beekeeper Workspace</h1>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Himalayan Pure Apiaries • Monitor colony thermodynamics, AI alerts, and log new honey harvests with GPS coordinates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center text-xs font-mono font-semibold px-3 py-1 rounded-full border ${
            activeProvenanceModel === 'DIRECT_BEEKEEPER' ? 'bg-blue-50 text-blue-900 border-blue-200' : 'bg-purple-50 text-purple-900 border-purple-200'
          }`}>
            {activeProvenanceModel === 'DIRECT_BEEKEEPER' ? <User className="w-3.5 h-3.5 mr-1" /> : <Building2 className="w-3.5 h-3.5 mr-1" />}
            {activeProvenanceModel === 'DIRECT_BEEKEEPER' ? t('modelDirectBeekeeper') : t('modelCompanyManaged')}
          </span>

          <button
            onClick={() => {
              captureBrowserGps();
              setShowModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-[#3D5A3A] hover:bg-[#2E4A2E] text-white text-xs font-semibold rounded-full shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" /> Record Harvest & Create Batch
          </button>
        </div>
      </div>

      {/* Grid: Hive Selector + Active Hive Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Apiary Hive List */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 space-y-3">
          <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
            Managed Apiary Hives ({hives.length})
          </h2>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {hives.map(hive => {
              const isSelected = hive.id === selectedHiveId;
              return (
                <div
                  key={hive.id}
                  onClick={() => setSelectedHiveId(hive.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-forest-50/80 border-[#3D5A3A] shadow-xs'
                      : 'bg-[#FFFDF9] border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-stone-900">{hive.id}</span>
                    <StatusBadge status={hive.status} type="hive" />
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-stone-400" />
                    {hive.location.address || 'Apiary Zone'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Hive Telemetry & AI Status */}
        <div className="lg:col-span-2 space-y-4">
          {selectedHive && (
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200/80">
                <div>
                  <h3 className="font-bold text-stone-900 text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>{selectedHive.id} Telemetry Monitor</h3>
                  <p className="text-xs text-stone-500 font-mono">{selectedHive.location.address}</p>
                </div>
                {health && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-stone-500 font-mono">Colony Health:</span>
                    <span className={`text-xs font-semibold font-mono px-2.5 py-0.5 rounded-full ${
                      health.health === 'NORMAL' ? 'bg-forest-100 text-[#3D5A3A]' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {health.healthScore}/100 ({health.health})
                    </span>
                  </div>
                )}
              </div>

              {/* Anomaly Callout if flagged */}
              {anomalies?.anomaly && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-1">
                  <p className="font-bold flex items-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    <AlertTriangle className="w-4 h-4 mr-1.5 text-rose-700" /> AI Anomaly Detected ({anomalies.severity})
                  </p>
                  <ul className="list-disc list-inside text-stone-700 text-[11px] pl-1">
                    {anomalies.reasons.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Charts */}
              <div className="space-y-2">
                <p className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">Live Sensor Stream (Last 10 Hours)</p>
                <TelemetryChart data={telemetry} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Harvest Batches Created by Beekeeper */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-stone-900 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Apiary Harvest Batches & Provenance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F5] text-stone-600 font-mono border-y border-stone-200/80">
              <tr>
                <th className="py-2.5 px-3">Batch ID</th>
                <th className="py-2.5 px-3">Model</th>
                <th className="py-2.5 px-3">Origin / Hive</th>
                <th className="py-2.5 px-3">Floral Source</th>
                <th className="py-2.5 px-3">Volume (kg)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D9]">
              {batches.map(batch => {
                const isDirect = batch.provenanceModel === 'DIRECT_BEEKEEPER';
                return (
                  <tr key={batch.id} className="hover:bg-stone-50/70">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-800">{batch.id}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        isDirect ? 'bg-forest-50 text-[#3D5A3A] border-forest-200' : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}>
                        {isDirect ? <User className="w-3 h-3 mr-1 text-[#3D5A3A]" /> : <Building2 className="w-3 h-3 mr-1 text-stone-600" />}
                        {isDirect ? 'Direct' : 'Company'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-700 truncate max-w-[160px]">{batch.origin}</td>
                    <td className="py-2.5 px-3 text-stone-600">{batch.floralSource || 'Multifloral'}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-stone-900">{batch.quantity} kg</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={batch.status} type="batch" />
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-2">
                      {onOpenPassport && (
                        <button
                          onClick={() => onOpenPassport(batch.id)}
                          className="text-[#3D5A3A] hover:text-[#2E4A2E] font-semibold hover:underline inline-flex items-center text-xs"
                          title="View Consumer Honey Passport"
                        >
                          <QrCode className="w-3 h-3 mr-1" /> Passport
                        </button>
                      )}
                      {onNavigateToBatch && (
                        <button
                          onClick={() => onNavigateToBatch(batch.id)}
                          className="text-[#3D5A3A] hover:text-[#2E4A2E] font-semibold hover:underline inline-flex items-center text-xs"
                        >
                          Inspect <ArrowRight className="w-3 h-3 ml-0.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Harvest Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200/90 rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
              <div>
                <h3 className="text-base font-bold text-stone-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Record Honey Harvest Batch</h3>
                <p className="text-xs text-stone-500">
                  Mode: <strong className="font-mono text-stone-800">{activeProvenanceModel}</strong>
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleCreateHarvestBatch} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Source Hive</label>
                  <select
                    value={harvestHiveId}
                    onChange={e => setHarvestHiveId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FFFDF9] text-stone-800 focus:outline-hidden focus:border-[#3D5A3A]"
                  >
                    {hives.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.id} — {h.location.address || 'Apiary'} ({h.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Harvest Volume (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FFFDF9] text-stone-800 font-mono focus:outline-hidden focus:border-[#3D5A3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Primary Floral Source</label>
                <input
                  type="text"
                  required
                  value={floralSource}
                  onChange={e => setFloralSource(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FFFDF9] text-stone-800 focus:outline-hidden focus:border-[#3D5A3A]"
                  placeholder="e.g. Mustard Blossom, Litchi, Acacia, Wildflower"
                />
              </div>

              {/* Browser GPS Capture Block */}
              <div className="p-3.5 bg-[#F5F0E8]/60 border border-stone-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800 flex items-center">
                    <Navigation className="w-3.5 h-3.5 mr-1 text-[#3D5A3A]" /> GPS Geolocation Point
                  </span>
                  <button
                    type="button"
                    onClick={captureBrowserGps}
                    disabled={isCapturingGps}
                    className="text-xs font-semibold text-[#3D5A3A] hover:text-[#2E4A2E] underline"
                  >
                    {isCapturingGps ? 'Capturing...' : 'Re-capture GPS'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div>
                    <span className="text-stone-500">Lat:</span> {gpsLat.toFixed(5)}
                  </div>
                  <div>
                    <span className="text-stone-500">Lng:</span> {gpsLng.toFixed(5)}
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#3D5A3A]" />
                  {gpsStatus}
                </p>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Field Notes / Extraction Details</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FFFDF9] text-stone-800 focus:outline-hidden focus:border-[#3D5A3A]"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-stone-200/80">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-1.5 bg-[#3D5A3A] hover:bg-[#2E4A2E] text-white font-semibold rounded-full shadow-xs cursor-pointer"
                >
                  {isSubmitting ? 'Recording on Fabric & Anchoring...' : 'Sign, Anchor on Fabric & Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
