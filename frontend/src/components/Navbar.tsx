import React, { useState } from 'react';
import { Search, UserCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface NavbarProps {
  onSearchPassport?: (batchId: string) => void;
  onSelectRole?: (role: Role) => void;
}

const ROLE_LABELS: Record<Role, { label: string; icon: string; orgHint: string }> = {
  ADMIN: { label: 'Platform Admin', icon: '🛡️', orgHint: 'Operations HQ' },
  BEEKEEPER: { label: 'Beekeeper', icon: '🐝', orgHint: 'Himalayan Coop' },
  PROCESSOR: { label: 'Processor', icon: '⚙️', orgHint: 'Nilgiri Extraction' },
  TRANSPORTER: { label: 'Transporter', icon: '🚚', orgHint: 'Bharat Logistics' },
  PACKAGER: { label: 'Packaging Hub', icon: '📦', orgHint: 'PureFlora Packaging' },
  QUALITY_LAB: { label: 'Quality / Lab', icon: '🔬', orgHint: 'Apex NABL Labs' },
  CONSUMER: { label: 'Public Consumer', icon: '🍯', orgHint: 'QR Passport View' }
};

export const Navbar: React.FC<NavbarProps> = ({ onSearchPassport, onSelectRole }) => {
  const [inputVal, setInputVal] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const { currentRole, currentUser, currentOrg, switchRole } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && onSearchPassport) {
      onSearchPassport(inputVal.trim());
      setInputVal('');
    }
  };

  const handleRoleChange = (role: Role) => {
    switchRole(role);
    setShowRoleMenu(false);
    if (onSelectRole) onSelectRole(role);
  };

  const currentRoleMeta = ROLE_LABELS[currentRole] || ROLE_LABELS.ADMIN;

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
              Phase 2
            </span>
          </div>
        </div>
      </div>

      {/* Center Search & Right Controls */}
      <div className="flex items-center space-x-4">
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

        {/* Dynamic Persona / Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-[#EAE3D9] bg-[#FFFDF9] hover:bg-stone-50 transition shadow-xs"
          >
            <span className="text-base">{currentRoleMeta.icon}</span>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-stone-900 leading-tight flex items-center">
                {currentRoleMeta.label}
                <ChevronDown className="w-3 h-3 ml-1 text-stone-500" />
              </p>
              <p className="text-[10px] text-stone-500 font-mono truncate max-w-[130px]">
                {currentUser ? currentUser.fullName : 'Public Access'}
              </p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#EAE3D9] rounded-xl shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-[#EAE3D9] text-[10px] font-mono text-stone-500 uppercase tracking-wider font-semibold">
                Switch Participant Persona
              </div>

              {(Object.keys(ROLE_LABELS) as Role[]).map(r => {
                const item = ROLE_LABELS[r];
                const isActive = currentRole === r;
                return (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-amber-50/60 transition ${
                      isActive ? 'bg-amber-50/90 font-bold text-amber-900' : 'text-stone-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{item.icon}</span>
                      <div>
                        <p className="font-semibold text-stone-900">{item.label}</p>
                        <p className="text-[10px] text-stone-500">{item.orgHint}</p>
                      </div>
                    </div>
                    {isActive && <UserCheck className="w-4 h-4 text-amber-700" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
