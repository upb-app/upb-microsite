import React from 'react';
import { Home, ArrowLeft, AlertCircle, Compass, HelpCircle, GraduationCap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function NotFoundPage({ onGoHome }) {
  const { isDark } = useTheme();

  const handleHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden transition-colors ${
      isDark ? 'bg-[#040914] text-slate-100' : 'bg-[#f4f7fb] text-slate-900'
    }`}>
      
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main 404 Container */}
      <div className="relative z-10 max-w-lg w-full text-center space-y-6">
        
        {/* UPB Logo / Brand */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 p-0.5 shadow-xl flex items-center justify-center">
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
              isDark ? 'bg-[#071326]' : 'bg-white'
            }`}>
              <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-left">
            <span className="block text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase leading-tight">
              UNIVERSITAS PELITA BANGSA
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Pusat Penerimaan Mahasiswa Baru
            </span>
          </div>
        </div>

        {/* 404 Graphic & Error Code */}
        <div className={`border rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-4 ${
          isDark 
            ? 'bg-[#071326]/90 border-white/15' 
            : 'bg-white/95 border-slate-200'
        }`}>
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mx-auto">
            <AlertCircle className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight font-mono text-slate-900 dark:text-white">
              404
            </h1>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-200 mt-1">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
              Tautan atau halaman yang Anda tuju tidak tersedia, telah dipindahkan, atau Anda tidak memiliki akses ke alamat ini.
            </p>
          </div>

          {/* Quick Action Navigation */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleHome}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-600/20 transition transform active:scale-98"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Beranda Utama</span>
            </button>

            <a
              href="https://sibara.pelitabangsa.ac.id/"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition ${
                isDark 
                  ? 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-500" />
              <span>Daftar Kuliah (SIBARA)</span>
            </a>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} Biro Admisi & Humas Universitas Pelita Bangsa (UPB).
        </p>

      </div>
    </div>
  );
}
