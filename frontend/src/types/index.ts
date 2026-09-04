export type Role = 
  | 'ADMIN' 
  | 'BEEKEEPER' 
  | 'PROCESSOR' 
  | 'TRANSPORTER' 
  | 'PACKAGER' 
  | 'QUALITY_LAB' 
  | 'CONSUMER';

export type OrganizationType =
  | 'APIARY_COOPERATIVE'
  | 'PROCESSING_FACILITY'
  | 'LOGISTICS_FLEET'
  | 'PACKAGING_PLANT'
  | 'QUALITY_LABORATORY'
  | 'PLATFORM_ADMIN';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  registrationNumber?: string;
  location: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  organizationId: string;
  organizationName?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Hive {
  id: string;
  beekeeperId: string;
  apiaryId?: string;
  location: Location;
  installationDate?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'WARNING' | 'CRITICAL';
  createdAt?: string;
}

export interface TelemetryRecord {
  id?: number;
  hiveId: string;
  temperature: number;
  humidity: number;
  weight: number;
  activity: number;
  timestamp: string;
}

export interface Harvest {
  id: string;
  hiveId: string;
  beekeeperId?: string;
  harvestDate: string;
  quantity: number;
  floralSource?: string;
  moisturePercent?: number;
  location?: Location;
  notes?: string;
}

export interface ProcessingEvent {
  id: string;
  batchId: string;
  processorId: string;
  processorName?: string;
  eventType: string;
  temperatureCelsius?: number;
  moisturePercent?: number;
  outputWeightKg?: number;
  details?: Record<string, any>;
  timestamp: string;
}

export interface TransportEvent {
  id: string;
  batchId: string;
  transporterId: string;
  transporterName?: string;
  vehicleNumber?: string;
  source: string;
  destination: string;
  transitTemperatureCelsius?: number;
  conditionStatus?: 'OPTIMAL' | 'ACCEPTABLE' | 'DEVIATED';
  timestamp: string;
}

export interface PackagingEvent {
  id: string;
  batchId: string;
  packagerId: string;
  packagerName?: string;
  productId: string;
  containerType?: string;
  unitsCount?: number;
  unitWeightGrams?: number;
  packagingDate: string;
}

export interface QualityLabTest {
  id: string;
  batchId: string;
  labId: string;
  labName: string;
  testerName: string;
  testDate: string;
  parameters: {
    moisturePercent: number;
    hmfMgPerKg: number;
    sucrosePercent: number;
    pollenCountPerGram: number;
    antibioticResidue: 'NEGATIVE' | 'POSITIVE';
    leadPpm: number;
  };
  overallStatus: 'PASSED' | 'REVIEW_REQUIRED';
  certificateHashSha256: string;
  reportUrl?: string;
  notes?: string;
  createdAt: string;
}

export type BatchStatus = 
  | 'CREATED' 
  | 'HARVESTED' 
  | 'RECEIVED_FOR_PROCESSING' 
  | 'PROCESSING' 
  | 'READY_FOR_TRANSPORT' 
  | 'IN_TRANSIT' 
  | 'RECEIVED' 
  | 'PACKAGED' 
  | 'PUBLISHED' 
  | 'VERIFIED' 
  | 'SUSPICIOUS';

export interface Batch {
  id: string;
  harvestId?: string;
  hiveId?: string;
  beekeeperId?: string;
  quantity: number;
  origin: string;
  floralSource?: string;
  status: BatchStatus;
  currentCustodian?: string;
  custodianRole?: Role;
  blockchainTxId?: string;
  blockchainStatus?: 'PENDING' | 'CONFIRMED' | 'FAILED';
  createdAt?: string;
  harvest?: Harvest;
  processingEvents?: ProcessingEvent[];
  transportEvents?: TransportEvent[];
  packagingEvents?: PackagingEvent[];
  qualityTests?: QualityLabTest[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  role: Role;
  organizationId: string;
  organizationName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  result: 'SUCCESS' | 'FAILED' | 'WARNING';
  details?: Record<string, any>;
}

export interface AdminException {
  id: string;
  type: 'AI_ANOMALY' | 'PROVENANCE_MISMATCH' | 'TRANSPORT_DELAY' | 'QUALITY_REVIEW' | 'FABRIC_FAILURE';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  resourceId: string;
  resourceType: 'HIVE' | 'BATCH' | 'SHIPMENT' | 'FABRIC_TX';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface SystemHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  timestamp: string;
  services: {
    backendApi: { status: 'UP' | 'DOWN'; latencyMs: number; uptime: number };
    database: { status: 'UP' | 'DEGRADED'; mode: 'POSTGRESQL' | 'DEMO_FALLBACK'; poolActive: number };
    aiService: { status: 'UP' | 'DOWN'; modelVersion: string; latencyMs: number; endpoint: string };
    fabricGateway: { status: 'CONNECTED' | 'EMULATED'; channel: string; chaincode: string };
  };
}

export interface AiHealth {
  health: 'NORMAL' | 'WARNING' | 'CRITICAL';
  healthScore: number;
}

export interface AiAnomaly {
  anomaly: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'WARNING' | 'CRITICAL' | 'NORMAL' | 'NONE';
  reasons: string[];
}

export interface HoneyPassport {
  batchId: string;
  origin: string;
  quantity: number;
  floralSource?: string;
  status: string;
  createdAt: string;
  hive?: {
    id: string;
    location: Location;
    apiaryName?: string;
  };
  harvest?: Harvest;
  timeline: {
    harvest?: Harvest;
    processing: ProcessingEvent[];
    transport: TransportEvent[];
    packaging: PackagingEvent[];
  };
  quality?: {
    status: 'PASSED' | 'REVIEW_REQUIRED' | 'NOT_AVAILABLE';
    testDate?: string;
    labName?: string;
    moisturePercent?: number;
    hmfMgPerKg?: number;
    certificateHash?: string;
  };
  verification: {
    blockchainVerified: boolean;
    blockchainTxId?: string;
    provenanceStatus: 'CONFIRMED' | 'PENDING' | 'FAILED' | 'VERIFIED' | 'SUSPICIOUS';
    consistencyStatus?: 'NORMAL' | 'WARNING' | 'SUSPICIOUS';
    consistencyScore: number;
    anomalies: string[];
  };
}
