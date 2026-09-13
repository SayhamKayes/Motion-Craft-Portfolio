import React, { useState } from 'react';
import { ExternalLink, Layers, Sparkles, Eye } from 'lucide-react';
import { Project, SiteSettings } from '../../types';
import { playSound } from '../../utils/audio';

interface WorksSectionProps {
  isActive: boolean;
  projects: Project[];
  settings: SiteSettings;
  onSelectProject: (project: Project) => void;
  onOpenAllWorks: () => void;
}

export const WorksSection: React.FC<WorksSectionProps> = ({
  isActive,
  projects,
  settings,
  onSelectProject,
  onOpenAllWorks,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories: string[] = ['All', ...Array.from(new Set<string>(projects.map((p) => p.category)))];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section
      id="section-works"
      className="relative w-full h-screen flex flex-col px-6 sm:px-16 pt-30 pb-8 overflow-hidden select-none"
    >
      {/* Header & Filter Bar */}
      <div
        className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
          }`}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 uppercase tracking-widest mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>02 / Portfolio Works</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Selected Works
          </h2>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.04] p-1 rounded-full border border-white/10 self-start sm:self-auto">
          {categories.map((cat: string) => {
            const isCatActive = activeCategory === cat;
            return (
              <button
                key={cat}
                id={`filter-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  playSound('hover', settings.soundEnabled);
                  setActiveCategory(cat);
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

      {/* Projects Grid Container (No Scroll) */}
      <div
        id="works-grid-container"
        className="mt-8 py-3 pr-1.5 flex flex-col items-center overflow-y-auto max-h-[68vh] scrollbar-thin"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.slice(0, 3).map((project, idx) => {
            return (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                onClick={() => {
                  playSound('click', settings.soundEnabled);
                  onSelectProject(project);
                }}
                style={{
                  transitionDelay: `${idx * 80 + 100}ms`,
                }}
                className={`group relative rounded-xl overflow-hidden glass-panel border border-white/10 hover:border-cyan-400/50 transition-all duration-500 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
              >
                {/* Image Thumbnail with Overlay */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:filter group-hover:brightness-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c12] via-[#0b0c12]/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono-code text-cyan-300 border border-cyan-400/30">
                      {project.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono-code text-white/70 border border-white/10">
                      {project.year}
                    </span>
                  </div>

                  {/* Hover Peek Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                    <span className="px-4 py-1.5 rounded-full bg-cyan-400 text-slate-950 font-mono-code text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_#22d3ee]">
                      <Eye className="w-3.5 h-3.5" />
                      <span>VIEW DETAILS</span>
                    </span>
                  </div>
                </div>

                {/* Card Content Info */}
                <div className="p-4 sm:p-5">
                  <div className="text-[10px] font-mono-code text-emerald-400 uppercase tracking-wider mb-1">
                    Client: {project.client}
                  </div>
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-white/50 line-clamp-2 mt-1.5 font-body leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono-code px-2 py-0.5 rounded bg-white/[0.04] text-white/60 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded text-white/40">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Works Button */}
        <div className={`mt-8 sm:mt-10 flex justify-center w-full transition-all duration-700 delay-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button
            onClick={() => {
              playSound('click', settings.soundEnabled);
              onOpenAllWorks();
            }}
            className="px-6 py-2.5 rounded-full border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 text-xs font-mono-code tracking-wider uppercase font-semibold transition-all flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            <span>View All Works</span>
          </button>
        </div>
      </div>

      {/* Bottom Hint */}
      <div
        className={`mt-auto flex items-center justify-between text-xs text-white/40 font-mono-code pt-3 border-t border-white/10 transition-all duration-700 delay-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        <span>CLICK ANY PROJECT &amp; SEE DETAIL</span>
        <span className="text-cyan-400/80">FEATURING BEST WORKS</span>
      </div>
    </section>
  );
};
