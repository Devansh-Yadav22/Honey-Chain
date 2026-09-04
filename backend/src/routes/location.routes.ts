import { Router } from 'express';
import { LocationController } from '../controllers/location.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, LocationController.recordLocation);
router.get('/batch/:batchId', authenticate, LocationController.getByBatchId);

export default router;
