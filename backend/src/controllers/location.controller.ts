import { Request, Response } from 'express';
import { LocationService } from '../services/location.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuditService } from '../services/audit.service';

export class LocationController {
  static async recordLocation(req: AuthenticatedRequest, res: Response) {
    try {
      const { batchId, stage, latitude, longitude, accuracy, address, isMocked } = req.body;
      if (!batchId || !stage || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
          success: false,
          error: 'batchId, stage, latitude, and longitude are required'
        });
      }

      const recordedBy = req.user?.id || 'usr-anonymous';
      const record = await LocationService.recordLocation({
        batchId,
        recordedBy,
        stage,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        accuracy: accuracy ? parseFloat(accuracy) : undefined,
        address,
        isMocked: Boolean(isMocked)
      });

      await AuditService.log('LOCATION_RECORDED', 'LOCATION', record.id, recordedBy, req.ip, {
        batchId,
        stage,
        latitude,
        longitude
      });

      return res.status(201).json({ success: true, data: record });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getByBatchId(req: Request, res: Response) {
    try {
      const { batchId } = req.params;
      const locations = await LocationService.getLocationsForBatch(batchId);
      return res.json({ success: true, data: locations });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
