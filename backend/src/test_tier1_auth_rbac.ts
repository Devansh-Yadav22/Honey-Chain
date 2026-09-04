import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { OrganizationService } from './services/organization.service';
import { DEMO_PASSWORD } from './db/seed';

async function runAuthRbacTests() {
  console.log('🧪 Starting Tier 1 Auth & RBAC Test Suite...\n');
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

  // 1. Multi-role authentication
  const roleEmailMap: Record<string, string> = {
    ADMIN: 'admin@honeychain.demo',
    BEEKEEPER: 'beekeeper@honeychain.demo',
    PROCESSOR: 'processor@honeychain.demo',
    TRANSPORTER: 'transporter@honeychain.demo',
    PACKAGER: 'packager@honeychain.demo',
    QUALITY_LAB: 'lab@honeychain.demo'
  };
  for (const [r, email] of Object.entries(roleEmailMap)) {
    try {
      const auth = await AuthService.login(email, DEMO_PASSWORD);
      assert(auth.user.role === r && Boolean(auth.token), `Authenticated ${r} (${email}) with valid token`);
    } catch (e: any) {
      assert(false, `Authenticated ${r} (${email}): ${e.message}`);
    }
  }

  // 2. Organization Multi-Tenancy
  const orgs = await OrganizationService.getAll();
  assert(orgs.length >= 6, `Organization registry holds ${orgs.length} multi-tenant entities`);

  const pendingOrg = orgs.find(o => o.status === 'PENDING');
  assert(Boolean(pendingOrg), 'Pending organization present in onboarding queue');

  // 3. Admin status update
  if (pendingOrg) {
    const approved = await OrganizationService.updateStatus(pendingOrg.id, 'ACTIVE');
    assert(approved?.status === 'ACTIVE', 'Admin successfully approved pending organization');
    // Restore
    await OrganizationService.updateStatus(pendingOrg.id, 'PENDING');
  }

  console.log(`\n============================================================`);
  console.log(`🎯 Tier 1 Test Summary: ${passed}/${total} Tests Passed`);
  console.log(`============================================================\n`);
}

runAuthRbacTests().catch(console.error);
