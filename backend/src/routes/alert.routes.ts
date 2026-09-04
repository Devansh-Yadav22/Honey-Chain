import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, AlertController.getAll);
router.post('/', authenticate, AlertController.create);
router.patch('/:id/resolve', authenticate, requireRoles('ADMIN'), AlertController.resolve);

export default router;
