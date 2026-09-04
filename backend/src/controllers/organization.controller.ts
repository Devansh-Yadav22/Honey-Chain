import { Request, Response } from 'express';
import { OrganizationService } from '../services/organization.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuditService } from '../services/audit.service';

export class OrganizationController {
  static async getAll(req: Request, res: Response) {
    try {
      const status = req.query.status as string;
      const orgs = await OrganizationService.getAll(status);
      return res.json({ success: true, data: orgs });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const org = await OrganizationService.getById(req.params.id);
      if (!org) {
        return res.status(404).json({ success: false, error: 'Organization not found' });
      }
      return res.json({ success: true, data: org });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, type, registrationNo, address, contactEmail, contactPhone } = req.body;
      if (!name || !type) {
        return res.status(400).json({ success: false, error: 'Name and type are required' });
      }

      const org = await OrganizationService.create({
        name,
        type,
        registrationNo,
        address,
        contactEmail,
        contactPhone
      });

      await AuditService.log('ORGANIZATION_CREATED', 'ORGANIZATION', org.id, req.user?.id, req.ip, { name, type });
      return res.status(201).json({ success: true, data: org });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { status } = req.body;
      if (!['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid organization status' });
      }

      const org = await OrganizationService.updateStatus(req.params.id, status);
      if (!org) {
        return res.status(404).json({ success: false, error: 'Organization not found' });
      }

      await AuditService.log('ORGANIZATION_STATUS_UPDATED', 'ORGANIZATION', org.id, req.user?.id, req.ip, { newStatus: status });
      return res.json({ success: true, data: org });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
