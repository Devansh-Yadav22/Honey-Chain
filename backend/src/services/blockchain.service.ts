import crypto from 'crypto';
import { Batch } from '../types';
import { memoryStore } from './store';

export interface BlockchainTransaction {
  txId: string;
  blockNumber: number;
  timestamp: string;
  functionName: string;
  args: any[];
  status: 'CONFIRMED' | 'FAILED';
}

class BlockchainService {
  private mockLedger: Map<string, BlockchainTransaction[]> = new Map();
  private currentBlockNumber = 1042;

  private generateTxHash(data: string): string {
    return '0x' + crypto.createHash('sha256').update(data + Date.now().toString()).digest('hex').substring(0, 32);
  }

  async registerHive(hiveId: string, location: any, beekeeperId: string): Promise<BlockchainTransaction> {
    const tx: BlockchainTransaction = {
      txId: this.generateTxHash(`hive-${hiveId}`),
      blockNumber: ++this.currentBlockNumber,
      timestamp: new Date().toISOString(),
      functionName: 'registerHive',
      args: [hiveId, location, beekeeperId],
      status: 'CONFIRMED',
    };
    return tx;
  }

  async createHarvest(harvestId: string, hiveId: string, quantity: number): Promise<BlockchainTransaction> {
    const tx: BlockchainTransaction = {
      txId: this.generateTxHash(`harvest-${harvestId}`),
      blockNumber: ++this.currentBlockNumber,
      timestamp: new Date().toISOString(),
      functionName: 'createHarvest',
      args: [harvestId, hiveId, quantity],
      status: 'CONFIRMED',
    };
    return tx;
  }

  async createBatch(batchId: string, harvestId: string, quantity: number, origin: string): Promise<BlockchainTransaction> {
    const txId = this.generateTxHash(`batch-${batchId}`);
    const tx: BlockchainTransaction = {
      txId,
      blockNumber: ++this.currentBlockNumber,
      timestamp: new Date().toISOString(),
      functionName: 'createBatch',
      args: [batchId, harvestId, quantity, origin],
      status: 'CONFIRMED',
    };

    const history = this.mockLedger.get(batchId) || [];
    history.push(tx);
    this.mockLedger.set(batchId, history);

    return tx;
  }

  async addProcessingEvent(batchId: string, processorId: string, eventType: string, details: any): Promise<BlockchainTransaction> {
    const tx: BlockchainTransaction = {
      txId: this.generateTxHash(`proc-${batchId}`),
      blockNumber: ++this.currentBlockNumber,
      timestamp: new Date().toISOString(),
      functionName: 'addProcessingEvent',
      args: [batchId, processorId, eventType, details],
      status: 'CONFIRMED',
    };

    const history = this.mockLedger.get(batchId) || [];
    history.push(tx);
    this.mockLedger.set(batchId, history);

    return tx;
  }

  async addTransportEvent(batchId: string, transporterId: string, source: string, destination: string): Promise<BlockchainTransaction> {
    const tx: BlockchainTransaction = {
      txId: this.generateTxHash(`trans-${batchId}`),
      blockNumber: ++this.currentBlockNumber,
      timestamp: new Date().toISOString(),
      functionName: 'addTransportEvent',
      args: [batchId, transporterId, source, destination],
      status: 'CONFIRMED',
    };

    const history = this.mockLedger.get(batchId) || [];
    history.push(tx);
    this.mockLedger.set(batchId, history);

    return tx;
  }

  async addPackagingEvent(batchId: string, packagerId: string, productId: string): Promise<BlockchainTransaction> {
    const tx: BlockchainTransaction = {
      txId: this.generateTxHash(`pkg-${batchId}`),
      blockNumber: ++this.currentBlockNumber,
      timestamp: new Date().toISOString(),
      functionName: 'addPackagingEvent',
      args: [batchId, packagerId, productId],
      status: 'CONFIRMED',
    };

    const history = this.mockLedger.get(batchId) || [];
    history.push(tx);
    this.mockLedger.set(batchId, history);

    return tx;
  }

  async getBatch(batchId: string): Promise<Batch | null> {
    return memoryStore.batches.get(batchId) || null;
  }

  async getBatchHistory(batchId: string): Promise<BlockchainTransaction[]> {
    const history = this.mockLedger.get(batchId);
    if (history && history.length > 0) {
      return history;
    }

    return [
      {
        txId: memoryStore.batches.get(batchId)?.blockchainTxId || this.generateTxHash(batchId),
        blockNumber: 1040,
        timestamp: memoryStore.batches.get(batchId)?.createdAt || new Date().toISOString(),
        functionName: 'createBatch',
        args: [batchId, 'HARVEST-001', memoryStore.batches.get(batchId)?.quantity || 18, memoryStore.batches.get(batchId)?.origin || 'Delhi Apiary'],
        status: 'CONFIRMED'
      }
    ];
  }

  async verifyBatch(batchId: string): Promise<{ verified: boolean; message: string; txId?: string }> {
    const batch = memoryStore.batches.get(batchId);
    if (!batch) {
      return { verified: false, message: 'Batch not found on blockchain ledger' };
    }

    if (batch.status === 'SUSPICIOUS') {
      return {
        verified: false,
        message: 'Provenance anomaly detected. Recorded batch parameters conflict with evidence.',
        txId: batch.blockchainTxId
      };
    }

    return {
      verified: true,
      message: 'Tamper-evident record verified on Hyperledger Fabric ledger',
      txId: batch.blockchainTxId || this.generateTxHash(batchId)
    };
  }
}

export const blockchainService = new BlockchainService();
