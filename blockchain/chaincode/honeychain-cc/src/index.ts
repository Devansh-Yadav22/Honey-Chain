import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';

type HealthStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';
type BatchStatus = 'CREATED' | 'PROCESSING' | 'IN_TRANSIT' | 'PACKAGED' | 'VERIFIED';
type EventType = 'PROCESSING' | 'TRANSPORT' | 'PACKAGING' | 'CERTIFICATION';
type VerificationStatus = 'VERIFIED' | 'INCOMPLETE';

interface Location {
  lat?: number;
  lng?: number;
  address?: string;
  district?: string;
  state?: string;
  country?: string;
}

interface Beekeeper {
  beekeeperId: string;
  name?: string;
  contact?: string;
  location?: Location | string;
  createdAt: string;
}

interface Hive {
  docType: 'Hive';
  hiveId: string;
  beekeeperId: string;
  beekeeper?: Beekeeper;
  location: Location | string;
  installationDate: string;
  status: HealthStatus | string;
  createdAt: string;
  updatedAt: string;
}

interface Harvest {
  docType: 'Harvest';
  harvestId: string;
  hiveId: string;
  beekeeperId: string;
  harvestDate: string;
  quantity: number;
  unit: 'kg';
  location: Location | string;
  evidenceRef?: string;
  createdAt: string;
}

interface ProvenanceEvent {
  eventId: string;
  batchId: string;
  eventType: EventType;
  actorId: string;
  timestamp: string;
  details?: Record<string, unknown>;
  source?: string;
  destination?: string;
  productId?: string;
  evidenceRef?: string;
}

interface Batch {
  docType: 'Batch';
  batchId: string;
  harvestId: string;
  hiveId: string;
  beekeeperId: string;
  quantity: number;
  unit: 'kg';
  origin: Location | string;
  status: BatchStatus;
  events: ProvenanceEvent[];
  verification: {
    status: VerificationStatus;
    checkedAt?: string;
    reasons: string[];
    disclaimer: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface HiveInput {
  hiveId: string;
  beekeeperId: string;
  location: Location | string;
  installationDate?: string;
  status?: HealthStatus | string;
  beekeeper?: Partial<Beekeeper>;
}

interface HarvestInput {
  harvestId: string;
  hiveId: string;
  beekeeperId?: string;
  harvestDate?: string;
  quantity: number;
  location?: Location | string;
  evidenceRef?: string;
}

interface BatchInput {
  batchId: string;
  harvestId: string;
  quantity?: number;
  origin?: Location | string;
}

interface ProcessingEventInput {
  eventId?: string;
  processorId: string;
  timestamp?: string;
  eventType?: string;
  details?: Record<string, unknown>;
  evidenceRef?: string;
}

interface TransportEventInput {
  eventId?: string;
  transporterId: string;
  source: string;
  destination: string;
  timestamp?: string;
  details?: Record<string, unknown>;
  evidenceRef?: string;
}

interface PackagingEventInput {
  eventId?: string;
  packagerId: string;
  packagingDate?: string;
  productId: string;
  details?: Record<string, unknown>;
  evidenceRef?: string;
}

interface HistoryRecord {
  txId: string;
  timestamp?: string;
  isDelete: boolean;
  value?: Batch;
}

const BATCH_ID_PATTERN = /^HC-\d{4}-\d{4}$/;
const PURITY_DISCLAIMER =
  'Blockchain verifies recorded provenance and chain-of-custody state; it does not prove physical honey purity.';

@Info({
  title: 'HoneyChainContract',
  description: 'Permissioned honey provenance chaincode for Honey Chain Phase 1',
})
export class HoneyChainContract extends Contract {
  @Transaction()
  public async initLedger(ctx: Context): Promise<void> {
    const hiveKey = this.hiveKey('HIVE-001');
    const existingHive = await ctx.stub.getState(hiveKey);
    if (existingHive.length > 0) {
      return;
    }

    const hive: Hive = {
      docType: 'Hive',
      hiveId: 'HIVE-001',
      beekeeperId: 'BK-001',
      beekeeper: {
        beekeeperId: 'BK-001',
        name: 'Bee-Tech Demo Apiary',
        contact: 'demo@honeychain.local',
        location: 'Delhi NCR',
        createdAt: new Date().toISOString(),
      },
      location: { lat: 28.6139, lng: 77.209, district: 'New Delhi', state: 'Delhi', country: 'India' },
      installationDate: '2026-09-01',
      status: 'NORMAL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await ctx.stub.putState(hiveKey, this.toBuffer(hive));
  }

  @Transaction()
  public async registerHive(ctx: Context, hiveJson: string): Promise<string> {
    const input = this.parseJson<HiveInput>(hiveJson, 'hive');
    this.requireString(input.hiveId, 'hiveId');
    this.requireString(input.beekeeperId, 'beekeeperId');

    const key = this.hiveKey(input.hiveId);
    await this.assertMissing(ctx, key, `Hive ${input.hiveId} already exists`);

    const now = new Date().toISOString();
    const hive: Hive = {
      docType: 'Hive',
      hiveId: input.hiveId,
      beekeeperId: input.beekeeperId,
      beekeeper: input.beekeeper
        ? {
            beekeeperId: input.beekeeperId,
            name: input.beekeeper.name,
            contact: input.beekeeper.contact,
            location: input.beekeeper.location,
            createdAt: input.beekeeper.createdAt ?? now,
          }
        : undefined,
      location: input.location,
      installationDate: input.installationDate ?? now,
      status: input.status ?? 'NORMAL',
      createdAt: now,
      updatedAt: now,
    };

    await ctx.stub.putState(key, this.toBuffer(hive));
    return JSON.stringify(hive);
  }

  @Transaction()
  public async createHarvest(ctx: Context, harvestJson: string): Promise<string> {
    const input = this.parseJson<HarvestInput>(harvestJson, 'harvest');
    this.requireString(input.harvestId, 'harvestId');
    this.requireString(input.hiveId, 'hiveId');
    this.requirePositiveNumber(input.quantity, 'quantity');

    const hive = await this.getAsset<Hive>(ctx, this.hiveKey(input.hiveId), `Hive ${input.hiveId} does not exist`);
    const harvestKey = this.harvestKey(input.harvestId);
    await this.assertMissing(ctx, harvestKey, `Harvest ${input.harvestId} already exists`);

    const harvest: Harvest = {
      docType: 'Harvest',
      harvestId: input.harvestId,
      hiveId: input.hiveId,
      beekeeperId: input.beekeeperId ?? hive.beekeeperId,
      harvestDate: input.harvestDate ?? new Date().toISOString(),
      quantity: input.quantity,
      unit: 'kg',
      location: input.location ?? hive.location,
      evidenceRef: input.evidenceRef,
      createdAt: new Date().toISOString(),
    };

    await ctx.stub.putState(harvestKey, this.toBuffer(harvest));
    return JSON.stringify(harvest);
  }

  @Transaction()
  public async createBatch(ctx: Context, batchJson: string): Promise<string> {
    const input = this.parseJson<BatchInput>(batchJson, 'batch');
    this.requireString(input.batchId, 'batchId');
    this.requireString(input.harvestId, 'harvestId');

    if (!BATCH_ID_PATTERN.test(input.batchId)) {
      throw new Error(`batchId must use HC-YYYY-NNNN format. Received: ${input.batchId}`);
    }

    const batchKey = this.batchKey(input.batchId);
    await this.assertMissing(ctx, batchKey, `Batch ${input.batchId} already exists`);

    const harvest = await this.getAsset<Harvest>(
      ctx,
      this.harvestKey(input.harvestId),
      `Harvest ${input.harvestId} does not exist`,
    );

    const quantity = input.quantity ?? harvest.quantity;
    this.requirePositiveNumber(quantity, 'quantity');

    const now = new Date().toISOString();
    const batch: Batch = {
      docType: 'Batch',
      batchId: input.batchId,
      harvestId: harvest.harvestId,
      hiveId: harvest.hiveId,
      beekeeperId: harvest.beekeeperId,
      quantity,
      unit: 'kg',
      origin: input.origin ?? harvest.location,
      status: 'CREATED',
      events: [],
      verification: {
        status: 'INCOMPLETE',
        reasons: ['Processing, transport, and packaging events are not complete yet.'],
        disclaimer: PURITY_DISCLAIMER,
      },
      createdAt: now,
      updatedAt: now,
    };

    await ctx.stub.putState(batchKey, this.toBuffer(batch));
    return JSON.stringify(batch);
  }

  @Transaction()
  public async addEvent(ctx: Context, batchId: string, eventJson: string): Promise<string> {
    const event = this.parseJson<ProvenanceEvent>(eventJson, 'event');
    this.requireString(batchId, 'batchId');
    this.requireString(event.eventType, 'eventType');
    this.requireString(event.actorId, 'actorId');

    if (!['PROCESSING', 'TRANSPORT', 'PACKAGING', 'CERTIFICATION'].includes(event.eventType)) {
      throw new Error(`Unsupported eventType ${event.eventType}`);
    }

    return this.addProvenanceEvent(ctx, batchId, {
      ...event,
      batchId,
      eventId: event.eventId ?? this.nextEventId(event.eventType, batchId),
      timestamp: event.timestamp ?? new Date().toISOString(),
    });
  }

  @Transaction()
  public async addProcessingEvent(ctx: Context, batchId: string, eventJson: string): Promise<string> {
    const input = this.parseJson<ProcessingEventInput>(eventJson, 'processing event');
    this.requireString(input.processorId, 'processorId');

    return this.addProvenanceEvent(ctx, batchId, {
      eventId: input.eventId ?? this.nextEventId('PROCESSING', batchId),
      batchId,
      eventType: 'PROCESSING',
      actorId: input.processorId,
      timestamp: input.timestamp ?? new Date().toISOString(),
      details: {
        eventType: input.eventType ?? 'FILTERING_OR_GRADING',
        ...(input.details ?? {}),
      },
      evidenceRef: input.evidenceRef,
    });
  }

  @Transaction()
  public async addTransportEvent(ctx: Context, batchId: string, eventJson: string): Promise<string> {
    const input = this.parseJson<TransportEventInput>(eventJson, 'transport event');
    this.requireString(input.transporterId, 'transporterId');
    this.requireString(input.source, 'source');
    this.requireString(input.destination, 'destination');

    return this.addProvenanceEvent(ctx, batchId, {
      eventId: input.eventId ?? this.nextEventId('TRANSPORT', batchId),
      batchId,
      eventType: 'TRANSPORT',
      actorId: input.transporterId,
      source: input.source,
      destination: input.destination,
      timestamp: input.timestamp ?? new Date().toISOString(),
      details: input.details,
      evidenceRef: input.evidenceRef,
    });
  }

  @Transaction()
  public async addPackagingEvent(ctx: Context, batchId: string, eventJson: string): Promise<string> {
    const input = this.parseJson<PackagingEventInput>(eventJson, 'packaging event');
    this.requireString(input.packagerId, 'packagerId');
    this.requireString(input.productId, 'productId');

    return this.addProvenanceEvent(ctx, batchId, {
      eventId: input.eventId ?? this.nextEventId('PACKAGING', batchId),
      batchId,
      eventType: 'PACKAGING',
      actorId: input.packagerId,
      productId: input.productId,
      timestamp: input.packagingDate ?? new Date().toISOString(),
      details: input.details,
      evidenceRef: input.evidenceRef,
    });
  }

  @Transaction(false)
  @Returns('string')
  public async getBatch(ctx: Context, batchId: string): Promise<string> {
    this.requireString(batchId, 'batchId');
    const batch = await this.getAsset<Batch>(ctx, this.batchKey(batchId), `Batch ${batchId} does not exist`);
    return JSON.stringify(batch);
  }

  @Transaction(false)
  @Returns('string')
  public async getBatchHistory(ctx: Context, batchId: string): Promise<string> {
    this.requireString(batchId, 'batchId');
    const iterator = await ctx.stub.getHistoryForKey(this.batchKey(batchId));
    const results: HistoryRecord[] = [];

    try {
      while (true) {
        const item = await iterator.next();

        if (item.value) {
          const timestamp = item.value.timestamp
  ? (() => {
      const seconds = item.value.timestamp.seconds;
      const secondsValue =
        typeof seconds === 'number'
          ? seconds
          : typeof seconds === 'bigint'
            ? Number(seconds)
            : Number(seconds?.low ?? seconds);

      const nanos = Number(item.value.timestamp.nanos ?? 0);
      const date = new Date(secondsValue * 1000 + Math.floor(nanos / 1000000));

      return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
    })()
  : undefined;
          const value = item.value.value?.length ? (JSON.parse(item.value.value.toString()) as Batch) : undefined;

          results.push({
            txId: item.value.txId,
            timestamp,
            isDelete: item.value.isDelete,
            value,
          });
        }

        if (item.done) {
          break;
        }
      }
    } finally {
      await iterator.close();
    }

    return JSON.stringify(results);
  }

  @Transaction()
  public async verifyBatch(ctx: Context, batchId: string): Promise<string> {
    this.requireString(batchId, 'batchId');
    const batch = await this.getAsset<Batch>(ctx, this.batchKey(batchId), `Batch ${batchId} does not exist`);
    const eventTypes = batch.events.map((event) => event.eventType);
    const presentEvents = new Set(eventTypes);
    const reasons: string[] = [];

    if (!presentEvents.has('PROCESSING')) {
      reasons.push('Processing event missing');
    }
    if (!presentEvents.has('TRANSPORT')) {
      reasons.push('Transport event missing');
    }
    if (!presentEvents.has('PACKAGING')) {
      reasons.push('Packaging event missing');
    }
    if (!this.isOrderedChainOfCustody(eventTypes)) {
      reasons.push('Processing, transport, and packaging events are out of order');
    }
    if (batch.quantity <= 0) {
      reasons.push('Batch quantity must be greater than zero');
    }

    const status: VerificationStatus = reasons.length === 0 ? 'VERIFIED' : 'INCOMPLETE';
    const updated: Batch = {
      ...batch,
      status: status === 'VERIFIED' ? 'VERIFIED' : batch.status,
      verification: {
        status,
        checkedAt: new Date().toISOString(),
        reasons,
        disclaimer: PURITY_DISCLAIMER,
      },
      updatedAt: new Date().toISOString(),
    };

    await ctx.stub.putState(this.batchKey(batchId), this.toBuffer(updated));

    return JSON.stringify({
      batchId,
      status,
      reasons,
      eventCount: batch.events.length,
      disclaimer: PURITY_DISCLAIMER,
    });
  }

  @Transaction(false)
  @Returns('string')
  public async assetExists(ctx: Context, key: string): Promise<string> {
    const data = await ctx.stub.getState(key);
    return JSON.stringify({ key, exists: data.length > 0 });
  }

  private async addProvenanceEvent(ctx: Context, batchId: string, event: ProvenanceEvent): Promise<string> {
    this.requireString(batchId, 'batchId');

    const batch = await this.getAsset<Batch>(ctx, this.batchKey(batchId), `Batch ${batchId} does not exist`);
    if (batch.events.some((existing) => existing.eventId === event.eventId)) {
      throw new Error(`Event ${event.eventId} already exists on batch ${batchId}`);
    }

    const eventTypes = [...batch.events.map((existing) => existing.eventType), event.eventType];
    if (!this.isOrderedChainOfCustody(eventTypes)) {
      throw new Error('Provenance events must follow Processing, Transport, Packaging order');
    }

    const statusByEvent: Record<EventType, BatchStatus> = {
      PROCESSING: 'PROCESSING',
      TRANSPORT: 'IN_TRANSIT',
      PACKAGING: 'PACKAGED',
      CERTIFICATION: batch.status,
    };

    const updated: Batch = {
      ...batch,
      status: statusByEvent[event.eventType],
      events: [...batch.events, event],
      verification: {
        status: 'INCOMPLETE',
        reasons: ['Batch changed after last verification; run verifyBatch again.'],
        disclaimer: PURITY_DISCLAIMER,
      },
      updatedAt: new Date().toISOString(),
    };

    await ctx.stub.putState(this.batchKey(batchId), this.toBuffer(updated));
    return JSON.stringify(updated);
  }

  private async getAsset<T>(ctx: Context, key: string, missingMessage: string): Promise<T> {
    const data = await ctx.stub.getState(key);

    if (!data || data.length === 0) {
      throw new Error(missingMessage);
    }

    return JSON.parse(data.toString()) as T;
  }

  private async assertMissing(ctx: Context, key: string, message: string): Promise<void> {
    const data = await ctx.stub.getState(key);

    if (data && data.length > 0) {
      throw new Error(message);
    }
  }

  private parseJson<T>(value: string, label: string): T {
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      throw new Error(`Invalid ${label} JSON: ${(error as Error).message}`);
    }
  }

  private requireString(value: unknown, field: string): void {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`${field} is required`);
    }
  }

  private requirePositiveNumber(value: unknown, field: string): void {
    if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
      throw new Error(`${field} must be a positive number`);
    }
  }

  private isOrderedChainOfCustody(eventTypes: EventType[]): boolean {
    const requiredTypes: EventType[] = ['PROCESSING', 'TRANSPORT', 'PACKAGING'];
    let nextRequiredIndex = 0;

    for (const eventType of eventTypes) {
      if (eventType === 'CERTIFICATION') {
        if (nextRequiredIndex < requiredTypes.length) {
          return false;
        }
        continue;
      }

      const currentIndex = requiredTypes.indexOf(eventType);
      if (currentIndex !== nextRequiredIndex) {
        return false;
      }

      nextRequiredIndex += 1;
    }

    return true;
  }

  private toBuffer(value: unknown): Buffer {
    return Buffer.from(JSON.stringify(value));
  }

  private hiveKey(hiveId: string): string {
    return `HIVE_${hiveId}`;
  }

  private harvestKey(harvestId: string): string {
    return `HARVEST_${harvestId}`;
  }

  private batchKey(batchId: string): string {
    return `BATCH_${batchId}`;
  }

  private nextEventId(eventType: EventType | string, batchId: string): string {
    return `${eventType}_${batchId}_${Date.now()}`;
  }
}

export const contracts: typeof Contract[] = [HoneyChainContract];
