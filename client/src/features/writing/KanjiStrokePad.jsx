import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { Play, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function KanjiStrokePad({ character, onQuizComplete }) {
  const targetRef = useRef(null);
  const writerRef = useRef(null);
  const [mistakes, setMistakes] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!targetRef.current || !character) return;
    targetRef.current.innerHTML = '';
    setMistakes(0);
    setIsCompleted(false);
    setLoading(true);
    setLoadError(false);

    try {
      const writer = HanziWriter.create(targetRef.current, character, {
        width: 260,
        height: 260,
        padding: 20,
        showOutline: true,
        strokeAnimationSpeed: 1.2,
        delayBetweenStrokes: 200,
        strokeColor: '#1e293b',
        outlineColor: '#cbd5e1',
        highlightColor: '#3b82f6',
        drawingColor: '#2563eb',
        charDataLoader: (char, onComplete) => {
          fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data-jp@0/${char}.json`)
            .then((res) => {
              if (!res.ok) throw new Error('Data not found');
              return res.json();
            })
            .then((data) => {
              setLoading(false);
              onComplete(data);
            })
            .catch((err) => {
              console.warn(`Kanji data fallback cho chữ ${char}:`, err);
              // Fallback qua KanjiVG chung nếu bản jp chưa có
              fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`)
                .then(r => r.json())
                .then(data => {
                  setLoading(false);
                  onComplete(data);
                })
                .catch(() => {
                  setLoading(false);
                  setLoadError(true);
                });
            });
        }
      });

      writerRef.current = writer;

      // Bật chế độ Quiz kiểm tra từng nét vẽ
      writer.quiz({
        onMistake: () => setMistakes((prev) => prev + 1),
        onComplete: (summaryData) => {
          setIsCompleted(true);
          onQuizComplete?.({
            character,
            totalMistakes: summaryData.totalMistakes
          });
        }
      });
    } catch (err) {
      console.error('Lỗi khởi tạo HanziWriter:', err);
      setLoading(false);
    }
  }, [character, onQuizComplete]);

  const handleAnimate = () => {
    if (writerRef.current) {
      writerRef.current.animateCharacter();
    }
  };

  const handleReset = () => {
    if (writerRef.current) {
      setMistakes(0);
      setIsCompleted(false);
      writerRef.current.quiz({
        onMistake: () => setMistakes((prev) => prev + 1),
        onComplete: (summaryData) => {
          setIsCompleted(true);
          onQuizComplete?.({
            character,
            totalMistakes: summaryData.totalMistakes
          });
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="relative">
        <div
          ref={targetRef}
          className="border-2 border-dashed border-indigo-200 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner cursor-crosshair overflow-hidden"
          style={{ width: 260, height: 260 }}
        />
        {loading && (
          <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center text-sm text-slate-500 font-medium">
            Đang tải dữ liệu nét vẽ...
          </div>
        )}
        {loadError && (
          <div className="absolute inset-0 bg-white/90 rounded-2xl flex flex-col items-center justify-center text-center p-4 text-xs text-rose-500">
            <AlertCircle className="w-8 h-8 mb-2 text-rose-400" />
            Chưa có dữ liệu vector nét cho chữ này
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-between text-sm px-2 text-slate-600">
        <div className="flex items-center gap-1.5">
          <span>Chữ mục tiêu:</span>
          <span className="text-xl font-bold text-slate-900">{character}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Số nét sai:</span>
          <span className={`font-bold ${mistakes > 0 ? 'text-rose-500' : 'text-slate-700'}`}>
            {mistakes}
          </span>
        </div>
      </div>

      {isCompleted && (
        <div className="w-full py-2 px-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-emerald-700 text-sm font-semibold animate-bounce">
          <CheckCircle2 size={18} />
          Xuất sắc! Bạn đã viết đúng toàn bộ nét!
        </div>
      )}

      <div className="flex items-center gap-3 w-full">
        <button
          type="button"
          onClick={handleAnimate}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          <Play size={16} />
          Xem mẫu nét
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <RotateCcw size={16} />
          Viết lại
        </button>
      </div>
    </div>
  );
}
