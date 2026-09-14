import React from 'react';
import { playSound } from '../utils/audio';

interface SectionIndicatorProps {
  totalSections: number;
  activeSection: number;
  onNavigate: (index: number) => void;
  soundEnabled: boolean;
}

export const SectionIndicator: React.FC<SectionIndicatorProps> = ({
  totalSections,
  activeSection,
  onNavigate,
  soundEnabled,
}) => {
  const sectionLabels = ['HOME', 'WORKS', 'ABOUT', 'SKILLS', 'TESTIMONIALS', 'CONTACT'];

  return (
    <div
      id="fullpage-section-indicator"
      className="fixed right-6 sm:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-5 pointer-events-auto select-none hidden sm:flex"
    >
      {/* Current page big indicator */}
      <div className="font-mono-code text-[11px] tracking-widest text-cyan-400 font-bold mb-1 flex items-center gap-1.5">
        <span>0{activeSection + 1}</span>
        <span className="text-white/20">/</span>
        <span className="text-white/40">0{totalSections}</span>
      </div>

      {/* Nav dots with labels */}
      <div className="flex flex-col items-end gap-3.5 relative">
        {Array.from({ length: totalSections }).map((_, idx) => {
          const isActive = activeSection === idx;
          return (
            <button
              key={idx}
              id={`fullpage-bullet-${idx}`}
              onClick={() => {
                playSound('click', soundEnabled);
                onNavigate(idx);
              }}
              className="group flex items-center gap-3 py-1 focus:outline-none"
              title={`Go to Section 0${idx + 1}: ${sectionLabels[idx]}`}
            >
              {/* Floating label on hover */}
              <span
                className={`text-[10px] font-mono-code tracking-widest uppercase transition-all duration-300 ${
                  isActive
                    ? 'opacity-100 text-white translate-x-0 font-bold'
                    : 'opacity-0 -translate-x-2 group-hover:opacity-80 group-hover:translate-x-0 text-white/60'
                }`}
              >
                {sectionLabels[idx]}
              </span>

              {/* Dot / Indicator Bar */}
              <div
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-6 h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_#22d3ee]'
                    : 'w-1.5 h-1.5 bg-white/30 group-hover:bg-white/70 group-hover:scale-125'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Snap Scroll Status */}
      <div className="text-[9px] font-mono-code text-white/30 uppercase tracking-widest mt-2">
        SNAP SCROLL
      </div>
    </div>
  );
};
