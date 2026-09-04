import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { OrganizationService } from './services/organization.service';
import { EvidenceService } from './services/evidence.service';
import { HandoffService } from './services/handoff.service';
import { LocationService } from './services/location.service';
import { AlertService } from './services/alert.service';
import { ConsistencyService } from './services/consistency.service';
import { BatchService } from './services/batch.service';
import { DEMO_PASSWORD } from './db/seed';

async function runE2ETests() {
  console.log('🧪 Starting Honey Chain Tier 1 & Tier 2 Comprehensive Integration Test Suite...\n');
  let testsPassed = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      testsPassed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
    }
  }

  // TEST 1: User & Organization Multi-Tenancy Lookup
  console.log('🔹 Test Group 1: Multi-Tenancy & User Management');
  const orgs = await OrganizationService.getAll();
  assert(orgs.length >= 6, `Found ${orgs.length} organizations in registry`);

  const beekeeperUser = await UserService.getByEmailWithPassword('beekeeper@honeychain.demo');
  assert(beekeeperUser !== null && beekeeperUser.role === 'BEEKEEPER', 'Master Beekeeper account found with correct role');

  // TEST 2: Real Bcrypt Password Authentication & JWT Generation
  console.log('\n🔹 Test Group 2: Bcrypt & JWT Authentication');
  const authRes = await AuthService.login('beekeeper@honeychain.demo', DEMO_PASSWORD);
  assert(Boolean(authRes.token) && authRes.user.email === 'beekeeper@honeychain.demo', 'Login succeeded with JWT token generation');

  const decoded = AuthService.verifyToken(authRes.token);
  assert(decoded.role === 'BEEKEEPER' && decoded.id === beekeeperUser?.id, 'JWT token cryptographically verified with correct payload');

  let loginFailed = false;
  try {
    await AuthService.login('beekeeper@honeychain.demo', 'WrongPassword123!');
  } catch (err: any) {
    loginFailed = true;
  }
  assert(loginFailed, 'Invalid password correctly rejected with 401/error');

  // TEST 3: GPS Location Recording & Haversine Distance Calculation
  console.log('\n🔹 Test Group 3: Geolocation Tracking & Haversine Distance Calculation');
  const dist = LocationService.calculateHaversineDistance(28.6139, 77.2090, 30.7333, 76.7794);
  assert(dist > 230 && dist < 260, `Haversine formula computed accurate distance: ${dist} km`);

  const testBatchId = 'HC-2026-9999';
  const loc1 = await LocationService.recordLocation({
    batchId: testBatchId,
    recordedBy: beekeeperUser!.id,
    stage: 'HARVEST',
    latitude: 28.6139,
    longitude: 77.2090,
    address: 'Apiary Alpha, New Delhi'
  });
  assert(Boolean(loc1.id) && loc1.latitude === 28.6139, 'Harvest GPS waypoint recorded');

  // TEST 4: Off-Chain Evidence Storage & SHA-256 Hash Verification
  console.log('\n🔹 Test Group 4: Cryptographic Off-Chain Evidence Management');
  const mockFile: any = {
    originalname: 'fssai_lab_report_test.pdf',
    mimetype: 'application/pdf',
    size: 1024,
    buffer: Buffer.from('HONEY_CHAIN_FSSAI_LAB_PURITY_VERIFIED_REPORT_2026_MOCK_BUFFER_CONTENT')
  };
  const evidenceRecord = await EvidenceService.saveEvidenceFile(
    testBatchId,
    beekeeperUser!.id,
    'LAB_REPORT',
    mockFile,
    { moisturePercent: 17.4, pollenCount: 9200 }
  );
  assert(Boolean(evidenceRecord.sha256Hash) && evidenceRecord.sha256Hash.length === 64, `Evidence file saved with SHA-256: ${evidenceRecord.sha256Hash.substring(0, 16)}...`);

  const verification = await EvidenceService.verifyIntegrity(evidenceRecord.id);
  assert(verification.valid === true, 'Physical evidence integrity verification succeeded');

  // TEST 5: State Machine Chain-of-Custody Handoffs
  console.log('\n🔹 Test Group 5: Custody Transfer State Machine');
  const processorUser = await UserService.getByEmailWithPassword('processor@honeychain.demo');
  const handoff = await HandoffService.initiateHandoff({
    batchId: testBatchId,
    senderId: beekeeperUser!.id,
    receiverId: processorUser!.id,
    fromStage: 'HARVEST',
    toStage: 'PROCESSING',
    quantity: 25.0,
    unit: 'kg',
    evidenceHashes: [evidenceRecord.sha256Hash]
  });
  assert(handoff.status === 'PENDING', 'Handoff created with PENDING status');

  const acceptedHandoff = await HandoffService.acceptHandoff(handoff.id, processorUser!.id);
  assert(acceptedHandoff.status === 'ACCEPTED', 'Processor accepted custody handoff');

  // TEST 6: Consistency Engine & Anomaly Detection
  console.log('\n🔹 Test Group 6: Consistency Verification Engine');
  const report = await ConsistencyService.evaluateBatch('HC-2026-0001');
  assert(report.score >= 75 && report.isConsistent === true, `Nominal batch consistency score verified: ${report.score}%`);

  const reportSuspicious = await ConsistencyService.evaluateBatch('HC-2026-0003');
  assert(reportSuspicious.checks.quantityDrift.passed === false || reportSuspicious.checks.aiAnomaly.passed === false, 'Flagged batch correctly triggers anomaly detection in Consistency Engine');

  // TEST 7: Alert Management & Admin Resolution
  console.log('\n🔹 Test Group 7: Security & Quality Alerts');
  const alert = await AlertService.createAlert(
    testBatchId,
    'WARNING',
    'QUANTITY_DRIFT',
    'Test quantity variance alert',
    { test: true }
  );
  assert(alert.status === 'OPEN', 'System alert created and open');

  const adminUser = await UserService.getByEmailWithPassword('admin@honeychain.demo');
  const resolved = await AlertService.resolveAlert(alert.id, adminUser!.id, 'Investigated and cleared by Authority Admin');
  assert(resolved?.status === 'RESOLVED', 'Alert resolved by admin with audit notes');

  console.log(`\n============================================================`);
  console.log(`🎯 Test Summary: ${testsPassed}/${totalTests} Tests Passed (${Math.round((testsPassed/totalTests)*100)}%)`);
  console.log(`============================================================\n`);
}

runE2ETests().catch(err => {
  console.error('Test execution error:', err);
});
