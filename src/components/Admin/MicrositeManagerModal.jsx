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
  FolderPlus,
  AlertCircle,
  Radio,
  Edit2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import confetti from 'canvas-confetti';
import { sanitizeSlug, validateSlug } from '../../services/micrositeService';

export default function MicrositeManagerModal({
  isOpen,
  onClose,
  microsites,
  activeSiteId,
  onSelectSite,
  onCreateSite,
  onDuplicateSite,
  onDeleteSite,
  onUpdateSite,
  onToggleSiteStatus
}) {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newCategory, setNewCategory] = useState('Fakultas');
  const [newTagline, setNewTagline] = useState('');
  const [formError, setFormError] = useState('');

  // Editing state
  const [editingSiteId, setEditingSiteId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editError, setEditError] = useState('');

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' && window.location.origin.includes('localhost') 
    ? window.location.origin 
    : 'https://pmbupb.site';

  const filteredSites = microsites.filter(site => {
    const matchesSearch = site.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          site.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || site.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSlugInputChange = (val) => {
    const clean = sanitizeSlug(val);
    setNewSlug(clean);
    setFormError('');

    const check = validateSlug(clean, microsites);
    if (!check.isValid) {
      setFormError(check.message);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanSlug = sanitizeSlug(newSlug);
    const check = validateSlug(cleanSlug, microsites);
    if (!check.isValid) {
      setFormError(check.message);
      return;
    }

    if (!newTitle.trim()) {
      setFormError('Mohon isi Judul / Nama Microsite.');
      return;
    }

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
    confetti({ particleCount: 60, spread: 70 });
  };

  const handleCopyLink = (slug, siteId) => {
    const url = `${origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(siteId);
    confetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartEdit = (site) => {
    setEditingSiteId(site.id);
    setEditTitle(site.title);
    setEditSlug(site.slug);
    setEditError('');
  };

  const handleSaveEdit = (siteId) => {
    const clean = sanitizeSlug(editSlug);
    const check = validateSlug(clean, microsites, siteId);
    if (!check.isValid) {
      setEditError(check.message);
      return;
    }
    if (!editTitle.trim()) {
      setEditError('Judul tidak boleh kosong.');
      return;
    }

    if (onUpdateSite) {
      onUpdateSite(siteId, { title: editTitle.trim(), slug: clean });
    }
    setEditingSiteId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
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
                Kelola nama, slug URL aman, dan publikasi microsite fakultas, prodi, dan lembaga.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateFormOpen(!isCreateFormOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreateFormOpen ? 'Tutup Form' : 'Tambah Microsite Baru'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 my-3 flex-shrink-0">
          {/* Create New Microsite Inline Form */}
          {isCreateFormOpen && (
            <form onSubmit={handleCreate} className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 animate-fadeIn text-left ${
              isDark ? 'bg-[#040914] border-blue-500/30 shadow-lg' : 'bg-blue-50/70 border-blue-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between border-b border-blue-200/40 dark:border-white/10 pb-2">
                <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <FolderPlus className="w-4 h-4" />
                  Buat Microsite Baru (Realtime Internet)
                </span>
                <span className="text-[11px] text-slate-500">Karakter aman terverifikasi</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Nama / Judul Microsite:</label>
                  <input
                    type="text"
                    placeholder="Fakultas Teknik (FT UPB)"
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      if (!newSlug) {
                        handleSlugInputChange(e.target.value);
                      }
                    }}
                    className={`w-full px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 border font-bold ${
                      isDark ? 'bg-[#071326] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Slug URL Bersih (Hanya a-z, 0-9, -):</label>
                  <div className="flex items-center">
                    <span className={`px-2.5 py-2 border border-r-0 rounded-l-xl text-xs font-mono font-bold select-none ${
                      isDark ? 'bg-white/5 border-white/20 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-600'
                    }`}>
                      pmbupb.site/
                    </span>
                    <input
                      type="text"
                      placeholder="fakultas-teknik"
                      value={newSlug}
                      onChange={(e) => handleSlugInputChange(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-r-xl focus:outline-none focus:border-blue-500 font-mono font-bold ${
                        isDark ? 'bg-[#071326] border-white/20 text-blue-400' : 'bg-white border-slate-300 text-blue-600'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Kategori:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 border ${
                      isDark ? 'bg-[#071326] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
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
                  <label className="block font-bold mb-1">Tagline Singkat (Opsional):</label>
                  <input
                    type="text"
                    placeholder="Mencetak Insan Kompeten Berdaya Saing"
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 border ${
                      isDark ? 'bg-[#071326] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {formError && (
                <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreateFormOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  Simpan & Terbitkan Microsite
                </button>
              </div>
            </form>
          )}

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:border-blue-500 ${
                  isDark ? 'bg-[#040914] border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-blue-500 ${
                isDark ? 'bg-[#040914] border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="all">Semua Kategori</option>
              <option value="Pusat Admisi">Pusat Admisi</option>
              <option value="Fakultas">Fakultas</option>
              <option value="Program Studi">Program Studi</option>
              <option value="Lembaga / Biro">Lembaga / Biro</option>
              <option value="UKM & Kemahasiswaan">Kemahasiswaan</option>
            </select>
          </div>
        </div>

        {/* Microsites Grid */}
        <div className="flex-1 overflow-y-auto pr-1 my-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
          {filteredSites.map((site) => {
            const isActive = site.id === activeSiteId;
            const isOnline = site.status !== 'Inactive' && site.isActive !== false;
            const isEditing = editingSiteId === site.id;
            const siteUrl = `${origin}/${site.slug}`;

            return (
              <div
                key={site.id}
                className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${
                  isActive 
                    ? (isDark ? 'bg-[#0c2242] border-blue-400 ring-2 ring-blue-400/40 shadow-xl' : 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-400/40 shadow-md')
                    : (isDark ? 'bg-[#040914]/80 hover:bg-[#040914] border-white/10' : 'bg-slate-50 hover:bg-slate-100 border-slate-200')
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      isDark ? 'bg-white/10 text-blue-400 border-white/10' : 'bg-white text-blue-800 border-blue-200'
                    }`}>
                      {site.category}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      {/* Online / Offline Toggle Button */}
                      <button
                        type="button"
                        onClick={() => onToggleSiteStatus && onToggleSiteStatus(site.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
                          isOnline
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                        }`}
                        title={isOnline ? 'Klik untuk nonaktifkan microsite ini' : 'Klik untuk aktifkan microsite ini'}
                      >
                        {isOnline ? 'Aktif (Publik)' : 'Nonaktif (Tutup)'}
                      </button>

                      {isActive && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white flex items-center gap-1 shadow-2xs">
                          <Check className="w-3 h-3" />
                          Sedang Diedit
                        </span>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 p-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-blue-400/50">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">Nama Microsite:</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2 py-1 bg-white dark:bg-slate-950 border rounded text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">Slug (pmbupb.site/):</label>
                        <input
                          type="text"
                          value={editSlug}
                          onChange={(e) => {
                            setEditSlug(sanitizeSlug(e.target.value));
                            setEditError('');
                          }}
                          className="w-full px-2 py-1 bg-white dark:bg-slate-950 border rounded text-xs font-mono font-bold text-blue-600"
                        />
                      </div>
                      {editError && (
                        <span className="text-[11px] text-red-500 block">{editError}</span>
                      )}
                      <div className="flex justify-end gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingSiteId(null)}
                          className="px-2 py-0.5 text-xs rounded border"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(site.id)}
                          className="px-2.5 py-0.5 text-xs bg-blue-600 text-white rounded font-bold"
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black">{site.title}</h4>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(site)}
                          className="p-1 text-slate-400 hover:text-blue-500 rounded transition"
                          title="Ubah Nama & Slug"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <a
                        href={siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-semibold hover:underline block"
                      >
                        pmbupb.site/{site.slug}
                      </a>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {site.data?.profile?.tagline || site.data?.profile?.bio}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Meta & Actions */}
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>{site.data?.links?.length || 0} Link</span>
                    <span>•</span>
                    <span>{site.views || 0} Kunjungan</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Copy Link Action Button */}
                    <button
                      onClick={() => handleCopyLink(site.slug, site.id)}
                      title="Salin Link Microsite"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition"
                    >
                      {copiedId === site.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {/* Open in new tab */}
                    <a
                      href={siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Buka Halaman Publik"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-blue-500 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Duplicate Action */}
                    <button
                      onClick={() => onDuplicateSite(site.id)}
                      title="Duplikasi"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition"
                    >
                      <Layers className="w-3.5 h-3.5" />
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
          <span>Semua microsite disinkronisasi ke Cloud secara real-time dan aktif di seluruh dunia.</span>
          <button onClick={onClose} className="font-bold text-blue-600 hover:underline">
            Selesai →
          </button>
        </div>

      </div>
    </div>
  );
}
