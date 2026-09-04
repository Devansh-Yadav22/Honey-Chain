import { pool } from '../config/database';
import { Handoff } from '../types';
import { AuditService } from './audit.service';
import { AlertService } from './alert.service';

const memoryHandoffs: Handoff[] = [];

export class HandoffService {
  static async initiateHandoff(data: {
    batchId: string;
    senderId: string;
    receiverId: string;
    fromStage: string;
    toStage: string;
    quantity: number;
    unit?: string;
    evidenceHashes?: string[];
    location?: { lat: number; lng: number; address?: string };
  }): Promise<Handoff> {
    const id = `HND-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newHandoff: Handoff = {
      id,
      batchId: data.batchId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      fromStage: data.fromStage,
      toStage: data.toStage,
      quantity: data.quantity,
      unit: data.unit || 'kg',
      status: 'PENDING',
      evidenceHashes: data.evidenceHashes || [],
      location: data.location,
      createdAt: new Date().toISOString()
    };

    memoryHandoffs.unshift(newHandoff);

    try {
      await pool.query(
        `INSERT INTO handoffs (id, batch_id, sender_id, receiver_id, from_stage, to_stage, quantity, unit, status, evidence_hashes, location)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [id, newHandoff.batchId, newHandoff.senderId, newHandoff.receiverId, newHandoff.fromStage, newHandoff.toStage, newHandoff.quantity, newHandoff.unit, 'PENDING', JSON.stringify(newHandoff.evidenceHashes), JSON.stringify(newHandoff.location || {})]
      );
    } catch (err) {
      // Memory fallback
    }

    await AuditService.log('HANDOFF_INITIATED', 'HANDOFF', id, data.senderId, undefined, {
      batchId: data.batchId,
      fromStage: data.fromStage,
      toStage: data.toStage,
      receiverId: data.receiverId,
      quantity: data.quantity
    });

    return newHandoff;
  }

  static async acceptHandoff(handoffId: string, receiverId: string): Promise<Handoff> {
    const resolvedAt = new Date().toISOString();

    try {
      const result = await pool.query(
        `UPDATE handoffs 
         SET status = 'ACCEPTED', resolved_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND receiver_id = $2
         RETURNING id, batch_id as "batchId", sender_id as "senderId", receiver_id as "receiverId",
                   from_stage as "fromStage", to_stage as "toStage", quantity::float, unit,
                   status, dispute_reason as "disputeReason", evidence_hashes as "evidenceHashes",
                   location, created_at as "createdAt", resolved_at as "resolvedAt"`,
        [handoffId, receiverId]
      );

      if (result.rows && result.rows[0]) {
        const handoff = result.rows[0];
        await AuditService.log('HANDOFF_ACCEPTED', 'HANDOFF', handoffId, receiverId, undefined, {
          batchId: handoff.batchId,
          toStage: handoff.toStage
        });
        return handoff;
      }
    } catch (err) {
      // Memory fallback
    }

    const handoff = memoryHandoffs.find(h => h.id === handoffId && h.receiverId === receiverId);
    if (!handoff) {
      throw new Error('Handoff not found or you are not authorized to accept it');
    }

    handoff.status = 'ACCEPTED';
    handoff.resolvedAt = resolvedAt;

    await AuditService.log('HANDOFF_ACCEPTED', 'HANDOFF', handoffId, receiverId, undefined, {
      batchId: handoff.batchId,
      toStage: handoff.toStage
    });

    return handoff;
  }

  static async rejectHandoff(handoffId: string, receiverId: string, disputeReason: string): Promise<Handoff> {
    const resolvedAt = new Date().toISOString();

    try {
      const result = await pool.query(
        `UPDATE handoffs 
         SET status = 'REJECTED', dispute_reason = $1, resolved_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND receiver_id = $3
         RETURNING id, batch_id as "batchId", sender_id as "senderId", receiver_id as "receiverId",
                   from_stage as "fromStage", to_stage as "toStage", quantity::float, unit,
                   status, dispute_reason as "disputeReason", evidence_hashes as "evidenceHashes",
                   location, created_at as "createdAt", resolved_at as "resolvedAt"`,
        [disputeReason, handoffId, receiverId]
      );

      if (result.rows && result.rows[0]) {
        const handoff = result.rows[0];
        await AlertService.createAlert(
          handoff.batchId,
          'WARNING',
          'UNVERIFIED_HANDOFF',
          `Handoff rejected for batch ${handoff.batchId} from stage ${handoff.fromStage} to ${handoff.toStage}: ${disputeReason}`,
          { handoffId, disputeReason, receiverId }
        );
        await AuditService.log('HANDOFF_REJECTED', 'HANDOFF', handoffId, receiverId, undefined, {
          batchId: handoff.batchId,
          disputeReason
        });
        return handoff;
      }
    } catch (err) {
      // Memory fallback
    }

    const handoff = memoryHandoffs.find(h => h.id === handoffId && h.receiverId === receiverId);
    if (!handoff) {
      throw new Error('Handoff not found or you are not authorized to reject it');
    }

    handoff.status = 'REJECTED';
    handoff.disputeReason = disputeReason;
    handoff.resolvedAt = resolvedAt;

    await AlertService.createAlert(
      handoff.batchId,
      'WARNING',
      'UNVERIFIED_HANDOFF',
      `Handoff rejected for batch ${handoff.batchId} from stage ${handoff.fromStage} to ${handoff.toStage}: ${disputeReason}`,
      { handoffId, disputeReason, receiverId }
    );

    await AuditService.log('HANDOFF_REJECTED', 'HANDOFF', handoffId, receiverId, undefined, {
      batchId: handoff.batchId,
      disputeReason
    });

    return handoff;
  }

  static async getByBatchId(batchId: string): Promise<Handoff[]> {
    try {
      const result = await pool.query(
        `SELECT id, batch_id as "batchId", sender_id as "senderId", receiver_id as "receiverId",
                from_stage as "fromStage", to_stage as "toStage", quantity::float, unit,
                status, dispute_reason as "disputeReason", evidence_hashes as "evidenceHashes",
                location, created_at as "createdAt", resolved_at as "resolvedAt"
         FROM handoffs 
         WHERE batch_id = $1 
         ORDER BY created_at ASC`,
        [batchId]
      );
      if (result.rows && result.rows.length > 0) {
        return result.rows;
      }
    } catch (err) {
      // Memory fallback
    }

    return memoryHandoffs.filter(h => h.batchId === batchId);
  }

  static async getPendingForUser(userId: string): Promise<Handoff[]> {
    try {
      const result = await pool.query(
        `SELECT id, batch_id as "batchId", sender_id as "senderId", receiver_id as "receiverId",
                from_stage as "fromStage", to_stage as "toStage", quantity::float, unit,
                status, dispute_reason as "disputeReason", evidence_hashes as "evidenceHashes",
                location, created_at as "createdAt", resolved_at as "resolvedAt"
         FROM handoffs 
         WHERE receiver_id = $1 AND status = 'PENDING'
         ORDER BY created_at DESC`,
        [userId]
      );
      if (result.rows && result.rows.length > 0) {
        return result.rows;
      }
    } catch (err) {
      // Memory fallback
    }

    return memoryHandoffs.filter(h => h.receiverId === userId && h.status === 'PENDING');
  }
}
