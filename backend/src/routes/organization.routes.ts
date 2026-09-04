import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, OrganizationController.getAll);
router.get('/:id', authenticate, OrganizationController.getById);
router.post('/', authenticate, OrganizationController.create);
router.patch('/:id/status', authenticate, requireRoles('ADMIN'), OrganizationController.updateStatus);

export default router;
