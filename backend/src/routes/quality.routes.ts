import { Router } from 'express';
import { qualityController } from '../controllers/quality.controller';
import { authenticate, requireRoles } from '../middleware/auth';

export const qualityRouter = Router();

// /api/quality/tests and /api/quality endpoints
qualityRouter.get('/tests', authenticate, qualityController.getTests);
qualityRouter.get('/tests/:batchId', authenticate, qualityController.getTestsByBatchId);
qualityRouter.post('/tests', authenticate, requireRoles('QUALITY_LAB', 'ADMIN'), qualityController.recordTest);

// Alias root endpoints for backwards compatibility
qualityRouter.get('/', authenticate, qualityController.getTests);
qualityRouter.get('/:batchId', authenticate, qualityController.getTestsByBatchId);
qualityRouter.post('/', authenticate, requireRoles('QUALITY_LAB', 'ADMIN'), qualityController.recordTest);

