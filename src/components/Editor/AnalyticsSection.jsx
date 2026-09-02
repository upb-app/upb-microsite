import React from 'react';
import { 
  BarChart3, 
  MousePointerClick, 
  Eye, 
  TrendingUp, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import DynamicIcon from '../Common/DynamicIcon';

export default function AnalyticsSection({ links, onResetClicks }) {
  const totalClicks = links.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const totalViews = totalClicks > 0 ? Math.round(totalClicks * 1.85) + 320 : 120;
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;

  const sortedLinks = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));

  return (
    <div className="p-4 sm:p-5 space-y-5 animate-fadeIn text-left">
      
      {/* Header Info */}
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
            <BarChart3 className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Statistik & Analitik Microsite</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pantau performa interaksi dan klik tombol tautan kampus</p>
          </div>
        </div>

        {onResetClicks && (
          <button
            type="button"
            onClick={onResetClicks}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 transition shadow-2xs"
            title="Reset simulasi hitungan klik"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Klik
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-3.5 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">
            <Eye className="w-3.5 h-3.5 text-blue-500" />
            <span>Kunjungan</span>
          </div>
          <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
            {totalViews.toLocaleString('id-ID')}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-bold">+14% minggu ini</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-3.5 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">
            <MousePointerClick className="w-3.5 h-3.5 text-amber-500" />
            <span>Klik Tombol</span>
          </div>
          <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {totalClicks.toLocaleString('id-ID')}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-bold">Aktif real-time</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-3.5 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>CTR</span>
          </div>
          <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {ctr}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Konversi Tinggi</span>
        </div>
      </div>

      {/* Per-Link Breakdown */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Performa Klik Setiap Tombol Tautan
        </h4>

        <div className="space-y-2.5">
          {sortedLinks.map((link) => {
            const clicks = link.clicks || 0;
            const percentage = totalClicks > 0 ? ((clicks / totalClicks) * 100).toFixed(1) : 0;

            return (
              <div key={link.id} className="space-y-1.5 bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 rounded-lg flex-shrink-0">
                      <DynamicIcon name={link.icon || 'Globe'} className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{link.title}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold font-mono text-amber-600 dark:text-amber-400">{clicks}</span>
                    <span className="text-slate-400 text-[11px] ml-1">({percentage}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
