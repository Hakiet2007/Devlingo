import React from 'react';
import { X, BookOpen, Copy, Check } from 'lucide-react';
import { Unit } from '../types';

interface GuidebookModalProps {
  unit: Unit;
  onClose: () => void;
}

export const GuidebookModal: React.FC<GuidebookModalProps> = ({ unit, onClose }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="bg-[#ff9600] p-6 text-white flex items-center justify-between border-b-4 border-[#e08500]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-black/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-white/90 block">
                HƯỚNG DẪN KIẾN THỨC · CỬA {unit.unitNumber}
              </span>
              <h2 className="text-xl font-black text-white">{unit.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-white">
          <div className="p-4 bg-[#131f24] border-2 border-[#37464f] rounded-2xl text-xs md:text-sm font-semibold text-[#dbe2e6] leading-relaxed">
            {unit.guidebook.summary}
          </div>

          <div className="space-y-5">
            <h3 className="font-black text-sm uppercase text-[#849299] tracking-wider">
              Khái niệm trọng tâm
            </h3>

            {unit.guidebook.keyConcepts.map((concept, idx) => (
              <div 
                key={idx}
                className="border-2 border-[#37464f] rounded-2xl p-4 space-y-3 bg-[#131f24]"
              >
                <h4 className="font-black text-base text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#142c38] text-[#1cb0f6] flex items-center justify-center text-xs font-black">
                    {idx + 1}
                  </span>
                  {concept.title}
                </h4>
                <p className="text-xs md:text-sm text-[#849299] font-semibold leading-relaxed">
                  {concept.description}
                </p>

                <div className="relative rounded-xl bg-[#0d1519] text-emerald-400 p-3.5 font-mono text-xs overflow-x-auto border border-[#37464f]">
                  <button
                    onClick={() => handleCopy(concept.exampleCode, idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#182730] hover:bg-[#20343f] text-[#849299] transition-colors cursor-pointer"
                    title="Sao chép code"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <pre className="pr-8">{concept.exampleCode}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#37464f] bg-[#182730] flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase rounded-xl border-b-4 border-[#46a302] active:translate-y-1 transition-all cursor-pointer"
          >
            ĐÃ HIỂU, TIẾP TỤC HỌC
          </button>
        </div>
      </div>
    </div>
  );
};
