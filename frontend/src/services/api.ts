import { Hive, TelemetryRecord, Batch, HoneyPassport, AiHealth, AiAnomaly } from '../types/index.js';

const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE = (import.meta as any).env?.VITE_API_URL || `http://${hostname}:5000/api`;

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.warn(`[API Client] Fetch failed for ${url}:`, err);
    return null;
  }
}

// Demo fallback data
const MOCK_HIVES: Hive[] = [
  { id: 'HIVE-001', beekeeperId: 'BK-001', location: { lat: 28.6139, lng: 77.2090, address: 'New Delhi Apiary #1' }, status: 'ACTIVE' },
  { id: 'HIVE-002', beekeeperId: 'BK-001', location: { lat: 28.6150, lng: 77.2100, address: 'New Delhi Apiary #2' }, status: 'ACTIVE' },
  { id: 'HIVE-003', beekeeperId: 'BK-002', location: { lat: 30.7333, lng: 76.7794, address: 'Chandigarh Apiary #1' }, status: 'WARNING' },
  { id: 'HIVE-004', beekeeperId: 'BK-002', location: { lat: 30.7350, lng: 76.7800, address: 'Chandigarh Apiary #2' }, status: 'ACTIVE' },
  { id: 'HIVE-005', beekeeperId: 'BK-003', location: { lat: 31.6340, lng: 74.8723, address: 'Amritsar Apiary #1' }, status: 'CRITICAL' },
];

const MOCK_BATCHES: Batch[] = [
  {
    id: 'HC-2026-0001',
    harvestId: 'HARVEST-001',
    quantity: 18.0,
    origin: 'New Delhi Apiary #1 (HIVE-001)',
    status: 'VERIFIED',
    blockchainTxId: '0x8f3c7e9a2b4d1056ef8a9c3b7e4f1a2d',
    blockchainStatus: 'CONFIRMED',
    createdAt: '2026-08-20T11:00:00Z',
    harvest: { id: 'HARVEST-001', hiveId: 'HIVE-001', harvestDate: '2026-08-20T10:00:00Z', quantity: 18.0 }
  },
  {
    id: 'HC-2026-0002',
    harvestId: 'HARVEST-002',
    quantity: 25.0,
    origin: 'New Delhi Apiary #2 (HIVE-002)',
    status: 'VERIFIED',
    blockchainTxId: '0x9a4b5c6d7e8f90123456789abcdef012',
    blockchainStatus: 'CONFIRMED',
    createdAt: '2026-08-21T09:15:00Z'
  },
  {
    id: 'HC-2026-0003',
    harvestId: 'HARVEST-003',
    quantity: 31.0,
    origin: 'Chandigarh Apiary #1 (HIVE-003)',
    status: 'SUSPICIOUS',
    blockchainTxId: '0x123456789abcdef0123456789abcdef0',
    blockchainStatus: 'CONFIRMED',
    createdAt: '2026-08-22T16:00:00Z',
    harvest: { id: 'HARVEST-003', hiveId: 'HIVE-003', harvestDate: '2026-08-22T14:30:00Z', quantity: 18.0 }
  }
];

export async function getHives(): Promise<Hive[]> {
  const data = await fetchJson<Hive[]>(`${API_BASE}/hives`);
  return data || MOCK_HIVES;
}

export async function getHiveById(id: string): Promise<Hive | null> {
  const data = await fetchJson<Hive>(`${API_BASE}/hives/${id}`);
  return data || MOCK_HIVES.find(h => h.id === id) || null;
}

export async function getHiveTelemetry(hiveId: string): Promise<TelemetryRecord[]> {
  const data = await fetchJson<TelemetryRecord[]>(`${API_BASE}/hives/${hiveId}/telemetry`);
  if (data && data.length > 0) return data;

  // Mock time-series
  const now = Date.now();
  return Array.from({ length: 10 }).map((_, i) => ({
    hiveId,
    temperature: hiveId === 'HIVE-005' ? 40.5 + i * 0.2 : 34.2 + (Math.sin(i) * 0.8),
    humidity: hiveId === 'HIVE-005' ? 78 + i : 60 + (Math.cos(i) * 2),
    weight: 42.5 - (i * 0.1),
    activity: hiveId === 'HIVE-005' ? 0.18 : 0.82 + (Math.sin(i) * 0.05),
    timestamp: new Date(now - (9 - i) * 300000).toISOString()
  }));
}

export async function getHiveHealth(hiveId: string): Promise<AiHealth> {
  const data = await fetchJson<AiHealth>(`${API_BASE}/hives/${hiveId}/health`);
  if (data) return data;
  if (hiveId === 'HIVE-005') return { health: 'CRITICAL', healthScore: 35 };
  if (hiveId === 'HIVE-003') return { health: 'WARNING', healthScore: 68 };
  return { health: 'NORMAL', healthScore: 94 };
}

export async function getHiveAnomalies(hiveId: string): Promise<AiAnomaly> {
  const data = await fetchJson<AiAnomaly>(`${API_BASE}/hives/${hiveId}/anomalies`);
  if (data) return data;
  if (hiveId === 'HIVE-005') return { anomaly: true, severity: 'CRITICAL', reasons: ['High temp (>40°C)', 'Bee activity loss'] };
  if (hiveId === 'HIVE-003') return { anomaly: true, severity: 'HIGH', reasons: ['Elevated temp', 'High humidity'] };
  return { anomaly: false, severity: 'NONE', reasons: [] };
}

export async function getBatches(): Promise<Batch[]> {
  const data = await fetchJson<Batch[]>(`${API_BASE}/batches`);
  return data || MOCK_BATCHES;
}

export async function getBatchById(id: string): Promise<Batch | null> {
  const data = await fetchJson<Batch>(`${API_BASE}/batches/${id}`);
  return data || MOCK_BATCHES.find(b => b.id === id) || null;
}

export async function getHoneyPassport(batchId: string): Promise<HoneyPassport | null> {
  const data = await fetchJson<HoneyPassport>(`${API_BASE}/passport/${batchId}`);
  if (data) return data;

  const batch = MOCK_BATCHES.find(b => b.id === batchId);
  if (!batch) return null;

  const isSuspicious = batchId === 'HC-2026-0003';
  return {
    batchId: batch.id,
    origin: batch.origin,
    quantity: batch.quantity,
    status: batch.status,
    createdAt: batch.createdAt || new Date().toISOString(),
    hive: { id: 'HIVE-001', location: { lat: 28.6139, lng: 77.2090, address: 'New Delhi Apiary #1' } },
    harvest: batch.harvest,
    timeline: {
      harvest: batch.harvest,
      processing: [{ id: 'PROC-1', batchId, processorId: 'PROC-DELHI-01', eventType: 'FILTERING_MOISTURE_CONTROL', timestamp: '2026-08-21T08:00:00Z' }],
      transport: [{ id: 'TRANS-1', batchId, transporterId: 'LOGISTICS-01', source: 'Delhi Apiary', destination: 'Central Packaging', timestamp: '2026-08-21T12:00:00Z' }],
      packaging: [{ id: 'PKG-1', batchId, packagerId: 'PACK-DELHI', productId: 'PURE-HONEY-500G', packagingDate: '2026-08-22T09:00:00Z' }]
    },
    verification: {
      blockchainVerified: true,
      blockchainTxId: batch.blockchainTxId,
      provenanceStatus: isSuspicious ? 'SUSPICIOUS' : 'VERIFIED',
      consistencyScore: isSuspicious ? 0.24 : 0.97,
      anomalies: isSuspicious ? [
        'Recorded harvest quantity (18 kg) differs from observed batch quantity (31 kg).',
        'Potential bulk volume adulteration flagged by AI Evidence Engine.'
      ] : []
    }
  };
}
