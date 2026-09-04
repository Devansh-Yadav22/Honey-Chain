import { Request, Response } from 'express';
import multer from 'multer';
import { EvidenceService } from '../services/evidence.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuditService } from '../services/audit.service';
import fs from 'fs';

// Multer in-memory upload (limit 25MB)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

export class EvidenceController {
  static async uploadEvidence(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }

      const { batchId, fileType, metadata } = req.body;
      if (!batchId || !fileType) {
        return res.status(400).json({ success: false, error: 'batchId and fileType are required' });
      }

      let parsedMeta = {};
      if (metadata) {
        try {
          parsedMeta = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
        } catch (e) {
          parsedMeta = { raw: metadata };
        }
      }

      const uploaderId = req.user?.id || 'usr-anonymous';
      const record = await EvidenceService.saveEvidenceFile(
        batchId,
        uploaderId,
        fileType,
        req.file,
        parsedMeta
      );

      await AuditService.log('EVIDENCE_UPLOADED', 'EVIDENCE', record.id, uploaderId, req.ip, {
        batchId,
        fileType,
        fileName: record.fileName,
        sha256Hash: record.sha256Hash
      });

      return res.status(201).json({ success: true, data: record });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getByBatchId(req: Request, res: Response) {
    try {
      const { batchId } = req.params;
      const records = await EvidenceService.getByBatchId(batchId);
      return res.json({ success: true, data: records });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async verifyIntegrity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await EvidenceService.verifyIntegrity(id);
      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async downloadFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const record = await EvidenceService.getById(id);
      if (!record || !record.filePath || !fs.existsSync(record.filePath)) {
        return res.status(404).json({ success: false, error: 'File not found' });
      }

      res.setHeader('Content-Type', record.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${record.fileName}"`);
      return res.sendFile(record.filePath);
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
