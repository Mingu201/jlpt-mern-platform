import mongoose from 'mongoose';

const kanjiSchema = new mongoose.Schema({
  character: { type: String, required: true, unique: true, index: true }, // VD: "日"
  strokes: { type: Number, required: true },                              // Số nét: 4
  jlptLevel: { 
    type: String, 
    enum: ['N5', 'N4', 'N3'], 
    required: true, 
    index: true 
  },
  grade: { type: Number },                                                // Lớp tiểu học (1-6)
  onyomi: [{ type: String }],                                             // Âm On: ["ニチ", "ジツ"]
  kunyomi: [{ type: String }],                                            // Âm Kun: ["ひ", "-び", "-か"]
  hanViet: [{ type: String }],                                            // Âm Hán Việt: ["NHẬT"]
  meanings: [{
    lang: { type: String, default: 'vi' },
    definitions: [{ type: String }]                                       // Nghĩa: ["ngày", "mặt trời"]
  }],
  strokeOrderSvg: { type: String },                                       // SVG data hoặc URL KanjiVG
  radical: { type: String },                                              // Bộ thủ: "日"
  frequency: { type: Number },                                            // Tần suất xuất hiện trong báo chí Nhật
  examples: [{
    word: String,
    reading: String,
    meaning: String
  }]
}, { timestamps: true });

kanjiSchema.index({ jlptLevel: 1, character: 1 });
kanjiSchema.index({ character: 'text', hanViet: 'text' });

export default mongoose.model('Kanji', kanjiSchema);
