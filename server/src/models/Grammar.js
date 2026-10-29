import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  japanese: { type: String, required: true },
  reading: { type: String },
  vietnamese: { type: String, required: true },
  furiganaHtml: { type: String }
}, { _id: false });

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, required: true }
}, { _id: false });

const grammarSchema = new mongoose.Schema({
  pattern: { type: String, required: true, index: true },      // VD: "〜てはいけない"
  romaji: { type: String, required: true },                    // VD: "te wa ikenai"
  meaning: { type: String, required: true },                   // VD: "Không được làm gì đó (cấm đoán)"
  jlptLevel: { 
    type: String, 
    enum: ['N5', 'N4', 'N3'], 
    required: true, 
    index: true 
  },
  structure: { type: String, required: true },                 // VD: "V-て + はいけない"
  formation: { type: String },                                 // Quy tắc kết hợp chi tiết
  explanation: { type: String, required: true },               // Diễn giải ngữ nghĩa & ngữ cảnh
  caution: { type: String },                                   // Lưu ý văn phong (lịch sự, thân mật, văn viết)
  tags: [{ type: String }],                                    // ["Cấm đoán", "Quy tắc", "Thể Te"]
  examples: [exampleSchema],
  quizzes: [quizSchema]
}, { timestamps: true });

grammarSchema.index({ jlptLevel: 1, pattern: 1 });
grammarSchema.index({ pattern: 'text', meaning: 'text', romaji: 'text' });

export default mongoose.model('Grammar', grammarSchema);
