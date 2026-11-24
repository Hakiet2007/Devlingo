import React from 'react';
import { Shield, ChevronUp, Flame } from 'lucide-react';
import { UserStats } from '../types';
import { MASCOT_HAPPY } from '../assets/mascots';

interface LeaderboardViewProps {
  stats: UserStats;
}

interface Competitor {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ stats }) => {
  const competitors: Competitor[] = [
    { rank: 1, name: 'Minh Hoàng', avatar: '🦊', xp: 240, streak: 12 },
    { rank: 2, name: 'Bạn (duoIingo)', avatar: '🦉', xp: Math.max(stats.xp, 195), streak: stats.streak, isCurrentUser: true },
    { rank: 3, name: 'Thu Thảo', avatar: '🐱', xp: 180, streak: 8 },
    { rank: 4, name: 'Bảo Long (Coder)', avatar: '🦁', xp: 140, streak: 5 },
    { rank: 5, name: 'Anh Quân', avatar: '🐼', xp: 95, streak: 2 },
    { rank: 6, name: 'Hải Đăng', avatar: '🐸', xp: 60, streak: 3 },
    { rank: 7, name: 'Mai Linh', avatar: '🐰', xp: 45, streak: 1 },
    { rank: 8, name: 'Tuấn Kiệt', avatar: '🐻', xp: 30, streak: 1 },
  ].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 pb-28 md:pb-16 select-none">
      {/* League Header matching image.png */}
      <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl p-6 text-center shadow-xl mb-8 relative overflow-hidden">
        <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-b from-[#2ce2dc] to-[#1cb0f6] rounded-3xl p-1 flex items-center justify-center shadow-2xl">
          <div className="w-full h-full bg-[#16303d] rounded-[20px] flex items-center justify-center text-cyan-300">
            <Shield className="w-10 h-10 fill-cyan-400/30 stroke-[2.5]" />
          </div>
        </div>

        <div className="text-xs font-black uppercase tracking-wider text-[#849299] mb-1">
          BẢNG XẾP HẠNG TUẦN NÀY
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Giải đấu {stats.league}
        </h1>
        <p className="text-xs font-bold text-[#849299] mt-1">
          Top 3 người dẫn đầu sẽ được thăng hạng giải đấu tiếp theo!
        </p>

        <div className="mt-4 inline-block px-4 py-1.5 bg-[#131f24] border border-[#37464f] rounded-full text-xs font-black text-amber-400">
          ⏳ Kết thúc sau: 2 ngày 14 giờ
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl shadow-sm overflow-hidden divide-y-2 divide-[#20343f]">
        {competitors.map((user) => {
          const isPromotion = user.rank <= 3;
          const isSelf = user.isCurrentUser;

          return (
            <div
              key={user.name}
              className={`flex items-center justify-between p-4 transition-colors ${
                isSelf
                  ? 'bg-[#142c38] border-y-2 border-[#1cb0f6]'
                  : 'hover:bg-[#1a2c35]'
              }`}
            >
              {/* Left: Rank & Avatar & Name */}
              <div className="flex items-center gap-3">
                <span className={`w-7 text-center font-black text-base ${
                  user.rank === 1
                    ? 'text-amber-400 text-lg'
                    : user.rank === 2
                    ? 'text-[#2ce2dc]'
                    : user.rank === 3
                    ? 'text-amber-600'
                    : 'text-[#849299]'
                }`}>
                  {user.rank}
                </span>

                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl bg-[#131f24] border border-[#37464f] overflow-hidden">
                  {isSelf ? (
                    <img src={MASCOT_HAPPY} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    user.avatar
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-black text-sm ${isSelf ? 'text-[#1cb0f6]' : 'text-white'}`}>
                      {user.name}
                    </span>
                    {isSelf && (
                      <span className="text-[10px] font-black uppercase bg-[#1cb0f6] text-white px-1.5 py-0.5 rounded-md">
                        BẠN
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#849299]">
                    <Flame className="w-3.5 h-3.5 text-[#ff9600] fill-current" />
                    <span>{user.streak} ngày</span>
                    {isPromotion && (
                      <span className="text-[#58cc02] font-black flex items-center ml-1">
                        <ChevronUp className="w-3.5 h-3.5 stroke-[3]" /> Thăng hạng
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: XP */}
              <div className="text-right">
                <span className="font-black text-sm text-white block">
                  {user.xp} KN
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
