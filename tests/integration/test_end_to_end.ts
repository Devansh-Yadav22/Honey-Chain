/**
 * Honey Chain — End-to-End Integration Verification Test
 * Flow: Hive -> Telemetry -> AI Health & Anomaly -> Harvest -> Batch -> Passport -> Verification
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';
const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

async function runE2eTest() {
  console.log('🐝 Starting Honey Chain End-to-End Integration Test...\n');

  try {
    // 1. Backend Health Check
    console.log('1. Testing Backend Health Check...');
    const backendRes = await fetch(`${BACKEND_URL}/health`);
    console.log('   Backend Status:', backendRes.status, await backendRes.json());

    // 2. AI Health Check
    console.log('\n2. Testing AI Service Root...');
    const aiRes = await fetch(`${AI_URL}/`);
    console.log('   AI Service Status:', aiRes.status, await aiRes.json());

    // 3. Hive Registry Query
    console.log('\n3. Testing GET /api/hives...');
    const hivesRes = await fetch(`${BACKEND_URL}/hives`);
    const hivesJson = await hivesRes.json();
    console.log(`   Found ${hivesJson.data?.length || 0} hives.`);

    // 4. AI Anomaly Check for HIVE-005
    console.log('\n4. Testing GET /api/hives/HIVE-005/anomalies...');
    const anomalyRes = await fetch(`${BACKEND_URL}/hives/HIVE-005/anomalies`);
    console.log('   AI Anomaly Response:', await anomalyRes.json());

    // 5. Honey Passport Verification for Verified Batch HC-2026-0001
    console.log('\n5. Testing Honey Passport GET /api/passport/HC-2026-0001...');
    const passportVerifiedRes = await fetch(`${BACKEND_URL}/passport/HC-2026-0001`);
    const passportVerified = await passportVerifiedRes.json();
    console.log('   Verified Passport Status:', passportVerified.data?.verification?.provenanceStatus);

    // 6. Honey Passport Verification for Suspicious Batch HC-2026-0003
    console.log('\n6. Testing Honey Passport GET /api/passport/HC-2026-0003...');
    const passportSuspiciousRes = await fetch(`${BACKEND_URL}/passport/HC-2026-0003`);
    const passportSuspicious = await passportSuspiciousRes.json();
    console.log('   Suspicious Passport Status:', passportSuspicious.data?.verification?.provenanceStatus);

    console.log('\n✅ End-to-End Integration Test Completed Successfully!');
  } catch (err: any) {
    console.error('\n❌ Integration Test Error:', err.message);
  }
}

runE2eTest();
