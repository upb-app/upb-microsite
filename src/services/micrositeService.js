/**
 * Microsite Cloud Synchronization Service
 * Menghubungkan pembuatan, pengubahan nama/slug, dan publikasi microsite
 * secara real-time ke Cloud Firestore & Vercel API untuk akses publik global di internet.
 */
import { db, isFirebaseConfigured } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

export const RESERVED_SLUGS = [
  'dasbor',
  'dashboard',
  'asup',
  'login',
  'admin',
  'api',
  'assets',
  'img',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  's',
  '404',
  '404.html',
  'home',
  'portal'
];

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

/**
 * Sanitasi Slug URL agar 100% aman (Hanya a-z, 0-9, dan '-')
 */
export function sanitizeSlug(raw) {
  if (!raw || typeof raw !== 'string') return '';

  let clean = raw
    .toLowerCase()
    .trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);

  return clean;
}

/**
 * Validasi apakah sebuah slug aman dan dapat digunakan
 */
export function validateSlug(slug, existingMicrosites = [], currentSiteId = null) {
  const clean = sanitizeSlug(slug);

  if (!clean || clean.length < 2) {
    return {
      isValid: false,
      message: 'Slug URL minimal harus terdiri dari 2 karakter huruf atau angka.'
    };
  }

  if (RESERVED_SLUGS.includes(clean)) {
    return {
      isValid: false,
      message: `Kata "${clean}" adalah nama sistem yang dilindungi dan tidak boleh digunakan sebagai slug URL.`
    };
  }

  // Cek duplikasi dengan microsite lain
  const isDuplicate = existingMicrosites.some(
    s => s.slug === clean && s.id !== currentSiteId
  );

  if (isDuplicate) {
    return {
      isValid: false,
      message: `Slug "${clean}" sudah digunakan oleh microsite lain. Silakan pilih nama slug lain.`
    };
  }

  return {
    isValid: true,
    slug: clean
  };
}

/**
 * Helper with timeout to prevent hanging promises
 */
function promiseWithTimeout(promise, ms = 1500) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('TIMEOUT')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

/**
 * Publikasikan Microsite ke Cloud (Firestore + Vercel API + Local Cache)
 */
export async function publishMicrositeToCloud(microsite) {
  if (!microsite || !microsite.slug) return null;

  const cleanSlug = sanitizeSlug(microsite.slug);
  const nowIso = new Date().toISOString();

  // Bersihkan payload dari undefined agar aman di serialize
  const cleanData = JSON.parse(JSON.stringify(microsite.data || {}));

  const payload = {
    id: microsite.id || `site-${cleanSlug}`,
    title: microsite.title || 'Universitas Pelita Bangsa',
    slug: cleanSlug,
    category: microsite.category || 'Pusat Admisi',
    status: 'Active',
    data: cleanData,
    updatedAt: nowIso,
    publishedAt: nowIso,
    cloudSyncStatus: 'live'
  };

  // 1. Simpan ke Cache Lokal per slug untuk akses instan (0ms)
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`upb_site_slug_${cleanSlug}`, JSON.stringify(payload));
    }
  } catch (e) {}

  // 2. Broadcast Channel untuk sinkronisasi instan antar-tab di browser
  try {
    const channel = getBroadcastChannel();
    if (channel) {
      channel.postMessage({ type: 'MICROSITE_UPDATED', slug: cleanSlug, site: payload });
    }
  } catch (e) {}

  // 3. Dispatch window custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('upb-microsite-published', { detail: payload }));
  }

  // 4. Simpan ke Vercel API
  try {
    fetch('/api/microsite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch (e) {}

  // 5. Simpan ke Firestore jika tersedia (dengan timeout agar tidak pernah blocking)
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'published_microsites', cleanSlug);
      promiseWithTimeout(setDoc(docRef, payload, { merge: true }), 2000).catch(() => {});
    } catch (err) {}
  }

  return payload;
}

/**
 * Ambil data microsite publik dari Cloud berdasarkan slug (Fast & Never Hangs)
 */
export async function fetchPublishedMicrosite(slug) {
  if (!slug) return null;
  const cleanSlug = sanitizeSlug(slug);

  // 1. Cek Local Storage (0ms)
  try {
    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem(`upb_site_slug_${cleanSlug}`);
      if (cached) {
        return JSON.parse(cached);
      }
      
      const multiListRaw = localStorage.getItem('upb_multi_microsites_list_v2');
      if (multiListRaw) {
        const list = JSON.parse(multiListRaw);
        const match = list.find(s => s.slug === cleanSlug);
        if (match) return match;
      }
    }
  } catch (e) {}

  // 2. Cek Vercel Serverless Function /api/microsite (Fast CDN)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const apiRes = await fetch(`/api/microsite?slug=${encodeURIComponent(cleanSlug)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (apiRes.ok) {
      const apiData = await apiRes.json();
      if (apiData && apiData.data) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(`upb_site_slug_${cleanSlug}`, JSON.stringify(apiData));
        }
        return apiData;
      }
    }
  } catch (e) {}

  // 3. Cek Firestore SDK dengan timeout 1.2 detik
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'published_microsites', cleanSlug);
      const docSnap = await promiseWithTimeout(getDoc(docRef), 1200);
      if (docSnap && docSnap.exists()) {
        const data = docSnap.data();
        if (data && typeof localStorage !== 'undefined') {
          localStorage.setItem(`upb_site_slug_${cleanSlug}`, JSON.stringify(data));
        }
        return data;
      }
    } catch (err) {}
  }

  return null;
}

/**
 * Subscribe real-time ke sebuah microsite publik di Firestore
 */
export function subscribeToPublishedMicrosite(slug, onUpdate) {
  if (!slug || !onUpdate) return () => {};
  const cleanSlug = sanitizeSlug(slug);

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'published_microsites', cleanSlug);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          onUpdate(data);
          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(`upb_site_slug_${cleanSlug}`, JSON.stringify(data));
            }
          } catch (e) {}
        }
      }, (err) => {});
      return unsubscribe;
    } catch (err) {}
  }
  return () => {};
}

/**
 * Hapus microsite dari Firestore saat admin menghapus situs
 */
export async function deleteMicrositeFromCloud(slug, siteId) {
  if (!slug) return;
  const cleanSlug = sanitizeSlug(slug);

  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(`upb_site_slug_${cleanSlug}`);
  }

  if (isFirebaseConfigured() && db) {
    try {
      await promiseWithTimeout(deleteDoc(doc(db, 'published_microsites', cleanSlug)), 1500);
      if (siteId) {
        await promiseWithTimeout(deleteDoc(doc(db, 'microsites_registry', siteId)), 1500);
      }
    } catch (err) {}
  }
}
