import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import KanjiStrokePad from '../features/writing/KanjiStrokePad';
import { Search, Sparkles, BookOpen } from 'lucide-react';

export default function KanjiDojo() {
  const [level, setLevel] = useState('N5');
  const [kanjiList, setKanjiList] = useState([]);
  const [selectedKanji, setSelectedKanji] = useState(null);
  const [customChar, setCustomChar] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKanjiList(level);
  }, [level]);

  const fetchKanjiList = async (lvl) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/kanji?level=${lvl}&limit=50`);
      setKanjiList(res.data || []);
      if (res.data?.length > 0) {
        setSelectedKanji(res.data[0]);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách Kanji:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCustomKanji = async (e) => {
    e.preventDefault();
    if (!customChar.trim()) return;

    try {
      const char = customChar.trim()[0];
      const res = await axiosClient.get(`/kanji/${encodeURIComponent(char)}`);
      if (res.data) {
        setSelectedKanji(res.data);
      }
    } catch (err) {
      alert(`Không thể tải chữ: ${customChar}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kanji Dojo (Phòng Luyện Viết Hán Tự) ✍️
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Học thứ tự nét chuẩn theo dữ liệu KanjiVG & tương tác Canvas chấm điểm nét vẽ
          </p>
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-2">
          {['N5', 'N4', 'N3'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                level === lvl
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Kanji Selector Grid */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          {/* Custom Search Form */}
          <form onSubmit={handleSearchCustomKanji} className="relative">
            <input
              type="text"
              value={customChar}
              onChange={(e) => setCustomChar(e.target.value)}
              placeholder="Nhập 1 chữ Kanji bất kỳ (VD: 愛, 桜, 夢)..."
              className="w-full pl-9 pr-20 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-japanese text-slate-900 dark:text-white placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
            >
              Tra cứu
            </button>
          </form>

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Danh sách Kanji {level}:
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-slate-400">
              Đang tải danh sách chữ Hán...
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2 max-h-[460px] overflow-y-auto pr-1">
              {kanjiList.map((k) => (
                <button
                  key={k._id || k.character}
                  onClick={() => setSelectedKanji(k)}
                  className={`h-14 flex flex-col items-center justify-center rounded-xl border font-japanese text-xl font-bold transition-all ${
                    selectedKanji?.character === k.character
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                  }`}
                >
                  {k.character}
                  {k.hanViet?.[0] && (
                    <span className="text-[10px] font-normal opacity-80 mt-0.5 font-sans">
                      {k.hanViet[0]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Interactive Stroke Canvas & Kanji Details */}
        <div className="lg:col-span-7 space-y-6">
          {selectedKanji ? (
            <div className="space-y-6">
              {/* Stroke Pad Canvas */}
              <KanjiStrokePad
                character={selectedKanji.character}
                onQuizComplete={(data) => {
                  console.log('Quiz completed:', data);
                }}
              />

              {/* Kanji Metadata Card */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{selectedKanji.character}</span>
                      {selectedKanji.hanViet?.length > 0 && (
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                          Hán Việt: {selectedKanji.hanViet.join(', ')}
                        </span>
                      )}
                    </h2>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {selectedKanji.strokes} nét
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">
                      Âm On (Onyomi):
                    </span>
                    <span className="font-japanese font-medium text-slate-800 dark:text-slate-100">
                      {selectedKanji.onyomi?.join('、 ') || '—'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">
                      Âm Kun (Kunyomi):
                    </span>
                    <span className="font-japanese font-medium text-slate-800 dark:text-slate-100">
                      {selectedKanji.kunyomi?.join('、 ') || '—'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-sm">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">
                    Nghĩa của chữ:
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {selectedKanji.meanings?.[0]?.definitions?.join(', ') || 'Chưa có định nghĩa'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
              Chọn một chữ Kanji bên trái để bắt đầu luyện viết nét
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
