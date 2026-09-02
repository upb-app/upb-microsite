import React from 'react';
import { Sparkles, Check, ArrowRight, Layers, HelpCircle } from 'lucide-react';
import { PRESET_TEMPLATES } from '../../data/presets';
import confetti from 'canvas-confetti';

export default function PresetsSection({ onApplyPreset }) {
  const handleSelect = (preset) => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    onApplyPreset(preset.data);
  };

  return (
    <div className="p-4 sm:p-5 space-y-5 animate-fadeIn text-left">
      
      {/* Header Info */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-amber-400 text-slate-950 rounded-xl flex-shrink-0 shadow-2xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Template Siap Pakai Universitas</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
            Pilih template desain yang sudah dikonfigurasi lengkap dengan tombol, icon, banner, dan animasi khusus untuk berbagai unit kampus.
          </p>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {PRESET_TEMPLATES.map((preset) => (
          <div 
            key={preset.id}
            className="bg-white dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 hover:border-amber-500/60 rounded-2xl p-4 transition-all duration-300 group shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              {/* Thumbnail color preview */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${preset.previewColor} border border-white/20 flex-shrink-0 shadow-md flex items-center justify-center`}>
                <Layers className="w-6 h-6 text-white/90" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 rounded-full">
                    {preset.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition mt-1">
                  {preset.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-md">
                  {preset.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  <span>{preset.data.links.length} Tombol Link</span>
                  <span>•</span>
                  <span>{preset.data.theme.fontFamily.toUpperCase()} Font</span>
                  <span>•</span>
                  <span>{preset.data.buttonStyle.variant.toUpperCase()} Button</span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={() => handleSelect(preset)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-amber-400 text-slate-800 dark:text-slate-200 hover:text-slate-950 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 group-hover:border-amber-500 transition shadow-2xs"
            >
              <span>Terapkan Desain</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
