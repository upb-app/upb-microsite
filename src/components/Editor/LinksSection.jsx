import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Link as LinkIcon, 
  Flame, 
  Eye, 
  EyeOff,
  Power
} from 'lucide-react';
import DynamicIcon from '../Common/DynamicIcon';
import IconPickerModal from './IconPickerModal';

const ANIMATIONS = [
  { id: 'inherit', label: 'Ikuti Tema Global' },
  { id: 'anim-hover-scale', label: 'Hover Scale & Float' },
  { id: 'anim-pulse', label: 'Pulse Berdenyut (Hot)' },
  { id: 'anim-float', label: 'Floating Melayang Halus' },
  { id: 'anim-glow', label: 'Glow Cahaya Amber' },
  { id: 'anim-shimmer', label: 'Shimmer Kilau Gelombang' },
  { id: 'anim-bounce', label: 'Bounce Membal Ringan' },
  { id: 'none', label: 'Tanpa Animasi' },
];

const BADGE_COLOR_OPTIONS = [
  { label: 'Amber (Hot)', class: 'bg-amber-500 text-slate-950' },
  { label: 'Blue (Resmi)', class: 'bg-blue-600 text-white' },
  { label: 'Green (Online)', class: 'bg-emerald-500 text-slate-950' },
  { label: 'Rose (Event)', class: 'bg-rose-500 text-white' },
  { label: 'Purple (Khusus)', class: 'bg-purple-600 text-white' },
  { label: 'Cyan (Informatika)', class: 'bg-cyan-500 text-slate-950' },
];

const QUICK_TEMPLATES = [
  { title: 'Penerimaan Mahasiswa Baru', subtitle: 'Registrasi online gelombang 1', icon: 'UserPlus', badge: 'PMB 2026', badgeColor: 'bg-amber-500 text-slate-950', animation: 'anim-pulse', highlight: true, isActive: true },
  { title: 'Sistem Informasi Akademik (SIAKAD)', subtitle: 'Pengisian KRS & KHS online', icon: 'GraduationCap', badge: 'PORTAL', badgeColor: 'bg-blue-600 text-white', animation: 'anim-hover-scale', highlight: false, isActive: true },
  { title: 'Hubungi Helpdesk WhatsApp UPB', subtitle: 'Layanan informasi & bantuan mahasiswa', icon: 'MessageSquare', badge: 'ONLINE', badgeColor: 'bg-emerald-500 text-slate-950', animation: 'anim-glow', highlight: false, isActive: true },
  { title: 'Download Buku Panduan Akademik', subtitle: 'Pedoman kurikulum & jadwal kuliah PDF', icon: 'Download', badge: 'PDF', badgeColor: 'bg-purple-600 text-white', animation: 'anim-hover-scale', highlight: false, isActive: true },
];

export default function LinksSection({ links = [], setLinks }) {
  const safeLinks = Array.isArray(links) ? links : [];
  const [activeIconPicker, setActiveIconPicker] = useState(null);
  const [expandedLinkId, setExpandedLinkId] = useState(safeLinks[0]?.id || null);

  const handleAddLink = (template = null) => {
    const newId = `link-${Date.now()}`;
    const newLink = template ? {
      id: newId,
      title: template.title,
      subtitle: template.subtitle,
      url: 'https://pelitabangsa.ac.id',
      icon: template.icon,
      animation: template.animation,
      badge: template.badge,
      badgeColor: template.badgeColor,
      highlight: template.highlight,
      isActive: true,
      clicks: 0
    } : {
      id: newId,
      title: 'Tautan Baru Kampus',
      subtitle: 'Keterangan singkat mengenai tautan ini',
      url: 'https://pelitabangsa.ac.id',
      icon: 'BookOpen',
      animation: 'anim-hover-scale',
      badge: '',
      badgeColor: 'bg-amber-500 text-slate-950',
      highlight: false,
      isActive: true,
      clicks: 0
    };

    setLinks([...safeLinks, newLink]);
    setExpandedLinkId(newId);
  };

  const handleUpdateLink = (id, field, value) => {
    setLinks(safeLinks.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleToggleLinkActive = (id, e) => {
    if (e) e.stopPropagation();
    setLinks(safeLinks.map(l => {
      if (l.id === id) {
        const next = l.isActive === false ? true : false;
        return { ...l, isActive: next };
      }
      return l;
    }));
  };

  const handleDeleteLink = (id) => {
    setLinks(safeLinks.filter(l => l.id !== id));
  };

  const handleMoveLink = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= safeLinks.length) return;
    const updated = [...safeLinks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setLinks(updated);
  };

  const activeCount = safeLinks.filter(l => l.isActive !== false).length;
  const inactiveCount = safeLinks.length - activeCount;

  return (
    <div className="p-4 sm:p-5 space-y-5 animate-fadeIn text-left">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
              <LinkIcon className="w-4 h-4" />
            </span>
            Daftar Tombol & Tautan ({safeLinks.length})
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {activeCount} Aktif
            </span>
            {inactiveCount > 0 && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-semibold text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  {inactiveCount} Nonaktif
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleAddLink()}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Tombol Baru
        </button>
      </div>

      {/* Quick Add Presets */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Tambah Cepat Tombol Universitas:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUICK_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAddLink(tmpl)}
              className="flex items-center gap-2.5 p-2.5 bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 hover:border-amber-500/50 rounded-xl text-left transition group shadow-2xs"
            >
              <div className="p-1.5 bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg transition">
                <DynamicIcon name={tmpl.icon} className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-amber-600 dark:group-hover:text-amber-300">{tmpl.title}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{tmpl.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Links Accordion List */}
      <div className="space-y-3">
        {safeLinks.map((link, index) => {
          const isExpanded = expandedLinkId === link.id;
          const isLinkActive = link.isActive !== false;

          return (
            <div 
              key={link.id}
              className={`bg-white dark:bg-slate-800/80 border rounded-2xl transition-all overflow-hidden shadow-xs ${
                !isLinkActive 
                  ? 'opacity-75 border-slate-300 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/40' 
                  : (link.highlight ? 'border-amber-500/60 shadow-md shadow-amber-500/10' : 'border-slate-200 dark:border-slate-700/60')
              }`}
            >
              {/* Accordion Header */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/80 dark:bg-slate-900/60 gap-2.5 border-b border-slate-100 dark:border-white/5">
                <div 
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => setExpandedLinkId(isExpanded ? null : link.id)}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIconPicker(link.id);
                    }}
                    className={`p-2 rounded-xl border transition flex-shrink-0 shadow-2xs ${
                      isLinkActive
                        ? 'bg-white dark:bg-slate-800 hover:bg-amber-500/20 border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400'
                        : 'bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 text-slate-400'
                    }`}
                    title="Ganti Icon"
                  >
                    <DynamicIcon name={link.icon || 'Globe'} className="w-5 h-5" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-xs font-bold truncate ${isLinkActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 line-through'}`}>
                        {link.title || 'Tanpa Judul'}
                      </h4>
                      {link.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${link.badgeColor || 'bg-amber-500 text-slate-950'}`}>
                          {link.badge}
                        </span>
                      )}
                      {link.highlight && isLinkActive && (
                        <span className="p-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded">
                          <Flame className="w-3 h-3" />
                        </span>
                      )}
                      {!isLinkActive && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Nonaktif
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {link.url || 'Belum ada URL'}
                    </p>
                  </div>
                </div>

                {/* Quick actions: Toggle Active, Move Up/Down, Delete */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Active / Inactive Quick Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleLinkActive(link.id, e)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition shadow-2xs ${
                      isLinkActive
                        ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-200 dark:bg-slate-700/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                    }`}
                    title={isLinkActive ? 'Klik untuk Nonaktifkan tombol ini dari publik' : 'Klik untuk Aktifkan tombol ini di publik'}
                  >
                    {isLinkActive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="hidden sm:inline">Aktif</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 text-slate-400" />
                        <span className="hidden sm:inline">Nonaktif</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveLink(index, -1)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                    title="Pindahkan Ke Atas"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === links.length - 1}
                    onClick={() => handleMoveLink(index, 1)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                    title="Pindahkan Ke Bawah"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-lg transition"
                    title="Hapus Tombol"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Accordion Content (Form Edit) */}
              {isExpanded && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700/60 space-y-3.5 bg-white dark:bg-slate-900/40 animate-fadeIn">
                  
                  {/* Status Toggle Row */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Status Visibilitas Tombol
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isLinkActive
                          ? 'Tombol ini aktif dan dapat diklik oleh pengunjung di internet.'
                          : 'Tombol ini disembunyikan dari tampilan publik tanpa menghapus datanya.'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleToggleLinkActive(link.id, e)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isLinkActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isLinkActive ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Judul & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Judul Tombol</label>
                      <input
                        type="text"
                        value={link.title || ''}
                        onChange={(e) => handleUpdateLink(link.id, 'title', e.target.value)}
                        placeholder="Contoh: Penerimaan Mahasiswa Baru"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Sub-judul / Keterangan</label>
                      <input
                        type="text"
                        value={link.subtitle || ''}
                        onChange={(e) => handleUpdateLink(link.id, 'subtitle', e.target.value)}
                        placeholder="Contoh: Registrasi online gelombang 1"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                  </div>

                  {/* URL Tautan */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Tujuan / Link Website</label>
                    <input
                      type="url"
                      value={link.url || ''}
                      onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}
                      placeholder="https://pmb.pelitabangsa.ac.id"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-mono transition"
                    />
                  </div>

                  {/* Badge & Animation Settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Teks Lencana (Badge)</label>
                      <input
                        type="text"
                        value={link.badge || ''}
                        onChange={(e) => handleUpdateLink(link.id, 'badge', e.target.value)}
                        placeholder="Contoh: PMB 2026, HOT, BARU"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Warna Badge</label>
                      <select
                        value={link.badgeColor || 'bg-amber-500 text-slate-950'}
                        onChange={(e) => handleUpdateLink(link.id, 'badgeColor', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
                      >
                        {BADGE_COLOR_OPTIONS.map((opt, i) => (
                          <option key={i} value={opt.class}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Animasi Tombol */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Efek Animasi Tombol</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {ANIMATIONS.map((anim) => (
                        <button
                          key={anim.id}
                          type="button"
                          onClick={() => handleUpdateLink(link.id, 'animation', anim.id)}
                          className={`p-2 rounded-xl text-left border text-xs transition ${
                            (link.animation || 'anim-hover-scale') === anim.id
                              ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <span className="truncate block">{anim.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Highlight Feature Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={link.highlight || false}
                        onChange={(e) => handleUpdateLink(link.id, 'highlight', e.target.checked)}
                        className="rounded text-amber-500 focus:ring-amber-400"
                      />
                      <span>Beri sorotan emas bercahaya (Highlight Prioritas Utama)</span>
                    </label>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Icon Picker Modal */}
      {activeIconPicker && (
        <IconPickerModal
          isOpen={true}
          onClose={() => setActiveIconPicker(null)}
          currentIcon={safeLinks.find(l => l.id === activeIconPicker)?.icon || 'Globe'}
          onSelect={(newIcon) => {
            handleUpdateLink(activeIconPicker, 'icon', newIcon);
            setActiveIconPicker(null);
          }}
        />
      )}

    </div>
  );
}
