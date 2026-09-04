import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { initDb } from './db/init';
import { errorHandler } from './middleware/error';

import authRoutes from './routes/auth.routes';
import organizationRoutes from './routes/organization.routes';
import userRoutes from './routes/user.routes';
import evidenceRoutes from './routes/evidence.routes';
import handoffRoutes from './routes/handoff.routes';
import locationRoutes from './routes/location.routes';
import alertRoutes from './routes/alert.routes';
import consistencyRoutes from './routes/consistency.routes';
import auditRoutes from './routes/audit.routes';
import hiveRoutes from './routes/hive.routes';
import telemetryRoutes from './routes/telemetry.routes';
import { batchRouter } from './routes/batch.routes';
import { qualityRouter } from './routes/quality.routes';
import { adminRouter } from './routes/admin.routes';
import passportRoutes from './routes/passport.routes';
import provenanceRoutes from './routes/provenance.routes';

const app = express();

const frontendUrl = process.env.FRONTEND_URL || '';

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      !frontendUrl ||
      origin === frontendUrl ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'honey-chain-backend',
    tier: 'Tier 1 & Tier 2 Production Engine',
    timestamp: new Date().toISOString(),
    env: config.env,
  });
});

// Mount domain routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/handoffs', handoffRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/consistency', consistencyRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/hives', hiveRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/batches', batchRouter);
app.use('/api/quality', qualityRouter);
app.use('/api/admin', adminRouter);
app.use('/api/passport', passportRoutes);
app.use('/api/provenance', provenanceRoutes);

// Base API route
app.get('/api', (_req, res) => {
  res.json({
    message: 'Welcome to Honey Chain Production API Server (Tier 1 & Tier 2 Full Stack)',
    version: '2.1.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      organizations: '/api/organizations',
      users: '/api/users',
      evidence: '/api/evidence',
      handoffs: '/api/handoffs',
      locations: '/api/locations',
      alerts: '/api/alerts',
      consistency: '/api/consistency/batch/:batchId',
      audit: '/api/audit/logs',
      hives: '/api/hives',
      telemetry: '/api/telemetry',
      batches: '/api/batches',
      quality: '/api/quality',
      admin: '/api/admin',
      passport: '/api/passport/:batchId',
      provenanceCheck: '/api/provenance/check'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = config.port;

async function startServer() {
  await initDb();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Honey Chain Backend API Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

export default app;
