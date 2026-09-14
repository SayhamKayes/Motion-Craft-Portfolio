import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import type { Testimonial } from '../types';

const COLLECTION_NAME = 'portfolio_messages';

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('isTestimonial', '==', true));
    const querySnapshot = await getDocs(q);
    const testimonials: Testimonial[] = [];
    querySnapshot.forEach((doc) => {
      testimonials.push({ id: doc.id, ...doc.data() } as Testimonial);
    });
    // Sort by newest first
    return testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error getting testimonials:', error);
    return [];
  }
};

import { onSnapshot } from 'firebase/firestore';

export const subscribeToTestimonials = (callback: (testimonials: Testimonial[]) => void): (() => void) => {
  const q = query(collection(db, COLLECTION_NAME), where('isTestimonial', '==', true));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const testimonials: Testimonial[] = [];
    querySnapshot.forEach((doc) => {
      testimonials.push({ id: doc.id, ...doc.data() } as Testimonial);
    });
    // Sort by newest first
    testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(testimonials);
  }, (error) => {
    console.error('Error in testimonials subscription:', error);
    callback([]);
  });
  
  return unsubscribe;
};

export const addTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'createdAt'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...testimonialData,
      isTestimonial: true,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding testimonial:', error);
    return null;
  }
};

export const updateTestimonial = async (id: string, updates: Partial<Testimonial>): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return false;
  }
};

export const deleteTestimonial = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return false;
  }
};
