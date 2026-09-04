import { Hive } from '../types';
import { memoryStore } from './store';
import { query } from '../config/database';

export async function createHive(hive: Hive): Promise<Hive> {
  try {
    await query(
      'INSERT INTO hives (id, beekeeper_id, location, status) VALUES ($1, $2, $3, $4)',
      [hive.id, hive.beekeeperId, JSON.stringify(hive.location), hive.status || 'ACTIVE']
    );
  } catch (e) {
    // Fallback to memory store
  }
  memoryStore.hives.set(hive.id, hive);
  return hive;
}

export async function getAllHives(): Promise<Hive[]> {
  try {
    const res = await query('SELECT * FROM hives ORDER BY created_at DESC');
    if (res.rows.length > 0) {
      return res.rows.map((r: any) => ({
        id: r.id,
        beekeeperId: r.beekeeper_id,
        location: typeof r.location === 'string' ? JSON.parse(r.location) : r.location,
        status: r.status,
        installationDate: r.installation_date,
        createdAt: r.created_at
      }));
    }
  } catch (e) {
    // Fallback to memory store
  }
  return Array.from(memoryStore.hives.values());
}

export async function getHiveById(id: string): Promise<Hive | null> {
  try {
    const res = await query('SELECT * FROM hives WHERE id = $1', [id]);
    if (res.rows.length > 0) {
      const r = res.rows[0];
      return {
        id: r.id,
        beekeeperId: r.beekeeper_id,
        location: typeof r.location === 'string' ? JSON.parse(r.location) : r.location,
        status: r.status,
        installationDate: r.installation_date,
        createdAt: r.created_at
      };
    }
  } catch (e) {
    // Fallback to memory store
  }
  return memoryStore.hives.get(id) || null;
}
