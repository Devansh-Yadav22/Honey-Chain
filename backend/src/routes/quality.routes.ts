import { Router } from 'express';
import { qualityController } from '../controllers/quality.controller';
import { authenticate, requireRoles } from '../middleware/auth';

export const qualityRouter = Router();

qualityRouter.get('/', authenticate, qualityController.getTests);
qualityRouter.post('/', authenticate, requireRoles('QUALITY_LAB', 'ADMIN'), qualityController.recordTest);
