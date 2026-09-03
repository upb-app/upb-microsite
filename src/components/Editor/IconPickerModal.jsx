import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { ICON_CATEGORIES } from '../../data/iconsList';
import DynamicIcon from '../Common/DynamicIcon';

export default function IconPickerModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  onSelectIcon, 
  currentIcon 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  if (!isOpen) return null;

  const categories = ['Semua', ...ICON_CATEGORIES.map(c => c.category)];

  const filteredIcons = ICON_CATEGORIES.flatMap(c => {
    if (selectedCategory !== 'Semua' && c.category !== selectedCategory) return [];
    return c.icons;
  }).filter(icon => 
    icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChooseIcon = (iconName) => {
    if (typeof onSelect === 'function') {
      onSelect(iconName);
    }
    if (typeof onSelectIcon === 'function') {
      onSelectIcon(iconName);
    }
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#071326] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-[#071326]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-xl">
                <Search className="w-4 h-4" />
              </span>
              Pilih Icon Tombol Akademik & Layanan
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Pilih icon yang sesuai dengan fungsi tombol tautan Anda</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/40">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari icon (contoh: buku, toga, pmb, whatsapp, download, gedung)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              autoFocus
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 min-h-[260px]">
          {filteredIcons.map((icon) => {
            const isSelected = currentIcon === icon.name;
            return (
              <button
                key={icon.name}
                type="button"
                onClick={() => handleChooseIcon(icon.name)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition group active:scale-95 ${
                  isSelected 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/40' 
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-amber-500/50 hover:bg-slate-800/80 hover:text-white shadow-xs'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-950/60 group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition">
                  <DynamicIcon name={icon.name} className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold mt-2 truncate max-w-full text-slate-200 group-hover:text-amber-300">
                  {icon.label}
                </span>
                <span className="text-[9px] text-slate-500 truncate max-w-full font-mono">
                  {icon.name}
                </span>
              </button>
            );
          })}
          {filteredIcons.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-30" />
              <p className="text-xs">Tidak ada icon yang cocok dengan kata kunci "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#071326] flex items-center justify-between text-xs text-slate-400 px-4">
          <span>{filteredIcons.length} icon tersedia</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
