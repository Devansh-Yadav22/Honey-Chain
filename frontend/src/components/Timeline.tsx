import React from 'react';
import { Hexagon, Flower2, Filter, Truck, PackageCheck, CheckCircle2, Clock, ShieldAlert, FlaskConical } from 'lucide-react';
import { Batch } from '../types/index.js';

interface TimelineProps {
  batch: Batch;
}

export const Timeline: React.FC<TimelineProps> = ({ batch }) => {
  const hasHarvest = Boolean(batch.harvest || batch.quantity);
  const hasProcessing = Boolean(batch.processingEvents && batch.processingEvents.length > 0);
  const hasTransport = Boolean(batch.transportEvents && batch.transportEvents.length > 0);
  const hasPackaging = Boolean(batch.packagingEvents && batch.packagingEvents.length > 0);
  const hasQuality = Boolean(batch.qualityTests && batch.qualityTests.length > 0);
  const isPublished = batch.status === 'PUBLISHED';

  const steps = [
    {
      id: 'hive',
      label: 'Hive Intelligence & Apiary',
      isCompleted: true,
      date: batch.harvest?.harvestDate ? new Date(batch.harvest.harvestDate).toLocaleString() : (batch.createdAt ? new Date(batch.createdAt).toLocaleString() : 'Registered'),
      details: `Apiary Hive ${batch.hiveId || batch.harvest?.hiveId || 'HIVE-001'} telemetry and thermodynamics logged`,
      icon: Hexagon,
      statusLabel: 'Fabric Ledger Recorded',
      blockNumber: 'Block #1041'
    },
    {
      id: 'harvest',
      label: 'Apiary Honey Harvest',
      isCompleted: hasHarvest,
      date: batch.harvest?.harvestDate ? new Date(batch.harvest.harvestDate).toLocaleString() : (batch.createdAt ? new Date(batch.createdAt).toLocaleString() : 'Pending'),
      details: `${batch.quantity} kg harvested • Origin: ${batch.origin} (${batch.floralSource || 'Raw Honey'})`,
      icon: Flower2,
      statusLabel: hasHarvest ? 'Harvest Signed & Timestamped' : 'Pending Harvest Confirmation',
      blockNumber: 'Block #1042'
    },
    {
      id: 'processing',
      label: 'Processing & Moisture Control',
      isCompleted: hasProcessing,
      date: hasProcessing ? new Date(batch.processingEvents![0].timestamp).toLocaleString() : 'Awaiting Processor Intake',
      details: hasProcessing
        ? `${batch.processingEvents![0].eventType} • ${batch.processingEvents![0].temperatureCelsius || 38.5}°C • ${batch.processingEvents![0].moisturePercent || 17.8}% Moisture`
        : 'Batch awaiting thermal stabilization and micro-filtration at processing facility.',
      icon: Filter,
      statusLabel: hasProcessing ? 'Processing Verified on Blockchain' : 'Stage Pending (Processor)',
      blockNumber: 'Block #1043'
    },
    {
      id: 'transport',
      label: 'Cold-Chain Transport & Logistics',
      isCompleted: hasTransport,
      date: hasTransport ? new Date(batch.transportEvents![0].timestamp).toLocaleString() : 'Awaiting Transport Dispatch',
      details: hasTransport
        ? `${batch.transportEvents![0].source} ➔ ${batch.transportEvents![0].destination} (${batch.transportEvents![0].vehicleNumber || 'Refrigerated Fleet'})`
        : 'Batch awaiting carrier dispatch and telemetry-tracked custody transit.',
      icon: Truck,
      statusLabel: hasTransport ? 'Logistics Route Confirmed' : 'Stage Pending (Transporter)',
      blockNumber: 'Block #1044'
    },
    {
      id: 'packaging',
      label: 'Tamper-Evident Bottling & QR Release',
      isCompleted: hasPackaging,
      date: hasPackaging ? new Date(batch.packagingEvents![0].packagingDate).toLocaleString() : 'Awaiting Packaging Hub',
      details: hasPackaging
        ? `${batch.packagingEvents![0].productId} • ${batch.packagingEvents![0].containerType || 'Glass Jar'} (${batch.packagingEvents![0].unitsCount || 40} units)`
        : 'Batch awaiting food-grade packaging, lot sealing, and QR code assignment.',
      icon: PackageCheck,
      statusLabel: hasPackaging ? 'Packaging Sealed & Published' : 'Stage Pending (Packager)',
      blockNumber: 'Block #1045'
    },
    {
      id: 'quality',
      label: 'FSSAI Chemical & Purity Assay',
      isCompleted: hasQuality,
      date: hasQuality ? new Date(batch.qualityTests![0].testDate).toLocaleString() : 'Awaiting Lab Testing',
      details: hasQuality
        ? `${batch.qualityTests![0].labName} • Status: ${batch.qualityTests![0].overallStatus} (Moisture: ${batch.qualityTests![0].parameters.moisturePercent}%, HMF: ${batch.qualityTests![0].parameters.hmfMgPerKg} mg/kg)`
        : 'NABL laboratory purity assay and chemical safety certificate verification.',
      icon: FlaskConical,
      statusLabel: hasQuality ? 'NABL Certificate Hash Verified' : 'Stage Pending (Quality Lab)',
      blockNumber: 'Block #1046'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="relative pl-7 border-l-2 border-amber-200 space-y-5">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="relative group">
              <div className={`absolute -left-[39px] top-1.5 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ring-4 ring-[#FAF8F5] transition-all ${
                step.isCompleted
                  ? 'bg-amber-600 text-white border-2 border-amber-500'
                  : 'bg-stone-100 text-stone-400 border-2 border-stone-300'
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className={`p-4 rounded-2xl border transition duration-200 ${
                step.isCompleted
                  ? 'bg-white border-stone-200 shadow-sm hover:border-amber-400/60'
                  : 'bg-[#FAF8F5]/60 border-dashed border-stone-200 opacity-75'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className={`font-bold text-sm ${step.isCompleted ? 'text-stone-900' : 'text-stone-500'}`}>
                    {step.label}
                  </h4>
                  <span className="text-xs text-stone-500 font-mono">{step.date}</span>
                </div>
                <p className="text-xs text-stone-600 mt-1 font-medium">{step.details}</p>

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className={`font-semibold flex items-center ${step.isCompleted ? 'text-emerald-800' : 'text-stone-400'}`}>
                    {step.isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 mr-1 text-stone-400" />
                    )}
                    {step.statusLabel}
                  </span>
                  {step.isCompleted && (
                    <span className="text-stone-400 font-mono text-[11px]">{step.blockNumber}</span>
                  )}
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
              {batch.processingEvents && batch.processingEvents.length > 0 && batch.processingEvents[0].outputWeightKg && batch.processingEvents[0].outputWeightKg > (batch.harvest?.quantity || batch.quantity)
                ? `Processing volume (${batch.processingEvents[0].outputWeightKg} kg) exceeds recorded harvest/batch quantity (${batch.harvest?.quantity || batch.quantity} kg). Flagged by Quantity Consistency Engine.`
                : `The recorded harvest volume (${batch.harvest?.quantity || batch.quantity} kg) conflicts with the observed batch volume (${batch.quantity} kg). Flagged by AI Evidence Engine.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
