import React from 'react';
import { 
  AlertOctagon, 
  Home, 
  ArrowLeft, 
  ShieldAlert, 
  Search,
  Globe
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function NotFoundPage({ path = '/s/dasbor', onGoHome }) {
  const { isDark } = useTheme();

  const handleHomeClick = () => {
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
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden transition-colors ${
      isDark ? 'bg-[#040914] text-slate-100' : 'bg-[#f4f7fb] text-slate-900'
    }`}>
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main 404 Card */}
      <div className={`relative w-full max-w-lg border rounded-3xl shadow-2xl p-6 sm:p-10 text-center space-y-6 transition-all ${
        isDark 
          ? 'bg-[#071326]/90 border-white/10 backdrop-blur-xl' 
          : 'bg-white/95 border-slate-200 backdrop-blur-xl'
      }`}>
        
        {/* 404 Graphic Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-rose-500/20 via-amber-500/20 to-blue-500/20 border border-rose-500/30 flex items-center justify-center shadow-xl">
            <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500 dark:text-rose-400" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-md">
            404
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Halaman yang Anda tuju <span className="font-mono font-bold text-rose-600 dark:text-rose-400">"{path}"</span> tidak tersedia, telah dipindahkan, atau Anda tidak memiliki izin otentikasi untuk mengakses direktori ini.
          </p>
        </div>

        {/* Status Box */}
        <div className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 ${
          isDark 
            ? 'bg-[#040914]/80 border-white/10 text-slate-300' 
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <AlertOctagon className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <span className="font-bold block text-slate-900 dark:text-slate-100">Akses Terproteksi & Dibatasi</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              Sistem mencatat permintaan akses. Pastikan tautan URL yang Anda masukkan sudah benar.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleHomeClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition transform active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda Utama</span>
          </button>

          <a
            href="https://pmbupb.site"
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold border transition ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/15' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Portal PMB UPB</span>
          </a>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-4 text-center w-full text-[11px] text-slate-500 dark:text-slate-600 font-medium">
        © {new Date().getFullYear()} Universitas Pelita Bangsa. Hak Cipta Dilindungi.
      </div>

    </div>
  );
}
