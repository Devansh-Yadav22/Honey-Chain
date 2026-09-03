import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const upper = status.toUpperCase();

  const getStyle = () => {
    switch (upper) {
      case 'ACTIVE':
      case 'VERIFIED':
      case 'NORMAL':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30';
      case 'WARNING':
      case 'MEDIUM':
        return 'bg-amber-950/60 text-amber-400 border-amber-500/30';
      case 'CRITICAL':
      case 'SUSPICIOUS':
      case 'HIGH':
        return 'bg-rose-950/60 text-rose-400 border-rose-500/30';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  const getIcon = () => {
    switch (upper) {
      case 'ACTIVE':
      case 'NORMAL':
        return <CheckCircle className="w-3.5 h-3.5 mr-1" />;
      case 'VERIFIED':
        return <ShieldCheck className="w-3.5 h-3.5 mr-1" />;
      case 'WARNING':
        return <AlertTriangle className="w-3.5 h-3.5 mr-1" />;
      case 'CRITICAL':
      case 'SUSPICIOUS':
        return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
      default:
        return <Clock className="w-3.5 h-3.5 mr-1" />;
    }
  };

  return (
    <span className={`inline-flex items-center font-medium border rounded-full px-2.5 py-0.5 text-xs ${getStyle()}`}>
      {getIcon()}
      {upper}
    </span>
  );
};
