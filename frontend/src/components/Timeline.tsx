import React from 'react';
import { Hexagon, Flower2, Filter, Truck, PackageCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Batch } from '../types/index.js';

interface TimelineProps {
  batch: Batch;
}

export const Timeline: React.FC<TimelineProps> = ({ batch }) => {
  const steps = [
    {
      id: 'hive',
      label: 'Hive Intelligence',
      date: batch.harvest?.harvestDate ? new Date(batch.harvest.harvestDate).toLocaleDateString() : 'Aug 20, 2026',
      details: `Hive ${batch.harvest?.hiveId || 'HIVE-001'} telemetry & health score verified`,
      icon: Hexagon,
    },
    {
      id: 'harvest',
      label: 'Honey Harvest',
      date: batch.harvest?.harvestDate ? new Date(batch.harvest.harvestDate).toLocaleDateString() : 'Aug 20, 2026',
      details: `${batch.harvest?.quantity || batch.quantity} kg harvested at ${batch.origin}`,
      icon: Flower2,
    },
    {
      id: 'processing',
      label: 'Processing & Moisture Control',
      date: batch.processingEvents?.[0]?.timestamp ? new Date(batch.processingEvents[0].timestamp).toLocaleDateString() : 'Aug 21, 2026',
      details: batch.processingEvents?.[0]?.eventType || 'Moisture extraction & cold filtering',
      icon: Filter,
    },
    {
      id: 'transport',
      label: 'Chain of Custody Transport',
      date: batch.transportEvents?.[0]?.timestamp ? new Date(batch.transportEvents[0].timestamp).toLocaleDateString() : 'Aug 21, 2026',
      details: batch.transportEvents?.[0] ? `${batch.transportEvents[0].source} ➔ ${batch.transportEvents[0].destination}` : 'Transport in transit',
      icon: Truck,
    },
    {
      id: 'packaging',
      label: 'Bottling & QR Labeling',
      date: batch.packagingEvents?.[0]?.packagingDate ? new Date(batch.packagingEvents[0].packagingDate).toLocaleDateString() : 'Aug 22, 2026',
      details: batch.packagingEvents?.[0] ? `Packaged by ${batch.packagingEvents[0].packagerId}` : 'Packaging logged',
      icon: PackageCheck,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative pl-7 border-l-2 border-amber-200 space-y-5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="relative group">
              <div className="absolute -left-[39px] top-1.5 w-8 h-8 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center text-amber-700 shadow-sm ring-4 ring-[#FAF8F5]">
                <Icon className="w-4 h-4" />
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm hover:border-amber-400/60 transition duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-900">{step.label}</h4>
                  <span className="text-xs text-stone-500 font-mono">{step.date}</span>
                </div>
                <p className="text-xs text-stone-600 mt-1 font-medium">{step.details}</p>

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-semibold flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Fabric Ledger Recorded
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">Block #{1040 + idx}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {batch.status === 'SUSPICIOUS' && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start space-x-3 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-800 text-sm">Provenance Quantity Discrepancy Flagged</p>
            <p className="mt-1 text-rose-900/80 leading-relaxed font-medium">
              The recorded harvest volume (18.0 kg) conflicts with the observed batch volume (31.0 kg). This discrepancy was automatically flagged by the AI Evidence Engine.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
