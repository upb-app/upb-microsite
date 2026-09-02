import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MousePointerClick, 
  Eye, 
  TrendingUp, 
  RotateCcw,
  Smartphone,
  Monitor,
  Tablet,
  Radio,
  Clock,
  ExternalLink,
  Flame,
  Globe
} from 'lucide-react';
import DynamicIcon from '../Common/DynamicIcon';
import { 
  getLocalAnalytics, 
  getLocalActivityLogs, 
  resetLocalAnalytics 
} from '../../services/analyticsService';

export default function AnalyticsSection({ site, links, onResetClicks }) {
  const [stats, setStats] = useState(() => getLocalAnalytics(site?.id));
  const [activityLogs, setActivityLogs] = useState(() => getLocalActivityLogs(site?.id));

  // Polling for live real-time updates every 2.5 seconds
  useEffect(() => {
    const updateLiveStats = () => {
      if (site?.id) {
        setStats(getLocalAnalytics(site.id));
        setActivityLogs(getLocalActivityLogs(site.id));
      }
    };

    updateLiveStats();
    const interval = setInterval(updateLiveStats, 2500);
    return () => clearInterval(interval);
  }, [site?.id]);

  // Compute metrics
  const totalViews = stats.views || 0;
  
  // Calculate total clicks combining link clicks + live recorded clicks
  const computedClicksMap = { ...stats.clicks };
  links.forEach(l => {
    if (l.clicks) {
      computedClicksMap[l.id] = (computedClicksMap[l.id] || 0) + l.clicks;
    }
  });

  const totalClicks = Object.values(computedClicksMap).reduce((acc, curr) => acc + curr, 0);
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;

  // Device breakdown
  const devices = stats.devices || { Mobile: 0, Desktop: 0, Tablet: 0 };
  const totalDeviceViews = (devices.Mobile || 0) + (devices.Desktop || 0) + (devices.Tablet || 0);
  const mobilePct = totalDeviceViews > 0 ? Math.round(((devices.Mobile || 0) / totalDeviceViews) * 100) : 75;
  const desktopPct = totalDeviceViews > 0 ? Math.round(((devices.Desktop || 0) / totalDeviceViews) * 100) : 20;
  const tabletPct = totalDeviceViews > 0 ? Math.round(((devices.Tablet || 0) / totalDeviceViews) * 100) : 5;

  const handleReset = () => {
    if (window.confirm('Reset semua data statistik kunjungan dan klik untuk microsite ini?')) {
      resetLocalAnalytics(site?.id);
      if (onResetClicks) onResetClicks();
      setStats({ views: 0, clicks: {}, devices: { Mobile: 0, Desktop: 0, Tablet: 0 } });
      setActivityLogs([]);
    }
  };

  const sortedLinks = [...links].sort((a, b) => {
    const clicksA = computedClicksMap[a.id] || 0;
    const clicksB = computedClicksMap[b.id] || 0;
    return clicksB - clicksA;
  });

  return (
    <div className="p-4 sm:p-5 space-y-5 animate-fadeIn text-left">
      
      {/* Header Info */}
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex-shrink-0">
            <BarChart3 className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Statistik & Analitik Real-Time
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-500" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pantau kunjungan publik dan interaksi klik tombol tautan secara langsung
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 transition shadow-2xs"
          title="Reset statistik klik & kunjungan"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total Views */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-3.5 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">
            <Eye className="w-3.5 h-3.5 text-blue-500" />
            <span>Kunjungan Live</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalViews.toLocaleString('id-ID')}
          </span>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 block mt-0.5 font-bold">
            Realtime Viewers
          </span>
        </div>

        {/* Total Clicks */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-3.5 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">
            <MousePointerClick className="w-3.5 h-3.5 text-amber-500" />
            <span>Total Klik Tombol</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {totalClicks.toLocaleString('id-ID')}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-bold">
            Aktif Terhubung
          </span>
        </div>

        {/* CTR */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-3.5 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>CTR (Konversi)</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {ctr}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
            Rasio Klik / Kunjungan
          </span>
        </div>
      </div>

      {/* Device Breakdown Card */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
          <span>Distribusi Perangkat Pengunjung</span>
          <span className="text-[11px] text-slate-400 lowercase font-normal">{totalDeviceViews} sesi terdeteksi</span>
        </h4>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 mb-0.5">
              <Smartphone className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-semibold text-[11px]">Smartphone</span>
            </div>
            <span className="font-black text-sm text-slate-800 dark:text-slate-100">{mobilePct}%</span>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 mb-0.5">
              <Monitor className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-semibold text-[11px]">Desktop</span>
            </div>
            <span className="font-black text-sm text-slate-800 dark:text-slate-100">{desktopPct}%</span>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 mb-0.5">
              <Tablet className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold text-[11px]">Tablet</span>
            </div>
            <span className="font-black text-sm text-slate-800 dark:text-slate-100">{tabletPct}%</span>
          </div>
        </div>
      </div>

      {/* Per-Link Breakdown Table */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Performa Klik Setiap Tombol Tautan
        </h4>

        <div className="space-y-2.5">
          {sortedLinks.map((link) => {
            const clicks = computedClicksMap[link.id] || 0;
            const percentage = totalClicks > 0 ? ((clicks / totalClicks) * 100).toFixed(1) : 0;

            return (
              <div key={link.id} className="space-y-1.5 bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-lg flex-shrink-0">
                      <DynamicIcon name={link.icon || 'Globe'} className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{link.title}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold font-mono text-amber-600 dark:text-amber-400">{clicks} klik</span>
                    <span className="text-slate-400 text-[11px] ml-1">({percentage}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Activity Log Stream */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Aktivitas Interaksi Pengunjung Terbaru
          </span>
          <span className="text-[10px] text-slate-400 font-normal">Diperbarui real-time</span>
        </h4>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {activityLogs.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-400">
              Belum ada aktivitas klik tercatat. Buka halaman publik dan klik tombol untuk melihat data langsung!
            </div>
          ) : (
            activityLogs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-700/40 text-xs shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold flex-shrink-0">
                    {log.device || 'Mobile'}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {log.linkTitle}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
