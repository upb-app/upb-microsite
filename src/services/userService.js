import { db, isFirebaseConfigured } from './firebase.js';
import { doc, setDoc, getDoc, getDocFromServer, onSnapshot } from 'firebase/firestore';
import { 
  cleanObjectForFirestore, 
  encodeFirestoreFields, 
  decodeFirestoreFields 
} from './micrositeService.js';
import { hashPassword } from '../utils/security.js';

export const USERS_STORAGE_KEY = 'upb_auth_users_db_v2';
export const AUDIT_STORAGE_KEY = 'upb_security_audit_logs';

export const DEFAULT_USERS = [
  {
    id: 'user-superadmin-01',
    name: 'Super Administrator UPB',
    email: 'superadmin@pelitabangsa.ac.id',
    password: 'PasswordSuper123!',
    role: 'superadmin',
    department: 'Direktorat Sistem Informasi & Humas',
    status: 'active',
    assignedSlugs: ['*'],
    createdAt: '2026-01-15T08:00:00.000Z',
    lastLogin: '2026-09-27T08:00:00.000Z'
  },
  {
    id: 'user-admisi-02',
    name: 'Admin Admisi & PMB',
    email: 'admin.pmb@pelitabangsa.ac.id',
    password: 'PasswordPMB2026!',
    role: 'admin_pmb',
    department: 'Pusat Penerimaan Mahasiswa Baru',
    status: 'active',
    assignedSlugs: ['informasiupb', 'pmb-utama', 'gruppmbupb2026'],
    createdAt: '2026-02-01T09:30:00.000Z',
    lastLogin: null
  },
  {
    id: 'user-fastikom-03',
    name: 'Admin FASTIKOM',
    email: 'admin.fastikom@pelitabangsa.ac.id',
    password: 'PasswordFastikom2026!',
    role: 'admin_fakultas',
    department: 'Fakultas Teknik & Ilmu Komputer',
    status: 'active',
    assignedSlugs: ['fakultas-teknik', 'fikt-upb'],
    createdAt: '2026-02-10T11:15:00.000Z',
    lastLogin: null
  },
  {
    id: 'user-feb-04',
    name: 'Admin FEB',
    email: 'admin.feb@pelitabangsa.ac.id',
    password: 'PasswordFEB2026!',
    role: 'admin_fakultas',
    department: 'Fakultas Ekonomi & Bisnis',
    status: 'active',
    assignedSlugs: ['fakultas-ekonomi-bisnis'],
    createdAt: '2026-03-01T10:00:00.000Z',
    lastLogin: null
  },
  {
    id: 'user-hukum-05',
    name: 'Admin Fakultas Hukum',
    email: 'admin.hukum@pelitabangsa.ac.id',
    password: 'PasswordHukum2026!',
    role: 'admin_fakultas',
    department: 'Fakultas Hukum',
    status: 'active',
    assignedSlugs: ['fakultas-hukum'],
    createdAt: '2026-03-15T14:00:00.000Z',
    lastLogin: null
  }
];

let sharedUserChannel = null;
function getUserChannel() {
  if (typeof BroadcastChannel === 'undefined') return null;
  if (!sharedUserChannel) {
    try {
      sharedUserChannel = new BroadcastChannel('upb_users_sync_channel');
    } catch (e) {
      return null;
    }
  }
  return sharedUserChannel;
}

/**
 * Mengambil daftar pengguna langsung dari Google Cloud Firestore
 */
export async function fetchUsersFromCloud() {
  let cloudUsers = null;

  // 1. Ambil via Firebase SDK
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'microsites_registry', 'system_users');
      let snap;
      try {
        snap = await getDocFromServer(docRef);
      } catch (_e) {
        snap = await getDoc(docRef);
      }
      if (snap && snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data?.usersList) && data.usersList.length > 0) {
          cloudUsers = data.usersList;
        }
      }
    } catch (err) {
      console.warn('Firestore user fetch notice, trying REST:', err);
    }
  }

  // 2. Fallback via Firestore REST API
  if (!cloudUsers) {
    try {
      const res = await fetch(`https://firestore.googleapis.com/v1/projects/upb-microsite/databases/(default)/documents/microsites_registry/system_users?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.fields) {
          const decoded = decodeFirestoreFields(json.fields);
          if (Array.isArray(decoded?.usersList) && decoded.usersList.length > 0) {
            cloudUsers = decoded.usersList;
          }
        }
      }
    } catch (restErr) {}
  }

  // 3. Jika belum ada di Cloud, inisialisasi dengan DEFAULT_USERS dan simpan ke Cloud
  if (!cloudUsers || cloudUsers.length === 0) {
    const initializedUsers = await Promise.all(DEFAULT_USERS.map(async (u) => ({
      ...u,
      password: await hashPassword(u.password)
    })));
    await saveUsersToCloud(initializedUsers);
    return initializedUsers;
  }

  // Simpan ke local cache
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(cloudUsers));
    }
  } catch (e) {}

  return cloudUsers;
}

/**
 * Menyimpan seluruh daftar pengguna ke Google Cloud Firestore
 */
export async function saveUsersToCloud(usersList) {
  if (!Array.isArray(usersList)) return false;

  const nowIso = new Date().toISOString();
  const cleanList = cleanObjectForFirestore(usersList);

  const payload = {
    id: 'system_users',
    updatedAt: nowIso,
    usersList: cleanList
  };

  // 1. Simpan via Firebase SDK
  let sdkSuccess = false;
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'microsites_registry', 'system_users');
      await setDoc(docRef, payload);
      sdkSuccess = true;
    } catch (err) {
      console.warn('Firestore SDK save user warning, fallback to REST:', err);
    }
  }

  // 2. Simpan via REST PATCH
  try {
    const encoded = encodeFirestoreFields(payload);
    await fetch(`https://firestore.googleapis.com/v1/projects/upb-microsite/databases/(default)/documents/microsites_registry/system_users`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: encoded })
    });
  } catch (restErr) {
    if (!sdkSuccess) {
      console.error('Firestore REST save users error:', restErr);
    }
  }

  // 3. Cache ke LocalStorage
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(cleanList));
    }
  } catch (e) {}

  // 4. Broadcast ke tab lain
  try {
    const ch = getUserChannel();
    if (ch) {
      ch.postMessage({ type: 'USERS_UPDATED', users: cleanList, updatedAt: nowIso });
    }
  } catch (e) {}

  return true;
}

/**
 * Catat event Audit Keamanan ke Google Cloud Firestore
 */
export async function recordAuditLogToCloud(action, details, userEmail = 'System') {
  const newLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    action,
    details,
    user: userEmail,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : 'Server',
    ip: '182.22.10.173'
  };

  // 1. Simpan ke local cache terlebih dahulu
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
      const logs = raw ? JSON.parse(raw) : [];
      const updated = [newLog, ...logs].slice(0, 150);
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (e) {}

  // 2. Kirim ke Cloud Firestore
  try {
    let existingLogs = [];
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDoc(doc(db, 'microsites_registry', 'audit_logs'));
        if (snap.exists()) {
          existingLogs = snap.data()?.logsList || [];
        }
      } catch (_e) {}
    }

    const updatedLogs = [newLog, ...existingLogs].slice(0, 100);
    const payload = {
      id: 'audit_logs',
      updatedAt: new Date().toISOString(),
      logsList: cleanObjectForFirestore(updatedLogs)
    };

    if (isFirebaseConfigured() && db) {
      await setDoc(doc(db, 'microsites_registry', 'audit_logs'), payload).catch(() => {});
    }

    const encoded = encodeFirestoreFields(payload);
    await fetch(`https://firestore.googleapis.com/v1/projects/upb-microsite/databases/(default)/documents/microsites_registry/audit_logs`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: encoded })
    }).catch(() => {});
  } catch (e) {}

  return newLog;
}

/**
 * Mengambil log audit keamanan dari Google Cloud Firestore
 */
export async function fetchAuditLogsFromCloud() {
  let logs = [];

  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDoc(doc(db, 'microsites_registry', 'audit_logs'));
      if (snap.exists() && Array.isArray(snap.data()?.logsList)) {
        logs = snap.data().logsList;
      }
    } catch (e) {}
  }

  if (logs.length === 0) {
    try {
      const res = await fetch(`https://firestore.googleapis.com/v1/projects/upb-microsite/databases/(default)/documents/microsites_registry/audit_logs?t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.fields) {
          const decoded = decodeFirestoreFields(json.fields);
          if (Array.isArray(decoded?.logsList)) {
            logs = decoded.logsList;
          }
        }
      }
    } catch (e) {}
  }

  if (logs.length === 0 && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (raw) logs = JSON.parse(raw);
    } catch (e) {}
  }

  return logs;
}

/**
 * Subscribe real-time ke pembaruan daftar user di Firestore
 */
export function subscribeToUsers(onUpdate) {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'microsites_registry', 'system_users');
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data?.usersList) && onUpdate) {
            onUpdate(data.usersList);
          }
        }
      }, (err) => {
        console.warn('Firestore user snapshot notice:', err);
      });
      return unsubscribe;
    } catch (e) {}
  }
  return () => {};
}
