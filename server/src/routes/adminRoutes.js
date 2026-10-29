import express from 'express';
import { getAdminStats, getAllUsers, createVocab, deleteUser } from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Tất cả routes admin đều yêu cầu Đăng nhập + Quyền Admin
router.use(protect);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.post('/vocab', createVocab);
router.delete('/users/:id', deleteUser);

export default router;
