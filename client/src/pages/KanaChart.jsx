import { useState, useEffect, useRef } from 'react';
import { Volume2, Sparkles, Check } from 'lucide-react';
import * as wanakana from 'wanakana';

const HIRAGANA_DATA = [
  ['あ a', 'い i', 'う u', 'え e', 'お o'],
  ['か ka', 'き ki', 'く ku', 'け ke', 'こ ko'],
  ['さ sa', 'し shi', 'す su', 'せ se', 'そ so'],
  ['た ta', 'ち chi', 'つ tsu', 'て te', 'と to'],
  ['な na', 'に ni', 'ぬ nu', 'ね ne', 'の no'],
  ['は ha', 'ひ hi', 'ふ fu', 'へ he', 'ほ ho'],
  ['ま ma', 'み mi', 'む mu', 'め me', 'も mo'],
  ['や ya', '', 'ゆ yu', '', 'よ yo'],
  ['ら ra', 'り ri', 'る ru', 'れ re', 'ろ ro'],
  ['わ wa', '', '', '', 'を wo'],
  ['ん n', '', '', '', '']
];

const KATAKANA_DATA = [
  ['ア a', 'イ i', 'ウ u', 'エ e', 'オ o'],
  ['カ ka', 'キ ki', 'ク ku', 'ケ ke', 'コ ko'],
  ['サ sa', 'シ shi', 'ス su', 'セ se', 'ソ so'],
  ['タ ta', 'チ chi', 'ツ tsu', 'テ te', 'ト to'],
  ['ナ na', 'ニ ni', 'ヌ nu', 'ネ ne', 'ノ no'],
  ['ハ ha', 'ヒ hi', 'フ fu', 'ヘ he', 'ホ ho'],
  ['マ ma', 'ミ mi', 'ム mu', 'メ me', 'モ mo'],
  ['ヤ ya', '', 'ユ yu', '', 'ヨ yo'],
  ['ラ ra', 'リ ri', 'ル ru', 'レ re', 'ロ ro'],
  ['ワ wa', '', '', '', 'ヲ wo'],
  ['ン n', '', '', '', '']
];

export default function KanaChart() {
  const [tab, setTab] = useState('hiragana');
  const [typedText, setTypedText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Tích hợp WanaKana tự động convert Romaji -> Hiragana theo thời gian thực
    if (inputRef.current) {
      wanakana.bind(inputRef.current);
    }
    return () => {
      if (inputRef.current) {
        wanakana.unbind(inputRef.current);
      }
    };
  }, []);

  const playKanaAudio = (kana) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const char = kana.split(' ')[0];
    const utterance = new SpeechSynthesisUtterance(char);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const currentGrid = tab === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Bảng Chữ Cái Tiếng Nhật (Kana Chart)
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Bước đệm vững chắc cho người mới bắt đầu bước vào hành trình N5
        </p>
      </div>

      {/* Live IME Typing Practice (WanaKana) */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <h2 className="font-semibold text-base">
            Bộ gõ IME Tiếng Nhật Trực Tiếp (WanaKana Engine)
          </h2>
        </div>
        <p className="text-xs text-indigo-100">
          Bạn không cần cài bộ gõ tiếng Nhật trên máy! Thử gõ các chữ Romaji như <code>watashi</code>, <code>arigatou</code> vào ô bên dưới:
        </p>
        <div className="relative max-w-lg">
          <input
            ref={inputRef}
            type="text"
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder="Gõ thử: nihongo, konnichiwa..."
            className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white font-japanese text-lg"
          />
          {typedText && (
            <button
              onClick={() => playKanaAudio(typedText)}
              className="absolute right-3 top-3 text-white/80 hover:text-white"
              title="Phát âm từ vừa gõ"
            >
              <Volume2 size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setTab('hiragana')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === 'hiragana'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Hiragana (Chữ Mềm)
        </button>
        <button
          onClick={() => setTab('katakana')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === 'katakana'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Katakana (Chữ Cứng)
        </button>
      </div>

      {/* Grid Table */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto">
          {currentGrid.flat().map((item, idx) => {
            if (!item) {
              return <div key={idx} className="h-16 rounded-xl bg-slate-50/50 dark:bg-slate-800/30" />;
            }
            const [char, romaji] = item.split(' ');
            return (
              <button
                key={idx}
                onClick={() => playKanaAudio(char)}
                className="h-16 flex flex-col items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all group"
              >
                <span className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-japanese">
                  {char}
                </span>
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-indigo-500">
                  {romaji}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
