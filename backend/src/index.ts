import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { initDb } from './db/init';
import { errorHandler } from './middleware/error';

import hiveRoutes from './routes/hive.routes';
import telemetryRoutes from './routes/telemetry.routes';
import batchRoutes from './routes/batch.routes';
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
app.use('/api/hives', hiveRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/passport', passportRoutes);
app.use('/api/provenance', provenanceRoutes);

// Base API route
app.get('/api', (_req, res) => {
  res.json({
    message: 'Welcome to Honey Chain API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      hives: '/api/hives',
      telemetry: '/api/telemetry',
      batches: '/api/batches',
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
