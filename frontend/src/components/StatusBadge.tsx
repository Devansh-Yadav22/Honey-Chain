import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertCircle, Clock, Truck, Package, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  type?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-xs font-semibold',
  }[size];

  switch (status?.toUpperCase()) {
    case 'ACTIVE':
    case 'NORMAL':
      return (
        <span className={`inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-medium ${sizeClasses}`}>
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>Active</span>
        </span>
      );

    case 'WARNING':
      return (
        <span className={`inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-medium ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Warning</span>
        </span>
      );

    case 'CRITICAL':
      return (
        <span className={`inline-flex items-center space-x-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-full font-medium ${sizeClasses}`}>
          <AlertCircle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
          <span>Critical Alert</span>
        </span>
      );

    case 'VERIFIED':
    case 'CONFIRMED':
      return (
        <span className={`inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-full font-bold shadow-xs ${sizeClasses}`}>
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>On-Chain Verified</span>
        </span>
      );

    case 'SUSPICIOUS':
      return (
        <span className={`inline-flex items-center space-x-1.5 bg-rose-100/80 text-rose-950 border border-rose-300 rounded-full font-bold shadow-xs ${sizeClasses}`}>
          <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />
          <span>Flagged Inconsistent</span>
        </span>
      );

    case 'HARVESTED':
      return (
        <span className={`inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-medium ${sizeClasses}`}>
          <span>🌾 Harvested</span>
        </span>
      );

    case 'RECEIVED_FOR_PROCESSING':
    case 'PROCESSING':
      return (
        <span className={`inline-flex items-center space-x-1.5 bg-sky-50 text-sky-800 border border-sky-200 rounded-full font-medium ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-sky-700 shrink-0" />
          <span>{status === 'RECEIVED_FOR_PROCESSING' ? 'Intake Received' : 'Processing'}</span>
        </span>
      );

    case 'READY_FOR_TRANSPORT':
      return (
        <span className={`inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-medium ${sizeClasses}`}>
          <span>Ready for Transit</span>
        </span>
      );

    case 'IN_TRANSIT':
    case 'TRANSPORT':
      return (
        <span className={`inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-full font-medium ${sizeClasses}`}>
          <Truck className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
          <span>In Transit</span>
        </span>
      );

    case 'RECEIVED':
      return (
        <span className={`inline-flex items-center space-x-1.5 bg-teal-50 text-teal-800 border border-teal-200 rounded-full font-medium ${sizeClasses}`}>
          <span>Delivered</span>
        </span>
      );

    case 'PACKAGED':
      return (
        <span className={`inline-flex items-center space-x-1.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-full font-medium ${sizeClasses}`}>
          <Package className="w-3.5 h-3.5 text-purple-700 shrink-0" />
          <span>Packaged</span>
        </span>
      );

    case 'PUBLISHED':
      return (
        <span className={`inline-flex items-center space-x-1.5 bg-amber-100 text-amber-950 border border-amber-300 rounded-full font-bold shadow-xs ${sizeClasses}`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Passport Published</span>
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center space-x-1 bg-stone-100 text-stone-700 border border-stone-200 rounded-full font-medium ${sizeClasses}`}>
          <span>{status || 'Unknown'}</span>
        </span>
      );
  }
};
