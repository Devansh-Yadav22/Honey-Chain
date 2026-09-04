import { ConsistencyService } from './services/consistency.service';
import * as batchService from './services/batch.service';
import { store } from './services/store';
import { AlertService } from './services/alert.service';

async function runQuantityConsistencyTests() {
  console.log('🧪 Starting Quantity Consistency Automated Test Suite...\n');
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

  // 1. Test Stage Quantity Unit Validation (Direct Rules)
  // Scenario A: 24.5 -> 32 = HIGH anomaly
  const testA = ConsistencyService.validateStageQuantity(24.5, 32, 'PROCESSING', 'Processing');
  assert(testA.isInconsistency === true, 'Scenario A: 24.5 kg -> 32 kg flagged as isInconsistency=true');
  assert(testA.inconsistency?.code === 'QUANTITY_INCONSISTENCY', 'Scenario A: code is QUANTITY_INCONSISTENCY');
  assert(testA.inconsistency?.severity === 'HIGH' || testA.inconsistency?.severity === 'CRITICAL', 'Scenario A: severity is HIGH/CRITICAL');
  assert(testA.inconsistency?.expected === 24.5, 'Scenario A: expected quantity is 24.5 kg');
  assert(testA.inconsistency?.actual === 32, 'Scenario A: actual quantity is 32 kg');
  assert(testA.inconsistency?.difference === 7.5, 'Scenario A: difference is 7.5 kg');

  // Scenario B: 24.5 -> 24.5 = valid
  const testB = ConsistencyService.validateStageQuantity(24.5, 24.5, 'PROCESSING', 'Processing');
  assert(testB.isValid === true, 'Scenario B: 24.5 kg -> 24.5 kg is valid');
  assert(testB.isInconsistency === false, 'Scenario B: 24.5 kg -> 24.5 kg has no inconsistency');

  // Scenario C: 24.5 -> 23.5 = valid processing loss
  const testC = ConsistencyService.validateStageQuantity(24.5, 23.5, 'PROCESSING', 'Processing');
  assert(testC.isValid === true, 'Scenario C: 24.5 kg -> 23.5 kg is valid (legitimate processing shrinkage)');
  assert(testC.isLoss === true, 'Scenario C: isLoss is true');
  assert(testC.isInconsistency === false, 'Scenario C: legitimate processing loss is NOT flagged as inconsistency');

  // Scenario D: 24.5 -> 25.0 = anomaly
  const testD = ConsistencyService.validateStageQuantity(24.5, 25.0, 'PROCESSING', 'Processing');
  assert(testD.isInconsistency === true, 'Scenario D: 24.5 kg -> 25.0 kg flagged as anomaly (volume inflation)');
  assert(testD.inconsistency?.difference === 0.5, 'Scenario D: difference is 0.5 kg');

  // 2. Test End-to-End Pipeline Execution with Batch Creation & Processing Event
  const testBatchId = `HC-2026-${Math.floor(1000 + Math.random() * 8999)}`;
  const batch = await batchService.createBatch({
    id: testBatchId,
    quantity: 24.5,
    origin: 'Himachal Apiary Valley #4',
    floralSource: 'Wild Mustard'
  });
  assert(batch.id === testBatchId, `Batch ${testBatchId} registered with 24.5 kg harvest volume`);

  // Processor records processing with 32 kg output volume
  const procResult = await batchService.addProcessingEvent(
    testBatchId,
    'ORG-PROC-01',
    'MOISTURE_EXTRACTION',
    {
      processorName: 'Nilgiri Pure Extraction Ltd',
      temperatureCelsius: 38.5,
      moisturePercent: 17.4,
      outputWeightKg: 32.0,
      inputWeightKg: 24.5
    }
  );

  assert(procResult.inconsistency !== undefined, 'Processing event returned structured inconsistency object');
  assert(procResult.inconsistency?.expected === 24.5, 'Inconsistency expected volume is 24.5 kg');
  assert(procResult.inconsistency?.actual === 32.0, 'Inconsistency actual volume is 32.0 kg');
  assert(procResult.inconsistency?.difference === 7.5, 'Inconsistency difference is 7.5 kg');

  const updatedBatch = store.getBatchById(testBatchId);
  assert(updatedBatch?.status === 'SUSPICIOUS', `Batch status transitioned to 'SUSPICIOUS' (received: ${updatedBatch?.status})`);

  const alerts = await AlertService.getAlerts();
  const batchAlert = alerts.find(a => a.batchId === testBatchId);
  assert(batchAlert !== undefined, `Security alert successfully created for batch ${testBatchId}`);
  assert(batchAlert?.category === 'QUANTITY_DRIFT', 'Alert category is QUANTITY_DRIFT');

  // Evaluate batch consistency report
  const report = await ConsistencyService.evaluateBatch(testBatchId);
  assert(report.isConsistent === false, 'Batch failed 4-factor consistency check due to quantity inflation');
  assert(report.checks.quantityDrift.passed === false, 'quantityDrift check marked as passed=false');
  assert(report.inconsistencies.length > 0, 'Report includes quantity inconsistencies');

  console.log(`\n============================================================`);
  console.log(`🎯 Quantity Consistency Test Summary: ${passed}/${total} Tests Passed`);
  console.log(`============================================================\n`);
}

runQuantityConsistencyTests().catch(console.error);
