export interface Location {
  lat: number;
  lng: number;
  address?: string;
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
  location?: Location;
  notes?: string;
  createdAt?: string;
}

export interface ProcessingEvent {
  id: string;
  batchId: string;
  processorId: string;
  eventType: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface TransportEvent {
  id: string;
  batchId: string;
  transporterId: string;
  source: string;
  destination: string;
  timestamp: string;
}

export interface PackagingEvent {
  id: string;
  batchId: string;
  packagerId: string;
  productId: string;
  packagingDate: string;
}

export interface Certification {
  id: string;
  batchId: string;
  authority: string;
  certificateType: string;
  issuedAt: string;
  status: 'VALID' | 'REVOKED';
}

export interface Batch {
  id: string; // e.g. HC-2026-0001
  harvestId?: string;
  quantity: number;
  origin: string;
  status: 'CREATED' | 'PROCESSING' | 'TRANSPORT' | 'PACKAGED' | 'VERIFIED' | 'SUSPICIOUS';
  blockchainTxId?: string;
  blockchainStatus?: 'PENDING' | 'CONFIRMED' | 'FAILED';
  createdAt?: string;

  // Populated details
  harvest?: Harvest;
  processingEvents?: ProcessingEvent[];
  transportEvents?: TransportEvent[];
  packagingEvents?: PackagingEvent[];
  certifications?: Certification[];
}

export interface AiHealthResponse {
  health: 'NORMAL' | 'WARNING' | 'CRITICAL';
  healthScore: number; // 0 - 100
}

export interface AiAnomalyResponse {
  anomaly: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'NONE';
  reasons: string[];
}

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
  origin: string;
  quantity: number;
  status: string;
  createdAt: string;
  hive?: {
    id: string;
    location: Location;
  };
  harvest?: Harvest;
  timeline: {
    harvest?: Harvest;
    processing: ProcessingEvent[];
    transport: TransportEvent[];
    packaging: PackagingEvent[];
  };
  verification: {
    blockchainVerified: boolean;
    blockchainTxId?: string;
    provenanceStatus: 'VERIFIED' | 'SUSPICIOUS';
    consistencyScore: number;
    anomalies: string[];
  };
}
