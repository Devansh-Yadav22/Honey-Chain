import { ConsistencyService } from './services/consistency.service';
import { EvidenceService } from './services/evidence.service';
import { LocationService } from './services/location.service';
import { HandoffService } from './services/handoff.service';
import { AlertService } from './services/alert.service';

async function runTier2Tests() {
  console.log('🧪 Starting Tier 2 Consistency & Evidence Test Suite...\n');
  let passed = 0;
  let total = 0;

  function assert(cond: boolean, name: string) {
    total++;
    if (cond) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name}`);
    }
  }

  // 1. Evidence SHA-256 Hashing and Verification
  const testBuffer = Buffer.from('HONEY_CHAIN_SAMPLE_LAB_ASSAY_DATA_OCTOBER_2026');
  const computedHash = EvidenceService.computeSha256(testBuffer);
  assert(computedHash.length === 64, `SHA-256 computed 256-bit hex digest: ${computedHash.substring(0, 16)}...`);

  // 2. Haversine Speed Anomaly Detection
  const dist1 = LocationService.calculateHaversineDistance(28.6139, 77.2090, 28.6200, 77.2150);
  assert(dist1 > 0 && dist1 < 2, `Local transit distance calculated: ${dist1} km`);

  // 3. Consistency Report on Baseline Batches
  const rep1 = await ConsistencyService.evaluateBatch('HC-2026-0001');
  assert(rep1.score >= 75, `HC-2026-0001 scored ${rep1.score}% on 4-factor consistency check`);

  // 4. Alert Triggering & Resolution
  const testAlert = await AlertService.createAlert(
    'HC-2026-0002',
    'INFO',
    'TIME_ANOMALY',
    'Routine automated sensor timestamp sync'
  );
  assert(testAlert.status === 'OPEN', 'Alert created in OPEN state');

  const resolvedAlert = await AlertService.resolveAlert(testAlert.id, 'usr-admin-01', 'Verified baseline sync');
  assert(resolvedAlert?.status === 'RESOLVED', 'Alert transitioned to RESOLVED state');

  console.log(`\n============================================================`);
  console.log(`🎯 Tier 2 Test Summary: ${passed}/${total} Tests Passed`);
  console.log(`============================================================\n`);
}

runTier2Tests().catch(console.error);
