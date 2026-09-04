import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, UserController.getAll);
router.get('/:id', authenticate, UserController.getById);
router.patch('/:id/status', authenticate, requireRoles('ADMIN'), UserController.updateStatus);

export default router;
