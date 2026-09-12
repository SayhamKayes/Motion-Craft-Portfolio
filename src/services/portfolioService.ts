import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Profile, Project, Skill, SiteSettings, ContactMessage } from '../types';
import {
  initialProfile,
  initialProjects,
  initialSkills,
  initialSettings,
} from '../data/initialData';

const PROFILE_COLLECTION = 'portfolio_profile';
const WORKS_COLLECTION = 'portfolio_works';
const SKILLS_COLLECTION = 'portfolio_skills';
const SETTINGS_COLLECTION = 'portfolio_settings';
const MESSAGES_COLLECTION = 'portfolio_messages';

// Initialize and seed database if empty
export async function initializeDatabase() {
  try {
    // 1. Profile
    const profileRef = doc(db, PROFILE_COLLECTION, 'main');
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
      await setDoc(profileRef, initialProfile);
    }

    // 2. Settings
    const settingsRef = doc(db, SETTINGS_COLLECTION, 'main');
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, initialSettings);
    }

    // 3. Works
    const worksSnap = await getDocs(collection(db, WORKS_COLLECTION));
    if (worksSnap.empty) {
      for (const proj of initialProjects) {
        await setDoc(doc(db, WORKS_COLLECTION, proj.id), proj);
      }
    }

    // 4. Skills
    const skillsSnap = await getDocs(collection(db, SKILLS_COLLECTION));
    if (skillsSnap.empty) {
      for (const skill of initialSkills) {
        await setDoc(doc(db, SKILLS_COLLECTION, skill.id), skill);
      }
    }
  } catch (err) {
    console.warn('Firebase initialization or offline fallback:', err);
  }
}

// Realtime listeners
export function subscribeToProfile(callback: (profile: Profile) => void) {
  const profileRef = doc(db, PROFILE_COLLECTION, 'main');
  return onSnapshot(
    profileRef,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as Profile);
      } else {
        callback(initialProfile);
      }
    },
    (err) => {
      console.warn('Profile listener error:', err);
      callback(initialProfile);
    }
  );
}

export function subscribeToProjects(callback: (projects: Project[]) => void) {
  const worksRef = collection(db, WORKS_COLLECTION);
  const q = query(worksRef, orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        })) as Project[];
        callback(items);
      } else {
        callback(initialProjects);
      }
    },
    (err) => {
      console.warn('Projects listener error:', err);
      callback(initialProjects);
    }
  );
}

export function subscribeToSkills(callback: (skills: Skill[]) => void) {
  const skillsRef = collection(db, SKILLS_COLLECTION);
  const q = query(skillsRef, orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        })) as Skill[];
        callback(items);
      } else {
        callback(initialSkills);
      }
    },
    (err) => {
      console.warn('Skills listener error:', err);
      callback(initialSkills);
    }
  );
}

export function subscribeToSettings(callback: (settings: SiteSettings) => void) {
  const settingsRef = doc(db, SETTINGS_COLLECTION, 'main');
  return onSnapshot(
    settingsRef,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as SiteSettings);
      } else {
        callback(initialSettings);
      }
    },
    (err) => {
      console.warn('Settings listener error:', err);
      callback(initialSettings);
    }
  );
}

export function subscribeToMessages(callback: (messages: ContactMessage[]) => void) {
  const msgRef = collection(db, MESSAGES_COLLECTION);
  return onSnapshot(
    msgRef,
    (snap) => {
      const items = snap.docs.map((d) => ({
        ...d.data(),
        id: d.id,
      })) as ContactMessage[];
      // sort by date descending
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(items);
    },
    (err) => {
      console.warn('Messages listener error:', err);
      callback([]);
    }
  );
}

// CRUD operations
export async function updateProfile(data: Partial<Profile>): Promise<void> {
  const profileRef = doc(db, PROFILE_COLLECTION, 'main');
  await setDoc(profileRef, data, { merge: true });
}

export async function updateSettings(data: Partial<SiteSettings>): Promise<void> {
  const settingsRef = doc(db, SETTINGS_COLLECTION, 'main');
  await setDoc(settingsRef, data, { merge: true });
}

export async function addProject(project: Omit<Project, 'id'>): Promise<string> {
  const colRef = collection(db, WORKS_COLLECTION);
  const docRef = await addDoc(colRef, project);
  return docRef.id;
}

export async function updateProject(id: string, project: Partial<Project>): Promise<void> {
  const docRef = doc(db, WORKS_COLLECTION, id);
  await updateDoc(docRef, project);
}

export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, WORKS_COLLECTION, id);
  await deleteDoc(docRef);
}

export async function addSkill(skill: Omit<Skill, 'id'>): Promise<string> {
  const colRef = collection(db, SKILLS_COLLECTION);
  const docRef = await addDoc(colRef, skill);
  return docRef.id;
}

export async function updateSkill(id: string, skill: Partial<Skill>): Promise<void> {
  const docRef = doc(db, SKILLS_COLLECTION, id);
  await updateDoc(docRef, skill);
}

export async function deleteSkill(id: string): Promise<void> {
  const docRef = doc(db, SKILLS_COLLECTION, id);
  await deleteDoc(docRef);
}

export async function sendContactMessage(name: string, email: string, subject: string, message: string): Promise<void> {
  const colRef = collection(db, MESSAGES_COLLECTION);
  await addDoc(colRef, {
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  });
}

export async function markMessageRead(id: string, read: boolean): Promise<void> {
  const docRef = doc(db, MESSAGES_COLLECTION, id);
  await updateDoc(docRef, { read });
}

export async function deleteMessage(id: string): Promise<void> {
  const docRef = doc(db, MESSAGES_COLLECTION, id);
  await deleteDoc(docRef);
}

export async function resetDatabaseToDefaults(): Promise<void> {
  // Reset profile
  await setDoc(doc(db, PROFILE_COLLECTION, 'main'), initialProfile);
  // Reset settings
  await setDoc(doc(db, SETTINGS_COLLECTION, 'main'), initialSettings);

  // Clear existing works and reset
  const worksSnap = await getDocs(collection(db, WORKS_COLLECTION));
  for (const d of worksSnap.docs) {
    await deleteDoc(d.ref);
  }
  for (const p of initialProjects) {
    await setDoc(doc(db, WORKS_COLLECTION, p.id), p);
  }

  // Clear existing skills and reset
  const skillsSnap = await getDocs(collection(db, SKILLS_COLLECTION));
  for (const d of skillsSnap.docs) {
    await deleteDoc(d.ref);
  }
  for (const s of initialSkills) {
    await setDoc(doc(db, SKILLS_COLLECTION, s.id), s);
  }
}
