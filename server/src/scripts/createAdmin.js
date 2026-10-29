import { connectDB, closeDB } from '../config/db.js';
import User from '../models/User.js';

export const ensureAdminAccount = async () => {
  const adminEmail = 'admin@jlpt.vn';
  const adminPassword = 'AdminPassword123!';

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Administrator (Full Access)',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      targetLevel: 'N3',
      streak: 99
    });
    console.log('✅ Đã khởi tạo thành công tài khoản Admin:');
    console.log(`   - Email: ${adminEmail}`);
    console.log(`   - Mật khẩu: ${adminPassword}`);
  } else {
    admin.role = 'admin';
    await admin.save();
    console.log(`ℹ️ Tài khoản ${adminEmail} đã tồn tại và được đảm bảo có quyền Admin.`);
  }
  return admin;
};

// Nếu chạy trực tiếp từ CLI
if (process.argv[1]?.endsWith('createAdmin.js')) {
  (async () => {
    await connectDB();
    await ensureAdminAccount();
    await closeDB();
    process.exit(0);
  })();
}
