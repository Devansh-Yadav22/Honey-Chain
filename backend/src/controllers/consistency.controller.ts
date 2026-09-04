import { Request, Response } from 'express';
import { ConsistencyService } from '../services/consistency.service';

export class ConsistencyController {
  static async evaluateBatch(req: Request, res: Response) {
    try {
      const { batchId } = req.params;
      if (!batchId) {
        return res.status(400).json({ success: false, error: 'batchId is required' });
      }

      const report = await ConsistencyService.evaluateBatch(batchId);
      return res.json({ success: true, data: report });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
