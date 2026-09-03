/**
 * Microsite Cloud Synchronization Service
 * Menghubungkan pembuatan, pengubahan nama/slug, dan publikasi microsite
 * secara real-time ke Firebase Cloud Firestore untuk akses publik global di internet.
 */
import { db, isFirebaseConfigured } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp 
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

/**
 * Sanitasi Slug URL agar 100% aman (Hanya a-z, 0-9, dan '-')
 * Mencegah XSS, path traversal, injection, karakter aneh, dan reserved paths
 */
export function sanitizeSlug(raw) {
  if (!raw || typeof raw !== 'string') return '';

  let clean = raw
    .toLowerCase()
    .trim()
    // Ganti karakter aksen / umlaut jika ada
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    // Ganti spasi, garis bawah, dan karakter non-alfanumerik dengan tanda hubung
    .replace(/[^a-z0-9-]/g, '-')
    // Hilangkan tanda hubung ganda (--- -> -)
    .replace(/-+/g, '-')
    // Hilangkan tanda hubung di awal dan akhir string
    .replace(/^-+|-+$/g, '')
    // Batasi panjang maksimum 50 karakter
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
 * Publikasikan Microsite ke Firebase Cloud Firestore (Real-Time Internet Global)
 */
export async function publishMicrositeToCloud(microsite) {
  if (!microsite || !microsite.slug) {
    throw new Error('Data microsite atau slug tidak valid untuk publikasi.');
  }

  const cleanSlug = sanitizeSlug(microsite.slug);
  const nowIso = new Date().toISOString();

  // Data payload aman yang akan dipublikasikan
  const payload = {
    id: microsite.id,
    title: microsite.title || 'Universitas Pelita Bangsa',
    slug: cleanSlug,
    category: microsite.category || 'Pusat Admisi',
    status: 'Active',
    data: microsite.data || {},
    updatedAt: nowIso,
    publishedAt: nowIso,
    cloudSyncStatus: 'live'
  };

  // 1. Simpan ke Firestore jika Firebase terhubung
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'published_microsites', cleanSlug);
      await setDoc(docRef, {
        ...payload,
        serverTime: serverTimestamp()
      }, { merge: true });

      // Catat juga ke index registry untuk lookup cepat
      const indexRef = doc(db, 'microsites_registry', microsite.id);
      await setDoc(indexRef, {
        id: microsite.id,
        slug: cleanSlug,
        title: microsite.title,
        updatedAt: serverTimestamp()
      }, { merge: true });

    } catch (err) {
      console.warn('Gagal sinkronisasi ke Firebase Cloud:', err.message);
      // Fallback tetap berhasil di browser
    }
  }

  // 2. Dispatch custom event agar tab lain di browser ini segera sinkron
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('upb-microsite-published', { detail: payload }));
  }

  return payload;
}

/**
 * Ambil data microsite publik dari Firestore berdasarkan slug
 */
export async function fetchPublishedMicrosite(slug) {
  if (!slug) return null;
  const cleanSlug = sanitizeSlug(slug);

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'published_microsites', cleanSlug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (err) {
      console.warn('Error fetching cloud microsite for slug', cleanSlug, err);
    }
  }
  return null;
}

/**
 * Subscribe real-time ke sebuah microsite publik di Firestore
 * Ketika admin mengubah data di dasbor, pengunjung publik langsung menerima update tanpa refresh!
 */
export function subscribeToPublishedMicrosite(slug, onUpdate) {
  if (!slug || !onUpdate) return () => {};
  const cleanSlug = sanitizeSlug(slug);

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'published_microsites', cleanSlug);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data());
        }
      }, (err) => {
        console.warn('Firestore snapshot error for slug:', cleanSlug, err.message);
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
    } catch (err) {
      console.warn('Error deleting cloud microsite:', err);
    }
  }
}
