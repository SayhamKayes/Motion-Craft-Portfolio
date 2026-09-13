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
        {/* <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.04] p-1 rounded-full border border-white/10 self-start sm:self-auto">
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
        </div> */}
      </div>

      {/* Skills Marquee Rows */}
      <div
        id="skills-marquee-container"
        className={`my-auto py-10 flex flex-col gap-5 sm:gap-6 overflow-hidden marquee-container w-full transition-all duration-700 delay-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)' }}
      >
        {(() => {
          const row1 = filteredSkills.filter(s => s.sliderRow === 'top' || !s.sliderRow);
          const row2 = filteredSkills.filter(s => s.sliderRow === 'middle');
          const row3 = filteredSkills.filter(s => s.sliderRow === 'bottom');

          // Sort each row by order just to be safe, though filteredSkills is already sorted
          row1.sort((a, b) => (a.order || 0) - (b.order || 0));
          row2.sort((a, b) => (a.order || 0) - (b.order || 0));
          row3.sort((a, b) => (a.order || 0) - (b.order || 0));
          // Ensure array is large enough and duplicated for seamless -50% translation
          const multiplyArray = (arr: Skill[], minItems: number = 10) => {
            if (arr.length === 0) return [];
            let result: Skill[] = [...arr];
            while (result.length < minItems) {
              result = [...result, ...arr];
            }
            return [...result, ...result];
          };

          const arr1 = multiplyArray(row1);
          const arr2 = multiplyArray(row2);
          const arr3 = multiplyArray(row3);

          const renderCard = (skill: Skill, i: number) => (
            <div
              key={`${skill.id}-${i}`}
              onClick={() => {
                playSound('click', settings.soundEnabled);
                setActiveSkillDetail(skill);
              }}
              className="group relative flex flex-col items-center justify-center w-[150px] h-[100px] mx-3 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:bg-gradient-to-br hover:from-white/[0.12] hover:to-white/[0.02] hover:-translate-y-1 hover:border-cyan-400/70 transition-all duration-300 cursor-pointer hover:shadow-[0_8px_32px_rgba(34,211,238,0.4),inset_0_1px_2px_rgba(255,255,255,0.4)] shrink-0 overflow-hidden will-change-transform"
            >
              {/* Glossy top highlight overlay */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.2] to-transparent pointer-events-none opacity-80" />

              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
              
              <img 
                src={skill.customIconUrl || `https://cdn.simpleicons.org/${skill.iconTag || 'javascript'}/22d3ee`} 
                alt={skill.name}
                width={32}
                height={32}
                loading="lazy"
                decoding="async"
                className="w-8 h-8 object-contain mb-2 group-hover:scale-110 transition-transform duration-300 relative z-10 will-change-transform"
                onError={(e) => {
                  // Fallback if icon doesn't exist
                  if (!skill.customIconUrl) {
                    (e.target as HTMLImageElement).src = `https://cdn.simpleicons.org/code/22d3ee`;
                  }
                }}
              />
              <span className="text-xs font-mono-code text-white/70 group-hover:text-white transition-colors duration-300 text-center px-2 truncate w-full relative z-10">
                {skill.name}
              </span>
            </div>
          );

          return (
            <>
              {arr1.length > 0 && (
                <div className="flex animate-marquee-left w-max will-change-transform">
                  {arr1.map(renderCard)}
                </div>
              )}
              {arr2.length > 0 && (
                <div className="flex animate-marquee-right w-max will-change-transform">
                  {arr2.map(renderCard)}
                </div>
              )}
              {arr3.length > 0 && (
                <div className="flex animate-marquee-left w-max will-change-transform">
                  {arr3.map(renderCard)}
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Skill Detail Modal */}
      {activeSkillDetail && (
        <div
          id="skill-detail-modal"
          className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setActiveSkillDetail(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl glass-panel border border-cyan-500/40 p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                  <img 
                    src={activeSkillDetail.customIconUrl || `https://cdn.simpleicons.org/${activeSkillDetail.iconTag || 'javascript'}/white`} 
                    alt={activeSkillDetail.name}
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      if (!activeSkillDetail.customIconUrl) {
                        (e.target as HTMLImageElement).src = `https://cdn.simpleicons.org/code/white`;
                      }
                    }}
                  />
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
