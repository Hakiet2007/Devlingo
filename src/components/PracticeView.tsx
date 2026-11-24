import React from 'react';
import { Dumbbell, Heart, Zap, Sparkles, BookOpen } from 'lucide-react';
import { Course, UserStats } from '../types';
import { soundEffects } from '../utils/audio';

interface PracticeViewProps {
  stats: UserStats;
  course: Course;
  onPracticeForHeart: () => void;
  onQuickQuiz: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  stats,
  course,
  onPracticeForHeart,
  onQuickQuiz,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 pb-28 md:pb-16 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Trung Tâm Luyện Tập
          </h1>
          <p className="text-xs md:text-sm font-bold text-[#849299] mt-1">
            Củng cố kỹ năng code và nạp lại tim miễn phí
          </p>
        </div>
        <div className="p-3 bg-[#142c38] text-[#1cb0f6] rounded-2xl border-2 border-[#1cb0f6]">
          <Dumbbell className="w-8 h-8" />
        </div>
      </div>

      {/* Practice Cards */}
      <div className="space-y-4">
        {/* Heart Practice */}
        <div className="p-6 bg-[#182730] border-2 border-[#37464f] hover:border-[#ff4b4b] rounded-3xl transition-all shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-[#ff4b4b] flex items-center justify-center text-3xl shrink-0">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                Luyện Tập Hồi Tim
              </h3>
              <p className="text-xs text-[#849299] font-semibold mt-0.5">
                Trả lời đúng các câu đố nhanh để hồi phục +1 Tim ❤️ mà không tốn Đá quý
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playCorrect();
              onPracticeForHeart();
            }}
            disabled={stats.hearts >= stats.maxHearts}
            className="w-full py-3.5 bg-[#ff4b4b] hover:bg-[#d33131] text-white font-black text-xs uppercase tracking-wider rounded-2xl border-b-4 border-[#b52626] active:translate-y-1 active:border-b-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {stats.hearts >= stats.maxHearts ? 'TIM ĐÃ ĐẦY' : 'HỒI PHỤC +1 TIM ❤️'}
          </button>
        </div>

        {/* Speed Quiz */}
        <div className="p-6 bg-[#182730] border-2 border-[#37464f] hover:border-[#ffc800] rounded-3xl transition-all shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-[#ffc800] flex items-center justify-center text-3xl shrink-0">
              <Zap className="w-8 h-8 fill-current" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                Thử Thách Tốc Độ (Speed Code)
              </h3>
              <p className="text-xs text-[#849299] font-semibold mt-0.5">
                Kiểm tra phản xạ nhận diện cú pháp trong 60 giây để kiếm thêm +20 KN
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playPop();
              onQuickQuiz();
            }}
            className="w-full py-3.5 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase tracking-wider rounded-2xl border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
          >
            BẮT ĐẦU LUYỆN TẬP
          </button>
        </div>

        {/* Mistakes Review */}
        <div className="p-6 bg-[#182730] border-2 border-[#37464f] rounded-3xl opacity-75">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-3xl shrink-0">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                Kho Lỗi Sai (Mistakes Hub)
              </h3>
              <p className="text-xs text-[#849299] font-semibold mt-0.5">
                Tập trung luyện lại các câu bạn đã từng trả lời sai
              </p>
            </div>
          </div>
          <div className="text-[11px] font-black text-purple-400 uppercase tracking-wider">
            {stats.hasSuper ? 'ĐÃ MỞ KHÓA DÀNH CHO SUPER' : 'YÊU CẦU SUPER DUOLINGO'}
          </div>
        </div>
      </div>
    </div>
  );
};
