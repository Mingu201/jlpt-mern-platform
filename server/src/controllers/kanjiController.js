import axios from 'axios';
import Kanji from '../models/Kanji.js';

// @desc    Lấy danh sách Kanji theo cấp độ
// @route   GET /api/v1/kanji
// @access  Public
export const getKanjiList = async (req, res, next) => {
  try {
    const { level = 'N5', page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (level && ['N5', 'N4', 'N3'].includes(level.toUpperCase())) {
      filter.jlptLevel = level.toUpperCase();
    }

    const [items, total] = await Promise.all([
      Kanji.find(filter)
        .sort({ strokes: 1, character: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Kanji.countDocuments(filter)
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

// @desc    Lấy chi tiết chữ Kanji (Áp dụng Read-Through Cache Pattern)
// @route   GET /api/v1/kanji/:character
// @access  Public
export const getKanjiByChar = async (req, res, next) => {
  try {
    const char = decodeURIComponent(req.params.character);
    
    // 1. Kiểm tra trong MongoDB trước (Cache hit)
    let kanjiDoc = await Kanji.findOne({ character: char });
    if (kanjiDoc) {
      return res.json({
        success: true,
        source: 'cache_db',
        data: kanjiDoc
      });
    }

    // 2. Cache miss: Gọi KanjiAPI.dev
    try {
      const response = await axios.get(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(char)}`, {
        timeout: 5000
      });
      const data = response.data;

      // Map cấp độ JLPT từ format số (5 -> N5, 4 -> N4, 3 -> N3)
      let jlptLevel = 'N5';
      if (data.jlpt === 4) jlptLevel = 'N4';
      else if (data.jlpt === 3) jlptLevel = 'N3';

      kanjiDoc = await Kanji.create({
        character: data.kanji,
        strokes: data.stroke_count || 1,
        jlptLevel: jlptLevel,
        grade: data.grade,
        onyomi: data.on_readings || [],
        kunyomi: data.kun_readings || [],
        meanings: [{
          lang: 'en',
          definitions: data.meanings || []
        }],
        hanViet: []
      });

      return res.json({
        success: true,
        source: 'kanjiapi_fetch_and_cached',
        data: kanjiDoc
      });
    } catch (apiError) {
      res.status(404);
      throw new Error(`Không tìm thấy thông tin cho chữ Kanji: ${char}`);
    }
  } catch (error) {
    next(error);
  }
};
