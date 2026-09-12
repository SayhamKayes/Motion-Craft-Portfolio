import React, { useEffect } from 'react';
import { X, ExternalLink, Calendar, User, Briefcase, Tag } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      id="project-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl glass-panel border border-cyan-500/40 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-project-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-black/80 transition-colors"
          aria-label="Close Project Details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Image */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-slate-950">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c12] via-[#0b0c12]/50 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-mono-code text-cyan-300 uppercase tracking-wider">
              {project.category}
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1.5">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-mono-code">
              {project.subtitle}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono-code">
            <div>
              <div className="text-white/40 text-[10px] uppercase flex items-center gap-1 mb-0.5">
                <Briefcase className="w-3 h-3" />
                <span>Client</span>
              </div>
              <div className="text-white font-medium truncate">{project.client}</div>
            </div>

            <div>
              <div className="text-white/40 text-[10px] uppercase flex items-center gap-1 mb-0.5">
                <Calendar className="w-3 h-3" />
                <span>Year</span>
              </div>
              <div className="text-white font-medium">{project.year}</div>
            </div>

            <div>
              <div className="text-white/40 text-[10px] uppercase flex items-center gap-1 mb-0.5">
                <User className="w-3 h-3" />
                <span>Role</span>
              </div>
              <div className="text-white font-medium truncate">{project.role}</div>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono-code text-cyan-400 uppercase tracking-wider">
              Project Architecture &amp; Craft
            </h4>
            <p className="text-sm text-white/80 leading-relaxed font-body">
              {project.description}
            </p>
          </div>

          {/* Technology Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-mono-code text-pink-400 uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              <span>Implemented Technologies</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-xs font-mono-code text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono-code text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Close
            </button>

            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-white font-mono-code text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
            >
              <span>Visit Live Case</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
