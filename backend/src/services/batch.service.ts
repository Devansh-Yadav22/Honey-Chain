import { Batch, Harvest, ProcessingEvent, TransportEvent, PackagingEvent } from '../types';
import { memoryStore } from './store';
import { blockchainService } from './blockchain.service';
import { aiService } from './ai.service';

export async function createBatch(data: { harvestId?: string; quantity: number; origin: string; id?: string }): Promise<Batch> {
  const batchId = data.id || `HC-2026-000${memoryStore.batches.size + 1}`;

  let harvest: Harvest | undefined;
  let status: Batch['status'] = 'CREATED';

  if (data.harvestId) {
    harvest = memoryStore.harvests.get(data.harvestId);
    if (harvest) {
      const check = await aiService.checkProvenanceConsistency({
        batchId,
        blockchainHarvestQuantity: harvest.quantity,
        observedQuantity: data.quantity
      });
      status = check.status;
    }
  }

  const tx = await blockchainService.createBatch(batchId, data.harvestId || 'N/A', data.quantity, data.origin);

  const newBatch: Batch = {
    id: batchId,
    harvestId: data.harvestId,
    quantity: data.quantity,
    origin: data.origin,
    status,
    blockchainTxId: tx.txId,
    blockchainStatus: tx.status,
    createdAt: new Date().toISOString(),
    harvest
  };

  memoryStore.batches.set(batchId, newBatch);
  return newBatch;
}

export async function getAllBatches(): Promise<Batch[]> {
  return Array.from(memoryStore.batches.values());
}

export async function getBatchById(id: string): Promise<Batch | null> {
  const batch = memoryStore.batches.get(id);
  if (!batch) return null;

  const harvest = batch.harvestId ? memoryStore.harvests.get(batch.harvestId) : undefined;
  const processingEvents = memoryStore.processingEvents.get(id) || [];
  const transportEvents = memoryStore.transportEvents.get(id) || [];
  const packagingEvents = memoryStore.packagingEvents.get(id) || [];

  return {
    ...batch,
    harvest,
    processingEvents,
    transportEvents,
    packagingEvents
  };
}

export async function addProcessingEvent(batchId: string, processorId: string, eventType: string, details?: any): Promise<ProcessingEvent> {
  const event: ProcessingEvent = {
    id: `PROC-${Date.now()}`,
    batchId,
    processorId,
    eventType,
    details,
    timestamp: new Date().toISOString()
  };

  const list = memoryStore.processingEvents.get(batchId) || [];
  list.push(event);
  memoryStore.processingEvents.set(batchId, list);

  await blockchainService.addProcessingEvent(batchId, processorId, eventType, details);
  return event;
}

export async function addTransportEvent(batchId: string, transporterId: string, source: string, destination: string): Promise<TransportEvent> {
  const event: TransportEvent = {
    id: `TRANS-${Date.now()}`,
    batchId,
    transporterId,
    source,
    destination,
    timestamp: new Date().toISOString()
  };

  const list = memoryStore.transportEvents.get(batchId) || [];
  list.push(event);
  memoryStore.transportEvents.set(batchId, list);

  await blockchainService.addTransportEvent(batchId, transporterId, source, destination);
  return event;
}

export async function addPackagingEvent(batchId: string, packagerId: string, productId: string): Promise<PackagingEvent> {
  const event: PackagingEvent = {
    id: `PKG-${Date.now()}`,
    batchId,
    packagerId,
    productId,
    packagingDate: new Date().toISOString()
  };

  const list = memoryStore.packagingEvents.get(batchId) || [];
  list.push(event);
  memoryStore.packagingEvents.set(batchId, list);

  await blockchainService.addPackagingEvent(batchId, packagerId, productId);
  return event;
}
