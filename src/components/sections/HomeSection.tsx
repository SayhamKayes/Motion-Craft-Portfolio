import React, { useEffect, useState } from 'react';
import { ArrowDown, Code2, Sparkles, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Profile, SiteSettings } from '../../types';
import { playSound } from '../../utils/audio';

interface HomeSectionProps {
  isActive: boolean;
  profile: Profile;
  settings: SiteSettings;
  onExploreWorks: () => void;
  onContactClick: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  isActive,
  profile,
  settings,
  onExploreWorks,
  onContactClick,
}) => {
  const [dhaTime, setdhaTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // DHA is UTC+6
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setdhaTime(new Intl.DateTimeFormat('en-US', options).format(now) + ' DHA');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="section-home"
      className="relative w-full h-screen flex flex-col justify-between px-6 sm:px-16 pt-28 pb-12 overflow-hidden select-none"
    >
      {/* Top Status Bar: Location, Availability & Dhaka Clock */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
          }`}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-mono-code tracking-wider text-emerald-400 uppercase font-medium">
            {profile.availability}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-code text-white/60">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{profile.location}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-white/[0.05] px-2.5 py-1 rounded border border-white/10">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white/80">{dhaTime}</span>
          </div>
        </div>
      </div>

      {/* Main Center Display: Bold Japanese Web Designer Typography */}
      <div className="my-auto max-w-5xl">
        {/* Eyebrow / Kanji Subtitle */}
        <div
          className={`flex items-center gap-3 mb-4 transition-all duration-700 delay-100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          <div className="h-px w-8 bg-gradient-to-r from-emerald-500 to-cyan-400" />
          <span className="font-mono-code text-xs sm:text-sm tracking-[0.25em] text-cyan-400 uppercase font-bold">
            Turning ideas into Digital Reality
          </span>
          {settings.showJapaneseKanji && (
            <span className="font-japanese text-xs sm:text-sm text-emerald-400/90 font-medium">
              — {/* {profile.kanjiName} */}
            </span>
          )}
        </div>

        {/* Hero Title */}
        <h1
          id="hero-main-title"
          className={`font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-white transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <span className="block">{profile.name.split(' ')[0]}</span>
          <span className="block bg-gradient-to-r from-white via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
            {profile.name.split(' ')[1]}
          </span>
        </h1>

        {/* Profession Tagline */}
        <div
          className={`mt-4 sm:mt-6 text-base sm:text-2xl font-display font-medium text-white/80 transition-all duration-700 delay-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          {profile.title}
        </div>

        {/* Brief Statement */}
        <p
          className={`mt-3 max-w-2xl text-xs sm:text-sm text-white/60 leading-relaxed font-body transition-all duration-700 delay-400 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          {profile.statement}
        </p>

        {/* Interactive Action Buttons */}
        <div
          className={`mt-8 flex flex-wrap items-center gap-4 transition-all duration-700 delay-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          <button
            id="hero-explore-works-btn"
            onClick={() => {
              playSound('click', settings.soundEnabled);
              onExploreWorks();
            }}
            className="group px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-500 text-white font-mono-code text-xs tracking-wider uppercase font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-2"
          >
            <span>View Projects</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button
            id="hero-contact-btn"
            onClick={() => {
              playSound('click', settings.soundEnabled);
              onContactClick();
            }}
            className="px-6 py-3.5 rounded-full border border-white/20 bg-white/[0.04] text-white/80 hover:text-white hover:border-white/40 hover:bg-white/[0.08] font-mono-code text-xs tracking-wider uppercase font-medium transition-all"
          >
            Get in Touch
          </button>

        </div>
      </div>

      {/* Bottom Bar: Tech Stack tags & Scroll Down Cue */}
      <div
        className={`flex flex-wrap items-end justify-between gap-4 pt-4 border-t border-white/10 transition-all duration-700 delay-600 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        {/* Prompt-mentioned key technologies */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono-code text-white/40 uppercase mr-1">Core Tech:</span>
          {['Python', 'Django', 'React.js', 'JavaScript', 'TensorFlow', 'PostgreSQL', 'Tailwind CSS'].map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-white/70"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Scroll down mouse animation */}
        <button
          onClick={() => {
            playSound('slide', settings.soundEnabled);
            onExploreWorks();
          }}
          className="group flex items-center gap-2.5 text-white/50 hover:text-cyan-400 transition-colors focus:outline-none"
        >
          <span className="text-[10px] font-mono-code tracking-widest uppercase">
            Scroll or Swipe Down
          </span>
          <div className="w-5 h-8 rounded-full border border-white/30 group-hover:border-cyan-400 flex items-start justify-center p-1 transition-colors">
            <div className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};
