import fs from 'fs';
import path from 'path';
import { pool } from '../config/database';
import { seedDemoData } from './seed';

export async function initDb() {
  try {
    const candidates = [
      path.join(__dirname, 'schema.sql'),
      path.join(__dirname, '../../src/db/schema.sql'),
      path.join(__dirname, '../db/schema.sql'),
      path.resolve(process.cwd(), 'src/db/schema.sql'),
      path.resolve(process.cwd(), 'backend/src/db/schema.sql'),
      path.resolve(process.cwd(), 'dist/db/schema.sql'),
      path.resolve(process.cwd(), 'backend/dist/db/schema.sql'),
    ];
    const schemaPath = candidates.find((p) => fs.existsSync(p));

    if (schemaPath) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
      console.log('✅ PostgreSQL database connected and schema initialized successfully.');
      
      // Seed Demo Organizations and RBAC Users
      await seedDemoData();
    } else {
      console.warn('⚠️ schema.sql file not found in searched locations:', candidates);
    }
  } catch (err: any) {
    console.log('ℹ️ PostgreSQL database connection not available on port 5432 or init error:', err.message);
  }
}
