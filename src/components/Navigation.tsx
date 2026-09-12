import React, { useState } from 'react';
import { Volume2, VolumeX, Shield, Menu, X, Sparkles } from 'lucide-react';
import { Profile, SiteSettings } from '../types';
import { playSound } from '../utils/audio';

interface NavigationProps {
  activeSection: number;
  onNavigate: (index: number) => void;
  profile: Profile;
  settings: SiteSettings;
  onToggleSound: () => void;
  onOpenAdmin: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onNavigate,
  profile,
  settings,
  onToggleSound,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { num: '01', label: 'HOME', jp: 'ホーム' },
    { num: '02', label: 'WORKS', jp: '実績' },
    { num: '03', label: 'ABOUT', jp: '私について' },
    { num: '04', label: 'SKILLS', jp: 'スキル' },
    { num: '05', label: 'CONTACT', jp: 'お問い合わせ' },
  ];

  const handleNavClick = (idx: number) => {
    playSound('click', settings.soundEnabled);
    onNavigate(idx);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        id="main-navigation-header"
        className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 py-5 flex items-center justify-between pointer-events-auto select-none"
      >
        {/* Brand Monogram */}
        <button
          id="brand-logo-btn"
          onClick={() => handleNavClick(0)}
          className="group flex items-center gap-3 text-left focus:outline-none"
          title="Return to Home"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-400 p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <div className="w-full h-full bg-[#0b0c12] rounded-[6.5px] flex items-center justify-center font-display font-black text-xs text-white tracking-widest">
              KY
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-sm sm:text-base tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                {profile.name.toUpperCase()}
              </span>
              {settings.showJapaneseKanji && (
                <span className="font-japanese text-xs px-1.5 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">
                  {profile.kanjiName}
                </span>
              )}
            </div>
            <p className="text-[10px] tracking-widest text-white/50 uppercase font-mono-code hidden sm:block">
              Web Designer &amp; Front-End
            </p>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-1 bg-white/[0.04] backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {sections.map((sec, idx) => {
            const isActive = activeSection === idx;
            return (
              <button
                key={sec.num}
                id={`nav-link-${sec.label.toLowerCase()}`}
                onClick={() => handleNavClick(idx)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-mono-code tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.2)] font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="text-cyan-400/70 mr-1 text-[10px]">{sec.num}</span>
                <span>{sec.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions Controls (Sound, Admin, Menu) */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={() => {
              playSound('toggle', !settings.soundEnabled);
              onToggleSound();
            }}
            className={`p-2 sm:px-3 sm:py-2 rounded-full border text-xs font-mono-code flex items-center gap-2 transition-all ${
              settings.soundEnabled
                ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:border-cyan-400'
                : 'border-white/10 bg-white/[0.03] text-white/40 hover:text-white/70'
            }`}
            title={settings.soundEnabled ? 'Disable Audio Effects' : 'Enable Audio Effects'}
          >
            {settings.soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline text-[11px] tracking-wider">SOUND ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px] tracking-wider">MUTE</span>
              </>
            )}
          </button>

          {/* Admin Portal Button */}
          <button
            id="admin-portal-open-btn"
            onClick={() => {
              playSound('click', settings.soundEnabled);
              onOpenAdmin();
            }}
            className="px-3 py-2 rounded-full border border-purple-500/40 bg-purple-950/30 text-purple-300 hover:bg-purple-900/40 hover:border-purple-400 transition-all text-xs font-mono-code flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
            title="Manage Portfolio Content & Database"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline text-[11px] tracking-wider font-semibold">ADMIN CMS</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => {
              playSound('click', settings.soundEnabled);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-full border border-white/15 bg-white/5 text-white/90 hover:bg-white/10"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-overlay"
          className="fixed inset-0 z-30 bg-[#0a0c16]/95 backdrop-blur-xl lg:hidden flex flex-col justify-center px-8 sm:px-16"
        >
          <div className="flex items-center gap-2 mb-8 text-cyan-400 font-mono-code text-xs tracking-widest uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Navigation Menu / ナビゲーション</span>
          </div>

          <div className="space-y-4">
            {sections.map((sec, idx) => (
              <button
                key={sec.num}
                id={`mobile-nav-link-${sec.label.toLowerCase()}`}
                onClick={() => handleNavClick(idx)}
                className={`w-full flex items-center justify-between py-3 border-b border-white/10 text-left transition-all ${
                  activeSection === idx
                    ? 'text-cyan-400 border-cyan-400/40 pl-3'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono-code text-xs text-white/40">{sec.num}</span>
                  <span className="font-display font-extrabold text-2xl tracking-tight">{sec.label}</span>
                </div>
                <span className="font-japanese text-sm text-white/30">{sec.jp}</span>
              </button>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-mono-code">
            <span>TOKYO &amp; KOBE, JAPAN</span>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-purple-400 hover:text-purple-300 underline underline-offset-4"
            >
              Open Admin CMS →
            </button>
          </div>
        </div>
      )}
    </>
  );
};
