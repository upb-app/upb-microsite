/**
 * Microsite Cloud Synchronization Service
 * Menghubungkan pembuatan, pengubahan nama/slug, dan publikasi microsite
 * secara real-time ke Firebase Cloud Firestore & Vercel Edge API untuk akses publik global di internet.
 */
import { db, isFirebaseConfigured } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
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
 * Publikasikan Microsite ke Firebase Cloud Firestore + Vercel Serverless (Real-Time Internet Global)
 */
export async function publishMicrositeToCloud(microsite) {
  if (!microsite || !microsite.slug) return null;

  const cleanSlug = sanitizeSlug(microsite.slug);
  const nowIso = new Date().toISOString();

  // Bersihkan payload dari undefined agar Firestore tidak menolak dokumen
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

  // 1. Simpan ke Firestore SDK
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'published_microsites', cleanSlug);
      await setDoc(docRef, payload, { merge: true });

      // Index registry
      const indexRef = doc(db, 'microsites_registry', payload.id);
      await setDoc(indexRef, {
        id: payload.id,
        slug: cleanSlug,
        title: payload.title,
        updatedAt: nowIso
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore SDK save notice:', err.message);
    }
  }

  // 2. Simpan ke Vercel Serverless Function /api/microsite
  try {
    fetch('/api/microsite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch (e) {}

  // 3. Simpan ke Firebase Firestore REST API (Direct Cloud Backup)
  try {
    const firestoreRestUrl = `https://firestore.googleapis.com/v1/projects/upb-microsite/databases/(default)/documents/published_microsites/${cleanSlug}`;
    fetch(firestoreRestUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          payloadJson: { stringValue: JSON.stringify(payload) },
          updatedAt: { stringValue: nowIso }
        }
      })
    }).catch(() => {});
  } catch (e) {}

  // 4. Simpan cache lokal per slug untuk lookup instan
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`upb_site_slug_${cleanSlug}`, JSON.stringify(payload));
    }
  } catch (e) {}

  // 5. Broadcast Channel untuk sinkronisasi instan antar-tab di browser
  try {
    const channel = getBroadcastChannel();
    if (channel) {
      channel.postMessage({ type: 'MICROSITE_UPDATED', slug: cleanSlug, site: payload });
    }
  } catch (e) {}

  // 6. Dispatch window custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('upb-microsite-published', { detail: payload }));
  }

  return payload;
}

/**
 * Ambil data microsite publik dari Cloud berdasarkan slug (Multi-Source Resilience)
 */
export async function fetchPublishedMicrosite(slug) {
  if (!slug) return null;
  const cleanSlug = sanitizeSlug(slug);

  // 1. Cek Firestore SDK
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'published_microsites', cleanSlug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && typeof localStorage !== 'undefined') {
          localStorage.setItem(`upb_site_slug_${cleanSlug}`, JSON.stringify(data));
        }
        return data;
      }
    } catch (err) {
      // Permission denied or network issue -> continue to fallbacks
    }
  }

  // 2. Cek Vercel Serverless Function /api/microsite
  try {
    const apiRes = await fetch(`/api/microsite?slug=${encodeURIComponent(cleanSlug)}`);
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

  // 3. Cek Firebase Firestore REST API
  try {
    const firestoreRestUrl = `https://firestore.googleapis.com/v1/projects/upb-microsite/databases/(default)/documents/published_microsites/${cleanSlug}`;
    const restRes = await fetch(firestoreRestUrl);
    if (restRes.ok) {
      const json = await restRes.json();
      if (json.fields?.payloadJson?.stringValue) {
        const parsed = JSON.parse(json.fields.payloadJson.stringValue);
        if (parsed && typeof localStorage !== 'undefined') {
          localStorage.setItem(`upb_site_slug_${cleanSlug}`, JSON.stringify(parsed));
        }
        return parsed;
      }
    }
  } catch (e) {}

  // 4. Fallback ke local cache per slug
  try {
    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem(`upb_site_slug_${cleanSlug}`);
      if (cached) {
        return JSON.parse(cached);
      }
      
      // 5. Cek multi-microsites list di localStorage
      const multiListRaw = localStorage.getItem('upb_multi_microsites_list_v2');
      if (multiListRaw) {
        const list = JSON.parse(multiListRaw);
        const match = list.find(s => s.slug === cleanSlug);
        if (match) return match;
      }
    }
  } catch (e) {}

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
      }, (err) => {
        console.warn('Firestore snapshot notice for slug:', cleanSlug, err.message);
      });
      return unsubscribe;
    } catch (err) {
      console.warn('Error setting up snapshot for slug:', cleanSlug, err);
    }
  }
  return () => {};
}

/**
 * Hapus microsite dari Firestore saat admin menghapus situs
 */
export async function deleteMicrositeFromCloud(slug, siteId) {
  if (!slug) return;
  const cleanSlug = sanitizeSlug(slug);

  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, 'published_microsites', cleanSlug));
      if (siteId) {
        await deleteDoc(doc(db, 'microsites_registry', siteId));
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(`upb_site_slug_${cleanSlug}`);
      }
    } catch (err) {
      console.warn('Error deleting cloud microsite:', err);
    }
  }
}
