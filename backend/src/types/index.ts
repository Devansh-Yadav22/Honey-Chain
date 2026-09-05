export type ProvenanceModel = 'DIRECT_BEEKEEPER' | 'COMPANY_MANAGED';

export type Role = 
  | 'ADMIN' 
  | 'BEEKEEPER' 
  | 'PROCESSOR' 
  | 'TRANSPORTER' 
  | 'PACKAGER' 
  | 'QUALITY_LAB' 
  | 'CONSUMER';

export type OrganizationType =
  | 'APIARY'
  | 'APIARY_COOPERATIVE'
  | 'PROCESSOR'
  | 'PROCESSING_FACILITY'
  | 'LOGISTICS'
  | 'LOGISTICS_FLEET'
  | 'PACKAGING_FACILITY'
  | 'PACKAGING_PLANT'
  | 'QUALITY_LAB'
  | 'QUALITY_LABORATORY'
  | 'REGULATOR'
  | 'ADMIN'
  | 'PLATFORM_ADMIN';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  registrationNumber?: string;
  registrationNo?: string;
  location?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED';
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  firebaseUid?: string;
  username?: string;
  fullName?: string;
  name: string; // Master display name
  email: string;
  phone?: string;
  passwordHash?: string;
  role: Role;
  organizationId?: string;
  orgId?: string;
  organizationName?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DEACTIVATED' | 'REJECTED';
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface LocationRecord {
  id: string;
  batchId: string;
  recordedBy?: string;
  capturedBy?: string;
  stage?: string;
  resourceType?: 'HIVE' | 'BATCH' | 'SHIPMENT';
  resourceId?: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  isMocked?: boolean;
  timestamp?: string;
  source?: 'BROWSER_GPS' | 'MANUAL' | 'SIMULATED';
  createdAt: string;
}

export interface EvidenceRecord {
  id: string;
  batchId: string;
  eventId?: string;
  uploaderId?: string;
  uploadedBy?: string;
  uploaderName?: string;
  organizationId?: string;
  organizationName?: string;
  fileType?: 'LAB_REPORT' | 'TRANSPORT_WAYBILL' | 'SEAL_IMAGE' | 'HARVEST_CERTIFICATE' | 'TEMPERATURE_LOG' | 'PACKAGING_MANIFEST' | string;
  fileName: string;
  filePath?: string;
  fileUrl?: string;
  fileSize?: number;
  sizeBytes?: number;
  mimeType: string;
  sha256?: string;
  sha256Hash: string;
  status?: 'UPLOADED' | 'VERIFIED' | 'REJECTED';
  category?: 'HARVEST' | 'PROCESSING' | 'TRANSPORT' | 'PACKAGING' | 'LAB_ASSAY';
  metadata?: Record<string, any>;
  blockchainTxId?: string;
  uploadedAt?: string;
  createdAt: string;
  notes?: string;
}

export interface Handoff {
  id: string;
  batchId: string;
  senderId?: string;
  receiverId?: string;
  fromActorId?: string;
  fromActorName?: string;
  fromOrgId?: string;
  fromOrgName?: string;
  toActorId?: string;
  toActorName?: string;
  toOrgId?: string;
  toOrgName?: string;
  targetRole?: Role;
  fromStage?: string;
  toStage?: string;
  quantity?: number;
  unit?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DISPUTED';
  disputeReason?: string;
  reason?: string;
  evidenceHashes?: string[];
  location?: Location;
  timestamp?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Alert {
  id: string;
  batchId?: string;
  type?: 'AI_ANOMALY' | 'LOCATION_MISMATCH' | 'QUANTITY_MISMATCH' | 'TIMESTAMP_INCONSISTENCY' | 'FAILED_BLOCKCHAIN' | 'FAILED_AI' | 'REJECTED_HANDOFF' | 'PENDING_APPROVAL' | string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'WARNING' | 'CRITICAL';
  category?: 'QUANTITY_DRIFT' | 'GEO_MISMATCH' | 'TIME_ANOMALY' | 'AI_ANOMALY' | 'UNVERIFIED_HANDOFF' | 'UNAUTHORIZED_ROLE' | string;
  title?: string;
  message: string;
  resourceType?: string;
  resourceId?: string;
  organizationId?: string;
  details?: Record<string, any>;
  status: 'OPEN' | 'UNREAD' | 'READ' | 'ACKNOWLEDGED' | 'RESOLVED';
  resolvedBy?: string;
  resolutionNotes?: string;
  createdAt: string;
  readAt?: string;
  resolvedAt?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Apiary {
  id: string;
  organizationId: string;
  name: string;
  region: string;
  state: string;
  floraSource: string;
  location: Location;
  hiveCount: number;
  establishedDate: string;
}

export interface Beekeeper {
  id: string;
  name: string;
  contact?: string;
  location?: string;
  createdAt?: string;
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

export interface TelemetryData {
  temperature: number;
  humidity: number;
  weight: number;
  activity: number;
}

export interface TelemetryPayload {
  hiveId: string;
  beekeeperId?: string;
  location?: Location;
  telemetry: TelemetryData;
  timestamp: string;
}

export interface TelemetryRecord extends TelemetryData {
  id?: number;
  hiveId: string;
  timestamp: string;
}

export interface Harvest {
  id: string;
  hiveId: string;
  beekeeperId?: string;
  harvestDate: string;
  quantity: number; // in kg
  floralSource?: string;
  moisturePercent?: number;
  location?: Location;
  notes?: string;
  createdAt?: string;
}

export interface QuantityInconsistency {
  code: 'QUANTITY_INCONSISTENCY';
  severity: 'HIGH' | 'CRITICAL';
  stage: 'PROCESSING' | 'TRANSPORT' | 'PACKAGING' | 'BATCH_CREATION';
  message: string;
  expected: number;
  actual: number;
  difference: number;
  unit: string;
}

export interface ProcessingEvent {
  id: string;
  batchId: string;
  processorId: string;
  processorName?: string;
  eventType: string; // e.g. 'INTAKE', 'MOISTURE_EXTRACTION', 'MICRO_FILTRATION', 'SETTLING'
  temperatureCelsius?: number;
  moisturePercent?: number;
  inputWeightKg?: number;
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
  sampleId?: string;
  testerName: string;
  testDate: string;
  parameters: {
    moisturePercent: number; // Max 20% by FSSAI/Codex
    hmfMgPerKg: number;      // Max 40-80 mg/kg
    sucrosePercent: number;  // Max 5%
    c4SugarPercent?: number; // Max 7.0% by FSSAI
    pollenCountPerGram: number; // Min 25,000
    antibioticResidue: 'NEGATIVE' | 'POSITIVE';
    leadPpm: number;
  };
  overallStatus: 'PASSED' | 'REVIEW_REQUIRED';
  certificateHashSha256: string;
  reportUrl?: string;
  certificateRef?: string;
  notes?: string;
  blockchainTxId?: string;
  createdAt: string;
}

export interface Certification {
  id: string;
  batchId: string;
  authority: string;
  certificateType: string;
  issuedAt: string;
  status: 'VALID' | 'REVOKED';
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
  id: string; // e.g. HC-2026-0001
  provenanceModel?: ProvenanceModel;
  harvestId?: string;
  hiveId?: string;
  beekeeperId?: string;
  beekeeperName?: string;
  companyId?: string;
  companyName?: string;
  quantity: number;
  origin: string;
  floralSource?: string;
  status: BatchStatus;
  currentCustodian?: string;
  custodianRole?: Role;
  blockchainTxId?: string;
  blockchainStatus?: 'PENDING' | 'CONFIRMED' | 'FAILED';
  createdAt?: string;

  // Events & Populated details
  events?: Array<{ eventType: string; timestamp: string; details?: any }>;
  harvest?: Harvest;
  processingEvents?: ProcessingEvent[];
  transportEvents?: TransportEvent[];
  packagingEvents?: PackagingEvent[];
  qualityTests?: QualityLabTest[];
  certifications?: Certification[];
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
  ipAddress?: string;
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

export interface AiHealthResponse {
  health: 'NORMAL' | 'WARNING' | 'CRITICAL';
  healthScore: number; // 0 - 100
  reasons?: string[];
}

export type AiHealth = AiHealthResponse;

export interface AiAnomalyResponse {
  anomaly: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'WARNING' | 'CRITICAL' | 'NORMAL' | 'NONE';
  reasons: string[];
}

export type AiAnomaly = AiAnomalyResponse;

export interface AiYieldResponse {
  predictedYieldKg: number;
  confidence: number;
}

export interface ProvenanceCheckInput {
  batchId: string;
  blockchainHarvestQuantity: number;
  observedQuantity: number;
}

export interface ProvenanceCheckResponse {
  status: 'VERIFIED' | 'SUSPICIOUS';
  consistencyScore: number;
  anomalies: string[];
}

export interface HoneyPassport {
  batchId: string;
  provenanceModel?: ProvenanceModel;
  origin: string;
  quantity: number;
  floralSource?: string;
  status: string;
  createdAt: string;
  company?: {
    id: string;
    name: string;
    type?: string;
  };
  beekeeper?: {
    id: string;
    name: string;
    location?: string;
  };
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
    consistencyStatus: 'NORMAL' | 'WARNING' | 'SUSPICIOUS';
    consistencyScore: number;
    anomalies: string[];
  };
}
