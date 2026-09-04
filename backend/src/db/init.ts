import fs from 'fs';
import path from 'path';
import { pool } from '../config/database';
import { seedDemoData } from './seed';

export async function initDb() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
      console.log('✅ PostgreSQL database connected and schema initialized successfully.');
      
      // Seed Demo Organizations and RBAC Users
      await seedDemoData();
    } else {
      console.warn('⚠️ schema.sql file not found at:', schemaPath);
    }
  } catch (err: any) {
    console.log('ℹ️ PostgreSQL database connection not available on port 5432 or init error:', err.message);
  }
}
