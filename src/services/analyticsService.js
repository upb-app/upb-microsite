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

let sharedBroadcastChannel = null;
function getBroadcastChannel() {
  if (typeof BroadcastChannel === 'undefined') return null;
  if (!sharedBroadcastChannel) {
    try {
      sharedBroadcastChannel = new BroadcastChannel('upb_microsites_channel');
    } catch (e) {
      return null;
    }
  }
  return sharedBroadcastChannel;
}

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

function getCanonicalKeys(siteId, slug) {
  const keys = new Set();
  if (siteId) keys.add(siteId);
  if (slug) {
    keys.add(slug);
    keys.add(`site-${slug}`);
  }
  return Array.from(keys);
}

/**
 * Catat Kunjungan Halaman (Page View) Real-Time
 */
export async function recordPageView(siteId, slug) {
  const cleanSiteId = siteId || `site-${slug || 'pmb-utama'}`;
  const cleanSlug = slug || (siteId ? siteId.replace(/^site-/, '') : 'pmb-utama');
  const device = detectDeviceType();
  const timestamp = new Date().toISOString();
  const keys = getCanonicalKeys(cleanSiteId, cleanSlug);

  // 1. Simpan ke Local Storage untuk semua alias key
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    
    let baseStats = null;
    for (const k of keys) {
      if (data[k]) {
        baseStats = data[k];
        break;
      }
    }

    const siteStats = baseStats || {
      views: 0,
      clicks: {},
      devices: { Mobile: 0, Desktop: 0, Tablet: 0 }
    };

    siteStats.views = (siteStats.views || 0) + 1;
    siteStats.devices = siteStats.devices || { Mobile: 0, Desktop: 0, Tablet: 0 };
    siteStats.devices[device] = (siteStats.devices[device] || 0) + 1;
    siteStats.lastViewed = timestamp;

    keys.forEach(k => {
      data[k] = siteStats;
    });

    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(data));

    // Dispatch global custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('upb-analytics-updated', { 
        detail: { siteId: cleanSiteId, slug: cleanSlug } 
      }));
    }
  } catch (e) {}

  // 2. Broadcast ke semua tab terbuka (termasuk tab dasbor dari incognito)
  try {
    const channel = getBroadcastChannel();
    if (channel) {
      channel.postMessage({ 
        type: 'ANALYTICS_VIEW', 
        siteId: cleanSiteId, 
        slug: cleanSlug, 
        device, 
        timestamp 
      });
    }
  } catch (e) {}

  // 3. Simpan ke Firebase Firestore Cloud jika database aktif
  if (isFirebaseConfigured() && db) {
    try {
      const statsDocRef = doc(db, 'microsite_analytics', cleanSlug);
      setDoc(statsDocRef, {
        siteId: cleanSiteId,
        slug: cleanSlug,
        views: increment(1),
        [`devices.${device}`]: increment(1),
        lastUpdated: serverTimestamp()
      }, { merge: true }).catch(() => {});
    } catch (e) {}
  }
}

/**
 * Catat Klik Tombol (Link Click) Real-Time
 */
export async function recordLinkClick(siteId, linkId, linkTitle, linkUrl, slug) {
  if (!linkId) return;
  const cleanSiteId = siteId || `site-${slug || 'pmb-utama'}`;
  const cleanSlug = slug || (siteId ? siteId.replace(/^site-/, '') : 'pmb-utama');
  const device = detectDeviceType();
  const timestamp = new Date().toISOString();
  const keys = getCanonicalKeys(cleanSiteId, cleanSlug);

  // 1. Simpan ke Local Storage
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    const data = raw ? JSON.parse(raw) : {};

    let baseStats = null;
    for (const k of keys) {
      if (data[k]) {
        baseStats = data[k];
        break;
      }
    }

    const siteStats = baseStats || {
      views: 0,
      clicks: {},
      devices: { Mobile: 0, Desktop: 0, Tablet: 0 }
    };

    siteStats.clicks = siteStats.clicks || {};
    siteStats.clicks[linkId] = (siteStats.clicks[linkId] || 0) + 1;
    siteStats.totalClicks = (siteStats.totalClicks || 0) + 1;

    keys.forEach(k => {
      data[k] = siteStats;
    });

    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(data));

    // Catat log aktivitas terbaru
    const rawLogs = localStorage.getItem(LOCAL_ACTIVITY_LOGS_KEY);
    const logs = rawLogs ? JSON.parse(rawLogs) : [];
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      siteId: cleanSiteId,
      slug: cleanSlug,
      linkId,
      linkTitle: linkTitle || 'Tautan',
      linkUrl: linkUrl || '#',
      device,
      timestamp
    };
    const updatedLogs = [newLog, ...logs].slice(0, 50);
    localStorage.setItem(LOCAL_ACTIVITY_LOGS_KEY, JSON.stringify(updatedLogs));

    // Dispatch global custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('upb-analytics-updated', { 
        detail: { siteId: cleanSiteId, slug: cleanSlug, log: newLog } 
      }));
    }
  } catch (e) {}

  // 2. Broadcast ke semua tab browser secara instan
  try {
    const channel = getBroadcastChannel();
    if (channel) {
      channel.postMessage({ 
        type: 'ANALYTICS_CLICK', 
        siteId: cleanSiteId, 
        slug: cleanSlug, 
        linkId, 
        linkTitle: linkTitle || 'Tautan',
        linkUrl: linkUrl || '#',
        device, 
        timestamp 
      });
    }
  } catch (e) {}

  // 3. Simpan ke Firebase Firestore jika terhubung
  if (isFirebaseConfigured() && db) {
    try {
      const statsDocRef = doc(db, 'microsite_analytics', cleanSlug);
      setDoc(statsDocRef, {
        [`clicks.${linkId}`]: increment(1),
        totalClicks: increment(1),
        lastUpdated: serverTimestamp()
      }, { merge: true }).catch(() => {});

      const eventsRef = collection(db, 'microsite_analytics', cleanSlug, 'click_events');
      addDoc(eventsRef, {
        linkId,
        linkTitle: linkTitle || 'Tautan',
        linkUrl: linkUrl || '#',
        device,
        timestamp: serverTimestamp()
      }).catch(() => {});
    } catch (e) {}
  }
}

/**
 * Ambil data analitik lokal
 */
export function getLocalAnalytics(siteId, slug) {
  const keys = getCanonicalKeys(siteId, slug);
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    
    for (const k of keys) {
      if (data[k]) return data[k];
    }
  } catch (e) {}

  return { views: 0, clicks: {}, devices: { Mobile: 0, Desktop: 0, Tablet: 0 } };
}

/**
 * Ambil log aktivitas klik real-time lokal
 */
export function getLocalActivityLogs(siteId, slug) {
  const keys = getCanonicalKeys(siteId, slug);
  try {
    const rawLogs = localStorage.getItem(LOCAL_ACTIVITY_LOGS_KEY);
    const logs = rawLogs ? JSON.parse(rawLogs) : [];
    if (!siteId && !slug) return logs;
    return logs.filter(l => keys.includes(l.siteId) || keys.includes(l.slug));
  } catch (e) {
    return [];
  }
}

/**
 * Subscribe ke update analitik real-time (Lokal + Firestore + Broadcast)
 */
export function subscribeToSiteAnalytics(siteId, slug, onUpdate) {
  const cleanSlug = slug || (siteId ? siteId.replace(/^site-/, '') : 'pmb-utama');
  
  if (onUpdate) {
    onUpdate(getLocalAnalytics(siteId, slug));
  }

  if (isFirebaseConfigured() && db) {
    try {
      const statsDocRef = doc(db, 'microsite_analytics', cleanSlug);
      const unsubscribe = onSnapshot(statsDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          const local = getLocalAnalytics(siteId, slug);

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

          if (onUpdate) onUpdate(merged);
        }
      }, () => {});

      return unsubscribe;
    } catch (e) {}
  }

  return () => {};
}

/**
 * Reset Analitik
 */
export function resetLocalAnalytics(siteId, slug) {
  const keys = getCanonicalKeys(siteId, slug);
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    keys.forEach(k => delete data[k]);
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(data));

    const rawLogs = localStorage.getItem(LOCAL_ACTIVITY_LOGS_KEY);
    const logs = rawLogs ? JSON.parse(rawLogs) : [];
    const filtered = logs.filter(l => !keys.includes(l.siteId) && !keys.includes(l.slug));
    localStorage.setItem(LOCAL_ACTIVITY_LOGS_KEY, JSON.stringify(filtered));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('upb-analytics-updated', { 
        detail: { siteId, slug } 
      }));
    }
  } catch (e) {}

  const cleanSlug = slug || (siteId ? siteId.replace(/^site-/, '') : 'pmb-utama');
  if (isFirebaseConfigured() && db) {
    try {
      const statsDocRef = doc(db, 'microsite_analytics', cleanSlug);
      setDoc(statsDocRef, {
        views: 0,
        clicks: {},
        totalClicks: 0,
        devices: { Mobile: 0, Desktop: 0, Tablet: 0 }
      }).catch(() => {});
    } catch (e) {}
  }
}
