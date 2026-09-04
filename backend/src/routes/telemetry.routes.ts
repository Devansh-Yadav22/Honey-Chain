import { Router } from 'express';
import * as telemetryController from '../controllers/telemetry.controller';

const router = Router();

router.post('/', telemetryController.ingestTelemetry);

export default router;
