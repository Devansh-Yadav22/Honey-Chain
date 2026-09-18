import React from 'react';
import { 
  LayoutDashboard, Hexagon, Package, QrCode, 
  Settings, Truck, FlaskConical, Shield, Feather,
  PlayCircle, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface SidebarProps {
  currentTab: string;
  onTabSelect: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabSelect }) => {
  const { currentRole, isAuthenticated } = useAuth();

  const participantPortals: Array<{ id: string; label: string; icon: any; role: Role }> = [
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
    <aside className="w-64 border-r border-stone-200/80 bg-[#FAFAF5] p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] select-none shadow-xs">
      <div className="space-y-5">
        {/* Live Demo Highlighted Navigation */}
        <div>
          <button
            onClick={() => onTabSelect('live-demo')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentTab === 'live-demo'
                ? 'bg-[#3D5A3A] text-white shadow-sm ring-2 ring-[#3D5A3A]/30'
                : 'bg-forest-100/80 text-forest-900 hover:bg-forest-200/90 border border-forest-300/80'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <PlayCircle className={`w-4 h-4 ${currentTab === 'live-demo' ? 'text-forest-200' : 'text-[#3D5A3A]'}`} />
              <span className="tracking-tight">🎬 Live Demo</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-semibold ${
              currentTab === 'live-demo' ? 'bg-[#2E4A2E] text-forest-100' : 'bg-forest-200 text-forest-900'
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
              const isUserRole = isAuthenticated && currentRole === item.role;
              const isPermitted = isAuthenticated && (currentRole === 'ADMIN' || currentRole === item.role);

              return (
                <button
                  key={item.id}
                  onClick={() => onTabSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    active
                      ? 'bg-[#3D5A3A] text-white font-bold shadow-xs'
                      : isUserRole
                      ? 'bg-white text-stone-900 font-semibold border border-forest-300 hover:bg-forest-50/50'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : isUserRole ? 'text-[#3D5A3A]' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {isUserRole ? (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                      active ? 'bg-[#2E4A2E] text-forest-100' : 'bg-forest-100 text-forest-800'
                    }`}>
                      YOUR ROLE
                    </span>
                  ) : !isPermitted ? (
                    <Lock className="w-3 h-3 text-stone-300" />
                  ) : null}
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
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    active
                      ? 'bg-[#3D5A3A] text-white font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Demo Verified vs Flagged Shortcuts */}
        <div className="pt-2 border-t border-stone-200/80">
          <div className="px-3 text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider mb-2">
            Verification Cases
          </div>
          <div className="space-y-1.5 text-xs">
            <button
              onClick={() => onTabSelect('batch-HC-2026-0001')}
              className="w-full text-left px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-between border border-stone-200 shadow-2xs transition cursor-pointer"
            >
              <span className="font-mono text-xs font-semibold text-stone-900">HC-2026-0001</span>
              <span className="text-[10px] bg-forest-50 text-forest-800 border border-forest-200 px-1.5 py-0.5 rounded-full font-semibold">Verified</span>
            </button>

            <button
              onClick={() => onTabSelect('batch-HC-2026-0003')}
              className="w-full text-left px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-between border border-rose-200 shadow-2xs transition cursor-pointer"
            >
              <span className="font-mono text-xs font-semibold text-stone-900">HC-2026-0003</span>
              <span className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-1.5 py-0.5 rounded-full font-semibold">Mismatch</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
