import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { ParallaxBackground } from './components/ParallaxBackground';
import { SectionIndicator } from './components/SectionIndicator';
import { CustomCursor } from './components/CustomCursor';
import { HomeSection } from './components/sections/HomeSection';
import { WorksSection } from './components/sections/WorksSection';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ContactSection } from './components/sections/ContactSection';
import { ProjectModal } from './components/ProjectModal';
import { AdminPanel } from './components/AdminPanel';
import { AllWorksView } from './components/AllWorksView';
import { Profile, Project, Skill, SiteSettings, ContactMessage } from './types';
import {
  initialProfile,
  initialProjects,
  initialSkills,
  initialSettings,
} from './data/initialData';
import {
  initializeDatabase,
  subscribeToProfile,
  subscribeToProjects,
  subscribeToSkills,
  subscribeToSettings,
  subscribeToMessages,
  updateSettings,
} from './services/portfolioService';
import { playSound } from './utils/audio';

export default function App() {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAllWorksOpen, setIsAllWorksOpen] = useState<boolean>(false);

  const totalSections = 5;
  const isScrollingRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number>(0);

  useEffect(() => {
    initializeDatabase();

    const unsubProfile = subscribeToProfile((p) => setProfile(p));
    const unsubProjects = subscribeToProjects((pr) => setProjects(pr));
    const unsubSkills = subscribeToSkills((sk) => setSkills(sk));
    const unsubSettings = subscribeToSettings((st) => setSettings(st));
    const unsubMessages = subscribeToMessages((msg) => setMessages(msg));

    return () => {
      unsubProfile();
      unsubProjects();
      unsubSkills();
      unsubSettings();
      unsubMessages();
    };
  }, []);

  // Safe section navigation
  const navigateToSection = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalSections) return;
      if (index === activeSection) return;

      playSound('slide', settings.soundEnabled);
      setActiveSection(index);
    },
    [activeSection, settings.soundEnabled, totalSections]
  );

  // FullPage.js Snap-Scroll Wheel Interceptor
  useEffect(() => {
    if (!settings.snapScrollEnabled || isAdminOpen || selectedProject !== null || isAllWorksOpen) {
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      // Don't snap if scrolling inside an internal scrollable element that hasn't reached bounds
      const target = e.target as HTMLElement | null;
      const scrollable = target?.closest('.overflow-y-auto') as HTMLElement | null;

      if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
        const atTop = scrollable.scrollTop <= 2 && e.deltaY < 0;
        const atBottom =
          scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 2 &&
          e.deltaY > 0;

        if (!atTop && !atBottom) {
          // Allow normal scroll inside the container
          return;
        }
      }

      if (isScrollingRef.current) return;

      if (Math.abs(e.deltaY) > 25) {
        if (e.deltaY > 0 && activeSection < totalSections - 1) {
          isScrollingRef.current = true;
          navigateToSection(activeSection + 1);
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 850);
        } else if (e.deltaY < 0 && activeSection > 0) {
          isScrollingRef.current = true;
          navigateToSection(activeSection - 1);
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 850);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeSection, totalSections, navigateToSection, settings.snapScrollEnabled, isAdminOpen, selectedProject, isAllWorksOpen]);

  // Touch Swipe navigation for mobile
  useEffect(() => {
    if (isAdminOpen || selectedProject !== null || isAllWorksOpen) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrollingRef.current) return;
      
      const target = e.target as HTMLElement | null;
      const scrollable = target?.closest('.overflow-y-auto') as HTMLElement | null;
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartYRef.current - touchEndY;

      if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
        const atTop = scrollable.scrollTop <= 2 && diffY < 0;
        const atBottom =
          scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 2 &&
          diffY > 0;

        if (!atTop && !atBottom) {
          // Allow normal scroll inside the container
          return;
        }
      }

      if (Math.abs(diffY) > 50) {
        if (diffY > 0 && activeSection < totalSections - 1) {
          isScrollingRef.current = true;
          navigateToSection(activeSection + 1);
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 850);
        } else if (diffY < 0 && activeSection > 0) {
          isScrollingRef.current = true;
          navigateToSection(activeSection - 1);
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 850);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeSection, totalSections, navigateToSection, isAdminOpen, selectedProject, isAllWorksOpen]);

  // Keyboard navigation (Arrow keys, PageUp, PageDown)
  useEffect(() => {
    if (isAdminOpen || selectedProject !== null || isAllWorksOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        navigateToSection(activeSection + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        navigateToSection(activeSection - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        navigateToSection(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        navigateToSection(totalSections - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, totalSections, navigateToSection, isAdminOpen, selectedProject, isAllWorksOpen]);

  const toggleSound = async () => {
    const updated = !settings.soundEnabled;
    setSettings((prev) => ({ ...prev, soundEnabled: updated }));
    await updateSettings({ soundEnabled: updated });
  };

  return (
    <div id="kuon-yagi-app" className="relative w-screen h-screen overflow-hidden bg-[#0b0c10] text-[#e5e7eb]">
      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* 3D Mouse Parallax & Dynamic Colorful SVG Wave Background */}
      <ParallaxBackground activeSection={activeSection} settings={settings} />

      {/* Top Header Navigation */}
      <Navigation
        activeSection={activeSection}
        onNavigate={navigateToSection}
        profile={profile}
        settings={settings}
        onToggleSound={toggleSound}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* FullPage.js Snap-Scroll Side Indicator */}
      <SectionIndicator
        totalSections={totalSections}
        activeSection={activeSection}
        onNavigate={navigateToSection}
        soundEnabled={settings.soundEnabled}
      />

      {/* Main FullPage Snap Slide Track */}
      <main
        id="fullpage-slides-container"
        className="relative w-full h-full will-change-transform transition-transform duration-[850ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{
          transform: `translate3d(0, -${activeSection * 100}vh, 0)`,
        }}
      >
        {/* Section 01: HOME */}
        <HomeSection
          isActive={activeSection === 0}
          profile={profile}
          settings={settings}
          onExploreWorks={() => navigateToSection(1)}
          onContactClick={() => navigateToSection(4)}
        />

        {/* Section 02: WORKS */}
        <WorksSection
          isActive={activeSection === 1}
          projects={projects}
          settings={settings}
          onSelectProject={(proj) => setSelectedProject(proj)}
          onOpenAllWorks={() => setIsAllWorksOpen(true)}
        />

        {/* Section 03: ABOUT */}
        <AboutSection
          isActive={activeSection === 2}
          profile={profile}
          settings={settings}
          onNavigateSkills={() => navigateToSection(3)}
          onNavigateContact={() => navigateToSection(4)}
        />

        {/* Section 04: SKILLS */}
        <SkillsSection
          isActive={activeSection === 3}
          skills={skills}
          settings={settings}
        />

        {/* Section 05: CONTACT */}
        <ContactSection
          isActive={activeSection === 4}
          profile={profile}
          settings={settings}
        />
      </main>

      {/* All Works Full View */}
      <AllWorksView
        isOpen={isAllWorksOpen}
        onClose={() => setIsAllWorksOpen(false)}
        projects={projects}
        onSelectProject={(proj) => setSelectedProject(proj)}
      />

      {/* Project Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Full Management Admin CMS Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        profile={profile}
        projects={projects}
        skills={skills}
        settings={settings}
        messages={messages}
      />
    </div>
  );
}
