import mongoose from 'mongoose';
import { ENV } from './env.js';

let mongod = null;

export const connectDB = async () => {
  try {
    let mongoUri = ENV.MONGODB_URI;

    if (!mongoUri) {
      console.log('ℹ️ Không có MONGODB_URI được cung cấp, đang khởi động In-Memory MongoDB Server...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log(`🚀 In-Memory MongoDB đã sẵn sàng tại: ${mongoUri}`);
    }

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
