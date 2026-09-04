import { Batch, Harvest, ProcessingEvent, TransportEvent, PackagingEvent, BatchStatus, Role, QuantityInconsistency } from '../types';
import { store, memoryStore } from './store';
import { blockchainService } from './blockchain.service';
import { aiService } from './ai.service';
import { ConsistencyService } from './consistency.service';
import { AlertService } from './alert.service';
import { query } from '../config/database';

export async function createBatch(data: { 
  harvestId?: string; 
  quantity: number; 
  origin: string; 
  floralSource?: string;
  hiveId?: string;
  beekeeperId?: string;
  id?: string;
  actorId?: string;
  actorName?: string;
}): Promise<Batch> {
  const nextNum = memoryStore.batches.size + 1;
  const padded = String(nextNum).padStart(4, '0');
  const batchId = data.id || `HC-2026-${padded}`;

  let harvestId = data.harvestId;
  let harvest: Harvest | undefined;
  let status: BatchStatus = 'HARVESTED';

  if (harvestId) {
    harvest = memoryStore.harvests.get(harvestId);
    if (harvest) {
      const check = await aiService.checkProvenanceConsistency({
        batchId,
        blockchainHarvestQuantity: harvest.quantity,
        observedQuantity: data.quantity
      });
      if (check.status === 'SUSPICIOUS') {
        status = 'SUSPICIOUS';
      }
    }
  } else {
    // Record harvest base record
    harvestId = `HARVEST-${padded}`;
    harvest = {
      id: harvestId,
      hiveId: data.hiveId || 'HIVE-001',
      beekeeperId: data.beekeeperId || 'BK-001',
      harvestDate: new Date().toISOString(),
      quantity: data.quantity,
      floralSource: data.floralSource || 'Mustard Blossom',
      moisturePercent: 18.0,
      location: { lat: 28.6139, lng: 77.2090 },
      notes: 'Logged via beekeeper workspace'
    };
    memoryStore.harvests.set(harvestId, harvest);
  }

  const tx = await blockchainService.createBatch(batchId, harvestId, data.quantity, data.origin);

  const newBatch: Batch = {
    id: batchId,
    harvestId,
    hiveId: data.hiveId || harvest?.hiveId || 'HIVE-001',
    beekeeperId: data.beekeeperId || harvest?.beekeeperId || 'BK-001',
    quantity: data.quantity,
    origin: data.origin,
    floralSource: data.floralSource || harvest?.floralSource || 'Multifloral Blossom',
    status,
    currentCustodian: data.actorName || 'Himalayan Apiary Cooperative',
    custodianRole: 'BEEKEEPER',
    blockchainTxId: tx.txId,
    blockchainStatus: tx.status,
    createdAt: new Date().toISOString(),
    harvest
  };

  store.addBatch(newBatch);

  try {
    await query(
      `INSERT INTO batches (id, harvest_id, quantity, origin, status, blockchain_tx_id, blockchain_status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET quantity = EXCLUDED.quantity, status = EXCLUDED.status`,
      [
        batchId,
        data.harvestId || null,
        data.quantity,
        data.origin,
        status,
        tx.txId,
        tx.status,
        newBatch.createdAt
      ]
    );
  } catch (err: any) {
    console.warn('[Batch Service] PostgreSQL insert notice:', err.message);
  }

  // Add audit log
  store.addAuditLog({
    actorId: data.actorId || 'USR-BEE-01',
    actorName: data.actorName || 'Rajesh Kumar Verma',
    role: 'BEEKEEPER',
    organizationId: 'ORG-BEE-01',
    organizationName: 'Himalayan Apiary Cooperative',
    action: 'BATCH_CREATED',
    resourceType: 'BATCH',
    resourceId: batchId,
    result: 'SUCCESS',
    details: { quantityKg: data.quantity, origin: data.origin, fabricTxId: tx.txId }
  });

  return store.populateBatch(newBatch);
}

export async function getAllBatches(): Promise<Batch[]> {
  return store.getBatches();
}

export async function getBatchById(id: string): Promise<Batch | null> {
  const batch = store.getBatchById(id);
  return batch || null;
}

export async function recordIntake(
  batchId: string, 
  processorId: string, 
  processorName: string, 
  actorName: string
): Promise<Batch | null> {
  const batch = store.getBatchById(batchId);
  if (!batch) return null;

  store.updateBatchStatus(batchId, 'RECEIVED_FOR_PROCESSING', processorName, 'PROCESSOR');

  const event: ProcessingEvent = {
    id: `PROC-${Date.now()}`,
    batchId,
    processorId,
    processorName,
    eventType: 'INTAKE',
    timestamp: new Date().toISOString(),
    details: { intakeConfirmation: true }
  };
  store.addProcessingEvent(event);

  store.addAuditLog({
    actorId: processorId,
    actorName,
    role: 'PROCESSOR',
    organizationId: processorId,
    organizationName: processorName,
    action: 'BATCH_RECEIVED',
    resourceType: 'BATCH',
    resourceId: batchId,
    result: 'SUCCESS'
  });

  return store.getBatchById(batchId) || null;
}

export async function addProcessingEvent(
  batchId: string, 
  processorId: string, 
  eventType: string, 
  details?: {
    processorName?: string;
    temperatureCelsius?: number;
    moisturePercent?: number;
    inputWeightKg?: number;
    outputWeightKg?: number;
    quantityKg?: number;
    actorName?: string;
    [key: string]: any;
  }
): Promise<{ event: ProcessingEvent; inconsistency?: QuantityInconsistency }> {
  const batch = store.getBatchById(batchId);
  const previousQuantity = batch?.harvest?.quantity || batch?.quantity || 24.5;
  const outputWeightKg = details?.outputWeightKg !== undefined ? Number(details.outputWeightKg) : (details?.quantityKg !== undefined ? Number(details.quantityKg) : previousQuantity);
  const inputWeightKg = details?.inputWeightKg !== undefined ? Number(details.inputWeightKg) : previousQuantity;

  // Validate Quantity Consistency across Harvest/Batch -> Processing
  const qtyCheck = ConsistencyService.validateStageQuantity(
    previousQuantity,
    outputWeightKg,
    'PROCESSING',
    'Processing'
  );

  const event: ProcessingEvent = {
    id: `PROC-${Date.now()}`,
    batchId,
    processorId,
    processorName: details?.processorName || 'Nilgiri Pure Extraction Ltd',
    eventType,
    temperatureCelsius: details?.temperatureCelsius,
    moisturePercent: details?.moisturePercent,
    inputWeightKg,
    outputWeightKg,
    details: {
      ...details,
      outputWeightKg,
      inputWeightKg
    },
    timestamp: new Date().toISOString()
  };

  store.addProcessingEvent(event);

  if (outputWeightKg !== undefined && !isNaN(outputWeightKg)) {
    store.updateBatchQuantity(batchId, outputWeightKg);
  }

  if (qtyCheck.isInconsistency && qtyCheck.inconsistency) {
    // Volume inflation anomaly detected! Mark batch as SUSPICIOUS!
    store.updateBatchStatus(batchId, 'SUSPICIOUS', details?.processorName || 'Nilgiri Pure Extraction Ltd', 'PROCESSOR');

    // 1. Create Alert
    await AlertService.createAlert(
      batchId,
      qtyCheck.inconsistency.severity,
      'QUANTITY_DRIFT',
      qtyCheck.inconsistency.message,
      qtyCheck.inconsistency
    );

    // 2. Add Exception in store
    store.addException({
      id: `EXC-${Date.now()}`,
      type: 'PROVENANCE_MISMATCH',
      severity: 'CRITICAL',
      title: 'Batch Volume Inflation Flagged',
      description: qtyCheck.inconsistency.message,
      resourceId: batchId,
      resourceType: 'BATCH',
      status: 'OPEN',
      createdAt: new Date().toISOString()
    });

    // 3. Log Audit
    store.addAuditLog({
      actorId: processorId,
      actorName: details?.actorName || 'Anita Desai',
      role: 'PROCESSOR',
      organizationId: processorId,
      organizationName: details?.processorName || 'Nilgiri Pure Extraction Ltd',
      action: 'QUANTITY_INCONSISTENCY_FLAGGED',
      resourceType: 'BATCH',
      resourceId: batchId,
      result: 'WARNING',
      details: qtyCheck.inconsistency
    });
  } else {
    // Normal nominal progression
    store.updateBatchStatus(batchId, 'PROCESSING', details?.processorName || 'Nilgiri Pure Extraction Ltd', 'PROCESSOR');

    store.addAuditLog({
      actorId: processorId,
      actorName: details?.actorName || 'Anita Desai',
      role: 'PROCESSOR',
      organizationId: processorId,
      organizationName: details?.processorName || 'Nilgiri Pure Extraction Ltd',
      action: 'PROCESSING_RECORDED',
      resourceType: 'BATCH',
      resourceId: batchId,
      result: 'SUCCESS',
      details: { eventType, tempC: details?.temperatureCelsius, outputWeightKg }
    });
  }

  // Anchor to blockchain
  try {
    await blockchainService.addProcessingEvent(batchId, processorId, eventType, {
      ...details,
      outputWeightKg,
      inputWeightKg
    });
  } catch (e: any) {
    console.warn('[Batch Service] Fabric processing event notice:', e.message);
  }

  return { event, inconsistency: qtyCheck.inconsistency };
}

export async function markReadyForTransport(
  batchId: string,
  actorId: string,
  actorName: string,
  orgName: string
): Promise<Batch | null> {
  const batch = store.getBatchById(batchId);
  if (!batch) return null;

  store.updateBatchStatus(batchId, 'READY_FOR_TRANSPORT', orgName, 'PROCESSOR');
  return store.getBatchById(batchId) || null;
}

export async function addTransportEvent(
  batchId: string, 
  transporterId: string, 
  source: string, 
  destination: string,
  details?: {
    transporterName?: string;
    vehicleNumber?: string;
    transitTemperatureCelsius?: number;
    conditionStatus?: 'OPTIMAL' | 'ACCEPTABLE' | 'DEVIATED';
    actorName?: string;
  }
): Promise<TransportEvent> {
  const event: TransportEvent = {
    id: `TRANS-${Date.now()}`,
    batchId,
    transporterId,
    transporterName: details?.transporterName || 'Bharat Cold-Chain Logistics',
    vehicleNumber: details?.vehicleNumber || 'DL-01-AX-9922',
    source,
    destination,
    transitTemperatureCelsius: details?.transitTemperatureCelsius || 22.0,
    conditionStatus: details?.conditionStatus || 'OPTIMAL',
    timestamp: new Date().toISOString()
  };

  store.addTransportEvent(event);
  store.updateBatchStatus(batchId, 'IN_TRANSIT', details?.transporterName || 'Bharat Cold-Chain Logistics', 'TRANSPORTER');

  await blockchainService.addTransportEvent(batchId, transporterId, source, destination);

  store.addAuditLog({
    actorId: transporterId,
    actorName: details?.actorName || 'Gurdeep Singh',
    role: 'TRANSPORTER',
    organizationId: transporterId,
    organizationName: details?.transporterName || 'Bharat Cold-Chain Logistics',
    action: 'TRANSPORT_DISPATCHED',
    resourceType: 'BATCH',
    resourceId: batchId,
    result: 'SUCCESS',
    details: { vehicle: details?.vehicleNumber, source, destination }
  });

  return event;
}

export async function confirmTransportReceipt(
  batchId: string,
  receiverOrgId: string,
  receiverOrgName: string,
  receiverRole: Role,
  actorName: string
): Promise<Batch | null> {
  const batch = store.getBatchById(batchId);
  if (!batch) return null;

  store.updateBatchStatus(batchId, 'RECEIVED', receiverOrgName, receiverRole);

  store.addAuditLog({
    actorId: receiverOrgId,
    actorName,
    role: receiverRole,
    organizationId: receiverOrgId,
    organizationName: receiverOrgName,
    action: 'TRANSPORT_RECEIVED',
    resourceType: 'BATCH',
    resourceId: batchId,
    result: 'SUCCESS'
  });

  return store.getBatchById(batchId) || null;
}

export async function addPackagingEvent(
  batchId: string, 
  packagerId: string, 
  productId: string,
  details?: {
    packagerName?: string;
    containerType?: string;
    unitsCount?: number;
    unitWeightGrams?: number;
    actorName?: string;
  }
): Promise<PackagingEvent> {
  const event: PackagingEvent = {
    id: `PKG-${Date.now()}`,
    batchId,
    packagerId,
    packagerName: details?.packagerName || 'PureFlora Packaging Hub',
    productId,
    containerType: details?.containerType || 'Glass Hexagonal Jar',
    unitsCount: details?.unitsCount || 40,
    unitWeightGrams: details?.unitWeightGrams || 500,
    packagingDate: new Date().toISOString()
  };

  store.addPackagingEvent(event);
  store.updateBatchStatus(batchId, 'PACKAGED', details?.packagerName || 'PureFlora Packaging Hub', 'PACKAGER');

  await blockchainService.addPackagingEvent(batchId, packagerId, productId);

  store.addAuditLog({
    actorId: packagerId,
    actorName: details?.actorName || 'Priya Sundaram',
    role: 'PACKAGER',
    organizationId: packagerId,
    organizationName: details?.packagerName || 'PureFlora Packaging Hub',
    action: 'PACKAGING_RECORDED',
    resourceType: 'BATCH',
    resourceId: batchId,
    result: 'SUCCESS',
    details: { productId, containerType: details?.containerType, units: details?.unitsCount }
  });

  return event;
}

export async function publishPassport(
  batchId: string,
  packagerId: string,
  packagerName: string,
  actorName: string
): Promise<Batch | null> {
  const batch = store.getBatchById(batchId);
  if (!batch) return null;

  store.updateBatchStatus(batchId, 'PUBLISHED', packagerName, 'PACKAGER');

  store.addAuditLog({
    actorId: packagerId,
    actorName,
    role: 'PACKAGER',
    organizationId: packagerId,
    organizationName: packagerName,
    action: 'PASSPORT_PUBLISHED',
    resourceType: 'PASSPORT',
    resourceId: batchId,
    result: 'SUCCESS'
  });

  return store.getBatchById(batchId) || null;
}

export const BatchService = {
  createBatch,
  getAllBatches,
  getBatchById,
  recordIntake,
  addProcessingEvent,
  markReadyForTransport,
  addTransportEvent,
  confirmTransportReceipt,
  addPackagingEvent,
  publishPassport
};
