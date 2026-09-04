import { TelemetryPayload, TelemetryRecord } from '../types';
import { memoryStore } from './store';
import { query } from '../config/database';

export async function saveTelemetry(payload: TelemetryPayload): Promise<TelemetryRecord> {
  const record: TelemetryRecord = {
    hiveId: payload.hiveId,
    temperature: payload.telemetry.temperature,
    humidity: payload.telemetry.humidity,
    weight: payload.telemetry.weight,
    activity: payload.telemetry.activity,
    timestamp: payload.timestamp || new Date().toISOString()
  };

  try {
    await query(
      'INSERT INTO telemetry (hive_id, temperature, humidity, weight, activity, timestamp) VALUES ($1, $2, $3, $4, $5, $6)',
      [record.hiveId, record.temperature, record.humidity, record.weight, record.activity, record.timestamp]
    );
  } catch (e) {
    // Fallback to memory store
  }

  const list = memoryStore.telemetry.get(record.hiveId) || [];
  list.push(record);
  memoryStore.telemetry.set(record.hiveId, list);

  return record;
}

export async function getTelemetryByHiveId(hiveId: string, limit = 50): Promise<TelemetryRecord[]> {
  try {
    const res = await query('SELECT * FROM telemetry WHERE hive_id = $1 ORDER BY timestamp DESC LIMIT $2', [hiveId, limit]);
    if (res.rows.length > 0) {
      return res.rows.map((r: any) => ({
        id: r.id,
        hiveId: r.hive_id,
        temperature: parseFloat(r.temperature),
        humidity: parseFloat(r.humidity),
        weight: parseFloat(r.weight),
        activity: parseFloat(r.activity),
        timestamp: r.timestamp
      }));
    }
  } catch (e) {
    // Fallback to memory store
  }

  const list = memoryStore.telemetry.get(hiveId) || [];
  return list.slice(-limit);
}
