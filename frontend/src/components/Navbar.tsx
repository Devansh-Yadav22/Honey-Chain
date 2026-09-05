import React, { useState } from 'react';
import { Search, LogOut, LogIn, Building2, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/I18nContext';
import { LanguageSelector } from './LanguageSelector';
import { Role } from '../types';

interface NavbarProps {
  onSearchPassport?: (batchId: string) => void;
  onNavigateLogin?: () => void;
  onNavigateHome?: () => void;
  onOpenVerifyModal?: () => void;
}

const ROLE_METAS: Record<Role, { label: string; icon: string; badgeBg: string; badgeBorder: string; badgeText: string }> = {
  ADMIN: { label: 'Platform Admin', icon: '🛡️', badgeBg: 'bg-purple-50', badgeBorder: 'border-purple-200', badgeText: 'text-purple-900' },
  BEEKEEPER: { label: 'Beekeeper', icon: '🐝', badgeBg: 'bg-amber-50', badgeBorder: 'border-amber-200', badgeText: 'text-amber-900' },
  PROCESSOR: { label: 'Processor', icon: '⚙️', badgeBg: 'bg-blue-50', badgeBorder: 'border-blue-200', badgeText: 'text-blue-900' },
  TRANSPORTER: { label: 'Transporter', icon: '🚚', badgeBg: 'bg-emerald-50', badgeBorder: 'border-emerald-200', badgeText: 'text-emerald-900' },
  PACKAGER: { label: 'Packaging Hub', icon: '📦', badgeBg: 'bg-orange-50', badgeBorder: 'border-orange-200', badgeText: 'text-orange-900' },
  QUALITY_LAB: { label: 'Quality Lab', icon: '🔬', badgeBg: 'bg-teal-50', badgeBorder: 'border-teal-200', badgeText: 'text-teal-900' },
  CONSUMER: { label: 'Consumer', icon: '🍯', badgeBg: 'bg-stone-50', badgeBorder: 'border-stone-200', badgeText: 'text-stone-800' }
};

export const Navbar: React.FC<NavbarProps> = ({ 
  onSearchPassport, 
  onNavigateLogin, 
  onNavigateHome,
  onOpenVerifyModal 
}) => {
  const [inputVal, setInputVal] = useState('');
  const { currentRole, currentUser, currentOrg, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && onSearchPassport) {
      onSearchPassport(inputVal.trim());
      setInputVal('');
    }
  };

  const currentRoleMeta = ROLE_METAS[currentRole] || ROLE_METAS.ADMIN;

  return (
    <header className="h-16 border-b border-[#EAE3D9] bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 select-none shadow-xs">
      {/* Brand Identity */}
      <div 
        onClick={onNavigateHome}
        className="flex items-center space-x-3 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-full bg-amber-50 border border-[#D6C7B2] flex items-center justify-center text-amber-800 font-bold text-lg shadow-2xs group-hover:border-amber-600 transition">
          🍯
        </div>
        <div>
          <span className="font-bold text-base md:text-lg text-stone-900 tracking-tight group-hover:text-amber-800 transition">
            {t('nav.title')}
          </span>
        </div>
      </div>

      {/* Center Search & Right Controls */}
      <div className="flex items-center space-x-2.5">
        {/* Passport Quick Search */}
        <form onSubmit={handleSubmit} className="relative hidden lg:block">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3.5 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder={t('landing.enterBatchPlaceholder')}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-56 h-9 bg-[#FAF8F5] border border-[#D6C7B2] focus:border-amber-700 focus:bg-white rounded-full pl-9 pr-24 text-xs text-stone-900 placeholder-stone-400 outline-none transition"
            />
            <button
              type="submit"
              className="absolute right-1 h-7 bg-amber-700 hover:bg-amber-800 text-white px-3 rounded-full text-xs font-semibold transition shadow-2xs"
            >
              {t('common.search')}
            </button>
          </div>
        </form>

        {/* Modal Verify Button */}
        {onOpenVerifyModal && (
          <button
            onClick={onOpenVerifyModal}
            className="h-9 flex items-center space-x-1.5 px-3.5 rounded-full text-xs font-semibold bg-[#FAF8F5] text-stone-800 border border-[#D6C7B2] hover:bg-amber-50 hover:text-amber-900 hover:border-amber-400 transition"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">{t('nav.verifyHoney')}</span>
          </button>
        )}

        {/* Language Selector */}
        <LanguageSelector variant="navbar" />

        {/* Authenticated User Profile & Logout / Sign In */}
        {isAuthenticated && currentUser ? (
          <div className="flex items-center space-x-2">
            {/* User Profile Card */}
            <div className="h-9 flex items-center space-x-2 px-3 rounded-full border border-[#D6C7B2] bg-[#FAF8F5]">
              <span className="text-sm">{currentRoleMeta.icon}</span>
              <div className="text-left hidden sm:block">
                <div className="flex items-center space-x-1.5">
                  <p className="text-xs font-bold text-stone-900 leading-none">
                    {currentUser.name || currentUser.fullName || currentUser.email}
                  </p>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${currentRoleMeta.badgeBg} ${currentRoleMeta.badgeBorder} ${currentRoleMeta.badgeText}`}>
                    {currentRole}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 font-mono truncate max-w-[120px] flex items-center leading-none mt-0.5">
                  <Building2 className="w-2.5 h-2.5 mr-1 text-stone-400" />
                  {currentOrg?.name || currentUser.organizationName || 'Honey Chain Member'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Sign Out"
              className="h-9 flex items-center space-x-1.5 px-3.5 rounded-full text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t('nav.signOut')}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={onNavigateLogin}
              className="h-9 flex items-center space-x-1.5 bg-amber-700 hover:bg-amber-800 text-white px-4 rounded-full text-xs font-semibold transition shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('nav.signIn')}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
