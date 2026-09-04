/**
 * Honey Chain — Hyperledger Fabric Chaincode Unit Test Suite
 * Validates HoneyChainContract business logic, data models, disclaimers, and event validation rules.
 */

import { HoneyChainContract } from '../../blockchain/chaincode/honeychain-cc/dist/index';

async function runChaincodeTests() {
  console.log('⛓️ Running Hyperledger Fabric Chaincode Unit Tests...\n');
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
    const contract = new HoneyChainContract();
    assert(contract !== undefined, 'HoneyChainContract instantiated successfully');

    // Mock Stub implementation for Fabric Context
    const stateMap = new Map<string, Buffer>();

    const mockStub: any = {
      getState: async (key: string) => stateMap.get(key) || Buffer.from(''),
      putState: async (key: string, value: Buffer) => { stateMap.set(key, value); },
      getHistoryForKey: async () => ({
        next: async () => ({ value: undefined, done: true }),
        close: async () => {},
      })
    };

    const mockCtx: any = { stub: mockStub };

    // 1. Test initLedger
    await contract.initLedger(mockCtx);
    const hiveData = await mockStub.getState('HIVE_HIVE-001');
    assert(hiveData.length > 0, 'initLedger initializes HIVE-001 on state ledger');
    const hiveObj = JSON.parse(hiveData.toString());
    assert(hiveObj.hiveId === 'HIVE-001' && hiveObj.beekeeperId === 'BK-001', 'HIVE-001 fields match spec');

    // 2. Test createHarvest
    const harvestJson = JSON.stringify({
      harvestId: 'HARVEST-001',
      hiveId: 'HIVE-001',
      quantity: 18.0,
      harvestDate: '2026-08-20T10:00:00Z',
    });
    const harvestRes = await contract.createHarvest(mockCtx, harvestJson);
    const harvestObj = JSON.parse(harvestRes);
    assert(harvestObj.harvestId === 'HARVEST-001' && harvestObj.quantity === 18.0, 'createHarvest stores harvest asset');

    // 3. Test createBatch
    const batchJson = JSON.stringify({
      batchId: 'HC-2026-0001',
      harvestId: 'HARVEST-001',
    });
    const batchRes = await contract.createBatch(mockCtx, batchJson);
    const batchObj = JSON.parse(batchRes);
    assert(batchObj.batchId === 'HC-2026-0001' && batchObj.quantity === 18.0, 'createBatch derives origin quantity from harvest');
    assert(batchObj.verification.disclaimer.includes('does not prove physical honey purity'), 'Batch verification includes Master Spec purity disclaimer');

    // 4. Test Invalid Batch Format Rule
    let invalidCaught = false;
    try {
      await contract.createBatch(mockCtx, JSON.stringify({ batchId: 'INVALID_ID', harvestId: 'HARVEST-001' }));
    } catch {
      invalidCaught = true;
    }
    assert(invalidCaught, 'createBatch enforces HC-YYYY-NNNN Batch ID format rule');

    // 5. Test addProcessingEvent, addTransportEvent, addPackagingEvent order enforcement
    const procJson = JSON.stringify({ processorId: 'PROC-01', eventType: 'MOISTURE_EXTRACTION' });
    await contract.addProcessingEvent(mockCtx, 'HC-2026-0001', procJson);

    const transJson = JSON.stringify({ transporterId: 'LOG-01', source: 'Delhi', destination: 'Packager' });
    await contract.addTransportEvent(mockCtx, 'HC-2026-0001', transJson);

    const packJson = JSON.stringify({ packagerId: 'PKG-01', productId: 'HONEY-500G' });
    await contract.addPackagingEvent(mockCtx, 'HC-2026-0001', packJson);

    // 6. Test verifyBatch
    const verifyRes = await contract.verifyBatch(mockCtx, 'HC-2026-0001');
    const verifyObj = JSON.parse(verifyRes);
    assert(verifyObj.status === 'VERIFIED' && verifyObj.reasons.length === 0, 'verifyBatch passes for complete ordered provenance chain');

    console.log(`\nResults: ${passed} Passed, ${failed} Failed.`);
    if (failed > 0) {
      process.exit(1);
    }
  } catch (err: any) {
    console.error('Fatal error in chaincode test suite:', err);
    process.exit(1);
  }
}

runChaincodeTests();
