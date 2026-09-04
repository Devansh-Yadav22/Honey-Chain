import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, ExternalLink } from 'lucide-react';

interface QrModalProps {
  batchId: string;
  onClose: () => void;
  onOpenPassport: (batchId: string) => void;
}

export const QrModal: React.FC<QrModalProps> = ({ batchId, onClose, onOpenPassport }) => {
  const passportUrl = `${window.location.origin}/passport/${batchId}`;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#EAE3D9] rounded-2xl p-6 max-w-sm w-full shadow-xl relative select-none">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-4">
          <div>
            <h3 className="font-bold text-base text-stone-900">Batch QR Passport</h3>
            <p className="text-xs text-stone-500 mt-0.5">Scan to inspect consumer provenance certificate</p>
          </div>

          <div className="bg-white p-4 rounded-xl inline-block border border-stone-200 shadow-sm">
            <QRCodeSVG value={passportUrl} size={160} level="H" includeMargin={false} />
          </div>

          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-mono text-xs font-bold text-amber-900">
            {batchId}
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={() => {
                onClose();
                onOpenPassport(batchId);
              }}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-sm"
            >
              <span>Inspect Passport Certificate</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-2 rounded-xl text-xs font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
