import React from 'react';
import { Target, Gift, Check, Award } from 'lucide-react';
import { UserStats } from '../types';
import { soundEffects } from '../utils/audio';

interface QuestsViewProps {
  stats: UserStats;
  onClaimQuest: (questId: string, rewardGems: number) => void;
}

export const QuestsView: React.FC<QuestsViewProps> = ({ stats, onClaimQuest }) => {
  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 pb-28 md:pb-16 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Nhiệm Vụ Hằng Ngày
          </h1>
          <p className="text-xs md:text-sm font-bold text-[#849299] mt-1">
            Hoàn thành các thử thách code để nhận rương Đá quý 💎
          </p>
        </div>
        <div className="p-3 bg-[#182730] text-[#ff4b4b] rounded-2xl border-2 border-[#37464f]">
          <Target className="w-8 h-8" />
        </div>
      </div>

      {/* Quest Cards */}
      <div className="space-y-4 mb-10">
        {stats.dailyQuests.map((quest) => {
          const isCompleted = quest.progress >= quest.target;
          const pct = Math.min(100, Math.round((quest.progress / quest.target) * 100));

          return (
            <div
              key={quest.id}
              className={`p-5 rounded-3xl border-2 transition-all ${
                quest.claimed
                  ? 'bg-[#182730]/50 border-[#263238] opacity-60'
                  : isCompleted
                  ? 'bg-[#182730] border-amber-400 shadow-lg'
                  : 'bg-[#182730] border-[#37464f]'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                    quest.claimed
                      ? 'bg-gray-800 text-gray-500'
                      : isCompleted
                      ? 'bg-amber-400 text-[#131f24] animate-bounce'
                      : 'bg-amber-400/20 text-amber-400'
                  }`}>
                    {quest.claimed ? <Check className="w-6 h-6" /> : <Gift className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-black text-sm md:text-base text-white">
                      {quest.title}
                    </h3>
                    <span className="text-xs font-bold text-[#849299]">
                      Phần thưởng: +{quest.rewardGems} Đá quý 💎
                    </span>
                  </div>
                </div>

                {/* Claim Button */}
                {isCompleted && !quest.claimed && (
                  <button
                    onClick={() => {
                      soundEffects.playPop();
                      onClaimQuest(quest.id, quest.rewardGems);
                    }}
                    className="py-2 px-4 bg-[#ffc800] hover:bg-[#e5b400] text-[#131f24] font-black text-xs uppercase rounded-xl border-b-4 border-[#e5b400] active:translate-y-1 active:border-b-0 transition-all shrink-0 cursor-pointer"
                  >
                    NHẬN THƯỞNG
                  </button>
                )}

                {quest.claimed && (
                  <span className="text-xs font-black text-[#58cc02] bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-xl">
                    ĐÃ NHẬN
                  </span>
                )}
              </div>

              {/* Progress Bar matching Duolingo yellow bar with chest */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-black text-[#849299]">
                  <span>Tiến độ</span>
                  <span className="tabular-nums">
                    {quest.progress} / {quest.target}
                  </span>
                </div>
                <div className="relative w-full h-5 bg-[#37464f] rounded-full overflow-hidden flex items-center">
                  <div
                    className="h-full bg-[#ffc800] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                  <span className="absolute right-1 text-xs">📦</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badges Section */}
      <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-indigo-400" />
          <h2 className="text-lg font-black text-white">Huy Hiệu Đã Đạt</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-[#131f24] border border-[#37464f] text-center">
            <span className="text-2xl mb-1 block">⚡</span>
            <div className="font-black text-xs text-indigo-300">Khởi Động 3 Ngày</div>
            <div className="text-[10px] text-[#849299] font-bold">Chuỗi streak bền bỉ</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#131f24] border border-[#37464f] text-center">
            <span className="text-2xl mb-1 block">🛡️</span>
            <div className="font-black text-xs text-amber-300">Chiến Binh Kim Cương</div>
            <div className="text-[10px] text-[#849299] font-bold">Top 3 giải đấu</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#131f24] border border-[#37464f] text-center">
            <span className="text-2xl mb-1 block">🐍</span>
            <div className="font-black text-xs text-emerald-300">Bậc Thầy Cú Pháp</div>
            <div className="text-[10px] text-[#849299] font-bold">Hoàn thành bài tập</div>
          </div>
        </div>
      </div>
    </div>
  );
};
