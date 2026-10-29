import { useState, useEffect, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import * as wanakana from 'wanakana';
import { 
  BookOpen, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Search, 
  RotateCcw, 
  Sparkles, 
  HelpCircle,
  ChevronRight,
  Flame,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function GrammarDojo() {
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'conjugation' | 'quiz'
  const [level, setLevel] = useState('all');
  const [search, setSearch] = useState('');
  
  // Library state
  const [grammars, setGrammars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGrammar, setSelectedGrammar] = useState(null);

  // Conjugation Drill state
  const [drillForm, setDrillForm] = useState('te'); // 'te', 'ta', 'nai', 'potential', 'passive', 'causative', 'volitional', 'ba'
  const [verbsList, setVerbsList] = useState([]);
  const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [conjugationResult, setConjugationResult] = useState(null); // 'correct' | 'wrong' | null
  const [conjugationStreak, setConjugationStreak] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const inputRef = useRef(null);

  // Quiz Challenge state
  const [quizList, setQuizList] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // Lấy danh sách ngữ pháp
  useEffect(() => {
    fetchGrammars();
  }, [level, search]);

  const fetchGrammars = async () => {
    setLoading(true);
    try {
      const params = {};
      if (level !== 'all') params.level = level;
      if (search.trim()) params.search = search.trim();

      const res = await axiosClient.get('/grammar', { params });
      if (res.success && res.data) {
        setGrammars(res.data);
        if (!selectedGrammar && res.data.length > 0) {
          setSelectedGrammar(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Lỗi tải ngữ pháp:', err);
    } finally {
      setLoading(false);
    }
  };

  // Lấy dữ liệu chia thể động từ
  useEffect(() => {
    fetchConjugationData();
  }, []);

  const fetchConjugationData = async () => {
    try {
      const res = await axiosClient.get('/grammar/conjugations');
      if (res.success && res.data) {
        setVerbsList(res.data);
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu chia thể:', err);
    }
  };

  // Lấy dữ liệu bài kiểm tra đố vui
  const startNewQuiz = async () => {
    setLoadingQuiz(true);
    setQuizCompleted(false);
    setQuizScore(0);
    setQuizIndex(0);
    setSelectedOption(null);
    try {
      const params = { count: 10 };
      if (level !== 'all') params.level = level;
      const res = await axiosClient.get('/grammar/quizzes/random', { params });
      if (res.success && res.data && res.data.length > 0) {
        setQuizList(res.data);
      } else {
        setQuizList([]);
      }
    } catch (err) {
      console.error('Lỗi tải bài trắc nghiệm:', err);
    } finally {
      setLoadingQuiz(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'quiz') {
      startNewQuiz();
    }
  }, [activeTab, level]);

  // Audio Web Speech API
  const speakJapanese = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Quản lý gõ WanaKana cho ô chia thể
  const handleInputChange = (e) => {
    const val = e.target.value;
    const kanaVal = wanakana.toHiragana(val, { IMEMode: true });
    setUserInput(kanaVal);
    if (conjugationResult) {
      setConjugationResult(null);
      setShowAnswer(false);
    }
  };

  const currentVerb = verbsList[currentVerbIndex] || null;
  const currentTargetForm = currentVerb?.conjugations?.[drillForm] || null;

  const handleCheckConjugation = (e) => {
    if (e) e.preventDefault();
    if (!currentTargetForm || !userInput.trim()) return;

    const cleanInput = userInput.trim();
    const isCorrect = 
      cleanInput === currentTargetForm.form || 
      cleanInput === currentTargetForm.reading ||
      cleanInput === currentTargetForm.romaji;

    if (isCorrect) {
      setConjugationResult('correct');
      setConjugationStreak((prev) => prev + 1);
    } else {
      setConjugationResult('wrong');
      setConjugationStreak(0);
    }
  };

  const handleNextVerb = () => {
    setUserInput('');
    setConjugationResult(null);
    setShowAnswer(false);
    if (verbsList.length > 0) {
      setCurrentVerbIndex((prev) => (prev + 1) % verbsList.length);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Xử lý chọn đáp án quiz
  const handleSelectQuizOption = (index) => {
    if (selectedOption !== null) return; // Đã trả lời rồi thì không chọn lại
    setSelectedOption(index);
    const currentQuiz = quizList[quizIndex];
    if (index === currentQuiz.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedOption(null);
    if (quizIndex + 1 < quizList.length) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const formLabels = {
    te: 'Thể Te (て形)',
    ta: 'Thể Ta (た形)',
    nai: 'Thể Phủ Định (ない形)',
    potential: 'Thể Khả Năng (可能形)',
    passive: 'Thể Bị Động (受身形)',
    causative: 'Thể Sai Khiến (使役形)',
    volitional: 'Thể Ý Chí (意向形)',
    ba: 'Thể Điều Kiện (ば形)'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
            <Sparkles size={14} className="text-yellow-300" />
            Grammar Mastery Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Võ Đài Ngữ Pháp JLPT (N5 → N3)
          </h1>
          <p className="text-emerald-100 text-sm mt-1 max-w-xl">
            Làm chủ hơn 350 cấu trúc ngữ pháp trọng tâm, luyện biến đổi các thể động từ và rèn phản xạ qua thử thách đố vui trắc nghiệm.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="relative z-10 flex bg-black/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'library'
                ? 'bg-white text-emerald-800 shadow-md scale-102'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <BookOpen size={16} />
            Cẩm Nang
          </button>
          <button
            onClick={() => setActiveTab('conjugation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'conjugation'
                ? 'bg-white text-emerald-800 shadow-md scale-102'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Zap size={16} className="text-amber-400" />
            Luyện Chia Thể
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-white text-emerald-800 shadow-md scale-102'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <HelpCircle size={16} />
            Đố Vui Phản Xạ
          </button>
        </div>
      </div>

      {/* Level Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {['all', 'N5', 'N4', 'N3'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                level === lvl
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lvl === 'all' ? 'Tất cả cấp độ' : lvl}
            </button>
          ))}
        </div>

        {activeTab === 'library' && (
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mẫu ngữ pháp, ý nghĩa..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}
      </div>

      {/* ==================== TAB 1: CẨM NANG NGỮ PHÁP ==================== */}
      {activeTab === 'library' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List cột trái */}
          <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center py-12 text-slate-400 text-sm">Đang tải danh sách ngữ pháp...</div>
            ) : grammars.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">Không tìm thấy ngữ pháp phù hợp.</div>
            ) : (
              grammars.map((item) => {
                const isSelected = selectedGrammar?._id === item._id;
                return (
                  <div
                    key={item._id}
                    onClick={() => setSelectedGrammar(item)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500 shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {item.pattern}
                      </h3>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                        {item.jlptLevel}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono">
                      {item.romaji}
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                      👉 {item.meaning}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Chi tiết cột phải */}
          <div className="lg:col-span-7">
            {selectedGrammar ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-600 text-white">
                      JLPT {selectedGrammar.jlptLevel}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {selectedGrammar.romaji}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{selectedGrammar.pattern}</span>
                    <button
                      onClick={() => speakJapanese(selectedGrammar.pattern.replace(/[〜~]/g, ''))}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-600 transition-colors"
                      title="Phát âm mẫu ngữ pháp"
                    >
                      <Volume2 size={20} />
                    </button>
                  </h2>
                  <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                    {selectedGrammar.meaning}
                  </p>
                </div>

                {/* Cấu trúc ngữ pháp */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers size={14} />
                    Cấu Trúc Kết Hợp (Structure)
                  </h4>
                  <div className="font-mono text-sm sm:text-base font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedGrammar.structure}
                  </div>
                  {selectedGrammar.formation && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {selectedGrammar.formation}
                    </p>
                  )}
                </div>

                {/* Giải thích chi tiết */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Giải Thích Ý Nghĩa & Ngữ Cảnh
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {selectedGrammar.explanation}
                  </p>
                  {selectedGrammar.caution && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
                      ⚠️ <strong>Lưu ý:</strong> {selectedGrammar.caution}
                    </div>
                  )}
                </div>

                {/* Ví dụ mẫu */}
                {selectedGrammar.examples && selectedGrammar.examples.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Câu Ví Dụ Thực Tế (Examples)
                    </h4>
                    <div className="space-y-3">
                      {selectedGrammar.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3"
                        >
                          <div>
                            <div
                              className="text-sm sm:text-base font-medium text-slate-900 dark:text-white"
                              dangerouslySetInnerHTML={{ __html: ex.furiganaHtml || ex.japanese }}
                            />
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {ex.vietnamese}
                            </div>
                          </div>
                          <button
                            onClick={() => speakJapanese(ex.japanese)}
                            className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors flex-shrink-0"
                            title="Nghe phát âm ví dụ"
                          >
                            <Volume2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-sm">
                Chọn một mẫu ngữ pháp để xem chi tiết
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: LUYỆN CHIA THỂ ĐỘNG TỪ ==================== */}
      {activeTab === 'conjugation' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Chọn thể luyện tập */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Chọn Thể Động Từ Muốn Rèn Luyện:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(formLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setDrillForm(key);
                    setConjugationResult(null);
                    setShowAnswer(false);
                    setUserInput('');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                    drillForm === key
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Flashcard Động Từ & Ô Gõ Đáp Án */}
          {currentVerb && currentTargetForm ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm text-center relative overflow-hidden">
              {/* Streak Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-xs font-bold">
                <Flame size={14} className="fill-amber-500 text-amber-500" />
                Streak: {conjugationStreak}
              </div>

              {/* Thông tin động từ gốc */}
              <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold mb-4">
                {currentVerb.group}
              </div>

              <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2">
                {currentVerb.verb}
              </div>
              <div className="text-sm font-mono text-slate-400 mb-1">
                {currentVerb.reading} ({currentVerb.romaji})
              </div>
              <div className="text-base font-semibold text-emerald-600 dark:text-emerald-400 mb-6">
                Nghĩa: {currentVerb.meaning}
              </div>

              {/* Câu hỏi mục tiêu */}
              <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-6">
                👉 Hãy chuyển sang: <span className="underline">{formLabels[drillForm]}</span>
              </div>

              {/* Form gõ đáp án bằng WanaKana IME */}
              <form onSubmit={handleCheckConjugation} className="max-w-md mx-auto space-y-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Gõ Romaji hoặc Hiragana (VD: kaite, tabete)..."
                    className="w-full text-center text-xl font-bold py-3.5 px-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400 placeholder:text-sm placeholder:font-normal"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all"
                  >
                    Kiểm Tra
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAnswer(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-all"
                  >
                    Xem Đáp Án
                  </button>
                  <button
                    type="button"
                    onClick={handleNextVerb}
                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 transition-colors"
                    title="Từ tiếp theo"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </form>

              {/* Kết quả chấm điểm */}
              {conjugationResult === 'correct' && (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2 max-w-md mx-auto animate-bounce-short">
                  <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                  <span className="font-bold text-sm">Chính xác tuyệt đối! (+1 streak)</span>
                </div>
              )}

              {conjugationResult === 'wrong' && (
                <div className="mt-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-center justify-center gap-2 max-w-md mx-auto">
                  <XCircle size={20} className="text-rose-500 flex-shrink-0" />
                  <span className="font-bold text-sm">Chưa đúng rồi! Hãy thử lại hoặc bấm "Xem Đáp Án".</span>
                </div>
              )}

              {/* Hiển thị đáp án & Quy tắc chia */}
              {showAnswer && (
                <div className="mt-6 p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 text-left max-w-md mx-auto">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                    Đáp Án Đúng:
                  </div>
                  <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                    <span>{currentTargetForm.form}</span>
                    <button
                      onClick={() => speakJapanese(currentTargetForm.reading || currentTargetForm.form)}
                      className="p-1 hover:text-indigo-500"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentTargetForm.reading} ({currentTargetForm.romaji})
                  </div>
                  <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/60 text-xs text-slate-700 dark:text-slate-300">
                    💡 <strong>Quy tắc biến âm:</strong> {currentTargetForm.explanation}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">Đang tải dữ liệu chia thể...</div>
          )}
        </div>
      )}

      {/* ==================== TAB 3: ĐỐ VUI PHẢN XẠ NGỮ PHÁP ==================== */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {loadingQuiz ? (
            <div className="text-center py-16 text-slate-400 text-sm">Đang chuẩn bị đề thi đố vui...</div>
          ) : quizCompleted ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-500 mx-auto flex items-center justify-center mb-4">
                <Award size={36} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Hoàn Thành Thử Thách!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Bạn đã hoàn thành 10 câu trắc nghiệm phản xạ ngữ pháp cấp độ {level.toUpperCase()}.
              </p>
              <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-6">
                {quizScore} / {quizList.length}
              </div>
              <button
                onClick={startNewQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
              >
                <RotateCcw size={16} />
                Làm Bộ Đề Khác
              </button>
            </div>
          ) : quizList.length > 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              {/* Progress bar */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                <span>Câu {quizIndex + 1} / {quizList.length}</span>
                <span>Điểm: {quizScore}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 transition-all duration-300"
                  style={{ width: `${((quizIndex + 1) / quizList.length) * 100}%` }}
                />
              </div>

              {/* Câu hỏi */}
              <div className="mb-6">
                <div className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2">
                  JLPT {quizList[quizIndex].jlptLevel}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                  {quizList[quizIndex].question}
                </h3>
              </div>

              {/* 4 Phương án */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {quizList[quizIndex].options.map((opt, idx) => {
                  let btnStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-500';

                  if (selectedOption !== null) {
                    if (idx === quizList[quizIndex].correctIndex) {
                      btnStyle = 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-rose-100 dark:bg-rose-950/70 border-rose-500 text-rose-800 dark:text-rose-200 font-bold';
                    } else {
                      btnStyle = 'opacity-50 border-transparent';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuizOption(idx)}
                      disabled={selectedOption !== null}
                      className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{idx + 1}. {opt}</span>
                      {selectedOption !== null && idx === quizList[quizIndex].correctIndex && (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      )}
                      {selectedOption !== null && idx === selectedOption && idx !== quizList[quizIndex].correctIndex && (
                        <XCircle size={18} className="text-rose-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Giải thích chi tiết sau khi trả lời */}
              {selectedOption !== null && (
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 mb-6 space-y-2">
                  <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                    💡 Giải Thích Ngữ Pháp:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {quizList[quizIndex].explanation}
                  </p>
                </div>
              )}

              {/* Nút câu tiếp theo */}
              {selectedOption !== null && (
                <button
                  onClick={handleNextQuizQuestion}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{quizIndex + 1 === quizList.length ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}</span>
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-sm">
              Chưa có dữ liệu bài trắc nghiệm cho cấp độ này.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
