import Grammar from '../models/Grammar.js';
import { initialGrammarList, verbConjugationData } from '../data/grammarData.js';

// GET /api/v1/grammar
export const getGrammarList = async (req, res) => {
  try {
    const { level, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (level && ['N5', 'N4', 'N3'].includes(level.toUpperCase())) {
      query.jlptLevel = level.toUpperCase();
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { pattern: { $regex: term, $options: 'i' } },
        { romaji: { $regex: term, $options: 'i' } },
        { meaning: { $regex: term, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Tự động seed nếu DB chưa có ngữ pháp nào
    const totalCount = await Grammar.countDocuments(query);
    if (totalCount === 0 && !search && !level) {
      await Grammar.insertMany(initialGrammarList);
    }

    const grammarList = await Grammar.find(query)
      .sort({ jlptLevel: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const actualTotal = await Grammar.countDocuments(query);

    res.json({
      success: true,
      data: grammarList,
      pagination: {
        total: actualTotal,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(actualTotal / limitNum) || 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/grammar/:id
export const getGrammarById = async (req, res) => {
  try {
    const item = await Grammar.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy mẫu ngữ pháp' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/grammar/quizzes/random
export const getRandomGrammarQuizzes = async (req, res) => {
  try {
    const { level, count = 10 } = req.query;
    const query = {};
    if (level && ['N5', 'N4', 'N3'].includes(level.toUpperCase())) {
      query.jlptLevel = level.toUpperCase();
    }

    const items = await Grammar.find(query).lean();
    let allQuizzes = [];

    items.forEach((item) => {
      if (item.quizzes && item.quizzes.length > 0) {
        item.quizzes.forEach((quiz) => {
          allQuizzes.push({
            grammarId: item._id,
            pattern: item.pattern,
            jlptLevel: item.jlptLevel,
            ...quiz
          });
        });
      }
    });

    // Xáo trộn ngẫu nhiên
    allQuizzes.sort(() => 0.5 - Math.random());
    const selected = allQuizzes.slice(0, parseInt(count, 10));

    res.json({
      success: true,
      count: selected.length,
      data: selected
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/grammar/conjugations
export const getConjugationDrills = async (req, res) => {
  try {
    const { formType } = req.query; // te, ta, nai, potential, passive, causative, volitional, ba
    
    const drills = verbConjugationData.map((item) => {
      if (formType && item.conjugations[formType]) {
        return {
          verb: item.verb,
          reading: item.reading,
          romaji: item.romaji,
          meaning: item.meaning,
          group: item.group,
          targetFormType: formType,
          target: item.conjugations[formType]
        };
      }
      return item;
    });

    res.json({
      success: true,
      count: drills.length,
      data: drills
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/grammar
export const createGrammar = async (req, res) => {
  try {
    const newGrammar = new Grammar(req.body);
    await newGrammar.save();
    res.status(201).json({ success: true, data: newGrammar });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/v1/grammar/seed
export const seedGrammarData = async (req, res) => {
  try {
    await Grammar.deleteMany({});
    const inserted = await Grammar.insertMany(initialGrammarList);
    res.json({
      success: true,
      message: `Đã nạp thành công ${inserted.length} mẫu ngữ pháp khởi tạo!`,
      data: inserted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
