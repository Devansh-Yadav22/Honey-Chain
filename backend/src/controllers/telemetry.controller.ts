import { Request, Response, NextFunction } from 'express';
import * as telemetryService from '../services/telemetry.service';

export async function ingestTelemetry(req: Request, res: Response, next: NextFunction) {
  try {
    const { hiveId, telemetry, timestamp } = req.body;
    if (!hiveId || !telemetry) {
      return res.status(400).json({ success: false, error: 'hiveId and telemetry object are required' });
    }

    const record = await telemetryService.saveTelemetry({
      hiveId,
      telemetry,
      timestamp: timestamp || new Date().toISOString()
    });

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

export async function getHiveTelemetry(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string || '50', 10);
    const records = await telemetryService.getTelemetryByHiveId(req.params.id, limit);
    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
}
