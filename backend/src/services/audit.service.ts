import { pool } from '../config/database';

export interface AuditLogEntry {
  id?: number;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  details?: any;
  createdAt?: Date;
}

const memoryAuditLogs: AuditLogEntry[] = [];

export class AuditService {
  static async log(
    action: string,
    resourceType: string,
    resourceId?: string,
    userId?: string,
    ipAddress?: string,
    details: any = {}
  ): Promise<void> {
    const entry: AuditLogEntry = {
      userId,
      action,
      resourceType,
      resourceId,
      ipAddress,
      details,
      createdAt: new Date()
    };

    memoryAuditLogs.unshift(entry);
    if (memoryAuditLogs.length > 500) {
      memoryAuditLogs.pop();
    }

    try {
      await pool.query(
        `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, ip_address, details)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId || null, action, resourceType, resourceId || null, ipAddress || null, JSON.stringify(details)]
      );
    } catch (err: any) {
      // Fallback silently kept in memory
    }
  }

  static async getLogs(limit: number = 100, offset: number = 0): Promise<AuditLogEntry[]> {
    try {
      const result = await pool.query(
        `SELECT id, user_id as "userId", action, resource_type as "resourceType", 
                resource_id as "resourceId", ip_address as "ipAddress", details, created_at as "createdAt"
         FROM audit_logs
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      if (result.rows && result.rows.length > 0) {
        return result.rows;
      }
    } catch (err) {
      // Fallback
    }
    return memoryAuditLogs.slice(offset, offset + limit);
  }
}
