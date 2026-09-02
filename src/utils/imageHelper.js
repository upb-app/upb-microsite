/**
 * Helper untuk normalisasi URL Gambar dan Logo
 * Memastikan semua URL gambar yang tersimpan (baik dari localStorage lama maupun baru)
 * selalu diubah menjadi format absolut root (/img/...) agar tidak error pada sub-path
 */

export const DEFAULT_LOGO = '/img/logo-universitas-pelita-bangsa.png';
export const DEFAULT_BANNER = '/img/upb-bg2.JPG';

export function normalizeImageUrl(url, fallback = DEFAULT_LOGO) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }
  
  let clean = url.trim();

  // Ubah relative path ./img/ atau img/ menjadi /img/
  if (clean.startsWith('./img/')) {
    clean = clean.replace('./img/', '/img/');
  } else if (clean.startsWith('img/')) {
    clean = '/' + clean;
  }

  return clean;
}
