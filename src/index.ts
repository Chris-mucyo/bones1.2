import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import app from './app';
import connectDB from './config/db';
import { initGoogleStrategy } from './strategies/Googlestrategy';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Init OAuth strategies AFTER dotenv has loaded
    initGoogleStrategy();

    await connectDB();

    app.listen(PORT, () => {
      console.log(`\n🚀 ShopHub API running in ${process.env.NODE_ENV} mode`);
      console.log(`📡 Server: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/health\n`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();