import express from 'express';
import { getVocabList, getVocabById } from '../controllers/vocabController.js';

const router = express.Router();

router.get('/', getVocabList);
router.get('/:id', getVocabById);

export default router;
