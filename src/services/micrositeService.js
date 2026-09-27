/**
 * Microsite Cloud Synchronization & Universal Link Engine
 * Single Source of Truth: Cloud Firestore (Bypass Browser Stale Cache)
 * Menghubungkan pembuatan, pengeditan, dan publikasi microsite secara real-time
 * langsung ke Cloud Firestore untuk akses publik global di internet.
 */
import { db, isFirebaseConfigured } from './firebase.js';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  getDocFromServer,
  getDocsFromServer,
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
 * Helper: Decode Firestore REST API field values into plain JavaScript objects
 */
function decodeFirestoreValue(val) {
  if (!val || typeof val !== 'object') return val;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return parseInt(val.integerValue, 10);
  if ('doubleValue' in val) return parseFloat(val.doubleValue);
  if ('booleanValue' in val) return Boolean(val.booleanValue);
  if ('nullValue' in val) return null;
  if ('timestampValue' in val) return val.timestampValue;
  if ('arrayValue' in val) {
    const arr = val.arrayValue?.values || [];
    return arr.map(decodeFirestoreValue);
  }
  if ('mapValue' in val) {
    return decodeFirestoreFields(val.mapValue?.fields || {});
  }
  return val;
}

export function decodeFirestoreFields(fields) {
  if (!fields) return {};
  const result = {};
  for (const [key, val] of Object.entries(fields)) {
    result[key] = decodeFirestoreValue(val);
  }
  return result;
}

export function cleanObjectForFirestore(val) {
  if (val === undefined) return '';
  if (val === null) return null;
  if (typeof val === 'boolean' || typeof val === 'number' || typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(item => cleanObjectForFirestore(item));
  }
  if (typeof val === 'object') {
    const res = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        res[k] = cleanObjectForFirestore(v);
      }
    }
    return res;
  }
  return String(val);
}

export function encodeFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { integerValue: val.toString() };
    return { doubleValue: val };
  }
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map(encodeFirestoreValue)
      }
    };
  }
  if (typeof val === 'object') {
    return {
      mapValue: {
        fields: encodeFirestoreFields(val)
      }
    };
  }
  return { stringValue: String(val) };
}

export function encodeFirestoreFields(obj) {
  if (!obj || typeof obj !== 'object') return {};
  const fields = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      fields[key] = encodeFirestoreValue(val);
    }
  }
  return fields;
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
 * Encode microsite payload into a lightweight URL parameter
 */
export function encodeMicrositeData(site) {
  if (!site) return '';
  try {
    const minified = {
      t: site.title || '',
      s: site.slug || '',
      p: {
        un: site.data?.profile?.universityName,
        dn: site.data?.profile?.departmentName,
        tg: site.data?.profile?.tagline,
        b: site.data?.profile?.bio,
        l: site.data?.profile?.location,
        e: site.data?.profile?.email,
        a: site.data?.profile?.avatarUrl,
        hb: site.data?.profile?.headerBannerUrl,
        sb: site.data?.profile?.showBanner,
        v: site.data?.profile?.isVerified,
        t: site.data?.profile?.title
      },
      th: site.data?.theme,
      bs: site.data?.buttonStyle,
      so: site.data?.socials,
      lks: (site.data?.links || []).map(l => ({
        i: l.id,
        t: l.title,
        s: l.subtitle,
        u: l.url,
        ic: l.icon,
        b: l.badge,
        bc: l.badgeColor,
        a: l.animation,
        h: l.highlight,
        cbg: l.customBgColor,
        cg: l.customGradient,
        ct: l.customTextColor,
        cb: l.customBorderColor,
        cic: l.customIconColor,
        cib: l.customIconBg
      }))
    };
    const jsonStr = JSON.stringify(minified);
    return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
  } catch (e) {
    return '';
  }
}

/**
 * Decode microsite payload from URL parameter
 */
export function decodeMicrositeData(encodedStr) {
  if (!encodedStr) return null;
  try {
    const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encodedStr))));
    const min = JSON.parse(jsonStr);
    return {
      id: `site-${min.s || 'custom'}`,
      title: min.t || 'Universitas Pelita Bangsa',
      slug: min.s || 'custom',
      category: 'Portal Resmi',
      data: {
        profile: {
          universityName: min.p?.un,
          departmentName: min.p?.dn,
          tagline: min.p?.tg,
          bio: min.p?.b,
          location: min.p?.l,
          email: min.p?.e,
          avatarUrl: min.p?.a,
          headerBannerUrl: min.p?.hb,
          showBanner: min.p?.sb,
          isVerified: min.p?.v,
          title: min.p?.t
        },
        theme: min.th || {},
        buttonStyle: min.bs || {},
        socials: min.so || {},
        links: (min.lks || []).map(l => ({
          id: l.i,
          title: l.t,
          subtitle: l.s,
          url: l.u,
          icon: l.ic,
          badge: l.b,
          badgeColor: l.bc,
          animation: l.a,
          highlight: l.h,
          customBgColor: l.cbg,
          customGradient: l.cg,
          customTextColor: l.ct,
          customBorderColor: l.cb,
          customIconColor: l.cic,
          customIconBg: l.cib,
          isActive: true
        }))
      }
    };
  } catch (e) {
    return null;
  }
}

/**
 * Generate shareable public URL with auto-sync payload
 */
export function getShareableMicrositeUrl(microsite, origin = 'https://kampuspelitabangsa.site') {
  if (!microsite || !microsite.slug) return `${origin}/pmb-utama`;
  const cleanSlug = sanitizeSlug(microsite.slug);
  const encoded = encodeMicrositeData(microsite);
  if (encoded && encoded.length < 1800) {
    return `${origin}/${cleanSlug}?d=${encoded}`;
  }
  return `${origin}/${cleanSlug}`;
}

/**
 * Publikasikan Microsite ke Cloud Firestore (Awaited Single Source of Truth)
 */
export async function publishMicrositeToCloud(microsite) {
  if (!microsite || !microsite.slug) return null;

  const cleanSlug = sanitizeSlug(microsite.slug);
  const nowIso = new Date().toISOString();
  const cleanData = cleanObjectForFirestore(microsite.data || {});

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

  // 1. Dual Channel Write to Google Cloud Firestore:
  // Channel A: Direct Firebase JS SDK
  let sdkSuccess = false;
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'published_microsites', cleanSlug);
      await setDoc(docRef, payload);
      
      const registryRef = doc(db, 'microsites_registry', payload.id);
      await setDoc(registryRef, {
        id: payload.id,
        slug: cleanSlug,
        title: payload.title,
        updatedAt: nowIso
      });
      sdkSuccess = true;
    } catch (err) {
      console.warn('Firestore SDK setDoc warning, falling back to REST write:', err);
    }
  }

  // Channel B: Direct Google Cloud Firestore REST API PATCH
  try {
    const encoded = encodeFirestoreFields(payload);
    await fetch(`https://firestore.googleapis.com/v1/projects/upb-microsite/databases/(default)/documents/published_microsites/${cleanSlug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: encoded })
    });
  } catch (restErr) {
    if (!sdkSuccess) {
      console.error('Firestore REST write notice:', restErr);
    }
  }

  // 2. Hapus dari daftar deleted jika dibuat ulang
  try {
    if (typeof localStorage !== 'undefined') {
      const deletedRaw = localStorage.getItem('upb_deleted_slugs') || '[]';
      const deletedList = JSON.parse(deletedRaw);
      const filtered = deletedList.filter(s => s !== cleanSlug);
      localStorage.setItem('upb_deleted_slugs', JSON.stringify(filtered));
    }
  } catch (e) {}

  // 3. Perbarui cache lokal dengan data Cloud terbaru
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`upb_site_slug_${cleanSlug}`, JSON.stringify(payload));
    }
  } catch (e) {}

  // 4. Broadcast Channel untuk sinkronisasi instan antar-tab di browser
  try {
    const channel = getBroadcastChannel();
    if (channel) {
      channel.postMessage({ type: 'MICROSITE_UPDATED', slug: cleanSlug, site: payload });
    }
  } catch (e) {}

  // 5. Dispatch window custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('upb-microsite-published', { detail: payload }));
  }

  return payload;
}

/**
 * Ambil data microsite publik langsung dari Cloud Firestore (Live Cloud First)
 */
export async function fetchPublishedMicrosite(slug) {
  if (!slug) return null;
  const cleanSlug = sanitizeSlug(slug);

  // 0. Cek apakah slug ini ditandai telah dihapus
  try {
    if (typeof localStorage !== 'undefined') {
      const deletedRaw = localStorage.getItem('upb_deleted_slugs') || '[]';
      const deletedList = JSON.parse(deletedRaw);
      if (deletedList.includes(cleanSlug)) {
        return null;
      }
    }
  } catch (e) {}

  // 1. Ambil data terbaru langsung dari Cloud Firestore Server (Bypass Browser Cache)
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'published_microsites', cleanSlug);
      let docSnap;
      try {
        docSnap = await getDocFromServer(docRef);
      } catch (_serverErr) {
        docSnap = await getDoc(docRef);
      }

      if (docSnap && docSnap.exists()) {
        const liveData = docSnap.data();
        if (liveData && typeof localStorage !== 'undefined') {
          localStorage.setItem(`upb_site_slug_${cleanSlug}`, JSON.stringify(liveData));
        }
        return liveData;
      }
    } catch (err) {
      console.warn('Firestore live getDoc notice, falling back to REST:', err);
    }
  }

  // 2. Fallback REST API Firestore Server dengan Cache-Buster (?t=timestamp)
  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/upb-microsite/databases/(default)/documents/published_microsites/${cleanSlug}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.fields) {
        const parsed = decodeFirestoreFields(json.fields);
        if (parsed && typeof localStorage !== 'undefined') {
          localStorage.setItem(`upb_site_slug_${cleanSlug}`, JSON.stringify(parsed));
        }
        return parsed;
      }
    }
  } catch (e) {}

  // 3. Fallback parameter URL ?d=... (Universal Sync untuk Incognito & Device Luar)
  if (typeof window !== 'undefined') {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedParam = urlParams.get('d');
      if (encodedParam) {
        const decoded = decodeMicrositeData(encodedParam);
        if (decoded && decoded.data) {
          return decoded;
        }
      }
    } catch (e) {}
  }

  // 4. Fallback terakhir: Cache Lokal hanya jika offline tanpa jaringan internet
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

  return null;
}

/**
 * Ambil semua microsite terdaftar dari Cloud Firestore secara lengkap (Server First)
 */
export async function fetchAllPublishedMicrositesFromCloud() {
  const sites = [];
  const slugsSeen = new Set();

  // 1. Ambil via Firebase SDK langsung dari server Google Cloud Firestore
  if (isFirebaseConfigured() && db) {
    try {
      let snap;
      try {
        snap = await getDocsFromServer(collection(db, 'published_microsites'));
      } catch (_err) {
        snap = await getDocs(collection(db, 'published_microsites'));
      }
      snap.forEach((docSnap) => {
        if (docSnap.exists()) {
          const d = docSnap.data();
          if (d && d.slug && !slugsSeen.has(d.slug)) {
            slugsSeen.add(d.slug);
            sites.push(d);
          }
        }
      });
      if (sites.length > 0) return sites;
    } catch (e) {
      console.warn('Firestore SDK getDocs warning, fallback to REST:', e);
    }
  }

  // 2. Fallback REST API Firestore langsung ke server dengan no-cache
  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/upb-microsite/databases/(default)/documents/published_microsites?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.documents)) {
        for (const docItem of json.documents) {
          const slug = docItem.name.split('/').pop();
          if (slug && !slugsSeen.has(slug)) {
            const single = await fetchPublishedMicrosite(slug);
            if (single && single.slug) {
              slugsSeen.add(single.slug);
              sites.push(single);
            }
          }
        }
      }
    }
  } catch (err) {}

  return sites;
}

/**
 * Subscribe real-time ke sebuah microsite publik di Firestore
 */
export function subscribeToPublishedMicrosite(slug, onUpdate, onDelete) {
  if (!slug) return () => {};
  const cleanSlug = sanitizeSlug(slug);

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'published_microsites', cleanSlug);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (onUpdate) onUpdate(data);
          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(`upb_site_slug_${cleanSlug}`, JSON.stringify(data));
            }
          } catch (e) {}
        } else {
          // Dokumen dihapus di Cloud Firestore
          if (onDelete) onDelete();
        }
      }, (err) => {
        console.warn('Firestore snapshot subscription notice:', err);
      });
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

  // 1. Hapus dari Firestore Cloud
  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, 'published_microsites', cleanSlug));
      if (siteId) {
        await deleteDoc(doc(db, 'microsites_registry', siteId));
      }
    } catch (err) {
      console.warn('Firestore delete warning:', err);
    }
  }

  // 2. Bersihkan cache lokal & catat ke deleted list
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(`upb_site_slug_${cleanSlug}`);
    try {
      const deletedRaw = localStorage.getItem('upb_deleted_slugs') || '[]';
      const deletedList = JSON.parse(deletedRaw);
      if (!deletedList.includes(cleanSlug)) {
        deletedList.push(cleanSlug);
        localStorage.setItem('upb_deleted_slugs', JSON.stringify(deletedList));
      }
    } catch (e) {}
  }

  // 3. Broadcast Channel pembaruan penghapusan ke semua tab terbuka
  try {
    const channel = getBroadcastChannel();
    if (channel) {
      channel.postMessage({ type: 'MICROSITE_DELETED', slug: cleanSlug });
    }
  } catch (e) {}

  // 4. Dispatch window custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('upb-microsite-deleted', { detail: { slug: cleanSlug } }));
  }
}
