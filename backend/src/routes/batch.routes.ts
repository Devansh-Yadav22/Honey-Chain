import { Router } from 'express';
import * as batchController from '../controllers/batch.controller';
import { authenticate, requireRoles } from '../middleware/auth';

export const batchRouter = Router();

batchRouter.get('/', authenticate, batchController.getBatches);
batchRouter.get('/:id', authenticate, batchController.getBatchById);
batchRouter.get('/:id/timeline', authenticate, batchController.getBatchTimeline);

// Beekeeper Batch Creation
batchRouter.post('/', authenticate, requireRoles('BEEKEEPER', 'ADMIN'), batchController.createBatch);

// Processor Lifecycle Actions
batchRouter.post('/:id/intake', authenticate, requireRoles('PROCESSOR', 'ADMIN'), batchController.recordIntake);
batchRouter.post('/:id/processing', authenticate, requireRoles('PROCESSOR', 'ADMIN'), batchController.addProcessingEvent);
batchRouter.post('/:id/ready-transport', authenticate, requireRoles('PROCESSOR', 'ADMIN'), batchController.markReadyForTransport);

// Transporter Lifecycle Actions
batchRouter.post('/:id/transport', authenticate, requireRoles('TRANSPORTER', 'ADMIN'), batchController.addTransportEvent);
batchRouter.post('/:id/transport-receipt', authenticate, requireRoles('PACKAGER', 'PROCESSOR', 'ADMIN'), batchController.confirmTransportReceipt);

// Packaging Lifecycle Actions
batchRouter.post('/:id/packaging', authenticate, requireRoles('PACKAGER', 'ADMIN'), batchController.addPackagingEvent);
batchRouter.post('/:id/publish', authenticate, requireRoles('PACKAGER', 'ADMIN'), batchController.publishPassport);
