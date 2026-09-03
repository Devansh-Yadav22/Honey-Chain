import { Request, Response, NextFunction } from 'express';
import * as hiveService from '../services/hive.service';
import * as telemetryService from '../services/telemetry.service';
import { aiService } from '../services/ai.service';

export async function createHive(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, beekeeperId, location, status } = req.body;
    if (!id || !location) {
      return res.status(400).json({ success: false, error: 'id and location are required' });
    }
    const hive = await hiveService.createHive({ id, beekeeperId: beekeeperId || 'BK-001', location, status: status || 'ACTIVE' });
    res.status(201).json({ success: true, data: hive });
  } catch (err) {
    next(err);
  }
}

export async function getHives(_req: Request, res: Response, next: NextFunction) {
  try {
    const hives = await hiveService.getAllHives();
    res.json({ success: true, data: hives });
  } catch (err) {
    next(err);
  }
}

export async function getHiveById(req: Request, res: Response, next: NextFunction) {
  try {
    const hive = await hiveService.getHiveById(req.params.id);
    if (!hive) {
      return res.status(404).json({ success: false, error: 'Hive not found' });
    }
    res.json({ success: true, data: hive });
  } catch (err) {
    next(err);
  }
}

export async function getHiveHealth(req: Request, res: Response, next: NextFunction) {
  try {
    const telemetry = await telemetryService.getTelemetryByHiveId(req.params.id, 1);
    const health = await aiService.getHiveHealth(req.params.id, telemetry[0]);
    res.json({ success: true, data: health });
  } catch (err) {
    next(err);
  }
}

export async function getHiveAnomalies(req: Request, res: Response, next: NextFunction) {
  try {
    const telemetry = await telemetryService.getTelemetryByHiveId(req.params.id, 1);
    const anomaly = await aiService.getHiveAnomalies(req.params.id, telemetry[0]);
    res.json({ success: true, data: anomaly });
  } catch (err) {
    next(err);
  }
}

export async function getHiveProductivity(req: Request, res: Response, next: NextFunction) {
  try {
    const productivity = await aiService.getHiveYield(req.params.id);
    res.json({ success: true, data: productivity });
  } catch (err) {
    next(err);
  }
}
