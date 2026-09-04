import { QualityLabTest } from '../types';
import { store } from './store';
import crypto from 'crypto';

export const qualityService = {
  getTests(batchId?: string): QualityLabTest[] {
    return store.getQualityTests(batchId);
  },

  recordTest(data: {
    batchId: string;
    labId: string;
    labName: string;
    testerName: string;
    testDate?: string;
    parameters: {
      moisturePercent: number;
      hmfMgPerKg: number;
      sucrosePercent: number;
      pollenCountPerGram: number;
      antibioticResidue: 'NEGATIVE' | 'POSITIVE';
      leadPpm: number;
    };
    notes?: string;
  }): QualityLabTest {
    // 1. Evaluate compliance against FSSAI Honey Quality Guidelines (2018):
    // Moisture: <= 20%
    // HMF: <= 40 mg/kg (or 80 mg/kg tropical)
    // Sucrose: <= 5.0%
    // Antibiotics: NEGATIVE
    const passed = 
      data.parameters.moisturePercent <= 20.0 &&
      data.parameters.hmfMgPerKg <= 40.0 &&
      data.parameters.sucrosePercent <= 5.0 &&
      data.parameters.antibioticResidue === 'NEGATIVE';

    const overallStatus = passed ? 'PASSED' : 'REVIEW_REQUIRED';

    // 2. Generate digital certificate SHA-256 evidence hash
    const testId = `LAB-${data.batchId}-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const payloadToHash = JSON.stringify({
      testId,
      batchId: data.batchId,
      labId: data.labId,
      parameters: data.parameters,
      overallStatus,
      timestamp
    });
    const certificateHashSha256 = crypto.createHash('sha256').update(payloadToHash).digest('hex');

    const labTest: QualityLabTest = {
      id: testId,
      batchId: data.batchId,
      labId: data.labId,
      labName: data.labName,
      testerName: data.testerName,
      testDate: data.testDate || timestamp,
      parameters: data.parameters,
      overallStatus,
      certificateHashSha256,
      reportUrl: `https://apexlabs.res.in/certificates/${testId}.pdf`,
      notes: data.notes || (passed ? 'Meets FSSAI standards.' : 'Flagged for parameter deviation.'),
      createdAt: timestamp
    };

    store.addQualityTest(labTest);

    // Add audit log
    store.addAuditLog({
      actorId: data.labId,
      actorName: data.testerName,
      role: 'QUALITY_LAB',
      organizationId: data.labId,
      organizationName: data.labName,
      action: 'QUALITY_RESULT_RECORDED',
      resourceType: 'BATCH',
      resourceId: data.batchId,
      result: passed ? 'SUCCESS' : 'WARNING',
      details: { overallStatus, certificateHashSha256 }
    });

    return labTest;
  }
};
