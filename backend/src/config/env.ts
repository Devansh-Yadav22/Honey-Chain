import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://honeychain:honeychain@localhost:5432/honeychain',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  fabric: {
    network: process.env.FABRIC_NETWORK || 'honeychain-network',
    channel: process.env.FABRIC_CHANNEL || 'honeychain-channel',
    chaincode: process.env.FABRIC_CHAINCODE || 'honeychain-cc',
    mspId: process.env.FABRIC_MSP_ID || 'Org1MSP',
  }
};
