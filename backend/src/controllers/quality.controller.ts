import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { qualityService } from '../services/quality.service';
import { z } from 'zod';

const qualityTestSchema = z.object({
  batchId: z.string(),
  labId: z.string().optional(),
  labName: z.string().optional(),
  testerName: z.string().optional(),
  testDate: z.string().optional(),
  parameters: z.object({
    moisturePercent: z.number(),
    hmfMgPerKg: z.number(),
    sucrosePercent: z.number(),
    pollenCountPerGram: z.number(),
    antibioticResidue: z.enum(['NEGATIVE', 'POSITIVE']),
    leadPpm: z.number(),
  }),
  notes: z.string().optional(),
});

export const qualityController = {
  getTests(req: AuthenticatedRequest, res: Response) {
    const { batchId } = req.query;
    const tests = qualityService.getTests(batchId as string);
    res.json({
      success: true,
      data: tests
    });
  },

  recordTest(req: AuthenticatedRequest, res: Response) {
    const parsed = qualityTestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parsed.error.issues
      });
    }

    const test = qualityService.recordTest({
      ...parsed.data,
      labId: parsed.data.labId || req.user?.organizationId || 'ORG-LAB-01',
      labName: parsed.data.labName || req.user?.organizationName || 'Apex Food Safety Labs',
      testerName: parsed.data.testerName || req.user?.fullName || 'Quality Analyst',
    });

    res.status(201).json({
      success: true,
      data: test
    });
  }
};
