import React, { useState } from 'react';
import { 
  MoreHorizontal,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  Terminal,
  Layers,
  LogOut
} from 'lucide-react';
import { 
  DuoHomeIcon, 
  DuoCharactersIcon, 
  DuoPracticeIcon, 
  DuoLeaderboardIcon, 
  DuoQuestsIcon, 
  DuoShopIcon 
} from './DuolingoIcons';

export type NavTab = 'learn' | 'characters' | 'practice' | 'leaderboard' | 'quests' | 'shop' | 'profile';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  avatarUrl: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  hasSuper: boolean;
  onOpenSuperModal: () => void;
  onOpenSandbox: () => void;
  onOpenSectionDrawer: () => void;
  onResetData: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  avatarUrl,
  soundEnabled,
  onToggleSound,
  hasSuper,
  onOpenSuperModal,
  onOpenSandbox,
  onOpenSectionDrawer,
  onResetData,
  onLogout,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'learn', 
      label: 'HỌC', 
      icon: <DuoHomeIcon className="w-7 h-7" active={activeTab === 'learn'} /> 
    },
    { 
      id: 'characters', 
      label: 'KÝ TỰ', 
      icon: <DuoCharactersIcon className="w-7 h-7" active={activeTab === 'characters'} />
    },
    { 
      id: 'practice', 
      label: 'LUYỆN TẬP', 
      icon: <DuoPracticeIcon className="w-7 h-7" active={activeTab === 'practice'} /> 
    },
    { 
      id: 'leaderboard', 
      label: 'BẢNG XẾP HẠNG', 
      icon: <DuoLeaderboardIcon className="w-7 h-7" /> 
    },
    { 
      id: 'quests', 
      label: 'NHIỆM VỤ', 
      icon: <DuoQuestsIcon className="w-7 h-7" /> 
    },
    { 
      id: 'shop', 
      label: 'CỬA HÀNG', 
      icon: <DuoShopIcon className="w-7 h-7" /> 
    },
    { 
      id: 'profile', 
      label: 'HỒ SƠ', 
      icon: (
        <div className={`w-7 h-7 rounded-full border-2 overflow-hidden ${
          activeTab === 'profile' ? 'border-[#1cb0f6] ring-2 ring-[#1cb0f6]/40' : 'border-[#37464f]'
        }`}>
          <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
        </div>
      )
    },
  ];

  return (
    <>
      {/* Desktop Sidebar (Matching Duolingo layout & authentic icons) */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r-2 border-[#37464f] bg-[#131f24] px-4 py-6 z-30 select-none">
        {/* Brand Logo - lowercase duolingo */}
        <div 
          onClick={() => onSelectTab('learn')}
          className="flex items-center gap-3 px-3 mb-7 cursor-pointer group"
        >
          <span className="text-3xl font-black tracking-tight text-[#58cc02] group-hover:scale-105 transition-transform">
            duoIingo
          </span>
          <span className="text-[10px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            CODE
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wider transition-all uppercase cursor-pointer ${
                  isActive
                    ? 'bg-[#142c38] text-[#1cb0f6] border-2 border-[#1cb0f6]'
                    : 'text-[#9ca3af] hover:bg-[#182730] hover:text-white border-2 border-transparent'
                }`}
              >
                <span className="w-7 h-7 flex items-center justify-center shrink-0">
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* XEM THÊM (More Options Dropdown) */}
          <div className="relative pt-1">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wider transition-all uppercase cursor-pointer ${
                showMoreMenu
                  ? 'bg-[#182730] text-white border-2 border-[#37464f]'
                  : 'text-[#9ca3af] hover:bg-[#182730] hover:text-white border-2 border-transparent'
              }`}
            >
              <span className="w-7 h-7 flex items-center justify-center shrink-0 text-[#849299]">
                <MoreHorizontal className="w-6 h-6 stroke-[2.5]" />
              </span>
              <span className="truncate">XEM THÊM</span>
            </button>

            {/* Popover Menu */}
            {showMoreMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMoreMenu(false)} 
                />
                <div className="absolute left-0 bottom-full mb-2 w-64 bg-[#182730] border-2 border-[#37464f] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      onOpenSectionDrawer();
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold text-xs text-[#dbe2e6] hover:bg-[#20343f] hover:text-white transition-colors cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Xem 9 Phần Học (20+ Cửa)</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenSandbox();
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold text-xs text-[#dbe2e6] hover:bg-[#20343f] hover:text-white transition-colors cursor-pointer"
                  >
                    <Terminal className="w-4 h-4 text-[#1cb0f6]" />
                    <span>Góc thử code (Sandbox)</span>
                  </button>

                  <button
                    onClick={() => {
                      onToggleSound();
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-bold text-xs text-[#dbe2e6] hover:bg-[#20343f] hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      {soundEnabled ? (
                        <Volume2 className="w-4 h-4 text-[#58cc02]" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-[#849299]" />
                      )}
                      <span>Âm thanh hiệu ứng</span>
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                      soundEnabled ? 'bg-emerald-900 text-emerald-300' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {soundEnabled ? 'BẬT' : 'TẮT'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenSuperModal();
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold text-xs text-[#dbe2e6] hover:bg-[#20343f] hover:text-white transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Super duoIingo Code</span>
                  </button>

                  <div className="my-1 border-t border-[#37464f]" />

                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold text-xs text-[#1cb0f6] hover:bg-[#20343f] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất (Trang giới thiệu)</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      if (confirm('Bạn có chắc muốn đặt lại toàn bộ tiến trình học?')) {
                        onResetData();
                      }
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold text-xs text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Đặt lại dữ liệu</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#131f24] border-t-2 border-[#37464f] px-2 flex items-center justify-around z-40">
        {navItems.slice(0, 5).map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
                isActive ? 'text-[#1cb0f6]' : 'text-[#849299]'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[#142c38]' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[9px] font-black uppercase tracking-tight mt-0.5 truncate max-w-[50px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
