import { Request, Response, NextFunction } from 'express';
import { Role, User } from '../types';
import { store } from '../services/store';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Authentication Middleware: Resolves user identity from Bearer token or fast-switch headers.
 */
export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // 1. Check x-user-id or x-role header (useful for rapid UI role switching and automated testing)
  const headerUserId = req.headers['x-user-id'] as string;
  const headerRole = req.headers['x-role'] as Role;

  if (headerUserId) {
    const user = store.getUserById(headerUserId);
    if (user) {
      req.user = user;
      return next();
    }
  }

  if (headerRole) {
    const user = store.getUsersByRole(headerRole)[0];
    if (user) {
      req.user = user;
      return next();
    }
  }

  // 2. Check Authorization Bearer token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = store.getUserByToken(token);
    if (user) {
      req.user = user;
      return next();
    }
  }

  // 3. Fallback to default demo Admin user if no auth is explicitly passed in demo mode
  req.user = store.getUsersByRole('ADMIN')[0];
  next();
}

/**
 * RBAC Guard Middleware: Enforces server-side permissions for specified roles.
 */
export function requireRoles(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication required',
      });
    }

    if (req.user.role === 'ADMIN') {
      // Platform Admin has global oversight access
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Role '${req.user.role}' is not authorized. Required: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
}

/**
 * Tenant Isolation Guard: Ensures user can only operate on resources within their own organization.
 */
export function requireTenant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  // Admin can access all tenants
  if (req.user.role === 'ADMIN') {
    return next();
  }

  const requestedOrgId = (req.params.orgId || req.body.organizationId || req.query.orgId) as string;
  if (requestedOrgId && requestedOrgId !== req.user.organizationId) {
    return res.status(403).json({
      success: false,
      error: `Forbidden: Cross-organization access denied. You belong to '${req.user.organizationId}'.`,
    });
  }

  next();
}
