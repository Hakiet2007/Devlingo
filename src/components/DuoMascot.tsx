import React, { useState, useId } from 'react';

export type DuoPose = 'standing' | 'waving' | 'coding' | 'happy' | 'sad' | 'celebrating';

interface DuoMascotProps {
  pose?: DuoPose;
  className?: string;
  size?: number | string;
  speechBubble?: string;
  onBubbleClick?: () => void;
  interactive?: boolean;
}

export const DuoMascot: React.FC<DuoMascotProps> = ({
  pose = 'waving',
  className = '',
  size = 180,
  speechBubble,
  onBubbleClick,
  interactive = true,
}) => {
  const [isBouncing, setIsBouncing] = useState(false);
  const [wink, setWink] = useState(false);
  const uid = useId().replace(/:/g, '');

  const bodyGradId = `duoBodyGrad-${uid}`;
  const faceGradId = `duoFaceGrad-${uid}`;
  const beakGradId = `duoBeakGrad-${uid}`;
  const beakUnderGradId = `duoBeakUnderGrad-${uid}`;
  const footGradId = `duoFootGrad-${uid}`;
  const shadowId = `duoShadow-${uid}`;

  const handleClick = () => {
    if (!interactive) return;
    setIsBouncing(true);
    setWink(true);
    setTimeout(() => setIsBouncing(false), 600);
    setTimeout(() => setWink(false), 800);
    if (onBubbleClick) onBubbleClick();
  };

  return (
    <div 
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      style={{ width: typeof size === 'number' ? `${size}px` : size }}
    >
      {/* Speech Bubble (authentic Duolingo speech balloon) */}
      {speechBubble && (
        <div 
          onClick={handleClick}
          className="relative mb-3 bg-[#182730] hover:bg-[#20343f] text-white px-4 py-2.5 rounded-2xl border-2 border-[#37464f] shadow-xl max-w-[210px] text-center transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 animate-in fade-in zoom-in-95 group"
        >
          <p className="text-xs font-black text-[#dbe2e6] leading-tight">
            {speechBubble}
          </p>
          {/* Arrow pointing down to Duo */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[8px] border-t-[#37464f]" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-[#182730]" />
        </div>
      )}

      {/* Duo Owl Vector Graphic */}
      <div 
        onClick={handleClick}
        className={`w-full transition-transform duration-300 ${
          interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
        } ${isBouncing ? 'animate-bounce' : ''}`}
      >
        <svg
          viewBox="0 0 200 210"
          className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft gradients for authentic depth */}
            <linearGradient id={bodyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78c800" />
              <stop offset="35%" stopColor="#58cc02" />
              <stop offset="100%" stopColor="#46a302" />
            </linearGradient>

            <linearGradient id={faceGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8ee000" />
              <stop offset="100%" stopColor="#68bc02" />
            </linearGradient>

            <linearGradient id={beakGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffb020" />
              <stop offset="100%" stopColor="#ff9600" />
            </linearGradient>

            <linearGradient id={beakUnderGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff8500" />
              <stop offset="100%" stopColor="#d96c00" />
            </linearGradient>

            <linearGradient id={footGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffaa00" />
              <stop offset="100%" stopColor="#e57f00" />
            </linearGradient>

            {/* Ground shadow */}
            <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          {/* Ground Contact Shadow */}
          <ellipse cx="100" cy="198" rx="60" ry="10" fill={`url(#${shadowId})`} />

          {/* Left Foot */}
          <path
            d="M 68 184 C 64 192, 54 197, 48 198 C 42 199, 44 192, 52 188 C 42 189, 46 182, 56 181 C 52 180, 56 174, 68 176 Z"
            fill={`url(#${footGradId})`}
          />
          {/* Right Foot */}
          <path
            d="M 132 184 C 136 192, 146 197, 152 198 C 158 199, 156 192, 148 188 C 158 189, 154 182, 144 181 C 148 180, 144 174, 132 176 Z"
            fill={`url(#${footGradId})`}
          />

          {/* Left Wing (Behind or Side) */}
          {pose === 'waving' ? (
            <path
              d="M 38 100 C 18 85, 10 115, 20 145 C 28 165, 48 160, 48 145 Z"
              fill="#46a302"
            />
          ) : pose === 'happy' || pose === 'celebrating' ? (
            <path
              d="M 42 90 C 15 65, 8 95, 20 120 C 30 140, 52 135, 48 115 Z"
              fill="#46a302"
            />
          ) : (
            <path
              d="M 42 105 C 25 115, 22 145, 30 162 C 38 175, 52 165, 50 145 Z"
              fill="#46a302"
            />
          )}

          {/* Right Wing (Waving Upwards in waving pose!) */}
          {pose === 'waving' ? (
            <g className="origin-[155px_110px] hover:rotate-6 transition-transform">
              {/* Arm reaching up & waving */}
              <path
                d="M 152 105 C 172 82, 185 68, 178 52 C 170 38, 154 55, 142 80 C 138 90, 145 102, 152 105 Z"
                fill="#58cc02"
              />
              <path
                d="M 150 108 C 168 88, 182 72, 175 58 C 170 48, 158 62, 145 84 Z"
                fill="#78c800"
              />
            </g>
          ) : pose === 'happy' || pose === 'celebrating' ? (
            <g>
              <path
                d="M 158 90 C 185 65, 192 95, 180 120 C 170 140, 148 135, 152 115 Z"
                fill="#58cc02"
              />
            </g>
          ) : (
            <path
              d="M 158 105 C 175 115, 178 145, 170 162 C 162 175, 148 165, 150 145 Z"
              fill="#58cc02"
            />
          )}

          {/* Main Owl Body - Round, iconic chubby Duolingo shape */}
          <path
            d="M 100 24 C 45 24, 30 68, 30 125 C 30 168, 52 192, 100 192 C 148 192, 170 168, 170 125 C 170 68, 155 24, 100 24 Z"
            fill={`url(#${bodyGradId})`}
          />

          {/* Lighter Green Face Mask / Eye Surround Area */}
          <path
            d="M 100 38 C 60 38, 44 65, 44 110 C 44 135, 55 152, 100 152 C 145 152, 156 135, 156 110 C 156 65, 140 38, 100 38 Z"
            fill={`url(#${faceGradId})`}
            opacity="0.95"
          />

          {/* Little Top Tuft / Hair */}
          <path
            d="M 94 25 C 92 12, 106 14, 102 24 Z"
            fill="#78c800"
          />
          <path
            d="M 101 24 C 103 10, 114 13, 108 24 Z"
            fill="#58cc02"
          />

          {/* Belly Feather Pattern (Authentic chevron markings) */}
          <g fill="#46a302" opacity="0.8">
            <path d="M 90 156 Q 100 164 110 156 Q 100 160 90 156 Z" />
            <path d="M 82 166 Q 100 176 118 166 Q 100 171 82 166 Z" />
            <path d="M 88 176 Q 100 184 112 176 Q 100 180 88 176 Z" />
          </g>

          {/* Eyes Section */}
          {pose === 'happy' || pose === 'celebrating' ? (
            /* Joyful laughing eyes ^^ */
            <g stroke="#142908" strokeWidth="6" strokeLinecap="round" fill="none">
              <path d="M 60 96 Q 72 82 86 96" />
              <path d="M 114 96 Q 128 82 140 96" />
            </g>
          ) : (
            <>
              {/* Left Eye Sclera */}
              <circle cx="72" cy="94" r="24" fill="#ffffff" />
              {/* Right Eye Sclera */}
              <circle cx="128" cy="94" r="24" fill="#ffffff" />

              {/* Eye Borders */}
              <circle cx="72" cy="94" r="24" fill="none" stroke="#e5f5d5" strokeWidth="2" />
              <circle cx="128" cy="94" r="24" fill="none" stroke="#e5f5d5" strokeWidth="2" />

              {/* Left Pupil */}
              <circle cx="74" cy="95" r="13" fill="#142908" />
              {/* Left Specular Highlights */}
              <circle cx="70" cy="90" r="5" fill="#ffffff" />
              <circle cx="78" cy="98" r="2" fill="#ffffff" />

              {/* Right Pupil (Winking if wink is true) */}
              {wink ? (
                <path
                  d="M 116 95 Q 128 105 140 95"
                  stroke="#142908"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                <>
                  <circle cx="126" cy="95" r="13" fill="#142908" />
                  <circle cx="122" cy="90" r="5" fill="#ffffff" />
                  <circle cx="130" cy="98" r="2" fill="#ffffff" />
                </>
              )}
            </>
          )}

          {/* Sad teardrop if pose === 'sad' */}
          {pose === 'sad' && (
            <path
              d="M 52 110 C 50 115, 48 122, 54 124 C 60 126, 60 118, 56 112 Z"
              fill="#2ce2dc"
              opacity="0.9"
            />
          )}

          {/* Cute Rosy Cheek Blushes */}
          <ellipse cx="48" cy="116" rx="9" ry="5" fill="#ff7676" opacity="0.45" />
          <ellipse cx="152" cy="116" rx="9" ry="5" fill="#ff7676" opacity="0.45" />

          {/* Orange Beak (Authentic Duolingo curved 3D beak) */}
          {/* Beak Upper */}
          <path
            d="M 86 104 C 86 100, 114 100, 114 104 C 118 116, 110 132, 100 134 C 90 132, 82 116, 86 104 Z"
            fill={`url(#${beakGradId})`}
          />
          {/* Beak Lower/Shadow */}
          <path
            d="M 90 120 C 95 128, 105 128, 110 120 C 107 132, 93 132, 90 120 Z"
            fill={`url(#${beakUnderGradId})`}
          />

          {/* Celebrating: Party Hat or Crown */}
          {pose === 'celebrating' && (
            <g>
              <polygon points="100,2 80,32 120,32" fill="#ff4b4b" />
              <circle cx="100" cy="2" r="5" fill="#ffc800" />
              <path d="M 85 24 L 115 24" stroke="#ffc800" strokeWidth="4" />
              {/* Confetti specks */}
              <circle cx="36" cy="40" r="3" fill="#ffc800" />
              <circle cx="164" cy="38" r="3.5" fill="#1cb0f6" />
              <circle cx="178" cy="65" r="3" fill="#ff4b4b" />
              <rect x="22" y="60" width="5" height="5" fill="#a463f8" transform="rotate(25 24 62)" />
            </g>
          )}

          {/* Coding Pose: Developer Glasses or Mini Laptop */}
          {pose === 'coding' && (
            <g>
              {/* Glasses frame */}
              <rect x="52" y="76" width="40" height="36" rx="10" fill="none" stroke="#131f24" strokeWidth="4" />
              <rect x="108" y="76" width="40" height="36" rx="10" fill="none" stroke="#131f24" strokeWidth="4" />
              <line x1="92" y1="92" x2="108" y2="92" stroke="#131f24" strokeWidth="4" />
              {/* Mini Laptop held in front */}
              <g transform="translate(68, 148)">
                <rect x="0" y="0" width="64" height="40" rx="4" fill="#20343f" stroke="#37464f" strokeWidth="2" />
                <rect x="4" y="4" width="56" height="30" rx="2" fill="#0d1519" />
                {/* Code symbol </> on screen */}
                <text x="32" y="24" fill="#58cc02" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                  &lt;/&gt;
                </text>
                {/* Laptop base */}
                <polygon points="-6,40 70,40 64,45 0,45" fill="#37464f" />
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
