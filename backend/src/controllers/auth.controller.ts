import { Request, Response } from 'express';
import { store } from '../services/store';
import { AuthenticatedRequest } from '../middleware/auth';

export const authController = {
  // Login demo endpoint - allows logging in by username or role
  login(req: Request, res: Response) {
    const { username, role } = req.body;
    let user;

    if (username) {
      user = store.getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
    } else if (role) {
      user = store.getUsersByRole(role)[0];
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found. Try one of: admin, beekeeper_rajesh, processor_anita, transporter_gurdeep, packager_priya, analyst_mehta'
      });
    }

    // Return user with simulated bearer token
    res.json({
      success: true,
      data: {
        token: `token-${user.id}-${Date.now()}`,
        user
      }
    });
  },

  // Current authenticated user profile
  getProfile(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    res.json({
      success: true,
      data: req.user
    });
  },

  // List all users (useful for role switcher in UI)
  getUsers(req: Request, res: Response) {
    const users = store.getUsers();
    res.json({
      success: true,
      data: users
    });
  },

  // List all organizations
  getOrganizations(req: Request, res: Response) {
    const orgs = store.getOrganizations();
    res.json({
      success: true,
      data: orgs
    });
  }
};
