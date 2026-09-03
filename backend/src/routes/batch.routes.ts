import { Router } from 'express';
import * as batchController from '../controllers/batch.controller';

const router = Router();

router.post('/', batchController.createBatch);
router.get('/', batchController.getBatches);
router.get('/:id', batchController.getBatchById);
router.get('/:id/timeline', batchController.getBatchTimeline);
router.post('/:id/processing', batchController.addProcessingEvent);
router.post('/:id/transport', batchController.addTransportEvent);
router.post('/:id/packaging', batchController.addPackagingEvent);

export default router;
