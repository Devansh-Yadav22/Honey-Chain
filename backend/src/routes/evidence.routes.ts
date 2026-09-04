import { Router } from 'express';
import { EvidenceController, upload } from '../controllers/evidence.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/upload', authenticate, upload.single('file'), EvidenceController.uploadEvidence);
router.get('/batch/:batchId', authenticate, EvidenceController.getByBatchId);
router.get('/:id/verify', authenticate, EvidenceController.verifyIntegrity);
router.get('/:id/download', EvidenceController.downloadFile);

export default router;
