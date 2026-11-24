import React from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HeartsModalProps {
  hearts: number;
  maxHearts: number;
  gems: number;
  hasSuper: boolean;
  onClose: () => void;
  onRefillWithGems: () => void;
  onPracticeForHeart: () => void;
  onOpenSuperModal: () => void;
}

export const HeartsModal: React.FC<HeartsModalProps> = ({
  hearts,
  maxHearts,
  gems,
  hasSuper,
  onClose,
  onRefillWithGems,
  onPracticeForHeart,
  onOpenSuperModal,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-in zoom-in-95 relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#849299] hover:text-white p-1 rounded-xl cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-red-500/20 flex items-center justify-center text-[#ff4b4b]">
          <Heart className="w-9 h-9 fill-current animate-pulse" />
        </div>

        <h3 className="text-xl font-black text-white mb-1">
          {hasSuper ? 'Tim Vô Hạn' : `Bạn có ${hearts}/${maxHearts} Tim`}
        </h3>

        <p className="text-xs font-bold text-[#849299] mb-6">
          {hasSuper
            ? 'Tài khoản Super của bạn không bao giờ lo hết tim khi viết sai code!'
            : hearts >= maxHearts
            ? 'Bình tim của bạn đã đầy 100%! Hãy tự tin giải các câu đố code nhé.'
            : 'Mỗi câu trả lời sai sẽ trừ 1 tim. Hết tim bạn sẽ phải chờ hồi phục hoặc nạp thêm.'}
        </p>

        {!hasSuper && (
          <div className="space-y-3">
            {hearts < maxHearts && (
              <>
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    onRefillWithGems();
                  }}
                  disabled={gems < 50}
                  className="w-full py-3.5 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase rounded-2xl border-b-4 border-[#46a302] active:translate-y-1 transition-all disabled:opacity-50 cursor-pointer"
                >
                  NẠP ĐẦY 5 TIM (50 ĐÁ QUÝ 💎)
                </button>

                <button
                  onClick={() => {
                    soundEffects.playPop();
                    onPracticeForHeart();
                  }}
                  className="w-full py-3 bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-black text-xs uppercase rounded-2xl border-b-4 border-[#1899d6] active:translate-y-1 transition-all cursor-pointer"
                >
                  LUYỆN TẬP ĐỂ HỒI 1 TIM ❤️
                </button>
              </>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenSuperModal();
              }}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase rounded-2xl border-b-4 border-indigo-800 active:translate-y-1 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>NÂNG CẤP SUPER (VÔ HẠN TIM)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
