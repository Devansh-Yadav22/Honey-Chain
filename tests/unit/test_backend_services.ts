/**
 * Honey Chain — Backend Services Unit Test Suite
 * Verifies hive.service, batch.service, passport.service, ai.service, and blockchain.service fallback.
 */

import { getHives, getHiveById } from '../../backend/src/services/hive.service';
import { getBatches, getBatchById } from '../../backend/src/services/batch.service';
import { getHoneyPassport } from '../../backend/src/services/passport.service';
import { aiService } from '../../backend/src/services/ai.service';
import { blockchainService } from '../../backend/src/services/blockchain.service';

async function runBackendServiceTests() {
  console.log('🧪 Running Backend Service Unit Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASSED: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAILED: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Hive Service Tests
    const hives = await getHives();
    assert(Array.isArray(hives) && hives.length >= 5, 'getHives returns registered seed hives');

    const hive1 = await getHiveById('HIVE-001');
    assert(hive1?.id === 'HIVE-001' && hive1.status === 'ACTIVE', 'getHiveById HIVE-001 returns active hive');

    const hive5 = await getHiveById('HIVE-005');
    assert(hive5?.id === 'HIVE-005' && hive5.status === 'CRITICAL', 'getHiveById HIVE-005 returns critical hive');

    // 2. Batch Service Tests
    const batches = await getBatches();
    assert(Array.isArray(batches) && batches.length >= 3, 'getBatches returns registered seed batches');

    const batch1 = await getBatchById('HC-2026-0001');
    assert(batch1?.id === 'HC-2026-0001' && batch1.status === 'VERIFIED', 'getBatchById HC-2026-0001 returns verified batch');

    const batch3 = await getBatchById('HC-2026-0003');
    assert(batch3?.id === 'HC-2026-0003' && batch3.status === 'SUSPICIOUS', 'getBatchById HC-2026-0003 returns suspicious batch');

    // 3. AI Service Integration & Fallback Tests
    const healthResult = await aiService.getHiveHealth('HIVE-005');
    assert(healthResult.health === 'CRITICAL', 'aiService.getHiveHealth identifies critical hive');

    const anomalyResult = await aiService.getHiveAnomalies('HIVE-005');
    assert(anomalyResult.anomaly === true && anomalyResult.severity === 'CRITICAL', 'aiService.getHiveAnomalies returns critical anomaly');

    const provenanceCheckVerified = await aiService.checkProvenanceConsistency({
      batchId: 'HC-2026-0001',
      blockchainHarvestQuantity: 18.0,
      observedQuantity: 18.0,
    });
    assert(provenanceCheckVerified.status === 'VERIFIED', 'aiService.checkProvenanceConsistency verifies matching quantity');

    const provenanceCheckSuspicious = await aiService.checkProvenanceConsistency({
      batchId: 'HC-2026-0003',
      blockchainHarvestQuantity: 18.0,
      observedQuantity: 31.0,
    });
    assert(provenanceCheckSuspicious.status === 'SUSPICIOUS', 'aiService.checkProvenanceConsistency flags mismatched quantity');

    // 4. Blockchain Service Fallback Tests
    const verifyResult1 = await blockchainService.verifyBatch('HC-2026-0001');
    assert(verifyResult1.verified === true, 'blockchainService.verifyBatch verifies HC-2026-0001 in fallback mode');

    const verifyResult3 = await blockchainService.verifyBatch('HC-2026-0003');
    assert(verifyResult3.verified === false, 'blockchainService.verifyBatch returns false for suspicious HC-2026-0003 in fallback mode');

    // 5. Passport Service Tests
    const passport1 = await getHoneyPassport('HC-2026-0001');
    assert(
      passport1 !== null &&
      passport1.verification.blockchainVerified === true &&
      passport1.verification.provenanceStatus === 'VERIFIED',
      'getHoneyPassport HC-2026-0001 returns verified passport with blockchain verification'
    );

    const passport3 = await getHoneyPassport('HC-2026-0003');
    assert(
      passport3 !== null &&
      passport3.verification.provenanceStatus === 'SUSPICIOUS' &&
      passport3.verification.anomalies.length > 0,
      'getHoneyPassport HC-2026-0003 returns suspicious passport with anomaly explanation'
    );

    console.log(`\nResults: ${passed} Passed, ${failed} Failed.`);
    if (failed > 0) {
      process.exit(1);
    }
  } catch (err: any) {
    console.error('Fatal error in test suite:', err);
    process.exit(1);
  }
}

runBackendServiceTests();
