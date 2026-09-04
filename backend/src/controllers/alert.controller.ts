import { Request, Response } from 'express';
import { AlertService } from '../services/alert.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuditService } from '../services/audit.service';

export class AlertController {
  static async getAll(req: Request, res: Response) {
    try {
      const { status, severity } = req.query as { status?: string; severity?: string };
      const alerts = await AlertService.getAlerts(status, severity);
      return res.json({ success: true, data: alerts });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { batchId, severity, category, message, details } = req.body;
      if (!severity || !category || !message) {
        return res.status(400).json({
          success: false,
          error: 'severity, category, and message are required'
        });
      }

      const alert = await AlertService.createAlert(
        batchId || null,
        severity,
        category,
        message,
        details
      );

      await AuditService.log('ALERT_CREATED', 'ALERT', alert.id, req.user?.id, req.ip, {
        severity,
        category,
        batchId
      });

      return res.status(201).json({ success: true, data: alert });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async resolve(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { resolutionNotes } = req.body;
      if (!resolutionNotes) {
        return res.status(400).json({ success: false, error: 'Resolution notes are required' });
      }

      const resolvedBy = req.user?.id || 'usr-admin-01';
      const alert = await AlertService.resolveAlert(id, resolvedBy, resolutionNotes);
      if (!alert) {
        return res.status(404).json({ success: false, error: 'Alert not found' });
      }

      await AuditService.log('ALERT_RESOLVED', 'ALERT', id, resolvedBy, req.ip, { resolutionNotes });
      return res.json({ success: true, data: alert });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
