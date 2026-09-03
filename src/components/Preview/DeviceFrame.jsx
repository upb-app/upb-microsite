import React, { useState } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Maximize2, 
  RotateCcw, 
  QrCode,
  Share2,
  ExternalLink
} from 'lucide-react';
import MicrositeRenderer from './MicrositeRenderer';

export default function DeviceFrame({ 
  data, 
  onLinkClick, 
  onOpenQr, 
  onOpenShare, 
  onOpenPublicView 
}) {
  const [deviceMode, setDeviceMode] = useState('mobile'); // 'mobile', 'tablet', 'desktop'

  return (
    <div className="flex flex-col h-full items-center justify-start py-4 px-2 sm:px-4">
      {/* Device Toolbar Controls */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between bg-slate-900/90 border border-slate-700/70 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
              deviceMode === 'mobile' 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Smartphone (Mobile)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
              deviceMode === 'tablet' 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Tablet (iPad)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
              deviceMode === 'desktop' 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Desktop / Laptop"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenQr}
            className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition border border-slate-800"
            title="Tampilkan QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenShare}
            className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition border border-slate-800"
            title="Bagikan Tautan"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenPublicView}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 rounded-xl font-bold text-xs shadow-md shadow-amber-500/20 transition"
            title="Buka Halaman Penuh Pengunjung"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Live</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
        {deviceMode === 'mobile' && (
          <div className="relative w-[340px] sm:w-[365px] h-[680px] max-h-[calc(100vh-170px)] bg-slate-950 rounded-[44px] p-3 shadow-2xl ring-1 ring-slate-700/80 border-4 border-slate-800 flex flex-col">
            {/* Dynamic Island / Speaker Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-between px-2.5 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80 ring-1 ring-blue-900/40"></div>
            </div>

            {/* Screen Viewport with internal scroll */}
            <div className="w-full h-full rounded-[34px] overflow-y-auto overflow-x-hidden relative bg-slate-900">
              <MicrositeRenderer 
                data={data} 
                onLinkClick={onLinkClick} 
                onShareClick={onOpenShare} 
              />
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="w-28 h-1 bg-slate-600/80 rounded-full mx-auto mt-2 mb-0.5"></div>
          </div>
        )}

        {deviceMode === 'tablet' && (
          <div className="relative w-[520px] max-w-full h-[680px] max-h-[calc(100vh-170px)] bg-slate-950 rounded-[36px] p-4 shadow-2xl ring-1 ring-slate-700/80 border-4 border-slate-800 flex flex-col">
            {/* Tablet Camera */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-800 rounded-full ring-1 ring-slate-700 z-30" />
            
            {/* Screen */}
            <div className="w-full h-full rounded-[24px] overflow-y-auto overflow-x-hidden relative bg-slate-900">
              <MicrositeRenderer 
                data={data} 
                onLinkClick={onLinkClick} 
                onShareClick={onOpenShare} 
              />
            </div>
          </div>
        )}

        {deviceMode === 'desktop' && (
          <div className="relative w-full max-w-2xl h-[680px] max-h-[calc(100vh-170px)] bg-slate-950 rounded-2xl p-2 shadow-2xl ring-1 ring-slate-700/80 border border-slate-800 flex flex-col">
            {/* Browser top mock bar */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-t-xl border-b border-slate-800 text-xs text-slate-400">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 max-w-xs mx-auto bg-slate-950 px-3 py-0.5 rounded-md text-[11px] text-slate-400 text-center truncate border border-slate-800">
                https://pmbupb.site/pmb-utama
              </div>
            </div>

            {/* Browser content */}
            <div className="w-full flex-1 rounded-b-xl overflow-y-auto overflow-x-hidden relative bg-slate-900">
              <MicrositeRenderer 
                data={data} 
                onLinkClick={onLinkClick} 
                onShareClick={onOpenShare} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
