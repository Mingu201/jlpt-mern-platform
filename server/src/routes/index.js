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
    await Vocabulary.deleteMany({});
    await Kanji.deleteMany({});
    await Vocabulary.insertMany(initialVocabData);
    await Kanji.insertMany(initialKanjiData);
    res.json({
      success: true,
      message: `Đã seed thành công ${initialVocabData.length} từ vựng và ${initialKanjiData.length} Kanji!`,
      vocabCount: initialVocabData.length,
      kanjiCount: initialKanjiData.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.use('/vocab', vocabRoutes);
router.use('/kanji', kanjiRoutes);
router.use('/dictionary', dictionaryRoutes);

export default router;
