import StudyProgress from '../models/StudyProgress.js';
import Vocabulary from '../models/Vocabulary.js';
import Kanji from '../models/Kanji.js';
import User from '../models/User.js';

// @desc    Lưu kết quả ôn tập thẻ theo thuật toán SRS (Lặp lại ngắt quãng)
// @route   POST /api/v1/srs/review
// @access  Private
export const reviewItem = async (req, res, next) => {
  try {
    const { itemId, itemType = 'Vocabulary', grade = 3, jlptLevel = 'N5' } = req.body;
    const userId = req.user._id;

    // Tìm thẻ cũ nếu có
    let card = await StudyProgress.findOne({ userId, itemId, itemType });
    if (!card) {
      card = new StudyProgress({
        userId,
        itemId,
        itemType,
        jlptLevel,
        reps: 0,
        lapses: 0,
        scheduledDays: 0
      });
    }

    const now = new Date();
    let scheduledDays = 1;

    // Tính toán khoảng thời gian theo mức độ nhớ
    switch (Number(grade)) {
      case 1: // Again (Chưa nhớ)
        card.reps = 0;
        card.lapses += 1;
        card.state = 1; // Learning
        scheduledDays = 0;
        card.due = new Date(now.getTime() + 10 * 60 * 1000); // Ôn lại sau 10 phút
        break;
      case 2: // Hard (Khó nhớ)
        card.reps += 1;
        card.state = 2; // Review
        scheduledDays = 1;
        card.due = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
        break;
      case 3: // Good (Nhớ tốt)
        card.reps += 1;
        card.state = 2;
        scheduledDays = card.reps <= 1 ? 1 : Math.round((card.scheduledDays || 1) * 2.2);
        if (scheduledDays < 2) scheduledDays = 2;
        card.due = new Date(now.getTime() + scheduledDays * 24 * 60 * 60 * 1000);
        break;
      case 4: // Easy (Thuộc làu)
        card.reps += 1;
        card.state = 2;
        scheduledDays = card.reps <= 1 ? 3 : Math.round((card.scheduledDays || 2) * 3.5);
        if (scheduledDays < 4) scheduledDays = 4;
        card.due = new Date(now.getTime() + scheduledDays * 24 * 60 * 60 * 1000);
        break;
      default:
        scheduledDays = 1;
        card.due = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    card.scheduledDays = scheduledDays;
    card.lastReview = now;
    await card.save();

    res.json({
      success: true,
      message: 'Đã lưu tiến độ học tập thành công',
      data: card
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy thống kê học tập cá nhân (Dashboard Stats)
// @route   GET /api/v1/srs/stats
// @access  Private
export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const [totalStudied, dueToday, levelStats] = await Promise.all([
      StudyProgress.countDocuments({ userId }),
      StudyProgress.countDocuments({ userId, due: { $lte: now } }),
      StudyProgress.aggregate([
        { $match: { userId } },
        { $group: { _id: '$jlptLevel', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalStudied,
        dueToday,
        streak: req.user.streak || 1,
        targetLevel: req.user.targetLevel,
        levelStats: levelStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tạo 1 bài học phòng học tương tác (Classroom Lesson)
// @route   GET /api/v1/srs/lesson?level=N5
// @access  Public / Private
export const getClassroomLesson = async (req, res, next) => {
  try {
    const { level = 'N5' } = req.query;
    const cleanLevel = level.toUpperCase();

    // 1. Lấy 5 từ vựng ngẫu nhiên cho bài học
    const vocabList = await Vocabulary.aggregate([
      { $match: { jlptLevel: cleanLevel } },
      { $sample: { size: 5 } }
    ]);

    // 2. Lấy 1 chữ Kanji trọng tâm cho bài tập viết nét
    const kanjiList = await Kanji.aggregate([
      { $match: { jlptLevel: cleanLevel } },
      { $sample: { size: 1 } }
    ]);

    // 3. Sinh các câu hỏi trắc nghiệm kèm 3 đáp án nhiễu
    const allWords = await Vocabulary.find({ jlptLevel: cleanLevel }).select('meanings.definitions word').limit(50).lean();
    const wrongPool = allWords.map((w) => w.meanings?.[0]?.definitions?.[0]).filter(Boolean);

    const quizQuestions = vocabList.map((v) => {
      const correct = v.meanings?.[0]?.definitions?.[0] || 'Nghĩa từ vựng';
      const distractors = wrongPool
        .filter((d) => d !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [correct, ...distractors].sort(() => 0.5 - Math.random());

      return {
        word: v.word,
        reading: v.reading,
        correctAnswer: correct,
        options
      };
    });

    res.json({
      success: true,
      data: {
        level: cleanLevel,
        vocabulary: vocabList,
        focusKanji: kanjiList[0] || null,
        quizQuestions
      }
    });
  } catch (error) {
    next(error);
  }
};
