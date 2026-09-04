import { pool } from '../config/database';
import { Alert } from '../types';

const memoryAlerts: Alert[] = [];

export class AlertService {
  static async createAlert(
    batchId: string | null,
    severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'WARNING' | 'CRITICAL',
    category: 'QUANTITY_DRIFT' | 'GEO_MISMATCH' | 'TIME_ANOMALY' | 'AI_ANOMALY' | 'UNVERIFIED_HANDOFF' | 'UNAUTHORIZED_ROLE' | string,
    message: string,
    details: any = {}
  ): Promise<Alert> {
    const id = `ALT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newAlert: Alert = {
      id,
      batchId: batchId || undefined,
      severity,
      category,
      message,
      details,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };

    memoryAlerts.unshift(newAlert);

    try {
      await pool.query(
        `INSERT INTO alerts (id, batch_id, severity, category, message, details, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id, batchId || null, severity, category, message, JSON.stringify(details), 'OPEN']
      );
    } catch (err) {
      // Memory fallback active
    }

    return newAlert;
  }

  static async getAlerts(status?: string, severity?: string): Promise<Alert[]> {
    let dbAlerts: Alert[] = [];
    try {
      let query = `SELECT id, batch_id as "batchId", severity, category, message, details, 
                          status, resolved_by as "resolvedBy", resolution_notes as "resolutionNotes", 
                          created_at as "createdAt", resolved_at as "resolvedAt"
                   FROM alerts WHERE 1=1`;
      const params: any[] = [];
      if (status) {
        params.push(status);
        query += ` AND status = $${params.length}`;
      }
      if (severity) {
        params.push(severity);
        query += ` AND severity = $${params.length}`;
      }
      query += ` ORDER BY created_at DESC`;
      const result = await pool.query(query, params);
      if (result.rows) {
        dbAlerts = result.rows;
      }
    } catch {
      // Memory fallback active
    }

    const filteredMemory = memoryAlerts.filter(a => {
      if (status && a.status !== status) return false;
      if (severity && a.severity !== severity) return false;
      return true;
    });

    const dbIds = new Set(dbAlerts.map(a => a.id));
    const combined = [...dbAlerts, ...filteredMemory.filter(a => !dbIds.has(a.id))];
    return combined;
  }

  static async resolveAlert(id: string, resolvedBy: string, resolutionNotes: string): Promise<Alert | null> {
    const resolvedAt = new Date().toISOString();
    try {
      const result = await pool.query(
        `UPDATE alerts 
         SET status = 'RESOLVED', resolved_by = $1, resolution_notes = $2, resolved_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING id, batch_id as "batchId", severity, category, message, details, 
                   status, resolved_by as "resolvedBy", resolution_notes as "resolutionNotes", 
                   created_at as "createdAt", resolved_at as "resolvedAt"`,
        [resolvedBy, resolutionNotes, id]
      );
      if (result.rows && result.rows[0]) {
        return result.rows[0];
      }
    } catch (err) {
      // Memory fallback
    }

    const alert = memoryAlerts.find(a => a.id === id);
    if (alert) {
      alert.status = 'RESOLVED';
      alert.resolvedBy = resolvedBy;
      alert.resolutionNotes = resolutionNotes;
      alert.resolvedAt = resolvedAt;
      return alert;
    }
    return null;
  }
}
