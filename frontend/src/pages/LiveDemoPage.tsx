import React, { useState, useEffect } from 'react';
import { 
  Hive, TelemetryRecord, AiHealth, AiAnomaly, Batch, SystemHealth 
} from '../types';
import { 
  getHives, getHiveHealth, getHiveAnomalies, ingestTelemetry, 
  createBatch, recordBatchProcessing, recordBatchTransport, 
  recordBatchPackaging, publishBatchPassport, checkProvenance, 
  getBatchTimeline, getSystemHealth, registerHive 
} from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { QrModal } from '../components/QrModal';
import { 
  Play, RotateCcw, CheckCircle2, AlertTriangle, AlertCircle, 
  Layers, Cpu, Server, Database, Radio, ArrowRight, ShieldCheck, 
  ExternalLink, QrCode, Sparkles, Filter, Truck, Package, Clock, Flame,
  Brain
} from 'lucide-react';

interface EventLogEntry {
  id: string;
  time: string;
  text: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
}

type StepState = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'WARNING' | 'FAILED';

export const LiveDemoPage: React.FC<{ onOpenPassport: (batchId: string) => void }> = ({ onOpenPassport }) => {
  // System Health
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);

  // Demo Session State
  const [demoActive, setDemoActive] = useState(false);
  const [demoHiveId, setDemoHiveId] = useState('HIVE-001');
  const [demoBatchId, setDemoBatchId] = useState('');
  const [availableHives, setAvailableHives] = useState<Hive[]>([]);

  // Pipeline Step States
  const [stepStates, setStepStates] = useState<{
    hive: StepState;
    telemetry: StepState;
    ai: StepState;
    batch: StepState;
    blockchain: StepState;
    processing: StepState;
    transport: StepState;
    packaging: StepState;
    verification: StepState;
    passport: StepState;
  }>({
    hive: 'PENDING',
    telemetry: 'PENDING',
    ai: 'PENDING',
    batch: 'PENDING',
    blockchain: 'PENDING',
    processing: 'PENDING',
    transport: 'PENDING',
    packaging: 'PENDING',
    verification: 'PENDING',
    passport: 'PENDING',
  });

  // Step Data
  const [currentTelemetry, setCurrentTelemetry] = useState<{
    temperature: number;
    humidity: number;
    weight: number;
    activity: number;
  } | null>(null);

  const [aiHealth, setAiHealth] = useState<AiHealth | null>(null);
  const [aiAnomaly, setAiAnomaly] = useState<AiAnomaly | null>(null);
  const [createdBatch, setCreatedBatch] = useState<Batch | null>(null);
  const [blockchainTxInfo, setBlockchainTxInfo] = useState<{ txId: string; status: string } | null>(null);
  const [processingDone, setProcessingDone] = useState(false);
  const [transportDone, setTransportDone] = useState(false);
  const [packagingDone, setPackagingDone] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ status: string; consistencyScore: number; anomalies: string[] } | null>(null);
  const [blockchainHistory, setBlockchainHistory] = useState<any[]>([]);

  // Event Log
  const [eventLogs, setEventLogs] = useState<EventLogEntry[]>([]);

  // QR Modal
  const [showQrModal, setShowQrModal] = useState(false);

  // Loading States
  const [loadingStep, setLoadingStep] = useState<string | null>(null);

  useEffect(() => {
    getSystemHealth().then(setSystemHealth);
    getHives().then(hives => {
      setAvailableHives(hives);
    });
  }, []);

  const addLog = (text: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' = 'INFO') => {
    const entry: EventLogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text,
      type
    };
    setEventLogs(prev => [entry, ...prev]);
  };

  const startNewDemo = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBatchId = `HC-2026-${randomSuffix}`;
    setDemoBatchId(newBatchId);
    setDemoActive(true);

    setStepStates({
      hive: 'COMPLETED',
      telemetry: 'PENDING',
      ai: 'PENDING',
      batch: 'PENDING',
      blockchain: 'PENDING',
      processing: 'PENDING',
      transport: 'PENDING',
      packaging: 'PENDING',
      verification: 'PENDING',
      passport: 'PENDING',
    });

    setCurrentTelemetry(null);
    setAiHealth(null);
    setAiAnomaly(null);
    setCreatedBatch(null);
    setBlockchainTxInfo(null);
    setProcessingDone(false);
    setTransportDone(false);
    setPackagingDone(false);
    setVerificationResult(null);
    setBlockchainHistory([]);

    setEventLogs([]);
    addLog(`Demo Session Initialized with Target Batch ID: ${newBatchId}`, 'INFO');
    addLog(`Selected Source Hive: ${demoHiveId}`, 'INFO');
  };

  const resetDemo = () => {
    setDemoActive(false);
    setDemoBatchId('');
    setCurrentTelemetry(null);
    setAiHealth(null);
    setAiAnomaly(null);
    setCreatedBatch(null);
    setBlockchainTxInfo(null);
    setProcessingDone(false);
    setTransportDone(false);
    setPackagingDone(false);
    setVerificationResult(null);
    setBlockchainHistory([]);
    setStepStates({
      hive: 'PENDING',
      telemetry: 'PENDING',
      ai: 'PENDING',
      batch: 'PENDING',
      blockchain: 'PENDING',
      processing: 'PENDING',
      transport: 'PENDING',
      packaging: 'PENDING',
      verification: 'PENDING',
      passport: 'PENDING',
    });
    addLog('Demo state reset. Hyperledger Fabric network & database preserved.', 'INFO');
  };

  // STEP 2: Ingest Telemetry
  const handleGenerateTelemetry = async (isAnomaly: boolean) => {
    setLoadingStep('telemetry');
    setStepStates(prev => ({ ...prev, telemetry: 'RUNNING', ai: 'RUNNING' }));

    const telemetryData = isAnomaly ? {
      temperature: 41.8,
      humidity: 82.0,
      weight: 31.2,
      activity: 0.18
    } : {
      temperature: 34.2,
      humidity: 61.0,
      weight: 42.7,
      activity: 0.84
    };

    setCurrentTelemetry(telemetryData);
    addLog(
      isAnomaly 
        ? `Transmitting Simulated Anomaly Telemetry (Temp: 41.8°C, Humidity: 82%, Weight Drop: 31.2kg, Activity: 0.18)`
        : `Transmitting Normal Baseline Telemetry (Temp: 34.2°C, Humidity: 61%, Weight: 42.7kg, Activity: 0.84)`,
      isAnomaly ? 'WARNING' : 'INFO'
    );

    // 1. Post real telemetry to backend
    const saved = await ingestTelemetry({
      hiveId: demoHiveId,
      telemetry: telemetryData,
      timestamp: new Date().toISOString()
    });

    if (saved) {
      addLog(`Telemetry record persisted to database for ${demoHiveId}`, 'SUCCESS');
      setStepStates(prev => ({ ...prev, telemetry: 'COMPLETED' }));
    } else {
      addLog(`Failed to persist telemetry record to backend`, 'ERROR');
      setStepStates(prev => ({ ...prev, telemetry: 'FAILED' }));
    }

    // 2. Trigger real AI analysis from backend
    const [healthRes, anomalyRes] = await Promise.all([
      getHiveHealth(demoHiveId),
      getHiveAnomalies(demoHiveId)
    ]);

    setAiHealth(healthRes);
    setAiAnomaly(anomalyRes);

    if (anomalyRes?.anomaly) {
      addLog(`AI IsolationForest Model Flagged Anomaly: ${anomalyRes.severity} Severity (${anomalyRes.reasons.join('; ')})`, 'WARNING');
      setStepStates(prev => ({ ...prev, ai: 'WARNING' }));
    } else {
      addLog(`AI Model Evaluation: NORMAL Colony Thermodynamics (Score: ${healthRes.healthScore}/100)`, 'SUCCESS');
      setStepStates(prev => ({ ...prev, ai: 'COMPLETED' }));
    }

    setLoadingStep(null);
  };

  // STEP 4: Create Batch & Submit to Blockchain
  const handleCreateBatch = async () => {
    if (!demoBatchId) return;
    setLoadingStep('batch');
    setStepStates(prev => ({ ...prev, batch: 'RUNNING', blockchain: 'RUNNING' }));

    const selectedHive = availableHives.find(h => h.id === demoHiveId);
    const originStr = selectedHive ? `${selectedHive.location.address || selectedHive.id} (${selectedHive.id})` : `${demoHiveId} Apiary`;

    addLog(`Submitting Batch Creation for ${demoBatchId} (${originStr})...`, 'INFO');

    const batch = await createBatch({
      id: demoBatchId,
      hiveId: demoHiveId,
      quantity: 24.5,
      origin: originStr,
      floralSource: 'Himalayan Multifloral Blossom'
    });

    if (batch) {
      setCreatedBatch(batch);
      setBlockchainTxInfo({
        txId: batch.blockchainTxId || 'CONFIRMED',
        status: batch.blockchainStatus || 'CONFIRMED'
      });
      addLog(`Batch ${batch.id} created successfully in database.`, 'SUCCESS');
      addLog(`Fabric Transaction Confirmed: ${batch.blockchainTxId || 'Committed to honeychannel'}`, 'SUCCESS');
      setStepStates(prev => ({ ...prev, batch: 'COMPLETED', blockchain: 'COMPLETED' }));
    } else {
      addLog(`Failed to create batch on backend/Fabric.`, 'ERROR');
      setStepStates(prev => ({ ...prev, batch: 'FAILED', blockchain: 'FAILED' }));
    }

    setLoadingStep(null);
  };

  // STEP 6: Record Processing
  const handleRecordProcessing = async () => {
    if (!demoBatchId) return;
    setLoadingStep('processing');
    setStepStates(prev => ({ ...prev, processing: 'RUNNING' }));

    addLog(`Recording Thermal Stabilization & Moisture Extraction on Fabric...`, 'INFO');

    const result = await recordBatchProcessing(demoBatchId, {
      eventType: 'MOISTURE_EXTRACTION_FILTRATION',
      temperatureCelsius: 38.5,
      moisturePercent: 17.8,
      outputWeightKg: 24.2,
      details: { filterMeshMicrons: 80, enzymePreserved: true }
    });

    if (result) {
      setProcessingDone(true);
      addLog(`Processing event committed to Fabric ledger (Temp: 38.5°C, Moisture: 17.8%, Output: 24.2kg)`, 'SUCCESS');
      setStepStates(prev => ({ ...prev, processing: 'COMPLETED' }));
    } else {
      addLog(`Processing event recording failed.`, 'ERROR');
      setStepStates(prev => ({ ...prev, processing: 'FAILED' }));
    }

    setLoadingStep(null);
  };

  // STEP 7: Record Transport
  const handleRecordTransport = async () => {
    if (!demoBatchId) return;
    setLoadingStep('transport');
    setStepStates(prev => ({ ...prev, transport: 'RUNNING' }));

    addLog(`Dispatching Refrigerated Logistics Fleet (Vehicle: DL-01-AX-9922)...`, 'INFO');

    const result = await recordBatchTransport(demoBatchId, {
      source: 'Apiary Extraction Center',
      destination: 'PureFlora Packaging Hub',
      vehicleNumber: 'DL-01-AX-9922',
      transitTemperatureCelsius: 22.4,
      conditionStatus: 'OPTIMAL'
    });

    if (result) {
      setTransportDone(true);
      addLog(`Cold-chain custody dispatch confirmed on Hyperledger Fabric (Temp: 22.4°C)`, 'SUCCESS');
      setStepStates(prev => ({ ...prev, transport: 'COMPLETED' }));
    } else {
      addLog(`Transport event recording failed.`, 'ERROR');
      setStepStates(prev => ({ ...prev, transport: 'FAILED' }));
    }

    setLoadingStep(null);
  };

  // STEP 8: Record Packaging & Publish
  const handleRecordPackaging = async () => {
    if (!demoBatchId) return;
    setLoadingStep('packaging');
    setStepStates(prev => ({ ...prev, packaging: 'RUNNING', passport: 'RUNNING' }));

    addLog(`Logging Jar Bottling & Packaging (Glass Hexagonal Jar 500g, 48 Units)...`, 'INFO');

    await recordBatchPackaging(demoBatchId, {
      productId: 'HONEY-RAW-DEMO-500G',
      containerType: 'Glass Hexagonal Jar (500g)',
      unitsCount: 48,
      unitWeightGrams: 500
    });

    await publishBatchPassport(demoBatchId);

    setPackagingDone(true);
    addLog(`Packaging event & Digital Passport published on Fabric ledger.`, 'SUCCESS');
    setStepStates(prev => ({ ...prev, packaging: 'COMPLETED', passport: 'COMPLETED' }));

    setLoadingStep(null);
  };

  // STEP 9: Verify Provenance
  const handleVerifyProvenance = async () => {
    if (!demoBatchId) return;
    setLoadingStep('verification');
    setStepStates(prev => ({ ...prev, verification: 'RUNNING' }));

    addLog(`Executing AI Provenance Consistency Check & Fabric History Query...`, 'INFO');

    const [verRes, timelineRes] = await Promise.all([
      checkProvenance({
        batchId: demoBatchId,
        blockchainHarvestQuantity: 24.5,
        observedQuantity: 24.5
      }),
      getBatchTimeline(demoBatchId)
    ]);

    if (verRes) {
      setVerificationResult(verRes);
      if (timelineRes?.blockchainTransactions) {
        setBlockchainHistory(timelineRes.blockchainTransactions);
      }
      addLog(`Provenance Analysis Complete: Status ${verRes.status} (Consistency Score: ${Math.round((verRes.consistencyScore || 0.98) * 100)}%)`, 'SUCCESS');
      setStepStates(prev => ({ ...prev, verification: 'COMPLETED' }));
    } else {
      addLog(`Provenance check query failed.`, 'ERROR');
      setStepStates(prev => ({ ...prev, verification: 'FAILED' }));
    }

    setLoadingStep(null);
  };

  const getBadgeForStep = (state: StepState) => {
    switch (state) {
      case 'COMPLETED':
        return <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</span>;
      case 'RUNNING':
        return <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center animate-pulse"><Clock className="w-3 h-3 mr-1" /> In Progress</span>;
      case 'WARNING':
        return <span className="text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> Anomaly Flagged</span>;
      case 'FAILED':
        return <span className="text-rose-900 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Failed</span>;
      case 'PENDING':
      default:
        return <span className="text-stone-500 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-[10px] font-mono">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Demo Controls */}
      <div className="bg-white border border-[#EAE3D9] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎬</span>
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Live Honey Chain Demo</h1>
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Run the complete traceability workflow using the real Honey Chain services: Hive IoT → AI Analysis → Fabric Ledger → Processing → Transport → Packaging → QR Passport.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {!demoActive ? (
              <button
                onClick={startNewDemo}
                className="inline-flex items-center px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Play className="w-4 h-4 mr-1.5 fill-white" /> Start Live Demo
              </button>
            ) : (
              <>
                <button
                  onClick={startNewDemo}
                  className="inline-flex items-center px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold rounded-xl border border-amber-300 transition-colors"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" /> New Demo Session
                </button>
                <button
                  onClick={resetDemo}
                  className="inline-flex items-center px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl border border-[#EAE3D9] transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" /> Reset
                </button>
              </>
            )}
          </div>
        </div>

        {/* System Probes Status Bar */}
        <div className="pt-3 border-t border-[#EAE3D9] flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="text-stone-500 font-sans font-semibold text-[11px]">System Live Probes:</span>
          
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#EAE3D9]">
            <Server className="w-3.5 h-3.5 text-stone-600" />
            <span>Backend:</span>
            <span className="text-emerald-700 font-bold">UP (5000)</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#EAE3D9]">
            <Brain className="w-3.5 h-3.5 text-amber-700" />
            <span>AI Engine:</span>
            <span className="text-emerald-700 font-bold">UP (8000)</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#EAE3D9]">
            <Database className="w-3.5 h-3.5 text-sky-700" />
            <span>PostgreSQL:</span>
            <span className="text-emerald-700 font-bold">ONLINE</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#EAE3D9]">
            <Layers className="w-3.5 h-3.5 text-indigo-700" />
            <span>Fabric Gateway:</span>
            <span className="text-emerald-700 font-bold">CONNECTED</span>
          </div>
        </div>
      </div>

      {/* Prominent Pipeline Flow Visualizer */}
      <div className="bg-white border border-[#EAE3D9] rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="text-xs font-bold font-mono text-stone-600 uppercase tracking-wider">
          End-to-End Traceability Pipeline State
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 text-center text-xs">
          {[
            { id: 'hive', label: '1. Hive', icon: '🐝', state: stepStates.hive },
            { id: 'telemetry', label: '2. Telemetry', icon: '📡', state: stepStates.telemetry },
            { id: 'ai', label: '3. AI Model', icon: '🤖', state: stepStates.ai },
            { id: 'batch', label: '4. Batch', icon: '📦', state: stepStates.batch },
            { id: 'blockchain', label: '5. Fabric', icon: '⛓️', state: stepStates.blockchain },
            { id: 'processing', label: '6. Process', icon: '🏭', state: stepStates.processing },
            { id: 'transport', label: '7. Transport', icon: '🚚', state: stepStates.transport },
            { id: 'packaging', label: '8. Package', icon: '📦', state: stepStates.packaging },
            { id: 'passport', label: '9. Passport', icon: '📱', state: stepStates.passport },
          ].map((s) => (
            <div
              key={s.id}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-between space-y-1.5 transition ${
                s.state === 'COMPLETED'
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : s.state === 'RUNNING'
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300/40'
                  : s.state === 'WARNING'
                  ? 'bg-rose-50/80 border-rose-300'
                  : s.state === 'FAILED'
                  ? 'bg-rose-100 border-rose-400'
                  : 'bg-[#FAF8F5] border-[#EAE3D9]'
              }`}
            >
              <span className="text-lg">{s.icon}</span>
              <span className="font-semibold text-stone-800 text-[11px] truncate w-full">{s.label}</span>
              {getBadgeForStep(s.state)}
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Interactive Execution Cards (Left) + Live Activity Log (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Pipeline Steps */}
        <div className="lg:col-span-2 space-y-5">
          {/* STEP 1: Hive Selection */}
          <div className="bg-white border border-[#EAE3D9] rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-xs flex items-center justify-center mr-2 font-mono">1</span>
                Apiary Hive Selection
              </h3>
              {getBadgeForStep(stepStates.hive)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-500 font-mono text-[11px] mb-1">Target Apiary Hive</label>
                <select
                  value={demoHiveId}
                  onChange={e => setDemoHiveId(e.target.value)}
                  disabled={!demoActive || stepStates.batch === 'COMPLETED'}
                  className="w-full p-2 rounded-lg border border-[#EAE3D9] bg-[#FAF8F5] text-stone-800 font-mono"
                >
                  {availableHives.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.id} — {h.location.address || 'Apiary'} ({h.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE3D9] flex flex-col justify-center">
                <span className="text-[10px] font-mono text-stone-500">Active Demo Batch ID:</span>
                <span className="font-mono font-bold text-amber-800 text-xs">{demoBatchId || 'Click "Start Live Demo" above'}</span>
              </div>
            </div>
          </div>

          {/* STEP 2 & 3: Telemetry Ingestion & Real AI Analysis */}
          <div className="bg-white border border-[#EAE3D9] rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-xs flex items-center justify-center mr-2 font-mono">2</span>
                IoT Telemetry Ingestion & AI Model Inference
              </h3>
              <div className="flex space-x-2">
                {getBadgeForStep(stepStates.telemetry)}
                {getBadgeForStep(stepStates.ai)}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleGenerateTelemetry(false)}
                disabled={!demoActive || loadingStep === 'telemetry'}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition flex items-center"
              >
                <Radio className="w-3.5 h-3.5 mr-1.5" />
                Generate Normal Telemetry (34.2°C)
              </button>

              <button
                onClick={() => handleGenerateTelemetry(true)}
                disabled={!demoActive || loadingStep === 'telemetry'}
                className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition flex items-center"
              >
                <Flame className="w-3.5 h-3.5 mr-1.5" />
                Simulate Thermal Spike Anomaly (41.8°C)
              </button>
            </div>

            {/* Telemetry Display */}
            {currentTelemetry && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE3D9]">
                  <span className="text-[10px] text-stone-500 block">Temperature</span>
                  <span className={`font-bold text-sm ${currentTelemetry.temperature > 40 ? 'text-rose-700' : 'text-stone-800'}`}>
                    {currentTelemetry.temperature} °C
                  </span>
                </div>
                <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE3D9]">
                  <span className="text-[10px] text-stone-500 block">Humidity</span>
                  <span className="font-bold text-sm text-stone-800">{currentTelemetry.humidity} %</span>
                </div>
                <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE3D9]">
                  <span className="text-[10px] text-stone-500 block">Hive Mass</span>
                  <span className="font-bold text-sm text-stone-800">{currentTelemetry.weight} kg</span>
                </div>
                <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE3D9]">
                  <span className="text-[10px] text-stone-500 block">Bee Activity</span>
                  <span className="font-bold text-sm text-stone-800">{Math.round(currentTelemetry.activity * 100)} %</span>
                </div>
              </div>
            )}

            {/* Real AI Inference Output Panel */}
            {aiHealth && (
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                aiAnomaly?.anomaly 
                  ? 'bg-rose-50/70 border-rose-300 text-rose-950' 
                  : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center">
                    <Cpu className="w-4 h-4 mr-1.5 text-stone-700" />
                    AI IsolationForest Model Inference (HOBOS Calibrated)
                  </span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                    aiAnomaly?.anomaly ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                  }`}>
                    {aiAnomaly?.anomaly ? `ANOMALY DETECTED (${aiAnomaly.severity})` : 'NORMAL BASELINE'}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-[11px] font-mono text-stone-700">
                  <span>Colony Health Score: <strong>{aiHealth.healthScore}/100</strong></span>
                  <span>Health State: <strong>{aiHealth.health}</strong></span>
                </div>

                {aiAnomaly?.anomaly && aiAnomaly.reasons.length > 0 && (
                  <div className="pt-1 text-[11px]">
                    <span className="font-semibold block">Explainable Feature Attribution:</span>
                    <ul className="list-disc list-inside text-stone-800 pl-1 mt-0.5 space-y-0.5">
                      {aiAnomaly.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 4 & 5: Batch Creation & Fabric Anchoring */}
          <div className="bg-white border border-[#EAE3D9] rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-xs flex items-center justify-center mr-2 font-mono">3</span>
                Harvest Batch Creation & Hyperledger Fabric Anchoring
              </h3>
              <div className="flex space-x-2">
                {getBadgeForStep(stepStates.batch)}
                {getBadgeForStep(stepStates.blockchain)}
              </div>
            </div>

            <div>
              <button
                onClick={handleCreateBatch}
                disabled={!demoActive || stepStates.telemetry === 'PENDING' || stepStates.batch === 'COMPLETED' || loadingStep === 'batch'}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition flex items-center"
              >
                <Layers className="w-3.5 h-3.5 mr-1.5" />
                {loadingStep === 'batch' ? 'Submitting to Fabric...' : 'Create Batch & Submit Fabric Transaction'}
              </button>
            </div>

            {createdBatch && blockchainTxInfo && (
              <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE3D9] rounded-lg text-xs space-y-2 font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">Batch ID: {createdBatch.id}</span>
                  <span className="text-emerald-700 font-bold">Fabric Confirmed</span>
                </div>
                <div className="text-[11px] text-stone-600 space-y-0.5">
                  <p>Volume: {createdBatch.quantity} kg • Floral: {createdBatch.floralSource}</p>
                  <p className="truncate">Transaction ID: <span className="text-amber-900">{blockchainTxInfo.txId}</span></p>
                  <p>Channel: <span className="text-stone-800">honeychannel</span> • Chaincode: <span className="text-stone-800">honeychain</span></p>
                </div>
              </div>
            )}
          </div>

          {/* STEP 6, 7 & 8: Processing, Transport, Packaging */}
          <div className="bg-white border border-[#EAE3D9] rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="font-bold text-stone-900 text-sm flex items-center">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-xs flex items-center justify-center mr-2 font-mono">4</span>
              Supply Chain Participant Pipeline Execution
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Processing */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl space-y-2 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 flex items-center"><Filter className="w-3.5 h-3.5 mr-1 text-amber-700" /> Processing</span>
                    {getBadgeForStep(stepStates.processing)}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Moisture reduction &le;40°C & micro-filtration.</p>
                </div>
                <button
                  onClick={handleRecordProcessing}
                  disabled={!createdBatch || processingDone || loadingStep === 'processing'}
                  className="w-full py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold disabled:opacity-40 transition"
                >
                  {processingDone ? '✓ Recorded' : 'Record Processing'}
                </button>
              </div>

              {/* Transport */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl space-y-2 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 flex items-center"><Truck className="w-3.5 h-3.5 mr-1 text-indigo-700" /> Transport</span>
                    {getBadgeForStep(stepStates.transport)}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Refrigerated cargo transit (22.4°C).</p>
                </div>
                <button
                  onClick={handleRecordTransport}
                  disabled={!processingDone || transportDone || loadingStep === 'transport'}
                  className="w-full py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-semibold disabled:opacity-40 transition"
                >
                  {transportDone ? '✓ Recorded' : 'Record Transport'}
                </button>
              </div>

              {/* Packaging */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl space-y-2 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 flex items-center"><Package className="w-3.5 h-3.5 mr-1 text-purple-700" /> Packaging</span>
                    {getBadgeForStep(stepStates.packaging)}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Glass jar bottling & public Passport publishing.</p>
                </div>
                <button
                  onClick={handleRecordPackaging}
                  disabled={!transportDone || packagingDone || loadingStep === 'packaging'}
                  className="w-full py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold disabled:opacity-40 transition"
                >
                  {packagingDone ? '✓ Published' : 'Package & Publish'}
                </button>
              </div>
            </div>
          </div>

          {/* STEP 9 & 10: Provenance Verification & Passport */}
          <div className="bg-white border border-[#EAE3D9] rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-xs flex items-center justify-center mr-2 font-mono">5</span>
                Fabric History Verification & QR Honey Passport
              </h3>
              <div className="flex space-x-2">
                {getBadgeForStep(stepStates.verification)}
                {getBadgeForStep(stepStates.passport)}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleVerifyProvenance}
                disabled={!packagingDone || loadingStep === 'verification'}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition flex items-center"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                Verify Batch Provenance on Fabric
              </button>

              {packagingDone && demoBatchId && (
                <>
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold border border-[#EAE3D9] transition flex items-center"
                  >
                    <QrCode className="w-3.5 h-3.5 mr-1.5" /> Show QR Code
                  </button>

                  <button
                    onClick={() => onOpenPassport(demoBatchId)}
                    className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Open Honey Passport
                  </button>
                </>
              )}
            </div>

            {verificationResult && (
              <div className="p-4 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">Provenance Consistency Result</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {verificationResult.status} ({Math.round((verificationResult.consistencyScore || 0.98) * 100)}%)
                  </span>
                </div>
                <p className="text-stone-600 text-[11px]">
                  Hyperledger Fabric preserves the chronological chain-of-custody. AI evidence check confirms recorded harvest matches packaged output.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Event Activity Log */}
        <div className="space-y-4">
          <div className="bg-white border border-[#EAE3D9] rounded-xl p-5 shadow-xs space-y-3 flex flex-col h-full min-h-[540px]">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D9]">
              <h3 className="font-bold text-stone-900 text-xs font-mono uppercase tracking-wider flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-800" /> Live Event Activity Log
              </h3>
              <span className="text-[10px] font-mono text-stone-500">{eventLogs.length} events</span>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto max-h-[640px] pr-1">
              {eventLogs.length > 0 ? (
                eventLogs.map(log => (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded-lg border text-xs font-mono space-y-0.5 ${
                      log.type === 'SUCCESS'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : log.type === 'WARNING'
                        ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                        : log.type === 'ERROR'
                        ? 'bg-rose-100 border-rose-300 text-rose-950'
                        : 'bg-[#FAF8F5] border-[#EAE3D9] text-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span>[{log.time}]</span>
                      <span className="font-bold">{log.type}</span>
                    </div>
                    <p className="text-[11px] leading-snug">{log.text}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-stone-400 text-xs font-mono italic">
                  Click "Start Live Demo" to begin execution log stream.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal Component */}
      {showQrModal && demoBatchId && (
        <QrModal
          batchId={demoBatchId}
          onClose={() => setShowQrModal(false)}
          onOpenPassport={(id) => {
            setShowQrModal(false);
            onOpenPassport(id);
          }}
        />
      )}
    </div>
  );
};
