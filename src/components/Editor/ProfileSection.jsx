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

const BANNER_PRESETS = [
  { label: 'Gedung UPB', url: './img/upb-bg2.JPG' },
  { label: 'Kampus Pelita Bangsa', url: './img/upb-bg.JPG' },
  { label: 'Riset & Teknologi', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Perpustakaan Digital', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Mahasiswa & Festival', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80' },
];

const AVATAR_PRESETS = [
  { label: 'Logo Resmi UPB', url: './img/logo-universitas-pelita-bangsa.png' },
  { label: 'Mahasiswa', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80' },
  { label: 'Dosen / Peneliti', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { label: 'Fakultas Teknik', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&auto=format&fit=crop&q=80' },
  { label: 'Organisasi Mahasiswa', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&auto=format&fit=crop&q=80' },
];

export default function ProfileSection({ profile, updateProfile }) {
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
            onClick={() => updateProfile('showBanner', !profile.showBanner)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              profile.showBanner 
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            {profile.showBanner ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {profile.showBanner ? 'Tampilkan' : 'Sembunyikan'}
          </button>
        </div>

        {profile.showBanner && (
          <div className="space-y-3 pt-1">
            {/* Preview Banner */}
            <div className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 group">
              <img 
                src={profile.headerBannerUrl || BANNER_PRESETS[0].url} 
                alt="Banner Preview" 
                className="w-full h-full object-cover"
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
                value={profile.headerBannerUrl || ''}
                onChange={(e) => updateProfile('headerBannerUrl', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Presets */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">Pilihan Gambar Banner Cepat:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BANNER_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateProfile('headerBannerUrl', p.url)}
                    className="p-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/50 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 truncate text-left transition hover:border-amber-500 shadow-2xs"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Avatar / Logo Identitas */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <Building2 className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Logo / Foto Profil</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Lambang institusi, prodi, ormawa, atau foto dosen</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-amber-500/60 flex-shrink-0 shadow-md p-1 group flex items-center justify-center">
            <img 
              src={profile.avatarUrl || AVATAR_PRESETS[0].url} 
              alt="Avatar" 
              className="w-full h-full object-contain rounded-xl"
            />
            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer rounded-2xl">
              <Upload className="w-5 h-5 text-amber-400" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Foto / Logo</label>
              <input
                type="text"
                value={profile.avatarUrl || ''}
                onChange={(e) => updateProfile('avatarUrl', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition">
              <Upload className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Upload dari Komputer
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Avatar presets */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">Preset Logo & Profil:</label>
          <div className="flex flex-wrap gap-2">
            {AVATAR_PRESETS.map((a, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => updateProfile('avatarUrl', a.url)}
                className="px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 transition hover:border-amber-500 shadow-2xs"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Identitas & Teks Universitas */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="p-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Sparkles className="w-4 h-4" />
          </span>
          Informasi & Deskripsi Microsite
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Universitas / Institusi</label>
            <input
              type="text"
              value={profile.universityName || ''}
              onChange={(e) => updateProfile('universityName', e.target.value)}
              placeholder="UNIVERSITAS PELITA BANGSA"
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit / Fakultas / Judul Microsite</label>
            <input
              type="text"
              value={profile.departmentName || ''}
              onChange={(e) => updateProfile('departmentName', e.target.value)}
              placeholder="Contoh: Penerimaan Mahasiswa Baru (PMB) / Fakultas Teknik"
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tagline / Slogan Kampus</label>
            <input
              type="text"
              value={profile.tagline || ''}
              onChange={(e) => updateProfile('tagline', e.target.value)}
              placeholder="Membangun Generasi Unggul Berkarakter..."
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bio / Deskripsi Singkat</label>
            <textarea
              rows={3}
              value={profile.bio || ''}
              onChange={(e) => updateProfile('bio', e.target.value)}
              placeholder="Deskripsi layanan atau pengantar microsite..."
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition resize-none"
            />
          </div>

          {/* Verified Badge & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Centang Terverifikasi</span>
              </div>
              <input
                type="checkbox"
                checked={!!profile.isVerified}
                onChange={(e) => updateProfile('isVerified', e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Teks Badge (Pill Akreditasi)</label>
              <input
                type="text"
                value={profile.badgeText || ''}
                onChange={(e) => updateProfile('badgeText', e.target.value)}
                placeholder="Contoh: Kampus Terakreditasi Unggul"
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Location & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                Lokasi Kampus
              </label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => updateProfile('location', e.target.value)}
                placeholder="Cikarang Pusat, Bekasi"
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                Email Resmi
              </label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => updateProfile('email', e.target.value)}
                placeholder="humas@pelitabangsa.ac.id"
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
