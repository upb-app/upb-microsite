import { ShieldAlert, Home, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function NotFoundPage({ onGoHome }) {
  const { isDark } = useTheme();

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

      <div className={`relative w-full max-w-lg border rounded-3xl shadow-2xl p-6 sm:p-10 text-center space-y-6 transition-all ${
        isDark 
          ? 'bg-[#071326]/90 border-white/15 backdrop-blur-xl' 
          : 'bg-white/95 border-slate-200 backdrop-blur-xl'
      }`}>
        
        {/* Error Badge & Icon */}
        <div className="space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-0.5 mx-auto shadow-xl shadow-rose-600/20 flex items-center justify-center animate-bounce">
            <div className={`w-full h-full rounded-[22px] flex items-center justify-center ${
              isDark ? 'bg-[#071326] text-rose-400' : 'bg-white text-rose-600'
            }`}>
              <ShieldAlert className="w-10 h-10" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span>Error 404 • Not Found</span>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            404
          </h1>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Halaman yang Anda tuju tidak tersedia, telah dipindahkan, atau alamat URL yang Anda masukkan salah.
          </p>
        </div>


        {/* Action Button */}
        <div className="pt-2">
          <a
            href="/"
            onClick={handleHomeClick}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition transform active:scale-98"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda Utama UPB</span>
          </a>
        </div>

        {/* Footer Brand */}
        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5 pt-2">
          <Globe className="w-3.5 h-3.5" />
          <span>Universitas Pelita Bangsa • PMB Official</span>
        </div>

      </div>

    </div>
  );
}
