import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { autoSeedIfEmpty } from './scripts/autoSeed.js';
import { ensureAdminAccount } from './scripts/createAdmin.js';

const startServer = async () => {
  await connectDB();
  await autoSeedIfEmpty();
  await ensureAdminAccount();

  const server = app.listen(ENV.PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 JLPT Server đang chạy trên port: ${ENV.PORT}`);
    console.log(`📌 Môi trường: ${ENV.NODE_ENV}`);
    console.log(`🔗 API Base URL: http://localhost:${ENV.PORT}/api/v1`);
    console.log(`=================================================\n`);
  });

  // Graceful Shutdown
  const handleExit = () => {
    console.log('\n🛑 Đang đóng server gracefully...');
    server.close(() => {
      console.log('✅ Server đã đóng.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', handleExit);
  process.on('SIGINT', handleExit);
};

startServer();
