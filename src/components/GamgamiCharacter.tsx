import React, { useState } from 'react';
import { PersimmonStage, AppMode, getPersimmonStageLabel } from '../types';

interface GamgamiCharacterProps {
  stage: PersimmonStage;
  mood: 'happy' | 'warm' | 'thirsty' | 'chilly' | 'sleepy';
  ripeningPercent: number;
  interactive?: boolean;
  onTap?: () => void;
  size?: 'sm' | 'md' | 'lg';
  mode?: AppMode;
}

export const GamgamiCharacter: React.FC<GamgamiCharacterProps> = ({
  stage,
  mood,
  ripeningPercent,
  interactive = true,
  onTap,
  size = 'md',
  mode = 'education',
}) => {
  const [isBouncing, setIsBouncing] = useState(false);

  const handleTap = () => {
    if (!interactive) return;
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
    if (onTap) onTap();
  };

  // Color schemes according to ripening stages
  const stageColors: Record<PersimmonStage, { body: string; shadow: string; glow: string }> = {
    green: {
      body: '#84cc16', // lime-500
      shadow: '#65a30d',
      glow: 'rgba(132, 204, 22, 0.25)',
    },
    turning: {
      body: '#f97316', // orange-500
      shadow: '#ea580c',
      glow: 'rgba(249, 115, 22, 0.35)',
    },
    ripe: {
      body: '#ea580c', // orange-600
      shadow: '#c2410c',
      glow: 'rgba(234, 88, 12, 0.45)',
    },
    hongsi: {
      body: '#dc2626', // red-600 / deep coral hongsi
      shadow: '#991b1b',
      glow: 'rgba(220, 38, 38, 0.55)',
    },
  };

  const currentTheme = stageColors[stage] || stageColors.turning;
  const stageDisplayName = getPersimmonStageLabel(stage, mode);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-44 h-44',
    lg: 'w-56 h-56',
  }[size];

  return (
    <div
      onClick={handleTap}
      className={`relative flex items-center justify-center cursor-pointer select-none transition-transform duration-300 ${sizeClasses} ${
        isBouncing ? 'scale-110 -rotate-3' : 'hover:scale-105 active:scale-95'
      }`}
      title="감감이 클릭해서 인사하기!"
    >
      {/* Ambient Soft Glow */}
      <div
        className="absolute inset-0 rounded-full blur-xl transition-all duration-700"
        style={{ backgroundColor: currentTheme.glow }}
      />

      {/* SVG Character Vector */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10 drop-shadow-lg filter transition-all duration-500"
      >
        <defs>
          <radialGradient id={`persimmon-grad-${stage}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="30%" stopColor={currentTheme.body} />
            <stop offset="100%" stopColor={currentTheme.shadow} />
          </radialGradient>
          <filter id="soft-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Stem & Green Calyx (감꼭지) */}
        <g id="calyx" className="transition-transform duration-300 origin-center">
          {/* Wood Stem */}
          <path
            d="M95 18 C95 10, 105 10, 105 18 L103 40 L97 40 Z"
            fill="#78350f"
            stroke="#451a03"
            strokeWidth="1.5"
          />
          {/* 4 Green Leaves / Calyx */}
          {/* Left Leaf */}
          <path
            d="M98 38 C75 22, 55 35, 52 46 C65 52, 85 46, 98 42 Z"
            fill="#15803d"
            stroke="#14532d"
            strokeWidth="1.5"
          />
          {/* Right Leaf */}
          <path
            d="M102 38 C125 22, 145 35, 148 46 C135 52, 115 46, 102 42 Z"
            fill="#16a34a"
            stroke="#14532d"
            strokeWidth="1.5"
          />
          {/* Bottom Left Leaf */}
          <path
            d="M96 42 C80 50, 72 65, 78 72 C88 68, 95 56, 98 44 Z"
            fill="#15803d"
            stroke="#14532d"
            strokeWidth="1"
          />
          {/* Bottom Right Leaf */}
          <path
            d="M104 42 C120 50, 128 65, 122 72 C112 68, 105 56, 102 44 Z"
            fill="#22c55e"
            stroke="#14532d"
            strokeWidth="1"
          />
        </g>

        {/* Persimmon Fruit Body (Soft Round Shape with indentation) */}
        <path
          d="M100 42 
             C155 40, 185 85, 182 135 
             C180 170, 145 188, 100 188 
             C55 188, 20 170, 18 135 
             C15 85, 45 40, 100 42 Z"
          fill={`url(#persimmon-grad-${stage})`}
          filter="url(#soft-shadow)"
        />

        {/* Glossy Reflection Highlight */}
        <ellipse cx="68" cy="85" rx="18" ry="10" transform="rotate(-30 68 85)" fill="#ffffff" fillOpacity="0.32" />

        {/* Cheeks (Blushing) */}
        <ellipse cx="62" cy="132" rx="10" ry="6" fill="#f43f5e" fillOpacity="0.45" />
        <ellipse cx="138" cy="132" rx="10" ry="6" fill="#f43f5e" fillOpacity="0.45" />

        {/* Eyes & Eyebrows depending on mood */}
        {mood === 'happy' && (
          <g id="eyes-happy">
            {/* Happy Curved Arcs */}
            <path d="M68 116 Q78 106 88 116" stroke="#1c1917" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M112 116 Q122 106 132 116" stroke="#1c1917" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {mood === 'warm' && (
          <g id="eyes-warm">
            <circle cx="78" cy="114" r="6" fill="#1c1917" />
            <circle cx="76" cy="112" r="2" fill="#ffffff" />
            <circle cx="122" cy="114" r="6" fill="#1c1917" />
            <circle cx="120" cy="112" r="2" fill="#ffffff" />
          </g>
        )}

        {mood === 'thirsty' && (
          <g id="eyes-thirsty">
            <circle cx="78" cy="114" r="7" fill="#1c1917" />
            <circle cx="76" cy="111" r="2.5" fill="#ffffff" />
            <circle cx="122" cy="114" r="7" fill="#1c1917" />
            <circle cx="120" cy="111" r="2.5" fill="#ffffff" />
            {/* Sweat drop */}
            <path d="M148 100 Q152 105 148 112 Q144 105 148 100 Z" fill="#38bdf8" />
          </g>
        )}

        {mood === 'chilly' && (
          <g id="eyes-chilly">
            <line x1="70" y1="112" x2="86" y2="114" stroke="#1c1917" strokeWidth="4" strokeLinecap="round" />
            <line x1="114" y1="114" x2="130" y2="112" stroke="#1c1917" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {mood === 'sleepy' && (
          <g id="eyes-sleepy">
            <line x1="68" y1="115" x2="88" y2="115" stroke="#1c1917" strokeWidth="4" strokeLinecap="round" />
            <line x1="112" y1="115" x2="132" y2="115" stroke="#1c1917" strokeWidth="4" strokeLinecap="round" />
            {/* Zzz */}
            <text x="145" y="90" fontSize="16" fontWeight="bold" fill="#ea580c">z</text>
            <text x="156" y="78" fontSize="20" fontWeight="bold" fill="#ea580c">Z</text>
          </g>
        )}

        {/* Mouth */}
        {mood === 'happy' ? (
          <path
            d="M86 134 Q100 152 114 134"
            stroke="#1c1917"
            strokeWidth="4"
            strokeLinecap="round"
            fill="#e11d48"
          />
        ) : mood === 'thirsty' ? (
          <ellipse cx="100" cy="138" rx="6" ry="8" fill="#1c1917" />
        ) : mood === 'chilly' ? (
          <path d="M90 138 Q95 134 100 138 Q105 142 110 138" stroke="#1c1917" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : (
          <path
            d="M90 134 Q100 144 110 134"
            stroke="#1c1917"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>

      {/* Ripeness Progress Pill Indicator */}
      <div className="absolute -bottom-2 bg-white/95 border border-stone-200 shadow-sm rounded-full px-2.5 py-0.5 flex items-center gap-1.5 z-20">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.body }} />
        <span className="text-[11px] font-semibold text-stone-700">{stageDisplayName}</span>
        <span className="text-[11px] font-mono font-bold text-orange-600">{ripeningPercent}%</span>
      </div>
    </div>
  );
};
