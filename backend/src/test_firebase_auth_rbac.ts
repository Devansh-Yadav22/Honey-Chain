import express from 'express';
import { authenticate, requireAuth, requireRoles, requireTenant, AuthenticatedRequest } from './middleware/auth';
import { UserService } from './services/user.service';
import { batchRouter } from './routes/batch.routes';
import { qualityRouter } from './routes/quality.routes';
import { adminRouter } from './routes/admin.routes';
import hiveRoutes from './routes/hive.routes';
import passportRoutes from './routes/passport.routes';
import { Role } from './types';

async function runFirebaseAuthRbacTests() {
  console.log('🧪 Starting Comprehensive Firebase Auth & RBAC Test Suite (A-L)...\n');
  let passed = 0;
  let total = 0;

  function assert(cond: boolean, code: string, desc: string) {
    total++;
    if (cond) {
      console.log(`  ✅ [PASS] [Test ${code}] ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] [Test ${code}] ${desc}`);
    }
  }

  // Setup test Express app with real routes
  const app = express();
  app.use(express.json());

  app.use('/api/hives', hiveRoutes);
  app.use('/api/batches', batchRouter);
  app.use('/api/quality', qualityRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/passport', passportRoutes);

  // Tenant test endpoint
  app.post('/api/tenant-test/:orgId', authenticate, requireTenant, (req: AuthenticatedRequest, res) => {
    res.json({ success: true, message: `Access granted for org ${req.params.orgId}` });
  });

  const server = app.listen(0);
  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}`;

  try {
    // -------------------------------------------------------------
    // Test A: Unauthenticated request -> 401 Unauthorized
    // -------------------------------------------------------------
    const resA = await fetch(`${baseUrl}/api/admin/overview`);
    assert(resA.status === 401, 'A', 'Unauthenticated request to protected route returns 401 Unauthorized');

    // -------------------------------------------------------------
    // Test B: Beekeeper authenticated -> can access beekeeper APIs
    // -------------------------------------------------------------
    const beekeeperToken = 'test-token-fb-uid-beekeeper-01';
    const resB_Hive = await fetch(`${baseUrl}/api/hives`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${beekeeperToken}`,
      },
      body: JSON.stringify({
        id: `HIVE-TEST-${Date.now()}`,
        location: { lat: 30.1, lng: 79.2, address: 'Test Apiary' }
      })
    });
    assert(resB_Hive.status === 200 || resB_Hive.status === 201, 'B', 'Beekeeper can create hive (POST /api/hives)');

    const resB_Batch = await fetch(`${baseUrl}/api/batches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${beekeeperToken}`,
      },
      body: JSON.stringify({
        id: `HC-TEST-${Date.now()}`,
        quantity: 50,
        origin: 'Himalayan Ridge'
      })
    });
    assert(resB_Batch.status === 200 || resB_Batch.status === 201, 'B', 'Beekeeper can create batch (POST /api/batches)');

    // -------------------------------------------------------------
    // Test C: Beekeeper -> Processor API -> 403 Forbidden
    // -------------------------------------------------------------
    const resC = await fetch(`${baseUrl}/api/batches/HC-2026-0001/processing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${beekeeperToken}`,
      },
      body: JSON.stringify({
        eventType: 'MOISTURE_EXTRACTION',
        temperatureCelsius: 38
      })
    });
    assert(resC.status === 403, 'C', 'Beekeeper attempting Processor operation returns 403 Forbidden');

    // -------------------------------------------------------------
    // Test D: Processor -> Packaging API -> 403 Forbidden
    // -------------------------------------------------------------
    const processorToken = 'test-token-fb-uid-processor-01';
    const resD = await fetch(`${baseUrl}/api/batches/HC-2026-0001/packaging`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${processorToken}`,
      },
      body: JSON.stringify({
        productId: 'JAR-500G-001',
        unitsCount: 100
      })
    });
    assert(resD.status === 403, 'D', 'Processor attempting Packaging operation returns 403 Forbidden');

    // -------------------------------------------------------------
    // Test E: Quality Lab -> Quality test API -> Allowed (200 / 201)
    // -------------------------------------------------------------
    const labToken = 'test-token-fb-uid-lab-01';
    const resE = await fetch(`${baseUrl}/api/quality/tests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${labToken}`,
      },
      body: JSON.stringify({
        batchId: 'HC-2026-0001',
        sampleId: 'SMP-TEST-001',
        labName: 'FSSAI Certified Apex Quality Labs',
        testerName: 'Dr. Priya Nair',
        parameters: {
          moisturePercent: 17.5,
          hmfMgPerKg: 15.0,
          sucrosePercent: 2.1,
          pollenCountPerGram: 32000,
          antibioticResidue: 'NEGATIVE',
          leadPpm: 0.01
        }
      })
    });
    assert(resE.status === 200 || resE.status === 201, 'E', 'Quality Lab submitting lab test is allowed (200/201)');

    // -------------------------------------------------------------
    // Test F: Non-Admin -> Admin API -> 403 Forbidden
    // -------------------------------------------------------------
    const resF = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: {
        'Authorization': `Bearer ${beekeeperToken}`,
      }
    });
    assert(resF.status === 403, 'F', 'Non-admin attempting Admin overview returns 403 Forbidden');

    const adminToken = 'test-token-fb-uid-admin-01';
    const resF_Admin = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      }
    });
    assert(resF_Admin.status === 200, 'F', 'Admin accessing Admin overview returns 200 OK');

    // -------------------------------------------------------------
    // Test G: Tenant Isolation -> Cross-Org Access Denied (403)
    // -------------------------------------------------------------
    // Beekeeper belongs to 'org-apiary-01'. Attempting access to 'org-proc-01' should fail
    const resG_Denied = await fetch(`${baseUrl}/api/tenant-test/org-proc-01`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${beekeeperToken}`,
      }
    });
    assert(resG_Denied.status === 403, 'G', 'User from Org A accessing Org B private resource returns 403 Forbidden');

    const resG_Allowed = await fetch(`${baseUrl}/api/tenant-test/org-apiary-01`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${beekeeperToken}`,
      }
    });
    assert(resG_Allowed.status === 200, 'G', 'User accessing own organization resource returns 200 OK');

    // -------------------------------------------------------------
    // Test H: Logout / Missing Token -> Protected Route Inaccessible
    // -------------------------------------------------------------
    const resH = await fetch(`${baseUrl}/api/batches/HC-2026-0001/intake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // No Authorization header
      }
    });
    assert(resH.status === 401, 'H', 'Unauthenticated request after logout cannot access protected endpoints (401)');

    // -------------------------------------------------------------
    // Test I: Session Token Verification
    // -------------------------------------------------------------
    const userFromToken = await UserService.getByFirebaseUid('fb-uid-beekeeper-01');
    assert(Boolean(userFromToken && userFromToken.role === 'BEEKEEPER'), 'I', 'Verified token UID maps deterministically to PostgreSQL user profile');

    // -------------------------------------------------------------
    // Test J: Invalid Firebase Token -> 401 Unauthorized
    // -------------------------------------------------------------
    const resJ = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: {
        'Authorization': `Bearer invalid-malformed-jwt-token-xyz`,
      }
    });
    assert(resJ.status === 401, 'J', 'Invalid or forged Firebase token returns 401 Unauthorized');

    // -------------------------------------------------------------
    // Test K: Suspended / Pending Account -> Protected Operation Denied (403)
    // -------------------------------------------------------------
    const suspendedToken = 'test-token-fb-uid-suspended-01';
    const resK = await fetch(`${baseUrl}/api/hives`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${suspendedToken}`,
      },
      body: JSON.stringify({
        id: 'HIVE-SUSPENDED-TEST',
        location: { lat: 30.1, lng: 79.2, address: 'Suspended Apiary' }
      })
    });
    assert(resK.status === 403, 'K', 'Suspended account attempting protected operation returns 403 Forbidden');

    // -------------------------------------------------------------
    // Test L: Public Passport remains accessible without login
    // -------------------------------------------------------------
    const resL = await fetch(`${baseUrl}/api/passport/HC-2026-0001`);
    assert(resL.status === 200, 'L', 'Public Passport GET /api/passport/:batchId is accessible without any token (200 OK)');

    console.log(`\n============================================================`);
    console.log(`🎯 Test Summary: ${passed}/${total} Auth & RBAC Assertions Passed`);
    console.log(`============================================================\n`);
  } finally {
    server.close();
  }
}

runFirebaseAuthRbacTests().catch((err) => {
  console.error('Fatal error running Firebase Auth test suite:', err);
  process.exit(1);
});
