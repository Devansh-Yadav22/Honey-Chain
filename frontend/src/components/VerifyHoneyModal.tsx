import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Search, X, Camera, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from '../context/I18nContext';

interface VerifyHoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (batchId: string) => void;
  onVerifyBatch?: (batchId: string) => void;
}

export const VerifyHoneyModal: React.FC<VerifyHoneyModalProps> = ({ isOpen, onClose, onVerify, onVerifyBatch }) => {
  const triggerVerify = (id: string) => {
    if (onVerify) onVerify(id);
    if (onVerifyBatch) onVerifyBatch(id);
  };
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('manual');
  const [batchIdInput, setBatchIdInput] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'scan') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device access is not supported by your browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      setCameraError(err.message || 'Unable to access camera. Please enter your Batch ID manually below.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (batchIdInput.trim()) {
      triggerVerify(batchIdInput.trim().toUpperCase());
      onClose();
    }
  };

  const handleSelectPreset = (id: string) => {
    setBatchIdInput(id);
    triggerVerify(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#EAE3D9] rounded-md shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#EAE3D9] bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-sm bg-amber-100 border border-amber-300 flex items-center justify-center text-lg">
              🍯
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">{t('verifyModalTitle')}</h3>
              <p className="text-xs text-stone-500">{t('verifyModalSubtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-sm hover:bg-stone-200 flex items-center justify-center text-stone-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-[#EAE3D9] px-5 pt-3 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'manual'
                ? 'border-amber-700 text-amber-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            {t('manualEntryTab')}
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'scan'
                ? 'border-amber-700 text-amber-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            {t('scanQrTab')}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {activeTab === 'scan' ? (
            <div className="space-y-4 text-center">
              {cameraError ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-900 space-y-2 text-left">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" /> Camera Notice
                  </div>
                  <p className="text-[11px] text-stone-600">{cameraError}</p>
                  <button
                    onClick={() => setActiveTab('manual')}
                    className="mt-2 inline-flex items-center text-amber-800 font-bold underline"
                  >
                    Switch to Manual Entry <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              ) : (
                <div className="relative rounded-sm overflow-hidden bg-black aspect-video flex items-center justify-center border border-stone-800 shadow-inner">
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                  <div className="absolute inset-0 border-2 border-dashed border-amber-400/70 m-8 rounded-sm pointer-events-none flex items-center justify-center">
                    <div className="w-12 h-0.5 bg-amber-400 animate-pulse" />
                  </div>
                </div>
              )}
              <p className="text-xs text-stone-500">{t('scanQrPrompt')}</p>
              <p className="text-[10px] text-stone-400">{t('cameraPermissionNote')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {t('passportBatch')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={batchIdInput}
                    onChange={(e) => setBatchIdInput(e.target.value)}
                    placeholder={t('manualInputPlaceholder')}
                    className="w-full bg-[#FAF8F5] border border-[#EAE3D9] rounded-sm px-4 py-2.5 text-sm font-mono text-stone-900 placeholder-stone-400 outline-none focus:border-amber-600 focus:bg-white transition"
                  />
                  <QrCode className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-2.5 rounded-sm text-xs transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                {t('btnSubmit')}
              </button>
            </form>
          )}

          {/* Preset Demo Pills */}
          <div className="pt-4 border-t border-[#EAE3D9] space-y-2">
            <p className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">Quick Verification Samples</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => handleSelectPreset('HC-2026-0001')}
                className="px-2.5 py-1.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-medium transition"
              >
                ✓ {t('tryVerifiedPreset')}
              </button>
              <button
                onClick={() => handleSelectPreset('HC-2026-0010')}
                className="px-2.5 py-1.5 rounded-sm bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 font-medium transition"
              >
                🐝 {t('tryDirectPreset')}
              </button>
              <button
                onClick={() => handleSelectPreset('HC-2026-0003')}
                className="px-2.5 py-1.5 rounded-sm bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 font-medium transition"
              >
                ⚠ {t('trySuspiciousPreset')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
