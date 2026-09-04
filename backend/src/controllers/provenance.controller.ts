import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service';

export async function checkProvenance(req: Request, res: Response, next: NextFunction) {
  try {
    const { batchId, blockchainHarvestQuantity, observedQuantity } = req.body;
    if (!batchId || blockchainHarvestQuantity === undefined || observedQuantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'batchId, blockchainHarvestQuantity, and observedQuantity are required'
      });
    }

    const result = await aiService.checkProvenanceConsistency({
      batchId,
      blockchainHarvestQuantity: parseFloat(blockchainHarvestQuantity),
      observedQuantity: parseFloat(observedQuantity)
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
