import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { pool } from '../config/database';
import { EvidenceRecord } from '../types';

const memoryEvidence: EvidenceRecord[] = [];

// Ensure storage directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'evidence');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export class EvidenceService {
  /**
   * Computes SHA-256 hash of a buffer.
   */
  static computeSha256(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Computes SHA-256 hash of a file on disk.
   */
  static computeFileSha256(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    return this.computeSha256(fileBuffer);
  }

  static async saveEvidenceFile(
    batchId: string,
    uploaderId: string,
    fileType: EvidenceRecord['fileType'],
    file: { buffer: Buffer; originalname: string; size: number; mimetype: string },
    metadata: any = {}
  ): Promise<EvidenceRecord> {
    const id = `EVD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const sha256Hash = this.computeSha256(file.buffer);

    // Write file to uploads directory with unique name
    const ext = path.extname(file.originalname);
    const diskFileName = `${id}-${sha256Hash.substring(0, 12)}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, diskFileName);
    fs.writeFileSync(targetPath, file.buffer);

    const record: EvidenceRecord = {
      id,
      batchId,
      uploaderId,
      fileType,
      fileName: file.originalname,
      filePath: targetPath,
      fileSize: file.size,
      mimeType: file.mimetype,
      sha256Hash,
      metadata,
      createdAt: new Date().toISOString()
    };

    memoryEvidence.unshift(record);

    try {
      await pool.query(
        `INSERT INTO evidence (id, batch_id, uploader_id, file_type, file_name, file_path, file_size, mime_type, sha256_hash, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [id, batchId, uploaderId, fileType, record.fileName, record.filePath, record.fileSize, record.mimeType, record.sha256Hash, JSON.stringify(metadata)]
      );
    } catch (err) {
      // Memory fallback
    }

    return record;
  }

  static async getByBatchId(batchId: string): Promise<EvidenceRecord[]> {
    try {
      const result = await pool.query(
        `SELECT id, batch_id as "batchId", uploader_id as "uploaderId", file_type as "fileType",
                file_name as "fileName", file_path as "filePath", file_size as "fileSize", 
                mime_type as "mimeType", sha256_hash as "sha256Hash", metadata, 
                blockchain_tx_id as "blockchainTxId", created_at as "createdAt"
         FROM evidence 
         WHERE batch_id = $1 
         ORDER BY created_at DESC`,
        [batchId]
      );
      if (result.rows && result.rows.length > 0) {
        return result.rows;
      }
    } catch (err) {
      // Memory fallback
    }

    return memoryEvidence.filter(e => e.batchId === batchId);
  }

  static async getById(id: string): Promise<EvidenceRecord | null> {
    try {
      const result = await pool.query(
        `SELECT id, batch_id as "batchId", uploader_id as "uploaderId", file_type as "fileType",
                file_name as "fileName", file_path as "filePath", file_size as "fileSize", 
                mime_type as "mimeType", sha256_hash as "sha256Hash", metadata, 
                blockchain_tx_id as "blockchainTxId", created_at as "createdAt"
         FROM evidence 
         WHERE id = $1`,
        [id]
      );
      if (result.rows && result.rows[0]) {
        return result.rows[0];
      }
    } catch (err) {
      // Memory fallback
    }

    return memoryEvidence.find(e => e.id === id) || null;
  }

  static async verifyIntegrity(id: string): Promise<{ valid: boolean; currentHash: string; recordedHash: string; reason?: string }> {
    const record = await this.getById(id);
    if (!record) {
      return { valid: false, currentHash: '', recordedHash: '', reason: 'Evidence record not found' };
    }

    if (!record.filePath || !fs.existsSync(record.filePath)) {
      return { valid: false, currentHash: '', recordedHash: record.sha256Hash, reason: 'Physical file missing from storage' };
    }

    const currentHash = this.computeFileSha256(record.filePath);
    const valid = currentHash === record.sha256Hash;
    return {
      valid,
      currentHash,
      recordedHash: record.sha256Hash,
      reason: valid ? 'Cryptographic SHA-256 verification succeeded' : 'SHA-256 hash mismatch: file tampered with'
    };
  }
}
