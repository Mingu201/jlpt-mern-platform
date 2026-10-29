import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Vocabulary from '../models/Vocabulary.js';
import Kanji from '../models/Kanji.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data/openjlpt');

function convertBracketFurigana(text) {
  if (!text) return '';
  return text.replace(/\{([^\|]+)\|([^\}]+)\}/g, '<ruby>$1<rt>$2</rt></ruby>');
}

export const seedFullOpenJLPT = async () => {
  console.log('🚀 Bắt đầu nạp FULL dữ liệu OpenJLPT (N5, N4, N3)...');
  
  const levels = ['n5', 'n4', 'n3'];
  let totalVocabInserted = 0;
  let totalKanjiInserted = 0;

  // 1. Seed Vocabulary
  for (const lvl of levels) {
    const vocabFile = path.join(DATA_DIR, `vocab/${lvl}.json`);
    if (fs.existsSync(vocabFile)) {
      const raw = fs.readFileSync(vocabFile, 'utf-8');
      const items = JSON.parse(raw);
      
      const docs = items.map((item) => {
        let furiganaHtml = item.word;
        if (item.word !== item.reading) {
          furiganaHtml = `<ruby>${item.word}<rt>${item.reading}</rt></ruby>`;
        }

        const examples = (item.examples || []).slice(0, 3).map((ex) => ({
          japanese: ex.ja,
          furigana: convertBracketFurigana(ex.furigana || ex.ja),
          vietnamese: ex.en || '',
          audioUrl: ex.tatoeba_id ? `https://tatoeba.org/audio/${ex.tatoeba_id}` : undefined
        }));

        return {
          word: item.word,
          reading: item.reading,
          romaji: item.romaji || '',
          furiganaHtml,
          jlptLevel: lvl.toUpperCase(),
          partOfSpeech: item.pos || [],
          meanings: [{
            lang: 'en',
            definitions: item.meanings || []
          }],
          examples
        };
      });

      // Xóa cũ và nạp mới cho level này
      await Vocabulary.deleteMany({ jlptLevel: lvl.toUpperCase() });
      await Vocabulary.insertMany(docs, { ordered: false });
      totalVocabInserted += docs.length;
      console.log(`  - Đã nạp ${docs.length} từ vựng cấp độ ${lvl.toUpperCase()}`);
    }
  }

  // 2. Seed Kanji
  for (const lvl of levels) {
    const kanjiFile = path.join(DATA_DIR, `kanji/${lvl}.json`);
    if (fs.existsSync(kanjiFile)) {
      const raw = fs.readFileSync(kanjiFile, 'utf-8');
      const items = JSON.parse(raw);

      const docs = items.map((item) => ({
        character: item.character,
        strokes: item.strokes || 1,
        jlptLevel: lvl.toUpperCase(),
        grade: item.grade,
        onyomi: item.onyomi || [],
        kunyomi: item.kunyomi || [],
        hanViet: [],
        meanings: [{
          lang: 'en',
          definitions: item.meanings || []
        }],
        radical: item.radical || ''
      }));

      await Kanji.deleteMany({ jlptLevel: lvl.toUpperCase() });
      await Kanji.insertMany(docs, { ordered: false });
      totalKanjiInserted += docs.length;
      console.log(`  - Đã nạp ${docs.length} chữ Kanji cấp độ ${lvl.toUpperCase()}`);
    }
  }

  console.log(`✅ Hoàn tất! Tổng cộng đã nạp: ${totalVocabInserted} từ vựng và ${totalKanjiInserted} chữ Kanji vào MongoDB.`);
  return { totalVocabInserted, totalKanjiInserted };
};
