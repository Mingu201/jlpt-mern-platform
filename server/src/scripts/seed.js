import mongoose from 'mongoose';
import { connectDB, closeDB } from '../config/db.js';
import Vocabulary from '../models/Vocabulary.js';
import Kanji from '../models/Kanji.js';

const vocabData = [
  // N5
  {
    word: '食べる',
    reading: 'たべる',
    romaji: 'taberu',
    furiganaHtml: '<ruby>食<rt>た</rt></ruby>べる',
    jlptLevel: 'N5',
    partOfSpeech: ['Ichidan verb', 'Transitive verb'],
    meanings: [{ lang: 'vi', definitions: ['Ăn, dùng bữa'] }],
    pitchAccent: 2,
    examples: [{
      japanese: '毎朝パンを食べます。',
      furigana: 'まいあさパンをたべます。',
      vietnamese: 'Mỗi sáng tôi đều ăn bánh mì.'
    }]
  },
  {
    word: '飲む',
    reading: 'のむ',
    romaji: 'nomu',
    furiganaHtml: '<ruby>飲<rt>の</rt></ruby>む',
    jlptLevel: 'N5',
    partOfSpeech: ['Godan verb', 'Transitive verb'],
    meanings: [{ lang: 'vi', definitions: ['Uống, nuốt'] }],
    pitchAccent: 1,
    examples: [{
      japanese: '水をたくさん飲みました。',
      furigana: 'みずをたくさんのみました。',
      vietnamese: 'Tôi đã uống rất nhiều nước.'
    }]
  },
  {
    word: '行く',
    reading: 'いく',
    romaji: 'iku',
    furiganaHtml: '<ruby>行<rt>い</rt></ruby>く',
    jlptLevel: 'N5',
    partOfSpeech: ['Godan verb', 'Intransitive verb'],
    meanings: [{ lang: 'vi', definitions: ['Đi, di chuyển đến'] }],
    pitchAccent: 0,
    examples: [{
      japanese: '明日東京へ行きます。',
      furigana: 'あしたとうきょうへいきます。',
      vietnamese: 'Ngày mai tôi sẽ đi Tokyo.'
    }]
  },
  {
    word: '日本語',
    reading: 'にほんご',
    romaji: 'nihongo',
    furiganaHtml: '<ruby>日本<rt>にほん</rt></ruby><ruby>語<rt>ご</rt></ruby>',
    jlptLevel: 'N5',
    partOfSpeech: ['Noun'],
    meanings: [{ lang: 'vi', definitions: ['Tiếng Nhật'] }],
    pitchAccent: 0,
    examples: [{
      japanese: '日本語の勉強はとても面白いです。',
      furigana: 'にほんごのべんきょうはとてもおもしろいです。',
      vietnamese: 'Học tiếng Nhật rất thú vị.'
    }]
  },
  {
    word: '学生',
    reading: 'がくせい',
    romaji: 'gakusei',
    furiganaHtml: '<ruby>学<rt>がく</rt></ruby><ruby>生<rt>せい</rt></ruby>',
    jlptLevel: 'N5',
    partOfSpeech: ['Noun'],
    meanings: [{ lang: 'vi', definitions: ['Học sinh, sinh viên'] }],
    pitchAccent: 0,
    examples: [{
      japanese: '私は大学の学生です。',
      furigana: 'わたしはだいがくのがくせいです。',
      vietnamese: 'Tôi là sinh viên đại học.'
    }]
  },
  // N4
  {
    word: '始める',
    reading: 'はじめる',
    romaji: 'hajimeru',
    furiganaHtml: '<ruby>始<rt>はじ</rt></ruby>める',
    jlptLevel: 'N4',
    partOfSpeech: ['Ichidan verb', 'Transitive verb'],
    meanings: [{ lang: 'vi', definitions: ['Bắt đầu, khởi đầu (một việc gì)'] }],
    pitchAccent: 0,
    examples: [{
      japanese: '会議を始めましょう。',
      furigana: 'かいぎをはじめましょう。',
      vietnamese: 'Chúng ta hãy bắt đầu cuộc họp nào.'
    }]
  },
  {
    word: '案内',
    reading: 'あんない',
    romaji: 'annai',
    furiganaHtml: '<ruby>案<rt>あん</rt></ruby><ruby>内<rt>ない</rt></ruby>',
    jlptLevel: 'N4',
    partOfSpeech: ['Noun', 'Suru verb'],
    meanings: [{ lang: 'vi', definitions: ['Hướng dẫn, dẫn đường'] }],
    pitchAccent: 3,
    examples: [{
      japanese: '京都の街を案内します。',
      furigana: 'きょうとのまちをあんないします。',
      vietnamese: 'Tôi sẽ hướng dẫn bạn tham quan phố phường Kyoto.'
    }]
  },
  {
    word: '経験',
    reading: 'けいけん',
    romaji: 'keiken',
    furiganaHtml: '<ruby>経<rt>けい</rt></ruby><ruby>験<rt>けん</rt></ruby>',
    jlptLevel: 'N4',
    partOfSpeech: ['Noun', 'Suru verb'],
    meanings: [{ lang: 'vi', definitions: ['Kinh nghiệm, trải nghiệm'] }],
    pitchAccent: 0,
    examples: [{
      japanese: '海外旅行でいい経験をしました。',
      furigana: 'かいがいりょこうでいいけいけんをしました。',
      vietnamese: 'Tôi đã có trải nghiệm tuyệt vời trong chuyến du lịch nước ngoài.'
    }]
  },
  // N3
  {
    word: '解決',
    reading: 'かいけつ',
    romaji: 'kaiketsu',
    furiganaHtml: '<ruby>解<rt>かい</rt></ruby><ruby>決<rt>けつ</rt></ruby>',
    jlptLevel: 'N3',
    partOfSpeech: ['Noun', 'Suru verb'],
    meanings: [{ lang: 'vi', definitions: ['Giải quyết (vấn đề, tranh chấp)'] }],
    pitchAccent: 0,
    examples: [{
      japanese: 'この問題はやっと解決しました。',
      furigana: 'このもんだいはやっとかいけつしました。',
      vietnamese: 'Vấn đề này cuối cùng cũng đã được giải quyết.'
    }]
  },
  {
    word: '複雑',
    reading: 'ふくざつ',
    romaji: 'fukuzatsu',
    furiganaHtml: '<ruby>複<rt>ふく</rt></ruby><ruby>雑<rt>ざつ</rt></ruby>',
    jlptLevel: 'N3',
    partOfSpeech: ['Na-adjective', 'Noun'],
    meanings: [{ lang: 'vi', definitions: ['Phức tạp, rắc rối'] }],
    pitchAccent: 0,
    examples: [{
      japanese: '日本語の文法は少し複雑です。',
      furigana: 'にほんごのぶんぽうはすこしふくざつです。',
      vietnamese: 'Ngữ pháp tiếng Nhật hơi phức tạp một chút.'
    }]
  },
  {
    word: '緊張',
    reading: 'きんちょう',
    romaji: 'kinchou',
    furiganaHtml: '<ruby>緊<rt>きん</rt></ruby><ruby>張<rt>ちょう</rt></ruby>',
    jlptLevel: 'N3',
    partOfSpeech: ['Noun', 'Suru verb'],
    meanings: [{ lang: 'vi', definitions: ['Căng thẳng, hồi hộp'] }],
    pitchAccent: 0,
    examples: [{
      japanese: '面接の前にとても緊張しました。',
      furigana: 'めんせつのまえにとてもきんちょうしました。',
      vietnamese: 'Trước buổi phỏng vấn tôi đã rất căng thẳng.'
    }]
  }
];

const kanjiData = [
  // N5 Kanji
  {
    character: '日',
    strokes: 4,
    jlptLevel: 'N5',
    grade: 1,
    onyomi: ['ニチ', 'ジツ'],
    kunyomi: ['ひ', '-び', '-か'],
    hanViet: ['NHẬT'],
    meanings: [{ lang: 'vi', definitions: ['Ngày, mặt trời, Nhật Bản'] }],
    radical: '日'
  },
  {
    character: '月',
    strokes: 4,
    jlptLevel: 'N5',
    grade: 1,
    onyomi: ['ゲツ', 'ガツ'],
    kunyomi: ['つき'],
    hanViet: ['NGUYỆT'],
    meanings: [{ lang: 'vi', definitions: ['Tháng, mặt trăng'] }],
    radical: '月'
  },
  {
    character: '水',
    strokes: 4,
    jlptLevel: 'N5',
    grade: 1,
    onyomi: ['スイ'],
    kunyomi: ['みず'],
    hanViet: ['THỦY'],
    meanings: [{ lang: 'vi', definitions: ['Nước'] }],
    radical: '水'
  },
  {
    character: '木',
    strokes: 4,
    jlptLevel: 'N5',
    grade: 1,
    onyomi: ['ボク', 'モク'],
    kunyomi: ['き', 'こ-'],
    hanViet: ['MỘC'],
    meanings: [{ lang: 'vi', definitions: ['Cây, gỗ'] }],
    radical: '木'
  },
  {
    character: '人',
    strokes: 2,
    jlptLevel: 'N5',
    grade: 1,
    onyomi: ['ジン', 'ニン'],
    kunyomi: ['ひと'],
    hanViet: ['NHÂN'],
    meanings: [{ lang: 'vi', definitions: ['Người'] }],
    radical: '人'
  },
  // N4 Kanji
  {
    character: '会',
    strokes: 6,
    jlptLevel: 'N4',
    grade: 2,
    onyomi: ['カイ', 'エ'],
    kunyomi: ['あ.う'],
    hanViet: ['HỘI'],
    meanings: [{ lang: 'vi', definitions: ['Gặp gỡ, hội họp'] }],
    radical: '人'
  },
  {
    character: '社',
    strokes: 7,
    jlptLevel: 'N4',
    grade: 2,
    onyomi: ['シャ'],
    kunyomi: ['やしろ'],
    hanViet: ['XÃ'],
    meanings: [{ lang: 'vi', definitions: ['Công ty, đền thờ, xã hội'] }],
    radical: '示'
  },
  {
    character: '校',
    strokes: 10,
    jlptLevel: 'N4',
    grade: 2,
    onyomi: ['コウ'],
    kunyomi: [],
    hanViet: ['HIỆU'],
    meanings: [{ lang: 'vi', definitions: ['Trường học'] }],
    radical: '木'
  },
  // N3 Kanji
  {
    character: '経',
    strokes: 11,
    jlptLevel: 'N3',
    grade: 5,
    onyomi: ['ケイ', 'キョウ'],
    kunyomi: ['へ.る', 'た.つ'],
    hanViet: ['KINH'],
    meanings: [{ lang: 'vi', definitions: ['Trải qua, kinh tế, kinh nghiệm'] }],
    radical: '糸'
  },
  {
    character: '験',
    strokes: 18,
    jlptLevel: 'N3',
    grade: 4,
    onyomi: ['ケン', 'ゲン'],
    kunyomi: ['ため.す'],
    hanViet: ['NGHIỆM'],
    meanings: [{ lang: 'vi', definitions: ['Thí nghiệm, kiểm nghiệm, kinh nghiệm'] }],
    radical: '馬'
  },
  {
    character: '決',
    strokes: 7,
    jlptLevel: 'N3',
    grade: 3,
    onyomi: ['ケツ'],
    kunyomi: ['き.める', 'き.まる'],
    hanViet: ['QUYẾT'],
    meanings: [{ lang: 'vi', definitions: ['Quyết định, giải quyết'] }],
    radical: '水'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🧹 Đang làm sạch collections Vocabulary & Kanji...');
    await Vocabulary.deleteMany({});
    await Kanji.deleteMany({});

    console.log('🌱 Đang nạp dữ liệu từ vựng mẫu (N5, N4, N3)...');
    await Vocabulary.insertMany(vocabData);

    console.log('🌱 Đang nạp dữ liệu Kanji mẫu (N5, N4, N3)...');
    await Kanji.insertMany(kanjiData);

    console.log('✅ Seed dữ liệu thành công!');
    console.log(`   - Từ vựng: ${vocabData.length} từ`);
    console.log(`   - Kanji: ${kanjiData.length} chữ`);
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
  } finally {
    await closeDB();
    process.exit(0);
  }
};

seedDatabase();
