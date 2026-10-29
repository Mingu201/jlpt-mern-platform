import express from 'express';
import vocabRoutes from './vocabRoutes.js';
import kanjiRoutes from './kanjiRoutes.js';
import dictionaryRoutes from './dictionaryRoutes.js';

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

router.use('/vocab', vocabRoutes);
router.use('/kanji', kanjiRoutes);
router.use('/dictionary', dictionaryRoutes);

export default router;
