import express from 'express';
import vocabRoutes from './vocabRoutes.js';
import kanjiRoutes from './kanjiRoutes.js';
import dictionaryRoutes from './dictionaryRoutes.js';
import { autoSeedIfEmpty } from '../scripts/autoSeed.js';
import Vocabulary from '../models/Vocabulary.js';
import Kanji from '../models/Kanji.js';
import { initialVocabData, initialKanjiData } from '../scripts/seedData.js';

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Seed endpoint
router.get('/seed', async (req, res) => {
  try {
    const { seedFullOpenJLPT } = await import('../scripts/seedOpenJLPT.js');
    const result = await seedFullOpenJLPT();
    res.json({
      success: true,
      message: `Đã nạp thành công toàn bộ ${result.totalVocabInserted} từ vựng và ${result.totalKanjiInserted} Kanji từ OpenJLPT!`,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.use('/vocab', vocabRoutes);
router.use('/kanji', kanjiRoutes);
router.use('/dictionary', dictionaryRoutes);

export default router;
