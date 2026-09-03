import React from 'react';
import { Hexagon, Flower2, Filter, Truck, PackageCheck, CheckCircle, ShieldAlert } from 'lucide-react';
import { Batch } from '../types/index.js';

interface TimelineProps {
  batch: Batch;
}

export const Timeline: React.FC<TimelineProps> = ({ batch }) => {
  const steps = [
    {
      id: 'hive',
      label: 'Hive Intelligence',
      date: batch.harvest?.harvestDate ? new Date(batch.harvest.harvestDate).toLocaleDateString() : 'Recorded',
      details: `Hive ${batch.harvest?.hiveId || 'HIVE-001'} telemetry verified`,
      icon: Hexagon,
      status: 'completed',
    },
    {
      id: 'harvest',
      label: 'Honey Harvest',
      date: batch.harvest?.harvestDate ? new Date(batch.harvest.harvestDate).toLocaleDateString() : 'Recorded',
      details: `${batch.harvest?.quantity || batch.quantity} kg harvested at ${batch.origin}`,
      icon: Flower2,
      status: 'completed',
    },
    {
      id: 'processing',
      label: 'Processing & Moisture Control',
      date: batch.processingEvents?.[0]?.timestamp ? new Date(batch.processingEvents[0].timestamp).toLocaleDateString() : 'Recorded',
      details: batch.processingEvents?.[0]?.eventType || 'Moisture extraction & cold filtering',
      icon: Filter,
      status: batch.processingEvents?.length ? 'completed' : 'active',
    },
    {
      id: 'transport',
      label: 'Chain of Custody Transport',
      date: batch.transportEvents?.[0]?.timestamp ? new Date(batch.transportEvents[0].timestamp).toLocaleDateString() : 'Recorded',
      details: batch.transportEvents?.[0] ? `${batch.transportEvents[0].source} ➔ ${batch.transportEvents[0].destination}` : 'Transport in transit',
      icon: Truck,
      status: batch.transportEvents?.length ? 'completed' : 'active',
    },
    {
      id: 'packaging',
      label: 'Bottling & QR Labeling',
      date: batch.packagingEvents?.[0]?.packagingDate ? new Date(batch.packagingEvents[0].packagingDate).toLocaleDateString() : 'Recorded',
      details: batch.packagingEvents?.[0] ? `Packaged by ${batch.packagingEvents[0].packagerId}` : 'Packaging logged',
      icon: PackageCheck,
      status: batch.packagingEvents?.length ? 'completed' : 'active',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative pl-6 border-l-2 border-amber-500/20 space-y-8">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="relative group">
              <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-stone-900 border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/20">
                <Icon className="w-3 h-3" />
              </div>

              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-stone-100">{step.label}</h4>
                  <span className="text-[11px] text-stone-400 font-mono">{step.date}</span>
                </div>
                <p className="text-xs text-stone-400 mt-1">{step.details}</p>

                <div className="mt-2 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" /> On-Chain Recorded
                  </span>
                  <span className="text-stone-500 font-mono">Block #1042</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {batch.status === 'SUSPICIOUS' && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-400">Provenance Inconsistency Detected</p>
            <p className="mt-1 text-stone-300">
              The recorded harvest volume ({batch.harvest?.quantity || 18} kg) conflicts with the observed batch volume ({batch.quantity} kg).
              This discrepancy was flagged by the AI Evidence Engine.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
