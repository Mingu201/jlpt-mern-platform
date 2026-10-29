import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    index: true 
  },
  password: { type: String, required: true, minlength: 6 },
  targetLevel: { 
    type: String, 
    enum: ['N5', 'N4', 'N3'], 
    default: 'N5' 
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  dailyGoalMinutes: { type: Number, default: 30 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date }
}, { timestamps: true });

// Hash password trước khi lưu
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
