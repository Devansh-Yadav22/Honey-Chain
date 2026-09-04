import pg from 'pg';
import { config } from './env';

const { Pool } = pg;

const isRemoteDb = 
  config.databaseUrl.includes('supabase.co') || 
  config.databaseUrl.includes('pooler.supabase.com') || 
  config.databaseUrl.includes('render.com') || 
  config.databaseUrl.includes('sslmode=require') ||
  (config.env === 'production' && !config.databaseUrl.includes('localhost'));

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err: any) => {
  console.error('Unexpected error on idle database client', err);
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (config.env === 'development') {
      console.log('Executed query', { text: text.substring(0, 80), duration, rows: res.rowCount });
    }
    return res;
  } catch (err) {
    // Suppress verbose log when database is offline in fallback mode
    throw err;
  }
}
