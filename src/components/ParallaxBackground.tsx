import React, { useEffect, useState } from 'react';
import { SiteSettings } from '../types';

interface ParallaxBackgroundProps {
  activeSection: number;
  settings: SiteSettings;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  activeSection,
  settings,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lerpPos, setLerpPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to range -1 to 1 relative to center of screen
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      targetY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMousePos({ x: targetX, y: targetY });
    };

    let curX = 0;
    let curY = 0;

    const tick = () => {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      setLerpPos({ x: curX, y: curY });
      animationFrameId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const intensity = settings.parallaxEnabled ? settings.parallaxIntensity : 0;
  const mx = lerpPos.x * intensity;
  const my = lerpPos.y * intensity;

  // Section-specific background accent colors
  const sectionGradients = [
    // 0: Home (Signature Kuon Yagi Violet & Coral & Cyan)
    'from-[#12072b] via-[#0d1024] to-[#080914]',
    // 1: Works (Deep Indigo & Electric Cyan)
    'from-[#0b1329] via-[#0b1e2c] to-[#070e17]',
    // 2: About (Warm Charcoal & Crimson Amber)
    'from-[#190e18] via-[#120e1d] to-[#0a0711]',
    // 3: Skills (Tech Slate & Emerald Cyan)
    'from-[#0b1c24] via-[#091520] to-[#050c12]',
    // 4: Contact (Midnight Violet & Vibrant Rose)
    'from-[#1a0c24] via-[#130d22] to-[#090614]',
  ];

  const currentGradient = sectionGradients[activeSection] || sectionGradients[0];

  return (
    <div
      id="parallax-background-container"
      className="fixed inset-0 pointer-events-none overflow-hidden transition-colors duration-1000 z-0 select-none"
    >
      {/* Base Dynamic Backdrop */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${currentGradient} transition-all duration-1000`}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60" />
      <div className="absolute inset-0 bg-dots-pattern opacity-30" />

      {/* Layer 1: Giant Watermark Background Typography (Subtle Depth) */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `translate3d(${mx * -18}px, ${my * -18}px, 0)`,
        }}
      >
        <div className="text-white/[0.03] font-display font-black text-[18vw] leading-none uppercase tracking-tighter select-none whitespace-nowrap">
          {activeSection === 0 && 'SAYHAM KAYES'}
          {activeSection === 1 && 'SELECTED WORKS'}
          {activeSection === 2 && 'BIOGRAPHY'}
          {activeSection === 3 && 'CAPABILITIES'}
          {activeSection === 4 && 'GET IN TOUCH'}
        </div>
      </div>

      {/* Layer 2: Japanese Kanji Watermark Characters */}
      {/* {settings.showJapaneseKanji && (
        <div
          className="absolute inset-0 flex justify-between items-center px-12 transition-transform duration-300 ease-out will-change-transform opacity-30"
          style={{
            transform: `translate3d(${mx * 25}px, ${my * 25}px, 0)`,
          }}
        >
          <div className="font-japanese font-black text-8xl text-white/[0.04] select-none writing-vertical-rl">
            {activeSection === 0 && '八木 拓海'}
            {activeSection === 1 && '創造 的 実績'}
            {activeSection === 2 && '情熱 と 哲学'}
            {activeSection === 3 && '技術 と 表現'}
            {activeSection === 4 && '連絡 お待ち'}
          </div>
          <div className="font-japanese font-black text-9xl text-white/[0.03] select-none hidden lg:block">
            {activeSection === 0 && '動'}
            {activeSection === 1 && '創'}
            {activeSection === 2 && '匠'}
            {activeSection === 3 && '技'}
            {activeSection === 4 && '和'}
          </div>
        </div>
      )} */}

      {/* Layer 3: Vibrant Colorful Dynamic Fluid SVG Waves (Kuon Yagi Signature) */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(${mx * -32}px, ${my * -32}px, 0)`,
        }}
      >
        <svg
          className="absolute bottom-0 left-0 w-[150%] h-[75%] -translate-x-[15%] translate-y-[10%] opacity-40 mix-blend-screen animate-float-slow"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
              <stop offset="45%" stopColor="#8b5cf6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <path
            d="M0,280 C320,440 540,120 860,290 C1180,460 1320,180 1440,310 L1440,800 L0,800 Z"
            fill="url(#waveGrad1)"
          />
        </svg>

        <svg
          className="absolute bottom-0 right-0 w-[160%] h-[65%] -translate-x-[5%] translate-y-[20%] opacity-35 mix-blend-screen animate-float-reverse"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,360 C260,180 580,480 920,240 C1180,60 1340,390 1440,290 L1440,800 L0,800 Z"
            fill="url(#waveGrad2)"
          />
        </svg>
      </div>

      {/* Layer 4: Geometric Floating Ornaments (Parallax.js Depth tracking) */}
      {/* Plus signs (+) */}
      <div
        className="absolute top-[18%] left-[12%] text-cyan-400/60 font-mono-code text-2xl will-change-transform select-none"
        style={{ transform: `translate3d(${mx * 45}px, ${my * 45}px, 0)` }}
      >
        +
      </div>
      <div
        className="absolute top-[70%] left-[8%] text-emerald-400/50 font-mono-code text-xl will-change-transform select-none"
        style={{ transform: `translate3d(${mx * -38}px, ${my * -38}px, 0)` }}
      >
        +
      </div>
      <div
        className="absolute top-[28%] right-[14%] text-amber-400/60 font-mono-code text-3xl will-change-transform select-none"
        style={{ transform: `translate3d(${mx * 52}px, ${my * 52}px, 0)` }}
      >
        +
      </div>
      <div
        className="absolute bottom-[22%] right-[22%] text-violet-400/50 font-mono-code text-2xl will-change-transform select-none"
        style={{ transform: `translate3d(${mx * -40}px, ${my * -40}px, 0)` }}
      >
        +
      </div>

      {/* Geometric Wire Rings */}
      <div
        className="absolute top-[15%] right-[28%] w-32 h-32 rounded-full border border-emerald-500/20 will-change-transform animate-spin-slow select-none"
        style={{ transform: `translate3d(${mx * 30}px, ${my * 30}px, 0)` }}
      />
      <div
        className="absolute bottom-[25%] left-[20%] w-48 h-48 rounded-full border border-dashed border-cyan-400/20 will-change-transform animate-spin-slow select-none"
        style={{ transform: `translate3d(${mx * -25}px, ${my * -25}px, 0)` }}
      />

      {/* Floating Solid Color Blobs (Soft Glow) */}
      <div
        className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-violet-600/15 blur-3xl will-change-transform animate-pulse-glow"
        style={{ transform: `translate3d(${mx * -20}px, ${my * -20}px, 0)` }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl will-change-transform animate-pulse-glow"
        style={{ transform: `translate3d(${mx * 28}px, ${my * 28}px, 0)` }}
      />
      <div
        className="absolute top-2/3 left-1/5 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl will-change-transform"
        style={{ transform: `translate3d(${mx * -35}px, ${my * -35}px, 0)` }}
      />

      {/* Top and Bottom Subtle Vignette */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,rgba(6,7,12,0.7)_100%]" />
    </div>
  );
};
