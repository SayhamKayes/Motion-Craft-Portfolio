import React from 'react';
import { User, Award, Terminal, Heart, Sparkles, MapPin, Compass } from 'lucide-react';
import { Profile, SiteSettings } from '../../types';
import { playSound } from '../../utils/audio';

interface AboutSectionProps {
  isActive: boolean;
  profile: Profile;
  settings: SiteSettings;
  onNavigateSkills: () => void;
  onNavigateContact: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  isActive,
  profile,
  settings,
  onNavigateSkills,
  onNavigateContact,
}) => {
  return (
    <section
      id="section-about"
      className="relative w-full h-screen flex flex-col justify-between px-6 sm:px-16 pt-24 pb-8 overflow-hidden select-none"
    >
      {/* Header */}
      <div
        className={`transition-all duration-700 ${
          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 uppercase tracking-widest mb-1">
          <User className="w-3.5 h-3.5" />
          <span>03 / Creator Biography</span>
          {settings.showJapaneseKanji && (
            <span className="font-japanese text-white/40">プロフィール</span>
          )}
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          About Kuon Yagi
        </h2>
      </div>

      {/* Main Content: Two Columns */}
      <div
        id="about-content-grid"
        className="my-auto py-2 overflow-y-auto max-h-[68vh] scrollbar-thin"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Portrait & Stats (5 cols) */}
          <div
            className={`lg:col-span-5 space-y-4 transition-all duration-700 delay-200 ${
              isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            {/* Visual Portrait Card */}
            <div className="relative rounded-2xl overflow-hidden glass-panel p-2 border border-white/10 group">
              <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                  alt={profile.name}
                  className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c12] via-transparent to-transparent opacity-80" />

                {/* Floating Kanji Seal */}
                {settings.showJapaneseKanji && (
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-lg bg-pink-500/20 backdrop-blur-md border border-pink-500/40 flex items-center justify-center font-japanese font-black text-pink-300 text-base shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                    八木
                  </div>
                )}

                {/* Location Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono-code text-white/90">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>Tokyo &amp; Kobe, Japan</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl glass-panel-light border border-white/10 text-center">
                <div className="font-display font-black text-xl text-cyan-400">8+</div>
                <div className="text-[10px] font-mono-code text-white/50 uppercase">Years Exp</div>
              </div>
              <div className="p-3 rounded-xl glass-panel-light border border-white/10 text-center">
                <div className="font-display font-black text-xl text-pink-400">45+</div>
                <div className="text-[10px] font-mono-code text-white/50 uppercase">Projects</div>
              </div>
              <div className="p-3 rounded-xl glass-panel-light border border-white/10 text-center">
                <div className="font-display font-black text-xl text-purple-400">12</div>
                <div className="text-[10px] font-mono-code text-white/50 uppercase">Awards</div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative, Philosophy & Honors (7 cols) */}
          <div
            className={`lg:col-span-7 space-y-6 transition-all duration-700 delay-300 ${
              isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            {/* Bio paragraph */}
            <div className="space-y-3 text-sm sm:text-base text-white/80 leading-relaxed font-body">
              <p className="font-medium text-white/95">
                {profile.bio}
              </p>
              <p className="text-white/60 text-xs sm:text-sm">
                Focusing on the convergence of code, kinetic motion, and graphic craftsmanship. I design and engineer bespoke web experiences that leave a lasting emotional resonance while retaining fast performance and strict accessibility.
              </p>
            </div>

            {/* Philosophy callout */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 flex items-start gap-3.5">
              <Compass className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono-code text-cyan-300 font-semibold uppercase tracking-wider mb-1">
                  Design Philosophy / 哲学
                </div>
                <div className="text-xs sm:text-sm text-white/80 italic font-body">
                  &ldquo;{profile.statement}&rdquo;
                </div>
              </div>
            </div>

            {/* Awards & Honors List */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-code text-pink-400 uppercase tracking-widest mb-2.5">
                <Award className="w-4 h-4" />
                <span>Selected Honors &amp; Recognitions</span>
              </div>
              <div className="space-y-2">
                {profile.awards.map((award, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-white/80"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                    <span className="font-mono-code">{award}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="about-view-skills-btn"
                onClick={() => {
                  playSound('click', settings.soundEnabled);
                  onNavigateSkills();
                }}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono-code tracking-wider uppercase font-semibold transition-all"
              >
                View Technical Skills (スキル) →
              </button>

              <button
                id="about-contact-btn"
                onClick={() => {
                  playSound('click', settings.soundEnabled);
                  onNavigateContact();
                }}
                className="px-5 py-2.5 rounded-full border border-pink-500/40 text-pink-300 hover:bg-pink-500/10 text-xs font-mono-code tracking-wider uppercase font-semibold transition-all"
              >
                Work With Kuon (連絡)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div
        className={`flex items-center justify-between text-xs text-white/40 font-mono-code pt-3 border-t border-white/10 transition-all duration-700 delay-500 ${
          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <span>BASED IN TOKYO &amp; WORKING GLOBALLY</span>
        <span className="text-cyan-400/80">AUTHENTIC REPLICA CMS</span>
      </div>
    </section>
  );
};
