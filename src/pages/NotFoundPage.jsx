import React from 'react';
import { ShieldAlert, Home, Globe, ArrowLeft, MessageSquare, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function NotFoundPage({ onGoHome }) {
  const { isDark } = useTheme();

  const currentPath = typeof window !== 'undefined' 
    ? (window.location.pathname + window.location.search) 
    : '';

  const cleanSlug = typeof window !== 'undefined'
    ? window.location.pathname.replace(/^\/s\//, '/').replace(/^\//, '')
    : '';

  const handleHomeClick = (e) => {
    if (e) e.preventDefault();
    if (onGoHome) {
      onGoHome();
    } else {
      if (window.history.pushState) {
        window.history.pushState(null, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors ${
      isDark ? 'bg-[#040914] text-slate-100' : 'bg-[#f4f7fb] text-slate-900'
    }`}>
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className={`relative w-full max-w-lg border rounded-3xl shadow-2xl p-6 sm:p-9 text-center space-y-5 transition-all ${
        isDark 
          ? 'bg-[#071326]/90 border-white/15 backdrop-blur-xl' 
          : 'bg-white/95 border-slate-200 backdrop-blur-xl'
      }`}>
        
        {/* Error Badge & Icon */}
        <div className="space-y-3">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-0.5 mx-auto shadow-xl shadow-rose-600/20 flex items-center justify-center animate-bounce">
            <div className={`w-full h-full rounded-[22px] flex items-center justify-center ${
              isDark ? 'bg-[#071326] text-rose-400' : 'bg-white text-rose-600'
            }`}>
              <ShieldAlert className="w-9 h-9 sm:w-10 sm:h-10" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25">
            <span>404 • Halaman Tidak Ditemukan</span>
          </div>
        </div>

        {/* Text Details & Requested Path */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Microsite Tidak Ditemukan
          </h1>
          
          {cleanSlug && (
            <div className="py-1 px-3 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-white/10 font-mono text-xs text-rose-500 dark:text-rose-400 inline-block max-w-full truncate">
              pmbupb.site/{cleanSlug}
            </div>
          )}

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Alamat URL atau microsite yang Anda akses belum terdaftar, telah dihapus, atau terjadi kesalahan penulisan tautan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2.5">
          <a
            href="/"
            onClick={handleHomeClick}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition transform active:scale-98"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda Utama UPB</span>
          </a>

          <a
            href="https://wa.me/6281212345678"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl border border-slate-300 dark:border-white/10 transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>Hubungi Helpdesk PMB UPB</span>
          </a>
        </div>

        {/* Footer Brand */}
        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5 pt-1 border-t border-slate-200 dark:border-white/5">
          <Globe className="w-3.5 h-3.5" />
          <span>Universitas Pelita Bangsa • Sistem Microsite Terintegrasi</span>
        </div>

      </div>

    </div>
  );
}
