import { pool } from '../config/database';
import { LocationRecord } from '../types';

const memoryLocations: LocationRecord[] = [];

export class LocationService {
  /**
   * Calculates Great-Circle distance between two coordinates using the Haversine formula (km).
   */
  static calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  }

  static async recordLocation(data: {
    batchId: string;
    recordedBy: string;
    stage: string;
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
    isMocked?: boolean;
  }): Promise<LocationRecord> {
    const id = `LOC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newRecord: LocationRecord = {
      id,
      batchId: data.batchId,
      recordedBy: data.recordedBy,
      stage: data.stage,
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy,
      address: data.address,
      isMocked: data.isMocked || false,
      createdAt: new Date().toISOString()
    };

    memoryLocations.push(newRecord);

    try {
      await pool.query(
        `INSERT INTO location_records (id, batch_id, recorded_by, stage, latitude, longitude, accuracy, address, is_mocked)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [id, newRecord.batchId, newRecord.recordedBy, newRecord.stage, newRecord.latitude, newRecord.longitude, newRecord.accuracy || null, newRecord.address || null, newRecord.isMocked]
      );
    } catch (err) {
      // Memory fallback
    }

    return newRecord;
  }

  static async getLocationsForBatch(batchId: string): Promise<LocationRecord[]> {
    try {
      const result = await pool.query(
        `SELECT id, batch_id as "batchId", recorded_by as "recordedBy", stage, 
                latitude::float, longitude::float, accuracy::float, address, 
                is_mocked as "isMocked", created_at as "createdAt"
         FROM location_records 
         WHERE batch_id = $1 
         ORDER BY created_at ASC`,
        [batchId]
      );
      if (result.rows && result.rows.length > 0) {
        return result.rows;
      }
    } catch (err) {
      // Memory fallback
    }

    return memoryLocations
      .filter(l => l.batchId === batchId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
}
