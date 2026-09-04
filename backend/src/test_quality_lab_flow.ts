import { qualityService } from './services/quality.service';
import * as batchService from './services/batch.service';
import { getHoneyPassport } from './services/passport.service';

async function runQualityLabTests() {
  console.log('🧪 Starting Quality Lab Test & Certification Automated Test Suite...\n');
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

  // 1. Create a test batch
  const testBatchId = `HC-2026-${Math.floor(1000 + Math.random() * 4000)}`;
  await batchService.createBatch({
    id: testBatchId,
    quantity: 20.0,
    origin: 'Nilgiri Hills Apiary #2',
    floralSource: 'Wild Forest Flora'
  });

  // 2. Submit a compliant quality lab test
  const test1 = await qualityService.recordTest({
    batchId: testBatchId,
    labId: 'ORG-LAB-01',
    labName: 'Apex Food Safety Labs (NABL Accredited)',
    sampleId: 'SMP-2026-NABL-01',
    testerName: 'Dr. Arishta Mehta',
    certificateRef: 'NABL/TC-9912/2026',
    parameters: {
      moisturePercent: 17.5,
      hmfMgPerKg: 14.2,
      sucrosePercent: 2.3,
      c4SugarPercent: 1.2,
      pollenCountPerGram: 31000,
      antibioticResidue: 'NEGATIVE',
      leadPpm: 0.02
    },
    notes: 'Sample fully compliant with FSSAI Honey Guidelines 2018.'
  });

  assert(test1.id.startsWith(`LAB-${testBatchId}`), `Test record generated with ID: ${test1.id}`);
  assert(test1.overallStatus === 'PASSED', 'FSSAI compliant parameters evaluated as overallStatus=PASSED');
  assert(test1.certificateHashSha256.length === 64, `SHA-256 certificate digest generated: ${test1.certificateHashSha256.substring(0, 16)}...`);
  assert(test1.parameters.c4SugarPercent === 1.2, 'C4 Sugar % recorded');
  assert(test1.sampleId === 'SMP-2026-NABL-01', 'Sample ID recorded');

  // 3. Query GET /api/quality/tests/:batchId equivalent
  const retrievedTests = await qualityService.getTests(testBatchId);
  assert(retrievedTests.length >= 1, `Found ${retrievedTests.length} quality test(s) for batch ${testBatchId}`);
  assert(retrievedTests[0].id === test1.id, 'Retrieved test matches submitted test ID');
  assert(retrievedTests[0].parameters.moisturePercent === 17.5, 'Moisture percent matches');

  // 4. Test Non-Compliant Quality Test (e.g. Moisture > 20% or Antibiotics POSITIVE)
  const failBatchId = `HC-2026-${Math.floor(5000 + Math.random() * 4000)}`;
  await batchService.createBatch({
    id: failBatchId,
    quantity: 15.0,
    origin: 'Deuterated Mock Hive',
    floralSource: 'Commercial Syrup'
  });

  const testFail = await qualityService.recordTest({
    batchId: failBatchId,
    labId: 'ORG-LAB-01',
    labName: 'Apex Food Safety Labs (NABL Accredited)',
    sampleId: 'SMP-2026-FAIL-99',
    testerName: 'Dr. Arishta Mehta',
    certificateRef: 'NABL/TC-FAIL-01/2026',
    parameters: {
      moisturePercent: 22.8, // Exceeds 20.0% max limit!
      hmfMgPerKg: 58.0,      // Exceeds 40.0 mg/kg limit!
      sucrosePercent: 7.2,   // Exceeds 5.0% limit!
      c4SugarPercent: 12.5,  // Exceeds 7.0% C4 adulteration limit!
      pollenCountPerGram: 8000,
      antibioticResidue: 'POSITIVE', // Fail!
      leadPpm: 0.12
    },
    notes: 'Significant parameter deviations detected.'
  });

  assert(testFail.overallStatus === 'REVIEW_REQUIRED', 'Non-compliant parameters evaluated as overallStatus=REVIEW_REQUIRED');

  // 5. Verify Honey Passport reflects quality test evidence accurately
  const passport = await getHoneyPassport(testBatchId);
  assert(passport !== null, 'Honey passport generated');
  assert(passport?.quality?.status === 'PASSED', 'Passport quality pillar status is PASSED');
  assert(passport?.quality?.certificateHash === test1.certificateHashSha256, 'Passport contains exact certificate SHA-256 hash');
  assert(passport?.quality?.moisturePercent === 17.5, 'Passport contains verified lab moisture percent');

  console.log(`\n============================================================`);
  console.log(`🎯 Quality Lab Flow Test Summary: ${passed}/${total} Tests Passed`);
  console.log(`============================================================\n`);
}

runQualityLabTests().catch(console.error);
