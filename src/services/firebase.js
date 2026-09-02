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

// Helper pembersih nilai env (menghapus spasi dan tanda kutip yang tidak sengaja terbawa)
const cleanEnv = (val, defaultVal = '') => {
  if (!val) return defaultVal;
  return String(val).replace(/^["']|["']$/g, '').trim();
};

const rawApiKey = cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY);

// Default / Environment Firebase Configuration
const firebaseConfig = {
  apiKey: rawApiKey || "AIzaSyDemoKeyForUPBMicrositeHub2026",
  authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, "upb-microsite-hub.firebaseapp.com"),
  projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID, "upb-microsite-hub"),
  storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, "upb-microsite-hub.appspot.com"),
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, "1029384756"),
  appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID, "1:1029384756:web:abcdef123456")
};

// Inisialisasi Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export const isFirebaseConfigured = () => {
  return Boolean(
    rawApiKey && 
    rawApiKey !== "AIzaSyDemoKeyForUPBMicrositeHub2026" &&
    rawApiKey.startsWith("AIzaSy")
  );
};
