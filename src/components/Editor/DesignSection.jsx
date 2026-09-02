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

export default function DesignSection({ theme = {}, updateTheme, buttonStyle = {}, updateButtonStyle }) {
  const t = theme || {};
  const b = buttonStyle || {};

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
                (t.bgType || 'gradient') === type.id
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Dynamic Controls based on Background Type */}
        {(t.bgType === 'gradient' || t.bgType === 'mesh' || !t.bgType) && (
          <div className="space-y-2 pt-2">
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Pilih Preset Gradasi Kampus:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GRADIENT_PRESETS.map((grad, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateTheme('bgGradient', grad.value)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition ${
                    t.bgGradient === grad.value
                      ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-500/10'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg ${grad.color} border border-white/20 flex-shrink-0`} />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{grad.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {t.bgType === 'image' && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Gambar Latar Belakang</label>
              <input
                type="text"
                value={t.bgImageUrl || ''}
                onChange={(e) => updateTheme('bgImageUrl', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">Preset Foto Kampus:</label>
              <div className="grid grid-cols-2 gap-2">
                {BACKGROUND_IMAGES.map((bg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateTheme('bgImageUrl', bg.url)}
                    className="p-2 bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-300 transition flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-md bg-slate-200 overflow-hidden flex-shrink-0">
                      <img src={bg.url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="truncate">{bg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Overlay Opacity Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Kegelapan Lapisan Latar (Overlay Darkening)</span>
                <span className="font-mono text-amber-600 dark:text-amber-400">{t.bgOverlayOpacity ?? 75}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={t.bgOverlayOpacity ?? 75}
                onChange={(e) => updateTheme('bgOverlayOpacity', Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {t.bgType === 'solid' && (
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Pilih Warna Solid</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={t.bgColor || '#071326'}
                onChange={(e) => updateTheme('bgColor', e.target.value)}
                className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent"
              />
              <input
                type="text"
                value={t.bgColor || '#071326'}
                onChange={(e) => updateTheme('bgColor', e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition uppercase"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Button Styling */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <MousePointer className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Gaya Tombol & Tautan (Buttons)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pilih bentuk kelengkungan, efek material, dan animasi tombol</p>
          </div>
        </div>

        {/* Variant */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Gaya Visual Material Tombol:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BUTTON_VARIANTS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => updateButtonStyle('variant', v.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  (b.variant || 'glass') === v.id
                    ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold shadow-sm'
                    : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-xs">{v.label}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{v.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Shape Rounded */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Bentuk Sudut Tombol (Corner Radius):</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ROUNDED_OPTIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  updateButtonStyle('rounded', r.id);
                  updateButtonStyle('shape', r.id);
                }}
                className={`p-2.5 rounded-xl border text-center text-xs font-bold transition ${
                  (b.rounded || b.shape || 'rounded-2xl') === r.id
                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                    : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Animation */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Animasi Standar Tombol:</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {GLOBAL_ANIMATIONS.map((anim) => (
              <button
                key={anim.id}
                type="button"
                onClick={() => updateButtonStyle('animation', anim.id)}
                className={`p-2 rounded-xl border text-center text-xs font-medium transition ${
                  (b.animation || 'anim-hover-scale') === anim.id
                    ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold shadow-sm'
                    : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {anim.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Typography Font Family */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Type className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Gaya Tipografi Font</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pilihan jenis huruf font universitas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {FONTS.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => updateTheme('fontFamily', font.id)}
              className={`p-3 rounded-xl border text-left transition ${font.class} ${
                (t.fontFamily || 'sans') === font.id
                  ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="font-bold text-xs">{font.label}</div>
              <div className="text-[11px] opacity-70 mt-0.5">Universitas Pelita Bangsa</div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
