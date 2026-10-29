import Vocabulary from '../models/Vocabulary.js';
import Kanji from '../models/Kanji.js';
import { seedFullOpenJLPT } from './seedOpenJLPT.js';

export const autoSeedIfEmpty = async () => {
  try {
    const vocabCount = await Vocabulary.countDocuments();
    if (vocabCount < 100) {
      console.log(`🌱 Database hiện có ${vocabCount} từ vựng (chưa đủ bộ full). Đang nạp toàn bộ OpenJLPT N5-N3...`);
      await seedFullOpenJLPT();
    } else {
      console.log(`ℹ️ Database đã có đầy đủ ${vocabCount} từ vựng N5-N3.`);
    }
  } catch (error) {
    console.error('❌ Lỗi khi tự động seed full:', error.message);
  }
};
