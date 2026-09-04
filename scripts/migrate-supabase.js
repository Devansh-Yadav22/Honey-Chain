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
      INSERT INTO organizations (id, name, type, registration_number, contact_email, address, status)
      VALUES 
        ('ORG-ADMIN', 'Honey Chain National Authority', 'ADMIN', 'GOV-REG-001', 'admin@honeychain.io', 'New Delhi, India', 'APPROVED'),
        ('ORG-BEE-01', 'Himalayan Blossom Apiary', 'BEEKEEPER', 'BEE-REG-104', 'beekeeper@honeychain.io', 'Kullu Valley, Himachal Pradesh', 'APPROVED'),
        ('ORG-PROC-01', 'PureNectar Processing Facility', 'PROCESSOR', 'PROC-REG-205', 'processor@honeychain.io', 'Ambala Industrial Area, Haryana', 'APPROVED'),
        ('ORG-LOG-01', 'SwiftCold Chain Logistics', 'TRANSPORTER', 'LOG-REG-306', 'transporter@honeychain.io', 'Chandigarh Transport Hub', 'APPROVED'),
        ('ORG-PACK-01', 'Apex EcoPackaging Works', 'PACKAGER', 'PACK-REG-407', 'packager@honeychain.io', 'Baddi Packaging Zone, Himachal Pradesh', 'APPROVED'),
        ('ORG-LAB-01', 'AgriQuality Analytical Labs', 'QUALITY_LAB', 'LAB-REG-508', 'quality@honeychain.io', 'Mohali Biotech Park, Punjab', 'APPROVED')
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO users (id, email, full_name, role, organization_id, firebase_uid, status)
      VALUES 
        ('USR-ADMIN-01', 'admin@honeychain.io', 'Dr. Sarah Verma (Admin)', 'ADMIN', 'ORG-ADMIN', 'fuid-admin-demo-2026', 'ACTIVE'),
        ('USR-BEE-01', 'beekeeper@honeychain.io', 'Rajesh Sharma (Beekeeper)', 'BEEKEEPER', 'ORG-BEE-01', 'fuid-beekeeper-demo-2026', 'ACTIVE'),
        ('USR-PROC-01', 'processor@honeychain.io', 'Anil Gupta (Processor)', 'PROCESSOR', 'ORG-PROC-01', 'fuid-processor-demo-2026', 'ACTIVE'),
        ('USR-LOG-01', 'transporter@honeychain.io', 'Vikram Singh (Transporter)', 'TRANSPORTER', 'ORG-LOG-01', 'fuid-transporter-demo-2026', 'ACTIVE'),
        ('USR-PACK-01', 'packager@honeychain.io', 'Meera Patel (Packager)', 'PACKAGER', 'ORG-PACK-01', 'fuid-packager-demo-2026', 'ACTIVE'),
        ('USR-LAB-01', 'quality@honeychain.io', 'Dr. Priya Nair (Quality Analyst)', 'QUALITY_LAB', 'ORG-LAB-01', 'fuid-quality-demo-2026', 'ACTIVE')
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
