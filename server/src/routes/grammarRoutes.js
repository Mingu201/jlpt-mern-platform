import express from 'express';
import {
  getGrammarList,
  getGrammarById,
  getRandomGrammarQuizzes,
  getConjugationDrills,
  createGrammar,
  seedGrammarData
} from '../controllers/grammarController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/quizzes/random', getRandomGrammarQuizzes);
router.get('/conjugations', getConjugationDrills);
router.post('/seed', seedGrammarData);

router.route('/')
  .get(getGrammarList)
  .post(protect, authorize('admin'), createGrammar);

router.route('/:id')
  .get(getGrammarById);

export default router;
