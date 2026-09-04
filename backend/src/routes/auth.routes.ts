import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);
router.get('/me', authenticate, AuthController.getMe);
router.get('/demo-accounts', AuthController.getDemoAccounts);

export default router;
