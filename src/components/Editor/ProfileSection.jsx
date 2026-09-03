import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Mail, 
  Upload, 
  CheckCircle2, 
  Eye, 
  Copy, 
  Check, 
  Link2, 
  Radio, 
  ExternalLink,
  Globe,
  AlertCircle,
  Image as ImageIcon,
  ShieldCheck,
  Type,
  Phone
} from 'lucide-react';
import { normalizeImageUrl, DEFAULT_LOGO, DEFAULT_BANNER } from '../../utils/imageHelper';
import confetti from 'canvas-confetti';
import { sanitizeSlug, validateSlug } from '../../services/micrositeService';

const BANNER_PRESETS = [
  { label: 'Gedung Rektorat & Kampus UPB', url: '/img/upb-bg2.JPG' },
  { label: 'Wisuda & Kelulusan', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Laboratorium & Teknologi', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Perpustakaan Digital', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&auto=format&fit=crop&q=80' },
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
  microsites = []
}) {
  const p = profile || {};
  const currentSlug = site?.slug || p.slug || 'pmb-utama';
  const currentTitle = p.title || site?.title || p.universityName || 'Portal PMB & Admisi';

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

  const handleMainTitleChange = (val) => {
    if (updateSiteMeta) {
      updateSiteMeta('title', val);
    }
    updateProfile('title', val);
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
      
      {/* 1. PENGATURAN TAUTAN & SLUG URL MICROSITE */}
      <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/60 to-white dark:from-slate-800/90 dark:via-[#0c1f3d]/70 dark:to-slate-900 border border-blue-200/80 dark:border-blue-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-200/60 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Alamat Link & Slug URL Bersih</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-500" />
                  Live Publik
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Atur slug URL resmi untuk microsite ini (hanya karakter aman huruf kecil, angka, dan -)
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
          {/* Slug URL Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Slug URL Microsite:
              </label>
              <span className="text-[11px] text-slate-400 font-normal">
                Contoh: pmbupb.site/<strong>{currentSlug}</strong>
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
                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 transition"
                title="Buka di Tab Baru"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PENGATURAN FOTO SAMPUL / BANNER HEADER */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
              <ImageIcon className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Foto Sampul / Banner Header</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Gambar lanskap di bagian paling atas microsite</p>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={p.showBanner !== false} 
              onChange={(e) => updateProfile('showBanner', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {p.showBanner !== false && (
          <div className="space-y-3">
            {/* Banner Preview */}
            <div className="relative w-full h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-inner">
              <img 
                src={bannerPreview} 
                alt="Banner Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = DEFAULT_BANNER;
                }}
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-2 right-2">
                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-black/70 hover:bg-black text-white rounded-lg text-xs font-medium cursor-pointer backdrop-blur-sm transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah File</span>
                  <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Presets Gallery */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Pilih Preset Gambar Kampus:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BANNER_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateProfile('headerBannerUrl', preset.url)}
                    className={`text-left p-2 rounded-xl border text-xs transition flex flex-col gap-1 ${
                      p.headerBannerUrl === preset.url 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-bold' 
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Atau Masukkan URL Gambar Sampul:</label>
              <input
                type="text"
                value={p.headerBannerUrl || ''}
                onChange={(e) => updateProfile('headerBannerUrl', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. LOGO PROFILE & LENCANA VERIFIKASI RESMI */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl">
            <ShieldCheck className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Logo Profile & Centang Biru Resmi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Identitas visual avatar di tengah atas microsite</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center">
              <img 
                src={avatarPreview} 
                alt="Avatar Preview" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = DEFAULT_LOGO;
                }}
              />
            </div>
            {p.isVerified !== false && (
              <div className="absolute -bottom-1 -right-1 p-1 bg-blue-600 text-white rounded-full shadow border border-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.isVerified !== false}
                  onChange={(e) => updateProfile('isVerified', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tampilkan Centang Biru Resmi (Verified)</span>
              </label>

              <button
                type="button"
                onClick={() => updateProfile('avatarUrl', DEFAULT_LOGO)}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Gunakan Logo Resmi UPB
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={p.avatarUrl || ''}
                onChange={(e) => updateProfile('avatarUrl', e.target.value)}
                placeholder="URL Gambar Logo (https://...)"
                className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition"
              />
              <label className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition flex-shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah</span>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 4. STRUKTUR TEKS JUDUL & INFORMASI MICROSITE */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Type className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Judul Utama & Teks Informasi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Atur judul utama, sub-judul, slogan, dan pengantar</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {/* Judul Utama */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              1. Judul Utama Microsite (Teks Putih Utama):
            </label>
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => handleMainTitleChange(e.target.value)}
              placeholder="Contoh: Fakultas Ekonomi & Bisnis (FEB) / PMB Universitas Pelita Bangsa"
              className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition shadow-2xs"
            />
          </div>

          {/* Sub-Judul Emas (Opsional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-amber-600 dark:text-amber-400">
                2. Sub-Judul / Departemen (Teks Warna Emas - Opsional):
              </label>
              <span className="text-[11px] text-slate-400">Kosongkan jika tidak ingin menampilkan sub-judul</span>
            </div>
            <input
              type="text"
              value={p.departmentName || ''}
              onChange={(e) => updateProfile('departmentName', e.target.value)}
              placeholder="Contoh: Program Studi Sarjana & Pascasarjana / Portal Informasi Resmi"
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-amber-300/60 dark:border-amber-500/30 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Slogan / Tagline */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              3. Slogan / Tagline Singkat:
            </label>
            <input
              type="text"
              value={p.tagline || ''}
              onChange={(e) => updateProfile('tagline', e.target.value)}
              placeholder="Mencetak Entrepreneur Mandiri dan Pemimpin Bisnis Global"
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Biografi / Deskripsi */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              4. Biografi & Deskripsi Pengantar:
            </label>
            <textarea
              rows={3}
              value={p.bio || ''}
              onChange={(e) => updateProfile('bio', e.target.value)}
              placeholder="Tuliskan keterangan lengkap mengenai profil, keunggulan, atau petunjuk layanan..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* 5. LENCANA KONTAK & LOKASI KAMPUS */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
            <MapPin className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Lencana Lokasi & Email Resmi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Badge informasi kontak di bawah deskripsi profil</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-red-500" /> Lokasi Kampus:</span>
              <button 
                type="button" 
                onClick={() => updateProfile('location', '')}
                className="text-[10px] text-slate-400 hover:text-red-500"
              >
                Kosongkan
              </button>
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-500" /> Email Resmi:</span>
              <button 
                type="button" 
                onClick={() => updateProfile('email', '')}
                className="text-[10px] text-slate-400 hover:text-red-500"
              >
                Kosongkan
              </button>
            </label>
            <input
              type="email"
              value={p.email || ''}
              onChange={(e) => updateProfile('email', e.target.value)}
              placeholder="humas@pelitabangsa.ac.id"
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
