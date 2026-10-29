import mongoose from 'mongoose';
import { ENV } from './env.js';

let mongod = null;

export const connectDB = async () => {
  try {
    let mongoUri = ENV.MONGODB_URI;

    if (mongoUri) {
      try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log(` MongoDB đã kết nối thành công: ${conn.connection.host}`);
        return conn;
      } catch (cloudErr) {
        console.warn(`⚠️ Không thể kết nối tới MONGODB_URI (${cloudErr.message}).`);
        if (ENV.NODE_ENV === 'production' && !mongoUri.includes('localhost') && !mongoUri.includes('127.0.0.1') && !mongoUri.includes('mongo')) {
          throw cloudErr;
        }
        console.log('🔄 Đang tự động chuyển sang chế độ dự phòng In-Memory MongoDB Server...');
      }
    }

    console.log('ℹ️ Đang khởi động In-Memory MongoDB Server...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
    console.log(`🚀 In-Memory MongoDB đã sẵn sàng tại: ${mongoUri}`);

    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoUri);
    console.log(` MongoDB đã kết nối thành công: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error('Lỗi khi đóng kết nối DB:', error);
  }
};
