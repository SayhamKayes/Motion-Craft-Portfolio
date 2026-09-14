export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  client: string;
  role: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
  featured: boolean;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 0 to 100
  description: string;
  iconTag: string;
  order: number;
  sliderRow?: 'top' | 'middle' | 'bottom';
  customIconUrl?: string;
}

export interface Profile {
  name: string;
  kanjiName: string;
  title: string;
  location: string;
  bio: string;
  statement: string;
  availability: string;
  email: string;
  github?: string;
  twitter?: string;
  dribbble?: string;
  whatsapp?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  resumeUrl: string;
  awards: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SiteSettings {
  soundEnabled: boolean;
  parallaxEnabled: boolean;
  parallaxIntensity: number; // e.g. 1.0
  snapScrollEnabled: boolean;
  showJapaneseKanji: boolean;
  adminUsername?: string;
  adminPassword?: string;
  adminEmail?: string;
  testimonialMinRating?: number; // Minimum stars to show, e.g., 4
  showOnlyApprovedTestimonials?: boolean; // Default should be true to avoid spam
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  country?: string;
  rating: number; // 1 to 5
  message: string;
  image?: string; // Base64 or URL
  status: 'pending' | 'approved' | 'rejected';
  isAdminAdded?: boolean;
  createdAt: string;
}
