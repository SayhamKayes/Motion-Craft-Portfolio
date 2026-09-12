import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Github, Filter, Check, LayoutGrid, Eye } from 'lucide-react';
import { Project } from '../types';

interface AllWorksViewProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export function AllWorksView({ isOpen, onClose, projects, onSelectProject }: AllWorksViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Extract unique categories
  const categories: string[] = ['All', ...Array.from(new Set<string>(projects.map(p => p.category)))];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0c10] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <header className="flex-none p-6 sm:p-8 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white uppercase tracking-wider">All Works</h2>
            <p className="text-xs font-mono-code text-white/50">{projects.length} Projects Total</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-3 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          title="Close View"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      {/* Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-12 scrollbar-thin">
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const isCatActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-mono-code rounded-full transition-all ${
                  isCatActive
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => {
                onSelectProject(project);
              }}
              className="group relative rounded-xl overflow-hidden glass-panel border border-white/10 hover:border-cyan-400/50 transition-all duration-500 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
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
          ))}
        </div>
        
      </div>
    </div>
  );
}
