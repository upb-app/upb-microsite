import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updatePassword
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Helper pembersih nilai env
const cleanEnv = (val, defaultVal = '') => {
  if (!val) return defaultVal;
  return String(val).replace(/^["']|["']$/g, '').trim();
};

// Konfigurasi Resmi Firebase Universitas Pelita Bangsa
const firebaseConfig = {
  apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY, "AIzaSyAihSxnEjSQR04I4m92NoO-o5DJYj8FYUA"),
  authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, "upb-microsite.firebaseapp.com"),
  projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID, "upb-microsite"),
  storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, "upb-microsite.firebasestorage.app"),
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, "952053384507"),
  appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID, "1:952053384507:web:f1164a1fc956cb4bb4a31e"),
  measurementId: cleanEnv(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, "G-8XL8G9PP9N")
};

// Inisialisasi Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey.startsWith("AIzaSy") &&
    firebaseConfig.apiKey !== "AIzaSyDemoKeyForUPBMicrositeHub2026"
  );
};
