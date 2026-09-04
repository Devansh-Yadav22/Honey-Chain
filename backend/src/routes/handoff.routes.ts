import { Router } from 'express';
import { HandoffController } from '../controllers/handoff.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, HandoffController.initiate);
router.get('/pending', authenticate, HandoffController.getPending);
router.get('/batch/:batchId', authenticate, HandoffController.getByBatchId);
router.post('/:id/accept', authenticate, HandoffController.accept);
router.post('/:id/reject', authenticate, HandoffController.reject);

export default router;
