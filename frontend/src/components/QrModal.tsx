import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, ExternalLink, ShieldCheck, Download } from 'lucide-react';

interface QrModalProps {
  batchId: string;
  onClose: () => void;
  onOpenPassport: (batchId: string) => void;
}

export const QrModal: React.FC<QrModalProps> = ({ batchId, onClose, onOpenPassport }) => {
  const passportUrl = `${window.location.origin}/p/${batchId}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-amber-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-stone-100">Honey Passport QR</h3>
            <p className="text-xs text-stone-400">Scan QR code to access consumer verification page</p>
          </div>

          <div className="bg-white p-4 rounded-xl inline-block shadow-inner">
            <QRCodeSVG value={passportUrl} size={180} level="H" includeMargin={true} />
          </div>

          <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800 font-mono text-xs text-amber-400">
            {batchId}
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={() => onOpenPassport(batchId)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold py-2 rounded-xl text-xs flex items-center justify-center space-x-2 transition"
            >
              <span>View Honey Passport</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="w-full bg-stone-800 hover:bg-stone-700 text-stone-300 py-2 rounded-xl text-xs transition"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
