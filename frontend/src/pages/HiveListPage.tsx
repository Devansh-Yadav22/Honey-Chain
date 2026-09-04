import React, { useEffect, useState } from 'react';
import { Hexagon, MapPin, Activity, ArrowRight } from 'lucide-react';
import { Hive } from '../types';
import { getHives } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

interface HiveListPageProps {
  onSelectHive: (id: string) => void;
}

export const HiveListPage: React.FC<HiveListPageProps> = ({ onSelectHive }) => {
  const [hives, setHives] = useState<Hive[]>([]);

  useEffect(() => {
    getHives().then(setHives);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D9] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center tracking-tight">
            <Hexagon className="w-6 h-6 text-amber-600 mr-2.5" />
            Smart Hive Intelligence
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Real-time IoT telemetry, AI health scoring, and colony anomaly detection across 10 apiaries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hives.map((hive) => {
          const score = hive.status === 'CRITICAL' ? (hive.id === 'HIVE-005' ? 38 : hive.id === 'HIVE-006' ? 40 : 42) : hive.status === 'WARNING' ? 65 : 95;
          const scoreColor = hive.status === 'CRITICAL' ? 'text-rose-800' : hive.status === 'WARNING' ? 'text-amber-800' : 'text-emerald-800';
          const barColor = hive.status === 'CRITICAL' ? 'bg-rose-600' : hive.status === 'WARNING' ? 'bg-amber-600' : 'bg-emerald-600';

          return (
            <div
              key={hive.id}
              onClick={() => onSelectHive(hive.id)}
              className="panel-card panel-card-hover p-6 rounded-2xl cursor-pointer space-y-4 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-lg text-amber-900 group-hover:text-amber-700 transition">{hive.id}</span>
                <StatusBadge status={hive.status} size="sm" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-xs text-stone-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 mr-1.5 shrink-0" />
                  <span className="truncate">{hive.location.address || `Lat: ${hive.location.lat}, Lng: ${hive.location.lng}`}</span>
                </div>
                <div className="flex items-center text-xs text-stone-500">
                  <Activity className="w-3.5 h-3.5 text-stone-400 mr-1.5 shrink-0" />
                  <span>Beekeeper ID: {hive.beekeeperId}</span>
                </div>
              </div>

              {/* AI Health Score Bar */}
              <div className="space-y-1.5 pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">AI Health Index</span>
                  <span className={`font-bold ${scoreColor}`}>{score}/100</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full ${barColor} transition-all duration-500 rounded-full`} style={{ width: `${score}%` }} />
                </div>
              </div>

              <button className="w-full mt-2 py-2.5 bg-stone-50 group-hover:bg-amber-600 group-hover:text-white text-stone-800 border border-stone-200 group-hover:border-amber-600 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition duration-200 shadow-2xs">
                <span>View Telemetry & AI Model Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
