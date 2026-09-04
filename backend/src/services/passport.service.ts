import { HoneyPassport } from '../types';
import { getBatchById } from './batch.service';
import { getHiveById } from './hive.service';
import { aiService } from './ai.service';
import { blockchainService } from './blockchain.service';
import { qualityService } from './quality.service';

export async function getHoneyPassport(batchId: string): Promise<HoneyPassport | null> {
  const batch = await getBatchById(batchId);
  if (!batch) return null;

  let hiveInfo: HoneyPassport['hive'];
  if (batch.harvest?.hiveId) {
    const hive = await getHiveById(batch.harvest.hiveId);
    if (hive) {
      hiveInfo = {
        id: hive.id,
        location: hive.location,
        apiaryName: hive.location.address || 'Himalayan Apiary'
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
  const qualityTests = qualityService.getTests(batchId);
  const latestQualityTest = qualityTests.length > 0 ? qualityTests[qualityTests.length - 1] : undefined;

  const isSuspicious = batch.status === 'SUSPICIOUS' || consistencyResult.status === 'SUSPICIOUS';
  const provenanceStatus = isSuspicious ? 'SUSPICIOUS' : 'CONFIRMED';
  const consistencyStatus = isSuspicious ? 'SUSPICIOUS' : 'NORMAL';

  return {
    batchId: batch.id,
    origin: batch.origin,
    quantity: batch.quantity,
    floralSource: batch.floralSource || batch.harvest?.floralSource || 'Multifloral Blossom',
    status: batch.status,
    createdAt: batch.createdAt || new Date().toISOString(),
    hive: hiveInfo,
    harvest: batch.harvest,
    timeline: {
      harvest: batch.harvest,
      processing: (batch.processingEvents || []).map(p => ({
        id: p.id,
        batchId: p.batchId,
        processorId: p.processorId,
        eventType: p.eventType,
        details: { temperature: p.temperatureCelsius, moisture: p.moisturePercent },
        timestamp: p.timestamp
      })),
      transport: (batch.transportEvents || []).map(t => ({
        id: t.id,
        batchId: t.batchId,
        transporterId: t.transporterId,
        source: t.source,
        destination: t.destination,
        timestamp: t.timestamp
      })),
      packaging: (batch.packagingEvents || []).map(k => ({
        id: k.id,
        batchId: k.batchId,
        packagerId: k.packagerId,
        productId: k.productId,
        packagingDate: k.packagingDate
      }))
    },
    quality: latestQualityTest ? {
      status: latestQualityTest.overallStatus,
      testDate: latestQualityTest.testDate,
      labName: latestQualityTest.labName,
      moisturePercent: latestQualityTest.parameters.moisturePercent,
      hmfMgPerKg: latestQualityTest.parameters.hmfMgPerKg,
      certificateHash: latestQualityTest.certificateHashSha256
    } : {
      status: 'NOT_AVAILABLE'
    },
    verification: {
      blockchainVerified: fabricVerification.verified,
      blockchainTxId: batch.blockchainTxId || fabricVerification.txId,
      provenanceStatus,
      consistencyStatus,
      consistencyScore: isSuspicious ? 0.24 : 0.98,
      anomalies: isSuspicious
        ? [
            `Recorded harvest volume (${recordedQuantity} kg) differs from observed batch volume (${batch.quantity} kg).`,
            'AI Evidence Consistency flagged unexpected volume increase without authorized harvest record.'
          ]
        : []
    }
  };
}
