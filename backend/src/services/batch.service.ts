import { Batch, Harvest, ProcessingEvent, TransportEvent, PackagingEvent, BatchStatus, Role } from '../types';
import { store, memoryStore } from './store';
import { blockchainService } from './blockchain.service';
import { aiService } from './ai.service';

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
  const batchId = data.id || `HC-2026-000${memoryStore.batches.size + 1}`;

  let harvest: Harvest | undefined;
  let status: BatchStatus = 'HARVESTED';

  if (data.harvestId) {
    harvest = memoryStore.harvests.get(data.harvestId);
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
  }

  const tx = await blockchainService.createBatch(batchId, data.harvestId || 'N/A', data.quantity, data.origin);

  const newBatch: Batch = {
    id: batchId,
    harvestId: data.harvestId,
    hiveId: data.hiveId || harvest?.hiveId,
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
    outputWeightKg?: number;
    actorName?: string;
    [key: string]: any;
  }
): Promise<ProcessingEvent> {
  const event: ProcessingEvent = {
    id: `PROC-${Date.now()}`,
    batchId,
    processorId,
    processorName: details?.processorName || 'Nilgiri Pure Extraction Ltd',
    eventType,
    temperatureCelsius: details?.temperatureCelsius,
    moisturePercent: details?.moisturePercent,
    outputWeightKg: details?.outputWeightKg,
    details,
    timestamp: new Date().toISOString()
  };

  store.addProcessingEvent(event);
  store.updateBatchStatus(batchId, 'PROCESSING', details?.processorName || 'Nilgiri Pure Extraction Ltd', 'PROCESSOR');

  await blockchainService.addProcessingEvent(batchId, processorId, eventType, details);

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
    details: { eventType, tempC: details?.temperatureCelsius }
  });

  return event;
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
