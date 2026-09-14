import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FrontEnd from './FrontEnd';
import { AdminApp } from './AdminApp';
import {
  Profile,
  Project,
  Skill,
  SiteSettings,
  ContactMessage,
} from './types';
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
} from './services/portfolioService';

export default function App() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

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

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <FrontEnd
              profile={profile}
              projects={projects}
              skills={skills}
              settings={settings}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminApp
              profile={profile}
              projects={projects}
              skills={skills}
              settings={settings}
              messages={messages}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
