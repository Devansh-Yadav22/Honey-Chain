import React, { useEffect, useState } from 'react';
import { Batch, QualityLabTest } from '../types';
import { getBatches, getQualityTests, recordQualityTest } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { FlaskConical, ShieldCheck, AlertCircle, FileCheck, CheckCircle2, Hash, ExternalLink } from 'lucide-react';

export const QualityPortal: React.FC<{ onNavigateToBatch?: (id: string) => void }> = ({ onNavigateToBatch }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('HC-2026-0001');
  const [qualityTests, setQualityTests] = useState<QualityLabTest[]>([]);

  // Test form state
  const [moisture, setMoisture] = useState('17.8');
  const [hmf, setHmf] = useState('12.4');
  const [sucrose, setSucrose] = useState('2.1');
  const [pollen, setPollen] = useState('28500');
  const [antibiotics, setAntibiotics] = useState<'NEGATIVE' | 'POSITIVE'>('NEGATIVE');
  const [leadPpm, setLeadPpm] = useState('0.02');
  const [notes, setNotes] = useState('Complies with FSSAI Honey Purity & Codex 12-1981 standards.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedBatchId) {
      getQualityTests(selectedBatchId).then(setQualityTests);
    }
  }, [selectedBatchId]);

  const loadData = async () => {
    const [bList, tList] = await Promise.all([getBatches(), getQualityTests()]);
    setBatches(bList);
    if (bList.length > 0 && !selectedBatchId) {
      setSelectedBatchId(bList[0].id);
    }
  };

  const handleRecordTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId) return;
    setIsSubmitting(true);

    await recordQualityTest({
      batchId: selectedBatchId,
      parameters: {
        moisturePercent: parseFloat(moisture),
        hmfMgPerKg: parseFloat(hmf),
        sucrosePercent: parseFloat(sucrose),
        pollenCountPerGram: parseInt(pollen),
        antibioticResidue: antibiotics,
        leadPpm: parseFloat(leadPpm)
      },
      notes
    });

    setIsSubmitting(false);
    const updatedTests = await getQualityTests(selectedBatchId);
    setQualityTests(updatedTests);
  };

  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#EAE3D9]">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🔬</span>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Quality & Laboratory Evidence Portal</h1>
        </div>
        <p className="text-xs text-stone-600 mt-1">
          Apex Food Safety & Purity Testing Labs (NABL Accredited) • Chemical profiling, isotopic analysis, and digital certificate hashing.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batches Queue */}
        <div className="bg-white border border-[#EAE3D9] rounded-xl p-4 space-y-3">
          <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
            Honey Batches for Chemical Assay ({batches.length})
          </h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {batches.map(batch => {
              const isSelected = selectedBatchId === batch.id;
              return (
                <div
                  key={batch.id}
                  onClick={() => setSelectedBatchId(batch.id)}
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

        {/* Quality Assay Workspace */}
        <div className="lg:col-span-2 space-y-5">
          {selectedBatch ? (
            <div className="bg-white border border-[#EAE3D9] rounded-xl p-6 space-y-6">
              {/* Batch Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE3D9]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-lg text-amber-800">{selectedBatch.id}</span>
                    <StatusBadge status={selectedBatch.status} type="batch" />
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{selectedBatch.origin} • Floral: {selectedBatch.floralSource || 'Mustard'}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-stone-500 block">NABL Standard ISO/IEC 17025</span>
                  <span className="text-xs font-semibold text-stone-800 font-mono">FSSAI Honey Spec 2018</span>
                </div>
              </div>

              {/* Chemical Assay Form */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-stone-800 flex items-center">
                  <FlaskConical className="w-4 h-4 mr-1.5 text-amber-700" /> Enter Laboratory Chemical Assay Parameters
                </h3>

                <form onSubmit={handleRecordTest} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">
                      Moisture Content (%) <span className="text-stone-400 font-normal">[Max 20.0%]</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={moisture}
                      onChange={e => setMoisture(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">
                      Hydroxymethylfurfural (HMF mg/kg) <span className="text-stone-400 font-normal">[Max 40 mg/kg]</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={hmf}
                      onChange={e => setHmf(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">
                      Apparent Sucrose (%) <span className="text-stone-400 font-normal">[Max 5.0%]</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={sucrose}
                      onChange={e => setSucrose(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">
                      Pollen Grain Count (per gram) <span className="text-stone-400 font-normal">[Min 25,000]</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={pollen}
                      onChange={e => setPollen(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Antibiotic Residue Screen</label>
                    <select
                      value={antibiotics}
                      onChange={e => setAntibiotics(e.target.value as any)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-medium"
                    >
                      <option value="NEGATIVE">NEGATIVE (Undetected / Safe)</option>
                      <option value="POSITIVE">POSITIVE (Residue Detected)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Heavy Metal (Lead ppm)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={leadPpm}
                      onChange={e => setLeadPpm(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-600 font-medium mb-1">Analytical Observations</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#EAE3D9] bg-[#FFFDF9] text-stone-800"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg shadow-sm text-xs flex items-center justify-center transition-colors"
                    >
                      <FileCheck className="w-3.5 h-3.5 mr-1.5" />
                      {isSubmitting ? 'Computing Cryptographic Certificate Hash...' : 'Sign Digital Lab Certificate & Anchor on Fabric'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Verified Certificates */}
              <div className="space-y-3 pt-3 border-t border-[#EAE3D9]">
                <h4 className="text-xs font-mono font-bold text-stone-600 uppercase">Anchored Lab Certificates</h4>
                {qualityTests.length > 0 ? (
                  <div className="space-y-3">
                    {qualityTests.map(test => (
                      <div key={test.id} className="p-4 bg-[#FAF8F5] border border-[#EAE3D9] rounded-lg text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded font-bold font-mono text-[11px] ${
                            test.overallStatus === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {test.overallStatus === 'PASSED' ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> : <AlertCircle className="w-3.5 h-3.5 mr-1" />}
                            {test.overallStatus === 'PASSED' ? 'FSSAI COMPLIANT (PASSED)' : 'DEVIATION DETECTED'}
                          </span>
                          <span className="font-mono text-[10px] text-stone-500">{new Date(test.testDate).toLocaleDateString()}</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                          <div className="bg-white p-2 rounded border border-[#EAE3D9]">
                            <span className="text-stone-400 block text-[9px]">Moisture</span>
                            <span className="font-bold text-stone-800">{test.parameters.moisturePercent}%</span>
                          </div>
                          <div className="bg-white p-2 rounded border border-[#EAE3D9]">
                            <span className="text-stone-400 block text-[9px]">HMF</span>
                            <span className="font-bold text-stone-800">{test.parameters.hmfMgPerKg} mg/kg</span>
                          </div>
                          <div className="bg-white p-2 rounded border border-[#EAE3D9]">
                            <span className="text-stone-400 block text-[9px]">Sucrose</span>
                            <span className="font-bold text-stone-800">{test.parameters.sucrosePercent}%</span>
                          </div>
                          <div className="bg-white p-2 rounded border border-[#EAE3D9]">
                            <span className="text-stone-400 block text-[9px]">Pollen Count</span>
                            <span className="font-bold text-stone-800">{test.parameters.pollenCountPerGram.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#EAE3D9] flex items-center justify-between text-[10px] font-mono text-stone-500">
                          <span className="truncate max-w-[280px]">
                            SHA-256: {test.certificateHashSha256}
                          </span>
                          <span className="text-amber-800 font-semibold">{test.labName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic">No lab test certificates issued yet for this batch.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#EAE3D9] rounded-xl p-8 text-center text-stone-500 text-xs">
              Select a batch from the list to enter chemical assay results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
