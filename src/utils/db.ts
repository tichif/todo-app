import mongoose from 'mongoose';

import { config } from './config';
import { logger } from './logger';

export async function connectToDB() {
  try {
    const conn = await mongoose.connect(config.DATABASE_URL);
    logger.info(`Database is connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

export function disconnectToDB() {
  return mongoose.connection.close();
}
