import React from 'react';
import { ShieldCheck, Cpu, Database, Activity } from 'lucide-react';

interface NavbarProps {
  onSearchPassport?: (batchId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchPassport }) => {
  const [inputVal, setInputVal] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && onSearchPassport) {
      onSearchPassport(inputVal.trim());
      setInputVal('');
    }
  };

  return (
    <header className="h-16 border-b border-amber-500/20 bg-stone-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <span className="text-xl">🐝</span>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-amber-400 tracking-tight">Honey Chain</span>
            <span className="text-[10px] uppercase tracking-widest bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">
              SIH26021
            </span>
          </div>
          <p className="text-xs text-stone-400">Bee-Tech • Blockchain Traceability & Hive Intelligence</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Passport Quick Search */}
        <form onSubmit={handleSubmit} className="relative hidden md:block">
          <input
            type="text"
            placeholder="Verify Batch ID (e.g. HC-2026-0001)..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-72 bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 outline-none transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-stone-950 px-2 py-0.5 rounded text-xs transition"
          >
            Verify
          </button>
        </form>

        {/* System Health Indicators */}
        <div className="hidden lg:flex items-center space-x-3 text-xs border-l border-stone-800 pl-4 text-stone-400">
          <span className="flex items-center space-x-1">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fabric Ledger</span>
          </span>
          <span className="flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Engine</span>
          </span>
          <span className="flex items-center space-x-1">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>IoT Live</span>
          </span>
        </div>
      </div>
    </header>
  );
};
