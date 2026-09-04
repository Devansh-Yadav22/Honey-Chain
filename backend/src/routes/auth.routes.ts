import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.get('/me', authenticate, authController.getProfile);
authRouter.get('/users', authController.getUsers);
authRouter.get('/organizations', authController.getOrganizations);
