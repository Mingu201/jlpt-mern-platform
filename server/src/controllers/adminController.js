import User from '../models/User.js';
import Vocabulary from '../models/Vocabulary.js';
import Kanji from '../models/Kanji.js';
import StudyProgress from '../models/StudyProgress.js';

// @desc    Lấy thống kê toàn hệ thống cho Admin
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalVocab, totalKanji, totalProgress] = await Promise.all([
      User.countDocuments(),
      Vocabulary.countDocuments(),
      Kanji.countDocuments(),
      StudyProgress.countDocuments()
    ]);

    const usersByLevel = await User.aggregate([
      { $group: { _id: '$targetLevel', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalVocab,
        totalKanji,
        totalProgress,
        usersByLevel: usersByLevel.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy danh sách người dùng
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Thêm từ vựng mới vào giáo trình
// @route   POST /api/v1/admin/vocab
// @access  Private (Admin)
export const createVocab = async (req, res, next) => {
  try {
    const { word, reading, romaji, jlptLevel, meanings, examples } = req.body;
    if (!word || !reading || !jlptLevel) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đủ từ vựng, cách đọc và cấp độ JLPT!'
      });
    }

    const newVocab = await Vocabulary.create({
      word,
      reading,
      romaji: romaji || word,
      furiganaHtml: word !== reading ? `<ruby>${word}<rt>${reading}</rt></ruby>` : word,
      jlptLevel: jlptLevel.toUpperCase(),
      meanings: [{ lang: 'vi', definitions: Array.isArray(meanings) ? meanings : [meanings] }],
      examples: examples || []
    });

    res.status(201).json({
      success: true,
      message: 'Đã thêm từ vựng mới thành công',
      data: newVocab
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Xóa người dùng
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Bạn không thể tự xóa tài khoản của chính mình!'
      });
    }

    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      StudyProgress.deleteMany({ userId: req.params.id })
    ]);

    res.json({
      success: true,
      message: 'Đã xóa người dùng và dữ liệu học tập thành công.'
    });
  } catch (error) {
    next(error);
  }
};
