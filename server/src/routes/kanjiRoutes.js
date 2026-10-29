import express from 'express';
import { getKanjiList, getKanjiByChar } from '../controllers/kanjiController.js';

const router = express.Router();

router.get('/', getKanjiList);
router.get('/:character', getKanjiByChar);

export default router;
