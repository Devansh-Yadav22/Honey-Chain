import bcrypt from 'bcryptjs';
import { pool } from '../config/database';
import { Role } from '../types';

export const DEMO_PASSWORD = 'HoneyChain@2026!';

export interface DemoOrg {
  id: string;
  name: string;
  type: any;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
  registrationNo: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
}

export interface DemoUser {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: Role;
  orgId: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED' | 'REJECTED';
  phone: string;
  createdAt: string;
}

export const DEMO_ORGANIZATIONS: DemoOrg[] = [
  {
    id: 'org-admin-01',
    name: 'Honey Chain National Authority',
    type: 'ADMIN',
    status: 'ACTIVE',
    registrationNo: 'REG-IND-GOV-001',
    address: 'Krishi Bhawan, New Delhi, India',
    contactEmail: 'admin@honeychain.demo',
    contactPhone: '+91 11 2338 2011',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'org-apiary-01',
    name: 'Himalayan Pure Apiaries',
    type: 'APIARY',
    status: 'ACTIVE',
    registrationNo: 'REG-UK-API-1029',
    address: 'Nainital Valley Road, Uttarakhand, India',
    contactEmail: 'beekeeper@honeychain.demo',
    contactPhone: '+91 98765 43210',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'org-proc-01',
    name: 'NectarPure Processing Facilities',
    type: 'PROCESSOR',
    status: 'ACTIVE',
    registrationNo: 'REG-UK-PROC-304',
    address: 'Industrial Area Phase 1, Haridwar, Uttarakhand',
    contactEmail: 'processor@honeychain.demo',
    contactPhone: '+91 98765 43211',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'org-log-01',
    name: 'ColdRoute Agro Logistics',
    type: 'LOGISTICS',
    status: 'ACTIVE',
    registrationNo: 'REG-DEL-LOG-891',
    address: 'Logistics Hub Sector 18, Gurugram, Haryana',
    contactEmail: 'transporter@honeychain.demo',
    contactPhone: '+91 98765 43212',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'org-pack-01',
    name: 'EcoPack Honey Packaging Ltd',
    type: 'PACKAGING_FACILITY',
    status: 'ACTIVE',
    registrationNo: 'REG-UP-PACK-552',
    address: 'Agro Park Industrial Estate, Noida, Uttar Pradesh',
    contactEmail: 'packager@honeychain.demo',
    contactPhone: '+91 98765 43213',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'org-lab-01',
    name: 'FSSAI Certified Apex Quality Labs',
    type: 'QUALITY_LAB',
    status: 'ACTIVE',
    registrationNo: 'REG-FSSAI-LAB-007',
    address: 'FDA Bhawan, Kotla Road, New Delhi',
    contactEmail: 'lab@honeychain.demo',
    contactPhone: '+91 98765 43214',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'org-pending-01',
    name: 'Valley Bloom Honey Cooperative',
    type: 'APIARY',
    status: 'PENDING',
    registrationNo: 'REG-HP-API-9901',
    address: 'Kullu Valley, Himachal Pradesh',
    contactEmail: 'coop@valleybloom.in',
    contactPhone: '+91 94180 12345',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'usr-admin-01',
    firebaseUid: 'fb-uid-admin-01',
    email: 'admin@honeychain.demo',
    name: 'Dr. Rajesh Sharma (Authority Admin)',
    role: 'ADMIN',
    orgId: 'org-admin-01',
    status: 'ACTIVE',
    phone: '+91 99000 11001',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-beekeeper-01',
    firebaseUid: 'fb-uid-beekeeper-01',
    email: 'beekeeper@honeychain.demo',
    name: 'Ramesh Singh (Master Beekeeper)',
    role: 'BEEKEEPER',
    orgId: 'org-apiary-01',
    status: 'ACTIVE',
    phone: '+91 98765 43210',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-processor-01',
    firebaseUid: 'fb-uid-processor-01',
    email: 'processor@honeychain.demo',
    name: 'Anita Verma (Chief Processor)',
    role: 'PROCESSOR',
    orgId: 'org-proc-01',
    status: 'ACTIVE',
    phone: '+91 98765 43211',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-transporter-01',
    firebaseUid: 'fb-uid-transporter-01',
    email: 'transporter@honeychain.demo',
    name: 'Vikram Malhotra (Lead Logistics Officer)',
    role: 'TRANSPORTER',
    orgId: 'org-log-01',
    status: 'ACTIVE',
    phone: '+91 98765 43212',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-packager-01',
    firebaseUid: 'fb-uid-packager-01',
    email: 'packager@honeychain.demo',
    name: 'Suresh Patel (Packaging Lead)',
    role: 'PACKAGER',
    orgId: 'org-pack-01',
    status: 'ACTIVE',
    phone: '+91 98765 43213',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-lab-01',
    firebaseUid: 'fb-uid-lab-01',
    email: 'lab@honeychain.demo',
    name: 'Dr. Priya Nair (Senior Quality Analyst)',
    role: 'QUALITY_LAB',
    orgId: 'org-lab-01',
    status: 'ACTIVE',
    phone: '+91 98765 43214',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-pending-01',
    firebaseUid: 'fb-uid-pending-01',
    email: 'applicant@valleybloom.in',
    name: 'Sunil Thakur (Co-op Rep)',
    role: 'BEEKEEPER',
    orgId: 'org-pending-01',
    status: 'PENDING',
    phone: '+91 94180 54321',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-suspended-01',
    firebaseUid: 'fb-uid-suspended-01',
    email: 'suspended@honeychain.demo',
    name: 'Devendra Kumar (Suspended Account)',
    role: 'BEEKEEPER',
    orgId: 'org-apiary-01',
    status: 'SUSPENDED',
    phone: '+91 98765 43299',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export async function seedDemoData() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, salt);

  try {
    // 1. Insert Organizations
    for (const org of DEMO_ORGANIZATIONS) {
      await pool.query(
        `INSERT INTO organizations (id, name, type, status, registration_no, address, contact_email, contact_phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           type = EXCLUDED.type,
           status = EXCLUDED.status,
           registration_no = EXCLUDED.registration_no,
           address = EXCLUDED.address,
           contact_email = EXCLUDED.contact_email,
           contact_phone = EXCLUDED.contact_phone`,
        [org.id, org.name, org.type, org.status, org.registrationNo, org.address, org.contactEmail, org.contactPhone]
      );
    }

    // 2. Insert Users
    for (const u of DEMO_USERS) {
      await pool.query(
        `INSERT INTO users (id, firebase_uid, email, name, password_hash, role, org_id, status, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           firebase_uid = EXCLUDED.firebase_uid,
           email = EXCLUDED.email,
           name = EXCLUDED.name,
           password_hash = EXCLUDED.password_hash,
           role = EXCLUDED.role,
           org_id = EXCLUDED.org_id,
           status = EXCLUDED.status,
           phone = EXCLUDED.phone`,
        [u.id, u.firebaseUid, u.email, u.name, passwordHash, u.role, u.orgId, u.status, u.phone]
      );
    }

    // 3. Ensure a Beekeeper record exists matching the beekeeper user
    await pool.query(
      `INSERT INTO beekeepers (id, name, contact, location)
       VALUES ('BK-001', 'Ramesh Singh (Master Beekeeper)', '+91 98765 43210', 'Uttarakhand High Apiary 4')
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         contact = EXCLUDED.contact,
         location = EXCLUDED.location`
    );

    // 4. Ensure an initial Hive exists
    await pool.query(
      `INSERT INTO hives (id, beekeeper_id, location, status)
       VALUES ('HIVE-001', 'BK-001', '{"lat": 30.0668, "lng": 79.0193, "address": "Nainital Apiary Complex"}'::jsonb, 'ACTIVE')
       ON CONFLICT (id) DO NOTHING`
    );

    console.log('✅ PostgreSQL demo organizations and RBAC users seeded successfully.');
  } catch (err: any) {
    console.error('⚠️ Failed seeding PostgreSQL demo data:', err.message);
  }
}
