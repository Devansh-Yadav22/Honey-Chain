import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/logs', authenticate, requireRoles('ADMIN'), AuditController.getLogs);

export default router;
