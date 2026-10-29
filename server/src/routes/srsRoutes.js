import express from 'express';
import { reviewItem, getUserStats, getClassroomLesson } from '../controllers/srsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/lesson', getClassroomLesson);
router.post('/review', protect, reviewItem);
router.get('/stats', protect, getUserStats);

export default router;
