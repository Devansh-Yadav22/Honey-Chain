import { 
  Hive, TelemetryRecord, Batch, HoneyPassport, AiHealth, AiAnomaly, 
  User, Organization, QualityLabTest, AuditLog, AdminException, SystemHealth, Role,
  EvidenceRecord, Handoff, LocationRecord, Alert 
} from '../types/index.js';

const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE = (import.meta as any).env?.VITE_API_URL || `http://${hostname}:5000/api`;

let activeAuthHeaders: Record<string, string> = {};

export function setApiAuth(user: User | null, token?: string) {
  if (user) {
    activeAuthHeaders = {
      'x-user-id': user.id,
      'x-role': user.role,
      'x-org-id': user.organizationId || user.orgId || '',
      'Authorization': token ? `Bearer ${token}` : `Bearer token-${user.id}`
    };
  } else {
    activeAuthHeaders = {
      'x-role': 'CONSUMER'
    };
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...activeAuthHeaders,
      ...(options?.headers || {})
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.warn(`[API Client] ${options?.method || 'GET'} ${url} returned ${res.status}:`, errBody);
      return null;
    }
    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  } catch (err) {
    console.warn(`[API Client] Fetch failed for ${url}:`, err);
    return null;
  }
}

// ---------------- AUTH & USER MGMT ----------------
export async function getAuthUsers(): Promise<User[]> {
  const data = await fetchJson<User[]>(`${API_BASE}/users`);
  return data || [];
}

export async function getAuthOrganizations(status?: string): Promise<Organization[]> {
  const url = status ? `${API_BASE}/organizations?status=${status}` : `${API_BASE}/organizations`;
  const data = await fetchJson<Organization[]>(url);
  return data || [];
}

export async function updateOrganizationStatus(id: string, status: string): Promise<Organization | null> {
  return fetchJson<Organization>(`${API_BASE}/organizations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function updateUserStatus(id: string, status: string): Promise<User | null> {
  return fetchJson<User>(`${API_BASE}/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function loginWithPassword(email: string, password: string): Promise<{ token: string; user: User; organization?: Organization } | null> {
  return fetchJson<{ token: string; user: User; organization?: Organization }>(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function signupWithPassword(data: any): Promise<{ token: string; user: User; organization?: Organization } | null> {
  return fetchJson<{ token: string; user: User; organization?: Organization }>(`${API_BASE}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function getDemoAccounts(): Promise<any[]> {
  const data = await fetchJson<any[]>(`${API_BASE}/auth/demo-accounts`);
  return data || [];
}

// ---------------- EVIDENCE MGMT (SHA-256) ----------------
export async function uploadEvidenceFile(
  batchId: string,
  fileType: string,
  file: File,
  metadata: any = {}
): Promise<EvidenceRecord | null> {
  try {
    const formData = new FormData();
    formData.append('batchId', batchId);
    formData.append('fileType', fileType);
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    const headers: Record<string, string> = { ...activeAuthHeaders };
    delete (headers as any)['Content-Type']; // Let browser set boundary

    const res = await fetch(`${API_BASE}/evidence/upload`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn('[API Client] Evidence upload failed:', err);
    return null;
  }
}

export async function getBatchEvidence(batchId: string): Promise<EvidenceRecord[]> {
  const data = await fetchJson<EvidenceRecord[]>(`${API_BASE}/evidence/batch/${batchId}`);
  return data || [];
}

export async function verifyEvidenceHash(id: string): Promise<{ valid: boolean; currentHash: string; recordedHash: string; reason?: string } | null> {
  return fetchJson<{ valid: boolean; currentHash: string; recordedHash: string; reason?: string }>(`${API_BASE}/evidence/${id}/verify`);
}

// ---------------- GEOLOCATION TRACKING ----------------
export async function recordLocationPoint(data: {
  batchId: string;
  stage: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  isMocked?: boolean;
}): Promise<LocationRecord | null> {
  return fetchJson<LocationRecord>(`${API_BASE}/locations`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function getBatchLocations(batchId: string): Promise<LocationRecord[]> {
  const data = await fetchJson<LocationRecord[]>(`${API_BASE}/locations/batch/${batchId}`);
  return data || [];
}

// ---------------- HANDOFFS & CUSTODY STATE MACHINE ----------------
export async function initiateCustodyHandoff(data: {
  batchId: string;
  receiverId: string;
  fromStage: string;
  toStage: string;
  quantity: number;
  unit?: string;
  evidenceHashes?: string[];
  location?: { lat: number; lng: number; address?: string };
}): Promise<Handoff | null> {
  return fetchJson<Handoff>(`${API_BASE}/handoffs`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function acceptCustodyHandoff(id: string): Promise<Handoff | null> {
  return fetchJson<Handoff>(`${API_BASE}/handoffs/${id}/accept`, {
    method: 'POST',
    body: JSON.stringify({})
  });
}

export async function rejectCustodyHandoff(id: string, disputeReason: string): Promise<Handoff | null> {
  return fetchJson<Handoff>(`${API_BASE}/handoffs/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ disputeReason })
  });
}

export async function getPendingHandoffs(): Promise<Handoff[]> {
  const data = await fetchJson<Handoff[]>(`${API_BASE}/handoffs/pending`);
  return data || [];
}

export async function getBatchHandoffs(batchId: string): Promise<Handoff[]> {
  const data = await fetchJson<Handoff[]>(`${API_BASE}/handoffs/batch/${batchId}`);
  return data || [];
}

// ---------------- CONSISTENCY ENGINE & ALERTS ----------------
export async function getBatchConsistencyReport(batchId: string): Promise<any | null> {
  return fetchJson<any>(`${API_BASE}/consistency/batch/${batchId}`);
}

export async function getSystemAlerts(status?: string, severity?: string): Promise<Alert[]> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (severity) params.append('severity', severity);
  const qs = params.toString() ? `?${params.toString()}` : '';
  const data = await fetchJson<Alert[]>(`${API_BASE}/alerts${qs}`);
  return data || [];
}

export async function resolveSystemAlert(id: string, resolutionNotes: string): Promise<Alert | null> {
  return fetchJson<Alert>(`${API_BASE}/alerts/${id}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify({ resolutionNotes })
  });
}

// ---------------- HIVES & TELEMETRY ----------------
export async function getHives(): Promise<Hive[]> {
  const data = await fetchJson<Hive[]>(`${API_BASE}/hives`);
  return data || [];
}

export async function getHiveById(id: string): Promise<Hive | null> {
  const data = await fetchJson<Hive>(`${API_BASE}/hives/${id}`);
  return data || null;
}

export async function getHiveTelemetry(hiveId: string): Promise<TelemetryRecord[]> {
  const data = await fetchJson<TelemetryRecord[]>(`${API_BASE}/hives/${hiveId}/telemetry`);
  if (data && data.length > 0) return data;

  const now = Date.now();
  return Array.from({ length: 10 }).map((_, i) => ({
    hiveId,
    temperature: 34.2 + (Math.sin(i) * 0.4),
    humidity: 60.0 + (Math.cos(i) * 1.5),
    weight: 44.0 + (i * 0.1),
    activity: 0.85 + (Math.sin(i) * 0.03),
    timestamp: new Date(now - (9 - i) * 300000).toISOString()
  }));
}

export async function getHiveHealth(hiveId: string): Promise<AiHealth> {
  const data = await fetchJson<AiHealth>(`${API_BASE}/hives/${hiveId}/health`);
  if (data) return data;
  if (hiveId === 'HIVE-005' || hiveId === 'HIVE-006' || hiveId === 'HIVE-007') {
    return { health: 'CRITICAL', healthScore: 38 };
  }
  if (hiveId === 'HIVE-003' || hiveId === 'HIVE-008' || hiveId === 'HIVE-009') {
    return { health: 'WARNING', healthScore: 65 };
  }
  return { health: 'NORMAL', healthScore: 95 };
}

export async function getHiveAnomalies(hiveId: string): Promise<AiAnomaly> {
  const data = await fetchJson<AiAnomaly>(`${API_BASE}/hives/${hiveId}/anomalies`);
  if (data) return data;
  if (hiveId === 'HIVE-005') return { anomaly: true, severity: 'CRITICAL', reasons: ['Severe temperature elevation (>40°C)', 'Depressed worker bee activity (0.18)'] };
  if (hiveId === 'HIVE-006') return { anomaly: true, severity: 'CRITICAL', reasons: ['Sudden hive mass drop (>10kg)', 'Swarm absconding event detected'] };
  if (hiveId === 'HIVE-007') return { anomaly: true, severity: 'CRITICAL', reasons: ['Low core brood temperature (<10°C)', 'Brood chilling risk'] };
  if (hiveId === 'HIVE-008') return { anomaly: true, severity: 'WARNING', reasons: ['Heightened bee agitation and traffic', 'Possible robbing activity'] };
  if (hiveId === 'HIVE-009') return { anomaly: true, severity: 'WARNING', reasons: ['Excessive humidity (>90%)', 'Brood dampness risk'] };
  if (hiveId === 'HIVE-003') return { anomaly: true, severity: 'WARNING', reasons: ['Elevated hive temperature (38.2°C)', 'Higher than average humidity'] };
  return { anomaly: false, severity: 'NONE', reasons: [] };
}

export async function registerHive(data: { id: string; location: { lat: number; lng: number; address: string }; status?: string; beekeeperId?: string }): Promise<Hive | null> {
  return fetchJson<Hive>(`${API_BASE}/hives`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function ingestTelemetry(data: {
  hiveId: string;
  telemetry: {
    temperature: number;
    humidity: number;
    weight: number;
    activity: number;
  };
  timestamp?: string;
}): Promise<TelemetryRecord | null> {
  return fetchJson<TelemetryRecord>(`${API_BASE}/telemetry`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// ---------------- BATCHES & PARTICIPANT WORKFLOWS ----------------
export async function getBatches(): Promise<Batch[]> {
  const data = await fetchJson<Batch[]>(`${API_BASE}/batches`);
  return data || [];
}

export async function getBatchById(id: string): Promise<Batch | null> {
  const data = await fetchJson<Batch>(`${API_BASE}/batches/${id}`);
  return data || null;
}

export async function getBatchTimeline(id: string): Promise<any | null> {
  const data = await fetchJson<any>(`${API_BASE}/batches/${id}/timeline`);
  return data || null;
}

export async function checkProvenance(data: {
  batchId: string;
  blockchainHarvestQuantity: number;
  observedQuantity: number;
}): Promise<any | null> {
  return fetchJson<any>(`${API_BASE}/provenance/check`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function createBatch(data: {
  harvestId?: string;
  quantity: number;
  origin: string;
  floralSource?: string;
  hiveId?: string;
  id?: string;
}): Promise<Batch | null> {
  return fetchJson<Batch>(`${API_BASE}/batches`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function recordBatchIntake(batchId: string): Promise<Batch | null> {
  return fetchJson<Batch>(`${API_BASE}/batches/${batchId}/intake`, {
    method: 'POST',
    body: JSON.stringify({})
  });
}

export async function recordBatchProcessing(
  batchId: string, 
  data: {
    eventType: string;
    temperatureCelsius?: number;
    moisturePercent?: number;
    outputWeightKg?: number;
    details?: any;
  }
): Promise<any | null> {
  return fetchJson(`${API_BASE}/batches/${batchId}/processing`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function markBatchReadyTransport(batchId: string): Promise<Batch | null> {
  return fetchJson<Batch>(`${API_BASE}/batches/${batchId}/ready-transport`, {
    method: 'POST',
    body: JSON.stringify({})
  });
}

export async function recordBatchTransport(
  batchId: string, 
  data: {
    source: string;
    destination: string;
    vehicleNumber?: string;
    transitTemperatureCelsius?: number;
    conditionStatus?: string;
  }
): Promise<any | null> {
  return fetchJson(`${API_BASE}/batches/${batchId}/transport`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function confirmBatchTransportReceipt(batchId: string): Promise<Batch | null> {
  return fetchJson<Batch>(`${API_BASE}/batches/${batchId}/transport-receipt`, {
    method: 'POST',
    body: JSON.stringify({})
  });
}

export async function recordBatchPackaging(
  batchId: string, 
  data: {
    productId: string;
    containerType?: string;
    unitsCount?: number;
    unitWeightGrams?: number;
  }
): Promise<any | null> {
  return fetchJson(`${API_BASE}/batches/${batchId}/packaging`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function publishBatchPassport(batchId: string): Promise<Batch | null> {
  return fetchJson<Batch>(`${API_BASE}/batches/${batchId}/publish`, {
    method: 'POST',
    body: JSON.stringify({})
  });
}

// ---------------- QUALITY / LAB ----------------
export async function getQualityTests(batchId?: string): Promise<QualityLabTest[]> {
  const url = batchId ? `${API_BASE}/quality/tests/${batchId}` : `${API_BASE}/quality/tests`;
  const data = await fetchJson<QualityLabTest[]>(url);
  return data || [];
}

export async function recordQualityTest(data: {
  batchId: string;
  sampleId?: string;
  labName?: string;
  testerName?: string;
  certificateRef?: string;
  reportUrl?: string;
  parameters: {
    moisturePercent: number;
    hmfMgPerKg: number;
    sucrosePercent: number;
    c4SugarPercent?: number;
    pollenCountPerGram: number;
    antibioticResidue: 'NEGATIVE' | 'POSITIVE';
    leadPpm: number;
  };
  notes?: string;
}): Promise<QualityLabTest | null> {
  return fetchJson<QualityLabTest>(`${API_BASE}/quality/tests`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// ---------------- ADMIN / OPERATIONS ----------------
export async function getAdminOverview(): Promise<{ metrics: any; recentActivity: AuditLog[] } | null> {
  return fetchJson<{ metrics: any; recentActivity: AuditLog[] }>(`${API_BASE}/admin/overview`);
}

export async function getAdminAuditLogs(limit: number = 50, offset: number = 0): Promise<AuditLog[]> {
  const data = await fetchJson<AuditLog[]>(`${API_BASE}/audit/logs?limit=${limit}&offset=${offset}`);
  if (data && data.length > 0) return data;
  const legacyData = await fetchJson<AuditLog[]>(`${API_BASE}/admin/audit?limit=${limit}`);
  return legacyData || [];
}

export async function getAdminExceptions(): Promise<AdminException[]> {
  const data = await fetchJson<AdminException[]>(`${API_BASE}/admin/exceptions`);
  return data || [];
}

export async function resolveAdminException(id: string, notes: string): Promise<AdminException | null> {
  return fetchJson<AdminException>(`${API_BASE}/admin/exceptions/${id}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify({ notes })
  });
}

export async function getSystemHealth(): Promise<SystemHealth | null> {
  return fetchJson<SystemHealth>(`${API_BASE}/admin/health`);
}

// ---------------- PASSPORT ----------------
export async function getHoneyPassport(batchId: string): Promise<HoneyPassport | null> {
  return fetchJson<HoneyPassport>(`${API_BASE}/passport/${batchId}`);
}
