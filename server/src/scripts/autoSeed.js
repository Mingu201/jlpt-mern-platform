import Vocabulary from '../models/Vocabulary.js';
import Kanji from '../models/Kanji.js';
import { initialVocabData, initialKanjiData } from './seedData.js';

export const autoSeedIfEmpty = async () => {
  try {
    const vocabCount = await Vocabulary.countDocuments();
    if (vocabCount === 0) {
      console.log('🌱 Database trống, đang tự động nạp dữ liệu từ vựng & Kanji N5-N3...');
      await Vocabulary.insertMany(initialVocabData);
      await Kanji.insertMany(initialKanjiData);
      console.log(`✅ Đã tự động nạp ${initialVocabData.length} từ vựng và ${initialKanjiData.length} chữ Kanji.`);
    } else {
      console.log(`ℹ️ Database đã có ${vocabCount} từ vựng, không cần nạp lại.`);
    }
  } catch (error) {
    console.error('❌ Lỗi khi tự động seed:', error.message);
  }
};
