import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  QrCode, 
  Share2, 
  Download, 
  RotateCcw, 
  ExternalLink, 
  Users, 
  Home, 
  LogOut, 
  ShieldCheck, 
  UserCheck,
  Globe,
  Layers,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

export default function Navbar({ 
  data, 
  activeSiteTitle,
  micrositesCount,
  onOpenMicrositeManager,
  onResetDefault, 
  onOpenQr, 
  onOpenExport, 
  onOpenShare, 
  onOpenPublicView, 
  onOpenPresets, 
  onOpenUserManagement, 
  onGoHome 
}) {
  const { currentUser, isSuperadmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b px-4 sm:px-6 py-2.5 transition-colors duration-300 ${
      isDark 
        ? 'bg-[#071326]/95 border-white/10 text-white' 
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand, Active Microsite Switcher */}
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl p-1 shadow-sm border flex items-center justify-center flex-shrink-0 overflow-hidden ${
            isDark ? 'bg-white/10 border-white/20' : 'bg-slate-100 border-slate-200'
          }`}>
            <img 
              src="./img/logo-universitas-pelita-bangsa.png" 
              alt="Logo Universitas Pelita Bangsa" 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-black tracking-tight flex items-center gap-1.5 uppercase">
                <span className="text-blue-600">UPB</span>
                <span>Studio Microsite</span>
              </h1>
              {currentUser && (
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isSuperadmin 
                    ? 'bg-blue-600 text-white' 
                    : (isDark ? 'bg-white/15 text-white' : 'bg-slate-200 text-slate-800')
                }`}>
                  {isSuperadmin ? 'Superadmin' : 'Admin'}
                </span>
              )}
            </div>

            {/* Active Microsite Quick Switcher Button */}
            <button
              onClick={onOpenMicrositeManager}
              className={`flex items-center gap-1.5 text-xs font-bold tracking-wide mt-0.5 group transition text-left ${
                isDark ? 'text-amber-400 hover:text-yellow-300' : 'text-blue-700 hover:text-blue-800'
              }`}
              title="Klik untuk beralih atau kelola microsite lain"
            >
              <Globe className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform text-blue-500" />
              <span className="truncate max-w-[160px] sm:max-w-[260px]">
                {activeSiteTitle || 'Portal PMB Utama'}
              </span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-normal ${
                isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-700'
              }`}>
                {micrositesCount || 1} situs
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
          </div>
        </div>

        {/* Right Actions Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Multi-Microsite Manager Button */}
          <button
            onClick={onOpenMicrositeManager}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition shadow-sm ${
              isDark 
                ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-400/40' 
                : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
            }`}
            title="Buka Pengelola Semua Microsite"
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden md:inline">Kelola Microsite</span>
          </button>

          {/* Theme Mode Toggle (Sun/Moon) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition flex items-center justify-center shadow-sm ${
              isDark 
                ? 'bg-white/10 hover:bg-white/20 border-white/20 text-amber-400' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
            }`}
            title={isDark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Back to Home button */}
          <button
            onClick={onGoHome}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition shadow-sm ${
              isDark 
                ? 'bg-[#0c2242] hover:bg-[#0f2c59] text-white border-white/15' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
            title="Kembali ke Beranda"
          >
            <Home className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Beranda</span>
          </button>

          {/* Superadmin User Management */}
          {isSuperadmin && (
            <button
              onClick={onOpenUserManagement}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition shadow-sm ${
                isDark 
                  ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-500/30' 
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
              }`}
              title="Kelola User & Hak Akses"
            >
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">User</span>
            </button>
          )}

          {/* QR Code */}
          <button
            onClick={onOpenQr}
            className={`p-2 text-xs font-semibold rounded-xl border transition shadow-sm ${
              isDark 
                ? 'bg-[#0c2242] hover:bg-[#0f2c59] text-white border-white/10' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
            title="Tampilkan QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Export / Import */}
          <button
            onClick={onOpenExport}
            className={`p-2 text-xs font-semibold rounded-xl border transition shadow-sm ${
              isDark 
                ? 'bg-[#0c2242] hover:bg-[#0f2c59] text-white border-white/10' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
            title="Ekspor / Impor"
          >
            <Download className="w-4 h-4 text-blue-500" />
          </button>

          {/* Share */}
          <button
            onClick={onOpenShare}
            className={`p-2 text-xs font-semibold rounded-xl border transition shadow-sm ${
              isDark 
                ? 'bg-[#0c2242] hover:bg-[#0f2c59] text-white border-white/10' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
            title="Bagikan Tautan"
          >
            <Share2 className="w-4 h-4 text-emerald-500" />
          </button>

          {/* Live Fullscreen View */}
          <a
            href="https://sibara.pelitabangsa.ac.id/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              onOpenPublicView();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md transition transform active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lihat Publik</span>
          </a>

          {/* Logout (Red for Destructive Action) */}
          <button
            onClick={logout}
            className={`p-2 rounded-xl border transition ${
              isDark 
                ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/20 border-white/10 hover:border-red-500/40' 
                : 'text-slate-500 hover:text-red-600 hover:bg-red-50 border-slate-300 hover:border-red-200'
            }`}
            title="Keluar (Logout)"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
}
