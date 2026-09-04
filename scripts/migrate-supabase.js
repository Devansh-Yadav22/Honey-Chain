/**
 * Honey Chain Database Migration & Seed Runner for Supabase / PostgreSQL
 * 
 * Usage:
 *   DATABASE_URL="postgresql://postgres.[ref]:[pwd]@aws-0-[region].pooler.supabase.com:6543/postgres" node scripts/migrate-supabase.js
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL environment variable is required.');
  console.error('Example: DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres" node scripts/migrate-supabase.js');
  process.exit(1);
}

const isRemote = !databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
  connectionTimeoutMillis: 10000,
});

async function runMigration() {
  console.log('🔄 Connecting to target database...');
  const client = await pool.connect();
  
  try {
    console.log('📄 Reading schema.sql...');
    const schemaPath = path.resolve(__dirname, '../backend/src/db/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('🚀 Executing DDL schema statements...');
    await client.query(sql);
    console.log('✅ Schema tables, constraints, and indexes created successfully.');

    console.log('🌱 Seeding demo accounts and organizations...');
    // Execute default organizations and users directly
    await client.query(`
      INSERT INTO organizations (id, name, type, registration_no, contact_email, address, status)
      VALUES 
        ('org-admin-01', 'Honey Chain National Authority', 'ADMIN', 'GOV-REG-001', 'admin@honeychain.io', 'New Delhi, India', 'ACTIVE'),
        ('org-apiary-01', 'Himalayan Blossom Apiary', 'APIARY', 'BEE-REG-104', 'beekeeper@honeychain.io', 'Kullu Valley, Himachal Pradesh', 'ACTIVE'),
        ('org-proc-01', 'PureNectar Processing Facility', 'PROCESSOR', 'PROC-REG-205', 'processor@honeychain.io', 'Ambala Industrial Area, Haryana', 'ACTIVE'),
        ('org-log-01', 'SwiftCold Chain Logistics', 'LOGISTICS', 'LOG-REG-306', 'transporter@honeychain.io', 'Chandigarh Transport Hub', 'ACTIVE'),
        ('org-pack-01', 'Apex EcoPackaging Works', 'PACKAGING_FACILITY', 'PACK-REG-407', 'packager@honeychain.io', 'Baddi Packaging Zone, Himachal Pradesh', 'ACTIVE'),
        ('org-lab-01', 'AgriQuality Analytical Labs', 'QUALITY_LAB', 'LAB-REG-508', 'quality@honeychain.io', 'Mohali Biotech Park, Punjab', 'ACTIVE')
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO users (id, email, name, role, org_id, firebase_uid, status)
      VALUES 
        ('usr-admin-01', 'admin@honeychain.io', 'Dr. Sarah Verma (Admin)', 'ADMIN', 'org-admin-01', 'fuid-admin-demo-2026', 'ACTIVE'),
        ('usr-bee-01', 'beekeeper@honeychain.io', 'Rajesh Sharma (Beekeeper)', 'BEEKEEPER', 'org-apiary-01', 'fuid-beekeeper-demo-2026', 'ACTIVE'),
        ('usr-proc-01', 'processor@honeychain.io', 'Anil Gupta (Processor)', 'PROCESSOR', 'org-proc-01', 'fuid-processor-demo-2026', 'ACTIVE'),
        ('usr-log-01', 'transporter@honeychain.io', 'Vikram Singh (Transporter)', 'TRANSPORTER', 'org-log-01', 'fuid-transporter-demo-2026', 'ACTIVE'),
        ('usr-pack-01', 'packager@honeychain.io', 'Meera Patel (Packager)', 'PACKAGER', 'org-pack-01', 'fuid-packager-demo-2026', 'ACTIVE'),
        ('usr-lab-01', 'quality@honeychain.io', 'Dr. Priya Nair (Quality Analyst)', 'QUALITY_LAB', 'org-lab-01', 'fuid-quality-demo-2026', 'ACTIVE')
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('✅ Demo organizations and RBAC users seeded successfully.');
    console.log('🎉 Supabase database is ready for Honey Chain production backend!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
