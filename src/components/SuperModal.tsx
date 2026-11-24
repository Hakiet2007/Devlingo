import React from 'react';
import { X, Sparkles, Check, Zap, Shield, Heart } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface SuperModalProps {
  onClose: () => void;
  onActivate: () => void;
}

export const SuperModal: React.FC<SuperModalProps> = ({ onClose, onActivate }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-gradient-to-b from-[#1b1035] via-[#241249] to-[#0f0724] rounded-3xl max-w-md w-full p-6 text-white text-center shadow-2xl animate-in zoom-in-95 relative border-2 border-purple-500/30 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-xl"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-black uppercase text-yellow-300 mb-4 border border-white/20">
          <Sparkles className="w-4 h-4" />
          <span>Gói Độc Quyền</span>
        </div>

        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 mb-2">
          Super duoIingo
        </h2>
        <p className="text-xs text-purple-200/80 font-bold mb-6">
          Trở thành lập trình viên thần tốc mà không bị cản trở bởi bất kỳ giới hạn nào!
        </p>

        {/* Feature List */}
        <div className="space-y-3 text-left mb-8">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xs font-black text-white">Tim Vô Hạn (Unlimited Hearts)</div>
              <div className="text-[11px] text-purple-300/80">Thoải mái thử sai code mà không bao giờ hết lượt</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white">Luyện Tập Thuật Toán Không Giới Hạn</div>
              <div className="text-[11px] text-purple-300/80">Truy cập toàn bộ câu đố code nâng cao và giải thuật</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white">Tự Động Bảo Vệ Chuỗi Streak</div>
              <div className="text-[11px] text-purple-300/80">Không bao giờ bị đứt chuỗi ngày học vì bận việc</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-2">
          <button
            onClick={() => {
              soundEffects.playCorrect();
              onActivate();
              onClose();
            }}
            className="w-full py-4 bg-white text-purple-900 hover:bg-yellow-100 font-black text-sm uppercase rounded-2xl border-b-4 border-gray-300 active:translate-y-1 transition-all shadow-lg cursor-pointer"
          >
            KÍCH HOẠT MIỄN PHÍ TRẢI NGHIỆM
          </button>
          <div className="text-[10px] text-purple-300/60 font-semibold">
            Bản quyền dùng thử không mất phí · Có thể hủy bất kỳ lúc nào
          </div>
        </div>
      </div>
    </div>
  );
};
