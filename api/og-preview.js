// Vercel Serverless Function to serve Rich Open Graph & WhatsApp Link Previews
export default async function handler(req, res) {
  // Clear Headers for WhatsApp Scraper & Social Crawlers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');

  const rawPath = req.query.path || req.query.slug || '';
  const cleanSlug = String(rawPath)
    .replace(/^\/+/, '')
    .replace(/^s\//, '')
    .split('?')[0]
    .split('/')[0]
    .trim()
    .toLowerCase();

  const baseUrl = 'https://pmbupb.site';
  const defaultTitle = 'Universitas Pelita Bangsa (UPB) • PMB & Portal Layanan Digital';
  const defaultDesc = '🎓 Penerimaan Mahasiswa Baru (PMB) 2026/2027 • Kuliah Sambil Kerja, Kelas Reguler & Karyawan, Biaya Terjangkau SPP mulai Rp 350.000/bln. Fakultas Teknik, FEB, FIKT, & Hukum. Kampus Megah Cikarang Bekasi.';
  const defaultImage = `${baseUrl}/img/og-preview.png`;
  const targetUrl = cleanSlug ? `${baseUrl}/${cleanSlug}` : baseUrl;

  let siteTitle = defaultTitle;
  let siteDesc = defaultDesc;
  let siteImage = defaultImage;
  let imageType = 'image/png';

  if (cleanSlug && !['dasbor', 'dashboard', 'asup', 'login', 'favicon', 'assets', 'img'].includes(cleanSlug)) {
    try {
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/upb-microsite/databases/(default)/documents/published_microsites/${encodeURIComponent(cleanSlug)}`;
      const response = await fetch(firestoreUrl, {
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const doc = await response.json();
        const fields = doc.fields || {};
        const titleField = fields.title?.stringValue || '';
        const dataMap = fields.data?.mapValue?.fields || {};
        const profileMap = dataMap.profile?.mapValue?.fields || {};

        const uniName = profileMap.universityName?.stringValue || 'Universitas Pelita Bangsa';
        const deptName = profileMap.departmentName?.stringValue || '';
        const tagline = profileMap.tagline?.stringValue || '';
        const bio = profileMap.bio?.stringValue || '';
        const banner = profileMap.headerBannerUrl?.stringValue || '';
        const avatar = profileMap.avatarUrl?.stringValue || '';

        // Formulate Title
        if (deptName && uniName) {
          siteTitle = `${deptName} • ${uniName}`;
        } else if (titleField && titleField !== 'pmb-utama') {
          siteTitle = `${titleField} • Universitas Pelita Bangsa`;
        } else {
          siteTitle = `${uniName} • PMB & Layanan Resmi`;
        }

        // Formulate Description
        const descParts = [];
        if (tagline) descParts.push(tagline);
        if (bio) descParts.push(bio);
        if (descParts.length === 0) {
          descParts.push('Portal informasi resmi pendaftaran mahasiswa baru, biaya kuliah terjangkau SPP Rp 350rb/bln, dan layanan akademik Universitas Pelita Bangsa.');
        }
        siteDesc = `🎓 ${descParts.join(' — ')}`;

        // Formulate Image (WhatsApp prefers <300KB PNG/JPEG)
        // If the banner is the default huge JPG (700KB), use the optimized 120KB og-preview.png
        if (banner && !banner.includes('upb-bg2.JPG') && !banner.includes('upb-bg.JPG')) {
          siteImage = banner.startsWith('http') ? banner : `${baseUrl}${banner.startsWith('/') ? '' : '/'}${banner}`;
          imageType = siteImage.endsWith('.png') ? 'image/png' : 'image/jpeg';
        } else if (avatar && !avatar.includes('default')) {
          siteImage = avatar.startsWith('http') ? avatar : `${baseUrl}${avatar.startsWith('/') ? '' : '/'}${avatar}`;
          imageType = siteImage.endsWith('.png') ? 'image/png' : 'image/jpeg';
        } else {
          siteImage = defaultImage;
          imageType = 'image/png';
        }
      }
    } catch (err) {
      console.error('Error fetching microsite preview:', err);
    }
  }

  // Escape HTML entities
  const escapeHtml = (str) => String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const safeTitle = escapeHtml(siteTitle);
  const safeDesc = escapeHtml(siteDesc);
  const safeImage = escapeHtml(siteImage);
  const safeUrl = escapeHtml(targetUrl);

  const html = `<!DOCTYPE html>
<html lang="id" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}">
  <link rel="canonical" href="${safeUrl}">

  <!-- Open Graph / Facebook / WhatsApp Preview (Essential for WhatsApp Rich Cards) -->
  <meta property="og:site_name" content="Universitas Pelita Bangsa (UPB)">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${safeUrl}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="${safeImage}">
  <meta property="og:image:secure_url" content="${safeImage}">
  <meta property="og:image:type" content="${imageType}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${safeTitle}">
  <meta property="og:locale" content="id_ID">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@upb_official">
  <meta name="twitter:url" content="${safeUrl}">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${safeImage}">

  <!-- WhatsApp & Mobile Theme -->
  <meta name="theme-color" content="#071326">
</head>
<body style="background-color: #040914; color: #ffffff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; padding: 20px;">
  <div>
    <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 8px;">${safeTitle}</h2>
    <p style="font-size: 0.875rem; color: #94a3b8; max-width: 480px; margin: 0 auto 16px;">${safeDesc}</p>
    <a href="${safeUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 0.875rem;">Kunjungi Website Resmi</a>
  </div>
</body>
</html>`;

  return res.status(200).send(html);
}
