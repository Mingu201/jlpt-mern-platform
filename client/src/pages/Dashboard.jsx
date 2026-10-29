import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Search, Volume2, RotateCw, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const [level, setLevel] = useState('N5');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 30 });
  const [vocabList, setVocabList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' | 'list'
  const [flippedIndex, setFlippedIndex] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [level, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVocab();
    }, 300); // 300ms Debounce theo chuẩn SWE
    return () => clearTimeout(timer);
  }, [level, search, page]);

  const fetchVocab = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/vocab?level=${level}&q=${encodeURIComponent(search)}&page=${page}&limit=30`);
      setVocabList(res.data || []);
      if (res.meta) {
        setMeta(res.meta);
      }
      setFlippedIndex(null);
    } catch (err) {
      console.error('Lỗi tải từ vựng:', err);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-[1720px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-indigo-200 border border-white/10">
            Nền tảng Full-Stack MERN
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Làm chủ JLPT N5 đến N3 toàn diện 4 kỹ năng
          </h1>
          <p className="text-sm text-indigo-100">
            Tích hợp cơ sở dữ liệu mở OpenJLPT (2.963 từ vựng, 640 Kanji), nhận diện giọng nói Web Speech API và tương tác viết Kanji chuẩn nét.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        {/* Level Switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['N5', 'N4', 'N3'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                level === lvl
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Search Bar with Debounce */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo chữ Hán, Romaji hoặc nghĩa tiếng Việt..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'flashcards'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Layers size={14} /> Flashcard
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'list'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <BookOpen size={14} /> Danh sách
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Đang truy vấn dữ liệu từ MongoDB...
        </div>
      ) : vocabList.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Không tìm thấy từ vựng nào phù hợp với bộ lọc.
        </div>
      ) : activeTab === 'flashcards' ? (
        /* Flashcards Grid (3D Flip Effect) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {vocabList.map((item, index) => {
            const isFlipped = flippedIndex === index;
            return (
              <div
                key={item._id}
                onClick={() => setFlippedIndex(isFlipped ? null : index)}
                className="group h-56 cursor-pointer select-none [perspective:1000px]"
              >
                <div
                  className={`relative w-full h-full duration-300 [transform-style:preserve-3d] ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all [backface-visibility:hidden]">
                    <div className="flex items-start justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {item.jlptLevel}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(item.word);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                        title="Nghe phát âm"
                      >
                        <Volume2 size={18} />
                      </button>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-slate-900 dark:text-white font-japanese">
                        {item.word}
                      </div>
                      <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium font-japanese">
                        {item.reading}
                      </div>
                      <div className="text-xs text-slate-400">
                        {item.romaji}
                      </div>
                    </div>

                    <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                      <RotateCw size={12} /> Bấm để xem nghĩa
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-700 text-white rounded-2xl p-6 flex flex-col justify-between shadow-md [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div className="text-[11px] font-semibold text-indigo-200 uppercase tracking-wider">
                      Ý nghĩa & Ví dụ
                    </div>

                    <div className="space-y-3">
                      <div className="text-lg font-bold">
                        {item.meanings?.[0]?.definitions?.join(', ')}
                      </div>

                      {item.examples?.[0] && (
                        <div className="p-3 bg-white/10 rounded-xl text-xs space-y-1 font-sans">
                          <div className="font-japanese text-sm">{item.examples[0].japanese}</div>
                          <div className="text-indigo-100">{item.examples[0].vietnamese}</div>
                        </div>
                      )}
                    </div>

                    <div className="text-right text-[11px] text-indigo-200">
                      Bấm để lật lại mặt trước
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-xs">
              <tr>
                <th className="py-3 px-4">Từ vựng</th>
                <th className="py-3 px-4">Cách đọc (Hiragana)</th>
                <th className="py-3 px-4">Romaji</th>
                <th className="py-3 px-4">Nghĩa</th>
                <th className="py-3 px-4 text-center">Phát âm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {vocabList.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white font-japanese text-base">
                    {item.word}
                  </td>
                  <td className="py-3.5 px-4 text-indigo-600 dark:text-indigo-400 font-japanese">
                    {item.reading}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    {item.romaji}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200 font-medium">
                    {item.meanings?.[0]?.definitions?.join(', ')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => playAudio(item.word)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800"
                    >
                      <Volume2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {meta.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">
          <div>
            Đang xem trang <strong className="text-slate-900 dark:text-white">{meta.page}</strong> / {meta.totalPages} (Tổng cộng <strong className="text-indigo-600 dark:text-indigo-400">{meta.total}</strong> từ vựng {level})
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ← Trang trước
            </button>
            <span className="text-xs px-3 font-semibold text-slate-500">
              {page} / {meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Trang sau →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
