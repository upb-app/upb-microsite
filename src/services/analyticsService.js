/**
 * Real-Time Analytics & Tracking Service
 * Melacak kunjungan nyata (views), klik tombol (clicks), jenis perangkat, dan log interaksi real-time
 */
import { db, isFirebaseConfigured } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  increment, 
  onSnapshot, 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

const LOCAL_ANALYTICS_KEY = 'upb_realtime_analytics_data_v2';
const LOCAL_ACTIVITY_LOGS_KEY = 'upb_realtime_activity_logs_v2';

// Deteksi perangkat pengunjung asli
export function detectDeviceType() {
  if (typeof navigator === 'undefined') return 'Desktop';
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
  if (!siteId) return;
  const device = detectDeviceType();
  const timestamp = new Date().toISOString();

  // 1. Simpan ke Local Storage
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const siteStats = data[siteId] || {
      views: 0,
      clicks: {},
      devices: { Mobile: 0, Desktop: 0, Tablet: 0 }
    };

    siteStats.views = (siteStats.views || 0) + 1;
    siteStats.devices = siteStats.devices || { Mobile: 0, Desktop: 0, Tablet: 0 };
    siteStats.devices[device] = (siteStats.devices[device] || 0) + 1;
    siteStats.lastViewed = timestamp;

    data[siteId] = siteStats;
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(data));

    // Dispatch global custom event for instant same-tab reactive UI update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('upb-analytics-updated', { detail: { siteId } }));
    }
  } catch (e) {
    console.error('Error saving local page view', e);
  }

  // 2. Simpan ke Firebase Firestore Cloud jika terhubung
  if (isFirebaseConfigured() && db) {
    try {
      const statsDocRef = doc(db, 'microsite_analytics', siteId);
      await setDoc(statsDocRef, {
        siteId,
        slug: slug || siteId,
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
  if (!siteId || !linkId) return;
  const device = detectDeviceType();
  const timestamp = new Date().toISOString();

  // 1. Simpan ke Local Storage
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const siteStats = data[siteId] || {
      views: 0,
      clicks: {},
      devices: { Mobile: 0, Desktop: 0, Tablet: 0 }
    };

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
      linkTitle: linkTitle || 'Tautan',
      linkUrl: linkUrl || '#',
      device,
      timestamp
    };
    const updatedLogs = [newLog, ...logs].slice(0, 50); // Simpan 50 aktivitas klik terakhir
    localStorage.setItem(LOCAL_ACTIVITY_LOGS_KEY, JSON.stringify(updatedLogs));

    // Dispatch global custom event for instant same-tab reactive UI update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('upb-analytics-updated', { detail: { siteId } }));
    }
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
        linkTitle: linkTitle || 'Tautan',
        linkUrl: linkUrl || '#',
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
  if (!siteId) return { views: 0, clicks: {}, devices: { Mobile: 0, Desktop: 0, Tablet: 0 } };
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
 * Subscribe ke update analitik real-time (Lokal + Firestore)
 */
export function subscribeToSiteAnalytics(siteId, onUpdate) {
  if (!siteId) return () => {};

  // 1. Initial local load
  onUpdate(getLocalAnalytics(siteId));

  // 2. Real-time Firestore sync jika Firebase aktif
  if (isFirebaseConfigured() && db) {
    try {
      const statsDocRef = doc(db, 'microsite_analytics', siteId);
      const unsubscribe = onSnapshot(statsDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          const local = getLocalAnalytics(siteId);

          const merged = {
            views: Math.max(local.views || 0, cloudData.views || 0),
            clicks: {
              ...(local.clicks || {}),
              ...(cloudData.clicks || {})
            },
            devices: {
              Mobile: Math.max(local.devices?.Mobile || 0, cloudData.devices?.Mobile || 0),
              Desktop: Math.max(local.devices?.Desktop || 0, cloudData.devices?.Desktop || 0),
              Tablet: Math.max(local.devices?.Tablet || 0, cloudData.devices?.Tablet || 0),
            }
          };

          onUpdate(merged);
        }
      }, (err) => {
        console.warn('Firestore real-time subscription notice:', err.message);
      });

      return unsubscribe;
    } catch (e) {
      console.warn('Subscription error:', e);
    }
  }

  return () => {};
}

/**
 * Reset Analitik (Mengosongkan statistik kembali ke 0)
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

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('upb-analytics-updated', { detail: { siteId } }));
    }
  } catch (e) {}
}
