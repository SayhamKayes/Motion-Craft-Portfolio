import React, { useState } from 'react';
import { Cpu, Sparkles, CheckCircle2, Sliders, Info, Zap } from 'lucide-react';
import { Skill, SiteSettings } from '../../types';
import { playSound } from '../../utils/audio';

interface SkillsSectionProps {
  isActive: boolean;
  skills: Skill[];
  settings: SiteSettings;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  isActive,
  skills,
  settings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSkillDetail, setActiveSkillDetail] = useState<Skill | null>(null);

  const categories = [
    'All',
    'Core Front-End',
    'Libraries & Motion',
    'Graphics & 3D',
    'Tools & Design',
  ];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === selectedCategory);

  return (
    <section
      id="section-skills"
      className="relative w-full h-screen flex flex-col justify-between px-6 sm:px-16 pt-24 pb-8 overflow-hidden select-none"
    >
      {/* Header & Category Filters */}
      <div
        className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
          }`}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 uppercase tracking-widest mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>04 / Technical Capabilities</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Skills &amp; Technology
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.04] p-1 rounded-full border border-white/10 self-start sm:self-auto">
          {categories.map((cat) => {
            const isCatActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`skill-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  playSound('hover', settings.soundEnabled);
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1 text-[11px] font-mono-code rounded-full transition-all ${isCatActive
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Grid */}
      <div
        id="skills-grid-container"
        className="my-auto py-2 overflow-y-auto max-h-[66vh] pr-1.5 scrollbar-thin"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill, idx) => {
            const isHighlighted =
              skill.name.includes('fullPage') ||
              skill.name.includes('Parallax') ||
              skill.name.includes('WOW') ||
              skill.name.includes('SVG') ||
              skill.name.includes('Pug');

            return (
              <div
                key={skill.id}
                id={`skill-card-${skill.id}`}
                onClick={() => {
                  playSound('click', settings.soundEnabled);
                  setActiveSkillDetail(skill);
                }}
                style={{
                  transitionDelay: `${idx * 60 + 100}ms`,
                }}
                className={`group relative p-4 rounded-xl glass-panel border transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:border-cyan-400/50 ${isHighlighted
                  ? 'border-cyan-500/30 bg-cyan-950/20'
                  : 'border-white/10 hover:bg-white/[0.06]'
                  } ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                {/* Top Info */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/15 flex items-center justify-center font-mono-code text-[11px] font-bold text-cyan-300">
                      {skill.iconTag}
                    </span>
                    <div>
                      <h4 className="font-display font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {skill.name}
                      </h4>
                      <span className="text-[10px] font-mono-code text-white/40 uppercase">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 font-mono-code text-xs font-bold text-cyan-400">
                    <span>{skill.level}%</span>
                  </div>
                </div>

                {/* Progress Bar with Staggered Fill */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden my-2.5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: isActive ? `${skill.level}%` : '0%',
                      transitionDelay: `${idx * 80 + 200}ms`,
                    }}
                  />
                </div>

                {/* Description */}
                <p className="text-[11px] text-white/60 font-body leading-relaxed line-clamp-2">
                  {skill.description}
                </p>

                {/* Highlight Badge */}
                {isHighlighted && (
                  <div className="mt-2.5 flex items-center gap-1 text-[9px] font-mono-code text-emerald-400">
                    <Zap className="w-3 h-3" />
                    <span>Sayham Kayes Core Library</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Detail Modal */}
      {activeSkillDetail && (
        <div
          id="skill-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setActiveSkillDetail(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl glass-panel border border-cyan-500/40 p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-mono-code text-sm font-black text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                  {activeSkillDetail.iconTag}
                </span>
                <div>
                  <h3 className="font-display font-black text-xl text-white">
                    {activeSkillDetail.name}
                  </h3>
                  <p className="text-xs font-mono-code text-cyan-400 uppercase">
                    {activeSkillDetail.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSkillDetail(null)}
                className="text-white/40 hover:text-white p-1 rounded-lg border border-white/10"
              >
                ✕
              </button>
            </div>

            <div className="my-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex justify-between text-xs font-mono-code">
                <span className="text-white/60">Proficiency Mastery:</span>
                <span className="text-cyan-400 font-bold">{activeSkillDetail.level}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 rounded-full"
                  style={{ width: `${activeSkillDetail.level}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-white/80 leading-relaxed font-body">
              <div className="font-medium text-white/95">
                Technical Purpose &amp; Role:
              </div>
              <p className="text-white/70">
                {activeSkillDetail.description}
              </p>
            </div>

            <button
              onClick={() => setActiveSkillDetail(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono-code text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div
        className={`flex items-center justify-between text-xs text-white/40 font-mono-code pt-3 border-t border-white/10 transition-all duration-700 delay-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        <span>CLICK ANY SKILL FOR IN-DEPTH SPECIFICATIONS</span>
        <span className="text-cyan-400/80">FEATURING SKILLS</span>
      </div>
    </section>
  );
};
