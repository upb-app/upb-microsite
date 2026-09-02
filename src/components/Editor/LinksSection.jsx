import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Link as LinkIcon, 
  Flame, 
  Check, 
  Eye, 
  Edit2,
  HelpCircle,
  Play
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
  { title: 'Penerimaan Mahasiswa Baru', subtitle: 'Registrasi online gelombang 1', icon: 'UserPlus', badge: 'PMB 2026', badgeColor: 'bg-amber-500 text-slate-950', animation: 'anim-pulse', highlight: true },
  { title: 'Sistem Informasi Akademik (SIAKAD)', subtitle: 'Pengisian KRS & KHS online', icon: 'GraduationCap', badge: 'PORTAL', badgeColor: 'bg-blue-600 text-white', animation: 'anim-hover-scale', highlight: false },
  { title: 'Hubungi Helpdesk WhatsApp UPB', subtitle: 'Layanan informasi & bantuan mahasiswa', icon: 'MessageSquare', badge: 'ONLINE', badgeColor: 'bg-emerald-500 text-slate-950', animation: 'anim-glow', highlight: false },
  { title: 'Download Buku Panduan Akademik', subtitle: 'Pedoman kurikulum & jadwal kuliah PDF', icon: 'Download', badge: 'PDF', badgeColor: 'bg-purple-600 text-white', animation: 'anim-hover-scale', highlight: false },
];

export default function LinksSection({ links = [], setLinks }) {
  const safeLinks = Array.isArray(links) ? links : [];
  const [activeIconPicker, setActiveIconPicker] = useState(null); // link id or null
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
      clicks: 0
    };

    setLinks([...safeLinks, newLink]);
    setExpandedLinkId(newId);
  };

  const handleUpdateLink = (id, field, value) => {
    setLinks(safeLinks.map(l => l.id === id ? { ...l, [field]: value } : l));
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

  return (
    <div className="p-4 sm:p-5 space-y-5 animate-fadeIn text-left">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
              <LinkIcon className="w-4 h-4" />
            </span>
            Daftar Tombol & Tautan Microsite ({safeLinks.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kelola tombol aksi, icon animasi, dan label badge</p>
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

          return (
            <div 
              key={link.id}
              className={`bg-white dark:bg-slate-800/80 border rounded-2xl transition-all overflow-hidden shadow-xs ${
                link.highlight ? 'border-amber-500/60 shadow-md shadow-amber-500/10' : 'border-slate-200 dark:border-slate-700/60'
              }`}
            >
              {/* Accordion Header */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/80 dark:bg-slate-900/60 gap-3 border-b border-slate-100 dark:border-white/5">
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
                    className="p-2 bg-white dark:bg-slate-800 hover:bg-amber-500/20 border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400 rounded-xl transition flex-shrink-0 shadow-2xs"
                    title="Ganti Icon"
                  >
                    <DynamicIcon name={link.icon || 'Globe'} className="w-5 h-5" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {link.title || 'Tanpa Judul'}
                      </h4>
                      {link.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${link.badgeColor || 'bg-amber-500 text-slate-950'}`}>
                          {link.badge}
                        </span>
                      )}
                      {link.highlight && (
                        <span className="p-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded">
                          <Flame className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {link.url || 'Belum ada URL'}
                    </p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1">
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
                    className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-lg transition ml-1"
                    title="Hapus Tombol"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Accordion Content (Form Edit) */}
              {isExpanded && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700/60 space-y-3.5 bg-white dark:bg-slate-900/40 animate-fadeIn">
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
                        placeholder="Keterangan singkat..."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                  </div>

                  {/* URL */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL / Link Tujuan</label>
                    <input
                      type="text"
                      value={link.url || ''}
                      onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}
                      placeholder="https://pelitabangsa.ac.id/..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  {/* Animation & Badge Settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Animasi Tombol</label>
                      <select
                        value={link.animation || 'inherit'}
                        onChange={(e) => handleUpdateLink(link.id, 'animation', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                      >
                        {ANIMATIONS.map((anim) => (
                          <option key={anim.id} value={anim.id}>{anim.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Teks Badge (Opsional)</label>
                      <input
                        type="text"
                        value={link.badge || ''}
                        onChange={(e) => handleUpdateLink(link.id, 'badge', e.target.value)}
                        placeholder="Contoh: HOT, BARU, PDF"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                  </div>

                  {/* Badge Color & Highlight Toggle */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    {link.badge && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1">Warna Badge:</span>
                        {BADGE_COLOR_OPTIONS.map((bc, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleUpdateLink(link.id, 'badgeColor', bc.class)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${bc.class} ${link.badgeColor === bc.class ? 'ring-2 ring-white shadow-md' : 'opacity-70 hover:opacity-100'}`}
                          >
                            {bc.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <label className="flex items-center gap-2 cursor-pointer ml-auto">
                      <input
                        type="checkbox"
                        checked={!!link.highlight}
                        onChange={(e) => handleUpdateLink(link.id, 'highlight', e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-700"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        Sorot Tombol Utama (Highlight)
                      </span>
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
          currentIcon={links.find(l => l.id === activeIconPicker)?.icon}
          onSelectIcon={(iconName) => {
            handleUpdateLink(activeIconPicker, 'icon', iconName);
            setActiveIconPicker(null);
          }}
          onClose={() => setActiveIconPicker(null)}
        />
      )}

    </div>
  );
}
