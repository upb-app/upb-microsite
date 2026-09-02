import React from 'react';
import { 
  Palette, 
  Sparkles, 
  Sliders, 
  Layers, 
  Type, 
  Image, 
  Upload, 
  Check,
  MousePointer
} from 'lucide-react';

const GRADIENT_PRESETS = [
  { label: 'Deep University Navy', value: 'from-[#0A192F] via-[#0F2C59] to-[#1E3E62]', color: 'bg-gradient-to-b from-[#0A192F] to-[#1E3E62]' },
  { label: 'Royal Gold & Navy', value: 'from-[#141E30] via-[#0F2C59] to-[#243B55]', color: 'bg-gradient-to-b from-[#141E30] to-[#243B55]' },
  { label: 'Academic Cyber Night', value: 'from-[#050b14] via-[#09182a] to-[#041d38]', color: 'bg-gradient-to-b from-[#050b14] to-[#041d38]' },
  { label: 'Emerald Campus Park', value: 'from-[#041a15] via-[#0b2923] to-[#07131b]', color: 'bg-gradient-to-b from-[#041a15] to-[#07131b]' },
  { label: 'Rose & Crimson Sunset', value: 'from-[#1a0f1e] via-[#2a1324] to-[#0f172a]', color: 'bg-gradient-to-b from-[#1a0f1e] to-[#0f172a]' },
  { label: 'Minimalist Dark Slate', value: 'from-[#0b0f19] via-[#111827] to-[#1e293b]', color: 'bg-gradient-to-b from-[#0b0f19] to-[#1e293b]' },
];

const BACKGROUND_IMAGES = [
  { label: 'Gedung Rektorat & Plaza UPB', url: '/img/upb-bg2.JPG' },
  { label: 'Kampus Pelita Bangsa', url: '/img/upb-bg.JPG' },
  { label: 'Perpustakaan Digital', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80' },
  { label: 'Teknologi & Smart Campus', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=80' },
];

const BUTTON_VARIANTS = [
  { id: 'glass', label: 'Glassmorphism', desc: 'Efek kaca transparan blur modern' },
  { id: 'solid', label: 'Solid Slate', desc: 'Warna solid elegan berkontras tinggi' },
  { id: 'outline', label: 'Outline Minimalis', desc: 'Garis border dengan transisi hover halus' },
  { id: 'gradient', label: 'Gradient Navy', desc: 'Gradasi biru universitas berwibawa' },
  { id: 'soft', label: 'Soft Overlay', desc: 'Transparan tipis menyatu dengan latar' },
];

const ROUNDED_OPTIONS = [
  { id: 'rounded-none', label: 'Kotak (Sharp)' },
  { id: 'rounded-lg', label: 'Sudut Lembut (LG)' },
  { id: 'rounded-2xl', label: 'Rounded Modern (2XL)' },
  { id: 'rounded-full', label: 'Pill Kapsul (Full)' },
];

const GLOBAL_ANIMATIONS = [
  { id: 'anim-hover-scale', label: 'Hover Float & Scale' },
  { id: 'anim-pulse', label: 'Pulse Berdenyut' },
  { id: 'anim-float', label: 'Floating Melayang' },
  { id: 'anim-glow', label: 'Glow Bercahaya' },
  { id: 'anim-shimmer', label: 'Shimmer Gelombang' },
  { id: 'anim-bounce', label: 'Bounce Membal' },
  { id: 'none', label: 'Tanpa Animasi' },
];

const FONTS = [
  { id: 'sans', label: 'Plus Jakarta Sans (Modern)', class: 'font-sans' },
  { id: 'serif', label: 'Playfair Display (Akademik Klasik)', class: 'font-serif' },
  { id: 'mono', label: 'JetBrains Mono (Teknologi & Komputer)', class: 'font-mono' },
];

export default function DesignSection({ theme, updateTheme, buttonStyle, updateButtonStyle }) {
  const handleBgImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateTheme('bgImageUrl', reader.result);
        updateTheme('bgType', 'image');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 sm:p-5 space-y-5 animate-fadeIn text-left">
      
      {/* 1. Background Theme Customization */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
            <Palette className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Latar Belakang (Background)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Atur gaya latar warna, gradasi, pola, atau foto kampus</p>
          </div>
        </div>

        {/* Background Type Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'gradient', label: 'Gradasi Warna' },
            { id: 'image', label: 'Foto Kampus' },
            { id: 'solid', label: 'Warna Solid' },
            { id: 'mesh', label: 'Mesh Gradient' },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => updateTheme('bgType', type.id)}
              className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                theme.bgType === type.id
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Dynamic Controls based on bgType */}
        {theme.bgType === 'gradient' && (
          <div className="space-y-3 pt-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Pilihan Gradasi Universitas:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GRADIENT_PRESETS.map((grad, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateTheme('bgGradient', grad.value)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition ${
                    theme.bgGradient === grad.value
                      ? 'border-amber-500 ring-2 ring-amber-500/30 bg-white dark:bg-slate-900 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/60 hover:border-slate-400'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg ${grad.color} border border-white/20 flex-shrink-0 shadow-2xs`} />
                  <span className="text-[11px] text-slate-800 dark:text-slate-200 font-medium truncate">{grad.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {theme.bgType === 'image' && (
          <div className="space-y-3.5 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Gambar Latar</label>
              <input
                type="text"
                value={theme.bgImageUrl || ''}
                onChange={(e) => updateTheme('bgImageUrl', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Upload Background Sendiri
                <input type="file" accept="image/*" onChange={handleBgImageUpload} className="hidden" />
              </label>
            </div>

            {/* Background Presets */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">Preset Foto Kampus:</label>
              <div className="grid grid-cols-2 gap-2">
                {BACKGROUND_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateTheme('bgImageUrl', img.url)}
                    className="p-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 truncate text-left transition hover:border-amber-500 shadow-2xs"
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Opacity & Blur Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Kegelapan Overlay (Dim)</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{theme.bgOverlayOpacity ?? 75}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={theme.bgOverlayOpacity ?? 75}
                  onChange={(e) => updateTheme('bgOverlayOpacity', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Efek Blur Latar</label>
                <div className="flex gap-2">
                  {['none', 'sm', 'md', 'lg'].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => updateTheme('bgBlur', b)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold uppercase transition ${
                        theme.bgBlur === b
                          ? 'bg-amber-400 text-slate-950 shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {theme.bgType === 'solid' && (
          <div className="space-y-3 pt-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pilih Warna Solid</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.bgColor || '#0f172a'}
                onChange={(e) => updateTheme('bgColor', e.target.value)}
                className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border border-slate-300 dark:border-slate-700"
              />
              <input
                type="text"
                value={theme.bgColor || '#0f172a'}
                onChange={(e) => updateTheme('bgColor', e.target.value)}
                className="w-36 px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Button Styling & Animations */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <MousePointer className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Gaya & Animasi Tombol (Global)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Atur bentuk tombol, visual glassmorphism, dan animasi bawaan</p>
          </div>
        </div>

        {/* Button Style Variant */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Gaya Visual Tombol</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BUTTON_VARIANTS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => updateButtonStyle('variant', v.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  buttonStyle.variant === v.id
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 ring-1 ring-amber-500 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{v.label}</span>
                  {buttonStyle.variant === v.id && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{v.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Rounded Shapes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Bentuk Sudut Tombol (Roundness)</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ROUNDED_OPTIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => updateButtonStyle('rounded', r.id)}
                className={`p-2 rounded-xl text-xs font-bold border transition ${
                  buttonStyle.rounded === r.id
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Animation */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Animasi Default Semua Tombol</label>
          <select
            value={buttonStyle.animation || 'anim-hover-scale'}
            onChange={(e) => updateButtonStyle('animation', e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition"
          >
            {GLOBAL_ANIMATIONS.map((anim) => (
              <option key={anim.id} value={anim.id}>{anim.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Tipografi / Font */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl">
            <Type className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Tipografi & Gaya Tulisan</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pilih font yang sesuai dengan karakter universitas atau fakultas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {FONTS.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => updateTheme('fontFamily', font.id)}
              className={`p-3 rounded-xl border text-left transition ${
                theme.fontFamily === font.id
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 ring-1 ring-amber-500 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/60 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold text-slate-900 dark:text-slate-100 ${font.class}`}>{font.label}</span>
                {theme.fontFamily === font.id && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
              </div>
              <p className={`text-[11px] text-slate-500 dark:text-slate-400 ${font.class}`}>
                Universitas Pelita Bangsa 2026
              </p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
