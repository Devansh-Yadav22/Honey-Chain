import { Router } from 'express';
import * as passportController from '../controllers/passport.controller';

const router = Router();

router.get('/:batchId', passportController.getPassport);

export default router;
