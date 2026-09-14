import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPanel } from './components/AdminPanel';
import { Shield, Lock, Mail, ArrowLeft } from 'lucide-react';
import { Profile, Project, Skill, SiteSettings, ContactMessage } from './types';
import { playSound } from './utils/audio';
import emailjs from '@emailjs/browser';

export const AdminApp = ({
  profile,
  projects,
  skills,
  settings,
  messages,
}: {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  settings: SiteSettings;
  messages: ContactMessage[];
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validUsername = settings.adminUsername || 'admin';
    const validPassword = settings.adminPassword || 'admin123';

    if (username === validUsername && password === validPassword) {
      playSound('success', settings.soundEnabled);
      setIsAuthenticated(true);
      setError('');
    } else {
      playSound('click', settings.soundEnabled);
      setError('Invalid username or password');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRecoveryMessage('');
    const validEmail = settings.adminEmail || 'sayhamkayes@gmail.com';

    if (recoveryEmail !== validEmail) {
      playSound('click', settings.soundEnabled);
      setError('Email address not found or unauthorized.');
      return;
    }

    setIsRecovering(true);
    try {
      // Read EmailJS credentials from .env
      const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      
      console.log('Env variables:', { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY });

      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || SERVICE_ID === 'YOUR_SERVICE_ID') {
         // Fallback/Demo mode if keys aren't provided
         playSound('success', settings.soundEnabled);
         setRecoveryMessage(`(Demo Mode) Password would be sent to ${validEmail}. Since no EmailJS keys were provided, your password is: ${settings.adminPassword || 'admin123'}`);
         setIsRecovering(false);
         return;
      }

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_email: validEmail,
          password: settings.adminPassword || 'admin123',
        },
        PUBLIC_KEY
      );

      playSound('success', settings.soundEnabled);
      setRecoveryMessage(`Password recovery email sent successfully to ${validEmail}`);
    } catch (err) {
      console.error('Failed to send recovery email', err);
      playSound('click', settings.soundEnabled);
      setError('Failed to send recovery email. Please check credentials or console.');
    } finally {
      setIsRecovering(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="w-screen h-screen bg-[#0b0c10] text-white">
        <AdminPanel
          isOpen={true}
          onClose={() => navigate('/')}
          profile={profile}
          projects={projects}
          skills={skills}
          settings={settings}
          messages={messages}
        />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#0b0c10] text-[#e5e7eb] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#161b22] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-teal-950/50 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 shadow-[0_0_20px_rgba(20,184,166,0.15)]">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="font-display font-black text-2xl text-white">
            {isForgotPassword ? 'Password Recovery' : 'Admin Login'}
          </h2>
          <p className="text-white/50 text-sm font-mono-code mt-2 text-center">
            {isForgotPassword
              ? 'Enter your recovery email address.'
              : 'Restricted access. Please login to continue.'}
          </p>
        </div>

        {isForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-code text-white/60 mb-1.5 uppercase tracking-wider">
                Recovery Email
              </label>
              <input
                type="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-mono-code"
                placeholder="sayhamkayes@gmail.com"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-mono-code">
                {error}
              </div>
            )}
            
            {recoveryMessage && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-mono-code">
                {recoveryMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isRecovering}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              <span>{isRecovering ? 'SENDING...' : 'SEND RECOVERY EMAIL'}</span>
            </button>
            
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                setError('');
                setRecoveryMessage('');
              }}
              className="w-full text-white/40 hover:text-white/70 text-xs font-mono-code transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono-code text-white/60 mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-mono-code"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono-code text-white/60 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-mono-code"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-mono-code">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>ACCESS CMS</span>
          </button>
          
          <div className="text-right">
            <button 
              type="button"
              onClick={() => {
                setIsForgotPassword(true);
                setError('');
              }}
              className="text-teal-400/80 hover:text-teal-300 text-xs font-mono-code transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        </form>
        )}
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-white/40 hover:text-white/70 text-xs font-mono-code underline underline-offset-4 transition-colors"
          >
            ← Return to Main Site
          </button>
        </div>
      </div>
    </div>
  );
};
