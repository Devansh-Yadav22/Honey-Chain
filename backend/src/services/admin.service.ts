import { store } from './store';
import { AdminException, AuditLog, SystemHealth } from '../types';

export const adminService = {
  getOverview() {
    const hives = store.getHives();
    const batches = store.getBatches();
    const orgs = store.getOrganizations();
    const users = store.getUsers();
    const exceptions = store.getExceptions();

    const activeHives = hives.filter(h => h.status === 'ACTIVE').length;
    const warningHives = hives.filter(h => h.status === 'WARNING' || h.status === 'CRITICAL').length;
    const inTransitBatches = batches.filter(b => b.status === 'IN_TRANSIT').length;
    const suspiciousBatches = batches.filter(b => b.status === 'SUSPICIOUS').length;
    const verifiedBatches = batches.filter(b => b.status === 'VERIFIED' || b.status === 'PUBLISHED').length;
    const totalVolumeKg = batches.reduce((acc, b) => acc + b.quantity, 0);

    return {
      metrics: {
        totalHives: hives.length,
        activeHives,
        warningHives,
        totalBatches: batches.length,
        inTransitBatches,
        suspiciousBatches,
        verifiedBatches,
        totalVolumeKg: Math.round(totalVolumeKg * 10) / 10,
        totalOrganizations: orgs.length,
        totalUsers: users.length,
        openExceptions: exceptions.filter(e => e.status === 'OPEN').length
      },
      recentActivity: store.getAuditLogs(10)
    };
  },

  getAuditLogs(limit?: number): AuditLog[] {
    return store.getAuditLogs(limit);
  },

  getExceptions(): AdminException[] {
    return store.getExceptions();
  },

  resolveException(id: string, notes: string, resolvedBy: string): AdminException | undefined {
    const updated = store.updateException(id, 'RESOLVED', notes, resolvedBy);
    if (updated) {
      store.addAuditLog({
        actorId: 'USR-ADMIN-01',
        actorName: resolvedBy,
        role: 'ADMIN',
        organizationId: 'ORG-ADMIN',
        organizationName: 'Honey Chain Central Operations',
        action: 'ADMIN_CORRECTION',
        resourceType: updated.resourceType,
        resourceId: updated.resourceId,
        result: 'SUCCESS',
        details: { exceptionId: id, notes }
      });
    }
    return updated;
  },

  getSystemHealth(): SystemHealth {
    return store.getSystemHealth();
  }
};
