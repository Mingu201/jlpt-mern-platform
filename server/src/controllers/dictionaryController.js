import axios from 'axios';

// @desc    Proxy tra cứu từ điển Jisho (Tránh lỗi CORS ở Client)
// @route   GET /api/v1/dictionary/jisho?keyword=...
// @access  Public
export const searchJisho = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp từ khóa cần tra cứu (?keyword=...)'
      });
    }

    const response = await axios.get('https://jisho.org/api/v1/search/words', {
      params: { keyword: keyword.trim() },
      timeout: 6000
    });

    res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    next(error);
  }
};
