import React, { useState } from 'react';
import { Search, LogOut, Shield, LogIn, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface NavbarProps {
  onSearchPassport?: (batchId: string) => void;
  onNavigateLogin?: () => void;
}

const ROLE_METAS: Record<Role, { label: string; icon: string; badgeBg: string; badgeBorder: string; badgeText: string }> = {
  ADMIN: { label: 'Platform Admin', icon: '🛡️', badgeBg: 'bg-purple-100/80', badgeBorder: 'border-purple-200', badgeText: 'text-purple-900' },
  BEEKEEPER: { label: 'Beekeeper', icon: '🐝', badgeBg: 'bg-amber-100/80', badgeBorder: 'border-amber-200', badgeText: 'text-amber-900' },
  PROCESSOR: { label: 'Processor', icon: '⚙️', badgeBg: 'bg-blue-100/80', badgeBorder: 'border-blue-200', badgeText: 'text-blue-900' },
  TRANSPORTER: { label: 'Transporter', icon: '🚚', badgeBg: 'bg-emerald-100/80', badgeBorder: 'border-emerald-200', badgeText: 'text-emerald-900' },
  PACKAGER: { label: 'Packaging Hub', icon: '📦', badgeBg: 'bg-orange-100/80', badgeBorder: 'border-orange-200', badgeText: 'text-orange-900' },
  QUALITY_LAB: { label: 'Quality Lab', icon: '🔬', badgeBg: 'bg-teal-100/80', badgeBorder: 'border-teal-200', badgeText: 'text-teal-900' },
  CONSUMER: { label: 'Consumer', icon: '🍯', badgeBg: 'bg-stone-100', badgeBorder: 'border-stone-200', badgeText: 'text-stone-800' }
};

export const Navbar: React.FC<NavbarProps> = ({ onSearchPassport, onNavigateLogin }) => {
  const [inputVal, setInputVal] = useState('');
  const { currentRole, currentUser, currentOrg, isAuthenticated, logout } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && onSearchPassport) {
      onSearchPassport(inputVal.trim());
      setInputVal('');
    }
  };

  const currentRoleMeta = ROLE_METAS[currentRole] || ROLE_METAS.ADMIN;

  return (
    <header className="h-16 border-b border-[#EAE3D9] bg-white/95 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 select-none shadow-xs">
      {/* Brand Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-lg shadow-xs">
          🍯
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-stone-900 tracking-tight">Honey Chain</span>
            <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md border border-amber-200">
              Verified Network
            </span>
          </div>
        </div>
      </div>

      {/* Center Search & Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Passport Quick Search */}
        <form onSubmit={handleSubmit} className="relative hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3.5 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Verify Batch ID (e.g. HC-2026-0001)..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-64 bg-[#FAF8F5] border border-[#EAE3D9] focus:border-amber-600 focus:bg-white rounded-xl pl-9 pr-20 py-2 text-xs text-stone-800 placeholder-stone-400 outline-none transition shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded-lg text-xs font-semibold transition shadow-xs"
            >
              Verify
            </button>
          </div>
        </form>

        {/* Authenticated User Profile & Logout / Sign In */}
        {isAuthenticated && currentUser ? (
          <div className="flex items-center space-x-3">
            {/* User Profile Card */}
            <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl border border-[#EAE3D9] bg-[#FFFDF9] shadow-xs">
              <span className="text-base">{currentRoleMeta.icon}</span>
              <div className="text-left hidden sm:block">
                <div className="flex items-center space-x-1.5">
                  <p className="text-xs font-bold text-stone-900 leading-tight">
                    {currentUser.name || currentUser.fullName || currentUser.email}
                  </p>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${currentRoleMeta.badgeBg} ${currentRoleMeta.badgeBorder} ${currentRoleMeta.badgeText}`}>
                    {currentRole}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 font-mono truncate max-w-[160px] flex items-center mt-0.5">
                  <Building2 className="w-2.5 h-2.5 mr-1 text-stone-400" />
                  {currentOrg?.name || currentUser.organizationName || 'Honey Chain Member'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Sign Out"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={onNavigateLogin}
              className="flex items-center space-x-1.5 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
