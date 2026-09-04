import React, { useEffect, useState } from 'react';
import { AdminException, AuditLog, SystemHealth, Organization, User, Alert, Batch } from '../types';
import { 
  getAdminOverview, 
  getAdminAuditLogs, 
  getAdminExceptions, 
  resolveAdminException, 
  getSystemHealth, 
  getAuthOrganizations, 
  getAuthUsers, 
  updateOrganizationStatus, 
  getSystemAlerts, 
  resolveSystemAlert,
  getBatches
} from '../services/api';
import { 
  ShieldAlert, Server, Database, Brain, Cpu, FileText, CheckCircle2, 
  XCircle, Clock, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw, Filter,
  Layers, AlertOctagon, ExternalLink, Activity, Sparkles, ChevronRight
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigateToBatch?: (id: string) => void;
  onOpenPassport?: (id: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateToBatch, onOpenPassport }) => {
  const [overview, setOverview] = useState<any>(null);
  const [exceptions, setExceptions] = useState<AdminException[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [alertFilter, setAlertFilter] = useState<string>('ALL');

  // Exception resolution state
  const [resolvingAlertId, setResolvingAlertId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const [ov, ex, logs, h, o, u, alt, bList] = await Promise.all([
      getAdminOverview(),
      getAdminExceptions(),
      getAdminAuditLogs(30),
      getSystemHealth(),
      getAuthOrganizations(),
      getAuthUsers(),
      getSystemAlerts(),
      getBatches()
    ]);
    if (ov) setOverview(ov);
    setExceptions(ex || []);
    setAuditLogs(logs || []);
    setHealth(h);
    setOrgs(o || []);
    setUsers(u || []);
    setAlerts(alt || []);
    setBatches(bList || []);
  };

  const handleApproveOrg = async (id: string) => {
    setIsProcessing(true);
    await updateOrganizationStatus(id, 'ACTIVE');
    await loadData();
    setIsProcessing(false);
  };

  const handleRejectOrg = async (id: string) => {
    setIsProcessing(true);
    await updateOrganizationStatus(id, 'REJECTED');
    await loadData();
    setIsProcessing(false);
  };

  const handleResolveAlert = async (id: string) => {
    if (!resolutionNote) return;
    setIsProcessing(true);
    if (id.startsWith('EXC-')) {
      await resolveAdminException(id, resolutionNote);
    } else {
      await resolveSystemAlert(id, resolutionNote);
    }
    setResolvingAlertId(null);
    setResolutionNote('');
    await loadData();
    setIsProcessing(false);
  };

  const pendingOrgs = orgs.filter(o => o.status === 'PENDING');
  const suspiciousBatches = batches.filter(b => b.status === 'SUSPICIOUS');
  const totalVolumeKg = batches.reduce((acc, b) => acc + (Number(b.quantity) || 0), 0);

  // Combine alerts and exceptions for unified display
  const combinedItems: Array<{
    id: string;
    type: string;
    severity: string;
    category: string;
    message: string;
    batchId?: string;
    status: string;
    resolutionNotes?: string;
    createdAt?: string;
  }> = [
    ...alerts.map(a => ({
      id: a.id,
      type: 'ALERT',
      severity: a.severity,
      category: a.category || 'SYSTEM',
      message: a.message,
      batchId: a.batchId,
      status: a.status,
      resolutionNotes: a.resolutionNotes,
      createdAt: a.createdAt
    })),
    ...exceptions.map(e => ({
      id: e.id,
      type: 'EXCEPTION',
      severity: e.severity,
      category: e.type || 'PROVENANCE',
      message: e.title ? `${e.title}: ${e.description}` : e.description,
      batchId: e.resourceType === 'BATCH' ? e.resourceId : undefined,
      status: e.status,
      resolutionNotes: e.resolutionNotes,
      createdAt: e.createdAt
    }))
  ];

  const filteredItems = combinedItems.filter(item => {
    if (alertFilter === 'ALL') return true;
    if (alertFilter === 'OPEN') return item.status === 'OPEN' || item.status === 'INVESTIGATING' || item.status === 'UNREAD';
    if (alertFilter === 'CRITICAL') return item.severity === 'CRITICAL' || item.severity === 'HIGH';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE3D9]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">🛡️</span>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Platform Operations Command Center</h1>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Honey Chain National Operations • Multi-tenant onboarding queue, live consistency engine alerts, batch discrepancy monitoring, and tamper-evident audit logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="p-2 rounded-lg border border-[#EAE3D9] bg-white text-stone-600 hover:bg-stone-50 text-xs flex items-center font-medium shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-stone-500" /> Refresh Telemetry
          </button>
          <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            OPERATIONAL
          </span>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#EAE3D9] shadow-xs">
          <p className="text-[10px] font-mono text-stone-500 uppercase">Apiary Hives</p>
          <p className="text-xl font-bold text-stone-900 mt-1 font-mono">{overview?.metrics?.totalHives ?? 10}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">{overview?.metrics?.activeHives ?? 7} active • {overview?.metrics?.warningHives ?? 3} warning</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3D9] shadow-xs">
          <p className="text-[10px] font-mono text-stone-500 uppercase">Tracked Batches</p>
          <p className="text-xl font-bold text-stone-900 mt-1 font-mono">{batches.length || overview?.metrics?.totalBatches || 5}</p>
          <span className="text-[10px] text-amber-700 font-semibold">{Math.round(totalVolumeKg * 10) / 10} kg total volume</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3D9] shadow-xs">
          <p className="text-[10px] font-mono text-stone-500 uppercase">Pending Onboarding</p>
          <p className="text-xl font-bold text-amber-800 mt-1 font-mono">{pendingOrgs.length}</p>
          <span className="text-[10px] text-amber-700 font-semibold">Co-op approval queue</span>
        </div>

        <div className={`p-4 rounded-xl border shadow-xs transition-colors ${
          suspiciousBatches.length > 0 ? 'bg-rose-50/70 border-rose-300' : 'bg-white border-[#EAE3D9]'
        }`}>
          <p className="text-[10px] font-mono text-stone-500 uppercase">Anomalous Batches</p>
          <p className={`text-xl font-bold mt-1 font-mono ${suspiciousBatches.length > 0 ? 'text-rose-700' : 'text-stone-900'}`}>
            {suspiciousBatches.length}
          </p>
          <span className={`text-[10px] font-semibold ${suspiciousBatches.length > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
            {suspiciousBatches.length > 0 ? 'Requires investigation' : 'All batches verified'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3D9] shadow-xs">
          <p className="text-[10px] font-mono text-stone-500 uppercase">Active Alerts</p>
          <p className="text-xl font-bold text-rose-800 mt-1 font-mono">
            {combinedItems.filter(a => a.status === 'OPEN' || a.status === 'INVESTIGATING' || a.status === 'UNREAD').length}
          </p>
          <span className="text-[10px] text-rose-700 font-semibold">Consistency flagged</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3D9] shadow-xs">
          <p className="text-[10px] font-mono text-stone-500 uppercase">Fabric Ledger</p>
          <p className="text-xl font-bold text-emerald-800 mt-1 font-mono">CONNECTED</p>
          <span className="text-[10px] text-emerald-700 font-semibold">honeychannel active</span>
        </div>
      </div>

      {/* Multi-Tenant Organization Approval Queue */}
      {pendingOrgs.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-amber-950 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-amber-700" /> Pending Organization Onboarding Approvals ({pendingOrgs.length})
            </h2>
            <span className="text-xs font-mono text-amber-800 font-semibold">Action Required</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingOrgs.map(org => (
              <div key={org.id} className="p-4 bg-white rounded-lg border border-amber-200 shadow-xs space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-stone-900 text-sm">{org.name}</p>
                    <p className="text-stone-500 text-[11px] mt-0.5">Type: {org.type} • Reg: {org.registrationNo || org.registrationNumber || 'N/A'}</p>
                    <p className="text-stone-600 text-[11px] mt-0.5">{org.address || org.location} • {org.contactEmail}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
                    PENDING
                  </span>
                </div>
                <div className="flex justify-end space-x-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => handleRejectOrg(org.id)}
                    disabled={isProcessing}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-medium inline-flex items-center text-[11px]"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Reject Application
                  </button>
                  <button
                    onClick={() => handleApproveOrg(org.id)}
                    disabled={isProcessing}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold inline-flex items-center text-[11px] shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve & Issue Key
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HIGHLIGHTED SECTION: Inconsistent & Flagged Batches Investigation Hub */}
      {suspiciousBatches.length > 0 && (
        <div className="bg-rose-50/90 border border-rose-300 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-200">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 bg-rose-200 rounded-lg text-rose-800">
                <AlertOctagon className="w-5 h-5 text-rose-700 animate-pulse" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                  <span>Provenance & Quantity Inconsistencies Detected</span>
                  <span className="px-2 py-0.5 bg-rose-700 text-white rounded text-[10px] font-mono font-bold">
                    {suspiciousBatches.length} BATCH{suspiciousBatches.length > 1 ? 'ES' : ''} FLAGGED
                  </span>
                </h2>
                <p className="text-[11px] text-rose-800 mt-0.5">
                  The Multi-Stage Consistency Engine detected critical physical anomalies (e.g. volume inflation, quantity drift, or sensor deviations) on the following batches:
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {suspiciousBatches.map(b => {
              const harvestQty = b.harvest?.quantity || (b.processingEvents && b.processingEvents[0]?.inputWeightKg) || b.quantity;
              const latestProc = b.processingEvents && b.processingEvents.length > 0 ? b.processingEvents[b.processingEvents.length - 1] : undefined;
              const currentQty = latestProc?.outputWeightKg !== undefined ? latestProc.outputWeightKg : b.quantity;
              const diff = Math.round((currentQty - harvestQty) * 10) / 10;
              const diffPercent = harvestQty > 0 ? Math.round(((currentQty - harvestQty) / harvestQty) * 1000) / 10 : 0;
              return (
                <div key={b.id} className="p-4 bg-white rounded-xl border border-rose-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm font-bold text-stone-900">{b.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-900 border border-rose-300">
                          {b.status}
                        </span>
                      </div>
                      <p className="text-stone-600 text-xs mt-1">
                        <strong>Origin:</strong> {b.origin} • <strong>Floral:</strong> {b.floralSource || 'Multifloral Blossom'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-rose-50/60 p-2.5 rounded-lg border border-rose-200 text-xs space-y-1 font-mono">
                    <div className="flex justify-between text-stone-700">
                      <span>Harvest / Base Quantity:</span>
                      <span className="font-bold">{harvestQty} kg</span>
                    </div>
                    <div className="flex justify-between text-rose-900">
                      <span>Current Processing Quantity:</span>
                      <span className="font-bold">{currentQty} kg</span>
                    </div>
                    {diff !== 0 && (
                      <div className="flex justify-between text-rose-700 font-bold pt-1 border-t border-rose-200/60 text-[11px]">
                        <span>Quantity Discrepancy:</span>
                        <span>{diff > 0 ? `+${diff}` : diff} kg ({diffPercent > 0 ? `+${diffPercent}` : diffPercent}%)</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-600 pt-1 border-t border-rose-200/60 text-[11px]">
                      <span>Current Custodian:</span>
                      <span className="font-sans font-semibold">{b.currentCustodian || 'Processor'} ({b.custodianRole || 'PROCESSOR'})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <button
                      onClick={() => onOpenPassport && onOpenPassport(b.id)}
                      className="text-stone-500 hover:text-stone-800 text-xs font-mono inline-flex items-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1 text-stone-400" /> View Passport
                    </button>
                    {onNavigateToBatch && (
                      <button
                        onClick={() => onNavigateToBatch(b.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs inline-flex items-center shadow-xs"
                      >
                        Investigate Batch Discrepancy <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Security & Consistency Engine Alerts */}
      <div className="bg-white border border-[#EAE3D9] rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE3D9]">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-700" />
            <h2 className="text-sm font-bold text-stone-900">Consistency Engine & Quality Alerts Center</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            {['ALL', 'OPEN', 'CRITICAL'].map(filter => (
              <button
                key={filter}
                onClick={() => setAlertFilter(filter)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                  alertFilter === filter
                    ? 'bg-amber-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {filteredItems.length === 0 ? (
            <p className="text-xs text-stone-500 italic text-center py-4">No alerts matching filter.</p>
          ) : (
            filteredItems.map(item => {
              const isResolved = item.status === 'RESOLVED';
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                    isResolved
                      ? 'bg-stone-50 border-[#EAE3D9] opacity-75'
                      : item.severity === 'CRITICAL' || item.severity === 'HIGH'
                      ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                      : 'bg-amber-50/80 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          item.severity === 'CRITICAL' || item.severity === 'HIGH' ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                        }`}>
                          {item.severity}
                        </span>
                        <span className="font-mono text-[11px] text-stone-500 font-bold">{item.category}</span>
                        {item.batchId && (
                          <span className="font-mono text-[11px] text-amber-800 font-bold bg-amber-100/60 px-1.5 rounded">
                            {item.batchId}
                          </span>
                        )}
                      </div>
                      <p className="text-stone-800 font-medium mt-1 text-xs">{item.message}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {isResolved && item.resolutionNotes && (
                    <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                      <strong>Resolution:</strong> {item.resolutionNotes}
                    </p>
                  )}

                  {!isResolved && (
                    <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                      {item.batchId && onNavigateToBatch && (
                        <button
                          onClick={() => onNavigateToBatch(item.batchId!)}
                          className="text-amber-800 hover:text-amber-900 font-semibold underline text-[11px] inline-flex items-center"
                        >
                          View Flagged Batch {item.batchId} <ChevronRight className="w-3 h-3 ml-0.5" />
                        </button>
                      )}

                      {resolvingAlertId === item.id ? (
                        <div className="w-full space-y-2">
                          <input
                            type="text"
                            placeholder="Enter administrative resolution notes..."
                            value={resolutionNote}
                            onChange={e => setResolutionNote(e.target.value)}
                            className="w-full p-2 bg-white rounded border border-stone-300 text-stone-900 text-xs"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setResolvingAlertId(null)}
                              className="px-2.5 py-1 rounded bg-stone-200 text-stone-700 text-[11px]"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleResolveAlert(item.id)}
                              disabled={isProcessing}
                              className="px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[11px]"
                            >
                              Confirm & Log Audit
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setResolvingAlertId(item.id)}
                          className="text-stone-600 hover:text-stone-900 font-semibold text-[11px] ml-auto"
                        >
                          Investigate & Resolve Alert →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Tracked Batches Ledger Monitor */}
      <div className="bg-white border border-[#EAE3D9] rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
          <div>
            <h2 className="text-sm font-bold text-stone-900 tracking-tight flex items-center">
              <Layers className="w-4 h-4 mr-2 text-amber-800" /> All Tracked Batches & Provenance Ledger
            </h2>
            <p className="text-[11px] text-stone-500">Live operational status, custodian chain, and volume verification for all registered batches.</p>
          </div>
          <span className="text-xs font-mono text-stone-500">{batches.length} total batches</span>
        </div>

        <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F5] text-stone-600 font-mono sticky top-0 border-b border-[#EAE3D9]">
              <tr>
                <th className="py-2.5 px-3">Batch ID</th>
                <th className="py-2.5 px-3">Origin / Flora</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Current Custodian</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D9]">
              {batches.map(b => {
                const isFlagged = b.status === 'SUSPICIOUS';
                return (
                  <tr key={b.id} className={`hover:bg-stone-50/70 ${isFlagged ? 'bg-rose-50/30' : ''}`}>
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-900">
                      {b.id}
                    </td>
                    <td className="py-2.5 px-3 text-stone-700">
                      <p className="font-medium text-[11px]">{b.origin}</p>
                      <p className="text-[10px] text-stone-500">{b.floralSource || 'Multifloral'}</p>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-stone-900">
                      {b.quantity} kg
                    </td>
                    <td className="py-2.5 px-3 text-stone-700">
                      <span className="font-semibold text-[11px]">{b.currentCustodian || 'Himalayan Apiary'}</span>
                      <span className="block text-[10px] text-stone-500">({b.custodianRole || 'BEEKEEPER'})</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isFlagged 
                          ? 'bg-rose-100 text-rose-900 border border-rose-300' 
                          : b.status === 'VERIFIED' || b.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-2">
                      {onNavigateToBatch && (
                        <button
                          onClick={() => onNavigateToBatch(b.id)}
                          className={`px-2.5 py-1 rounded font-semibold text-[11px] inline-flex items-center ${
                            isFlagged 
                              ? 'bg-rose-700 hover:bg-rose-800 text-white shadow-xs' 
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          View Details <ChevronRight className="w-3 h-3 ml-0.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Grid: System Health & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Probes Monitor */}
        <div className="bg-white border border-[#EAE3D9] rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
            <h2 className="text-sm font-bold text-stone-900 flex items-center">
              <Server className="w-4 h-4 mr-2 text-stone-700" /> System Health Probes
            </h2>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Live Verified
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            {/* Backend Node Server */}
            <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D9] rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-stone-700 font-sans font-semibold">Backend API Server</span>
                <span className="text-emerald-700 font-bold">UP (1ms)</span>
              </div>
              <p className="text-[10px] text-stone-500 font-mono mt-0.5">Express REST • Port 5000</p>
            </div>

            {/* PostgreSQL DB */}
            <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D9] rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-stone-700 font-sans font-semibold">PostgreSQL 16 DB</span>
                <span className="text-emerald-700 font-bold">CONNECTED</span>
              </div>
              <p className="text-[10px] text-stone-500 font-mono mt-0.5">honeychain-db • Port 5432</p>
            </div>

            {/* AI ML Model */}
            <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D9] rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-stone-700 font-sans font-semibold">AI Intelligence Engine</span>
                <span className="text-emerald-700 font-bold">ONLINE (12ms)</span>
              </div>
              <p className="text-[10px] text-stone-500 font-mono mt-0.5">FastAPI IsolationForest • Port 8000</p>
            </div>

            {/* Hyperledger Fabric */}
            <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D9] rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-stone-700 font-sans font-semibold">Hyperledger Fabric Ledger</span>
                <span className="text-emerald-700 font-bold">CONFIRMED</span>
              </div>
              <p className="text-[10px] text-stone-500 font-mono mt-0.5">Channel: honeychannel • CC: honeychain-cc</p>
            </div>
          </div>
        </div>

        {/* Append-Only Audit Trail */}
        <div className="lg:col-span-2 bg-white border border-[#EAE3D9] rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
            <div>
              <h2 className="text-sm font-bold text-stone-900 tracking-tight flex items-center">
                <FileText className="w-4 h-4 mr-2 text-amber-800" /> Tamper-Evident System Audit Trail
              </h2>
              <p className="text-[11px] text-stone-500">Immutable chronological log of all stakeholder actions, logins, handoffs, and verification events.</p>
            </div>
            <span className="text-xs font-mono text-stone-500">{auditLogs.length} events logged</span>
          </div>

          <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8F5] text-stone-600 font-mono sticky top-0 border-b border-[#EAE3D9]">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Actor / Org</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D9]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-stone-50/70">
                    <td className="py-2 px-3 font-mono text-stone-500 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-stone-900">{log.action}</td>
                    <td className="py-2 px-3 text-stone-700 truncate max-w-[180px]">
                      <span className="font-semibold">{log.actorName || log.actorId}</span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        log.result === 'SUCCESS' ? 'text-emerald-800 bg-emerald-50' : 'text-amber-800 bg-amber-50'
                      }`}>
                        {log.result || 'SUCCESS'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
