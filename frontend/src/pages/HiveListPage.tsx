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
      <div>
        <h1 className="text-2xl font-bold text-stone-100 flex items-center">
          <Hexagon className="w-6 h-6 text-amber-400 mr-2" />
          Hive Intelligence & Telemetry Monitoring
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Simulated IoT sensors monitoring hive health score, disease risk, and colony productivity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hives.map((hive) => (
          <div
            key={hive.id}
            onClick={() => onSelectHive(hive.id)}
            className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-lg text-amber-400">{hive.id}</span>
              <StatusBadge status={hive.status} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-xs text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-stone-500 mr-1.5 shrink-0" />
                <span>{hive.location.address || `Lat: ${hive.location.lat}, Lng: ${hive.location.lng}`}</span>
              </div>
              <div className="flex items-center text-xs text-stone-400">
                <Activity className="w-3.5 h-3.5 text-stone-500 mr-1.5 shrink-0" />
                <span>Beekeeper: {hive.beekeeperId}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-400">AI Health Score</span>
              <span className={`font-bold ${hive.status === 'CRITICAL' ? 'text-rose-400' : hive.status === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {hive.status === 'CRITICAL' ? '35/100' : hive.status === 'WARNING' ? '68/100' : '94/100'}
              </span>
            </div>

            <button className="w-full mt-2 py-2 bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-amber-400 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition">
              <span>View Telemetry & AI Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
