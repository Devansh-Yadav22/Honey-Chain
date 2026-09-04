import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { DEMO_USERS, DEMO_PASSWORD } from '../db/seed';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
      }

      const ipAddress = req.ip || req.socket.remoteAddress;
      const result = await AuthService.login(email, password, ipAddress);
      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(401).json({ success: false, error: err.message || 'Authentication failed' });
    }
  }

  static async signup(req: Request, res: Response) {
    try {
      const { email, password, name, role, orgName, orgType, phone, registrationNo, address } = req.body;
      if (!email || !password || !name || !role || !orgName || !orgType) {
        return res.status(400).json({
          success: false,
          error: 'Email, password, name, role, orgName, and orgType are required',
        });
      }

      const ipAddress = req.ip || req.socket.remoteAddress;
      const result = await AuthService.signup(
        { email, password, name, role, orgName, orgType, phone, registrationNo, address },
        ipAddress
      );
      return res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || 'Registration failed' });
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }
      const result = await AuthService.getMe(req.user.id);
      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getDemoAccounts(req: Request, res: Response) {
    try {
      const accounts = DEMO_USERS.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        orgId: u.orgId,
        password: DEMO_PASSWORD
      }));
      return res.json({ success: true, data: accounts });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
