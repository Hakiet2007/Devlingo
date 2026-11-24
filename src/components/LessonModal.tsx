import React, { useState, useEffect } from 'react';
import { X, Heart, Check, AlertCircle, Sparkles, Award, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, Unit } from '../types';
import { soundEffects } from '../utils/audio';
import { DuoMascot } from './DuoMascot';

interface LessonModalProps {
  lesson: Lesson;
  unit: Unit;
  hearts: number;
  maxHearts: number;
  hasSuper: boolean;
  gems: number;
  streak: number;
  onClose: () => void;
  onCompleteLesson: (stats: { xp: number; gems: number; accuracy: number }) => void;
  onDeductHeart: () => void;
  onRefillHearts: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  unit,
  hearts,
  maxHearts,
  hasSuper,
  gems,
  streak,
  onClose,
  onCompleteLesson,
  onDeductHeart,
  onRefillHearts,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedBlank, setSelectedBlank] = useState<string | null>(null);
  const [orderedBlocks, setOrderedBlocks] = useState<string[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<string[]>([]);
  
  // Feedback state: 'idle' | 'correct' | 'wrong'
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [wrongCount, setWrongCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentExercise = lesson.exercises[currentIndex];
  const progressPercent = Math.round(((currentIndex) / lesson.exercises.length) * 100);

  // Initialize exercise state on index change
  useEffect(() => {
    setSelectedOption(null);
    setSelectedBlank(null);
    setFeedbackState('idle');

    if (currentExercise.type === 'order_blocks' && currentExercise.codeBlocks) {
      const shuffled = [...currentExercise.codeBlocks].sort(() => Math.random() - 0.5);
      setAvailableBlocks(shuffled);
      setOrderedBlocks([]);
    }
  }, [currentIndex, currentExercise]);

  // Trigger celebration confetti on finish
  useEffect(() => {
    if (isFinished) {
      soundEffects.playFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isFinished]);

  const canCheck = () => {
    if (feedbackState !== 'idle') return true;
    if (currentExercise.type === 'multiple_choice' || currentExercise.type === 'code_output' || currentExercise.type === 'fix_bug') {
      return selectedOption !== null;
    }
    if (currentExercise.type === 'fill_blank') {
      return selectedBlank !== null;
    }
    if (currentExercise.type === 'order_blocks') {
      return orderedBlocks.length > 0;
    }
    return true;
  };

  const handleCheckAnswer = () => {
    soundEffects.playPop();

    let isCorrect = false;

    if (currentExercise.type === 'multiple_choice' || currentExercise.type === 'code_output' || currentExercise.type === 'fix_bug') {
      isCorrect = selectedOption === currentExercise.correctOptionIndex;
    } else if (currentExercise.type === 'fill_blank') {
      isCorrect = selectedBlank === currentExercise.correctBlankAnswer;
    } else if (currentExercise.type === 'order_blocks') {
      if (currentExercise.correctBlockOrder) {
        isCorrect = JSON.stringify(orderedBlocks) === JSON.stringify(currentExercise.correctBlockOrder);
      }
    }

    if (isCorrect) {
      soundEffects.playCorrect();
      setFeedbackState('correct');
    } else {
      soundEffects.playWrong();
      setFeedbackState('wrong');
      setWrongCount((prev) => prev + 1);
      if (!hasSuper) {
        onDeductHeart();
      }
    }
  };

  const handleNextExercise = () => {
    soundEffects.playPop();
    if (currentIndex + 1 < lesson.exercises.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  // If user runs out of hearts
  if (hearts <= 0 && !hasSuper && !isFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-[#131f24] flex flex-col items-center justify-center p-6 text-center select-none text-white">
        <div className="mb-4">
          <DuoMascot
            size={160}
            pose="sad"
            speechBubble="Đừng nản lòng, thử lại nhé!"
            interactive={true}
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#ff4b4b] mb-2">
          Bạn đã hết tim rồi!
        </h2>
        <p className="text-sm font-bold text-[#849299] max-w-md mb-8">
          Đừng nản lòng! Lập trình là học từ những lỗi sai. Bạn có thể nạp lại tim bằng Đá quý hoặc tiếp tục luyện tập.
        </p>

        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => {
              if (gems >= 50) {
                onRefillHearts();
              } else {
                onClose();
              }
            }}
            disabled={gems < 50}
            className="w-full py-4 px-6 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-sm uppercase rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 cursor-pointer"
          >
            {gems >= 50 ? 'NẠP 5 TIM (50 ĐÁ QUÝ 💎)' : 'KHÔNG ĐỦ ĐÁ QUÝ'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 bg-[#182730] border-2 border-[#37464f] hover:bg-[#20343f] text-[#849299] font-black text-xs uppercase rounded-2xl transition-colors cursor-pointer"
          >
            VỀ TRANG CHỦ
          </button>
        </div>
      </div>
    );
  }

  // Finished Celebration Screen
  if (isFinished) {
    const accuracy = Math.max(0, Math.round(((lesson.exercises.length - wrongCount) / lesson.exercises.length) * 100));

    return (
      <div className="fixed inset-0 z-50 bg-[#131f24] text-white flex flex-col items-center justify-between p-6 select-none animate-in fade-in duration-300">
        <div className="w-full flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center">
          <div className="mb-4">
            <DuoMascot 
              size={180} 
              pose="celebrating" 
              speechBubble="Tuyệt cú mèo! Bạn vừa phá đảo bài học!" 
              interactive={true} 
            />
          </div>

          <h1 className="text-3xl font-black text-[#58cc02] mb-1">
            Tuyệt vời! Hoàn thành bài học!
          </h1>
          <p className="text-sm font-bold text-[#849299] mb-8">
            Bạn vừa nâng cấp kỹ năng lập trình của mình một bậc mới!
          </p>

          {/* Stat Badges */}
          <div className="grid grid-cols-3 gap-3 w-full mb-8">
            <div className="bg-[#182730] border-2 border-amber-400/40 rounded-2xl p-3 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-amber-400 mb-1">KINH NGHIỆM</span>
              <div className="flex items-center gap-1 text-amber-400 font-black text-lg">
                <Sparkles className="w-5 h-5 fill-current" />
                <span>+{lesson.xpReward} KN</span>
              </div>
            </div>

            <div className="bg-[#182730] border-2 border-emerald-400/40 rounded-2xl p-3 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-emerald-400 mb-1">CHÍNH XÁC</span>
              <div className="flex items-center gap-1 text-emerald-400 font-black text-lg">
                <Award className="w-5 h-5" />
                <span>{accuracy}%</span>
              </div>
            </div>

            <div className="bg-[#182730] border-2 border-cyan-400/40 rounded-2xl p-3 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-cyan-400 mb-1">ĐÁ QUÝ</span>
              <div className="flex items-center gap-1 text-cyan-400 font-black text-lg">
                <span>💎</span>
                <span>+{lesson.gemReward}</span>
              </div>
            </div>
          </div>

          {/* Streak indicator */}
          <div className="w-full bg-[#182730] border-2 border-orange-500/40 rounded-2xl p-3 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-[#ff9600] fill-current" />
              <span className="font-extrabold text-sm text-white">Chuỗi ngày học: {streak + 1} ngày!</span>
            </div>
            <span className="text-xs font-black text-[#ff9600]">TIẾP TỤC DUY TRÌ 🔥</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto pt-4 border-t border-[#37464f]">
          <button
            onClick={() => {
              onCompleteLesson({
                xp: lesson.xpReward,
                gems: lesson.gemReward,
                accuracy,
              });
            }}
            className="w-full py-4 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-base uppercase rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
          >
            HOÀN THÀNH
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#131f24] text-white flex flex-col justify-between select-none">
      {/* Top Header: Close, Progress bar, Hearts */}
      <header className="px-4 md:px-8 py-4 flex items-center justify-between gap-4 border-b border-[#37464f]">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="text-[#849299] hover:text-white p-1 rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Chunky Progress Bar */}
        <div className="flex-1 max-w-xl h-4 bg-[#37464f] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-[#58cc02] rounded-full transition-all duration-300 relative"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          >
            <div className="absolute top-0.5 right-1.5 w-4 h-1 bg-white/40 rounded-full" />
          </div>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1.5 font-black text-[#ff4b4b]">
          <Heart className="w-6 h-6 fill-current animate-pulse" />
          <span className="text-base tabular-nums">
            {hasSuper ? '∞' : hearts}
          </span>
        </div>
      </header>

      {/* Main Exercise Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl w-full mx-auto flex flex-col justify-center">
        {/* Mascot prompt speech bubble */}
        <div className="flex items-start gap-4 mb-6">
          <div className="shrink-0 -mt-2">
            <DuoMascot
              size={76}
              pose={feedbackState === 'wrong' ? 'sad' : feedbackState === 'correct' ? 'happy' : 'standing'}
              interactive={true}
            />
          </div>

          <div className="relative flex-1 bg-[#182730] border-2 border-[#37464f] rounded-3xl p-4 shadow-sm">
            {/* Bubble arrow */}
            <div className="absolute -left-2 top-5 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-[#37464f]" />
            <div className="absolute -left-1 top-5 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-[#182730]" />

            <h2 className="text-base md:text-lg font-extrabold text-white leading-snug">
              {currentExercise.prompt}
            </h2>
            {currentExercise.hint && (
              <p className="text-xs text-[#849299] font-semibold mt-1">
                Gợi ý: {currentExercise.hint}
              </p>
            )}
          </div>
        </div>

        {/* Code Snippet Box (if present) */}
        {currentExercise.codeSnippet && (
          <div className="mb-6 rounded-2xl bg-[#0d1519] text-[#f8fafc] p-4 font-mono text-sm shadow-md border-2 border-[#37464f]">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#37464f] text-xs text-[#849299]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="ml-2 font-bold uppercase tracking-wider">{unit.title}</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed font-semibold text-emerald-400">
              {currentExercise.codeSnippet}
            </pre>
          </div>
        )}

        {/* Exercise Input Mode: Multiple Choice & Code Output & Fix Bug */}
        {(currentExercise.type === 'multiple_choice' || 
          currentExercise.type === 'code_output' || 
          currentExercise.type === 'fix_bug') && currentExercise.options && (
          <div className="space-y-3">
            {currentExercise.buggyCode && (
              <div className="mb-4 p-3 bg-red-950/40 border-2 border-red-800 rounded-2xl font-mono text-xs text-red-300">
                <code>{currentExercise.buggyCode}</code>
              </div>
            )}
            {currentExercise.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  disabled={feedbackState !== 'idle'}
                  onClick={() => {
                    soundEffects.playPop();
                    setSelectedOption(idx);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-sm md:text-base border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#1cb0f6] bg-[#142c38] text-[#1cb0f6] border-b-4'
                      : 'border-[#37464f] bg-[#182730] text-white border-b-4 hover:bg-[#20343f]'
                  }`}
                >
                  <span className="text-left font-mono">{option}</span>
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black border ${
                    isSelected ? 'bg-[#1cb0f6] text-white border-transparent' : 'bg-[#131f24] text-[#849299] border-[#37464f]'
                  }`}>
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Exercise Input Mode: Fill In The Blank */}
        {currentExercise.type === 'fill_blank' && (
          <div className="space-y-6">
            <div className="p-6 bg-[#0d1519] rounded-2xl border-2 border-[#37464f] text-center font-mono text-lg text-white">
              {currentExercise.template?.split('__BLANK__').map((part, idx, arr) => (
                <React.Fragment key={idx}>
                  <span>{part}</span>
                  {idx < arr.length - 1 && (
                    <button
                      onClick={() => {
                        if (selectedBlank && feedbackState === 'idle') {
                          setSelectedBlank(null);
                        }
                      }}
                      className={`inline-block mx-2 px-4 py-1.5 rounded-xl border-2 min-w-[80px] transition-all font-mono font-bold text-base ${
                        selectedBlank
                          ? 'bg-[#58cc02] border-[#46a302] text-white shadow-sm'
                          : 'bg-[#182730] border-dashed border-[#37464f] text-[#849299]'
                      }`}
                    >
                      {selectedBlank || '____'}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {currentExercise.blankOptions?.map((word) => {
                const isUsed = selectedBlank === word;
                return (
                  <button
                    key={word}
                    disabled={isUsed || feedbackState !== 'idle'}
                    onClick={() => {
                      soundEffects.playPop();
                      setSelectedBlank(word);
                    }}
                    className={`px-5 py-3 rounded-2xl font-mono font-bold text-sm border-2 border-b-4 transition-all cursor-pointer ${
                      isUsed
                        ? 'opacity-30 border-[#37464f] bg-[#182730]'
                        : 'border-[#37464f] bg-[#182730] text-white hover:bg-[#20343f] active:translate-y-1'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Exercise Input Mode: Order Code Blocks */}
        {currentExercise.type === 'order_blocks' && (
          <div className="space-y-6">
            <div className="min-h-[140px] p-4 bg-[#0d1519] border-2 border-[#37464f] rounded-2xl space-y-2 font-mono">
              <div className="text-xs text-[#849299] font-bold uppercase mb-2">
                Đoạn mã của bạn (Nhấn để gỡ ra):
              </div>
              {orderedBlocks.length === 0 ? (
                <div className="text-[#849299] text-xs italic py-4 text-center">
                  Nhấn các khối mã bên dưới để sắp xếp vào đây...
                </div>
              ) : (
                orderedBlocks.map((block, idx) => (
                  <button
                    key={idx}
                    disabled={feedbackState !== 'idle'}
                    onClick={() => {
                      soundEffects.playPop();
                      setOrderedBlocks(orderedBlocks.filter((_, i) => i !== idx));
                      setAvailableBlocks([...availableBlocks, block]);
                    }}
                    className="block w-full text-left p-2.5 bg-[#182730] hover:bg-[#20343f] text-emerald-400 rounded-xl border border-[#37464f] text-sm font-bold transition-colors cursor-pointer"
                  >
                    <span className="text-[#849299] mr-2 select-none">{idx + 1}.</span>
                    {block}
                  </button>
                ))
              )}
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center">
              {availableBlocks.map((block, idx) => (
                <button
                  key={idx}
                  disabled={feedbackState !== 'idle'}
                  onClick={() => {
                    soundEffects.playPop();
                    setOrderedBlocks([...orderedBlocks, block]);
                    setAvailableBlocks(availableBlocks.filter((_, i) => i !== idx));
                  }}
                  className="px-4 py-2.5 bg-[#182730] border-2 border-b-4 border-[#37464f] hover:bg-[#20343f] rounded-xl font-mono font-bold text-xs md:text-sm text-white active:translate-y-1 transition-all cursor-pointer"
                >
                  {block}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Sticky Action / Feedback Bar */}
      <footer
        className={`px-4 md:px-8 py-5 border-t-2 transition-all ${
          feedbackState === 'correct'
            ? 'bg-[#142c38] border-[#58cc02]'
            : feedbackState === 'wrong'
            ? 'bg-[#2a1318] border-[#ff4b4b]'
            : 'bg-[#131f24] border-[#37464f]'
        }`}
      >
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Feedback message */}
          {feedbackState === 'correct' && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#58cc02] text-[#131f24] flex items-center justify-center font-black">
                <Check className="w-6 h-6 stroke-[3.5]" />
              </div>
              <div>
                <h3 className="font-black text-base text-[#58cc02]">
                  Chính xác! Xuất sắc lắm! 🎉
                </h3>
                <p className="text-xs text-emerald-300 font-bold">
                  {currentExercise.explanation}
                </p>
              </div>
            </div>
          )}

          {feedbackState === 'wrong' && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ff4b4b] text-white flex items-center justify-center">
                <AlertCircle className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-black text-base text-[#ff4b4b]">
                  Chưa chính xác rồi! 💔
                </h3>
                <p className="text-xs text-red-300 font-bold">
                  {currentExercise.explanation}
                </p>
              </div>
            </div>
          )}

          {feedbackState === 'idle' && <div />}

          {/* Action button */}
          <div className="w-full sm:w-auto">
            {feedbackState === 'idle' ? (
              <button
                disabled={!canCheck()}
                onClick={handleCheckAnswer}
                className={`w-full sm:w-44 py-3.5 px-6 font-black text-sm uppercase rounded-2xl tracking-wider transition-all cursor-pointer ${
                  canCheck()
                    ? 'bg-[#58cc02] hover:bg-[#46a302] text-white border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0'
                    : 'bg-[#37464f] text-[#849299] cursor-not-allowed'
                }`}
              >
                KIỂM TRA
              </button>
            ) : feedbackState === 'correct' ? (
              <button
                onClick={handleNextExercise}
                className="w-full sm:w-44 py-3.5 px-6 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-sm uppercase rounded-2xl border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
              >
                TIẾP TỤC
              </button>
            ) : (
              <button
                onClick={handleNextExercise}
                className="w-full sm:w-44 py-3.5 px-6 bg-[#ff4b4b] hover:bg-[#d63a3a] text-white font-black text-sm uppercase rounded-2xl border-b-4 border-[#d63a3a] active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
              >
                ĐÃ HIỂU
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-black text-white mb-2">
              Bạn muốn thoát bài học?
            </h3>
            <p className="text-xs font-bold text-[#849299] mb-6">
              Mọi tiến trình của bài học hiện tại sẽ không được lưu. Đừng bỏ cuộc nhé!
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-3 bg-[#58cc02] text-white font-black text-xs uppercase rounded-xl border-b-4 border-[#46a302] active:translate-y-1 cursor-pointer"
              >
                TIẾP TỤC HỌC
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onClose();
                }}
                className="w-full py-2.5 text-[#ff4b4b] hover:bg-red-950/30 font-bold text-xs rounded-xl cursor-pointer"
              >
                THOÁT BÀI HỌC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
