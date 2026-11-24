import React from 'react';
import { Shield, Sparkles, ChevronDown, Check } from 'lucide-react';
import { UserStats, Course } from '../types';

interface RightSidebarProps {
  stats: UserStats;
  courses: Course[];
  activeCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onNavigateTab: (tab: 'leaderboard' | 'quests' | 'shop') => void;
  onOpenHeartsRefill: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  stats,
  courses,
  activeCourseId,
  onSelectCourse,
  onNavigateTab,
  onOpenHeartsRefill,
}) => {
  const [showCourseMenu, setShowCourseMenu] = React.useState(false);
  const currentCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  return (
    <aside className="hidden xl:block w-96 p-6 space-y-6 shrink-0 select-none">
      {/* Top Gamification Bar (Flag/Course, Flame Streak, Gems, Hearts) */}
      <div className="flex items-center justify-between font-black text-sm pb-2">
        {/* Course / Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowCourseMenu(!showCourseMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#182730] border-2 border-[#37464f] hover:border-[#1cb0f6] text-white transition-all cursor-pointer"
          >
            <span className="text-xl leading-none">{currentCourse.icon}</span>
            <span className="tabular-nums font-black text-sm text-[#dbe2e6]">
              {currentCourse.units[0]?.unitNumber || 1}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#849299]" />
          </button>

          {showCourseMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowCourseMenu(false)} 
              />
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#182730] border-2 border-[#37464f] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-black uppercase text-[#849299] px-3 py-1.5">
                  Khóa học lập trình
                </div>
                {courses.map((course) => {
                  const isSelected = course.id === activeCourseId;
                  return (
                    <button
                      key={course.id}
                      onClick={() => {
                        onSelectCourse(course.id);
                        setShowCourseMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                        isSelected
                          ? 'bg-[#142c38] text-[#1cb0f6]'
                          : 'hover:bg-[#20343f] text-[#dbe2e6]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{course.icon}</span>
                        <div>
                          <div className="font-black text-xs text-white">{course.name}</div>
                          <div className="text-[10px] text-[#849299] line-clamp-1">
                            {course.tagline}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#1cb0f6]" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Streak Flame */}
        <div 
          title={`Chuỗi ${stats.streak} ngày học liên tiếp`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[#ff9600] hover:bg-[#182730] transition-colors cursor-pointer"
        >
          <span className="text-xl">🔥</span>
          <span className="tabular-nums font-black text-sm">{stats.streak}</span>
        </div>

        {/* Gems */}
        <div 
          title={`${stats.gems} Đá quý`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[#1cb0f6] hover:bg-[#182730] transition-colors cursor-pointer"
        >
          <span className="text-lg">💎</span>
          <span className="tabular-nums font-black text-sm">{stats.gems}</span>
        </div>

        {/* Hearts */}
        <div
          onClick={onOpenHeartsRefill}
          title={stats.hasSuper ? 'Tim vô hạn' : `${stats.hearts}/5 Tim còn lại`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[#ff4b4b] hover:bg-[#182730] transition-colors cursor-pointer"
        >
          {stats.hasSuper ? (
            <>
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-black">∞</span>
            </>
          ) : (
            <>
              <span className="text-lg">❤️</span>
              <span className="tabular-nums font-black text-sm">{stats.hearts}</span>
            </>
          )}
        </div>
      </div>

      {/* Widget 1: Giải đấu Kim Cương (Leaderboard Widget) */}
      <div className="bg-[#131f24] border-2 border-[#37464f] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-white tracking-wide">
            Giải đấu {stats.league}
          </h3>
          <button
            onClick={() => onNavigateTab('leaderboard')}
            className="text-xs font-black uppercase text-[#1cb0f6] hover:brightness-125 tracking-wider transition-colors"
          >
            XEM GIẢI ĐẤU
          </button>
        </div>

        <div className="flex items-start gap-4 pt-1">
          {/* Diamond League Shield */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#2ce2dc] to-[#1cb0f6] p-0.5 flex items-center justify-center shrink-0 shadow-lg">
            <div className="w-full h-full bg-[#16303d] rounded-[14px] flex items-center justify-center text-cyan-300">
              <Shield className="w-8 h-8 fill-cyan-400/30 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-black text-white leading-snug">
              Bạn đã đạt{' '}
              <span className="text-[#58cc02] font-black">
                vị trí thứ {stats.leagueRank}
              </span>
            </p>
            <p className="text-xs text-[#9ca3af] font-semibold leading-relaxed">
              Tiếp tục phấn đấu để giữ vị trí trong top 3!
            </p>
          </div>
        </div>
      </div>

      {/* Widget 2: Nhiệm vụ hằng ngày (Daily Quests Widget) */}
      <div className="bg-[#131f24] border-2 border-[#37464f] rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-white tracking-wide">
            Nhiệm vụ hằng ngày
          </h3>
          <button
            onClick={() => onNavigateTab('quests')}
            className="text-xs font-black uppercase text-[#1cb0f6] hover:brightness-125 tracking-wider transition-colors"
          >
            XEM TẤT CẢ
          </button>
        </div>

        <div className="space-y-4 pt-1">
          {/* Quest 1 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-xl shrink-0">
              ⚡
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="text-xs font-black text-white">Kiếm 30 KN</div>
              <div className="relative w-full h-5 bg-[#37464f] rounded-full overflow-hidden flex items-center">
                <div 
                  className="h-full bg-[#ffc800] rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (stats.xp / 30) * 100)}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#131f24]">
                  {Math.min(30, stats.xp)} / 30
                </span>
                <span className="absolute right-1 text-xs">📦</span>
              </div>
            </div>
          </div>

          {/* Quest 2 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
              🦉
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="text-xs font-black text-white">
                Làm đúng 5 câu liên tiếp trong 2 bài học
              </div>
              <div className="relative w-full h-5 bg-[#37464f] rounded-full overflow-hidden flex items-center">
                <div 
                  className="h-full bg-[#ffc800] rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (stats.completedLessonIds.length / 2) * 100)}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#131f24]">
                  {Math.min(2, stats.completedLessonIds.length)} / 2
                </span>
                <span className="absolute right-1 text-xs">📦</span>
              </div>
            </div>
          </div>

          {/* Quest 3 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl shrink-0">
              ⏱️
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="text-xs font-black text-white">Học trong 15 phút</div>
              <div className="relative w-full h-5 bg-[#37464f] rounded-full overflow-hidden flex items-center">
                <div 
                  className="h-full bg-[#ffc800] rounded-full transition-all duration-500" 
                  style={{ width: '100%' }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#131f24]">
                  15 / 15
                </span>
                <span className="absolute right-1 text-xs">📦</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links (Exactly matching Duolingo screenshot) */}
      <footer className="pt-2 text-center text-[11px] font-bold uppercase tracking-wider text-[#6c7c85] leading-loose">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          <span className="hover:text-[#9ca3af] cursor-pointer">GIỚI THIỆU</span>
          <span className="hover:text-[#9ca3af] cursor-pointer">CỬA HÀNG</span>
          <span className="hover:text-[#9ca3af] cursor-pointer">TÍNH HIỆU QUẢ</span>
          <span className="hover:text-[#9ca3af] cursor-pointer">CÔNG VIỆC</span>
          <span className="hover:text-[#9ca3af] cursor-pointer">NHÀ ĐẦU TƯ</span>
          <span className="hover:text-[#9ca3af] cursor-pointer">ĐIỀU KHOẢN</span>
          <span className="hover:text-[#9ca3af] cursor-pointer">BẢO MẬT</span>
        </div>
      </footer>
    </aside>
  );
};
