import React from 'react';
import { 
  LayoutDashboard, Hexagon, Package, QrCode, 
  Settings, Truck, FlaskConical, Shield, Feather,
  PlayCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  onTabSelect: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabSelect }) => {
  const { currentRole } = useAuth();

  const participantPortals = [
    { id: 'admin', label: 'Admin Command', icon: Shield, role: 'ADMIN' },
    { id: 'beekeeper', label: 'Beekeeper Workspace', icon: Feather, role: 'BEEKEEPER' },
    { id: 'processor', label: 'Processing Facility', icon: Settings, role: 'PROCESSOR' },
    { id: 'transporter', label: 'Logistics Fleet', icon: Truck, role: 'TRANSPORTER' },
    { id: 'packager', label: 'Packaging Hub', icon: Package, role: 'PACKAGER' },
    { id: 'quality', label: 'Quality / Lab Assay', icon: FlaskConical, role: 'QUALITY_LAB' },
  ];

  const generalViews = [
    { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
    { id: 'hives', label: 'Hive IoT Telemetry', icon: Hexagon },
    { id: 'batches', label: 'Supply Chain Batches', icon: Package },
    { id: 'passport-search', label: 'Consumer Passport', icon: QrCode },
  ];

  return (
    <aside className="w-64 border-r border-[#EAE3D9] bg-[#FAF8F5] p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] select-none shadow-xs">
      <div className="space-y-5">
        {/* Live Demo Highlighted Navigation */}
        <div>
          <button
            onClick={() => onTabSelect('live-demo')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              currentTab === 'live-demo'
                ? 'bg-amber-800 text-white shadow-sm ring-2 ring-amber-700/40'
                : 'bg-amber-100/90 text-amber-950 hover:bg-amber-200 border border-amber-300/90'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <PlayCircle className={`w-4 h-4 ${currentTab === 'live-demo' ? 'text-amber-200' : 'text-amber-800'}`} />
              <span className="tracking-tight">🎬 Live Demo</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
              currentTab === 'live-demo' ? 'bg-amber-900 text-amber-200' : 'bg-amber-200/80 text-amber-900'
            }`}>
              Interactive
            </span>
          </button>
        </div>

        {/* Participant Workspaces */}
        <div>
          <div className="px-3 text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider mb-2">
            Participant Workspaces
          </div>
          <nav className="space-y-1">
            {participantPortals.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              const isUserRole = currentRole === item.role;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                    active
                      ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300 shadow-xs'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/70'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-amber-800' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isUserRole && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Global Explorer Views */}
        <div>
          <div className="px-3 text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider mb-2">
            Supply Chain Explorer
          </div>
          <nav className="space-y-1">
            {generalViews.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabSelect(item.id)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    active
                      ? 'bg-stone-200/80 text-stone-900 font-bold'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-stone-800' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Demo Verified vs Flagged Shortcuts */}
        <div className="pt-2 border-t border-[#EAE3D9]">
          <div className="px-3 text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider mb-2">
            Verification Cases
          </div>
          <div className="space-y-1.5 text-xs">
            <button
              onClick={() => onTabSelect('batch-HC-2026-0001')}
              className="w-full text-left px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-between border border-[#EAE3D9] shadow-2xs transition"
            >
              <span className="font-mono text-xs font-semibold text-stone-900">HC-2026-0001</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold">Verified</span>
            </button>

            <button
              onClick={() => onTabSelect('batch-HC-2026-0003')}
              className="w-full text-left px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-between border border-rose-200 shadow-2xs transition"
            >
              <span className="font-mono text-xs font-semibold text-stone-900">HC-2026-0003</span>
              <span className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-1.5 py-0.2 rounded font-semibold">Mismatch</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-[11px] text-amber-950">
        <p className="font-bold text-amber-900">Core Guarantee</p>
        <p className="mt-0.5 text-amber-900/80 leading-snug">
          Fabric preserves recorded events. IsolationForest checks physical evidence consistency.
        </p>
      </div>
    </aside>
  );
};
