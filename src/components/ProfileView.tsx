import React, { useState } from 'react';
import { Flame, Sparkles, BookOpen, RefreshCw, Shield, Edit3, UserCheck, LogOut } from 'lucide-react';
import { UserStats, UserProfile } from '../types';
import { AccountModal } from './AccountModal';
import { soundEffects } from '../utils/audio';

interface ProfileViewProps {
  stats: UserStats;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetData: () => void;
  onLogout: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  stats,
  onUpdateProfile,
  onResetData,
  onLogout,
  onOpenAuth,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 pb-28 md:pb-16 select-none">
      {/* User Info Header matching Duolingo Profile */}
      <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl p-6 shadow-xl mb-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left relative">
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-[#58cc02] shadow-xl bg-[#131f24]">
            <img 
              src={stats.profile.avatar} 
              alt={stats.profile.displayName} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#1cb0f6] text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
            title="Đổi ảnh đại diện"
          >
            <Edit3 className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white">
              {stats.profile.displayName}
            </h1>
            {stats.hasSuper && (
              <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-black uppercase rounded-lg">
                SUPER
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-[#849299]">
            @{stats.profile.username} · Gia nhập {stats.profile.joinedDate}
          </p>
          <p className="text-xs font-semibold text-[#dbe2e6] mt-2 italic">
            "{stats.profile.bio}"
          </p>

          <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
            <button
              onClick={() => {
                soundEffects.playPop();
                setShowEditModal(true);
              }}
              className="px-4 py-2 bg-[#142c38] hover:bg-[#183948] text-[#1cb0f6] font-black text-xs uppercase rounded-xl border-2 border-[#1cb0f6] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa hồ sơ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <h2 className="font-black text-sm uppercase text-[#849299] tracking-wider mb-4">
        Thống kê thành tích
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Streak */}
        <div className="p-4 bg-[#182730] border-2 border-[#37464f] rounded-3xl flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-500/20 text-[#ff9600]">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="text-xl font-black text-white tabular-nums">
              {stats.streak}
            </div>
            <div className="text-xs font-bold text-[#849299]">Ngày streak 🔥</div>
          </div>
        </div>

        {/* Total XP */}
        <div className="p-4 bg-[#182730] border-2 border-[#37464f] rounded-3xl flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
            <Sparkles className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="text-xl font-black text-white tabular-nums">
              {stats.xp}
            </div>
            <div className="text-xs font-bold text-[#849299]">Tổng điểm KN ⚡</div>
          </div>
        </div>

        {/* Current League */}
        <div className="p-4 bg-[#182730] border-2 border-[#37464f] rounded-3xl flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-[#1cb0f6]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-white">
              {stats.league}
            </div>
            <div className="text-xs font-bold text-[#849299]">Giải đấu hiện tại 🛡️</div>
          </div>
        </div>

        {/* Completed Lessons */}
        <div className="p-4 bg-[#182730] border-2 border-[#37464f] rounded-3xl flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-[#58cc02]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-white tabular-nums">
              {stats.completedLessonIds.length}
            </div>
            <div className="text-xs font-bold text-[#849299]">Bài học đã qua 📚</div>
          </div>
        </div>
      </div>

      {/* Account Settings / Switcher */}
      <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl p-5 space-y-4">
        <h3 className="font-black text-sm text-white">
          Quản Lý Tài Khoản & Dữ Liệu
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#131f24] hover:bg-[#20343f] text-[#dbe2e6] font-black text-xs rounded-xl border border-[#37464f] transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Thông tin cá nhân</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playPop();
              onOpenAuth('login');
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#142c38] hover:bg-[#1a3a4b] text-[#1cb0f6] font-black text-xs rounded-xl border border-[#1cb0f6]/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Chuyển / Đăng nhập</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playPop();
              onLogout();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#131f24] hover:bg-[#20343f] text-amber-400 font-black text-xs rounded-xl border border-[#37464f] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Về trang giới thiệu</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Bạn có chắc muốn đặt lại toàn bộ tiến trình học về ban đầu không?')) {
                onResetData();
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-red-950/40 hover:bg-red-900/60 text-red-400 font-black text-xs rounded-xl border border-red-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Đặt lại tiến trình</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <AccountModal
          profile={stats.profile}
          onClose={() => setShowEditModal(false)}
          onSaveProfile={onUpdateProfile}
        />
      )}
    </div>
  );
};
