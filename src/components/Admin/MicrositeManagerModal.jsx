import React, { useState } from 'react';
import { 
  Globe, 
  Plus, 
  Check, 
  Copy, 
  Trash2, 
  ExternalLink, 
  Search, 
  Layers, 
  ArrowRight, 
  X, 
  FolderPlus
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import confetti from 'canvas-confetti';

export default function MicrositeManagerModal({
  isOpen,
  onClose,
  microsites,
  activeSiteId,
  onSelectSite,
  onCreateSite,
  onDuplicateSite,
  onDeleteSite
}) {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newCategory, setNewCategory] = useState('Fakultas');
  const [newTagline, setNewTagline] = useState('');

  if (!isOpen) return null;

  const filteredSites = microsites.filter(site => {
    const matchesSearch = site.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          site.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || site.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim()) {
      alert('Mohon isi Judul Microsite dan Slug URL.');
      return;
    }

    const cleanSlug = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    onCreateSite({
      title: newTitle.trim(),
      slug: cleanSlug,
      category: newCategory,
      tagline: newTagline.trim() || 'Portal Resmi Universitas Pelita Bangsa'
    });

    setNewTitle('');
    setNewSlug('');
    setNewTagline('');
    setIsCreateFormOpen(false);
    confetti({ particleCount: 50 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-4xl border rounded-3xl shadow-2xl p-5 sm:p-7 max-h-[90vh] flex flex-col justify-between overflow-hidden transition-colors ${
        isDark 
          ? 'bg-[#071326] border-white/15 text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b flex-shrink-0 ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 p-0.5 shadow-md flex items-center justify-center">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                isDark ? 'bg-[#040914] text-blue-400' : 'bg-white text-blue-600'
              }`}>
                <Globe className="w-5 h-5" />
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <span>Manajemen Multi-Microsite UPB</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/30">
                  {microsites.length} Situs
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola dan beralih antar microsite fakultas, prodi, dan lembaga.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateFormOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Buat Microsite</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Create Sub-Form */}
        {isCreateFormOpen && (
          <div className={`p-4 my-3 border rounded-2xl animate-fadeIn text-left ${
            isDark ? 'bg-[#0b1d3a] border-blue-400/40 text-white' : 'bg-blue-50/70 border-blue-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-black/10 dark:border-white/10">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <FolderPlus className="w-4 h-4" />
                Form Pembuatan Microsite Baru
              </span>
              <button 
                onClick={() => setIsCreateFormOpen(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-red-500 text-xs font-semibold"
              >
                Batal
              </button>
            </div>

            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama / Judul Microsite:</label>
                <input
                  type="text"
                  placeholder="Contoh: Fakultas Teknik"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) {
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 border ${
                    isDark ? 'bg-[#040914] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Slug URL (Path):</label>
                <div className="flex items-center">
                  <span className={`px-2.5 py-2 border border-r-0 rounded-l-xl text-xs ${
                    isDark ? 'bg-white/5 border-white/20 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-600'
                  }`}>
                    pmbupb.site/s/
                  </span>
                  <input
                    type="text"
                    placeholder="fakultas-teknik"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    className={`w-full px-3 py-2 border rounded-r-xl focus:outline-none focus:border-blue-500 ${
                      isDark ? 'bg-[#040914] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Kategori:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 border ${
                    isDark ? 'bg-[#040914] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Pusat Admisi">Pusat Admisi (PMB)</option>
                  <option value="Fakultas">Fakultas</option>
                  <option value="Program Studi">Program Studi (Prodi)</option>
                  <option value="Lembaga / Biro">Lembaga / Biro / CDC</option>
                  <option value="UKM & Kemahasiswaan">UKM & Kemahasiswaan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Tagline Slogan:</label>
                <input
                  type="text"
                  placeholder="Contoh: Inovasi Rekayasa & AI Berdaya Saing"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 border ${
                    isDark ? 'bg-[#040914] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                {/* Red Batal button */}
                <button
                  type="button"
                  onClick={() => setIsCreateFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-300 hover:border-red-300 dark:bg-white/10 dark:hover:bg-red-950/40 dark:text-slate-200 dark:hover:text-red-400 font-semibold rounded-xl transition"
                >
                  Batal
                </button>
                {/* Blue Simpan button */}
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider rounded-xl shadow-md transition"
                >
                  Simpan & Buat
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 flex-shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul / slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:border-blue-500 ${
                isDark ? 'bg-[#040914] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
            {['all', 'Pusat Admisi', 'Fakultas', 'Lembaga / Biro'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition ${
                  categoryFilter === cat 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : (isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700')
                }`}
              >
                {cat === 'all' ? 'Semua' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Microsites Grid */}
        <div className="flex-1 overflow-y-auto pr-1 my-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
          {filteredSites.map((site) => {
            const isActive = site.id === activeSiteId;
            return (
              <div
                key={site.id}
                className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${
                  isActive 
                    ? (isDark ? 'bg-[#0c2242] border-blue-400 ring-2 ring-blue-400/40 shadow-xl' : 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-400/40 shadow-md')
                    : (isDark ? 'bg-[#040914]/80 hover:bg-[#040914] border-white/10' : 'bg-slate-50 hover:bg-slate-100 border-slate-200')
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      isDark ? 'bg-white/10 text-blue-400 border-white/10' : 'bg-white text-blue-800 border-blue-200'
                    }`}>
                      {site.category}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Aktif
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-black">{site.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      pmbupb.site/s/{site.slug}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                      {site.data?.profile?.tagline || site.data?.profile?.bio}
                    </p>
                  </div>
                </div>

                {/* Bottom Meta & Actions */}
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>{site.data?.links?.length || 0} Link</span>
                    <span>•</span>
                    <span>{site.views || 0} Kunjungan</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Duplicate Action */}
                    <button
                      onClick={() => onDuplicateSite(site.id)}
                      title="Duplikasi"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Action (Red for Destructive Action) */}
                    {microsites.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus microsite "${site.title}"?`)) {
                            onDeleteSite(site.id);
                          }
                        }}
                        title="Hapus"
                        className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Select / Switch Button */}
                    {!isActive ? (
                      <button
                        onClick={() => {
                          onSelectSite(site.id);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1"
                      >
                        <span>Pilih</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={onClose}
                        className="px-3 py-1.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-xs rounded-xl border border-blue-200 dark:border-blue-800"
                      >
                        Tutup
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
          <span>Setiap microsite memiliki profil, tombol tautan, desain, dan analitik mandiri.</span>
          <button onClick={onClose} className="font-bold text-blue-600 hover:underline">
            Selesai →
          </button>
        </div>

      </div>
    </div>
  );
}
