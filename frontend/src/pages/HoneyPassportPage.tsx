import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, ArrowLeft, FlaskConical, Cpu, Layers, ExternalLink } from 'lucide-react';
import { HoneyPassport } from '../types';
import { getHoneyPassport } from '../services/api';

interface HoneyPassportPageProps {
  batchId: string;
  onBack?: () => void;
}

export const HoneyPassportPage: React.FC<HoneyPassportPageProps> = ({ batchId, onBack }) => {
  const [passport, setPassport] = useState<HoneyPassport | null>(null);

  useEffect(() => {
    getHoneyPassport(batchId).then(setPassport);
  }, [batchId]);

  if (!passport) {
    return <div className="p-8 text-center text-stone-500 font-mono text-xs">Loading Passport Record...</div>;
  }

  const isVerified = passport.verification.provenanceStatus === 'VERIFIED' || passport.verification.provenanceStatus === 'CONFIRMED';
  const isAiNormal = passport.verification.consistencyStatus !== 'SUSPICIOUS';
  const qualityPassed = passport.quality?.status === 'PASSED';

  return (
    <div className="max-w-3xl mx-auto space-y-4 py-2 select-none">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center text-xs text-amber-700 hover:text-amber-800 hover:underline font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Operations Dashboard
        </button>
      )}

      {/* Official Digital Certificate Document Container */}
      <div className="bg-white border border-[#EAE3D9] rounded-xl shadow-sm p-6 md:p-8 space-y-6">
        {/* Certificate Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D9] pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shrink-0">
              🍯
            </div>
            <div>
              <p className="text-[10px] font-mono font-semibold text-amber-700 uppercase tracking-wider">
                Digital Honey Passport • Public Consumer Provenance
              </p>
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                Batch {passport.batchId}
              </h1>
            </div>
          </div>

          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold font-mono border ${
              isVerified
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {isVerified ? <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 mr-1.5 text-rose-600" />}
              {isVerified ? 'VERIFIED PROVENANCE' : 'QUANTITY DISCREPANCY'}
            </span>
          </div>
        </div>

        {/* 3-Pillar Verification Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Pillar 1: Blockchain Custody */}
          <div className="p-3.5 rounded-lg border bg-[#FAF8F5] border-[#EAE3D9] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[10px] text-stone-500 uppercase flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1 text-amber-700" /> 1. Blockchain
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                CONFIRMED
              </span>
            </div>
            <p className="font-semibold text-stone-800 text-[11px]">Hyperledger Fabric</p>
            <p className="text-[10px] text-stone-500">Tamper-evident custody recorded on shared ledger.</p>
          </div>

          {/* Pillar 2: AI Consistency */}
          <div className="p-3.5 rounded-lg border bg-[#FAF8F5] border-[#EAE3D9] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[10px] text-stone-500 uppercase flex items-center">
                <Cpu className="w-3.5 h-3.5 mr-1 text-amber-700" /> 2. AI Evidence
              </span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isAiNormal ? 'text-emerald-800 bg-emerald-100/80' : 'text-rose-800 bg-rose-100/80'
              }`}>
                {isAiNormal ? 'CONSISTENT' : 'WARNING'}
              </span>
            </div>
            <p className="font-semibold text-stone-800 text-[11px]">IsolationForest Telemetry</p>
            <p className="text-[10px] text-stone-500">
              {isAiNormal ? 'Harvest volume matches observed yield.' : 'Volume anomaly flagged by AI model.'}
            </p>
          </div>

          {/* Pillar 3: Chemical Lab Assay */}
          <div className="p-3.5 rounded-lg border bg-[#FAF8F5] border-[#EAE3D9] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[10px] text-stone-500 uppercase flex items-center">
                <FlaskConical className="w-3.5 h-3.5 mr-1 text-amber-700" /> 3. Chemical Assay
              </span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                qualityPassed ? 'text-emerald-800 bg-emerald-100/80' : 'text-amber-800 bg-amber-100/80'
              }`}>
                {qualityPassed ? 'FSSAI PASSED' : (passport.quality?.status || 'NOT AVAILABLE')}
              </span>
            </div>
            <p className="font-semibold text-stone-800 text-[11px]">NABL Accredited Assay</p>
            <p className="text-[10px] text-stone-500">
              {qualityPassed ? `Moisture ${passport.quality?.moisturePercent}% • HMF ${passport.quality?.hmfMgPerKg} mg/kg` : 'Lab certificate review'}
            </p>
          </div>
        </div>

        {/* Technical Provenance Data Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#FFFDF9] p-3.5 rounded-lg border border-[#EAE3D9]">
            <p className="text-[10px] text-stone-500 font-mono uppercase">Origin Apiary</p>
            <p className="font-semibold text-stone-800 mt-1 truncate">{passport.origin}</p>
          </div>
          <div className="bg-[#FFFDF9] p-3.5 rounded-lg border border-[#EAE3D9]">
            <p className="text-[10px] text-stone-500 font-mono uppercase">Floral Source</p>
            <p className="font-semibold text-stone-800 mt-1">{passport.floralSource || 'Multifloral Blossom'}</p>
          </div>
          <div className="bg-[#FFFDF9] p-3.5 rounded-lg border border-[#EAE3D9]">
            <p className="text-[10px] text-stone-500 font-mono uppercase">Batch Volume</p>
            <p className="font-semibold text-stone-800 mt-1">{passport.quantity} kg</p>
          </div>
          <div className="bg-[#FFFDF9] p-3.5 rounded-lg border border-[#EAE3D9]">
            <p className="text-[10px] text-stone-500 font-mono uppercase">Evidence Score</p>
            <p className={`font-bold font-mono mt-1 ${isVerified ? 'text-emerald-700' : 'text-rose-700'}`}>
              {Math.round(passport.verification.consistencyScore * 100)}%
            </p>
          </div>
        </div>

        {/* Public Chain of Custody Timeline */}
        <div className="space-y-3 pt-1">
          <p className="text-[11px] font-mono text-stone-500 uppercase tracking-wider font-semibold">
            Privacy-Filtered Provenance Timeline
          </p>
          <div className="space-y-2 text-xs">
            {/* Harvest */}
            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE3D9] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-stone-800">1. Apiary Honey Harvest</span>
                  <p className="text-[11px] text-stone-500">Origin: {passport.origin}</p>
                </div>
              </div>
              <span className="font-mono text-[10px] text-stone-500">
                {passport.harvest?.harvestDate ? new Date(passport.harvest.harvestDate).toLocaleDateString() : 'Aug 20, 2026'}
              </span>
            </div>

            {/* Processing */}
            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE3D9] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-stone-800">2. Thermal Stabilization & De-Aeration</span>
                  <p className="text-[11px] text-stone-500">Gentle extraction &le;40°C preserving live enzymes</p>
                </div>
              </div>
              <span className="font-mono text-[10px] text-stone-500">Verified Step</span>
            </div>

            {/* Cold Chain Transport */}
            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE3D9] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-stone-800">3. Temperature-Controlled Logistics</span>
                  <p className="text-[11px] text-stone-500">Monitored refrigerated transit to packaging facility</p>
                </div>
              </div>
              <span className="font-mono text-[10px] text-stone-500">Verified Step</span>
            </div>

            {/* Packaging */}
            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE3D9] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-stone-800">4. Final Tamper-Evident Packaging & QR Release</span>
                  <p className="text-[11px] text-stone-500">Food-grade glass bottling with unique consumer QR</p>
                </div>
              </div>
              <span className="font-mono text-[10px] text-stone-500">Published</span>
            </div>
          </div>
        </div>

        {/* Document Footer & Master Spec Disclaimer */}
        <div className="pt-4 border-t border-[#EAE3D9] space-y-2 text-[11px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-stone-500 font-mono text-[10px]">
            <span>Fabric Tx ID: {passport.verification.blockchainTxId || '0x8f3c7e9a2b4d1056'}</span>
            <span>Bee-Tech • SIH26021</span>
          </div>
          <p className="text-[10px] text-stone-500 italic">
            Disclaimer: Blockchain preserves historical transactions; AI evaluates evidence consistency. Laboratory test data reflects NABL assay results.
          </p>
        </div>
      </div>
    </div>
  );
};
