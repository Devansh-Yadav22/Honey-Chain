import { Request, Response, NextFunction } from 'express';
import { Role, User } from '../types';
import { UserService } from '../services/user.service';
import { verifyFirebaseIdToken } from '../config/firebase';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Authentication Middleware:
 * Extracts Bearer token, verifies Firebase ID token via Firebase Admin SDK,
 * resolves PostgreSQL user by firebase_uid, checks account status, and attaches user to request.
 */
export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Unauthenticated request - continue without attaching req.user
      return next();
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Invalid authorization header format',
      });
    }

    try {
      // 1. Verify Firebase ID Token
      const decoded = await verifyFirebaseIdToken(token);
      if (!decoded || !decoded.uid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired authorization token',
        });
      }

      // 2. Resolve PostgreSQL Application User by Firebase UID
      let user = await UserService.getByFirebaseUid(decoded.uid);

      // Fallback: If user not yet mapped by firebaseUid, look up by email from verified token
      if (!user && decoded.email) {
        user = await UserService.getByEmail(decoded.email);
        if (user) {
          // Link Firebase UID to existing user
          await UserService.linkFirebaseUid(user.id, decoded.uid);
          user.firebaseUid = decoded.uid;
        }
      }

      // Fallback for user ID tokens
      if (!user && decoded.uid.startsWith('usr-')) {
        user = await UserService.getById(decoded.uid);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authenticated identity has no linked Honey Chain user profile.',
        });
      }

      // 3. Check Account Lifecycle Status
      if (user.status !== 'ACTIVE') {
        return res.status(403).json({
          success: false,
          error: `User account is ${user.status.toLowerCase()}. Access denied.`,
          status: user.status,
        });
      }

      // 4. Attach verified application user
      req.user = user;
      return next();
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired authorization token',
        details: err.message,
      });
    }
  } catch (error: any) {
    next(error);
  }
}

/**
 * Strict Auth Guard: Requires a verified authenticated user
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please provide a valid Bearer token.',
    });
  }
  next();
}

/**
 * RBAC Guard Middleware: Enforces server-side permissions for specified roles.
 * Never trusts frontend-supplied role values.
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
      // Platform Admin has platform oversight access
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

  const userOrgId = req.user.orgId || req.user.organizationId;
  const requestedOrgId = (
    req.params.orgId || 
    req.params.organizationId || 
    req.body.orgId || 
    req.body.organizationId || 
    req.query.orgId || 
    req.query.organizationId
  ) as string;

  if (requestedOrgId && requestedOrgId !== userOrgId) {
    return res.status(403).json({
      success: false,
      error: `Forbidden: Cross-organization access denied. You belong to '${userOrgId}'.`,
    });
  }

  next();
}
