import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  japanese: { type: String, required: true },
  furigana: { type: String },
  vietnamese: { type: String, required: true },
  audioUrl: { type: String }
}, { _id: false });

const vocabularySchema = new mongoose.Schema({
  word: { type: String, required: true, index: true },       // VD: "食べる"
  reading: { type: String, required: true, index: true },    // VD: "たべる"
  romaji: { type: String, required: true },                  // VD: "taberu"
  furiganaHtml: { type: String },                            // VD: "<ruby>食<rt>た</rt></ruby>べる"
  jlptLevel: { 
    type: String, 
    enum: ['N5', 'N4', 'N3'], 
    required: true, 
    index: true 
  },
  partOfSpeech: [{ type: String }],                          // VD: ["Ichidan verb", "Transitive"]
  meanings: [{
    lang: { type: String, default: 'vi' },
    definitions: [{ type: String }]
  }],
  pitchAccent: { type: Number },                             // Trọng âm (VD: 2 -> たべ↓る)
  audioUrl: { type: String },
  examples: [exampleSchema]
}, { timestamps: true });

// Compound Index & Text Search
vocabularySchema.index({ jlptLevel: 1, word: 1 });
vocabularySchema.index({ word: 'text', reading: 'text', romaji: 'text' });

export default mongoose.model('Vocabulary', vocabularySchema);
