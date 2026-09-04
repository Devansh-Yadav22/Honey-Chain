/**
 * Honey Chain — End-to-End Integration Verification Test
 * Flow: Hive -> Telemetry -> AI Health & Anomaly -> Harvest -> Batch -> Passport -> Verification
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';
const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

async function runE2eTest() {
  console.log('🐝 Starting Honey Chain End-to-End Integration Test...\n');
  let errors = 0;

  try {
    // 1. Backend Health Check
    console.log('1. Testing Backend Health Check...');
    const backendRes = await fetch(`${BACKEND_URL}/health`);
    const backendJson = await backendRes.json();
    console.log('   Backend Status:', backendRes.status, backendJson);
    if (backendRes.status !== 200 || backendJson.status !== 'ok') {
      console.error('   ❌ Backend Health Check Failed!');
      errors++;
    }

    // 2. AI Health Check
    console.log('\n2. Testing AI Service Root...');
    try {
      const aiRes = await fetch(`${AI_URL}/`);
      const aiJson = await aiRes.json();
      console.log('   AI Service Status:', aiRes.status, aiJson);
      if (aiRes.status !== 200 || aiJson.status !== 'ok') {
        console.warn('   ⚠️ Live AI Service returned non-ok status; backend will rely on rule engine fallback.');
      }
    } catch (err: any) {
      console.warn('   ⚠️ Live AI Service unavailable at port 8000; backend is operating in rule engine fallback mode.');
    }

    // 3. Hive Registry Query
    console.log('\n3. Testing GET /api/hives...');
    const hivesRes = await fetch(`${BACKEND_URL}/hives`);
    const hivesJson = await hivesRes.json();
    console.log(`   Found ${hivesJson.data?.length || 0} hives.`);
    if (hivesRes.status !== 200 || !Array.isArray(hivesJson.data) || hivesJson.data.length < 5) {
      console.error('   ❌ Hive Registry Test Failed!');
      errors++;
    }

    // 4. AI Anomaly Check for HIVE-005
    console.log('\n4. Testing GET /api/hives/HIVE-005/anomalies...');
    const anomalyRes = await fetch(`${BACKEND_URL}/hives/HIVE-005/anomalies`);
    const anomalyJson = await anomalyRes.json();
    console.log('   AI Anomaly Response:', anomalyJson);
    if (anomalyRes.status !== 200 || anomalyJson.data?.anomaly !== true || anomalyJson.data?.severity !== 'CRITICAL') {
      console.error('   ❌ AI Anomaly Check Failed!');
      errors++;
    }

    // 5. Honey Passport Verification for Verified Batch HC-2026-0001
    console.log('\n5. Testing Honey Passport GET /api/passport/HC-2026-0001...');
    const passportVerifiedRes = await fetch(`${BACKEND_URL}/passport/HC-2026-0001`);
    const passportVerified = await passportVerifiedRes.json();
    console.log('   Verified Passport Status:', passportVerified.data?.verification?.provenanceStatus);
    console.log('   Blockchain Verified:', passportVerified.data?.verification?.blockchainVerified);
    if (
      passportVerifiedRes.status !== 200 ||
      passportVerified.data?.verification?.provenanceStatus !== 'VERIFIED' ||
      passportVerified.data?.verification?.blockchainVerified !== true
    ) {
      console.error('   ❌ Verified Honey Passport Test Failed!');
      errors++;
    }

    // 6. Honey Passport Verification for Suspicious Batch HC-2026-0003
    console.log('\n6. Testing Honey Passport GET /api/passport/HC-2026-0003...');
    const passportSuspiciousRes = await fetch(`${BACKEND_URL}/passport/HC-2026-0003`);
    const passportSuspicious = await passportSuspiciousRes.json();
    console.log('   Suspicious Passport Status:', passportSuspicious.data?.verification?.provenanceStatus);
    if (
      passportSuspiciousRes.status !== 200 ||
      passportSuspicious.data?.verification?.provenanceStatus !== 'SUSPICIOUS' ||
      passportSuspicious.data?.verification?.anomalies?.length === 0
    ) {
      console.error('   ❌ Suspicious Honey Passport Test Failed!');
      errors++;
    }

    if (errors > 0) {
      console.error(`\n❌ End-to-End Integration Test Finished with ${errors} Errors.`);
      process.exit(1);
    } else {
      console.log('\n✅ End-to-End Integration Test Completed Successfully!');
    }
  } catch (err: any) {
    console.error('\n❌ Integration Test Fatal Error:', err.message);
    process.exit(1);
  }
}

runE2eTest();
