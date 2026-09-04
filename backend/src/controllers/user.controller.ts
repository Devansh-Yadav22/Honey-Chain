import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuditService } from '../services/audit.service';

export class UserController {
  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const { role, orgId, status } = req.query as { role?: string; orgId?: string; status?: string };
      // If not admin, restrict to user's org
      const queryOrgId = req.user?.role === 'ADMIN' ? orgId : req.user?.orgId;
      const users = await UserService.getAll(role, queryOrgId, status);
      return res.json({ success: true, data: users });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await UserService.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      return res.json({ success: true, data: user });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { status } = req.body;
      if (!['PENDING', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid user status' });
      }

      const user = await UserService.updateStatus(req.params.id, status);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      await AuditService.log('USER_STATUS_UPDATED', 'USER', user.id, req.user?.id, req.ip, { newStatus: status });
      return res.json({ success: true, data: user });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
