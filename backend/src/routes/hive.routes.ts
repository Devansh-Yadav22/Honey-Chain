import { Router } from 'express';
import * as hiveController from '../controllers/hive.controller';
import * as telemetryController from '../controllers/telemetry.controller';

const router = Router();

router.post('/', hiveController.createHive);
router.get('/', hiveController.getHives);
router.get('/:id', hiveController.getHiveById);
router.get('/:id/telemetry', telemetryController.getHiveTelemetry);
router.get('/:id/health', hiveController.getHiveHealth);
router.get('/:id/anomalies', hiveController.getHiveAnomalies);
router.get('/:id/productivity', hiveController.getHiveProductivity);

export default router;
