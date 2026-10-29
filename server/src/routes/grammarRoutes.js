import express from 'express';
import {
  getGrammarList,
  getGrammarById,
  getRandomGrammarQuizzes,
  getConjugationDrills,
  createGrammar,
  seedGrammarData
} from '../controllers/grammarController.js';
import { protect, requireAdmin, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/quizzes/random', getRandomGrammarQuizzes);
router.get('/conjugations', getConjugationDrills);
router.post('/seed', seedGrammarData);

router.route('/')
  .get(getGrammarList)
  .post(protect, requireAdmin, createGrammar);

router.route('/:id')
  .get(getGrammarById);

export default router;
