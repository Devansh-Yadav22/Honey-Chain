import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, requireRoles } from '../middleware/auth';

export const adminRouter = Router();

adminRouter.get('/overview', authenticate, requireRoles('ADMIN'), adminController.getOverview);
adminRouter.get('/audit', authenticate, requireRoles('ADMIN'), adminController.getAuditLogs);
adminRouter.get('/exceptions', authenticate, requireRoles('ADMIN'), adminController.getExceptions);
adminRouter.patch('/exceptions/:id/resolve', authenticate, requireRoles('ADMIN'), adminController.resolveException);
adminRouter.get('/health', authenticate, requireRoles('ADMIN'), adminController.getSystemHealth);
