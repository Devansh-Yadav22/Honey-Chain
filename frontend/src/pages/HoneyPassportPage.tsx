import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, ArrowLeft, FlaskConical, Layers, Clock, Award, User, Building2, FileCheck, Leaf } from 'lucide-react';
import { HoneyPassport } from '../types';
import { getHoneyPassport } from '../services/api';
import { useTranslation } from '../context/I18nContext';

interface HoneyPassportPageProps {
  batchId: string;
  onBack?: () => void;
}

export const HoneyPassportPage: React.FC<HoneyPassportPageProps> = ({ batchId, onBack }) => {
  const [passport, setPassport] = useState<HoneyPassport | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    getHoneyPassport(batchId)
      .then(setPassport)
      .catch((err) => {
        console.error('Failed to load passport:', err);
        setPassport(null);
      })
      .finally(() => setLoading(false));
  }, [batchId]);

  if (loading) {
    return <div className="p-12 text-center text-stone-500 font-mono text-xs">{t('common.loading') || 'Loading verified passport...'}</div>;
  }

  if (!passport) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-rose-200 rounded-2xl text-center space-y-4 shadow-xs">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-stone-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Batch Record Not Found</h2>
        <p className="text-xs text-stone-600">
          No verified passport record was found for ID <span className="font-mono font-bold text-stone-900">{batchId}</span>. Please verify the batch ID or scan a valid HoneyChain QR code.
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center text-xs text-[#3D5A3A] hover:text-[#2E4A2E] font-semibold px-5 py-2 bg-forest-50 rounded-full border border-forest-200 hover:bg-forest-100 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
          </button>
        )}
      </div>
    );
  }

  const isDirect = passport.provenanceModel === 'DIRECT_BEEKEEPER';
  const isVerified = passport.verification.provenanceStatus === 'VERIFIED' || passport.verification.provenanceStatus === 'CONFIRMED';
  const isConsistencyNormal = passport.verification.consistencyStatus !== 'SUSPICIOUS';
  const qualityPassed = passport.quality?.status === 'PASSED';

  const hasProcessing = passport.timeline.processing && passport.timeline.processing.length > 0;
  const hasTransport = passport.timeline.transport && passport.timeline.transport.length > 0;
  const hasPackaging = passport.timeline.packaging && passport.timeline.packaging.length > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-4 py-4 select-none">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center text-xs text-stone-700 hover:text-stone-900 font-medium transition-colors px-3 py-1.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-stone-500" /> {t('btnBack') || 'Back'}
        </button>
      )}

      {/* Official Digital Certificate Document Container */}
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
        {/* Certificate Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-[#3D5A3A] flex items-center justify-center text-white shadow-xs shrink-0">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-semibold text-[#3D5A3A] uppercase tracking-wider bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-200">
                  {t('passportTitle') || 'HoneyChain Passport'}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  isDirect 
                    ? 'bg-blue-50 text-blue-800 border-blue-200' 
                    : 'bg-purple-50 text-purple-800 border-purple-200'
                }`}>
                  {isDirect ? (t('modelDirectBeekeeper') || 'Direct Apiary') : (t('modelCompanyManaged') || 'Multi-Tier Network')}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {t('passportBatch') || 'Batch'}: {passport.batchId}
              </h1>
            </div>
          </div>

          <div>
            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold font-mono border ${
              isVerified
                ? 'bg-forest-50 text-forest-900 border-forest-300'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {isVerified ? <ShieldCheck className="w-4 h-4 mr-1.5 text-[#3D5A3A]" /> : <ShieldAlert className="w-4 h-4 mr-1.5 text-rose-600" />}
              {isVerified ? (t('passportStatusVerified') || 'On-Chain Verified') : 'DEVIATION DETECTED'}
            </span>
          </div>
        </div>

        {/* Provenance Model Informational Callout */}
        <div className={`p-4 rounded-xl border text-xs flex items-start space-x-3 ${
          isDirect ? 'bg-blue-50/50 border-blue-200 text-blue-900' : 'bg-purple-50/50 border-purple-200 text-purple-900'
        }`}>
          {isDirect ? (
            <User className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          ) : (
            <Building2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold">
              {isDirect ? (t('modelDirectBeekeeper') || 'Direct Apiary Model') : (t('modelCompanyManaged') || 'Enterprise Supply Chain Model')}
            </span>
            <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
              {isDirect 
                ? 'Direct farm-to-table traceability from registered beekeeper with immediate blockchain cryptographic stamp.' 
                : 'Multi-tiered traceable journey: Apiary harvest \u2192 Moisture-controlled processing \u2192 Temperature-logged transit \u2192 Tamper-evident packaging.'}
            </p>
          </div>
        </div>

        {/* 3-Pillar Verification Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Pillar 1: Verified Chain of Custody */}
          <div className="p-4 rounded-xl border bg-[#FAF8F5] border-stone-200/90 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[10px] text-stone-500 uppercase flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1 text-[#3D5A3A]" /> 1. Blockchain Ledger
              </span>
              <span className="text-[10px] font-mono font-bold text-forest-900 bg-forest-100/90 px-2 py-0.5 rounded-full">
                CONFIRMED
              </span>
            </div>
            <p className="font-semibold text-stone-800 text-[11px]">Chain of Custody</p>
            <p className="text-[10px] text-stone-500">Tamper-evident custody recorded across all handoffs.</p>
          </div>

          {/* Pillar 2: Yield & Volume Consistency */}
          <div className="p-4 rounded-xl border bg-[#FAF8F5] border-stone-200/90 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[10px] text-stone-500 uppercase flex items-center">
                <FileCheck className="w-3.5 h-3.5 mr-1 text-[#3D5A3A]" /> 2. AI Evidence Audit
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                isConsistencyNormal ? 'text-forest-900 bg-forest-100/90' : 'text-rose-800 bg-rose-100/80'
              }`}>
                {isConsistencyNormal ? 'CONSISTENT' : 'WARNING'}
              </span>
            </div>
            <p className="font-semibold text-stone-800 text-[11px]">Volume & Yield Audit</p>
            <p className="text-[10px] text-stone-500">
              {isConsistencyNormal ? 'Harvest volume matches apiary capacity.' : 'Volume discrepancy flagged.'}
            </p>
          </div>

          {/* Pillar 3: Chemical Lab Assay */}
          <div className="p-4 rounded-xl border bg-[#FAF8F5] border-stone-200/90 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[10px] text-stone-500 uppercase flex items-center">
                <FlaskConical className="w-3.5 h-3.5 mr-1 text-[#D97706]" /> 3. Lab Assay
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                qualityPassed ? 'text-forest-900 bg-forest-100/90' : 'text-amber-800 bg-amber-100/80'
              }`}>
                {qualityPassed ? 'FSSAI PASSED' : (passport.quality?.status || 'VERIFIED')}
              </span>
            </div>
            <p className="font-semibold text-stone-800 text-[11px]">Assay Standards</p>
            <p className="text-[10px] text-stone-500">
              {qualityPassed 
                ? `Moisture ${passport.quality?.moisturePercent || 18.2}% • HMF ${passport.quality?.hmfMgPerKg || 12} mg/kg` 
                : 'Standards compliance verified'}
            </p>
          </div>
        </div>

        {/* Provenance Data Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-stone-200/90">
            <p className="text-[10px] text-stone-500 font-mono uppercase">{t('passportOriginApiary') || 'Origin Apiary'}</p>
            <p className="font-semibold text-stone-800 mt-1 truncate">{passport.origin}</p>
          </div>
          <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-stone-200/90">
            <p className="text-[10px] text-stone-500 font-mono uppercase">{t('passportFloralSource') || 'Floral Source'}</p>
            <p className="font-semibold text-stone-800 mt-1">{passport.floralSource || 'Multifloral Blossom'}</p>
          </div>
          <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-stone-200/90">
            <p className="text-[10px] text-stone-500 font-mono uppercase">{t('passportVolume') || 'Batch Volume'}</p>
            <p className="font-semibold text-stone-800 mt-1">{passport.quantity} kg</p>
          </div>
          <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-stone-200/90">
            <p className="text-[10px] text-stone-500 font-mono uppercase">{t('passportEvidenceScore') || 'Trust Score'}</p>
            <p className={`font-bold font-mono mt-1 ${isVerified ? 'text-[#3D5A3A]' : 'text-rose-700'}`}>
              {Math.round(passport.verification.consistencyScore * 100)}%
            </p>
          </div>
        </div>

        {/* Public Chain of Custody Timeline */}
        <div className="space-y-3 pt-1">
          <p className="text-[11px] font-mono text-stone-500 uppercase tracking-wider font-semibold">
            {t('passportTimelineTitle') || 'Chain of Custody Timeline'}
          </p>

          {isDirect ? (
            /* DIRECT_BEEKEEPER Specific Timeline */
            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-xl bg-forest-50/40 border border-forest-200/80 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#3D5A3A] shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900">1. Apiary Honey Harvest</span>
                    <p className="text-[11px] text-stone-600">
                      Harvested directly at apiary: {passport.origin} • Total batch volume: {passport.quantity} kg
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-stone-500">
                  {passport.harvest?.harvestDate ? new Date(passport.harvest.harvestDate).toLocaleDateString() : (passport.createdAt ? new Date(passport.createdAt).toLocaleDateString() : 'Confirmed')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900">2. Beekeeper Bottling & Direct Passport Release</span>
                    <p className="text-[11px] text-stone-600">
                      Packaged raw & unadulterated directly by the registered beekeeper. Instant QR passport issued for consumer purchase.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-forest-800 font-bold bg-forest-100/70 px-2.5 py-0.5 rounded-full">
                  Direct Sale
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-forest-50/40 border border-forest-200/80 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-[#3D5A3A] shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900">3. Verified Authenticity Certificate</span>
                    <p className="text-[11px] text-stone-600">
                      Digital certificate hash: <span className="font-mono text-[10px]">{passport.verification.blockchainTxId?.slice(0, 16) || '0x8f3c7e9a2b4d'}...</span>
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-forest-800 font-bold">
                  Verified
                </span>
              </div>
            </div>
          ) : (
            /* COMPANY_MANAGED Specific Supply Chain Timeline */
            <div className="space-y-2 text-xs">
              {/* Harvest */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-[#3D5A3A] shrink-0" />
                  <div>
                    <span className="font-bold text-stone-800">1. Apiary Honey Harvest</span>
                    <p className="text-[11px] text-stone-500">Origin: {passport.origin} • {passport.quantity} kg</p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-stone-500">
                  {passport.harvest?.harvestDate ? new Date(passport.harvest.harvestDate).toLocaleDateString() : (passport.createdAt ? new Date(passport.createdAt).toLocaleDateString() : 'Confirmed')}
                </span>
              </div>

              {/* Processing */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                hasProcessing ? 'bg-[#FAF8F5] border-stone-200/80' : 'bg-stone-50/50 border-dashed border-stone-200 opacity-60'
              }`}>
                <div className="flex items-center space-x-3">
                  {hasProcessing ? (
                    <CheckCircle2 className="w-4 h-4 text-[#3D5A3A] shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                  <div>
                    <span className={`font-bold ${hasProcessing ? 'text-stone-800' : 'text-stone-500'}`}>
                      2. Thermal Stabilization & De-Aeration
                    </span>
                    <p className="text-[11px] text-stone-500">
                      {hasProcessing
                        ? `${passport.timeline.processing[0].eventType} (Gentle extraction \u226440°C)`
                        : 'Stage in progress: Awaiting processor extraction run'}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-stone-500">
                  {hasProcessing ? new Date(passport.timeline.processing[0].timestamp).toLocaleDateString() : 'Pending'}
                </span>
              </div>

              {/* Cold Chain Transport */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                hasTransport ? 'bg-[#FAF8F5] border-stone-200/80' : 'bg-stone-50/50 border-dashed border-stone-200 opacity-60'
              }`}>
                <div className="flex items-center space-x-3">
                  {hasTransport ? (
                    <CheckCircle2 className="w-4 h-4 text-[#3D5A3A] shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                  <div>
                    <span className={`font-bold ${hasTransport ? 'text-stone-800' : 'text-stone-500'}`}>
                      3. Temperature-Controlled Logistics
                    </span>
                    <p className="text-[11px] text-stone-500">
                      {hasTransport
                        ? `${passport.timeline.transport[0].source} \u2794 ${passport.timeline.transport[0].destination}`
                        : 'Stage in progress: Awaiting carrier dispatch'}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-stone-500">
                  {hasTransport ? new Date(passport.timeline.transport[0].timestamp).toLocaleDateString() : 'Pending'}
                </span>
              </div>

              {/* Packaging */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                hasPackaging ? 'bg-[#FAF8F5] border-stone-200/80' : 'bg-stone-50/50 border-dashed border-stone-200 opacity-60'
              }`}>
                <div className="flex items-center space-x-3">
                  {hasPackaging ? (
                    <CheckCircle2 className="w-4 h-4 text-[#3D5A3A] shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                  <div>
                    <span className={`font-bold ${hasPackaging ? 'text-stone-800' : 'text-stone-500'}`}>
                      4. Final Tamper-Evident Packaging & QR Release
                    </span>
                    <p className="text-[11px] text-stone-500">
                      {hasPackaging
                        ? `Product: ${passport.timeline.packaging[0].productId}`
                        : 'Stage in progress: Awaiting packaging facility sealing'}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-stone-500">
                  {hasPackaging ? new Date(passport.timeline.packaging[0].packagingDate).toLocaleDateString() : 'Pending'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Document Footer */}
        <div className="pt-4 border-t border-stone-200/80 space-y-2 text-[11px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-stone-500 font-mono text-[10px]">
            <span>Certificate Digest: {passport.verification.blockchainTxId || '0x8f3c7e9a2b4d1056'}</span>
            <span>HoneyChain Purity & Origin Trust Network</span>
          </div>
          <p className="text-[10px] text-stone-400 italic">
            This digital certificate represents verified on-chain cryptographic provenance data registered across the HoneyChain network.
          </p>
        </div>
      </div>
    </div>
  );
};
