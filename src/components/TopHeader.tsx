import React, { useState } from 'react';
import { Flame, Heart, ChevronDown, Check, Plus, ShieldCheck } from 'lucide-react';
import { Course } from '../types';

interface TopHeaderProps {
  courses: Course[];
  activeCourseId: string;
  onSelectCourse: (courseId: string) => void;
  streak: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  hasSuper: boolean;
  onOpenHeartsRefill: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  courses,
  activeCourseId,
  onSelectCourse,
  streak,
  gems,
  hearts,
  maxHearts,
  hasSuper,
  onOpenHeartsRefill,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur border-b-2 border-[#e5e5e5] px-4 md:px-8 py-2.5 z-20 flex items-center justify-between">
      {/* Left: Course Switcher */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-[#e5e5e5] hover:bg-[#f7f7f7] transition-all font-bold text-sm text-[#4b4b4b]"
        >
          <span className="text-xl leading-none">{currentCourse.icon}</span>
          <span className="hidden sm:inline font-extrabold">{currentCourse.name}</span>
          <ChevronDown className="w-4 h-4 text-[#afafaf]" />
        </button>

        {isDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsDropdownOpen(false)} 
            />
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-[#e5e5e5] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-xs font-black uppercase text-[#afafaf] px-3 py-1.5">
                Khóa học của bạn
              </div>
              {courses.map((course) => {
                const isSelected = course.id === activeCourseId;
                return (
                  <button
                    key={course.id}
                    onClick={() => {
                      onSelectCourse(course.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-[#ddf4ff] text-[#1cb0f6]'
                        : 'hover:bg-[#f7f7f7] text-[#4b4b4b]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{course.icon}</span>
                      <div>
                        <div className="font-extrabold text-sm">{course.name}</div>
                        <div className="text-[11px] text-[#777777] line-clamp-1">
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

      {/* Right: Gamification Stats (Streak, Gems, Hearts) */}
      <div className="flex items-center gap-2 sm:gap-4 font-black text-sm">
        {/* Streak */}
        <div 
          title={`Chuỗi ${streak} ngày học liên tiếp`}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[#ff9600] rounded-xl hover:bg-orange-50 transition-colors cursor-pointer"
        >
          <Flame className="w-5 h-5 fill-current animate-pulse text-[#ff9600]" />
          <span className="tabular-nums text-base">{streak}</span>
        </div>

        {/* Gems */}
        <div 
          title={`${gems} Đá quý (Gems)`}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[#1cb0f6] rounded-xl hover:bg-cyan-50 transition-colors cursor-pointer"
        >
          <span className="text-lg">💎</span>
          <span className="tabular-nums text-base">{gems}</span>
        </div>

        {/* Hearts */}
        <div
          onClick={onOpenHeartsRefill}
          title={hasSuper ? 'Tim vô hạn' : `${hearts}/${maxHearts} Tim còn lại (Bấm để nạp)`}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
            hasSuper
              ? 'text-purple-600 hover:bg-purple-50'
              : hearts <= 1
              ? 'text-[#ff4b4b] bg-red-50 animate-bounce'
              : 'text-[#ff4b4b] hover:bg-red-50'
          }`}
        >
          {hasSuper ? (
            <>
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <span className="text-base font-extrabold">∞</span>
            </>
          ) : (
            <>
              <Heart className="w-5 h-5 fill-current" />
              <span className="tabular-nums text-base">{hearts}</span>
              {hearts < maxHearts && (
                <span className="text-xs ml-0.5 bg-[#ff4b4b] text-white rounded-full w-4 h-4 flex items-center justify-center">
                  <Plus className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
