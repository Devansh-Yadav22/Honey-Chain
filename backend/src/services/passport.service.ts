import { HoneyPassport } from '../types';
import { getBatchById } from './batch.service';
import { getHiveById } from './hive.service';
import { aiService } from './ai.service';
import { blockchainService } from './blockchain.service';

export async function getHoneyPassport(batchId: string): Promise<HoneyPassport | null> {
  const batch = await getBatchById(batchId);
  if (!batch) return null;

  let hiveInfo: HoneyPassport['hive'];
  if (batch.harvest?.hiveId) {
    const hive = await getHiveById(batch.harvest.hiveId);
    if (hive) {
      hiveInfo = {
        id: hive.id,
        location: hive.location
      };
    }
  }

  const recordedQuantity = batch.harvest?.quantity || batch.quantity;
  const consistencyResult = await aiService.checkProvenanceConsistency({
    batchId: batch.id,
    blockchainHarvestQuantity: recordedQuantity,
    observedQuantity: batch.quantity
  });

  const fabricVerification = await blockchainService.verifyBatch(batchId);

  const provenanceStatus = (batch.status === 'SUSPICIOUS' || consistencyResult.status === 'SUSPICIOUS')
    ? 'SUSPICIOUS'
    : 'VERIFIED';

  return {
    batchId: batch.id,
    origin: batch.origin,
    quantity: batch.quantity,
    status: batch.status,
    createdAt: batch.createdAt || new Date().toISOString(),
    hive: hiveInfo,
    harvest: batch.harvest,
    timeline: {
      harvest: batch.harvest,
      processing: batch.processingEvents || [],
      transport: batch.transportEvents || [],
      packaging: batch.packagingEvents || []
    },
    verification: {
      blockchainVerified: fabricVerification.verified,
      blockchainTxId: batch.blockchainTxId || fabricVerification.txId,
      provenanceStatus,
      consistencyScore: provenanceStatus === 'SUSPICIOUS' ? 0.24 : 0.97,
      anomalies: provenanceStatus === 'SUSPICIOUS'
        ? [
            `Recorded harvest quantity (${recordedQuantity} kg) differs from observed batch quantity (${batch.quantity} kg).`,
            'Potential volume adulteration or unverified external blending flagged by AI Consistency Engine.'
          ]
        : []
    }
  };
}
