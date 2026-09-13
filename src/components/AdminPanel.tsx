import React, { useState } from 'react';
import {
  X,
  Database,
  Briefcase,
  Cpu,
  Mail,
  User,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  LogOut,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Profile, Project, Skill, SiteSettings, ContactMessage } from '../types';
import {
  updateProfile,
  updateSettings,
  addProject,
  updateProject,
  deleteProject,
  addSkill,
  updateSkill,
  deleteSkill,
  markMessageRead,
  deleteMessage,
  resetDatabaseToDefaults,
} from '../services/portfolioService';
import { playSound } from '../utils/audio';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  settings: SiteSettings;
  messages: ContactMessage[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  profile,
  projects,
  skills,
  settings,
  messages,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'messages' | 'settings'>('projects');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default accessible for seamless live CMS experience
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Editable Profile State
  const [profileForm, setProfileForm] = useState<Profile>(profile);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Editable Project State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
    title: '',
    subtitle: '',
    category: 'Web Design',
    year: '2026',
    client: '',
    role: 'Lead Designer & Developer',
    description: '',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    link: 'https://kuon-yagi-portfolio.netlify.app/',
    tags: ['React', 'TypeScript', 'fullPage.js'],
    featured: true,
    order: projects.length + 1,
  });
  const [tagsInput, setTagsInput] = useState('');

  // Editable Skill State
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillForm, setSkillForm] = useState<Omit<Skill, 'id'>>({
    name: '',
    category: 'Core Front-End',
    level: 90,
    description: '',
    iconTag: 'DEV',
    order: skills.length + 1,
    sliderRow: 'top',
    customIconUrl: '',
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [isResetting, setIsResetting] = useState(false);

  // Sync state when props change
  React.useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  React.useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  if (!isOpen) return null;

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await updateProfile(profileForm);
      setProfileSaving(false);
      setProfileSuccess(true);
      playSound('success', settings.soundEnabled);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setProfileSaving(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : projectForm.tags;

    try {
      if (editingProject) {
        await updateProject(editingProject.id, { ...projectForm, tags });
        setEditingProject(null);
      } else {
        await addProject({ ...projectForm, tags });
        setIsAddingProject(false);
      }
      playSound('success', settings.soundEnabled);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      playSound('click', settings.soundEnabled);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, skillForm);
        setEditingSkill(null);
      } else {
        await addSkill(skillForm);
        setIsAddingSkill(false);
      }
      playSound('success', settings.soundEnabled);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await deleteSkill(id);
      playSound('click', settings.soundEnabled);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveSkill = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === skills.length - 1) return;

    const currentSkill = skills[index];
    const targetSkill = skills[direction === 'up' ? index - 1 : index + 1];

    try {
      // Optimistic or just directly update the DB (since we are subscribed to onSnapshot)
      await updateSkill(currentSkill.id, { order: targetSkill.order });
      await updateSkill(targetSkill.id, { order: currentSkill.order });
      playSound('click', settings.soundEnabled);
    } catch (err) {
      console.error(err);
    }
  };

  // Get unique categories for datalist
  const uniqueCategories = Array.from(new Set(skills.map(s => s.category)));

  const handleSettingsUpdate = async (newSettings: Partial<SiteSettings>) => {
    const merged = { ...settingsForm, ...newSettings };
    setSettingsForm(merged);
    await updateSettings(merged);
    playSound('toggle', merged.soundEnabled);
  };

  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        'Warning: This will reset all Profile, Works, Skills, and Settings data back to Kuon Yagi portfolio original defaults. Continue?'
      )
    )
      return;
    setIsResetting(true);
    try {
      await resetDatabaseToDefaults();
      setIsResetting(false);
      playSound('success', settings.soundEnabled);
      alert('Portfolio database has been successfully reset to authentic defaults!');
    } catch (err) {
      console.error(err);
      setIsResetting(false);
    }
  };

  return (
    <div
      id="admin-panel-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-lg p-3 sm:p-6 overflow-hidden"
    >
      <div
        id="admin-panel-container"
        className="relative w-full max-w-5xl h-[90vh] rounded-2xl glass-panel border border-teal-500/40 flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        {/* Admin Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600/30 border border-teal-500/50 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg text-white">
                  Kuon Yagi Portfolio CMS
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono-code border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  FIRESTORE LIVE
                </span>
              </div>
              <p className="text-xs text-white/50 font-mono-code">
                Manage all site content, projects, skills, inquiries &amp; settings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="admin-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 transition-colors"
              aria-label="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Nav Tabs */}
        <div className="px-6 py-2 border-b border-white/10 flex items-center gap-2 overflow-x-auto bg-white/[0.02]">
          {[
            { id: 'projects', label: 'Works & Projects', icon: Briefcase, count: projects.length },
            { id: 'skills', label: 'Skills & Tech', icon: Cpu, count: skills.length },
            { id: 'profile', label: 'Creator Profile', icon: User },
            { id: 'messages', label: 'Inquiries Inbox', icon: Mail, count: messages.filter((m) => !m.read).length },
            { id: 'settings', label: 'Site Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => {
                  playSound('hover', settings.soundEnabled);
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono-code flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-600/30 text-white border border-teal-400/50 font-semibold shadow-[0_0_12px_rgba(20,184,166,0.25)]'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      tab.id === 'messages' && tab.count > 0
                        ? 'bg-emerald-500 text-white font-bold animate-pulse'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {/* TAB 1: PROJECTS / WORKS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Portfolio Works Showcase ({projects.length})
                  </h3>
                  <p className="text-xs text-white/50 font-mono-code">
                    Add, edit, and reorder projects displayed on the Works slide
                  </p>
                </div>
                <button
                  id="admin-add-project-btn"
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm({
                      title: '',
                      subtitle: '',
                      category: 'Web Design',
                      year: new Date().getFullYear().toString(),
                      client: '',
                      role: 'Lead UI/UX & Creative Front-End',
                      description: '',
                      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
                      link: 'https://kuon-yagi-portfolio.netlify.app/',
                      tags: ['React', 'TypeScript', 'fullPage.js'],
                      featured: true,
                      order: projects.length + 1,
                    });
                    setTagsInput('React, TypeScript, fullPage.js');
                    setIsAddingProject(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(20,184,166,0.3)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD NEW PROJECT</span>
                </button>
              </div>

              {/* Add / Edit Form Modal/Drawer */}
              {(isAddingProject || editingProject) && (
                <form
                  onSubmit={handleSaveProject}
                  className="p-5 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-4 animate-in fade-in duration-150"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-display font-bold text-sm text-teal-300">
                      {editingProject ? 'Edit Project' : 'Create New Project'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProject(false);
                        setEditingProject(null);
                      }}
                      className="text-white/40 hover:text-white text-xs font-mono-code"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                        TITLE *
                      </label>
                      <input
                        type="text"
                        required
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                        SUBTITLE
                      </label>
                      <input
                        type="text"
                        value={projectForm.subtitle}
                        onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                        CATEGORY
                      </label>
                      <select
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                      >
                        <option value="Web Design">Web Design</option>
                        <option value="Creative Coding">Creative Coding</option>
                        <option value="Art Direction">Art Direction</option>
                        <option value="E-Commerce">E-Commerce</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                        YEAR
                      </label>
                      <input
                        type="text"
                        value={projectForm.year}
                        onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                        CLIENT
                      </label>
                      <input
                        type="text"
                        value={projectForm.client}
                        onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                        ROLE
                      </label>
                      <input
                        type="text"
                        value={projectForm.role}
                        onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                        IMAGE URL
                      </label>
                      <input
                        type="url"
                        value={projectForm.image}
                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                        TAGS (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="e.g. fullPage.js, SVG Animation, Pug, React"
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                        DESCRIPTION / CASE STUDY
                      </label>
                      <textarea
                        rows={3}
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProject(false);
                        setEditingProject(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono-code"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono-code font-bold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingProject ? 'Update Project' : 'Save Project'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Projects List */}
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl glass-panel-light border border-white/10 flex items-center justify-between gap-4 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-16 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-bold text-sm text-white truncate">
                            {proj.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono-code text-cyan-300">
                            {proj.category}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 truncate">
                          {proj.client} • {proj.year}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setProjectForm({
                            title: proj.title,
                            subtitle: proj.subtitle,
                            category: proj.category,
                            year: proj.year,
                            client: proj.client,
                            role: proj.role,
                            description: proj.description,
                            image: proj.image,
                            link: proj.link,
                            tags: proj.tags,
                            featured: proj.featured,
                            order: proj.order,
                          });
                          setTagsInput(proj.tags.join(', '));
                          setIsAddingProject(false);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Skills &amp; Technologies ({skills.length})
                  </h3>
                  <p className="text-xs text-white/50 font-mono-code">
                    Manage technology badges, proficiency meters &amp; descriptions
                  </p>
                </div>
                <button
                  id="admin-add-skill-btn"
                  onClick={() => {
                    setEditingSkill(null);
                    setSkillForm({
                      name: '',
                      category: 'Core Front-End',
                      level: 90,
                      description: '',
                      iconTag: 'TECH',
                      order: skills.length > 0 ? Math.max(...skills.map(s => s.order)) + 1 : 1,
                      sliderRow: 'top',
                      customIconUrl: '',
                    });
                    setIsAddingSkill(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD NEW SKILL</span>
                </button>
              </div>

              {(isAddingSkill || editingSkill) && (
                <form
                  onSubmit={handleSaveSkill}
                  className="p-5 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-display font-bold text-sm text-teal-300">
                      {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingSkill(false);
                        setEditingSkill(null);
                      }}
                      className="text-white/40 hover:text-white text-xs font-mono-code"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                        SKILL NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={skillForm.name}
                        onChange={(e) => {
                          const newName = e.target.value;
                          setSkillForm(prev => {
                            // If iconTag is empty, try to auto-generate a basic slug
                            const autoSlug = newName.toLowerCase().replace(/[^a-z0-9]/g, '');
                            return {
                              ...prev,
                              name: newName,
                              iconTag: prev.iconTag || autoSlug
                            };
                          });
                        }}
                        placeholder="e.g. React.js"
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                        CATEGORY
                      </label>
                      <input
                        list="skill-categories"
                        value={skillForm.category}
                        onChange={(e) =>
                          setSkillForm({
                            ...skillForm,
                            category: e.target.value,
                          })
                        }
                        placeholder="Select or type new..."
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                      />
                      <datalist id="skill-categories">
                        {uniqueCategories.map(cat => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono-code text-white/60 mb-2">
                        SLIDER ROW OPTION
                      </label>
                      <div className="flex items-center gap-4">
                        {(['top', 'middle', 'bottom'] as const).map(row => (
                          <label key={row} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="sliderRow"
                              value={row}
                              checked={skillForm.sliderRow === row}
                              onChange={() => setSkillForm({ ...skillForm, sliderRow: row })}
                              className="w-3.5 h-3.5 accent-teal-400"
                            />
                            <span className="text-xs text-white capitalize">Slider {row}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                        PROFICIENCY LEVEL: {skillForm.level}%
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={skillForm.level}
                        onChange={(e) =>
                          setSkillForm({ ...skillForm, level: Number(e.target.value) })
                        }
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-mono-code text-white/60">
                          ICON SLUG (SimpleIcons)
                        </label>
                        <a href="https://simpleicons.org" target="_blank" rel="noreferrer" className="text-[9px] text-cyan-400 hover:underline">
                          Find Icons
                        </a>
                      </div>
                      <input
                        type="text"
                        value={skillForm.iconTag}
                        onChange={(e) => setSkillForm({ ...skillForm, iconTag: e.target.value.toLowerCase() })}
                        placeholder="e.g. react"
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none lowercase"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                        CUSTOM ICON URL (Optional - overrides slug above)
                      </label>
                      <input
                        type="url"
                        value={skillForm.customIconUrl || ''}
                        onChange={(e) => setSkillForm({ ...skillForm, customIconUrl: e.target.value })}
                        placeholder="e.g. https://example.com/icon.svg"
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                        DESCRIPTION
                      </label>
                      <textarea
                        rows={2}
                        value={skillForm.description}
                        onChange={(e) =>
                          setSkillForm({ ...skillForm, description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingSkill(false);
                        setEditingSkill(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono-code"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono-code font-bold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingSkill ? 'Update Skill' : 'Save Skill'}</span>
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl glass-panel-light border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{s.name}</span>
                        <span className="text-[10px] font-mono-code text-cyan-400">
                          {s.level}%
                        </span>
                      </div>
                      <p className="text-[10px] font-mono-code text-white/40">{s.category}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingSkill(s);
                          setSkillForm({
                            name: s.name,
                            category: s.category,
                            level: s.level,
                            description: s.description,
                            iconTag: s.iconTag,
                            order: s.order,
                            sliderRow: s.sliderRow || 'top',
                            customIconUrl: s.customIconUrl || '',
                          });
                          setIsAddingSkill(false);
                        }}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-white/80"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="flex flex-col ml-2 gap-0.5">
                        <button
                          onClick={() => handleMoveSkill(skills.indexOf(s), 'up')}
                          disabled={skills.indexOf(s) === 0}
                          className="p-0.5 rounded bg-white/5 hover:bg-white/15 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveSkill(skills.indexOf(s), 'down')}
                          disabled={skills.indexOf(s) === skills.length - 1}
                          className="p-0.5 rounded bg-white/5 hover:bg-white/15 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-5 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Creator Profile &amp; Bio Details
                  </h3>
                  <p className="text-xs text-white/50 font-mono-code">
                    Updates reflect immediately on Home, About &amp; Contact sections
                  </p>
                </div>
                {profileSuccess && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono-code animate-in fade-in">
                    <CheckCircle className="w-4 h-4" />
                    <span>Saved to Firestore!</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                    ENGLISH NAME
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                    JAPANESE KANJI NAME
                  </label>
                  <input
                    type="text"
                    value={profileForm.kanjiName}
                    onChange={(e) => setProfileForm({ ...profileForm, kanjiName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none font-japanese"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                    PROFESSIONAL TITLE
                  </label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                    LOCATION
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                    CONTACT EMAIL
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                    AVAILABILITY STATUS BADGE
                  </label>
                  <input
                    type="text"
                    value={profileForm.availability}
                    onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                    PHILOSOPHY / STATEMENT
                  </label>
                  <input
                    type="text"
                    value={profileForm.statement}
                    onChange={(e) => setProfileForm({ ...profileForm, statement: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono-code text-white/60 mb-1">
                    FULL BIOGRAPHY
                  </label>
                  <textarea
                    rows={4}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-teal-400 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-mono-code text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)] disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{profileSaving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          )}

          {/* TAB 4: INQUIRIES / MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Visitor Inquiries &amp; Messages ({messages.length})
                  </h3>
                  <p className="text-xs text-white/50 font-mono-code">
                    Real-time messages sent through the Contact form into Firestore
                  </p>
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="py-16 text-center text-white/40 font-mono-code text-xs">
                  No inquiries received yet. Visitors can test submitting on the Contact slide!
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-xl border transition-all ${
                        msg.read
                          ? 'glass-panel-light border-white/5 opacity-70'
                          : 'bg-teal-950/20 border-teal-500/40 shadow-md'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{msg.name}</span>
                          <span className="text-xs text-cyan-400 font-mono-code">&lt;{msg.email}&gt;</span>
                          {!msg.read && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-[9px] font-mono-code text-white">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono-code text-white/40">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                          <button
                            onClick={() => markMessageRead(msg.id, !msg.read)}
                            className="text-xs text-white/60 hover:text-white px-2 py-1 rounded bg-white/5"
                          >
                            {msg.read ? 'Mark Unread' : 'Mark Read'}
                          </button>
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="p-1 rounded text-rose-400 hover:bg-rose-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs font-mono-code text-white/90 font-medium mb-1">
                        Subject: {msg.subject}
                      </div>
                      <p className="text-xs text-white/70 font-body leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>

                      <div className="mt-3 pt-2 border-t border-white/5 flex justify-end">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="text-[11px] font-mono-code text-teal-400 hover:text-teal-300 flex items-center gap-1"
                        >
                          <span>Reply via Email</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SETTINGS & DATABASE RESET */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Site Experience &amp; Animation Settings
                </h3>
                <p className="text-xs text-white/50 font-mono-code">
                  Configure interactive behaviors and animations across the replica
                </p>
              </div>

              <div className="space-y-4">
                {/* Sound Toggle */}
                <div className="p-4 rounded-xl glass-panel-light border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-display font-bold text-white">UI Sound Synthesizer</div>
                    <div className="text-xs text-white/50 font-mono-code">
                      Plays tactile audio feedback on section navigation and button interactions
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingsUpdate({ soundEnabled: !settingsForm.soundEnabled })}
                    className={`px-4 py-1.5 rounded-full font-mono-code text-xs font-bold transition-all ${
                      settingsForm.soundEnabled
                        ? 'bg-cyan-500 text-black'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {settingsForm.soundEnabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                {/* Parallax Toggle */}
                <div className="p-4 rounded-xl glass-panel-light border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-display font-bold text-white">Parallax.js 3D Mouse Tracking</div>
                    <div className="text-xs text-white/50 font-mono-code">
                      Moves background SVG waves, geometric shapes, and text inversely to mouse cursor
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleSettingsUpdate({ parallaxEnabled: !settingsForm.parallaxEnabled })
                    }
                    className={`px-4 py-1.5 rounded-full font-mono-code text-xs font-bold transition-all ${
                      settingsForm.parallaxEnabled
                        ? 'bg-cyan-500 text-black'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {settingsForm.parallaxEnabled ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>

                {/* Parallax Intensity */}
                <div className="p-4 rounded-xl glass-panel-light border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs font-mono-code">
                    <span className="text-white">Parallax Depth Multiplier</span>
                    <span className="text-cyan-400 font-bold">{settingsForm.parallaxIntensity}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.0"
                    step="0.1"
                    value={settingsForm.parallaxIntensity}
                    onChange={(e) =>
                      handleSettingsUpdate({ parallaxIntensity: parseFloat(e.target.value) })
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Japanese Kanji Overlay */}
                <div className="p-4 rounded-xl glass-panel-light border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-display font-bold text-white">
                      Japanese Kanji Typography Accents
                    </div>
                    <div className="text-xs text-white/50 font-mono-code">
                      Renders vertical traditional calligraphy watermark ideograms (八木, 動, 創, 匠)
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleSettingsUpdate({ showJapaneseKanji: !settingsForm.showJapaneseKanji })
                    }
                    className={`px-4 py-1.5 rounded-full font-mono-code text-xs font-bold transition-all ${
                      settingsForm.showJapaneseKanji
                        ? 'bg-cyan-500 text-black'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {settingsForm.showJapaneseKanji ? 'SHOWN' : 'HIDDEN'}
                  </button>
                </div>

                {/* Reset to Kuon Yagi Defaults */}
                <div className="mt-8 p-4 rounded-xl border border-rose-500/30 bg-rose-950/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-display font-bold text-rose-300">
                      Reset Portfolio to Original Kuon Yagi Data
                    </div>
                    <div className="text-xs text-white/50 font-mono-code">
                      Restores all default projects, skills, and bio content into Firestore
                    </div>
                  </div>
                  <button
                    onClick={handleResetDefaults}
                    disabled={isResetting}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono-code text-xs font-bold flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                    <span>{isResetting ? 'Resetting...' : 'Reset Database'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
