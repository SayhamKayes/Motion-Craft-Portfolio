import React, { useState } from 'react';
import { Mail, Send, CheckCircle, Github, Twitter, Dribbble, Codepen, Linkedin, Instagram, Facebook, MapPin, Copy, Check, ExternalLink, MessageCircle } from 'lucide-react';
import { Profile, SiteSettings } from '../../types';
import { sendContactMessage } from '../../services/portfolioService';
import { playSound } from '../../utils/audio';

interface ContactSectionProps {
  isActive: boolean;
  profile: Profile;
  settings: SiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  isActive,
  profile,
  settings,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await sendContactMessage(
        formData.name.trim(),
        formData.email.trim(),
        formData.subject.trim() || 'General Inquiry',
        formData.message.trim()
      );
      setIsSubmitting(false);
      setIsSuccess(true);
      playSound('success', settings.soundEnabled);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      console.error('Failed to send contact message:', err);
      setIsSubmitting(false);
      setErrorMsg('Could not deliver message right now. Please try again or email directly.');
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    playSound('click', settings.soundEnabled);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section
      id="section-contact"
      className="relative w-full h-screen flex flex-col justify-between px-6 sm:px-16 pt-24 pb-8 overflow-hidden select-none"
    >
      {/* Header */}
      <div
        className={`transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
          }`}
      >
        <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 uppercase tracking-widest mb-1">
          <Mail className="w-3.5 h-3.5" />
          <span>05 / Communication</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          Let&apos;s Build Together
        </h2>
      </div>

      {/* Main Content Form & Details Grid */}
      <div
        id="contact-content-grid"
        className="my-auto py-2 overflow-y-auto max-h-[68vh] scrollbar-thin"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Info: Contact details & Socials (5 cols) */}
          <div
            className={`lg:col-span-5 space-y-5 transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
          >
            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-body">
              Interested in a project inquiry, design consultation, or creative engineering collaboration? Feel free to reach out directly.
            </p>

            {/* Email Card with Copy Button */}
            <div className="p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono-code text-cyan-400 uppercase">Direct Email</div>
                <div className="text-sm sm:text-base font-mono-code text-white font-semibold">
                  <a className="cursor-pointer hover:text-white text-decoration-none" href={`mailto:${profile.email}`} target="_blank" rel="noopener noreferrer">{profile.email}</a>
                </div>
              </div>
              <button
                id="copy-email-btn"
                onClick={handleCopyEmail}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                title="Copy Email to Clipboard"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Studio Info */}
            <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono-code text-emerald-400 uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <p className="text-xs text-white/60 font-body">
                <a className="cursor-pointer hover:text-white text-decoration-none" href="https://maps.app.goo.gl/Nos59FfwPTYPAhb68" target="_blank" rel="noopener noreferrer">House #01, Road #17, Block - New C, Mirpur-1, Dhaka, Bangladesh.</a>
              </p>
            </div>

            {/* Social Channels */}
            <div>
              <div className="text-xs font-mono-code text-white/40 uppercase mb-2.5">
                Digital Presence &amp; Profiles
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl glass-panel border border-white/10 text-white/70 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl glass-panel border border-white/10 text-white/70 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.whatsapp && (
                  <a
                    href={profile.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl glass-panel border border-white/10 text-white/70 hover:text-emerald-400 hover:border-emerald-400/40 transition-colors"
                    title="WhatsApp"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                  </a>
                )}
                {profile.facebook && (
                  <a
                    href={profile.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl glass-panel border border-white/10 text-white/70 hover:text-blue-500 hover:border-blue-500/40 transition-colors"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {profile.instagram && (
                  <a
                    href={profile.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl glass-panel border border-white/10 text-white/70 hover:text-emerald-500 hover:border-emerald-500/40 transition-colors"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl glass-panel border border-white/10 text-white/70 hover:text-emerald-400 hover:border-emerald-400/40 transition-colors"
                    title="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {profile.dribbble && (
                  <a
                    href={profile.dribbble}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl glass-panel border border-white/10 text-white/70 hover:text-emerald-400 hover:border-emerald-400/40 transition-colors"
                    title="Dribbble"
                  >
                    <Dribbble className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Form: Real Firestore Message Submission (7 cols) */}
          <div
            className={`lg:col-span-7 transition-all duration-700 delay-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
          >
            <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/10 shadow-xl">
              {isSuccess ? (
                <div
                  id="contact-success-message"
                  className="py-10 text-center space-y-4 animate-in fade-in zoom-in duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 mx-auto flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-black text-2xl text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto font-body">
                    Thank you for reaching out. Your message has been saved into the database and Sayham will respond shortly.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono-code text-white uppercase tracking-wider transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono-code text-cyan-400 uppercase tracking-wider">
                      Send Direct Message
                    </span>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name-input"
                        className="block text-[11px] font-mono-code text-white/60 mb-1"
                      >
                        YOUR NAME *
                      </label>
                      <input
                        id="contact-name-input"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Kenji Tanaka"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs sm:text-sm text-white placeholder-white/20 transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email-input"
                        className="block text-[11px] font-mono-code text-white/60 mb-1"
                      >
                        YOUR EMAIL *
                      </label>
                      <input
                        id="contact-email-input"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. kenji@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs sm:text-sm text-white placeholder-white/20 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject-input"
                      className="block text-[11px] font-mono-code text-white/60 mb-1"
                    >
                      SUBJECT
                    </label>
                    <input
                      id="contact-subject-input"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. New Web Design Project Collaboration"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs sm:text-sm text-white placeholder-white/20 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message-input"
                      className="block text-[11px] font-mono-code text-white/60 mb-1"
                    >
                      MESSAGE *
                    </label>
                    <textarea
                      id="contact-message-input"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell Kuon about your project timeline, vision, and scope..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs sm:text-sm text-white placeholder-white/20 transition-colors resize-none"
                    />
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-mono-code text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>SUBMITTING MESSAGE...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>SUBMIT MESSAGE</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hint & Reference */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 text-xs text-white/40 font-mono-code pt-3 border-t border-white/10 transition-all duration-700 delay-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        <div className="flex items-center gap-2">
          <span>PORTFOLIO:</span>
          <a
            href="https://sayhamkayes.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>sayhamkayes.vercel.app</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <span>© {new Date().getFullYear()} | Sayham Kayes</span>
      </div>
    </section>
  );
};
