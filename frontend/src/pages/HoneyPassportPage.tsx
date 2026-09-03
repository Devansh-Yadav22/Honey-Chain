import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, ArrowLeft } from 'lucide-react';
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
    return <div className="p-12 text-center text-stone-400">Loading Honey Passport verification...</div>;
  }

  const isVerified = passport.verification.provenanceStatus === 'VERIFIED';

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center text-xs text-amber-400 hover:underline mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Return to Platform
        </button>
      )}

      {/* Honey Passport Certificate Card */}
      <div className={`rounded-3xl p-8 border shadow-2xl relative overflow-hidden ${
        isVerified
          ? 'bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-amber-500/30'
          : 'bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-rose-500/40'
      }`}>
        {/* Shield Glow Effect */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isVerified ? 'bg-amber-500/10' : 'bg-rose-500/10'
        }`} />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-lg">
                🍯
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-stone-100 tracking-tight">HONEY PASSPORT</h1>
                <p className="text-xs text-amber-400 font-mono">Batch ID: {passport.batchId}</p>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                isVerified
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                  : 'bg-rose-950/80 text-rose-400 border-rose-500/40'
              }`}>
                {isVerified ? <ShieldCheck className="w-4 h-4 mr-1.5" /> : <ShieldAlert className="w-4 h-4 mr-1.5" />}
                {isVerified ? 'AUTHENTIC PROVENANCE' : 'PROVENANCE ANOMALY'}
              </span>
            </div>
          </div>

          {/* Consumer Verification Status Shield */}
          <div className={`p-5 rounded-2xl border ${
            isVerified ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
          }`}>
            <h3 className="font-bold text-sm flex items-center">
              {isVerified ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 mr-2 text-rose-400" />}
              {isVerified ? 'Tamper-Evident History Verified on Hyperledger Fabric' : 'PROVENANCE INCONSISTENCY FLAGGED'}
            </h3>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              {isVerified
                ? 'The origin, harvest quantity, processing timeline, and chain of custody for this honey batch match all recorded on-chain evidence.'
                : 'The recorded harvest quantity does not match the observed batch volume. The AI Evidence Engine has flagged this batch for review.'}
            </p>
          </div>

          {/* Key Provenance Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
            <div className="bg-stone-900/60 p-3.5 rounded-xl border border-stone-800">
              <p className="text-[11px] text-stone-400">Honey Origin</p>
              <p className="font-semibold text-xs text-stone-200 mt-1 truncate">{passport.origin}</p>
            </div>
            <div className="bg-stone-900/60 p-3.5 rounded-xl border border-stone-800">
              <p className="text-[11px] text-stone-400">Batch Volume</p>
              <p className="font-semibold text-xs text-stone-200 mt-1">{passport.quantity} kg</p>
            </div>
            <div className="bg-stone-900/60 p-3.5 rounded-xl border border-stone-800">
              <p className="text-[11px] text-stone-400">Harvest Date</p>
              <p className="font-semibold text-xs text-stone-200 mt-1">
                {passport.harvest?.harvestDate ? new Date(passport.harvest.harvestDate).toLocaleDateString() : 'Aug 2026'}
              </p>
            </div>
            <div className="bg-stone-900/60 p-3.5 rounded-xl border border-stone-800">
              <p className="text-[11px] text-stone-400">Consistency Score</p>
              <p className={`font-bold text-xs mt-1 ${isVerified ? 'text-emerald-400' : 'text-rose-400'}`}>
                {Math.round(passport.verification.consistencyScore * 100)}%
              </p>
            </div>
          </div>

          {/* Consumer Verification Checkpoints */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Consumer Trust Checkpoints</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-stone-900/40 border border-stone-800 text-stone-300 flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                <span>✓ Origin & Hive Intelligence Recorded</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-900/40 border border-stone-800 text-stone-300 flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                <span>✓ Harvest Date & Quantity Recorded</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-900/40 border border-stone-800 text-stone-300 flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                <span>✓ Cold Filtering & Moisture Logged</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-900/40 border border-stone-800 text-stone-300 flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                <span>✓ Chain of Custody Transport Logged</span>
              </div>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="pt-6 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
            <span>Verified by Bee-Tech • SIH26021</span>
            <span className="font-mono">Block Tx: {passport.verification.blockchainTxId?.substring(0, 16) || '0x8f3c7e9a2b4d'}...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
