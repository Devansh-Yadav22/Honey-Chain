import { 
  Hive, TelemetryRecord, Harvest, Batch, ProcessingEvent, TransportEvent, 
  PackagingEvent, Organization, User, QualityLabTest, AuditLog, AdminException, 
  SystemHealth, Role 
} from '../types/index.js';
import crypto from 'crypto';

// In-Memory Seed Store for Phase 2 Production-Ready Platform
export const memoryStore = {
  organizations: new Map<string, Organization>([
    ['ORG-ADMIN', {
      id: 'ORG-ADMIN',
      name: 'Honey Chain Central Operations',
      type: 'PLATFORM_ADMIN',
      registrationNumber: 'GOV-IN-HONEY-001',
      location: 'New Delhi, India',
      contactEmail: 'ops@honeychain.gov.in',
      contactPhone: '+91-11-2345-6789',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z'
    }],
    ['ORG-BEE-01', {
      id: 'ORG-BEE-01',
      name: 'Himalayan Apiary Cooperative',
      type: 'APIARY_COOPERATIVE',
      registrationNumber: 'COOP-HP-2024-88',
      location: 'Kangra & Shimla, Himachal Pradesh',
      contactEmail: 'contact@himalayanbees.coop',
      contactPhone: '+91-1892-224411',
      status: 'ACTIVE',
      createdAt: '2025-01-10T00:00:00Z'
    }],
    ['ORG-BEE-02', {
      id: 'ORG-BEE-02',
      name: 'Sundarbans Wild Honey Society',
      type: 'APIARY_COOPERATIVE',
      registrationNumber: 'COOP-WB-2023-14',
      location: 'Sundarbans, West Bengal',
      contactEmail: 'info@sundarbanshoney.org',
      contactPhone: '+91-3218-255300',
      status: 'ACTIVE',
      createdAt: '2025-01-15T00:00:00Z'
    }],
    ['ORG-PROC-01', {
      id: 'ORG-PROC-01',
      name: 'Nilgiri Pure Extraction & Processing Ltd',
      type: 'PROCESSING_FACILITY',
      registrationNumber: 'FSSAI-10022044001234',
      location: 'Ooty & Coimbatore, Tamil Nadu',
      contactEmail: 'qa@nilgirihoney.in',
      contactPhone: '+91-422-2689000',
      status: 'ACTIVE',
      createdAt: '2025-02-01T00:00:00Z'
    }],
    ['ORG-LOG-01', {
      id: 'ORG-LOG-01',
      name: 'Bharat Cold-Chain Express Logistics',
      type: 'LOGISTICS_FLEET',
      registrationNumber: 'LOG-IND-99201',
      location: 'New Delhi & Chandigarh',
      contactEmail: 'dispatch@bharatcoldchain.com',
      contactPhone: '+91-11-40998877',
      status: 'ACTIVE',
      createdAt: '2025-02-15T00:00:00Z'
    }],
    ['ORG-PACK-01', {
      id: 'ORG-PACK-01',
      name: 'PureFlora Packaging & Bottling Hub',
      type: 'PACKAGING_PLANT',
      registrationNumber: 'PKG-DEL-5541',
      location: 'Okhla Industrial Area, New Delhi',
      contactEmail: 'bottling@pureflora.in',
      contactPhone: '+91-11-26991122',
      status: 'ACTIVE',
      createdAt: '2025-03-01T00:00:00Z'
    }],
    ['ORG-LAB-01', {
      id: 'ORG-LAB-01',
      name: 'Apex Food Safety & Purity Testing Labs (NABL)',
      type: 'QUALITY_LABORATORY',
      registrationNumber: 'NABL-TC-8899-F',
      location: 'Gurugram, Haryana',
      contactEmail: 'certificates@apexlabs.res.in',
      contactPhone: '+91-124-4556677',
      status: 'ACTIVE',
      createdAt: '2025-03-10T00:00:00Z'
    }]
  ]),

  users: new Map<string, User>([
    ['USR-ADMIN-01', {
      id: 'USR-ADMIN-01',
      username: 'admin',
      fullName: 'Vikramaditya Sharma',
      email: 'admin@honeychain.gov.in',
      role: 'ADMIN',
      organizationId: 'ORG-ADMIN',
      organizationName: 'Honey Chain Central Operations',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z'
    }],
    ['USR-BEE-01', {
      id: 'USR-BEE-01',
      username: 'beekeeper_rajesh',
      fullName: 'Rajesh Kumar Verma',
      email: 'rajesh@himalayanbees.coop',
      role: 'BEEKEEPER',
      organizationId: 'ORG-BEE-01',
      organizationName: 'Himalayan Apiary Cooperative',
      status: 'ACTIVE',
      createdAt: '2025-01-10T00:00:00Z'
    }],
    ['USR-PROC-01', {
      id: 'USR-PROC-01',
      username: 'processor_anita',
      fullName: 'Anita Desai',
      email: 'anita@nilgirihoney.in',
      role: 'PROCESSOR',
      organizationId: 'ORG-PROC-01',
      organizationName: 'Nilgiri Pure Extraction Ltd',
      status: 'ACTIVE',
      createdAt: '2025-02-01T00:00:00Z'
    }],
    ['USR-LOG-01', {
      id: 'USR-LOG-01',
      username: 'transporter_gurdeep',
      fullName: 'Gurdeep Singh',
      email: 'gurdeep@bharatcoldchain.com',
      role: 'TRANSPORTER',
      organizationId: 'ORG-LOG-01',
      organizationName: 'Bharat Cold-Chain Logistics',
      status: 'ACTIVE',
      createdAt: '2025-02-15T00:00:00Z'
    }],
    ['USR-PACK-01', {
      id: 'USR-PACK-01',
      username: 'packager_priya',
      fullName: 'Priya Sundaram',
      email: 'priya@pureflora.in',
      role: 'PACKAGER',
      organizationId: 'ORG-PACK-01',
      organizationName: 'PureFlora Packaging Hub',
      status: 'ACTIVE',
      createdAt: '2025-03-01T00:00:00Z'
    }],
    ['USR-LAB-01', {
      id: 'USR-LAB-01',
      username: 'analyst_mehta',
      fullName: 'Dr. Arishta Mehta',
      email: 'dr.mehta@apexlabs.res.in',
      role: 'QUALITY_LAB',
      organizationId: 'ORG-LAB-01',
      organizationName: 'Apex Food Safety Labs (NABL)',
      status: 'ACTIVE',
      createdAt: '2025-03-10T00:00:00Z'
    }]
  ]),

  hives: new Map<string, Hive>([
    ['HIVE-001', { id: 'HIVE-001', beekeeperId: 'BK-001', apiaryId: 'APIARY-DEL-01', location: { lat: 28.6139, lng: 77.2090, address: 'New Delhi Apiary #1' }, status: 'ACTIVE', installationDate: '2025-01-15T00:00:00Z' }],
    ['HIVE-002', { id: 'HIVE-002', beekeeperId: 'BK-001', apiaryId: 'APIARY-DEL-01', location: { lat: 28.6150, lng: 77.2100, address: 'New Delhi Apiary #2' }, status: 'ACTIVE', installationDate: '2025-02-01T00:00:00Z' }],
    ['HIVE-003', { id: 'HIVE-003', beekeeperId: 'BK-002', apiaryId: 'APIARY-CHD-01', location: { lat: 30.7333, lng: 76.7794, address: 'Chandigarh Apiary #1' }, status: 'WARNING', installationDate: '2025-03-10T00:00:00Z' }],
    ['HIVE-004', { id: 'HIVE-004', beekeeperId: 'BK-002', apiaryId: 'APIARY-CHD-01', location: { lat: 30.7350, lng: 76.7800, address: 'Chandigarh Apiary #2' }, status: 'ACTIVE', installationDate: '2025-04-05T00:00:00Z' }],
    ['HIVE-005', { id: 'HIVE-005', beekeeperId: 'BK-003', apiaryId: 'APIARY-ASR-01', location: { lat: 31.6340, lng: 74.8723, address: 'Amritsar Apiary #1' }, status: 'CRITICAL', installationDate: '2025-05-12T00:00:00Z' }],
    ['HIVE-006', { id: 'HIVE-006', beekeeperId: 'BK-003', apiaryId: 'APIARY-SHM-01', location: { lat: 31.1048, lng: 77.1734, address: 'Shimla Apiary #1' }, status: 'CRITICAL', installationDate: '2025-06-01T00:00:00Z' }],
    ['HIVE-007', { id: 'HIVE-007', beekeeperId: 'BK-004', apiaryId: 'APIARY-KSH-01', location: { lat: 34.0837, lng: 74.7973, address: 'Kashmir Valley Apiary #1' }, status: 'CRITICAL', installationDate: '2025-06-15T00:00:00Z' }],
    ['HIVE-008', { id: 'HIVE-008', beekeeperId: 'BK-004', apiaryId: 'APIARY-KNG-02', location: { lat: 32.0998, lng: 76.2691, address: 'Kangra Apiary #2' }, status: 'WARNING', installationDate: '2025-07-01T00:00:00Z' }],
    ['HIVE-009', { id: 'HIVE-009', beekeeperId: 'BK-005', apiaryId: 'APIARY-DDN-01', location: { lat: 30.3165, lng: 78.0322, address: 'Dehradun Apiary #1' }, status: 'WARNING', installationDate: '2025-07-20T00:00:00Z' }],
    ['HIVE-010', { id: 'HIVE-010', beekeeperId: 'BK-005', apiaryId: 'APIARY-SND-01', location: { lat: 21.9497, lng: 89.1833, address: 'Sundarbans Apiary #1' }, status: 'ACTIVE', installationDate: '2025-08-01T00:00:00Z' }],
  ]),

  telemetry: new Map<string, TelemetryRecord[]>([
    ['HIVE-001', [
      { hiveId: 'HIVE-001', temperature: 34.2, humidity: 61.0, weight: 42.7, activity: 0.84, timestamp: new Date(Date.now() - 3600000).toISOString() },
      { hiveId: 'HIVE-001', temperature: 34.5, humidity: 60.5, weight: 42.8, activity: 0.86, timestamp: new Date().toISOString() },
    ]],
    ['HIVE-002', [
      { hiveId: 'HIVE-002', temperature: 34.0, humidity: 59.0, weight: 44.5, activity: 0.82, timestamp: new Date().toISOString() },
    ]],
    ['HIVE-003', [
      { hiveId: 'HIVE-003', temperature: 38.2, humidity: 74.0, weight: 37.0, activity: 0.48, timestamp: new Date().toISOString() },
    ]],
    ['HIVE-004', [
      { hiveId: 'HIVE-004', temperature: 34.8, humidity: 58.0, weight: 52.3, activity: 0.92, timestamp: new Date().toISOString() },
    ]],
    ['HIVE-005', [
      { hiveId: 'HIVE-005', temperature: 41.8, humidity: 82.0, weight: 38.5, activity: 0.18, timestamp: new Date().toISOString() },
    ]],
    ['HIVE-006', [
      { hiveId: 'HIVE-006', temperature: 33.5, humidity: 62.0, weight: 31.2, activity: 0.85, timestamp: new Date().toISOString() },
    ]],
    ['HIVE-007', [
      { hiveId: 'HIVE-007', temperature: 8.5, humidity: 86.0, weight: 46.0, activity: 0.02, timestamp: new Date().toISOString() },
    ]],
    ['HIVE-008', [
      { hiveId: 'HIVE-008', temperature: 37.8, humidity: 68.0, weight: 34.0, activity: 0.96, timestamp: new Date().toISOString() },
    ]],
    ['HIVE-009', [
      { hiveId: 'HIVE-009', temperature: 25.5, humidity: 91.0, weight: 51.0, activity: 0.22, timestamp: new Date().toISOString() },
    ]],
    ['HIVE-010', [
      { hiveId: 'HIVE-010', temperature: 33.6, humidity: 64.0, weight: 48.2, activity: 0.88, timestamp: new Date().toISOString() },
    ]],
  ]),

  harvests: new Map<string, Harvest>([
    ['HARVEST-001', { id: 'HARVEST-001', hiveId: 'HIVE-001', beekeeperId: 'BK-001', harvestDate: '2026-08-20T10:00:00Z', quantity: 18.0, floralSource: 'Mustard Blossom', moisturePercent: 18.2, location: { lat: 28.6139, lng: 77.2090 }, notes: 'Summer mustard honey harvest' }],
    ['HARVEST-002', { id: 'HARVEST-002', hiveId: 'HIVE-002', beekeeperId: 'BK-001', harvestDate: '2026-08-21T09:00:00Z', quantity: 25.0, floralSource: 'Multifloral Blossom', moisturePercent: 17.5, location: { lat: 28.6150, lng: 77.2100 }, notes: 'Multi-floral nectar harvest' }],
    ['HARVEST-003', { id: 'HARVEST-003', hiveId: 'HIVE-003', beekeeperId: 'BK-002', harvestDate: '2026-08-22T14:30:00Z', quantity: 18.0, floralSource: 'Eucalyptus Forest', moisturePercent: 19.1, location: { lat: 30.7333, lng: 76.7794 }, notes: 'Eucalyptus honey harvest' }],
    ['HARVEST-004', { id: 'HARVEST-004', hiveId: 'HIVE-004', beekeeperId: 'BK-002', harvestDate: '2026-08-23T11:00:00Z', quantity: 30.0, floralSource: 'Wild Himalayan Flora', moisturePercent: 17.2, location: { lat: 30.7350, lng: 76.7800 }, notes: 'High yield wildflower harvest' }],
    ['HARVEST-010', { id: 'HARVEST-010', hiveId: 'HIVE-010', beekeeperId: 'BK-005', harvestDate: '2026-08-25T15:00:00Z', quantity: 22.5, floralSource: 'Mangrove Wildflower', moisturePercent: 18.0, location: { lat: 21.9497, lng: 89.1833 }, notes: 'Sundarbans organic wild mangrove honey' }],
  ]),

  batches: new Map<string, Batch>([
    ['HC-2026-0001', {
      id: 'HC-2026-0001',
      harvestId: 'HARVEST-001',
      hiveId: 'HIVE-001',
      beekeeperId: 'BK-001',
      quantity: 18.0,
      origin: 'New Delhi Apiary #1 (HIVE-001)',
      floralSource: 'Mustard Blossom',
      status: 'PUBLISHED',
      currentCustodian: 'PureFlora Packaging Hub',
      custodianRole: 'PACKAGER',
      blockchainTxId: '0x8f3c7e9a2b4d1056ef8a9c3b7e4f1a2d',
      blockchainStatus: 'CONFIRMED',
      createdAt: '2026-08-20T11:00:00Z'
    }],
    ['HC-2026-0002', {
      id: 'HC-2026-0002',
      harvestId: 'HARVEST-002',
      hiveId: 'HIVE-002',
      beekeeperId: 'BK-001',
      quantity: 25.0,
      origin: 'New Delhi Apiary #2 (HIVE-002)',
      floralSource: 'Multifloral Blossom',
      status: 'IN_TRANSIT',
      currentCustodian: 'Bharat Cold-Chain Logistics',
      custodianRole: 'TRANSPORTER',
      blockchainTxId: '0x9a4b5c6d7e8f90123456789abcdef012',
      blockchainStatus: 'CONFIRMED',
      createdAt: '2026-08-21T09:15:00Z'
    }],
    ['HC-2026-0003', {
      id: 'HC-2026-0003',
      harvestId: 'HARVEST-003',
      hiveId: 'HIVE-003',
      beekeeperId: 'BK-002',
      quantity: 31.0, // Suspicious volume addition flagged by AI
      origin: 'Chandigarh Apiary #1 (HIVE-003)',
      floralSource: 'Eucalyptus Forest',
      status: 'SUSPICIOUS',
      currentCustodian: 'Nilgiri Pure Extraction Ltd',
      custodianRole: 'PROCESSOR',
      blockchainTxId: '0x123456789abcdef0123456789abcdef0',
      blockchainStatus: 'CONFIRMED',
      createdAt: '2026-08-22T16:00:00Z'
    }],
    ['HC-2026-0004', {
      id: 'HC-2026-0004',
      harvestId: 'HARVEST-004',
      hiveId: 'HIVE-004',
      beekeeperId: 'BK-002',
      quantity: 30.0,
      origin: 'Chandigarh Apiary #2 (HIVE-004)',
      floralSource: 'Wild Himalayan Flora',
      status: 'RECEIVED_FOR_PROCESSING',
      currentCustodian: 'Nilgiri Pure Extraction Ltd',
      custodianRole: 'PROCESSOR',
      blockchainTxId: '0x33445566778899aabbccddeeff001122',
      blockchainStatus: 'CONFIRMED',
      createdAt: '2026-08-23T12:00:00Z'
    }],
    ['HC-2026-0010', {
      id: 'HC-2026-0010',
      harvestId: 'HARVEST-010',
      hiveId: 'HIVE-010',
      beekeeperId: 'BK-005',
      quantity: 22.5,
      origin: 'Sundarbans Apiary #1 (HIVE-010)',
      floralSource: 'Mangrove Wildflower',
      status: 'HARVESTED',
      currentCustodian: 'Sundarbans Wild Honey Society',
      custodianRole: 'BEEKEEPER',
      blockchainTxId: '0xaa11bb22cc33dd44ee55ff6600778899',
      blockchainStatus: 'CONFIRMED',
      createdAt: '2026-08-25T16:30:00Z'
    }]
  ]),

  processingEvents: new Map<string, ProcessingEvent[]>([
    ['HC-2026-0001', [
      { id: 'PROC-001', batchId: 'HC-2026-0001', processorId: 'ORG-PROC-01', processorName: 'Nilgiri Pure Extraction Ltd', eventType: 'MOISTURE_EXTRACTION', temperatureCelsius: 38.5, moisturePercent: 18.0, outputWeightKg: 17.8, timestamp: '2026-08-21T08:00:00Z', details: { targetMoisturePercent: 18.0 } },
      { id: 'PROC-002', batchId: 'HC-2026-0001', processorId: 'ORG-PROC-01', processorName: 'Nilgiri Pure Extraction Ltd', eventType: 'MICRO_FILTRATION', temperatureCelsius: 39.0, moisturePercent: 18.0, outputWeightKg: 17.7, timestamp: '2026-08-21T10:30:00Z', details: { filterMeshMicrons: 80 } },
    ]],
    ['HC-2026-0003', [
      { id: 'PROC-003', batchId: 'HC-2026-0003', processorId: 'ORG-PROC-01', processorName: 'Nilgiri Pure Extraction Ltd', eventType: 'BULK_BLENDING', temperatureCelsius: 44.0, outputWeightKg: 31.0, timestamp: '2026-08-23T09:00:00Z', details: { addedVolumeKg: 13.0 } }
    ]]
  ]),

  transportEvents: new Map<string, TransportEvent[]>([
    ['HC-2026-0001', [
      { id: 'TRANS-001', batchId: 'HC-2026-0001', transporterId: 'ORG-LOG-01', transporterName: 'Bharat Cold-Chain Logistics', vehicleNumber: 'DL-01-AX-9922', source: 'New Delhi Apiary #1', destination: 'Central Packaging Hub Delhi', transitTemperatureCelsius: 22.4, conditionStatus: 'OPTIMAL', timestamp: '2026-08-21T13:00:00Z' }
    ]],
    ['HC-2026-0002', [
      { id: 'TRANS-002', batchId: 'HC-2026-0002', transporterId: 'ORG-LOG-01', transporterName: 'Bharat Cold-Chain Logistics', vehicleNumber: 'HR-26-BK-4011', source: 'New Delhi Apiary #2', destination: 'PureFlora Packaging Hub', transitTemperatureCelsius: 23.1, conditionStatus: 'OPTIMAL', timestamp: '2026-08-21T14:00:00Z' }
    ]]
  ]),

  packagingEvents: new Map<string, PackagingEvent[]>([
    ['HC-2026-0001', [
      { id: 'PACK-001', batchId: 'HC-2026-0001', packagerId: 'ORG-PACK-01', packagerName: 'PureFlora Packaging Hub', productId: 'HONEY-RAW-MUSTARD-500G', containerType: 'Glass Hexagonal Jar', unitsCount: 35, unitWeightGrams: 500, packagingDate: '2026-08-22T09:00:00Z' }
    ]]
  ]),

  qualityTests: new Map<string, QualityLabTest[]>([
    ['HC-2026-0001', [
      {
        id: 'LAB-TEST-001',
        batchId: 'HC-2026-0001',
        labId: 'ORG-LAB-01',
        labName: 'Apex Food Safety & Purity Testing Labs (NABL)',
        testerName: 'Dr. Arishta Mehta',
        testDate: '2026-08-21T16:00:00Z',
        parameters: {
          moisturePercent: 17.8, // Complies with FSSAI (<=20%)
          hmfMgPerKg: 12.4,      // Complies (<=40 mg/kg)
          sucrosePercent: 2.1,   // Complies (<=5%)
          pollenCountPerGram: 28500,
          antibioticResidue: 'NEGATIVE',
          leadPpm: 0.02
        },
        overallStatus: 'PASSED',
        certificateHashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        reportUrl: 'https://apexlabs.res.in/reports/HC-2026-0001-NABL.pdf',
        notes: 'Complies with FSSAI Honey Standards (Gazette Notification 2018) and Codex Alimentarius 12-1981.',
        createdAt: '2026-08-21T16:30:00Z'
      }
    ]],
    ['HC-2026-0003', [
      {
        id: 'LAB-TEST-003',
        batchId: 'HC-2026-0003',
        labId: 'ORG-LAB-01',
        labName: 'Apex Food Safety & Purity Testing Labs (NABL)',
        testerName: 'Dr. Arishta Mehta',
        testDate: '2026-08-23T11:00:00Z',
        parameters: {
          moisturePercent: 21.6, // Exceeds standard (Fail >20%)
          hmfMgPerKg: 48.2,      // Elevated
          sucrosePercent: 6.8,   // Exceeds standard (>5%)
          pollenCountPerGram: 8200,
          antibioticResidue: 'NEGATIVE',
          leadPpm: 0.05
        },
        overallStatus: 'REVIEW_REQUIRED',
        certificateHashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        reportUrl: 'https://apexlabs.res.in/reports/HC-2026-0003-FLAGGED.pdf',
        notes: 'High moisture and elevated sucrose indicative of unripened honey or dilution. Requires administrative review.',
        createdAt: '2026-08-23T11:30:00Z'
      }
    ]]
  ]),

  auditLogs: [
    {
      id: 'AUD-001',
      timestamp: '2026-08-20T10:05:00Z',
      actorId: 'USR-BEE-01',
      actorName: 'Rajesh Kumar Verma',
      role: 'BEEKEEPER',
      organizationId: 'ORG-BEE-01',
      organizationName: 'Himalayan Apiary Cooperative',
      action: 'HARVEST_RECORDED',
      resourceType: 'HARVEST',
      resourceId: 'HARVEST-001',
      result: 'SUCCESS',
      details: { quantityKg: 18.0, hiveId: 'HIVE-001' }
    },
    {
      id: 'AUD-002',
      timestamp: '2026-08-20T11:00:00Z',
      actorId: 'USR-BEE-01',
      actorName: 'Rajesh Kumar Verma',
      role: 'BEEKEEPER',
      organizationId: 'ORG-BEE-01',
      organizationName: 'Himalayan Apiary Cooperative',
      action: 'BATCH_CREATED',
      resourceType: 'BATCH',
      resourceId: 'HC-2026-0001',
      result: 'SUCCESS',
      details: { fabricTxId: '0x8f3c7e9a2b4d1056ef8a9c3b7e4f1a2d' }
    },
    {
      id: 'AUD-003',
      timestamp: '2026-08-21T08:00:00Z',
      actorId: 'USR-PROC-01',
      actorName: 'Anita Desai',
      role: 'PROCESSOR',
      organizationId: 'ORG-PROC-01',
      organizationName: 'Nilgiri Pure Extraction Ltd',
      action: 'PROCESSING_RECORDED',
      resourceType: 'BATCH',
      resourceId: 'HC-2026-0001',
      result: 'SUCCESS',
      details: { eventType: 'MOISTURE_EXTRACTION', tempC: 38.5 }
    },
    {
      id: 'AUD-004',
      timestamp: '2026-08-21T13:00:00Z',
      actorId: 'USR-LOG-01',
      actorName: 'Gurdeep Singh',
      role: 'TRANSPORTER',
      organizationId: 'ORG-LOG-01',
      organizationName: 'Bharat Cold-Chain Logistics',
      action: 'TRANSPORT_DISPATCHED',
      resourceType: 'BATCH',
      resourceId: 'HC-2026-0001',
      result: 'SUCCESS',
      details: { vehicle: 'DL-01-AX-9922' }
    },
    {
      id: 'AUD-005',
      timestamp: '2026-08-21T16:30:00Z',
      actorId: 'USR-LAB-01',
      actorName: 'Dr. Arishta Mehta',
      role: 'QUALITY_LAB',
      organizationId: 'ORG-LAB-01',
      organizationName: 'Apex Food Safety Labs (NABL)',
      action: 'QUALITY_RESULT_RECORDED',
      resourceType: 'BATCH',
      resourceId: 'HC-2026-0001',
      result: 'SUCCESS',
      details: { status: 'PASSED', certHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }
    },
    {
      id: 'AUD-006',
      timestamp: '2026-08-22T09:00:00Z',
      actorId: 'USR-PACK-01',
      actorName: 'Priya Sundaram',
      role: 'PACKAGER',
      organizationId: 'ORG-PACK-01',
      organizationName: 'PureFlora Packaging Hub',
      action: 'PASSPORT_PUBLISHED',
      resourceType: 'PASSPORT',
      resourceId: 'HC-2026-0001',
      result: 'SUCCESS',
      details: { productId: 'HONEY-RAW-MUSTARD-500G', units: 35 }
    }
  ] as AuditLog[],

  exceptions: [
    {
      id: 'EXC-001',
      type: 'AI_ANOMALY',
      severity: 'CRITICAL',
      title: 'Extreme Brood Thermal Stress Flagged',
      description: 'HIVE-005 telemetry indicated temperature surge to 41.8°C with depressed bee activity (0.18).',
      resourceId: 'HIVE-005',
      resourceType: 'HIVE',
      status: 'OPEN',
      createdAt: '2026-09-04T12:00:00Z'
    },
    {
      id: 'EXC-002',
      type: 'PROVENANCE_MISMATCH',
      severity: 'CRITICAL',
      title: 'Batch Volume Inflation Flagged',
      description: 'Batch HC-2026-0003 harvest quantity was 18.0 kg while processing recorded 31.0 kg (+72% deviation).',
      resourceId: 'HC-2026-0003',
      resourceType: 'BATCH',
      status: 'INVESTIGATING',
      createdAt: '2026-08-23T09:30:00Z'
    },
    {
      id: 'EXC-003',
      type: 'QUALITY_REVIEW',
      severity: 'WARNING',
      title: 'Lab Quality Moisture Exceeds 20% Limit',
      description: 'Batch HC-2026-0003 lab test moisture measured 21.6%, failing FSSAI standard.',
      resourceId: 'HC-2026-0003',
      resourceType: 'BATCH',
      status: 'INVESTIGATING',
      createdAt: '2026-08-23T11:45:00Z'
    }
  ] as AdminException[]
};

// Store Access Methods
export const store = {
  // Organizations
  getOrganizations(): Organization[] {
    return Array.from(memoryStore.organizations.values());
  },
  getOrganizationById(id: string): Organization | undefined {
    return memoryStore.organizations.get(id);
  },

  // Users
  getUsers(): User[] {
    return Array.from(memoryStore.users.values());
  },
  getUserById(id: string): User | undefined {
    return memoryStore.users.get(id);
  },
  getUsersByRole(role: Role): User[] {
    return Array.from(memoryStore.users.values()).filter(u => u.role === role);
  },
  getUserByToken(token: string): User | undefined {
    // In demo mode, token can be user ID or username
    return Array.from(memoryStore.users.values()).find(u => u.id === token || u.username === token);
  },

  // Hives
  getHives(): Hive[] {
    return Array.from(memoryStore.hives.values());
  },
  getHiveById(id: string): Hive | undefined {
    return memoryStore.hives.get(id);
  },
  addHive(hive: Hive): void {
    memoryStore.hives.set(hive.id, hive);
  },

  // Telemetry
  getTelemetry(hiveId: string): TelemetryRecord[] {
    return memoryStore.telemetry.get(hiveId) || [];
  },
  addTelemetry(hiveId: string, record: TelemetryRecord): void {
    const records = memoryStore.telemetry.get(hiveId) || [];
    records.push(record);
    memoryStore.telemetry.set(hiveId, records);
  },

  // Harvests
  getHarvests(): Harvest[] {
    return Array.from(memoryStore.harvests.values());
  },
  getHarvestById(id: string): Harvest | undefined {
    return memoryStore.harvests.get(id);
  },
  addHarvest(harvest: Harvest): void {
    memoryStore.harvests.set(harvest.id, harvest);
  },

  // Batches
  getBatches(): Batch[] {
    return Array.from(memoryStore.batches.values()).map(b => this.populateBatch(b));
  },
  getBatchById(id: string): Batch | undefined {
    const batch = memoryStore.batches.get(id);
    return batch ? this.populateBatch(batch) : undefined;
  },
  addBatch(batch: Batch): void {
    memoryStore.batches.set(batch.id, batch);
  },
  updateBatchStatus(batchId: string, status: Batch['status'], custodian?: string, custodianRole?: Role): Batch | undefined {
    const batch = memoryStore.batches.get(batchId);
    if (!batch) return undefined;
    batch.status = status;
    if (custodian) batch.currentCustodian = custodian;
    if (custodianRole) batch.custodianRole = custodianRole;
    memoryStore.batches.set(batchId, batch);
    return this.populateBatch(batch);
  },

  // Processing Events
  getProcessingEvents(batchId: string): ProcessingEvent[] {
    return memoryStore.processingEvents.get(batchId) || [];
  },
  addProcessingEvent(event: ProcessingEvent): void {
    const events = memoryStore.processingEvents.get(event.batchId) || [];
    events.push(event);
    memoryStore.processingEvents.set(event.batchId, events);
  },

  // Transport Events
  getTransportEvents(batchId: string): TransportEvent[] {
    return memoryStore.transportEvents.get(batchId) || [];
  },
  addTransportEvent(event: TransportEvent): void {
    const events = memoryStore.transportEvents.get(event.batchId) || [];
    events.push(event);
    memoryStore.transportEvents.set(event.batchId, events);
  },

  // Packaging Events
  getPackagingEvents(batchId: string): PackagingEvent[] {
    return memoryStore.packagingEvents.get(batchId) || [];
  },
  addPackagingEvent(event: PackagingEvent): void {
    const events = memoryStore.packagingEvents.get(event.batchId) || [];
    events.push(event);
    memoryStore.packagingEvents.set(event.batchId, events);
  },

  // Quality Tests
  getQualityTests(batchId?: string): QualityLabTest[] {
    if (batchId) {
      return memoryStore.qualityTests.get(batchId) || [];
    }
    const allTests: QualityLabTest[] = [];
    memoryStore.qualityTests.forEach(tests => allTests.push(...tests));
    return allTests;
  },
  addQualityTest(test: QualityLabTest): void {
    const tests = memoryStore.qualityTests.get(test.batchId) || [];
    tests.push(test);
    memoryStore.qualityTests.set(test.batchId, tests);
  },

  // Audit Logs
  getAuditLogs(limit: number = 50): AuditLog[] {
    return [...memoryStore.auditLogs].reverse().slice(0, limit);
  },
  addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const log: AuditLog = {
      ...entry,
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    memoryStore.auditLogs.push(log);
    return log;
  },

  // Admin Exceptions
  getExceptions(): AdminException[] {
    return memoryStore.exceptions;
  },
  updateException(id: string, status: AdminException['status'], resolutionNotes?: string, resolvedBy?: string): AdminException | undefined {
    const exc = memoryStore.exceptions.find(e => e.id === id);
    if (!exc) return undefined;
    exc.status = status;
    if (status === 'RESOLVED') {
      exc.resolvedAt = new Date().toISOString();
      exc.resolutionNotes = resolutionNotes;
      exc.resolvedBy = resolvedBy;
    }
    return exc;
  },

  // System Health Probe
  getSystemHealth(): SystemHealth {
    return {
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      services: {
        backendApi: { status: 'UP', latencyMs: 2, uptime: process.uptime() },
        database: { status: 'UP', mode: 'DEMO_FALLBACK', poolActive: 1 },
        aiService: { status: 'UP', modelVersion: '1.0.0 (HOBOS-Calibrated IsolationForest)', latencyMs: 12, endpoint: 'http://127.0.0.1:8000' },
        fabricGateway: { status: 'CONNECTED', channel: 'honeychannel', chaincode: 'honeychain-cc' }
      }
    };
  },

  // Helper to populate batch relations
  populateBatch(batch: Batch): Batch {
    const populated = { ...batch };
    if (batch.harvestId) {
      populated.harvest = memoryStore.harvests.get(batch.harvestId);
    }
    populated.processingEvents = memoryStore.processingEvents.get(batch.id) || [];
    populated.transportEvents = memoryStore.transportEvents.get(batch.id) || [];
    populated.packagingEvents = memoryStore.packagingEvents.get(batch.id) || [];
    populated.qualityTests = memoryStore.qualityTests.get(batch.id) || [];
    return populated;
  }
};
