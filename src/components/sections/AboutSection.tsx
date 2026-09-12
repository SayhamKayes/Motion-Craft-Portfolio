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
        className={`transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
          }`}
      >
        <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 uppercase tracking-widest mb-1">
          <User className="w-3.5 h-3.5" />
          <span>03 / Creator Biography</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          About {profile.name}
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
            className={`lg:col-span-5 space-y-4 transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
          >
            {/* Visual Portrait Card */}
            <div className="relative rounded-2xl overflow-hidden glass-panel p-2 border border-white/10 group">
              <div className="relative h-80 sm:h-96 lg:h-[400px] rounded-xl overflow-hidden bg-slate-900">
                <img
                  src="/assets/profile.jpg"
                  alt={profile.name}
                  className="w-full h-full object-cover object-center filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c12] via-transparent to-transparent opacity-80" />

                {/* Floating  Seal */}
                {/* {settings.showJapaneseKanji && (
                  <div className="absolute top-3 right-3 w-20 h-15 rounded-lg bg-light-500/20 backdrop-blur-md border border-emerald-500/40 flex items-center text-center justify-center font-japanese font-black text-emerald-300 text-base shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    {profile.name}
                  </div>
                )} */}

                {/* Location Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono-code text-white/90">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>Mirpur - 1, Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl glass-panel-light border border-white/10 text-center">
                <div className="font-display font-black text-xl text-cyan-400">3+</div>
                <div className="text-[10px] font-mono-code text-white/50 uppercase">Years Experience</div>
              </div>
              <div className="p-3 rounded-xl glass-panel-light border border-white/10 text-center">
                <div className="font-display font-black text-xl text-emerald-400">80+</div>
                <div className="text-[10px] font-mono-code text-white/50 uppercase">Projects Delivered</div>
              </div>
              <div className="p-3 rounded-xl glass-panel-light border border-white/10 text-center">
                <div className="font-display font-black text-xl text-teal-400">20+</div>
                <div className="text-[10px] font-mono-code text-white/50 uppercase">Happy Clients</div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative, Philosophy & Honors (7 cols) */}
          <div
            className={`lg:col-span-7 space-y-6 transition-all duration-700 delay-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
          >
            {/* Bio paragraph */}
            <div className="space-y-3 text-sm sm:text-base text-white/80 leading-relaxed font-body">
              <p className="font-medium text-white/95">
                I'm a Full Stack Developer based in Dhaka, Bangladesh, with 3+ years of freelance and remote experience and a strong foundation in Python (Django) and React.js. I've delivered 80+ web projects to 50+ international clients on Fiverr.
              </p>
              <p className="font-medium text-white/95">
                As a Level 2 Seller on Fiverr (top 20%), I've maintained a 4.9/5.0 satisfaction rating across 80+ completed projects, serving clients from the USA, Canada, and across the EU.
              </p>
              <p className="text-white/60 text-xs sm:text-sm">
                Currently pursuing my BSc in Computer Science & Engineering at Daffodil International University while working as a Web Developer at Dynamite IT Solution.
              </p>
            </div>

            {/* Philosophy callout */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 flex items-start gap-3.5">
              <Compass className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono-code text-cyan-300 font-semibold uppercase tracking-wider mb-1">
                  Design Philosophy
                </div>
                <div className="text-xs sm:text-sm text-white/80 italic font-body">
                  &ldquo;{profile.statement}&rdquo;
                </div>
              </div>
            </div>

            {/* Awards & Honors List */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-code text-emerald-400 uppercase tracking-widest mb-2.5">
                <Award className="w-4 h-4" />
                <span>Selected Honors &amp; Recognitions</span>
              </div>
              <div className="space-y-2">
                {profile.awards.map((award, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-white/80"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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
                View Technical Skills →
              </button>

              <button
                id="about-contact-btn"
                onClick={() => {
                  playSound('click', settings.soundEnabled);
                  onNavigateContact();
                }}
                className="px-5 py-2.5 rounded-full border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 text-xs font-mono-code tracking-wider uppercase font-semibold transition-all"
              >
                Work With Sayham
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div
        className={`flex items-center justify-between text-xs text-white/40 font-mono-code pt-3 border-t border-white/10 transition-all duration-700 delay-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        <span>BASED IN DHAKA &amp; WORKING GLOBALLY REMOTELY</span>
        <span className="text-cyan-400/80">MODERN MINIMALIST AESTHETICS</span>
      </div>
    </section>
  );
};
