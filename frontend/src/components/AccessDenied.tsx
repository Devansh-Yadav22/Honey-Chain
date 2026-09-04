import React from 'react';
import { ShieldAlert, ArrowLeft, Home, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface AccessDeniedProps {
  requiredRole?: Role | Role[] | string;
  attemptedSection?: string;
  onNavigateHome: () => void;
  onOpenPassport?: (batchId: string) => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  requiredRole,
  attemptedSection = 'this workspace',
  onNavigateHome,
  onOpenPassport
}) => {
  const { currentUser, currentRole, currentOrg } = useAuth();

  const formattedRequired = Array.isArray(requiredRole)
    ? requiredRole.join(' or ')
    : requiredRole || 'Authorized Role';

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-rose-200 rounded-2xl shadow-sm text-center">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
        <ShieldAlert className="w-7 h-7" />
      </div>

      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-2.5 py-1 rounded-md border border-rose-200">
        403 Forbidden
      </span>

      <h2 className="text-2xl font-bold text-stone-900 mt-3">
        Access Denied
      </h2>

      <p className="text-sm text-stone-600 mt-2">
        Your current authenticated account is not authorized to access <span className="font-semibold text-stone-800">{attemptedSection}</span>.
      </p>

      {/* Identity Summary Card */}
      <div className="my-6 p-4 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl text-left text-xs space-y-2">
        <div className="flex justify-between items-center py-1 border-b border-stone-200/60">
          <span className="text-stone-500">Authenticated Identity:</span>
          <span className="font-semibold text-stone-900">{currentUser?.fullName || currentUser?.name || currentUser?.email || 'Authenticated User'}</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-stone-200/60">
          <span className="text-stone-500">Assigned Role:</span>
          <span className="font-mono font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
            {currentRole}
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-stone-200/60">
          <span className="text-stone-500">Organization:</span>
          <span className="font-semibold text-stone-800">{currentOrg?.name || currentUser?.organizationName || 'Assigned Organization'}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-stone-500">Required Role:</span>
          <span className="font-mono font-semibold text-rose-800">{formattedRequired}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onNavigateHome}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>Go to Authorized Workspace</span>
        </button>

        {onOpenPassport && (
          <button
            onClick={() => onOpenPassport('HC-2026-0001')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-4 py-2.5 rounded-xl text-xs transition border border-stone-300"
          >
            <QrCode className="w-4 h-4 text-stone-600" />
            <span>Public Honey Passport</span>
          </button>
        )}
      </div>
    </div>
  );
};
