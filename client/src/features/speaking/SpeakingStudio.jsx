import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Award, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import * as wanakana from 'wanakana';

// Thuật toán Levenshtein Distance chuẩn SWE để so khớp độ chính xác chuỗi
function calculateSimilarity(str1, str2) {
  const s1 = wanakana.toHiragana(str1).replace(/[\s\.\,\?、。]/g, '');
  const s2 = wanakana.toHiragana(str2).replace(/[\s\.\,\?、。]/g, '');

  if (s1 === s2) return 100;
  if (!s1.length || !s2.length) return 0;

  const track = Array(s2.length + 1).fill(null).map(() =>
    Array(s1.length + 1).fill(null));
  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = track[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  const score = Math.max(0, Math.round(((maxLen - distance) / maxLen) * 100));
  return score;
}

export default function SpeakingStudio() {
  const sentences = [
    {
      level: 'N5',
      japanese: 'はじめまして、よろしくお願いします。',
      romaji: 'Hajimemashite, yoroshiku onegaishimasu.',
      meaning: 'Rất vui được gặp bạn, xin hãy giúp đỡ tôi.'
    },
    {
      level: 'N5',
      japanese: '毎朝七時に起きます。',
      romaji: 'Maiasa shichiji ni okimasu.',
      meaning: 'Mỗi sáng tôi thức dậy lúc 7 giờ.'
    },
    {
      level: 'N4',
      japanese: '日本語の会話がもっと上手になりたいです。',
      romaji: 'Nihongo no kaiwa ga motto jouzu ni naritai desu.',
      meaning: 'Tôi muốn giao tiếp tiếng Nhật giỏi hơn nữa.'
    },
    {
      level: 'N3',
      japanese: '将来の夢を実現するために、毎日一生懸命努力しています。',
      romaji: 'Shourai no yume wo jitsugen suru tame ni, mainichi isshoukenmei doryoku shiteimasu.',
      meaning: 'Để biến ước mơ tương lai thành hiện thực, mỗi ngày tôi đều nỗ lực hết mình.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  const currentSentence = sentences[currentIndex];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let currentResult = '';
      for (let i = 0; i < event.results.length; i++) {
        currentResult += event.results[i][0].transcript;
      }
      setTranscript(currentResult);

      if (event.results[0].isFinal) {
        const accuracy = calculateSimilarity(currentSentence.japanese, currentResult);
        setScore(accuracy);
        setIsRecording(false);
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [currentSentence]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      setScore(null);
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSpeakSample = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentSentence.japanese);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Speaking & Shadowing Studio 🎙️
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Luyện phát âm chuẩn người bản xứ với Web Speech Recognition và thuật toán Levenshtein Distance
        </p>
      </div>

      {!speechSupported && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-300 text-sm flex items-center gap-3">
          <AlertTriangle size={20} className="flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Trình duyệt của bạn chưa bật hoặc không hỗ trợ Web Speech API. Vui lòng sử dụng Google Chrome hoặc Microsoft Edge để trải nghiệm đầy đủ tính năng nhận diện giọng nói tiếng Nhật.
          </span>
        </div>
      )}

      {/* Main Practice Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        {/* Level & Controls */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            Cấp độ: {currentSentence.level}
          </span>
          <div className="flex items-center gap-2">
            {sentences.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setTranscript('');
                  setScore(null);
                }}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                  currentIndex === idx
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Japanese Sentence Display */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3">
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-wide font-japanese">
            {currentSentence.japanese}
          </div>
          <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            {currentSentence.romaji}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Nghĩa: {currentSentence.meaning}
          </div>
          <button
            onClick={handleSpeakSample}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 rounded-xl text-xs font-semibold transition-colors mt-2"
          >
            <Volume2 size={16} />
            Nghe mẫu giọng bản xứ
          </button>
        </div>

        {/* Record & Feedback Section */}
        <div className="flex flex-col items-center justify-center space-y-4 pt-2">
          <button
            onClick={toggleRecording}
            disabled={!speechSupported}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all transform active:scale-95 ${
              isRecording
                ? 'bg-rose-500 animate-pulse ring-8 ring-rose-100 dark:ring-rose-950'
                : 'bg-indigo-600 hover:bg-indigo-700 ring-4 ring-indigo-50 dark:ring-indigo-950/50'
            }`}
          >
            {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {isRecording ? 'Đang lắng nghe bạn nói... (Bấm để kết thúc)' : 'Bấm nút mic và đọc to câu trên'}
          </span>
        </div>

        {/* Results */}
        {transcript && (
          <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Kết quả nhận diện được:
            </div>
            <div className="text-lg font-medium text-slate-800 dark:text-slate-100 font-japanese">
              "{transcript}"
            </div>

            {score !== null && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className={`w-6 h-6 ${score >= 80 ? 'text-amber-500' : 'text-slate-400'}`} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Độ chuẩn xác phát âm:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-2xl font-black ${
                    score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : score >= 50 ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                    {score}%
                  </div>
                  {score >= 80 ? (
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-semibold border border-emerald-200 dark:border-emerald-800">
                      Phát âm rất chuẩn!
                    </span>
                  ) : (
                    <span className="text-xs bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-semibold border border-amber-200 dark:border-amber-800">
                      Hãy nghe lại và thử lại nhé!
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
