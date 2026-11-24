import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Course } from '../types';
import { soundEffects } from '../utils/audio';
import {
  AccountRecord,
  loginWithCredentials,
  registerAccount,
  loginWithSocialProvider,
} from '../utils/auth';

export type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  initialMode: AuthMode;
  selectedCourseId: string;
  courses: Course[];
  onClose: () => void;
  onAuthSuccess: (account: AccountRecord) => void;
  onContinueAsGuest: (courseId: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  selectedCourseId,
  courses,
  onClose,
  onAuthSuccess,
  onContinueAsGuest,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [courseId, setCourseId] = useState(selectedCourseId || 'python');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup extra fields
  const [age, setAge] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');

  // UI feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showForgotBox, setShowForgotBox] = useState(false);
  const [showAgeTooltip, setShowAgeTooltip] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setShowForgotBox(false);
    setForgotSuccess(false);
  }, [initialMode]);

  useEffect(() => {
    setCourseId(selectedCourseId || 'python');
  }, [selectedCourseId]);

  const switchMode = (nextMode: AuthMode) => {
    soundEffects.playPop();
    setMode(nextMode);
    setErrorMsg(null);
    setShowForgotBox(false);
    setForgotSuccess(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = loginWithCredentials(identifier, password);
    if (!res.ok) {
      soundEffects.playWrong();
      setErrorMsg(res.error);
      return;
    }
    soundEffects.playCorrect();
    onAuthSuccess(res.account);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const parsedAge = age.trim() ? Number(age.trim()) : undefined;
    const res = registerAccount({
      age: parsedAge,
      displayName,
      email,
      password,
      courseId,
    });
    if (!res.ok) {
      soundEffects.playWrong();
      setErrorMsg(res.error);
      return;
    }
    soundEffects.playFanfare();
    onAuthSuccess(res.account);
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    soundEffects.playCorrect();
    const acc = loginWithSocialProvider(provider, courseId);
    onAuthSuccess(acc);
  };

  const handleFillDemoAccount = () => {
    soundEffects.playPop();
    setIdentifier('coder_vietnam');
    setPassword('123456');
    setErrorMsg(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#131f24]/95 md:bg-black/75 md:backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto select-none"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? 'Đăng nhập duoIingo' : 'Đăng ký duoIingo'}
    >
      <div className="relative w-full max-w-[440px] bg-[#131f24] md:border-2 md:border-[#37464f] rounded-3xl p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 my-auto">
        {/* Top Modal Controls: Close (left) & Mode Toggle Button (right) - Duolingo style */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              onClose();
            }}
            aria-label="Đóng"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#849299] hover:text-white hover:bg-[#182730] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>

          <button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
            className="px-4 py-2 rounded-2xl bg-[#182730] hover:bg-[#20343f] border-2 border-[#37464f] border-b-4 active:translate-y-0.5 active:border-b-2 text-[#1cb0f6] font-black text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
          >
            {mode === 'login' ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}
          </button>
        </div>

        {/* Modal Heading */}
        <h2 className="text-2xl font-black text-white text-center mb-6 tracking-tight">
          {mode === 'login' ? 'Đăng nhập' : 'Tạo hồ sơ'}
        </h2>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-[#2a1318] border-2 border-[#ff4b4b]/60 flex items-start gap-2.5 text-left animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-[#ff4b4b] shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-red-200 leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email hoặc tên người dùng"
                autoComplete="username"
                className="w-full bg-[#182730] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl px-4 py-3.5 text-sm font-bold text-white placeholder-[#6c7c85] focus:outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                autoComplete="current-password"
                className="w-full bg-[#182730] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl pl-4 pr-28 py-3.5 text-sm font-bold text-white placeholder-[#6c7c85] focus:outline-none transition-colors"
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="p-1.5 text-[#849299] hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    setShowForgotBox(!showForgotBox);
                    setForgotSuccess(false);
                  }}
                  className="px-2 py-1 text-[11px] font-black uppercase tracking-wider text-[#849299] hover:text-[#1cb0f6] transition-colors cursor-pointer"
                >
                  QUÊN?
                </button>
              </div>
            </div>

            {/* Forgot Password Helper Box */}
            {showForgotBox && (
              <div className="p-3.5 rounded-2xl bg-[#182730] border-2 border-[#37464f] text-xs space-y-2 animate-in fade-in">
                {forgotSuccess ? (
                  <div className="flex items-center gap-2 text-[#58cc02] font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Đã gửi hướng dẫn khôi phục tới email của bạn!</span>
                  </div>
                ) : (
                  <>
                    <p className="font-bold text-[#dbe2e6]">
                      Tài khoản mẫu có sẵn: <span className="text-[#1cb0f6]">coder_vietnam</span> · Mật khẩu: <span className="text-[#1cb0f6]">123456</span>
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleFillDemoAccount}
                        className="px-3 py-1.5 rounded-xl bg-[#142c38] text-[#1cb0f6] font-black text-[11px] uppercase hover:brightness-110 cursor-pointer"
                      >
                        Điền nhanh tài khoản mẫu
                      </button>
                      <button
                        type="button"
                        onClick={() => setForgotSuccess(true)}
                        className="px-3 py-1.5 rounded-xl bg-[#20343f] text-[#dbe2e6] font-bold text-[11px] hover:text-white cursor-pointer"
                      >
                        Gửi email khôi phục
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 mt-1 bg-[#1cb0f6] hover:bg-[#22b8ff] text-[#131f24] font-black text-sm uppercase tracking-wider rounded-2xl border-b-4 border-[#1482b8] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-lg"
            >
              ĐĂNG NHẬP
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleFillDemoAccount}
                className="text-xs font-extrabold text-[#1cb0f6] hover:underline cursor-pointer"
              >
                Điền nhanh tài khoản mẫu (coder_vietnam)
              </button>
            </div>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignupSubmit} className="space-y-3">
            {/* Age Field (Signature Duolingo signup field) */}
            <div className="relative">
              <input
                type="number"
                min={5}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Tuổi"
                className="w-full bg-[#182730] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl pl-4 pr-11 py-3.5 text-sm font-bold text-white placeholder-[#6c7c85] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowAgeTooltip(!showAgeTooltip)}
                aria-label="Tại sao cần nhập tuổi?"
                className="absolute inset-y-0 right-3 flex items-center text-[#849299] hover:text-white cursor-pointer"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>

            {showAgeTooltip && (
              <p className="text-[11px] font-bold text-[#849299] px-2 -mt-1">
                Nhập độ tuổi giúp duoIingo điều chỉnh bài tập lập trình và cấp độ phù hợp nhất với bạn.
              </p>
            )}

            <div>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Tên (bắt buộc)"
                autoComplete="name"
                className="w-full bg-[#182730] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl px-4 py-3.5 text-sm font-bold text-white placeholder-[#6c7c85] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                className="w-full bg-[#182730] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl px-4 py-3.5 text-sm font-bold text-white placeholder-[#6c7c85] focus:outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                autoComplete="new-password"
                className="w-full bg-[#182730] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl pl-4 pr-11 py-3.5 text-sm font-bold text-white placeholder-[#6c7c85] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute inset-y-0 right-3 flex items-center text-[#849299] hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Chosen Coding Language */}
            <div className="pt-0.5">
              <label className="block text-[11px] font-black uppercase tracking-wider text-[#849299] mb-1.5 px-1">
                Ngôn ngữ muốn học đầu tiên
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full bg-[#182730] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none cursor-pointer"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name} — {c.tagline}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-[#58cc02] hover:bg-[#61e002] text-[#131f24] font-black text-sm uppercase tracking-wider rounded-2xl border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-lg"
            >
              TẠO TÀI KHOẢN
            </button>
          </form>
        )}

        {/* OR Divider */}
        <div className="relative flex items-center justify-center my-5">
          <div className="w-full border-t-2 border-[#263238]" />
          <span className="px-4 bg-[#131f24] text-xs font-black uppercase tracking-wider text-[#6c7c85]">
            HOẶC
          </span>
          <div className="w-full border-t-2 border-[#263238]" />
        </div>

        {/* Social Auth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-[#182730] hover:bg-[#20343f] border-2 border-[#37464f] border-b-4 active:translate-y-0.5 active:border-b-2 rounded-2xl font-black text-xs uppercase tracking-wider text-white transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.3 0 6.08-1.09 8.1-2.96l-3.88-3.05c-1.09.73-2.49 1.16-4.22 1.16-3.24 0-5.98-2.19-6.96-5.13H1.04v3.14C3.05 21.15 7.21 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.04 14.02A7.18 7.18 0 0 1 4.65 12c0-.7.13-1.38.39-2.02V6.84H1.04A11.96 11.96 0 0 0 0 12c0 1.93.46 3.76 1.04 5.16l4-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.85c1.8 0 3.41.62 4.68 1.83l3.51-3.51C18.07 1.19 15.3 0 12 0 7.21 0 3.05 2.85 1.04 6.84l4 3.14C6.02 7.04 8.76 4.85 12 4.85Z"
              />
            </svg>
            <span>GOOGLE</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('github')}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-[#182730] hover:bg-[#20343f] border-2 border-[#37464f] border-b-4 active:translate-y-0.5 active:border-b-2 rounded-2xl font-black text-xs uppercase tracking-wider text-white transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
            </svg>
            <span>GITHUB</span>
          </button>
        </div>

        {/* Guest Fast-Track Link */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              onContinueAsGuest(courseId);
            }}
            className="text-xs font-extrabold text-[#849299] hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
          >
            Học thử ngay không cần đăng nhập →
          </button>
        </div>

        {/* Duolingo Legal Footer */}
        <p className="mt-5 text-[11px] font-semibold text-[#6c7c85] text-center leading-relaxed">
          Khi đăng nhập vào <span className="text-[#849299] font-bold">duoIingo</span>, bạn đồng ý với{' '}
          <span className="underline">Điều khoản</span> và{' '}
          <span className="underline">Chính sách bảo mật</span> của chúng tôi.
        </p>
      </div>
    </div>
  );
};
