import React from 'react';
import { LayoutDashboard, Hexagon, Package, QrCode, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabSelect: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabSelect }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hives', label: 'Hive Intelligence', icon: Hexagon },
    { id: 'batches', label: 'Honey Batches', icon: Package },
    { id: 'passport-search', label: 'Honey Passport QR', icon: QrCode },
  ];

  return (
    <aside className="w-64 border-r border-amber-500/10 bg-stone-950 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <h3 className="px-3 text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
            Main Platform
          </h3>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabSelect(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    active
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Demo Mode Preset Quick Links */}
        <div className="pt-4 border-t border-stone-900">
          <h3 className="px-3 text-[11px] font-semibold text-amber-500/80 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Demo Scenarios</span>
            <span className="text-[9px] bg-amber-500/20 px-1 rounded">Quick</span>
          </h3>
          <div className="space-y-1 text-xs">
            <button
              onClick={() => onTabSelect('batch-HC-2026-0001')}
              className="w-full text-left px-3 py-2 rounded-lg bg-stone-900/60 hover:bg-stone-900 text-stone-300 flex items-center justify-between group"
            >
              <span>Batch HC-2026-0001</span>
              <span className="text-[10px] text-emerald-400 group-hover:underline">Verified</span>
            </button>
            <button
              onClick={() => onTabSelect('batch-HC-2026-0003')}
              className="w-full text-left px-3 py-2 rounded-lg bg-stone-900/60 hover:bg-stone-900 text-stone-300 flex items-center justify-between group"
            >
              <span>Batch HC-2026-0003</span>
              <span className="text-[10px] text-rose-400 font-bold group-hover:underline flex items-center">
                <ShieldAlert className="w-3 h-3 mr-0.5 inline" /> Suspicious
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
        <p className="text-xs text-amber-400 font-medium">Core Architecture USP</p>
        <p className="text-[11px] text-stone-400 mt-1 leading-snug">
          Blockchain preserves recorded data. AI checks consistency against evidence.
        </p>
      </div>
    </aside>
  );
};
