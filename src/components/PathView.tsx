import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Check, 
  Star, 
  Lock, 
  Trophy, 
  ArrowDown, 
  Play,
  Dumbbell,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Section, Lesson, Unit } from '../types';
import { soundEffects } from '../utils/audio';
import { DuoMascot } from './DuoMascot';

const DUO_QUOTES = [
  "Cố lên coder! Hoàn thành bài học hôm nay để giữ streak 🔥",
  "Mỗi ngày một ít, chinh phục code đỉnh chóp! 💻",
  "Quác quác! Viết code không khó, có duoIingo lo! 🦉",
  "Bạn đang làm rất xuất sắc! Giữ vững streak nhé! ⭐",
  "Đừng ngại thử sai, bug sinh ra là để ta fix! 🛠️",
  "Vượt qua Cửa này để rinh cúp vàng vinh danh! 🏆",
];

interface PathViewProps {
  section: Section;
  currentDoorNumber: number;
  completedLessonIds: string[];
  claimedChestIds: string[];
  dailyCompletedIds: string[];
  onSelectDoor: (doorNum: number) => void;
  onOpenSectionDrawer: () => void;
  onStartLesson: (lesson: Lesson, unit: Unit) => void;
  onOpenGuidebook: (unit: Unit) => void;
  onClaimChestBonus: (chestId: string) => void;
}

export const PathView: React.FC<PathViewProps> = ({
  section,
  currentDoorNumber,
  completedLessonIds,
  claimedChestIds,
  dailyCompletedIds,
  onSelectDoor,
  onOpenSectionDrawer,
  onStartLesson,
  onOpenGuidebook,
  onClaimChestBonus,
}) => {
  const [selectedStoneLesson, setSelectedStoneLesson] = useState<{
    lesson: Lesson;
    unit: Unit;
    index: number;
  } | null>(null);

  const [warningModal, setWarningModal] = useState<{
    title: string;
    message: string;
    icon?: string;
  } | null>(null);

  const [showDoorListModal, setShowDoorListModal] = useState(false);
  const [duoQuoteIndex, setDuoQuoteIndex] = useState(0);

  const cycleDuoQuote = () => {
    soundEffects.playPop();
    setDuoQuoteIndex((prev) => (prev + 1) % DUO_QUOTES.length);
  };

  // Daily reset countdown timer for Section 9
  const [timeLeft, setTimeLeft] = useState({ hours: 19, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isDailySpecial = section.isDailySpecial;

  // Active unit/door:
  const activeDoorIndex = Math.max(0, Math.min(section.doors.length - 1, currentDoorNumber - 1));
  const currentUnit = section.doors[activeDoorIndex] || section.doors[0];

  // Helper: check if a specific door is unlocked
  // Door 1 is always unlocked. Door K (K > 1) is unlocked iff ALL previous doors 1..(K-1) have all lessons finished
  const isDoorUnlocked = (doorNum: number): boolean => {
    if (doorNum <= 1) return true;
    for (let i = 0; i < doorNum - 1; i++) {
      const door = section.doors[i];
      if (!door) continue;
      const isDone = door.lessons.every((lesson) => completedLessonIds.includes(lesson.id));
      if (!isDone) return false;
    }
    return true;
  };

  const isCurrentDoorCompleted = currentUnit?.lessons.every((l) =>
    completedLessonIds.includes(l.id)
  );

  const isNextDoorUnlocked = currentDoorNumber < section.doorsCount && isDoorUnlocked(currentDoorNumber + 1);

  // Chest gating:
  const chestId = `${currentUnit?.id}_chest_1`;
  const isChest1Unlocked = completedLessonIds.includes(currentUnit?.lessons[0]?.id || '') ||
    (isDailySpecial && dailyCompletedIds.length >= 3);
  const isChest1Claimed = claimedChestIds.includes(chestId);

  const handleChestClick = () => {
    if (isChest1Claimed) {
      soundEffects.playPop();
      setWarningModal({
        title: 'Rương Thưởng',
        message: 'Bạn đã mở và nhận quà từ rương này rồi!',
        icon: '🎁',
      });
      return;
    }

    if (!isChest1Unlocked) {
      soundEffects.playWrong();
      setWarningModal({
        title: 'Rương Đang Khóa',
        message: isDailySpecial
          ? 'Rương đang khóa! Bạn cần hoàn thành ít nhất 3 bài học hôm nay để mở rương nhận thưởng.'
          : 'Rương đang bị khóa! Bạn phải hoàn thành Bài 1 trước mới được mở rương nhận thưởng.',
        icon: '🔒',
      });
      return;
    }

    soundEffects.playCorrect();
    onClaimChestBonus(chestId);
  };

  const handleNextDoorClick = () => {
    if (currentDoorNumber >= section.doorsCount) return;

    if (!isNextDoorUnlocked) {
      soundEffects.playWrong();
      setWarningModal({
        title: 'Cửa Tiếp Theo Đang Khóa',
        message: `Bạn phải hoàn thành tất cả các bài học ở Cửa ${currentDoorNumber} trước mới được sang Cửa ${currentDoorNumber + 1}!`,
        icon: '🔒',
      });
      return;
    }

    soundEffects.playPop();
    onSelectDoor(currentDoorNumber + 1);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6 px-4 flex flex-col items-center select-none pb-28 md:pb-16 relative">
      {/* Top Banner (Clickable to switch between 9 Phần) */}
      <div 
        style={{ backgroundColor: section.color }}
        className="w-full rounded-3xl p-5 text-white shadow-xl mb-6 relative overflow-hidden border-b-4 border-black/20"
      >
        <div className="flex items-center justify-between gap-4">
          <div 
            onClick={onOpenSectionDrawer}
            className="cursor-pointer group flex-1"
          >
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white/90 mb-1 group-hover:underline">
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>
                PHẦN {section.sectionNumber}, {isDailySpecial ? 'BÀI MỚI MỖI NGÀY' : `CỬA ${currentDoorNumber}/${section.doorsCount}`}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white leading-tight">
              {currentUnit?.title.replace(/^Chương \d+:\s*/, '') || section.title}
            </h1>
          </div>

          {/* Guidebook Button */}
          <button
            onClick={() => {
              soundEffects.playPop();
              if (currentUnit) onOpenGuidebook(currentUnit);
            }}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-black/20 hover:bg-black/30 rounded-2xl text-white font-black text-xs uppercase tracking-wider border-b-4 border-black/30 active:translate-y-1 active:border-b-0 transition-all shadow-md cursor-pointer"
          >
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
            <span>HƯỚNG DẪN</span>
          </button>
        </div>

        {/* Section 9 Daily Reset Countdown Bar */}
        {isDailySpecial && (
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-black">
            <span className="flex items-center gap-1.5 text-yellow-200">
              <Clock className="w-4 h-4" />
              <span>Làm mới sau: {timeLeft.hours}g {timeLeft.minutes}p {timeLeft.seconds}s</span>
            </span>
            <span className="bg-white/20 px-2.5 py-1 rounded-xl">
              Hôm nay: {dailyCompletedIds.length}/6 bài
            </span>
          </div>
        )}
      </div>

      {/* Door Navigator Pill (For navigating across 21 Doors in the section) */}
      {!isDailySpecial && section.doorsCount > 1 && (
        <div className="w-full mb-6 flex items-center justify-between bg-[#182730] border-2 border-[#37464f] p-2 rounded-2xl">
          <button
            onClick={() => {
              soundEffects.playPop();
              onSelectDoor(Math.max(1, currentDoorNumber - 1));
            }}
            disabled={currentDoorNumber <= 1}
            className="px-3 py-1.5 rounded-xl text-xs font-black text-white hover:bg-[#20343f] disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Cửa trước
          </button>

          <button 
            onClick={() => {
              soundEffects.playPop();
              setShowDoorListModal(true);
            }}
            className="text-xs font-black text-amber-400 uppercase tracking-wider cursor-pointer hover:underline text-center px-2 py-1 rounded-lg hover:bg-[#20343f] transition-colors"
          >
            Cửa {currentDoorNumber} / {section.doorsCount}
            {isCurrentDoorCompleted ? (
              <span className="ml-1.5 text-emerald-400">✓ Xong</span>
            ) : (
              <span className="ml-1.5 text-gray-400">⏳ Đang học</span>
            )}
          </button>

          <button
            onClick={handleNextDoorClick}
            disabled={currentDoorNumber >= section.doorsCount}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${
              currentDoorNumber >= section.doorsCount
                ? 'opacity-30 cursor-not-allowed text-white'
                : isNextDoorUnlocked
                ? 'text-white hover:bg-[#20343f]'
                : 'text-gray-400 hover:text-white bg-[#131f24] border border-[#263238]'
            }`}
          >
            {!isNextDoorUnlocked && currentDoorNumber < section.doorsCount && (
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Cửa kế</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Milestone Trophy */}
      <div className="flex flex-col items-center mb-6">
        <button
          onClick={() => {
            soundEffects.playPop();
            if (isCurrentDoorCompleted) {
              soundEffects.playFanfare();
              setWarningModal({
                title: `Cửa ${currentDoorNumber} Đã Hoàn Thành!`,
                message: currentDoorNumber < section.doorsCount
                  ? `Xuất sắc! Bạn đã vượt qua tất cả bài học của Cửa ${currentDoorNumber}. Hãy sẵn sàng cho Cửa ${currentDoorNumber + 1}!`
                  : `Chúc mừng bạn đã hoàn thành trọn vẹn toàn bộ các cửa ở Phần ${section.sectionNumber}!`,
                icon: '🏆',
              });
            } else {
              setWarningModal({
                title: `Mục Tiêu Cửa ${currentDoorNumber}`,
                message: `Hoàn thành cả 3 bài học để mở khóa cúp vinh danh và mở Cửa ${currentDoorNumber + 1}!`,
                icon: '🎯',
              });
            }
          }}
          style={{ backgroundColor: isCurrentDoorCompleted ? '#ffc800' : section.color }}
          className={`w-16 h-16 rounded-full border-b-[6px] border-black/20 flex items-center justify-center text-white shadow-lg transition-all group cursor-pointer ${
            isCurrentDoorCompleted ? 'ring-4 ring-amber-400/40 animate-pulse' : 'hover:scale-105 active:translate-y-1'
          }`}
        >
          <Trophy className="w-8 h-8 fill-white stroke-[2] group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Center Divider Line with subtitle */}
      <div className="w-full relative flex items-center justify-center my-6">
        <div className="w-full border-t-2 border-[#37464f]" />
        <span className="absolute bg-[#131f24] px-4 text-xs font-black tracking-wide text-[#849299]">
          {isDailySpecial ? 'Bộ 6 bài học thử thách hằng ngày' : `Lộ trình Cửa ${currentDoorNumber} - Hoàn thành theo thứ tự`}
        </span>
      </div>

      {/* Mobile Duo encouragement companion banner */}
      <div className="sm:hidden w-full flex items-center gap-3 bg-[#182730] border-2 border-[#37464f] p-3 rounded-2xl mb-4 shadow-md">
        <div className="w-14 h-14 shrink-0">
          <DuoMascot
            size={56}
            pose={isCurrentDoorCompleted ? 'celebrating' : 'waving'}
            interactive={true}
            onBubbleClick={cycleDuoQuote}
          />
        </div>
        <div className="flex-1 cursor-pointer" onClick={cycleDuoQuote}>
          <p className="text-xs font-black text-white leading-snug">
            {DUO_QUOTES[duoQuoteIndex]}
          </p>
          <span className="text-[10px] font-black text-[#58cc02] uppercase tracking-wider">
            Chạm vào Duo để nghe cổ vũ 💡
          </span>
        </div>
      </div>

      {/* Stepping Stones Path Container */}
      <div className="w-full relative flex flex-col items-center gap-6 mt-4">
        {/* Authentic Duolingo Owl Mascot perched on the right side of the lesson path */}
        <div className="absolute -right-2 sm:-right-6 md:-right-16 lg:-right-24 top-12 z-20 hidden sm:flex flex-col items-center">
          <DuoMascot
            size={165}
            pose={isCurrentDoorCompleted ? 'celebrating' : 'waving'}
            speechBubble={DUO_QUOTES[duoQuoteIndex]}
            onBubbleClick={cycleDuoQuote}
            interactive={true}
          />
        </div>

        {/* Section 9 (Daily Special with 6 lessons!): strict linear progression */}
        {isDailySpecial ? (
          currentUnit?.lessons.map((lesson, idx) => {
            const isDone = dailyCompletedIds.includes(lesson.id);
            // Strict check: Lesson idx is unlocked iff idx === 0 or previous lesson is done!
            const isUnlocked = idx === 0 || dailyCompletedIds.includes(currentUnit.lessons[idx - 1]?.id || '');
            const isActive = isUnlocked && !isDone;
            const dailyOffsets = ['-translate-x-6', 'translate-x-5', 'translate-x-9', '-translate-x-5', '-translate-x-9', 'translate-x-0'];
            const stoneOffset = dailyOffsets[idx % dailyOffsets.length];

            return (
              <React.Fragment key={lesson.id}>
                {/* Treasure Chest inserted after Lesson 3 */}
                {idx === 3 && (
                  <div className="relative flex flex-col items-center my-1">
                    <button
                      onClick={handleChestClick}
                      className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl transition-all cursor-pointer ${
                        isChest1Claimed
                          ? 'bg-[#37464f] border-b-[8px] border-[#263238] opacity-60'
                          : isChest1Unlocked
                          ? 'bg-[#ffc800] border-b-[8px] border-[#e5b400] hover:scale-105 active:translate-y-1 ring-4 ring-amber-400/40 animate-bounce'
                          : 'bg-[#2a3840] border-b-[8px] border-[#1d272d] opacity-75'
                      }`}
                    >
                      {isChest1Claimed ? '🎁' : isChest1Unlocked ? '📦' : <Lock className="w-7 h-7 text-amber-300" />}
                    </button>
                    <span className="text-[10px] font-black uppercase mt-1 tracking-wider text-amber-400">
                      {isChest1Claimed ? 'Đã nhận thưởng' : isChest1Unlocked ? 'Mở rương (+20 💎)' : 'Khóa (Đạt 3 bài)'}
                    </span>
                  </div>
                )}

                <div className={`relative flex flex-col items-center transition-transform ${stoneOffset}`}>
                  {/* Floating BẮT ĐẦU badge */}
                  {isActive && (
                    <div className="absolute -top-10 animate-bounce z-10">
                      <div className="bg-[#142c38] text-[#58cc02] px-3.5 py-1 rounded-2xl font-black text-xs tracking-wider uppercase border-2 border-[#58cc02] shadow-lg flex items-center gap-1">
                        <span>BẮT ĐẦU</span>
                      </div>
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#58cc02] mx-auto -mt-0.5" />
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (isUnlocked) {
                        soundEffects.playPop();
                        setSelectedStoneLesson({ lesson, unit: currentUnit, index: idx + 1 });
                      } else {
                        soundEffects.playWrong();
                        setWarningModal({
                          title: 'Bài Học Đang Khóa',
                          message: `Bạn phải hoàn thành Bài ${idx} trước mới học tiếp được Bài ${idx + 1}!`,
                          icon: '🔒',
                        });
                      }
                    }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isDone
                        ? 'bg-[#58cc02] border-b-[8px] border-[#46a302] text-white shadow-xl active:translate-y-1'
                        : isUnlocked
                        ? 'bg-[#58cc02] border-b-[8px] border-[#46a302] text-white shadow-2xl ring-4 ring-[#58cc02]/30 active:translate-y-1'
                        : 'bg-[#20343f] border-b-[8px] border-[#15232a] text-[#849299]'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-10 h-10 stroke-[3.5] text-white" />
                    ) : isUnlocked ? (
                      <Star className="w-10 h-10 fill-current text-white animate-pulse" />
                    ) : (
                      <Lock className="w-8 h-8 stroke-[2.5]" />
                    )}
                  </button>

                  <div className="mt-1 text-center max-w-[120px]">
                    <span className="text-[11px] font-black text-[#dbe2e6] line-clamp-1">
                      {lesson.title.split(':')[1] || lesson.title}
                    </span>
                  </div>

                  {/* Popover */}
                  {selectedStoneLesson?.lesson.id === lesson.id && (
                    <div className="absolute top-full mt-3 z-30 animate-in fade-in zoom-in-95 w-64 bg-[#182730] border-2 border-[#37464f] rounded-3xl p-4 shadow-2xl text-center">
                      <div className="text-[11px] font-black uppercase text-[#1cb0f6] mb-1">
                        BÀI HỌC HÔM NAY · {idx + 1}/6
                      </div>
                      <p className="text-xs font-bold text-[#dbe2e6] mb-4">
                        {lesson.description}
                      </p>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            onStartLesson(lesson, currentUnit);
                            setSelectedStoneLesson(null);
                          }}
                          className="w-full py-3 px-4 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase tracking-wider rounded-2xl border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>{isDone ? 'ÔN TẬP +5 KN' : `BẮT ĐẦU +${lesson.xpReward} KN`}</span>
                        </button>
                        <button
                          onClick={() => setSelectedStoneLesson(null)}
                          className="text-[11px] font-bold text-[#849299] hover:text-white cursor-pointer"
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })
        ) : (
          /* Normal Sections (Phần 1 - Phần 8): Strict Progression for Lesson 1 -> Chest -> Lesson 2 -> Lesson 3 -> Door Completion */
          <>
            {/* Stone 1: Lesson 1 (Always unlocked in this door) */}
            {currentUnit?.lessons[0] && (() => {
              const lesson = currentUnit.lessons[0];
              const isDone = completedLessonIds.includes(lesson.id);

              return (
                <div className="relative flex flex-col items-center -translate-x-6">
                  {!isDone && (
                    <div className="absolute -top-10 animate-bounce z-10">
                      <div className="bg-[#142c38] text-[#58cc02] px-3.5 py-1 rounded-2xl font-black text-xs tracking-wider uppercase border-2 border-[#58cc02] shadow-lg flex items-center gap-1">
                        <span>BẮT ĐẦU</span>
                      </div>
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#58cc02] mx-auto -mt-0.5" />
                    </div>
                  )}

                  <button
                    onClick={() => {
                      soundEffects.playPop();
                      setSelectedStoneLesson({ lesson, unit: currentUnit, index: 1 });
                    }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isDone
                        ? 'bg-[#58cc02] border-b-[8px] border-[#46a302] text-white shadow-xl active:translate-y-1 active:border-b-2'
                        : 'bg-[#58cc02] border-b-[8px] border-[#46a302] text-white shadow-xl ring-4 ring-[#58cc02]/30 active:translate-y-1 active:border-b-2'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-10 h-10 stroke-[3.5] text-white" />
                    ) : (
                      <Star className="w-10 h-10 fill-current text-white animate-pulse" />
                    )}
                  </button>

                  <div className="mt-1 text-center max-w-[130px]">
                    <span className="text-[11px] font-black text-[#dbe2e6] line-clamp-1">
                      Bài 1: {lesson.title}
                    </span>
                  </div>

                  {/* Popover */}
                  {selectedStoneLesson?.lesson.id === lesson.id && (
                    <div className="absolute top-full mt-3 z-30 animate-in fade-in zoom-in-95 w-64 bg-[#182730] border-2 border-[#37464f] rounded-3xl p-4 shadow-2xl text-center">
                      <div className="text-[11px] font-black uppercase text-[#1cb0f6] mb-1">
                        CẤP ĐỘ 1/3 · {lesson.title}
                      </div>
                      <p className="text-xs font-bold text-[#dbe2e6] mb-4">
                        {lesson.description}
                      </p>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            onStartLesson(lesson, currentUnit);
                            setSelectedStoneLesson(null);
                          }}
                          className="w-full py-3 px-4 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase tracking-wider rounded-2xl border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>{isDone ? 'ÔN TẬP +5 KN' : `BẮT ĐẦU +${lesson.xpReward} KN`}</span>
                        </button>
                        <button
                          onClick={() => setSelectedStoneLesson(null)}
                          className="text-[11px] font-bold text-[#849299] hover:text-white cursor-pointer"
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Treasure Chest (Strictly Unlocked only after Stone 1 is done!) */}
            <div className="relative flex flex-col items-center my-1 translate-x-4">
              <button
                onClick={handleChestClick}
                className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl transition-all cursor-pointer group relative ${
                  isChest1Claimed
                    ? 'bg-[#37464f] border-b-[8px] border-[#263238] opacity-60'
                    : isChest1Unlocked
                    ? 'bg-[#ffc800] border-b-[8px] border-[#e5b400] hover:scale-105 active:translate-y-1 active:border-b-2 ring-4 ring-amber-400/40 animate-bounce'
                    : 'bg-[#2a3840] border-b-[8px] border-[#1d272d] opacity-75'
                }`}
              >
                {isChest1Claimed ? (
                  <span className="text-2xl">🎁</span>
                ) : isChest1Unlocked ? (
                  <span className="group-hover:rotate-12 transition-transform">📦</span>
                ) : (
                  <div className="relative flex items-center justify-center">
                    <span className="filter grayscale opacity-60">📦</span>
                    <Lock className="w-6 h-6 text-amber-300 absolute -top-1 -right-2 drop-shadow" />
                  </div>
                )}
              </button>

              <span className={`text-[10px] font-black uppercase mt-1 tracking-wider ${
                isChest1Claimed
                  ? 'text-gray-400'
                  : isChest1Unlocked
                  ? 'text-[#ffc800] animate-pulse'
                  : 'text-[#849299]'
              }`}>
                {isChest1Claimed ? 'Đã nhận thưởng' : isChest1Unlocked ? 'Mở rương (+20 💎)' : 'Khóa (Cần Bài 1)'}
              </span>
            </div>

            {/* Stone 2: Lesson 2 (Strictly Unlocked only if Lesson 1 is completed!) */}
            {currentUnit?.lessons[1] && (() => {
              const lesson = currentUnit.lessons[1];
              const isDone = completedLessonIds.includes(lesson.id);
              const isUnlocked = completedLessonIds.includes(currentUnit.lessons[0].id);

              return (
                <div className="relative flex flex-col items-center mt-2 translate-x-8">
                  {isUnlocked && !isDone && (
                    <div className="absolute -top-10 animate-bounce z-10">
                      <div className="bg-[#142c38] text-[#58cc02] px-3.5 py-1 rounded-2xl font-black text-xs tracking-wider uppercase border-2 border-[#58cc02] shadow-lg flex items-center gap-1">
                        <span>BẮT ĐẦU</span>
                      </div>
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#58cc02] mx-auto -mt-0.5" />
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (isUnlocked) {
                        soundEffects.playPop();
                        setSelectedStoneLesson({ lesson, unit: currentUnit, index: 2 });
                      } else {
                        soundEffects.playWrong();
                        setWarningModal({
                          title: 'Bài Học Đang Khóa',
                          message: 'Bạn phải hoàn thành Bài 1 trước mới học tiếp được Bài 2!',
                          icon: '🔒',
                        });
                      }
                    }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isDone
                        ? 'bg-[#58cc02] border-b-[8px] border-[#46a302] text-white shadow-xl active:translate-y-1 active:border-b-2'
                        : isUnlocked
                        ? 'bg-[#58cc02] border-b-[8px] border-[#46a302] text-white shadow-2xl ring-4 ring-[#58cc02]/30 active:translate-y-1 active:border-b-2'
                        : 'bg-[#20343f] border-b-[8px] border-[#15232a] text-[#849299]'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-10 h-10 stroke-[3.5] text-white" />
                    ) : isUnlocked ? (
                      <Star className="w-10 h-10 fill-current text-white animate-pulse" />
                    ) : (
                      <Lock className="w-8 h-8 stroke-[2.5]" />
                    )}
                  </button>

                  <div className="mt-1 text-center max-w-[130px]">
                    <span className="text-[11px] font-black text-[#dbe2e6] line-clamp-1">
                      Bài 2: {lesson.title}
                    </span>
                  </div>

                  {/* Popover */}
                  {selectedStoneLesson?.lesson.id === lesson.id && (
                    <div className="absolute top-full mt-3 z-30 animate-in fade-in zoom-in-95 w-64 bg-[#182730] border-2 border-[#37464f] rounded-3xl p-4 shadow-2xl text-center">
                      <div className="text-[11px] font-black uppercase text-[#1cb0f6] mb-1">
                        CẤP ĐỘ 2/3 · {lesson.title}
                      </div>
                      <p className="text-xs font-bold text-[#dbe2e6] mb-4">
                        {lesson.description}
                      </p>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            onStartLesson(lesson, currentUnit);
                            setSelectedStoneLesson(null);
                          }}
                          className="w-full py-3 px-4 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase tracking-wider rounded-2xl border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>{isDone ? 'ÔN TẬP +5 KN' : `BẮT ĐẦU +${lesson.xpReward} KN`}</span>
                        </button>
                        <button
                          onClick={() => setSelectedStoneLesson(null)}
                          className="text-[11px] font-bold text-[#849299] hover:text-white cursor-pointer"
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Stone 3: Lesson 3 (Gym / Luyện Tập Thể Lực Code) - Strictly Unlocked only if Lesson 2 is completed! */}
            {currentUnit?.lessons[2] && (() => {
              const lesson = currentUnit.lessons[2];
              const isDone = completedLessonIds.includes(lesson.id);
              const isUnlocked = completedLessonIds.includes(currentUnit.lessons[1].id);

              return (
                <div className="relative flex flex-col items-center mt-2">
                  {isUnlocked && !isDone && (
                    <div className="absolute -top-10 animate-bounce z-10">
                      <div className="bg-[#142c38] text-[#58cc02] px-3.5 py-1 rounded-2xl font-black text-xs tracking-wider uppercase border-2 border-[#58cc02] shadow-lg flex items-center gap-1">
                        <span>BẮT ĐẦU</span>
                      </div>
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#58cc02] mx-auto -mt-0.5" />
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (isUnlocked) {
                        soundEffects.playPop();
                        setSelectedStoneLesson({ lesson, unit: currentUnit, index: 3 });
                      } else {
                        soundEffects.playWrong();
                        setWarningModal({
                          title: 'Thử Thách Thể Lực Code Đang Khóa',
                          message: 'Bạn phải hoàn thành Bài 2 trước mới mở khóa phần luyện tập thể lực code này!',
                          icon: '🔒',
                        });
                      }
                    }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isDone
                        ? 'bg-[#58cc02] border-b-[8px] border-[#46a302] text-white shadow-xl active:translate-y-1 active:border-b-2'
                        : isUnlocked
                        ? 'bg-[#58cc02] border-b-[8px] border-[#46a302] text-white shadow-2xl ring-4 ring-[#58cc02]/30 active:translate-y-1 active:border-b-2'
                        : 'bg-[#20343f] border-b-[8px] border-[#15232a] text-[#849299]'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-10 h-10 stroke-[3.5] text-white" />
                    ) : isUnlocked ? (
                      <Dumbbell className="w-9 h-9 stroke-[2.5] text-white animate-pulse" />
                    ) : (
                      <Lock className="w-8 h-8 stroke-[2.5]" />
                    )}
                  </button>

                  <div className="mt-1 text-center max-w-[130px]">
                    <span className="text-[11px] font-black text-[#dbe2e6] line-clamp-1">
                      Bài 3: Thể lực Code
                    </span>
                  </div>

                  {/* Popover */}
                  {selectedStoneLesson?.lesson.id === lesson.id && (
                    <div className="absolute top-full mt-3 z-30 animate-in fade-in zoom-in-95 w-64 bg-[#182730] border-2 border-[#37464f] rounded-3xl p-4 shadow-2xl text-center">
                      <div className="text-[11px] font-black uppercase text-[#1cb0f6] mb-1">
                        CẤP ĐỘ 3/3 · THỂ LỰC CODE
                      </div>
                      <p className="text-xs font-bold text-[#dbe2e6] mb-4">
                        {lesson.description}
                      </p>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            onStartLesson(lesson, currentUnit);
                            setSelectedStoneLesson(null);
                          }}
                          className="w-full py-3 px-4 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase tracking-wider rounded-2xl border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>{isDone ? 'ÔN TẬP +5 KN' : `BẮT ĐẦU +${lesson.xpReward} KN`}</span>
                        </button>
                        <button
                          onClick={() => setSelectedStoneLesson(null)}
                          className="text-[11px] font-bold text-[#849299] hover:text-white cursor-pointer"
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Stone 4: Unit Milestone Checkpoint (Unlocked only when all 3 lessons are completed!) */}
            <div className="relative flex flex-col items-center mt-2">
              <button
                onClick={() => {
                  if (isCurrentDoorCompleted) {
                    soundEffects.playFanfare();
                    if (currentDoorNumber < section.doorsCount) {
                      setWarningModal({
                        title: `Chúc Mừng! Vượt Cửa ${currentDoorNumber}`,
                        message: `Bạn đã xuất sắc hoàn thành tất cả các bài học ở Cửa ${currentDoorNumber}! Bạn đã sẵn sàng mở Cửa ${currentDoorNumber + 1}!`,
                        icon: '🏆',
                      });
                    } else {
                      setWarningModal({
                        title: `Hoàn Tất Phần ${section.sectionNumber}!`,
                        message: `Tuyệt vời! Bạn đã hoàn thành toàn bộ ${section.doorsCount} cửa thử thách của Phần này. Hãy chuyển sang Phần tiếp theo!`,
                        icon: '🎉',
                      });
                    }
                  } else {
                    soundEffects.playWrong();
                    setWarningModal({
                      title: 'Cửa Chưa Hoàn Thành',
                      message: `Hãy hoàn thành đủ cả 3 bài học ở Cửa ${currentDoorNumber} trước mới được tính vượt qua cửa và tiến tới Cửa kế tiếp!`,
                      icon: '🔒',
                    });
                  }
                }}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isCurrentDoorCompleted
                    ? 'bg-[#ffc800] border-b-[8px] border-[#e5b400] text-white shadow-2xl ring-4 ring-amber-400/40 active:translate-y-1 animate-pulse'
                    : 'bg-[#20343f] border-b-[8px] border-[#15232a] text-[#849299]'
                }`}
              >
                {isCurrentDoorCompleted ? (
                  <Trophy className="w-9 h-9 fill-white stroke-[2.5]" />
                ) : (
                  <Star className="w-9 h-9 fill-[#37464f] stroke-none" />
                )}
              </button>

              <div className="mt-1 text-center max-w-[130px]">
                <span className={`text-[11px] font-black ${isCurrentDoorCompleted ? 'text-amber-400' : 'text-[#849299]'}`}>
                  {isCurrentDoorCompleted ? `✓ Hoàn thành Cửa ${currentDoorNumber}` : `Mốc Cửa ${currentDoorNumber}`}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Down Arrow Button */}
      <button
        onClick={() => {
          soundEffects.playPop();
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }}
        className="fixed bottom-20 md:bottom-8 right-6 md:right-auto md:ml-[480px] w-12 h-12 rounded-2xl bg-[#142c38] border-2 border-[#37464f] hover:border-[#1cb0f6] text-[#1cb0f6] flex items-center justify-center shadow-2xl active:scale-95 transition-all z-20 cursor-pointer"
        title="Cuộn xuống"
      >
        <ArrowDown className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Duolingo-style Warning / Locked Modal */}
      {warningModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-3xl">
              {warningModal.icon === '🔒' ? (
                <Lock className="w-8 h-8 text-amber-400" />
              ) : (
                warningModal.icon || '📦'
              )}
            </div>
            <h3 className="text-lg font-black text-white mb-2">
              {warningModal.title}
            </h3>
            <p className="text-xs font-bold text-[#849299] mb-6 leading-relaxed">
              {warningModal.message}
            </p>
            <div className="space-y-2">
              {warningModal.icon === '🏆' && currentDoorNumber < section.doorsCount && (
                <button
                  onClick={() => {
                    setWarningModal(null);
                    onSelectDoor(currentDoorNumber + 1);
                  }}
                  className="w-full py-3 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase rounded-xl border-b-4 border-[#46a302] active:translate-y-1 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>TIẾN TỚI CỬA {currentDoorNumber + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setWarningModal(null)}
                className="w-full py-3 bg-[#20343f] hover:bg-[#2b4452] text-white font-black text-xs uppercase rounded-xl border-b-4 border-[#15232a] active:translate-y-1 cursor-pointer"
              >
                ĐÃ HIỂU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Door List Modal (Browse all 21 doors with lock states) */}
      {showDoorListModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl p-5 max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 text-white">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#37464f]">
              <div>
                <h3 className="font-black text-base text-white">
                  Lộ trình Phần {section.sectionNumber} ({section.doorsCount} Cửa)
                </h3>
                <p className="text-xs text-[#849299] font-bold">
                  Hoàn thành từng cửa theo thứ tự để mở khóa
                </p>
              </div>
              <button
                onClick={() => setShowDoorListModal(false)}
                className="p-1.5 rounded-xl bg-[#131f24] hover:bg-[#20343f] text-[#849299] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-3 space-y-2 flex-1 pr-1">
              {section.doors.map((door, idx) => {
                const doorNum = idx + 1;
                const isUnlocked = isDoorUnlocked(doorNum);
                const isDone = door.lessons.every((l) => completedLessonIds.includes(l.id));
                const isCurrent = doorNum === currentDoorNumber;

                return (
                  <div
                    key={door.id}
                    onClick={() => {
                      if (isUnlocked) {
                        soundEffects.playPop();
                        onSelectDoor(doorNum);
                        setShowDoorListModal(false);
                      } else {
                        soundEffects.playWrong();
                        setWarningModal({
                          title: `Cửa ${doorNum} Đang Khóa`,
                          message: `Bạn phải hoàn thành tất cả các bài học ở Cửa ${doorNum - 1} trước mới mở khóa được Cửa ${doorNum}!`,
                          icon: '🔒',
                        });
                      }
                    }}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#142c38] border-[#1cb0f6]'
                        : isDone
                        ? 'bg-[#131f24] border-emerald-500/50 hover:border-emerald-400'
                        : isUnlocked
                        ? 'bg-[#131f24] border-[#37464f] hover:border-[#849299]'
                        : 'bg-[#131f24]/50 border-[#263238] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                        isDone
                          ? 'bg-[#58cc02] text-white'
                          : isCurrent
                          ? 'bg-[#1cb0f6] text-white'
                          : isUnlocked
                          ? 'bg-[#37464f] text-white'
                          : 'bg-[#20343f] text-[#849299]'
                      }`}>
                        {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : isUnlocked ? doorNum : <Lock className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-black text-xs text-white line-clamp-1">
                          Cửa {doorNum}: {door.title.replace(/^Chương \d+:\s*/, '')}
                        </div>
                        <div className="text-[10px] text-[#849299] font-bold">
                          {isDone ? '✓ Đã hoàn thành (3/3 bài)' : isCurrent ? '⏳ Đang học' : isUnlocked ? 'Sẵn sàng học' : '🔒 Đang khóa'}
                        </div>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-black uppercase bg-[#1cb0f6] text-white px-2 py-0.5 rounded">
                        Hiện tại
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t-2 border-[#37464f] flex gap-2">
              <button
                onClick={() => {
                  setShowDoorListModal(false);
                  onOpenSectionDrawer();
                }}
                className="flex-1 py-2.5 bg-[#142c38] hover:bg-[#1a3a4b] text-[#1cb0f6] border border-[#1cb0f6]/40 rounded-xl font-black text-xs uppercase cursor-pointer"
              >
                ĐỔI PHẦN (1-9)
              </button>
              <button
                onClick={() => setShowDoorListModal(false)}
                className="py-2.5 px-4 bg-[#20343f] hover:bg-[#2b4452] text-white rounded-xl font-black text-xs uppercase cursor-pointer"
              >
                ĐÓNG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
