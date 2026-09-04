import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as batchService from '../services/batch.service';
import { blockchainService } from '../services/blockchain.service';
import { qualityService } from '../services/quality.service';

export async function createBatch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { harvestId, quantity, origin, floralSource, hiveId, beekeeperId, id } = req.body;
    if (!quantity || !origin) {
      return res.status(400).json({ success: false, error: 'quantity and origin are required' });
    }

    const batch = await batchService.createBatch({ 
      harvestId, 
      quantity: parseFloat(quantity), 
      origin, 
      floralSource,
      hiveId,
      beekeeperId: beekeeperId || req.user?.organizationId || 'ORG-BEE-01',
      id,
      actorId: req.user?.id,
      actorName: req.user?.fullName
    });
    res.status(201).json({ success: true, data: batch });
  } catch (err) {
    next(err);
  }
}

export async function getBatches(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const batches = await batchService.getAllBatches();
    res.json({ success: true, data: batches });
  } catch (err) {
    next(err);
  }
}

export async function getBatchById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

export async function getBatchTimeline(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const batch = await batchService.getBatchById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    const history = await blockchainService.getBatchHistory(req.params.id);
    const qualityTests = qualityService.getTests(req.params.id);

    res.json({
      success: true,
      data: {
        batchId: batch.id,
        status: batch.status,
        origin: batch.origin,
        floralSource: batch.floralSource,
        quantity: batch.quantity,
        currentCustodian: batch.currentCustodian,
        custodianRole: batch.custodianRole,
        harvest: batch.harvest,
        processingEvents: batch.processingEvents || [],
        transportEvents: batch.transportEvents || [],
        packagingEvents: batch.packagingEvents || [],
        qualityTests,
        blockchainTransactions: history
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function recordIntake(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const processorId = req.user?.organizationId || 'ORG-PROC-01';
    const processorName = req.user?.organizationName || 'Nilgiri Pure Extraction Ltd';
    const actorName = req.user?.fullName || 'Processor Operator';

    const batch = await batchService.recordIntake(req.params.id, processorId, processorName, actorName);
    if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });
    res.json({ success: true, data: batch });
  } catch (err) {
    next(err);
  }
}

export async function addProcessingEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { eventType, temperatureCelsius, moisturePercent, inputWeightKg, outputWeightKg, quantityKg, details } = req.body;
    const processorId = req.user?.organizationId || 'ORG-PROC-01';
    const processorName = req.user?.organizationName || 'Nilgiri Pure Extraction Ltd';
    const actorName = req.user?.fullName || 'Anita Desai';

    const result = await batchService.addProcessingEvent(
      req.params.id, 
      processorId, 
      eventType || 'MOISTURE_EXTRACTION', 
      {
        processorName,
        temperatureCelsius: temperatureCelsius !== undefined ? parseFloat(temperatureCelsius) : undefined,
        moisturePercent: moisturePercent !== undefined ? parseFloat(moisturePercent) : undefined,
        inputWeightKg: inputWeightKg !== undefined ? parseFloat(inputWeightKg) : undefined,
        outputWeightKg: outputWeightKg !== undefined ? parseFloat(outputWeightKg) : (quantityKg !== undefined ? parseFloat(quantityKg) : undefined),
        actorName,
        ...details
      }
    );
    res.status(201).json({ 
      success: true, 
      data: result.event,
      inconsistency: result.inconsistency
    });
  } catch (err) {
    next(err);
  }
}

export async function markReadyForTransport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const batch = await batchService.markReadyForTransport(
      req.params.id,
      req.user?.id || 'USR-PROC-01',
      req.user?.fullName || 'Anita Desai',
      req.user?.organizationName || 'Nilgiri Pure Extraction Ltd'
    );
    if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });
    res.json({ success: true, data: batch });
  } catch (err) {
    next(err);
  }
}

export async function addTransportEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { source, destination, vehicleNumber, transitTemperatureCelsius, conditionStatus } = req.body;
    const transporterId = req.user?.organizationId || 'ORG-LOG-01';
    const transporterName = req.user?.organizationName || 'Bharat Cold-Chain Logistics';
    const actorName = req.user?.fullName || 'Gurdeep Singh';

    const event = await batchService.addTransportEvent(
      req.params.id, 
      transporterId, 
      source || 'Apiary Extraction Center', 
      destination || 'Central Packaging Hub',
      {
        transporterName,
        vehicleNumber,
        transitTemperatureCelsius,
        conditionStatus,
        actorName
      }
    );
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

export async function confirmTransportReceipt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const receiverOrgId = req.user?.organizationId || 'ORG-PACK-01';
    const receiverOrgName = req.user?.organizationName || 'PureFlora Packaging Hub';
    const receiverRole = req.user?.role || 'PACKAGER';
    const actorName = req.user?.fullName || 'Priya Sundaram';

    const batch = await batchService.confirmTransportReceipt(
      req.params.id,
      receiverOrgId,
      receiverOrgName,
      receiverRole,
      actorName
    );
    if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });
    res.json({ success: true, data: batch });
  } catch (err) {
    next(err);
  }
}

export async function addPackagingEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { productId, containerType, unitsCount, unitWeightGrams } = req.body;
    const packagerId = req.user?.organizationId || 'ORG-PACK-01';
    const packagerName = req.user?.organizationName || 'PureFlora Packaging Hub';
    const actorName = req.user?.fullName || 'Priya Sundaram';

    const event = await batchService.addPackagingEvent(
      req.params.id, 
      packagerId, 
      productId || `HONEY-PROD-${req.params.id}`,
      {
        packagerName,
        containerType,
        unitsCount,
        unitWeightGrams,
        actorName
      }
    );
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

export async function publishPassport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const packagerId = req.user?.organizationId || 'ORG-PACK-01';
    const packagerName = req.user?.organizationName || 'PureFlora Packaging Hub';
    const actorName = req.user?.fullName || 'Priya Sundaram';

    const batch = await batchService.publishPassport(req.params.id, packagerId, packagerName, actorName);
    if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });
    res.json({ success: true, data: batch });
  } catch (err) {
    next(err);
  }
}
