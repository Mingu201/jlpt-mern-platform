import express from 'express';
import vocabRoutes from './vocabRoutes.js';
import kanjiRoutes from './kanjiRoutes.js';
import dictionaryRoutes from './dictionaryRoutes.js';
import authRoutes from './authRoutes.js';
import srsRoutes from './srsRoutes.js';

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

router.use('/auth', authRoutes);
router.use('/srs', srsRoutes);
router.use('/vocab', vocabRoutes);
router.use('/kanji', kanjiRoutes);
router.use('/dictionary', dictionaryRoutes);

export default router;
