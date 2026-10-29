import express from 'express';
import { searchJisho } from '../controllers/dictionaryController.js';

const router = express.Router();

router.get('/jisho', searchJisho);

export default router;
