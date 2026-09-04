import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { adminService } from '../services/admin.service';

export const adminController = {
  getOverview(req: AuthenticatedRequest, res: Response) {
    const data = adminService.getOverview();
    res.json({
      success: true,
      data
    });
  },

  getAuditLogs(req: AuthenticatedRequest, res: Response) {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const logs = adminService.getAuditLogs(limit);
    res.json({
      success: true,
      data: logs
    });
  },

  getExceptions(req: AuthenticatedRequest, res: Response) {
    const exceptions = adminService.getExceptions();
    res.json({
      success: true,
      data: exceptions
    });
  },

  resolveException(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { notes } = req.body;
    const resolvedBy = req.user?.fullName || 'Admin Operator';

    const exception = adminService.resolveException(id, notes || 'Resolved via operations dashboard', resolvedBy);
    if (!exception) {
      return res.status(404).json({ success: false, error: 'Exception not found' });
    }

    res.json({
      success: true,
      data: exception
    });
  },

  getSystemHealth(req: AuthenticatedRequest, res: Response) {
    const health = adminService.getSystemHealth();
    res.json({
      success: true,
      data: health
    });
  }
};
