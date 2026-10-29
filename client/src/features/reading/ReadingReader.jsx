import { useState } from 'react';
import { Volume2, Eye, EyeOff, Search, Sparkles, BookOpen } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function ReadingReader() {
  const [showFurigana, setShowFurigana] = useState(true);
  const [selectedWord, setSelectedWord] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [loadingPopup, setLoadingPopup] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  // Mẫu bài đọc N5-N4 thực tế
  const samplePassage = {
    title: '私の週末 (Cuối tuần của tôi)',
    level: 'N5 / N4',
    content: [
      {
        tokens: [
          { text: '私', furigana: 'わたし' },
          { text: 'は' },
          { text: '毎週末', furigana: 'まいしゅうまつ' },
          { text: '、' },
          { text: '日本語', furigana: 'にほんご' },
          { text: 'の' },
          { text: '勉強', furigana: 'べんきょう' },
          { text: 'を' },
          { text: 'します', furigana: 'します' },
          { text: '。' }
        ],
        translation: 'Mỗi cuối tuần tôi đều học tiếng Nhật.'
      },
      {
        tokens: [
          { text: '朝', furigana: 'あさ' },
          { text: 'は' },
          { text: 'パン', furigana: 'ぱん' },
          { text: 'と' },
          { text: '卵', furigana: 'たまご' },
          { text: 'を' },
          { text: '食べて', furigana: 'たべて' },
          { text: '、' },
          { text: 'コーヒー', furigana: 'こーひー' },
          { text: 'を' },
          { text: '飲みます', furigana: 'のみます' },
          { text: '。' }
        ],
        translation: 'Buổi sáng tôi ăn bánh mì với trứng, và uống cà phê.'
      },
      {
        tokens: [
          { text: 'それから', furigana: 'それから' },
          { text: '図書館', furigana: 'としょかん' },
          { text: 'へ' },
          { text: '行って', furigana: 'いって' },
          { text: '、' },
          { text: '漢字', furigana: 'かんじ' },
          { text: 'を' },
          { text: '練習', furigana: 'れんしゅう' },
          { text: 'します', furigana: 'します' },
          { text: '。' }
        ],
        translation: 'Sau đó tôi đến thư viện và luyện tập viết chữ Hán.'
      }
    ]
  };

  const handleWordClick = async (token) => {
    setSelectedWord(token);
    setLoadingPopup(true);
    setPopupData(null);

    try {
      const res = await axiosClient.get(`/dictionary/jisho?keyword=${encodeURIComponent(token.text)}`);
      setPopupData(res.data?.[0] || null);
    } catch (err) {
      console.error('Lỗi tra từ:', err);
    } finally {
      setLoadingPopup(false);
    }
  };

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ Web Speech Synthesis!');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = speed;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const fullJapaneseText = samplePassage.content
    .map((sentence) => sentence.tokens.map((t) => t.text).join(''))
    .join(' ');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {samplePassage.level}
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{samplePassage.title}</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Bấm vào bất kỳ từ vựng nào để tra nghĩa tức thời qua Jisho API Proxy
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Furigana Toggle */}
          <button
            onClick={() => setShowFurigana(!showFurigana)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              showFurigana
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {showFurigana ? <Eye size={14} /> : <EyeOff size={14} />}
            {showFurigana ? 'Đang bật Furigana' : 'Đang ẩn Furigana'}
          </button>

          {/* Speed selector */}
          <select
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="text-xs border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200"
          >
            <option value={0.75}>Tốc độ: 0.75x (N5)</option>
            <option value={1.0}>Tốc độ: 1.0x (Chuẩn)</option>
            <option value={1.25}>Tốc độ: 1.25x (N3)</option>
          </select>

          {/* Audio TTS button */}
          <button
            onClick={() => handleSpeak(fullJapaneseText)}
            disabled={speaking}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-sm ${
              speaking ? 'bg-indigo-400 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <Volume2 size={14} />
            {speaking ? 'Đang đọc...' : 'Đọc toàn bài'}
          </button>
        </div>
      </div>

      {/* Reading Passage Area */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div className={`space-y-6 leading-loose text-lg text-slate-900 dark:text-slate-100 ${showFurigana ? '' : 'hide-furigana'}`}>
          {samplePassage.content.map((sentence, sIdx) => {
            const sentenceText = sentence.tokens.map((t) => t.text).join('');
            return (
              <div key={sIdx} className="p-4 rounded-xl hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap items-end gap-x-1 gap-y-2 text-xl font-japanese">
                    {sentence.tokens.map((token, tIdx) => (
                      <span
                        key={tIdx}
                        onClick={() => handleWordClick(token)}
                        className={`inline-block cursor-pointer px-1 py-0.5 rounded transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/60 hover:text-indigo-700 dark:hover:text-indigo-300 ${
                          token.furigana ? 'font-medium' : ''
                        }`}
                      >
                        {token.furigana ? (
                          <ruby>
                            {token.text}
                            <rt>{token.furigana}</rt>
                          </ruby>
                        ) : (
                          token.text
                        )}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSpeak(sentenceText)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                    title="Nghe câu này"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>

                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-sans pl-1">
                  {sentence.translation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popup Tra Từ Nhanh (Modal / Card) */}
      {selectedWord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-150 transition-colors">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Jisho Dictionary Lookup
                </span>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-3">
                  {selectedWord.text}
                  {selectedWord.furigana && (
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                      ({selectedWord.furigana})
                    </span>
                  )}
                  <button
                    onClick={() => handleSpeak(selectedWord.text)}
                    className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedWord(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {loadingPopup ? (
              <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Đang tra cứu từ điển Jisho qua Backend Proxy...
              </div>
            ) : popupData ? (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {popupData.jlpt?.length > 0 && (
                  <div className="flex gap-1">
                    {popupData.jlpt.map((lvl, idx) => (
                      <span key={idx} className="text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {lvl.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}

                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Định nghĩa:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    {popupData.senses?.slice(0, 3).map((sense, idx) => (
                      <li key={idx}>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {sense.english_definitions.join(', ')}
                        </span>
                        {sense.parts_of_speech?.length > 0 && (
                          <span className="text-xs text-slate-400 ml-2">
                            ({sense.parts_of_speech.slice(0, 2).join(', ')})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Không tìm thấy dữ liệu từ điển cho từ này.
              </div>
            )}

            <button
              onClick={() => setSelectedWord(null)}
              className="w-full py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Đóng tra cứu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
