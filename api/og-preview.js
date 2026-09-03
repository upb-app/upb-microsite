// Vercel Serverless Function to serve Rich Open Graph & WhatsApp Link Previews
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const rawPath = req.query.path || req.query.slug || '';
  const cleanSlug = String(rawPath)
    .replace(/^\/+/, '')
    .replace(/^s\//, '')
    .split('?')[0]
    .split('/')[0]
    .trim()
    .toLowerCase();

  const baseUrl = 'https://pmbupb.site';
  const defaultTitle = 'Universitas Pelita Bangsa (UPB) • Penerimaan Mahasiswa Baru';
  const defaultDesc = '🎓 Portal Resmi PMB UPB 2026/2027 • Kuliah Sambil Kerja, Biaya Terjangkau SPP mulai Rp 350.000/bln. Fakultas Teknik, FEB, FIKT, & Hukum. Kampus Berbasis Entrepreneur Cikarang Bekasi.';
  const defaultImage = `${baseUrl}/img/og-preview.png`;
  const targetUrl = cleanSlug ? `${baseUrl}/${cleanSlug}` : baseUrl;

  let siteTitle = defaultTitle;
  let siteDesc = defaultDesc;
  let siteImage = defaultImage;

  if (cleanSlug && !['dasbor', 'dashboard', 'asup', 'login', 'favicon', 'assets'].includes(cleanSlug)) {
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
          siteTitle = `${deptName} - ${uniName}`;
        } else if (titleField) {
          siteTitle = `${titleField} • Universitas Pelita Bangsa`;
        } else {
          siteTitle = `${uniName} • Portal Resmi`;
        }

        // Formulate Description
        const descParts = [];
        if (tagline) descParts.push(tagline);
        if (bio) descParts.push(bio);
        if (descParts.length === 0) {
          descParts.push('Kunjungi portal microsite resmi untuk informasi pendaftaran, program studi, dan layanan akademik.');
        }
        siteDesc = `🎓 ${descParts.join(' — ')}`;

        // Formulate Image
        const chosenImage = banner || avatar || '';
        if (chosenImage) {
          if (chosenImage.startsWith('http://') || chosenImage.startsWith('https://')) {
            siteImage = chosenImage;
          } else {
            siteImage = `${baseUrl}${chosenImage.startsWith('/') ? '' : '/'}${chosenImage}`;
          }
        }
      }
    } catch (err) {
      console.error('Error fetching microsite preview:', err);
    }
  }

  // Escape HTML entities to prevent injection
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
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}">
  <link rel="canonical" href="${safeUrl}">

  <!-- Open Graph / Facebook / WhatsApp Preview -->
  <meta property="og:site_name" content="Universitas Pelita Bangsa (UPB)">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${safeUrl}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="${safeImage}">
  <meta property="og:image:secure_url" content="${safeImage}">
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

  <!-- WhatsApp & Mobile Styling -->
  <meta name="theme-color" content="#071326">
  <meta name="msapplication-navbutton-color" content="#071326">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

  <!-- Instant Browser Redirect -->
  <meta http-equiv="refresh" content="0;url=${safeUrl}">
  <script>
    window.location.replace("${safeUrl}");
  </script>
</head>
<body style="background-color: #040914; color: #ffffff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; padding: 20px;">
  <div>
    <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 8px;">${safeTitle}</h2>
    <p style="font-size: 0.875rem; color: #94a3b8; max-width: 480px; margin: 0 auto 16px;">${safeDesc}</p>
    <a href="${safeUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 0.875rem;">Buka Halaman</a>
  </div>
</body>
</html>`;

  return res.status(200).send(html);
}
