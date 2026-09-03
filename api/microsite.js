// Vercel Serverless Function for Fast Global Cloud Sync of Microsites
const memoryStore = new Map();

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const slug = req.query?.slug || req.body?.slug;

  if (req.method === 'POST') {
    try {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!payload || !payload.slug) {
        return res.status(400).json({ error: 'Missing slug in request body' });
      }

      const cleanSlug = payload.slug.toLowerCase().trim();
      memoryStore.set(cleanSlug, payload);

      return res.status(200).json({ 
        success: true, 
        slug: cleanSlug, 
        updatedAt: new Date().toISOString() 
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'GET') {
    if (!slug) {
      return res.status(400).json({ error: 'Slug parameter is required' });
    }

    const cleanSlug = String(slug).toLowerCase().trim();
    const found = memoryStore.get(cleanSlug);

    if (found) {
      return res.status(200).json(found);
    }

    return res.status(404).json({ error: 'Microsite not found in memory store' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
