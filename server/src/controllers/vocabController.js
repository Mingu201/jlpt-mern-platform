import Vocabulary from '../models/Vocabulary.js';

// @desc    Lấy danh sách từ vựng theo cấp độ JLPT & Tìm kiếm
// @route   GET /api/v1/vocab
// @access  Public
export const getVocabList = async (req, res, next) => {
  try {
    const { level = 'N5', page = 1, limit = 20, q } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (level && ['N5', 'N4', 'N3'].includes(level.toUpperCase())) {
      filter.jlptLevel = level.toUpperCase();
    }

    if (q) {
      const searchRegex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { word: searchRegex },
        { reading: searchRegex },
        { romaji: searchRegex },
        { 'meanings.definitions': searchRegex }
      ];
    }

    const [items, total] = await Promise.all([
      Vocabulary.find(filter)
        .sort({ word: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Vocabulary.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: items,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy chi tiết 1 từ vựng
// @route   GET /api/v1/vocab/:id
// @access  Public
export const getVocabById = async (req, res, next) => {
  try {
    const vocab = await Vocabulary.findById(req.params.id);
    if (!vocab) {
      res.status(404);
      throw new Error('Không tìm thấy từ vựng');
    }
    res.json({
      success: true,
      data: vocab
    });
  } catch (error) {
    next(error);
  }
};
