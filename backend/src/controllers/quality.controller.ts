import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { qualityService } from '../services/quality.service';
import { z } from 'zod';

const qualityTestSchema = z.object({
  batchId: z.string().min(1, 'batchId is required'),
  labId: z.string().optional(),
  labName: z.string().optional(),
  sampleId: z.string().optional(),
  testerName: z.string().optional(),
  testDate: z.string().optional(),
  parameters: z.object({
    moisturePercent: z.number().min(0).max(100),
    hmfMgPerKg: z.number().min(0),
    sucrosePercent: z.number().min(0).max(100),
    c4SugarPercent: z.number().min(0).max(100).optional(),
    pollenCountPerGram: z.number().min(0),
    antibioticResidue: z.enum(['NEGATIVE', 'POSITIVE']),
    leadPpm: z.number().min(0),
  }),
  certificateRef: z.string().optional(),
  reportUrl: z.string().optional(),
  notes: z.string().optional(),
});

export const qualityController = {
  async getTests(req: AuthenticatedRequest, res: Response) {
    try {
      const batchId = (req.params.batchId || req.query.batchId) as string | undefined;
      const tests = await qualityService.getTests(batchId);
      res.json({
        success: true,
        data: tests
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getTestsByBatchId(req: AuthenticatedRequest, res: Response) {
    try {
      const batchId = req.params.batchId;
      const tests = await qualityService.getTests(batchId);
      res.json({
        success: true,
        data: tests
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async recordTest(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = qualityTestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: parsed.error.issues
        });
      }

      const test = await qualityService.recordTest({
        ...parsed.data,
        labId: parsed.data.labId || req.user?.organizationId || 'ORG-LAB-01',
        labName: parsed.data.labName || req.user?.organizationName || 'Apex Food Safety Labs (NABL Accredited)',
        testerName: parsed.data.testerName || req.user?.fullName || 'Dr. Arishta Mehta',
      });

      res.status(201).json({
        success: true,
        data: test
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
};
