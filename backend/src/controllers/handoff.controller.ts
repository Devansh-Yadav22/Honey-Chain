import { Request, Response } from 'express';
import { HandoffService } from '../services/handoff.service';
import { AuthenticatedRequest } from '../middleware/auth';

export class HandoffController {
  static async initiate(req: AuthenticatedRequest, res: Response) {
    try {
      const { batchId, receiverId, fromStage, toStage, quantity, unit, evidenceHashes, location } = req.body;
      if (!batchId || !receiverId || !fromStage || !toStage || quantity === undefined) {
        return res.status(400).json({
          success: false,
          error: 'batchId, receiverId, fromStage, toStage, and quantity are required'
        });
      }

      const senderId = req.user?.id || 'usr-anonymous';
      const handoff = await HandoffService.initiateHandoff({
        batchId,
        senderId,
        receiverId,
        fromStage,
        toStage,
        quantity: parseFloat(quantity),
        unit,
        evidenceHashes,
        location
      });

      return res.status(201).json({ success: true, data: handoff });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async accept(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const receiverId = req.user?.id || 'usr-anonymous';
      const handoff = await HandoffService.acceptHandoff(id, receiverId);
      return res.json({ success: true, data: handoff });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async reject(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { disputeReason } = req.body;
      if (!disputeReason) {
        return res.status(400).json({ success: false, error: 'Dispute reason is required to reject a handoff' });
      }

      const receiverId = req.user?.id || 'usr-anonymous';
      const handoff = await HandoffService.rejectHandoff(id, receiverId, disputeReason);
      return res.json({ success: true, data: handoff });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getByBatchId(req: Request, res: Response) {
    try {
      const { batchId } = req.params;
      const handoffs = await HandoffService.getByBatchId(batchId);
      return res.json({ success: true, data: handoffs });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getPending(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }
      const handoffs = await HandoffService.getPendingForUser(userId);
      return res.json({ success: true, data: handoffs });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
