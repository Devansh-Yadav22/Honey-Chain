export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Hive {
  id: string;
  beekeeperId: string;
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
  location?: Location;
  notes?: string;
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

export interface Batch {
  id: string;
  harvestId?: string;
  quantity: number;
  origin: string;
  status: 'CREATED' | 'PROCESSING' | 'TRANSPORT' | 'PACKAGED' | 'VERIFIED' | 'SUSPICIOUS';
  blockchainTxId?: string;
  blockchainStatus?: 'PENDING' | 'CONFIRMED' | 'FAILED';
  createdAt?: string;
  harvest?: Harvest;
  processingEvents?: ProcessingEvent[];
  transportEvents?: TransportEvent[];
  packagingEvents?: PackagingEvent[];
}

export interface AiHealth {
  health: 'NORMAL' | 'WARNING' | 'CRITICAL';
  healthScore: number;
}

export interface AiAnomaly {
  anomaly: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'NONE';
  reasons: string[];
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
