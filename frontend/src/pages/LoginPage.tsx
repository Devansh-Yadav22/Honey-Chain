import React, { useState, useEffect } from 'react';
import { 
  Lock, Mail, ArrowRight, AlertCircle, 
  CheckCircle2, QrCode, Sparkles, KeyRound, User, Building2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/I18nContext';
import { Role, ProvenanceModel } from '../types';

interface LoginPageProps {
  onSuccessRedirect?: (role: Role) => void;
  onOpenPublicPassport?: () => void;
}

const DEMO_PRESETS = [
  { role: 'ADMIN' as Role, email: 'admin@honeychain.demo', label: 'Platform Admin', org: 'National Authority' },
  { role: 'BEEKEEPER' as Role, email: 'beekeeper@honeychain.demo', label: 'Beekeeper', org: 'Himalayan Apiary' },
  { role: 'PROCESSOR' as Role, email: 'processor@honeychain.demo', label: 'Processor', org: 'NectarPure Facility' },
  { role: 'TRANSPORTER' as Role, email: 'transporter@honeychain.demo', label: 'Transporter', org: 'ColdRoute Logistics' },
  { role: 'PACKAGER' as Role, email: 'packager@honeychain.demo', label: 'Packaging Hub', org: 'EcoPack Plant' },
  { role: 'QUALITY_LAB' as Role, email: 'lab@honeychain.demo', label: 'Quality Lab', org: 'Apex Certified Lab' },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccessRedirect, onOpenPublicPassport }) => {
  const { login, resetPassword, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  
  const [provenanceModel, setProvenanceModel] = useState<ProvenanceModel>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('honeychain_active_provenance_model') as ProvenanceModel;
      if (stored === 'DIRECT_BEEKEEPER' || stored === 'COMPANY_MANAGED') return stored;
    }
    return 'DIRECT_BEEKEEPER';
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<{ loading: boolean; error?: string; success?: string } | null>(null);

  const handleSelectModel = (model: ProvenanceModel) => {
    setProvenanceModel(model);
    if (typeof window !== 'undefined') {
      localStorage.setItem('honeychain_active_provenance_model', model);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        setSuccessMsg('Authentication successful. Directing to workspace...');
        if (onSuccessRedirect && res.user) {
          onSuccessRedirect(res.user.role);
        }
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (presetEmail: string, role: Role) => {
    setEmail(presetEmail);
    setPassword('HoneyChain@2026!');
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await login(presetEmail, 'HoneyChain@2026!');
      if (res.success && onSuccessRedirect) {
        onSuccessRedirect(role);
      } else if (!res.success) {
        setErrorMsg(res.error || 'Demo login failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetStatus({ loading: false, error: 'Please enter your account email address.' });
      return;
    }

    setResetStatus({ loading: true });
    try {
      const res = await resetPassword(resetEmail.trim());
      if (res.success) {
        setResetStatus({
          loading: false,
          success: `Password reset email sent to ${resetEmail}. Please check your inbox.`
        });
      } else {
        setResetStatus({
          loading: false,
          error: res.error || 'Failed to send password reset email.'
        });
      }
    } catch (err: any) {
      setResetStatus({
        loading: false,
        error: err.message || 'Error initiating password reset.'
      });
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-10 px-4">
      <div className="w-full max-w-lg bg-white border border-[#EAE3D9] rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-11 h-11 mx-auto rounded-full bg-amber-50 border border-[#D6C7B2] flex items-center justify-center text-amber-800 font-bold text-2xl shadow-2xs">
            🍯
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Honey Chain Operations Portal
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Authorized Partner Access & Supply Chain Verification
          </p>
        </div>

        {/* 1. Provenance Architecture Selector on Login Page */}
        <div className="p-4 bg-[#FAF8F5] border border-[#D6C7B2] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700">
              Select Supply Chain Pathway
            </span>
            <span className="text-[10px] text-amber-800 font-mono font-semibold bg-amber-100/70 px-2 py-0.5 rounded-full">
              Standard Config
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Direct Beekeeper Model */}
            <div
              onClick={() => handleSelectModel('DIRECT_BEEKEEPER')}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                provenanceModel === 'DIRECT_BEEKEEPER'
                  ? 'bg-blue-50/90 border-blue-500 ring-1 ring-blue-500'
                  : 'bg-white border-[#D6C7B2] hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="font-bold text-stone-900">{t('modelDirectBeekeeper')}</span>
              </div>
              <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                Direct consumer purchase from registered beekeeper with immediate QR passport.
              </p>
            </div>

            {/* Company Managed Model */}
            <div
              onClick={() => handleSelectModel('COMPANY_MANAGED')}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                provenanceModel === 'COMPANY_MANAGED'
                  ? 'bg-purple-50/90 border-purple-500 ring-1 ring-purple-500'
                  : 'bg-white border-[#D6C7B2] hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-purple-700 shrink-0" />
                <span className="font-bold text-stone-900">{t('modelCompanyManaged')}</span>
              </div>
              <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                Multi-tier enterprise supply chain: Apiary → Processing → Logistics → Lab → Packaging.
              </p>
            </div>
          </div>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@honeychain.demo"
                className="w-full bg-[#FAF8F5] border border-[#D6C7B2] focus:border-amber-700 focus:bg-white rounded-full pl-9 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-stone-700">Password</label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setResetStatus(null);
                  setShowForgotModal(true);
                }}
                className="text-[11px] font-medium text-amber-800 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#FAF8F5] border border-[#D6C7B2] focus:border-amber-700 focus:bg-white rounded-full pl-9 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || authLoading}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 rounded-full text-xs transition shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {submitting ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Fill Presets */}
        <div className="pt-4 border-t border-[#EAE3D9] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-700" />
              Authorized Partner Demo Logins
            </span>
            <span className="text-[10px] text-stone-400 font-mono">Role Access</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left">
            {DEMO_PRESETS.map((p) => (
              <button
                key={p.role}
                type="button"
                onClick={() => handleQuickLogin(p.email, p.role)}
                disabled={submitting}
                className="p-2.5 bg-[#FAF8F5] hover:bg-amber-50 border border-[#D6C7B2] hover:border-amber-500 rounded-xl transition text-left group"
              >
                <p className="text-[11px] font-bold text-stone-900 group-hover:text-amber-900">
                  {p.label}
                </p>
                <p className="text-[10px] text-stone-500 truncate">{p.email}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Public Honey Passport Direct Access */}
        {onOpenPublicPassport && (
          <div className="pt-3 text-center border-t border-stone-100">
            <button
              type="button"
              onClick={onOpenPublicPassport}
              className="inline-flex items-center space-x-1.5 text-xs text-stone-600 hover:text-amber-800 font-medium transition"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-700" />
              <span>Looking to verify a jar? <strong>Inspect Public Honey Passport</strong></span>
            </button>
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md border border-[#EAE3D9] shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center space-x-2 text-amber-800">
              <KeyRound className="w-5 h-5" />
              <h3 className="font-bold text-base text-stone-900">Reset Password</h3>
            </div>
            <p className="text-xs text-stone-600">
              Enter your account email. We will send a Firebase password reset link to your inbox.
            </p>

            {resetStatus?.error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] rounded-sm">
                {resetStatus.error}
              </div>
            )}

            {resetStatus?.success && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-sm">
                {resetStatus.success}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name@honeychain.demo"
                className="w-full bg-[#FAF8F5] border border-[#D6C7B2] focus:border-amber-700 focus:bg-white rounded-sm px-3 py-2 text-xs outline-none"
              />

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 rounded-sm text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetStatus?.loading}
                  className="px-4 py-1.5 rounded-sm text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white disabled:opacity-50"
                >
                  {resetStatus?.loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

