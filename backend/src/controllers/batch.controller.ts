import { Request, Response, NextFunction } from 'express';
import * as batchService from '../services/batch.service';
import { blockchainService } from '../services/blockchain.service';

export async function createBatch(req: Request, res: Response, next: NextFunction) {
  try {
    const { harvestId, quantity, origin, id } = req.body;
    if (!quantity || !origin) {
      return res.status(400).json({ success: false, error: 'quantity and origin are required' });
    }

    const batch = await batchService.createBatch({ harvestId, quantity: parseFloat(quantity), origin, id });
    res.status(201).json({ success: true, data: batch });
  } catch (err) {
    next(err);
  }
}

export async function getBatches(_req: Request, res: Response, next: NextFunction) {
  try {
    const batches = await batchService.getAllBatches();
    res.json({ success: true, data: batches });
  } catch (err) {
    next(err);
  }
}

export async function getBatchById(req: Request, res: Response, next: NextFunction) {
  try {
    const batch = await batchService.getBatchById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }
    res.json({ success: true, data: batch });
  } catch (err) {
    next(err);
  }
}

export async function getBatchTimeline(req: Request, res: Response, next: NextFunction) {
  try {
    const batch = await batchService.getBatchById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    const history = await blockchainService.getBatchHistory(req.params.id);
    res.json({
      success: true,
      data: {
        batchId: batch.id,
        status: batch.status,
        origin: batch.origin,
        quantity: batch.quantity,
        harvest: batch.harvest,
        processingEvents: batch.processingEvents || [],
        transportEvents: batch.transportEvents || [],
        packagingEvents: batch.packagingEvents || [],
        blockchainTransactions: history
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function addProcessingEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { processorId, eventType, details } = req.body;
    const event = await batchService.addProcessingEvent(req.params.id, processorId || 'PROC-001', eventType || 'FILTERING', details);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

export async function addTransportEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { transporterId, source, destination } = req.body;
    const event = await batchService.addTransportEvent(req.params.id, transporterId || 'TRANS-001', source, destination);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

export async function addPackagingEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { packagerId, productId } = req.body;
    const event = await batchService.addPackagingEvent(req.params.id, packagerId || 'PKG-001', productId || 'PROD-001');
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}
