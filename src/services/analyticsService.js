/**
 * Real-Time Analytics & Tracking Service
 * Melacak kunjungan nyata (views), klik tombol (clicks), jenis perangkat, dan log interaksi real-time
 */
import { db, isFirebaseConfigured } from './firebase';
import { 
  doc, 
  setDoc, 
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

  // 2. Broadcast ke semua tab terbuka
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
        [`devices_${device}`]: increment(1),
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
        [`clicks_${linkId}`]: increment(1),
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
export function subscribeToSiteAnalytics(siteId, slug, onStatsUpdate, onLogsUpdate) {
  const cleanSlug = slug || (siteId ? siteId.replace(/^site-/, '') : 'pmb-utama');
  
  if (onStatsUpdate) {
    onStatsUpdate(getLocalAnalytics(siteId, slug));
  }
  if (onLogsUpdate) {
    onLogsUpdate(getLocalActivityLogs(siteId, slug));
  }

  if (isFirebaseConfigured() && db) {
    try {
      // 1. Subscribe to document metrics
      const statsDocRef = doc(db, 'microsite_analytics', cleanSlug);
      const unsubStats = onSnapshot(statsDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          const local = getLocalAnalytics(siteId, slug);

          const cloudClicks = {};
          if (cloudData.clicks && typeof cloudData.clicks === 'object') {
            Object.assign(cloudClicks, cloudData.clicks);
          }
          Object.keys(cloudData).forEach(k => {
            if (k.startsWith('clicks.')) {
              cloudClicks[k.replace('clicks.', '')] = Number(cloudData[k]) || 0;
            } else if (k.startsWith('clicks_')) {
              cloudClicks[k.replace('clicks_', '')] = Number(cloudData[k]) || 0;
            }
          });

          const cloudDevices = {
            Mobile: Number(cloudData.devices?.Mobile || cloudData['devices.Mobile'] || cloudData.devices_Mobile || 0),
            Desktop: Number(cloudData.devices?.Desktop || cloudData['devices.Desktop'] || cloudData.devices_Desktop || 0),
            Tablet: Number(cloudData.devices?.Tablet || cloudData['devices.Tablet'] || cloudData.devices_Tablet || 0),
          };

          const mergedClicks = { ...(local.clicks || {}) };
          Object.keys(cloudClicks).forEach(k => {
            mergedClicks[k] = Math.max(mergedClicks[k] || 0, cloudClicks[k]);
          });

          const merged = {
            views: Math.max(local.views || 0, Number(cloudData.views) || 0),
            clicks: mergedClicks,
            devices: {
              Mobile: Math.max(local.devices?.Mobile || 0, cloudDevices.Mobile),
              Desktop: Math.max(local.devices?.Desktop || 0, cloudDevices.Desktop),
              Tablet: Math.max(local.devices?.Tablet || 0, cloudDevices.Tablet),
            }
          };

          // Update local cache so getLocalAnalytics always has the latest Cloud truth
          try {
            const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
            const localData = raw ? JSON.parse(raw) : {};
            const keys = getCanonicalKeys(siteId, slug);
            keys.forEach(k => { localData[k] = merged; });
            localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(localData));
          } catch (e) {}

          if (onStatsUpdate) onStatsUpdate(merged);
        }
      }, () => {});

      // 2. Subscribe to live click events subcollection
      const eventsRef = collection(db, 'microsite_analytics', cleanSlug, 'click_events');
      const unsubEvents = onSnapshot(eventsRef, (snapshot) => {
        const events = [];
        snapshot.forEach(docSnap => {
          const item = docSnap.data();
          events.push({
            id: docSnap.id,
            siteId,
            slug: cleanSlug,
            linkId: item.linkId,
            linkTitle: item.linkTitle,
            linkUrl: item.linkUrl,
            device: item.device || 'Mobile',
            timestamp: item.timestamp?.toDate ? item.timestamp.toDate().toISOString() : (item.timestamp || new Date().toISOString())
          });
        });
        
        events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        if (onLogsUpdate && events.length > 0) {
          // Update local activity logs cache
          try {
            localStorage.setItem(LOCAL_ACTIVITY_LOGS_KEY, JSON.stringify(events.slice(0, 50)));
          } catch (e) {}
          onLogsUpdate(events.slice(0, 50));
        }
      }, () => {});

      return () => {
        unsubStats();
        unsubEvents();
      };
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
