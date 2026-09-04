import { Request, Response } from 'express';
import { AuditService } from '../services/audit.service';

export class AuditController {
  static async getLogs(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const logs = await AuditService.getLogs(limit, offset);
      return res.json({ success: true, data: logs });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
