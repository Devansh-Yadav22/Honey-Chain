import { Hive, TelemetryRecord, Harvest, Batch, ProcessingEvent, TransportEvent, PackagingEvent } from '../types/index.js';

// In-Memory Seed Store for fallback and high performance demo mode
export const memoryStore = {
  hives: new Map<string, Hive>([
    ['HIVE-001', { id: 'HIVE-001', beekeeperId: 'BK-001', location: { lat: 28.6139, lng: 77.2090, address: 'New Delhi, India' }, status: 'ACTIVE', installationDate: '2025-01-15T00:00:00Z' }],
    ['HIVE-002', { id: 'HIVE-002', beekeeperId: 'BK-001', location: { lat: 28.6150, lng: 77.2100, address: 'New Delhi, India' }, status: 'ACTIVE', installationDate: '2025-02-01T00:00:00Z' }],
    ['HIVE-003', { id: 'HIVE-003', beekeeperId: 'BK-002', location: { lat: 30.7333, lng: 76.7794, address: 'Chandigarh, India' }, status: 'WARNING', installationDate: '2025-03-10T00:00:00Z' }],
    ['HIVE-004', { id: 'HIVE-004', beekeeperId: 'BK-002', location: { lat: 30.7350, lng: 76.7800, address: 'Chandigarh, India' }, status: 'ACTIVE', installationDate: '2025-04-05T00:00:00Z' }],
    ['HIVE-005', { id: 'HIVE-005', beekeeperId: 'BK-003', location: { lat: 31.6340, lng: 74.8723, address: 'Amritsar, Punjab' }, status: 'CRITICAL', installationDate: '2025-05-12T00:00:00Z' }],
  ]),

  telemetry: new Map<string, TelemetryRecord[]>([
    ['HIVE-001', [
      { hiveId: 'HIVE-001', temperature: 34.2, humidity: 61.0, weight: 42.7, activity: 0.84, timestamp: new Date(Date.now() - 3600000).toISOString() },
      { hiveId: 'HIVE-001', temperature: 34.5, humidity: 60.5, weight: 42.8, activity: 0.86, timestamp: new Date().toISOString() },
    ]],
    ['HIVE-003', [
      { hiveId: 'HIVE-003', temperature: 39.1, humidity: 78.4, weight: 35.0, activity: 0.32, timestamp: new Date().toISOString() },
    ]],
    ['HIVE-005', [
      { hiveId: 'HIVE-005', temperature: 41.5, humidity: 82.0, weight: 28.2, activity: 0.15, timestamp: new Date().toISOString() },
    ]],
  ]),

  harvests: new Map<string, Harvest>([
    ['HARVEST-001', { id: 'HARVEST-001', hiveId: 'HIVE-001', beekeeperId: 'BK-001', harvestDate: '2026-08-20T10:00:00Z', quantity: 18.0, location: { lat: 28.6139, lng: 77.2090 }, notes: 'Summer mustard honey harvest' }],
    ['HARVEST-003', { id: 'HARVEST-003', hiveId: 'HIVE-003', beekeeperId: 'BK-002', harvestDate: '2026-08-22T14:30:00Z', quantity: 18.0, location: { lat: 30.7333, lng: 76.7794 }, notes: 'Eucalyptus honey harvest' }],
  ]),

  batches: new Map<string, Batch>([
    ['HC-2026-0001', {
      id: 'HC-2026-0001',
      harvestId: 'HARVEST-001',
      quantity: 18.0,
      origin: 'New Delhi Apiary #1 (HIVE-001)',
      status: 'VERIFIED',
      blockchainTxId: '0x8f3c7e9a2b4d1056ef8a9c3b7e4f1a2d',
      blockchainStatus: 'CONFIRMED',
      createdAt: '2026-08-20T11:00:00Z'
    }],
    ['HC-2026-0002', {
      id: 'HC-2026-0002',
      harvestId: 'HARVEST-001',
      quantity: 25.0,
      origin: 'New Delhi Apiary #2 (HIVE-002)',
      status: 'VERIFIED',
      blockchainTxId: '0x9a4b5c6d7e8f90123456789abcdef012',
      blockchainStatus: 'CONFIRMED',
      createdAt: '2026-08-21T09:15:00Z'
    }],
    ['HC-2026-0003', {
      id: 'HC-2026-0003',
      harvestId: 'HARVEST-003',
      quantity: 31.0, // Suspicious quantity mismatch (18kg recorded vs 31kg observed)
      origin: 'Chandigarh Apiary #1 (HIVE-003)',
      status: 'SUSPICIOUS',
      blockchainTxId: '0x123456789abcdef0123456789abcdef0',
      blockchainStatus: 'CONFIRMED',
      createdAt: '2026-08-22T16:00:00Z'
    }]
  ]),

  processingEvents: new Map<string, ProcessingEvent[]>([
    ['HC-2026-0001', [
      { id: 'PROC-001', batchId: 'HC-2026-0001', processorId: 'PROC-DELHI-01', eventType: 'MOISTURE_EXTRACTION_FILTERING', details: { temperature: 38.0, moistureContent: '17.2%' }, timestamp: '2026-08-21T08:00:00Z' }
    ]],
    ['HC-2026-0003', [
      { id: 'PROC-003', batchId: 'HC-2026-0003', processorId: 'PROC-CHANDIGARH-01', eventType: 'BULK_BLENDING', details: { moistureContent: '21.5%' }, timestamp: '2026-08-23T09:30:00Z' }
    ]]
  ]),

  transportEvents: new Map<string, TransportEvent[]>([
    ['HC-2026-0001', [
      { id: 'TRANS-001', batchId: 'HC-2026-0001', transporterId: 'LOGISTICS-EXPRESS-01', source: 'New Delhi Apiary #1', destination: 'Central Processing Hub', timestamp: '2026-08-21T12:30:00Z' }
    ]],
    ['HC-2026-0003', [
      { id: 'TRANS-003', batchId: 'HC-2026-0003', transporterId: 'LOCAL-FREIGHT-04', source: 'Chandigarh Apiary #1', destination: 'Regional Bottling Facility', timestamp: '2026-08-23T11:00:00Z' }
    ]]
  ]),

  packagingEvents: new Map<string, PackagingEvent[]>([
    ['HC-2026-0001', [
      { id: 'PKG-001', batchId: 'HC-2026-0001', packagerId: 'HONEY-PACK-DELHI', productId: 'PURE-MUSTARD-500G', packagingDate: '2026-08-22T09:00:00Z' }
    ]],
    ['HC-2026-0003', [
      { id: 'PKG-003', batchId: 'HC-2026-0003', packagerId: 'HONEY-PACK-PUNJAB', productId: 'MULTI-FLORA-1000G', packagingDate: '2026-08-24T10:00:00Z' }
    ]]
  ])
};
