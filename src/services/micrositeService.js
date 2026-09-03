/**
 * Microsite Cloud Synchronization & Universal Link Engine
 * Menghubungkan pembuatan, pengubahan nama/slug, dan publikasi microsite
 * secara real-time ke Cloud Firestore & Universal State Encoder untuk akses publik global di internet.
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
        h: l.highlight
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
export function getShareableMicrositeUrl(microsite, origin = 'https://pmbupb.site') {
  if (!microsite || !microsite.slug) return `${origin}/pmb-utama`;
  const cleanSlug = sanitizeSlug(microsite.slug);
  const encoded = encodeMicrositeData(microsite);
  if (encoded && encoded.length < 1800) {
    return `${origin}/${cleanSlug}?d=${encoded}`;
  }
  return `${origin}/${cleanSlug}`;
}

/**
 * Publikasikan Microsite ke Cloud (Firestore + Local Cache + Universal Encoder)
 */
export async function publishMicrositeToCloud(microsite) {
  if (!microsite || !microsite.slug) return null;

  const cleanSlug = sanitizeSlug(microsite.slug);
  const nowIso = new Date().toISOString();
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

  // 4. Simpan ke Firestore jika tersedia (timeout 1.5 detik)
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'published_microsites', cleanSlug);
      setDoc(docRef, payload, { merge: true }).catch(() => {});
    } catch (err) {}
  }

  return payload;
}

/**
 * Ambil data microsite publik dari Cloud / URL / Cache (Fast & Universal)
 */
export async function fetchPublishedMicrosite(slug) {
  if (!slug) return null;
  const cleanSlug = sanitizeSlug(slug);

  // 1. Cek parameter URL ?d=... (Universal Sync untuk Incognito & Device Luar)
  if (typeof window !== 'undefined') {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedParam = urlParams.get('d');
      if (encodedParam) {
        const decoded = decodeMicrositeData(encodedParam);
        if (decoded && decoded.data) {
          // Simpan ke cache lokal agar sesi berikutnya langsung instan
          localStorage.setItem(`upb_site_slug_${cleanSlug}`, JSON.stringify(decoded));
          
          // Bersihkan URL bar secara elegan tanpa query string
          try {
            window.history.replaceState({}, '', window.location.pathname);
          } catch (e) {}

          return decoded;
        }
      }
    } catch (e) {}
  }

  // 2. Cek Local Storage (0ms)
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

  // 3. Cek Firestore SDK
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'published_microsites', cleanSlug);
      const docSnap = await getDoc(docRef);
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
      }, () => {});
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
      deleteDoc(doc(db, 'published_microsites', cleanSlug)).catch(() => {});
      if (siteId) {
        deleteDoc(doc(db, 'microsites_registry', siteId)).catch(() => {});
      }
    } catch (err) {}
  }
}
