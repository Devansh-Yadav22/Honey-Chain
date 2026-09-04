import { Router } from 'express';
import { ConsistencyController } from '../controllers/consistency.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/batch/:batchId', authenticate, ConsistencyController.evaluateBatch);

export default router;
