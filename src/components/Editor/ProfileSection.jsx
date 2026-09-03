import React, { useState } from 'react';
import { 
  Building2, 
  Image, 
  Upload, 
  BadgeCheck, 
  MapPin, 
  Mail, 
  Sparkles,
  Eye,
  EyeOff,
  Link2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Globe,
  Radio,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { normalizeImageUrl, DEFAULT_LOGO, DEFAULT_BANNER } from '../../utils/imageHelper';
import { sanitizeSlug, validateSlug } from '../../services/micrositeService';

const BANNER_PRESETS = [
  { label: 'Gedung UPB', url: '/img/upb-bg2.JPG' },
  { label: 'Kampus Pelita Bangsa', url: '/img/upb-bg.JPG' },
  { label: 'Riset & Teknologi', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Perpustakaan Digital', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Mahasiswa & Festival', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80' },
];

const AVATAR_PRESETS = [
  { label: 'Logo Resmi UPB', url: '/img/logo-universitas-pelita-bangsa.png' },
  { label: 'Mahasiswa', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80' },
  { label: 'Dosen / Peneliti', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { label: 'Fakultas Teknik', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&auto=format&fit=crop&q=80' },
  { label: 'Organisasi Mahasiswa', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&auto=format&fit=crop&q=80' },
];

export default function ProfileSection({ 
  profile = {}, 
  updateProfile,
  site = {},
  updateSiteMeta,
  microsites = [],
  onPublishCloud
}) {
  const p = profile || {};
  const currentSlug = site?.slug || p.slug || 'pmb-utama';
  const currentTitle = site?.title || p.universityName || 'Universitas Pelita Bangsa';

  const [copied, setCopied] = useState(false);
  const [slugError, setSlugError] = useState('');

  const origin = typeof window !== 'undefined' && window.location.origin.includes('localhost') 
    ? window.location.origin 
    : 'https://pmbupb.site';
  
  const publicUrl = `${origin}/${currentSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSlugChange = (rawVal) => {
    const clean = sanitizeSlug(rawVal);
    setSlugError('');

    if (updateSiteMeta) {
      updateSiteMeta('slug', clean);
    }
    updateProfile('slug', clean);

    const validation = validateSlug(clean, microsites, site?.id);
    if (!validation.isValid) {
      setSlugError(validation.message);
    }
  };

  const handleTitleChange = (val) => {
    if (updateSiteMeta) {
      updateSiteMeta('title', val);
    }
    updateProfile('universityName', val);
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateProfile('headerBannerUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateProfile('avatarUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const bannerPreview = normalizeImageUrl(p.headerBannerUrl || p.bannerUrl, DEFAULT_BANNER);
  const avatarPreview = normalizeImageUrl(p.avatarUrl, DEFAULT_LOGO);

  return (
    <div className="p-4 sm:p-5 space-y-5 animate-fadeIn text-left">
      
      {/* 0. PENGATURAN IDENTITAS & SLUG URL MICROSITE (CLEAN & SAFE) */}
      <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-white dark:from-slate-800/80 dark:via-[#0c1f3d]/60 dark:to-slate-900 border border-blue-200/80 dark:border-blue-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-600 text-white rounded-xl flex-shrink-0 shadow-sm">
              <Globe className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Nama & URL Publik Microsite</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-500" />
                  Live Publik
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ubah nama dan slug link resmi yang dapat diakses calon mahasiswa di internet
              </p>
            </div>
          </div>

          {/* Quick Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition transform active:scale-95 flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Tersalin!' : 'Salin Link Microsite'}</span>
          </button>
        </div>

        <div className="space-y-3.5">
          {/* 1. Nama / Judul Microsite */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Nama / Judul Microsite:
            </label>
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Penerimaan Mahasiswa Baru 2026 / Fakultas Teknik"
              className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-2xs"
            />
          </div>

          {/* 2. Slug URL Kustom (Hanya Karakter Aman a-z, 0-9, -) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Slug URL Bersih (Clean URL Slug):
              </label>
              <span className="text-[11px] text-slate-400 font-normal">
                Hanya huruf kecil, angka, dan strip (-)
              </span>
            </div>

            <div className="flex items-center">
              <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-900 border border-r-0 border-slate-300 dark:border-slate-700 rounded-l-xl text-xs font-mono font-bold text-slate-600 dark:text-slate-400 select-none">
                pmbupb.site/
              </span>
              <input
                type="text"
                value={currentSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="pmb-utama"
                className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-r-xl text-xs font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-2xs"
              />
            </div>

            {/* Error Message for Invalid Slug */}
            {slugError && (
              <div className="mt-1.5 p-2 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{slugError}</span>
              </div>
            )}
          </div>

          {/* Live Link Result Banner */}
          <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-950/80 border border-blue-100 dark:border-slate-800 rounded-xl text-xs">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <Link2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Tautan Langsung:</span>
              <a 
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline truncate"
              >
                {publicUrl}
              </a>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                title="Salin Tautan"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                title="Buka di Tab Baru"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* 1. Header Banner Settings */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
              <Image className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Banner Header Kampus</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Gambar lanskap latar bagian atas profil</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateProfile('showBanner', !p.showBanner)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              p.showBanner 
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            {p.showBanner ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {p.showBanner ? 'Tampilkan' : 'Sembunyikan'}
          </button>
        </div>

        {p.showBanner !== false && (
          <div className="space-y-3 pt-1">
            {/* Preview Banner */}
            <div className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 group">
              <img 
                src={bannerPreview} 
                alt="Banner Preview" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = DEFAULT_BANNER; }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg">
                  <Upload className="w-3.5 h-3.5" />
                  Ganti Gambar
                  <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Input URL Manual */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Gambar Banner</label>
              <input
                type="text"
                value={p.headerBannerUrl || p.bannerUrl || ''}
                onChange={(e) => updateProfile('headerBannerUrl', e.target.value)}
                placeholder="https://... atau /img/upb-bg.JPG"
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Banner Presets */}
            <div>
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Preset Foto Kampus & Fasilitas:</span>
              <div className="flex flex-wrap gap-1.5">
                {BANNER_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateProfile('headerBannerUrl', preset.url)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-amber-500/20 dark:hover:bg-amber-500/30 hover:text-amber-700 dark:hover:text-amber-300 text-slate-700 dark:text-slate-300 transition"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Avatar / Logo Kampus */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <Building2 className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Logo & Avatar Profil</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Lambang institusi, logo fakultas, atau foto pimpinan</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex-shrink-0 shadow-md">
            <img 
              src={avatarPreview} 
              alt="Logo Preview" 
              className="w-full h-full object-contain p-1"
              onError={(e) => { e.target.src = DEFAULT_LOGO; }}
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <label className="cursor-pointer px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
                <Upload className="w-3.5 h-3.5" />
                Upload Logo
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
              <button
                type="button"
                onClick={() => updateProfile('avatarUrl', DEFAULT_LOGO)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
              >
                Gunakan Logo Resmi UPB
              </button>
            </div>
            
            <input
              type="text"
              value={p.avatarUrl || ''}
              onChange={(e) => updateProfile('avatarUrl', e.target.value)}
              placeholder="URL Gambar Logo (https://...)"
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* 3. Teks Informasi Kampus */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Informasi & Deskripsi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Unit fakultas, slogan, dan pengantar profil</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Fakultas / Unit / Departemen</label>
            <input
              type="text"
              value={p.departmentName || p.tagline || ''}
              onChange={(e) => updateProfile('departmentName', e.target.value)}
              placeholder="Fakultas Teknik / Pusat Admisi PMB"
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tagline / Slogan</label>
            <input
              type="text"
              value={p.tagline || ''}
              onChange={(e) => updateProfile('tagline', e.target.value)}
              placeholder="Membangun Generasi Unggul Berkarakter & Berdaya Saing Global"
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Biografi & Pengantar Singkat</label>
            <textarea
              rows={3}
              value={p.bio || ''}
              onChange={(e) => updateProfile('bio', e.target.value)}
              placeholder="Tuliskan keterangan singkat mengenai profil dan keunggulan unit kampus..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-500" /> Lokasi Kampus
              </label>
              <input
                type="text"
                value={p.location || ''}
                onChange={(e) => updateProfile('location', e.target.value)}
                placeholder="Cikarang Pusat, Kab. Bekasi"
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3 text-blue-500" /> Email Resmi
              </label>
              <input
                type="email"
                value={p.email || ''}
                onChange={(e) => updateProfile('email', e.target.value)}
                placeholder="humas@pelitabangsa.ac.id"
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Verified Account Switch */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-blue-600" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Lencana Akun Resmi (Verified Badge)</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Tampilkan centang biru terverifikasi di samping logo</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={p.isVerified !== false && p.verified !== false}
              onChange={(e) => {
                updateProfile('isVerified', e.target.checked);
                updateProfile('verified', e.target.checked);
              }}
              className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
            />
          </div>

        </div>
      </div>

    </div>
  );
}
