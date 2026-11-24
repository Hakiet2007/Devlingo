import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check, Flame, Trophy, Sparkles, BookOpen } from 'lucide-react';
import { Course } from '../types';
import { DuoMascot } from './DuoMascot';
import { soundEffects } from '../utils/audio';
import { AuthMode } from './AuthModal';

interface LandingPageProps {
  courses: Course[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onOpenAuth: (mode: AuthMode) => void;
  onQuickTry: (courseId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  courses,
  selectedCourseId,
  onSelectCourse,
  onOpenAuth,
  onQuickTry,
}) => {
  const ribbonRef = useRef<HTMLDivElement>(null);
  const [heroQuoteIdx, setHeroQuoteIdx] = useState(0);
  const [miniQuizAnswer, setMiniQuizAnswer] = useState<number | null>(null);

  const heroQuotes = [
    'Chào bạn! Cùng viết dòng code đầu tiên nhé! 👋',
    'Học 15 phút mỗi ngày để thành thạo Python & JS! 🚀',
    'Bắt đầu miễn phí — giữ chuỗi streak thật ngầu! 🔥',
  ];

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const scrollRibbon = (direction: 'left' | 'right') => {
    soundEffects.playPop();
    if (!ribbonRef.current) return;
    const offset = direction === 'left' ? -240 : 240;
    ribbonRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-col antialiased selection:bg-[#58cc02] selection:text-[#131f24]">
      {/* Sticky Top Navigation Bar (Clean 3-zone contract) */}
      <header className="sticky top-0 z-30 bg-[#131f24]/95 backdrop-blur-md border-b-2 border-[#263238]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-[70px] flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            className="flex items-center gap-2.5 text-2xl md:text-3xl font-black tracking-tight text-[#58cc02] whitespace-nowrap shrink-0"
          >
            <span>duoIingo</span>
          </a>

          {/* Zone 2: Clean Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-extrabold text-[#9ca3af]">
            <a
              href="#languages"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Khóa học
            </a>
            <a
              href="#method"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Phương pháp
            </a>
            <a
              href="#motivation"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Động lực
            </a>
            <button
              type="button"
              onClick={() => {
                soundEffects.playPop();
                onOpenAuth('login');
              }}
              className="hover:text-[#1cb0f6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Đăng nhập
            </button>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEffects.playPop();
                onOpenAuth('signup');
              }}
              className="px-5 py-2.5 bg-[#58cc02] hover:bg-[#61e002] text-[#131f24] font-black text-xs uppercase tracking-wider rounded-2xl border-b-4 border-[#46a302] active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              BẮT ĐẦU
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="top" className="flex-1">
        {/* HERO SECTION (Duolingo's iconic 2-column centered stage) */}
        <section className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            {/* Left Visual: Duo Mascot + Floating Coding Elements */}
            <div className="flex flex-col items-center justify-center relative py-4">
              <div className="relative flex flex-col items-center">
                <DuoMascot
                  size={240}
                  pose="waving"
                  speechBubble={heroQuotes[heroQuoteIdx]}
                  onBubbleClick={() => {
                    soundEffects.playPop();
                    setHeroQuoteIdx((prev) => (prev + 1) % heroQuotes.length);
                  }}
                  interactive={true}
                />
              </div>

              {/* Clean mini coding card anchored below Duo */}
              <div className="mt-3 px-4 py-2 rounded-2xl bg-[#182730] border-2 border-[#37464f] font-mono text-xs text-emerald-400 shadow-lg flex items-center gap-2">
                <span className="text-[#849299] select-none">$</span>
                <span>print(&quot;Xin chào {selectedCourse.name}!&quot;)</span>
              </div>
            </div>

            {/* Right Column: Headline + Stacked 3D CTA Buttons */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1
                className="text-3xl sm:text-4xl md:text-[42px] font-black text-white leading-[1.15] tracking-tight mb-4 max-w-lg"
                style={{ textWrap: 'balance' }}
              >
                Cách học lập trình miễn phí, vui nhộn và hiệu quả!
              </h1>

              <p className="text-sm sm:text-base font-bold text-[#9ca3af] leading-relaxed mb-8 max-w-md">
                Chinh phục Python, JavaScript, C++, TypeScript cùng chú cú{' '}
                <span className="text-[#58cc02] font-black">duoIingo</span> chỉ với 5 phút luyện code mỗi ngày.
              </p>

              {/* Duolingo's signature stacked 3D buttons */}
              <div className="w-full max-w-[330px] space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    onOpenAuth('signup');
                  }}
                  className="w-full py-3.5 px-6 bg-[#58cc02] hover:bg-[#61e002] text-[#131f24] font-black text-sm uppercase tracking-wider rounded-2xl border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-lg"
                >
                  BẮT ĐẦU
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    onOpenAuth('login');
                  }}
                  className="w-full py-3.5 px-6 bg-[#182730] hover:bg-[#20343f] text-[#1cb0f6] font-black text-sm uppercase tracking-wider rounded-2xl border-2 border-[#37464f] border-b-4 active:translate-y-1 active:border-b-2 transition-all cursor-pointer"
                >
                  TÔI ĐÃ CÓ TÀI KHOẢN
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  onQuickTry(selectedCourseId);
                }}
                className="mt-4 text-xs font-extrabold text-[#849299] hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
              >
                Hoặc vào học thử {selectedCourse.name} ngay →
              </button>
            </div>
          </div>
        </section>

        {/* LANGUAGE / CODING COURSE RIBBON (Classic Duolingo horizontal flag bar) */}
        <section id="languages" className="border-y-2 border-[#263238] bg-[#162329]">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollRibbon('left')}
              aria-label="Cuộn sang trái"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[#849299] hover:text-white hover:bg-[#20343f] shrink-0 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </button>

            <div
              ref={ribbonRef}
              className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar py-1"
            >
              {courses.map((course) => {
                const isSelected = course.id === selectedCourseId;
                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => {
                      soundEffects.playPop();
                      onSelectCourse(course.id);
                    }}
                    className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border-2 transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#142c38] border-[#1cb0f6] text-white'
                        : 'bg-transparent border-transparent hover:bg-[#1e2f38] text-[#9ca3af] hover:text-white'
                    }`}
                  >
                    <span className="text-xl leading-none">{course.icon}</span>
                    <span className="text-xs font-black uppercase tracking-wider">
                      {course.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollRibbon('right')}
              aria-label="Cuộn sang phải"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[#849299] hover:text-white hover:bg-[#20343f] shrink-0 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </section>

        {/* SECTION 1: miễn phí. vui nhộn. hiệu quả. */}
        <section id="method" className="max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-[#58cc02] tracking-tight leading-tight">
                miễn phí. vui nhộn. hiệu quả.
              </h2>
              <p className="text-base font-bold text-[#9ca3af] leading-relaxed">
                Học lập trình với <span className="text-white">duoIingo</span> thật sự cuốn hút và hoàn toàn miễn phí. Tích lũy điểm kinh nghiệm KN qua các bài tập ngắn, sửa lỗi code trực tiếp và mở khóa từng cánh cửa thử thách.
              </p>
            </div>

            {/* Interactive Mini Code Quiz Preview */}
            <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#1cb0f6]">
                  Thử thách nhanh · Python
                </span>
                <span className="text-xs font-black text-amber-400">+10 KN</span>
              </div>

              <p className="text-sm font-extrabold text-white mb-3">
                Lệnh nào sau đây in ra màn hình chữ &quot;Hello&quot;?
              </p>

              <div className="space-y-2.5">
                {['echo("Hello")', 'print("Hello")', 'console.write("Hello")'].map((opt, idx) => {
                  const isPicked = miniQuizAnswer === idx;
                  const isRight = idx === 1;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setMiniQuizAnswer(idx);
                        if (isRight) soundEffects.playCorrect();
                        else soundEffects.playWrong();
                      }}
                      className={`w-full text-left px-4 py-3 rounded-2xl border-2 border-b-4 font-mono text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        isPicked
                          ? isRight
                            ? 'bg-[#173620] border-[#58cc02] text-[#58cc02]'
                            : 'bg-[#2a1318] border-[#ff4b4b] text-[#ff4b4b]'
                          : 'bg-[#131f24] border-[#37464f] text-[#dbe2e6] hover:bg-[#20343f]'
                      }`}
                    >
                      <span>{opt}</span>
                      {isPicked && (
                        <span className="font-sans text-[11px] font-black">
                          {isRight ? '✓ Chính xác!' : '✗ Thử lại'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: lộ trình từng bước chắc chắn */}
        <section className="border-t border-[#263238]">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Visual: Strict Progression Stepping Stones */}
              <div className="order-2 md:order-1 bg-[#182730] border-2 border-[#37464f] rounded-3xl p-6 flex items-center justify-around gap-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#58cc02] border-b-4 border-[#46a302] flex items-center justify-center text-white shadow-lg">
                      <Check className="w-7 h-7 stroke-[3.5]" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-white">Phần 1 · Cửa 1</div>
                      <div className="text-[11px] font-bold text-[#58cc02]">Đã hoàn thành</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 translate-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#ffc800] border-b-4 border-[#e5b400] flex items-center justify-center text-2xl shadow-lg">
                      📦
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-white">Rương thưởng</div>
                      <div className="text-[11px] font-bold text-[#ffc800]">Mở khóa +20 💎</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#1cb0f6] border-b-4 border-[#1482b8] flex items-center justify-center text-white shadow-lg">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-white">Phần 9 · Hằng ngày</div>
                      <div className="text-[11px] font-bold text-[#1cb0f6]">6 bài mới mỗi 24h</div>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block shrink-0">
                  <DuoMascot size={140} pose="happy" interactive={true} />
                </div>
              </div>

              {/* Right Copy */}
              <div className="order-1 md:order-2 space-y-4 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black text-[#1cb0f6] tracking-tight leading-tight">
                  lộ trình bài bản, chắc từng dòng code
                </h2>
                <p className="text-base font-bold text-[#9ca3af] leading-relaxed">
                  Gồm 9 phần học với hơn 20 cửa mỗi phần. Bạn cần hoàn thành vững chắc bài trước mới mở khóa bài tiếp theo, giúp ghi nhớ sâu cú pháp, biến số, vòng lặp và tư duy thuật toán.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: tiếp thêm động lực mỗi ngày */}
        <section id="motivation" className="border-t border-[#263238]">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black text-[#ffc800] tracking-tight leading-tight">
                  tiếp thêm động lực mỗi ngày
                </h2>
                <p className="text-base font-bold text-[#9ca3af] leading-relaxed">
                  Dễ dàng duy trì thói quen code hằng ngày với chuỗi ngày streak rực lửa, hệ thống tim thử thách, cửa hàng trang bị và bảng xếp hạng giải đấu Kim Cương đầy hứng khởi.
                </p>
              </div>

              <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl p-6 flex items-center justify-between gap-4">
                <DuoMascot size={150} pose="coding" interactive={true} />

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#131f24] border border-[#37464f]">
                    <Flame className="w-6 h-6 text-[#ff9600] fill-current shrink-0" />
                    <div>
                      <div className="text-xs font-black text-white tabular-nums">Chuỗi Streak</div>
                      <div className="text-[11px] font-bold text-[#849299]">Giữ lửa mỗi ngày</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#131f24] border border-[#37464f]">
                    <Trophy className="w-6 h-6 text-[#ffc800] shrink-0" />
                    <div>
                      <div className="text-xs font-black text-white">Giải Đấu Kim Cương</div>
                      <div className="text-[11px] font-bold text-[#849299]">Leo hạng cùng coder</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#131f24] border border-[#37464f]">
                    <Sparkles className="w-6 h-6 text-[#ce82ff] shrink-0" />
                    <div>
                      <div className="text-xs font-black text-white">Thử Thách 24h</div>
                      <div className="text-[11px] font-bold text-[#849299]">6 bài mới mỗi ngày</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section className="border-t border-[#263238] bg-[#162329]">
          <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-20 text-center flex flex-col items-center">
            <DuoMascot size={150} pose="celebrating" interactive={true} className="mb-4" />
            <h2
              className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6 max-w-md"
              style={{ textWrap: 'balance' }}
            >
              Học lập trình cùng duoIingo ngay hôm nay!
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  onOpenAuth('signup');
                }}
                className="w-full py-3.5 px-6 bg-[#58cc02] hover:bg-[#61e002] text-[#131f24] font-black text-sm uppercase tracking-wider rounded-2xl border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
              >
                BẮT ĐẦU MIỄN PHÍ
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  onOpenAuth('login');
                }}
                className="w-full py-3.5 px-6 bg-[#182730] hover:bg-[#20343f] text-[#1cb0f6] font-black text-sm uppercase tracking-wider rounded-2xl border-2 border-[#37464f] border-b-4 active:translate-y-1 active:border-b-2 transition-all cursor-pointer"
              >
                ĐĂNG NHẬP
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Duolingo-style Footer */}
      <footer className="bg-[#58cc02] text-[#142908] py-10 px-4 md:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-extrabold">
          <div className="space-y-2">
            <div className="text-sm font-black uppercase tracking-wider mb-3">Giới thiệu</div>
            <a href="#method" className="block hover:underline">Phương pháp học</a>
            <a href="#languages" className="block hover:underline">Các khóa lập trình</a>
            <a href="#motivation" className="block hover:underline">Tính hiệu quả</a>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-black uppercase tracking-wider mb-3">Sản phẩm</div>
            <button type="button" onClick={() => onOpenAuth('signup')} className="block hover:underline cursor-pointer">
              duoIingo Code
            </button>
            <button type="button" onClick={() => onQuickTry('python')} className="block hover:underline cursor-pointer">
              Học thử ngay
            </button>
            <button type="button" onClick={() => onOpenAuth('login')} className="block hover:underline cursor-pointer">
              Super duoIingo
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-black uppercase tracking-wider mb-3">Tài khoản</div>
            <button type="button" onClick={() => onOpenAuth('login')} className="block hover:underline cursor-pointer">
              Đăng nhập
            </button>
            <button type="button" onClick={() => onOpenAuth('signup')} className="block hover:underline cursor-pointer">
              Tạo tài khoản mới
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-black uppercase tracking-wider mb-3">Ngôn ngữ hỗ trợ</div>
            <p className="opacity-90 leading-relaxed">
              Python · JavaScript · Java · TypeScript · C++ · Rust · HTML &amp; CSS · SQL
            </p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-[#142908]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-black">
          <span>duoIingo — Học lập trình miễn phí mỗi ngày</span>
          <span>© 2026 duoIingo</span>
        </div>
      </footer>
    </div>
  );
};
