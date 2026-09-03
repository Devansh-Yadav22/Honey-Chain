import { Router } from 'express';
import * as provenanceController from '../controllers/provenance.controller';

const router = Router();

router.post('/check', provenanceController.checkProvenance);

export default router;
