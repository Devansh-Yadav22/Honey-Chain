import { Request, Response, NextFunction } from 'express';
import { getHoneyPassport } from '../services/passport.service';

export async function getPassport(req: Request, res: Response, next: NextFunction) {
  try {
    const passport = await getHoneyPassport(req.params.batchId);
    if (!passport) {
      return res.status(404).json({
        success: false,
        error: `Honey Passport for batch '${req.params.batchId}' not found`
      });
    }
    res.json({ success: true, data: passport });
  } catch (err) {
    next(err);
  }
}
