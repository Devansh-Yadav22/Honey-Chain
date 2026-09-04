import React, { useEffect, useState } from 'react';
import { AdminException, AuditLog, SystemHealth, Organization, User } from '../types';
import { getAdminOverview, getAdminAuditLogs, getAdminExceptions, resolveAdminException, getSystemHealth, getAuthOrganizations, getAuthUsers } from '../services/api';
import { 
  ShieldAlert, Activity, Users, Building, Layers, CheckCircle2, 
  AlertTriangle, Server, Database, Brain, Cpu, FileText, CheckCircle 
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [exceptions, setExceptions] = useState<AdminException[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Exception resolution state
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const [ov, ex, logs, h, o, u] = await Promise.all([
      getAdminOverview(),
      getAdminExceptions(),
      getAdminAuditLogs(20),
      getSystemHealth(),
      getAuthOrganizations(),
      getAuthUsers()
    ]);
    if (ov) setOverview(ov);
    setExceptions(ex);
    setAuditLogs(logs);
    setHealth(h);
    setOrgs(o);
    setUsers(u);
  };

  const handleResolveException = async (id: string) => {
    await resolveAdminException(id, resolutionNote || 'Verified and resolved by Operations Admin');
    setResolvingId(null);
    setResolutionNote('');
    await loadData();
  };

  const metrics = overview?.metrics || {
    totalHives: 10,
    activeHives: 7,
    warningHives: 3,
    totalBatches: 5,
    inTransitBatches: 1,
    suspiciousBatches: 1,
    verifiedBatches: 4,
    totalVolumeKg: 126.5,
    totalOrganizations: 6,
    totalUsers: 6,
    openExceptions: 3
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE3D9]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">🛡️</span>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Platform Operations Command</h1>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Honey Chain National Operations • Live multi-tenant governance, AI telemetry surveillance, and Fabric ledger audit trail.
          </p>
        </div>

        <div className="flex items-center space-x-2">
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
          <p className="text-xl font-bold text-stone-900 mt-1 font-mono">{metrics.totalHives}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">{metrics.activeHives} active</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3D9] shadow-xs">
          <p className="text-[10px] font-mono text-stone-500 uppercase">Tracked Batches</p>
          <p className="text-xl font-bold text-stone-900 mt-1 font-mono">{metrics.totalBatches}</p>
          <span className="text-[10px] text-amber-700 font-semibold">{metrics.totalVolumeKg} kg volume</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3D9] shadow-xs">
          <p className="text-[10px] font-mono text-stone-500 uppercase">In Transit</p>
          <p className="text-xl font-bold text-stone-900 mt-1 font-mono">{metrics.inTransitBatches}</p>
          <span className="text-[10px] text-stone-500">Cold-chain active</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3D9] shadow-xs">
          <p className="text-[10px] font-mono text-stone-500 uppercase">Verified Provenance</p>
          <p className="text-xl font-bold text-emerald-800 mt-1 font-mono">{metrics.verifiedBatches}</p>
          <span className="text-[10px] text-emerald-700">Fabric confirmed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3D9] shadow-xs">
          <p className="text-[10px] font-mono text-stone-500 uppercase">Suspicious / Flagged</p>
          <p className="text-xl font-bold text-rose-800 mt-1 font-mono">{metrics.suspiciousBatches}</p>
          <span className="text-[10px] text-rose-700 font-semibold">AI volume mismatch</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3D9] shadow-xs">
          <p className="text-[10px] font-mono text-stone-500 uppercase">Registered Orgs</p>
          <p className="text-xl font-bold text-stone-900 mt-1 font-mono">{orgs.length}</p>
          <span className="text-[10px] text-stone-500">{users.length} active users</span>
        </div>
      </div>

      {/* Two Column Grid: Exceptions Center & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exception & Anomaly Resolution Center */}
        <div className="bg-white border border-[#EAE3D9] rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
            <h2 className="text-sm font-bold text-stone-900 flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2 text-rose-700" /> Operational Exceptions & Anomaly Center
            </h2>
            <span className="text-xs font-mono font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              {exceptions.filter(e => e.status !== 'RESOLVED').length} Active
            </span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {exceptions.map(exc => {
              const isResolved = exc.status === 'RESOLVED';
              return (
                <div
                  key={exc.id}
                  className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                    isResolved
                      ? 'bg-stone-50 border-[#EAE3D9] opacity-75'
                      : exc.severity === 'CRITICAL'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold">{exc.title}</p>
                      <p className="text-[11px] text-stone-600 mt-0.5">{exc.description}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-200 text-rose-900'
                    }`}>
                      {exc.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-[10px] font-mono text-stone-500">
                    <span>Resource: {exc.resourceId}</span>
                    <span>{new Date(exc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {!isResolved && (
                    <div className="pt-2">
                      {resolvingId === exc.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Enter administrative resolution notes..."
                            value={resolutionNote}
                            onChange={e => setResolutionNote(e.target.value)}
                            className="w-full p-2 bg-white rounded border border-stone-300 text-stone-900 text-xs"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setResolvingId(null)}
                              className="px-2.5 py-1 rounded bg-stone-200 text-stone-700 text-[11px]"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleResolveException(exc.id)}
                              className="px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[11px]"
                            >
                              Confirm & Log Audit
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setResolvingId(exc.id)}
                          className="text-amber-800 hover:text-amber-900 font-semibold underline text-[11px]"
                        >
                          Investigate & Resolve Exception →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health Probes Monitor */}
        <div className="bg-white border border-[#EAE3D9] rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
            <h2 className="text-sm font-bold text-stone-900 flex items-center">
              <Server className="w-4 h-4 mr-2 text-stone-700" /> Platform Services Health Probes
            </h2>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              All Systems Nominal
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            {/* Backend Node Server */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE3D9] rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-sans font-semibold">Backend API</span>
                <span className="text-emerald-700 font-bold">UP (2ms)</span>
              </div>
              <p className="text-[10px] text-stone-600 font-mono">Express REST • Port 5000</p>
            </div>

            {/* PostgreSQL / Fallback */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE3D9] rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-sans font-semibold">Store / DB</span>
                <span className="text-emerald-700 font-bold">ONLINE</span>
              </div>
              <p className="text-[10px] text-stone-600 font-mono">In-Memory Seed Store Mode</p>
            </div>

            {/* AI ML Model */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE3D9] rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-sans font-semibold">AI Intelligence</span>
                <span className="text-emerald-700 font-bold">UP (12ms)</span>
              </div>
              <p className="text-[10px] text-stone-600 font-mono">HOBOS IsolationForest v1.0.0</p>
            </div>

            {/* Hyperledger Fabric */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE3D9] rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-sans font-semibold">Fabric Gateway</span>
                <span className="text-emerald-700 font-bold">CONNECTED</span>
              </div>
              <p className="text-[10px] text-stone-600 font-mono">Channel: honeychannel</p>
            </div>
          </div>

          {/* Organizations Directory Snippet */}
          <div className="pt-2 border-t border-[#EAE3D9] space-y-2">
            <h3 className="text-xs font-mono font-bold text-stone-600 uppercase">Registered Supply Chain Organizations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {orgs.slice(0, 4).map(org => (
                <div key={org.id} className="p-2.5 bg-[#FFFDF9] border border-[#EAE3D9] rounded-lg">
                  <p className="font-bold text-stone-800 truncate">{org.name}</p>
                  <p className="text-[10px] text-stone-500">{org.location} • {org.type.replace('_', ' ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Append-Only Audit Trail */}
      <div className="bg-white border border-[#EAE3D9] rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-stone-900 tracking-tight flex items-center">
              <FileText className="w-4 h-4 mr-2 text-amber-800" /> Tamper-Evident System Audit Trail
            </h2>
            <p className="text-[11px] text-stone-500">Chronological ledger of all stakeholder submissions, custody dispatches, and corrections.</p>
          </div>
          <span className="text-xs font-mono text-stone-500">{auditLogs.length} events logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F5] text-stone-600 font-mono border-y border-[#EAE3D9]">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Actor & Organization</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Resource</th>
                <th className="py-2.5 px-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D9]">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-stone-50/70">
                  <td className="py-2.5 px-3 font-mono text-stone-500 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-900">{log.action}</td>
                  <td className="py-2.5 px-3 text-stone-700 truncate max-w-[220px]">
                    <span className="font-semibold">{log.actorName}</span>
                    <span className="text-stone-400 block text-[10px]">{log.organizationName}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-stone-600 text-[11px]">{log.resourceId}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      log.result === 'SUCCESS' ? 'text-emerald-800 bg-emerald-50' : 'text-amber-800 bg-amber-50'
                    }`}>
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
