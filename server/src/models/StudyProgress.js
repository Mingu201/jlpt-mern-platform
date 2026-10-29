import mongoose from 'mongoose';

const studyProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  itemType: { type: String, enum: ['Vocabulary', 'Kanji', 'Grammar'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'itemType' },
  jlptLevel: { type: String, enum: ['N5', 'N4', 'N3'], required: true },
  
  // Thuật toán TS-FSRS (Free Spaced Repetition Scheduler)
  // 0: New, 1: Learning, 2: Review, 3: Relearning
  state: { type: Number, default: 0 },
  due: { type: Date, default: Date.now, index: true },
  stability: { type: Number, default: 0 },
  difficulty: { type: Number, default: 0 },
  elapsedDays: { type: Number, default: 0 },
  scheduledDays: { type: Number, default: 0 },
  reps: { type: Number, default: 0 },
  lapses: { type: Number, default: 0 },
  lastReview: { type: Date }
}, { timestamps: true });

// Tránh duplicate record & tối ưu query ôn tập hôm nay
studyProgressSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });
studyProgressSchema.index({ userId: 1, due: 1 });

export default mongoose.model('StudyProgress', studyProgressSchema);
