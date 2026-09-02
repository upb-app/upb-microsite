/**
 * Real-Time Analytics & Tracking Service
 * Melacak kunjungan (views), klik tombol (clicks), jenis perangkat, dan aktivitas real-time
 */
import { db, isFirebaseConfigured } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  increment, 
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore';

const LOCAL_ANALYTICS_KEY = 'upb_realtime_analytics_data_v2';
const LOCAL_ACTIVITY_LOGS_KEY = 'upb_realtime_activity_logs_v2';

// Deteksi perangkat pengunjung
export function detectDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

/**
 * Catat Kunjungan Halaman (Page View) Real-Time
 */
export async function recordPageView(siteId, slug) {
  const device = detectDeviceType();
  const timestamp = new Date().toISOString();

  // 1. Simpan ke Local Storage
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const siteStats = data[siteId] || {
      views: 0,
      devices: { Mobile: 0, Desktop: 0, Tablet: 0 }
    };

    siteStats.views = (siteStats.views || 0) + 1;
    siteStats.devices = siteStats.devices || { Mobile: 0, Desktop: 0, Tablet: 0 };
    siteStats.devices[device] = (siteStats.devices[device] || 0) + 1;
    siteStats.lastViewed = timestamp;

    data[siteId] = siteStats;
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving local page view', e);
  }

  // 2. Simpan ke Firebase Firestore jika terhubung
  if (isFirebaseConfigured() && db) {
    try {
      const statsDocRef = doc(db, 'microsite_analytics', siteId);
      await setDoc(statsDocRef, {
        siteId,
        slug,
        views: increment(1),
        [`devices.${device}`]: increment(1),
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore analytics notice:', e.message);
    }
  }
}

/**
 * Catat Klik Tombol (Link Click) Real-Time
 */
export async function recordLinkClick(siteId, linkId, linkTitle, linkUrl) {
  const device = detectDeviceType();
  const timestamp = new Date().toISOString();

  // 1. Simpan ke Local Storage
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const siteStats = data[siteId] || { views: 0, clicks: {} };
    siteStats.clicks = siteStats.clicks || {};
    siteStats.clicks[linkId] = (siteStats.clicks[linkId] || 0) + 1;

    data[siteId] = siteStats;
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(data));

    // Catat log aktivitas terbaru
    const rawLogs = localStorage.getItem(LOCAL_ACTIVITY_LOGS_KEY);
    const logs = rawLogs ? JSON.parse(rawLogs) : [];
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      siteId,
      linkId,
      linkTitle,
      linkUrl,
      device,
      timestamp
    };
    const updatedLogs = [newLog, ...logs].slice(0, 50); // Simpan 50 aktivitas terakhir
    localStorage.setItem(LOCAL_ACTIVITY_LOGS_KEY, JSON.stringify(updatedLogs));
  } catch (e) {
    console.error('Error saving local click', e);
  }

  // 2. Simpan ke Firebase Firestore jika terhubung
  if (isFirebaseConfigured() && db) {
    try {
      const statsDocRef = doc(db, 'microsite_analytics', siteId);
      await setDoc(statsDocRef, {
        [`clicks.${linkId}`]: increment(1),
        totalClicks: increment(1),
        lastUpdated: serverTimestamp()
      }, { merge: true });

      // Catat log ke subcollection events
      const eventsRef = collection(db, 'microsite_analytics', siteId, 'click_events');
      await addDoc(eventsRef, {
        linkId,
        linkTitle,
        linkUrl,
        device,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.warn('Firestore click log notice:', e.message);
    }
  }
}

/**
 * Ambil data analitik lokal
 */
export function getLocalAnalytics(siteId) {
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return data[siteId] || {
      views: 0,
      clicks: {},
      devices: { Mobile: 0, Desktop: 0, Tablet: 0 }
    };
  } catch (e) {
    return {
      views: 0,
      clicks: {},
      devices: { Mobile: 0, Desktop: 0, Tablet: 0 }
    };
  }
}

/**
 * Ambil log aktivitas klik real-time lokal
 */
export function getLocalActivityLogs(siteId) {
  try {
    const rawLogs = localStorage.getItem(LOCAL_ACTIVITY_LOGS_KEY);
    const logs = rawLogs ? JSON.parse(rawLogs) : [];
    if (!siteId) return logs;
    return logs.filter(l => l.siteId === siteId);
  } catch (e) {
    return [];
  }
}

/**
 * Reset Analitik (Untuk simulasi/testing)
 */
export function resetLocalAnalytics(siteId) {
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    if (siteId) {
      delete data[siteId];
    }
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(data));

    const rawLogs = localStorage.getItem(LOCAL_ACTIVITY_LOGS_KEY);
    const logs = rawLogs ? JSON.parse(rawLogs) : [];
    const filtered = logs.filter(l => l.siteId !== siteId);
    localStorage.setItem(LOCAL_ACTIVITY_LOGS_KEY, JSON.stringify(filtered));
  } catch (e) {}
}
