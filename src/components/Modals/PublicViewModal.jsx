import React from 'react';
import { X, ArrowLeft, ExternalLink, QrCode } from 'lucide-react';
import MicrositeRenderer from '../Preview/MicrositeRenderer';

export default function PublicViewModal({ isOpen, onClose, data, onLinkClick, onOpenQr }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-fadeIn">
      {/* Top Floating bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-30">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Kembali ke Editor</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-slate-400">
            Tampilan Publik Pengunjung (Live View)
          </span>
          <button
            onClick={onOpenQr}
            className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
            title="QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Full Page Renderer */}
      <div className="flex-1 overflow-y-auto w-full">
        <MicrositeRenderer 
          data={data} 
          onLinkClick={onLinkClick} 
          isFullScreen={true}
        />
      </div>
    </div>
  );
}
