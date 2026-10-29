import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import KanjiStrokePad from '../writing/KanjiStrokePad';
import { 
  GraduationCap, Volume2, Mic, MicOff, CheckCircle2, 
  XCircle, Award, ArrowRight, RotateCcw, Sparkles, BookOpen, Layers
} from 'lucide-react';
import * as wanakana from 'wanakana';

// Tính độ tương đồng phát âm
function calculateSimilarity(str1, str2) {
  const s1 = wanakana.toHiragana(str1).replace(/[\s\.\,\?、。]/g, '');
  const s2 = wanakana.toHiragana(str2).replace(/[\s\.\,\?、。]/g, '');
  if (s1 === s2) return 100;
  if (!s1.length || !s2.length) return 0;
  const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;
  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(track[j][i - 1] + 1, track[j - 1][i] + 1, track[j - 1][i - 1] + indicator);
    }
  }
  const distance = track[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return Math.max(0, Math.round(((maxLen - distance) / maxLen) * 100));
}

export default function ClassroomSession({ onOpenAuthModal }) {
  const { user, isAuthenticated, refreshStats } = useAuth();
  const [level, setLevel] = useState('N5');
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stages: 1: 'lecture' | 2: 'shadowing' | 3: 'quiz' | 4: 'kanji' | 5: 'summary'
  const [stage, setStage] = useState(1);

  // Stage 1: Lecture Index
  const [lectureIdx, setLectureIdx] = useState(0);

  // Stage 2: Shadowing
  const [shadowIdx, setShadowIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechScore, setSpeechScore] = useState(null);
  const recognitionRef = useRef(null);

  // Stage 3: Quiz
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  // Stage 5: SRS Rating
  const [savingProgress, setSavingProgress] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchNewLesson(level);
  }, [level]);

  // Khởi tạo Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let currentResult = '';
        for (let i = 0; i < event.results.length; i++) {
          currentResult += event.results[i][0].transcript;
        }
        setSpeechTranscript(currentResult);

        if (event.results[0].isFinal && lessonData?.vocabulary?.[shadowIdx]) {
          const target = lessonData.vocabulary[shadowIdx].word;
          const score = calculateSimilarity(target, currentResult);
          setSpeechScore(score);
          setIsRecording(false);
        }
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, [lessonData, shadowIdx]);

  const fetchNewLesson = async (lvl) => {
    setLoading(true);
    setStage(1);
    setLectureIdx(0);
    setShadowIdx(0);
    setQuizIdx(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setSpeechScore(null);
    setSpeechTranscript('');
    setSavedSuccess(false);

    try {
      const res = await axiosClient.get(`/srs/lesson?level=${lvl}`);
      setLessonData(res.data);
    } catch (err) {
      console.error('Lỗi tải bài học:', err);
    } finally {
      setLoading(false);
    }
  };

  const playSpeech = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt chưa hỗ trợ ghi âm tiếng Nhật!');
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setSpeechTranscript('');
      setSpeechScore(null);
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSelectAnswer = (option, correct) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    if (option === correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleSaveProgress = async (grade) => {
    if (!isAuthenticated) {
      onOpenAuthModal?.();
      return;
    }
    setSavingProgress(true);
    try {
      // Lưu tiến độ cho tất cả từ vựng trong bài học này
      const promises = (lessonData?.vocabulary || []).map((v) =>
        axiosClient.post('/srs/review', {
          itemId: v._id,
          itemType: 'Vocabulary',
          grade,
          jlptLevel: level
        })
      );
      if (lessonData?.focusKanji?._id) {
        promises.push(
          axiosClient.post('/srs/review', {
            itemId: lessonData.focusKanji._id,
            itemType: 'Kanji',
            grade,
            jlptLevel: level
          })
        );
      }
      await Promise.all(promises);
      setSavedSuccess(true);
      await refreshStats?.();
    } catch (err) {
      alert('Lỗi lưu tiến độ: ' + err.message);
    } finally {
      setSavingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500 dark:text-slate-400 text-sm">
        Đang soạn giáo án lớp học thực chiến...
      </div>
    );
  }

  const currentVocab = lessonData?.vocabulary?.[lectureIdx];
  const currentShadowVocab = lessonData?.vocabulary?.[shadowIdx];
  const currentQuiz = lessonData?.quizQuestions?.[quizIdx];

  const stagesList = [
    { id: 1, label: '1. Giảng bài' },
    { id: 2, label: '2. Luyện nói' },
    { id: 3, label: '3. Phản xạ' },
    { id: 4, label: '4. Viết bảng' },
    { id: 5, label: '5. Đánh giá' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Classroom Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Lớp Học Tiếng Nhật Trực Tiếp (Classroom Mode)
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800">
                {level}
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Trải nghiệm lớp học 1-1: Giảng bài $\rightarrow$ Luyện nói $\rightarrow$ Phản xạ $\rightarrow$ Viết bảng $\rightarrow$ Lưu FSRS
            </p>
          </div>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {['N5', 'N4', 'N3'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                level === lvl
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Classroom Stages Progress Bar */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
        {stagesList.map((st) => (
          <button
            key={st.id}
            onClick={() => setStage(st.id)}
            className={`py-2 rounded-xl transition-all ${
              stage === st.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : stage > st.id
                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* ================= STAGE 1: LECTURE (GIẢNG BÀI) ================= */}
      {stage === 1 && currentVocab && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>PHẦN 1: THẦY CÔ GIẢNG BÀI ({lectureIdx + 1}/5)</span>
            <span>Bấm loa để nghe phát âm chuẩn</span>
          </div>

          <div className="text-center py-6 space-y-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-5xl font-extrabold text-slate-900 dark:text-white font-japanese">
              {currentVocab.word}
            </div>
            <div className="text-lg text-indigo-600 dark:text-indigo-400 font-semibold font-japanese">
              {currentVocab.reading} ({currentVocab.romaji})
            </div>
            <div className="text-base text-slate-700 dark:text-slate-200 font-medium">
              Nghĩa: {currentVocab.meanings?.[0]?.definitions?.join(', ')}
            </div>
            <button
              onClick={() => playSpeech(currentVocab.word)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md transition-all"
            >
              <Volume2 size={16} /> Nghe thầy giáo đọc mẫu
            </button>
          </div>

          {currentVocab.examples?.[0] && (
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl space-y-1 text-sm">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                Ví dụ áp dụng thực tế:
              </span>
              <div className="text-base font-japanese font-medium text-slate-900 dark:text-white">
                {currentVocab.examples[0].japanese}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                {currentVocab.examples[0].vietnamese}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setLectureIdx((i) => Math.max(0, i - 1))}
              disabled={lectureIdx === 0}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
            >
              ← Từ trước
            </button>
            {lectureIdx < 4 ? (
              <button
                onClick={() => setLectureIdx((i) => i + 1)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              >
                Học từ kế tiếp →
              </button>
            ) : (
              <button
                onClick={() => setStage(2)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm flex items-center gap-2"
              >
                Bắt đầu phần Luyện Nói <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= STAGE 2: SHADOWING (LUYỆN NÓI) ================= */}
      {stage === 2 && currentShadowVocab && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>PHẦN 2: THẦY CÔ GỌI ĐỌC BÀI ({shadowIdx + 1}/5)</span>
            <span>Bấm Mic và đọc to từ đang hiển thị</span>
          </div>

          <div className="text-center py-8 space-y-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-4xl font-bold text-slate-900 dark:text-white font-japanese">
              {currentShadowVocab.word}
            </div>
            <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              Cách đọc: {currentShadowVocab.reading}
            </div>

            <button
              onClick={toggleRecording}
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-lg transition-all ${
                isRecording
                  ? 'bg-rose-500 animate-pulse ring-8 ring-rose-100 dark:ring-rose-950'
                  : 'bg-indigo-600 hover:bg-indigo-700 ring-4 ring-indigo-50 dark:ring-indigo-950/50'
              }`}
            >
              {isRecording ? <MicOff size={26} /> : <Mic size={26} />}
            </button>
            <div className="text-xs text-slate-500">
              {isRecording ? 'Đang lắng nghe giọng bạn...' : 'Bấm mic để bắt đầu đọc'}
            </div>

            {speechTranscript && (
              <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 max-w-sm mx-auto space-y-2">
                <div className="text-xs text-slate-400">Bạn đã nói:</div>
                <div className="text-base font-bold text-slate-800 dark:text-slate-100 font-japanese">
                  "{speechTranscript}"
                </div>
                {speechScore !== null && (
                  <div className="text-sm font-bold flex items-center justify-center gap-2">
                    <span className={speechScore >= 70 ? 'text-emerald-500' : 'text-amber-500'}>
                      Điểm phát âm: {speechScore}%
                    </span>
                    {speechScore >= 70 && <CheckCircle2 size={16} className="text-emerald-500" />}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setShadowIdx((i) => Math.max(0, i - 1));
                setSpeechTranscript('');
                setSpeechScore(null);
              }}
              disabled={shadowIdx === 0}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
            >
              ← Câu trước
            </button>
            {shadowIdx < 4 ? (
              <button
                onClick={() => {
                  setShadowIdx((i) => i + 1);
                  setSpeechTranscript('');
                  setSpeechScore(null);
                }}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Luyện câu tiếp theo →
              </button>
            ) : (
              <button
                onClick={() => setStage(3)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2"
              >
                Vào làm bài Trắc Nghiệm Phản Xạ <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= STAGE 3: QUIZ DRILL (PHẢN XẠ) ================= */}
      {stage === 3 && currentQuiz && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>PHẦN 3: BÀI TẬP PHẢN XẠ TỨC THỜI ({quizIdx + 1}/5)</span>
            <span className="text-indigo-600 dark:text-indigo-400">Điểm đúng: {quizScore}/5</span>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase">Chọn nghĩa đúng của từ:</div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white font-japanese">
              {currentQuiz.word}
            </div>
            <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium font-japanese">
              ({currentQuiz.reading})
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuiz.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuiz.correctAnswer;
              let btnClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-700 dark:text-slate-200";

              if (selectedAnswer !== null) {
                if (isCorrect) {
                  btnClass = "bg-emerald-500 text-white border-emerald-500 font-bold";
                } else if (isSelected) {
                  btnClass = "bg-rose-500 text-white border-rose-500 font-bold";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(option, currentQuiz.correctAnswer)}
                  className={`p-4 rounded-2xl border text-left text-sm font-medium transition-all ${btnClass}`}
                >
                  <span className="inline-block w-6 text-xs text-slate-400 mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="flex justify-end pt-2">
              {quizIdx < 4 ? (
                <button
                  onClick={() => {
                    setQuizIdx((i) => i + 1);
                    setSelectedAnswer(null);
                  }}
                  className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-sm"
                >
                  Câu tiếp theo →
                </button>
              ) : (
                <button
                  onClick={() => setStage(4)}
                  className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 shadow-sm flex items-center gap-2"
                >
                  Lên bảng viết chữ Kanji <ArrowRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= STAGE 4: KANJI BOARD (VIẾT BẢNG) ================= */}
      {stage === 4 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>PHẦN 4: THỰC HÀNH VIẾT CHỮ HÁN LÊN BẢNG</span>
            <span>Vẽ theo đúng thứ tự nét</span>
          </div>

          {lessonData?.focusKanji ? (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
                  Chữ Hán trọng tâm bài học hôm nay
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Dùng chuột hoặc ngón tay vẽ từng nét chữ lên bảng bên dưới:
                </p>
              </div>

              <KanjiStrokePad character={lessonData.focusKanji.character} />
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              Không có chữ Kanji nào cho bài học này
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStage(5)}
              className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-md flex items-center gap-2"
            >
              Hoàn thành bài học & Lưu Tiến Độ <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ================= STAGE 5: SUMMARY & FSRS SAVE ================= */}
      {stage === 5 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6 transition-colors">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <Award size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Chúc Mừng Bạn Đã Hoàn Thành Buổi Học! 🎊
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Kết quả bài trắc nghiệm: <strong className="text-indigo-600 dark:text-indigo-400">{quizScore}/5 câu đúng</strong>
            </p>
          </div>

          {/* FSRS Rating Options */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-w-lg mx-auto">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Đánh giá mức độ ghi nhớ để thuật toán FSRS lên lịch ôn tập:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleSaveProgress(1)}
                disabled={savingProgress || savedSuccess}
                className="p-3 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 transition-all disabled:opacity-50"
              >
                1. Chưa nhớ<br/><span className="text-[10px] font-normal opacity-80">(Ôn sau 10p)</span>
              </button>
              <button
                onClick={() => handleSaveProgress(2)}
                disabled={savingProgress || savedSuccess}
                className="p-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-xs hover:bg-amber-100 transition-all disabled:opacity-50"
              >
                2. Hơi khó<br/><span className="text-[10px] font-normal opacity-80">(Ôn ngày mai)</span>
              </button>
              <button
                onClick={() => handleSaveProgress(3)}
                disabled={savingProgress || savedSuccess}
                className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition-all disabled:opacity-50"
              >
                3. Nhớ tốt<br/><span className="text-[10px] font-normal opacity-80">(Ôn sau 3 ngày)</span>
              </button>
              <button
                onClick={() => handleSaveProgress(4)}
                disabled={savingProgress || savedSuccess}
                className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition-all disabled:opacity-50"
              >
                4. Thuộc làu<br/><span className="text-[10px] font-normal opacity-80">(Ôn sau 7 ngày)</span>
              </button>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
                <CheckCircle2 size={16} /> Tiến độ học tập đã được lưu vào MongoDB của bạn!
              </div>
            )}

            {!isAuthenticated && (
              <div className="text-xs text-amber-600 dark:text-amber-400">
                * Bạn chưa đăng nhập. Nhấn vào một trong các nút trên để đăng nhập lưu kết quả vĩnh viễn!
              </div>
            )}
          </div>

          <button
            onClick={() => fetchNewLesson(level)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <RotateCcw size={16} /> Bắt đầu buổi học tiếp theo
          </button>
        </div>
      )}
    </div>
  );
}
