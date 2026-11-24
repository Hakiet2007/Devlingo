import React from 'react';
import { Heart, Shield, Sparkles, Check } from 'lucide-react';
import { UserStats } from '../types';
import { soundEffects } from '../utils/audio';

interface ShopViewProps {
  stats: UserStats;
  onRefillHearts: () => void;
  onBuyStreakFreeze: () => void;
  onUnlockTheme: (themeId: string, cost: number) => void;
  onActivateSuper: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  stats,
  onRefillHearts,
  onBuyStreakFreeze,
  onUnlockTheme,
  onActivateSuper,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 pb-28 md:pb-16 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Cửa Hàng Duolingo
          </h1>
          <p className="text-xs md:text-sm font-bold text-[#849299] mt-1">
            Dùng Đá quý 💎 để nâng cấp trải nghiệm học lập trình
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#182730] border-2 border-[#37464f] rounded-2xl text-[#1cb0f6] font-black text-sm">
          <span>💎</span>
          <span>{stats.gems}</span>
        </div>
      </div>

      {/* Super Banner */}
      <div className="p-6 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 border-2 border-purple-500/30 rounded-3xl text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-black uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Gói Thành Viên Đặc Quyền</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Super Duolingo Code
            </h2>
            <p className="text-xs text-purple-200/80 font-medium mt-1 max-w-sm">
              Tim vô hạn, luyện tập lỗi sai không giới hạn và học không quảng cáo!
            </p>
          </div>

          <button
            onClick={() => {
              soundEffects.playPop();
              onActivateSuper();
            }}
            disabled={stats.hasSuper}
            className="shrink-0 py-3 px-5 bg-white text-purple-950 hover:bg-gray-100 font-black text-xs uppercase rounded-2xl border-b-4 border-gray-300 active:translate-y-1 transition-all disabled:opacity-50 cursor-pointer"
          >
            {stats.hasSuper ? 'ĐÃ SỞ HỮU' : 'KÍCH HOẠT'}
          </button>
        </div>
      </div>

      {/* Power-ups Section */}
      <div className="space-y-4 mb-8">
        <h3 className="font-black text-sm uppercase text-[#849299] tracking-wider">
          Vật phẩm hỗ trợ (Power-Ups)
        </h3>

        {/* Refill Hearts */}
        <div className="flex items-center justify-between p-4 bg-[#182730] border-2 border-[#37464f] rounded-3xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-[#ff4b4b] flex items-center justify-center">
              <Heart className="w-7 h-7 fill-current" />
            </div>
            <div>
              <h4 className="font-black text-base text-white">
                Hồi phục 5 Tim
              </h4>
              <p className="text-xs text-[#849299] font-semibold">
                Nạp đầy tim để tiếp tục code không lo gián đoạn
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playPop();
              onRefillHearts();
            }}
            disabled={stats.hearts >= stats.maxHearts || stats.gems < 50}
            className="py-2.5 px-4 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase rounded-xl border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
          >
            {stats.hearts >= stats.maxHearts ? 'ĐÃ ĐẦY' : '50 💎'}
          </button>
        </div>

        {/* Streak Freeze */}
        <div className="flex items-center justify-between p-4 bg-[#182730] border-2 border-[#37464f] rounded-3xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-[#1cb0f6] flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-black text-base text-white">
                Đóng băng Chuỗi Streak
              </h4>
              <p className="text-xs text-[#849299] font-semibold">
                Bảo vệ chuỗi ngày học nếu bạn quên code 1 ngày (Đang có: {stats.inventory.streakFreezes})
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playPop();
              onBuyStreakFreeze();
            }}
            disabled={stats.gems < 100}
            className="py-2.5 px-4 bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-black text-xs uppercase rounded-xl border-b-4 border-[#1899d6] active:translate-y-1 active:border-b-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
          >
            100 💎
          </button>
        </div>
      </div>

      {/* Mascot Outfits */}
      <div className="space-y-4">
        <h3 className="font-black text-sm uppercase text-[#849299] tracking-wider">
          Trang phục Cú Byte Dev
        </h3>

        {/* Hacker Hoodie */}
        <div className="flex items-center justify-between p-4 bg-[#182730] border-2 border-[#37464f] rounded-3xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
              🥋
            </div>
            <div>
              <h4 className="font-black text-base text-white">
                Áo Hoodie Hacker
              </h4>
              <p className="text-xs text-[#849299] font-semibold">
                Mặc áo hoodie lập trình viên cho linh vật Cú Byte
              </p>
            </div>
          </div>

          {stats.inventory.unlockedThemes.includes('hacker_hoodie') ? (
            <span className="text-xs font-black text-[#58cc02] bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <Check className="w-4 h-4" /> ĐÃ MỞ
            </span>
          ) : (
            <button
              onClick={() => {
                soundEffects.playPop();
                onUnlockTheme('hacker_hoodie', 150);
              }}
              disabled={stats.gems < 150}
              className="py-2.5 px-4 bg-[#ffc800] hover:bg-[#e5b400] text-[#131f24] font-black text-xs uppercase rounded-xl border-b-4 border-[#e5b400] active:translate-y-1 active:border-b-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            >
              150 💎
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
