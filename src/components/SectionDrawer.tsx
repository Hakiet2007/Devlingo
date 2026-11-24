import React, { useState } from 'react';
import { X, Check, Clock, ArrowRight, Lock } from 'lucide-react';
import { Section } from '../types';
import { soundEffects } from '../utils/audio';

interface SectionDrawerProps {
  sections: Section[];
  currentSectionNumber: number;
  completedLessonIds: string[];
  onSelectSection: (sectionNum: number) => void;
  onClose: () => void;
  dailyCompletedCount: number;
}

export const SectionDrawer: React.FC<SectionDrawerProps> = ({
  sections,
  currentSectionNumber,
  completedLessonIds,
  onSelectSection,
  onClose,
  dailyCompletedCount,
}) => {
  const [lockedWarning, setLockedWarning] = useState<string | null>(null);

  const isSectionUnlocked = (sec: Section): boolean => {
    if (sec.sectionNumber === 1 || sec.isDailySpecial) return true;
    const prevSec = sections.find((s) => s.sectionNumber === sec.sectionNumber - 1);
    if (!prevSec) return true;
    // Section N is unlocked only if all doors in Section N - 1 are completed
    return prevSec.doors.every((door) =>
      door.lessons.every((lesson) => completedLessonIds.includes(lesson.id))
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl animate-in zoom-in-95 overflow-hidden text-white">
        {/* Header */}
        <div className="p-5 border-b-2 border-[#37464f] flex items-center justify-between bg-[#131f24]">
          <div>
            <h2 className="text-xl font-black text-white">
              Chọn Phần Học (9 Phần)
            </h2>
            <p className="text-xs font-bold text-[#849299]">
              Hoàn thành từng phần theo thứ tự để mở khóa phần tiếp theo
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#182730] hover:bg-[#20343f] text-[#849299] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Section List */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
          {sections.map((sec) => {
            const isSelected = sec.sectionNumber === currentSectionNumber;
            const isDaily = sec.isDailySpecial;
            const unlocked = isSectionUnlocked(sec);

            return (
              <div
                key={sec.id}
                onClick={() => {
                  if (unlocked) {
                    soundEffects.playPop();
                    onSelectSection(sec.sectionNumber);
                    onClose();
                  } else {
                    soundEffects.playWrong();
                    setLockedWarning(
                      `Bạn cần hoàn thành tất cả các bài học ở Phần ${sec.sectionNumber - 1} trước mới mở khóa được Phần này!`
                    );
                  }
                }}
                className={`p-4 rounded-3xl border-2 transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-[#142c38] border-[#1cb0f6] shadow-lg ring-2 ring-[#1cb0f6]/30 cursor-pointer'
                    : !unlocked
                    ? 'bg-[#131f24]/60 border-[#263238] opacity-60 cursor-not-allowed'
                    : isDaily
                    ? 'bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border-purple-500/40 hover:border-purple-400 cursor-pointer'
                    : 'bg-[#131f24] border-[#37464f] hover:border-[#849299] cursor-pointer'
                }`}
              >
                {/* Daily special glowing corner badge */}
                {isDaily && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow">
                    <Clock className="w-3 h-3" />
                    <span>RESET 24H</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Number Box with section color */}
                    <div
                      style={{ backgroundColor: unlocked ? sec.color : '#263238' }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-md shrink-0 relative"
                    >
                      {unlocked ? sec.sectionNumber : <Lock className="w-5 h-5 text-gray-400" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-black text-sm md:text-base ${unlocked ? 'text-white' : 'text-gray-400'}`}>
                          {sec.title}
                        </h3>
                        {isSelected && (
                          <span className="text-[10px] font-black uppercase bg-[#1cb0f6] text-white px-2 py-0.5 rounded-md">
                            ĐANG HỌC
                          </span>
                        )}
                        {!unlocked && (
                          <span className="text-[10px] font-black uppercase bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                            ĐANG KHÓA
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#849299] font-semibold mt-0.5 line-clamp-1">
                        {sec.subtitle}
                      </p>

                      <div className="mt-2 flex items-center gap-3 text-[11px] font-bold">
                        <span className={unlocked ? 'text-amber-400' : 'text-gray-500'}>
                          {isDaily ? '⏱️ 6 bài học hôm nay' : `🚪 ${sec.doorsCount} cửa thử thách`}
                        </span>
                        {isDaily && (
                          <span className="text-emerald-400">
                            Tiến độ: {dailyCompletedCount}/6 bài
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    {isSelected ? (
                      <div className="w-8 h-8 rounded-full bg-[#1cb0f6] text-white flex items-center justify-center">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    ) : !unlocked ? (
                      <div className="w-8 h-8 rounded-full bg-[#182730] text-gray-500 flex items-center justify-center">
                        <Lock className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#182730] text-[#849299] group-hover:text-white flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Locked Section Warning Modal */}
        {lockedWarning && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-3xl">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">
                Phần Học Đang Bị Khóa
              </h3>
              <p className="text-xs font-bold text-[#849299] mb-6 leading-relaxed">
                {lockedWarning}
              </p>
              <button
                onClick={() => setLockedWarning(null)}
                className="w-full py-3 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase rounded-xl border-b-4 border-[#46a302] active:translate-y-1 cursor-pointer"
              >
                ĐÃ HIỂU
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
