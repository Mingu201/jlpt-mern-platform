import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Grammar from '../models/Grammar.js';
import { initialGrammarList } from '../data/grammarData.js';
import { connectDB } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hàm tạo romaji đơn giản từ slug hoặc title
function generateRomaji(title, slug) {
  if (slug && typeof slug === 'string') {
    return slug.replace(/-\d+$/, '').replace(/-/g, ' ');
  }
  return title || '';
}

export const loadFullGrammarCorpus = () => {
  const filePath = path.join(__dirname, '../data/openjlpt/grammar.json');
  if (!fs.existsSync(filePath)) {
    console.error('❌ Không tìm thấy file grammar.json tại:', filePath);
    return [];
  }

  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const targetLevels = ['N5', 'N4', 'N3'];
  const filtered = raw.filter((item) => targetLevels.includes(item.jlptLevel));

  const initialPatterns = new Set(initialGrammarList.map((g) => g.pattern));
  const result = [...initialGrammarList];

  filtered.forEach((item, index) => {
    // Nếu mẫu ngữ pháp đã có trong initial list tiếng Việt chi tiết thì không đè
    if (initialPatterns.has(item.title)) return;

    const pattern = item.title.trim();
    const romaji = generateRomaji(item.title, item.slug);
    const meaning = item.meaningEn || item.meaningCn || item.meaningZh || 'Cấu trúc ngữ pháp JLPT';
    const explanation = item.explanationEn || item.explanationZh || item.explanation || 'Không có phần giải thích.';
    const formation = item.usageNoteEn || item.usageNoteZh || item.usageNote || '';
    const caution = item.commonMistakeEn || item.commonMistakeZh || item.commonMistake || '';
    const structure = item.structure || pattern;
    const tags = Array.isArray(item.tags) ? item.tags : [];

    // Ví dụ
    const examples = [];
    if (item.exampleJp) {
      examples.push({
        japanese: item.exampleJp,
        reading: item.furigana || '',
        vietnamese: item.exampleEn || item.exampleZh || item.exampleCn || 'Ví dụ câu chuẩn.',
        furiganaHtml: item.exampleJp
      });
    }

    // Câu trắc nghiệm
    const quizzes = [];
    if (item.quizQuestion && Array.isArray(item.quizChoices) && item.quizChoices.length >= 2) {
      quizzes.push({
        question: item.quizQuestion,
        options: item.quizChoices,
        correctIndex: parseInt(item.quizAnswer, 10) || 0,
        explanation: item.quizExplanation || 'Đáp án đúng theo cấu trúc ngữ pháp.'
      });
    } else if (item.exampleJp && item.exampleJp.length > 5) {
      // Tự động tạo câu hỏi điền từ mẫu
      const question = item.exampleJp.replace(pattern, '____');
      if (question !== item.exampleJp) {
        quizzes.push({
          question,
          options: [pattern, 'で', 'に', 'を'],
          correctIndex: 0,
          explanation: `Cấu trúc chính xác là: ${pattern} - ${meaning}`
        });
      }
    }

    result.push({
      pattern,
      romaji,
      meaning,
      jlptLevel: item.jlptLevel,
      structure,
      formation,
      explanation,
      caution,
      tags,
      examples,
      quizzes
    });
  });

  return result;
};

export const seedFullGrammar = async () => {
  const fullList = loadFullGrammarCorpus();
  console.log(`📦 Tổng hợp được ${fullList.length} cấu trúc ngữ pháp JLPT N5 → N3.`);

  await Grammar.deleteMany({});
  const inserted = await Grammar.insertMany(fullList);
  console.log(`✅ Đã nạp thành công ${inserted.length} mẫu ngữ pháp vào MongoDB!`);
  return {
    totalInserted: inserted.length,
    byLevel: {
      N5: inserted.filter((g) => g.jlptLevel === 'N5').length,
      N4: inserted.filter((g) => g.jlptLevel === 'N4').length,
      N3: inserted.filter((g) => g.jlptLevel === 'N3').length
    }
  };
};

// Chạy trực tiếp qua node
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    try {
      await connectDB();
      const stats = await seedFullGrammar();
      console.log('Thống kê:', stats);
      process.exit(0);
    } catch (err) {
      console.error('Lỗi seed:', err);
      process.exit(1);
    }
  })();
}
