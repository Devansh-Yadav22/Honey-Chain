import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { initDb } from './db/init';
import { errorHandler } from './middleware/error';

import { authRouter } from './routes/auth.routes';
import hiveRoutes from './routes/hive.routes';
import telemetryRoutes from './routes/telemetry.routes';
import { batchRouter } from './routes/batch.routes';
import { qualityRouter } from './routes/quality.routes';
import { adminRouter } from './routes/admin.routes';
import passportRoutes from './routes/passport.routes';
import provenanceRoutes from './routes/provenance.routes';

const app = express();

app.use(cors());
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
    timestamp: new Date().toISOString(),
    env: config.env,
  });
});

// Mount domain routes
app.use('/api/auth', authRouter);
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
    message: 'Welcome to Honey Chain Production API Server (Phase 2)',
    version: '2.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
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
  app.listen(PORT, () => {
    console.log(`🚀 Honey Chain Backend API Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

export default app;
