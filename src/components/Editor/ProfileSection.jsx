import React from 'react';
import { 
  Building2, 
  Image, 
  Upload, 
  BadgeCheck, 
  MapPin, 
  Mail, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

import { normalizeImageUrl, DEFAULT_LOGO, DEFAULT_BANNER } from '../../utils/imageHelper';

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

export default function ProfileSection({ profile = {}, updateProfile }) {
  const p = profile || {};

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
                  Unggah Gambar
                  <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Input URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Gambar Banner</label>
              <input
                type="text"
                value={p.headerBannerUrl || ''}
                onChange={(e) => updateProfile('headerBannerUrl', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Presets */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">Pilihan Gambar Banner Cepat:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BANNER_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateProfile('headerBannerUrl', preset.url)}
                    className="p-2 bg-white dark:bg-slate-900/80 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-300 transition flex items-center gap-2 group"
                  >
                    <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                      <img src={preset.url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Logo / Avatar Kampus */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <Building2 className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Logo & Foto Profil</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Identitas visual lambang universitas atau foto ketua program</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white p-1 border-2 border-slate-300 dark:border-slate-600 shadow-md flex-shrink-0 group">
            <img 
              src={avatarPreview} 
              alt="Avatar Preview" 
              className="w-full h-full object-contain rounded-xl"
              onError={(e) => { e.target.src = DEFAULT_LOGO; }}
            />
            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer text-white">
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          <div className="flex-1 w-full space-y-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Logo / Foto</label>
              <input
                type="text"
                value={p.avatarUrl || ''}
                onChange={(e) => updateProfile('avatarUrl', e.target.value)}
                placeholder="/img/logo-universitas-pelita-bangsa.png"
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Quick Avatar Presets */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">Pilihan Logo / Avatar Cepat:</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AVATAR_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => updateProfile('avatarUrl', preset.url)}
                className="p-2 bg-white dark:bg-slate-900/80 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-300 transition flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                  <img src={preset.url} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="truncate">{preset.label}</span>
              </button>
            ))}
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
            <p className="text-xs text-slate-500 dark:text-slate-400">Nama universitas, fakultas, slogan, dan pengantar profil</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Universitas / Lembaga</label>
            <input
              type="text"
              value={p.universityName || p.title || ''}
              onChange={(e) => updateProfile('universityName', e.target.value)}
              placeholder="UNIVERSITAS PELITA BANGSA"
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

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
