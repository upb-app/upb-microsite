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

// Konfigurasi Resmi Firebase Universitas Pelita Bangsa (Production)
const firebaseConfig = {
  apiKey: "AIzaSyAihSxnEjSQR04I4m92NoO-o5DJYj8FYUA",
  authDomain: "upb-microsite.firebaseapp.com",
  projectId: "upb-microsite",
  storageBucket: "upb-microsite.firebasestorage.app",
  messagingSenderId: "952053384507",
  appId: "1:952053384507:web:f1164a1fc956cb4bb4a31e",
  measurementId: "G-8XL8G9PP9N"
};

// Inisialisasi Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey.startsWith("AIzaSy")
  );
};
