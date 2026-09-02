import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { ICON_CATEGORIES } from '../../data/iconsList';
import DynamicIcon from '../Common/DynamicIcon';

export default function IconPickerModal({ isOpen, onClose, onSelectIcon, currentIcon }) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
                <Search className="w-4 h-4" />
              </span>
              Pilih Icon Tombol Akademik & Layanan
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Pilih icon yang sesuai dengan fungsi tombol tautan</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/50">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari icon (contoh: buku, toga, pmb, whatsapp, download)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/70 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              autoFocus
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {filteredIcons.map((icon) => {
            const isSelected = currentIcon === icon.name;
            return (
              <button
                key={icon.name}
                onClick={() => {
                  onSelectIcon(icon.name);
                  onClose();
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition group ${
                  isSelected 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/30' 
                    : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:border-amber-500/50 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-950/40 group-hover:scale-110 transition">
                  <DynamicIcon name={icon.name} className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-medium mt-1.5 truncate max-w-full text-slate-300 group-hover:text-amber-300">
                  {icon.label}
                </span>
                <span className="text-[9px] text-slate-500 truncate max-w-full">
                  {icon.name}
                </span>
              </button>
            );
          })}
          {filteredIcons.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm">Tidak ada icon yang cocok dengan "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
