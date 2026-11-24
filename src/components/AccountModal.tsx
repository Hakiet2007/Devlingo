import React, { useState } from 'react';
import { X, Check, Camera, User, Mail, AtSign } from 'lucide-react';
import { UserProfile } from '../types';
import { soundEffects } from '../utils/audio';
import { MASCOT_HAPPY, MASCOT_CELEBRATING, MASCOT_SAD, MASCOT_STANDING } from '../assets/mascots';

interface AccountModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSaveProfile: (updated: UserProfile) => void;
}

const AVATAR_OPTIONS = [
  { id: 'happy', url: MASCOT_HAPPY, label: 'Cú Laptop' },
  { id: 'celebrating', url: MASCOT_CELEBRATING, label: 'Cú Vô Địch' },
  { id: 'sad', url: MASCOT_SAD, label: 'Cú Bug' },
  { id: 'standing', url: MASCOT_STANDING, label: 'Cú Hoodie' },
];

export const AccountModal: React.FC<AccountModalProps> = ({
  profile,
  onClose,
  onSaveProfile,
}) => {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playCorrect();
    onSaveProfile({
      ...profile,
      displayName: displayName.trim() || profile.displayName,
      username: username.trim().toLowerCase() || profile.username,
      email: email.trim() || profile.email,
      bio: bio.trim(),
      avatar: selectedAvatar,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl max-w-md w-full p-6 text-white shadow-2xl animate-in zoom-in-95 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#849299] hover:text-white p-1 rounded-xl cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        <h2 className="text-xl font-black text-white mb-6">
          Chỉnh Sửa Hồ Sơ Tài Khoản
        </h2>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-black uppercase text-[#849299] mb-2">
              Chọn ảnh đại diện (Avatar)
            </label>
            <div className="grid grid-cols-4 gap-3">
              {AVATAR_OPTIONS.map((item) => {
                const isSelected = selectedAvatar === item.url;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      soundEffects.playPop();
                      setSelectedAvatar(item.url);
                    }}
                    className={`relative p-1 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#58cc02] bg-[#142c38] ring-2 ring-[#58cc02]/30 scale-105'
                        : 'border-[#37464f] bg-[#131f24] hover:border-[#849299]'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden mx-auto">
                      <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                    </div>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#58cc02] text-[#131f24] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[4]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-black uppercase text-[#849299] mb-1.5">
              Tên hiển thị
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#849299]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#131f24] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl py-2.5 pl-10 pr-3 font-bold text-sm text-white focus:outline-none transition-colors"
                placeholder="Nhập tên của bạn"
                required
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-black uppercase text-[#849299] mb-1.5">
              Tên người dùng (Username)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#849299]">
                <AtSign className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#131f24] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl py-2.5 pl-10 pr-3 font-bold text-sm text-white focus:outline-none transition-colors"
                placeholder="username"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-black uppercase text-[#849299] mb-1.5">
              Email tài khoản
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#849299]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#131f24] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl py-2.5 pl-10 pr-3 font-bold text-sm text-white focus:outline-none transition-colors"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-black uppercase text-[#849299] mb-1.5">
              Tiểu sử (Bio)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full bg-[#131f24] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl p-3 font-bold text-sm text-white focus:outline-none transition-colors resize-none"
              placeholder="Chia sẻ mục tiêu học lập trình của bạn..."
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-[#131f24] hover:bg-[#20343f] text-[#849299] font-black text-xs uppercase rounded-xl border border-[#37464f] cursor-pointer"
            >
              HỦY
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase rounded-xl border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
            >
              LƯU THAY ĐỔI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
