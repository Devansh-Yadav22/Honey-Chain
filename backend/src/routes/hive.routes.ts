import { Router } from 'express';
import * as hiveController from '../controllers/hive.controller';
import * as telemetryController from '../controllers/telemetry.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// Beekeeper & Admin only for creating new hives
router.post('/', authenticate, requireRoles('BEEKEEPER', 'ADMIN'), hiveController.createHive);

// Inspection and telemetry endpoints
router.get('/', authenticate, hiveController.getHives);
router.get('/:id', authenticate, hiveController.getHiveById);
router.get('/:id/telemetry', authenticate, telemetryController.getHiveTelemetry);
router.get('/:id/health', authenticate, hiveController.getHiveHealth);
router.get('/:id/anomalies', authenticate, hiveController.getHiveAnomalies);
router.get('/:id/productivity', authenticate, hiveController.getHiveProductivity);

export default router;
