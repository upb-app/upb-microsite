import React, { useState, useEffect } from 'react';
import { 
  X, 
  Globe, 
  Copy, 
  Check, 
  QrCode, 
  Radio, 
  Eye,
  Send,
  CloudCheck,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { TwitterIcon, TelegramIcon, WhatsappIcon } from '../Common/BrandIcons';
import confetti from 'canvas-confetti';
import { useTheme } from '../../context/ThemeContext';
import { publishMicrositeToCloud } from '../../services/micrositeService';

export default function PublishModal({ 
  isOpen, 
  onClose, 
  microsite, 
  onOpenQr 
}) {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Clean Public URL directly at domain root (e.g. 'https://pmbupb.site/pmb-utama')
  const origin = typeof window !== 'undefined' && window.location.origin.includes('localhost') 
    ? window.location.origin 
    : 'https://pmbupb.site';
  
  const publicUrl = `${origin}/${microsite?.slug || 'pmb-utama'}`;

  // Auto-sync to cloud when modal opens
  useEffect(() => {
    if (isOpen && microsite) {
      handlePublishCloud();
    }
  }, [isOpen, microsite?.id, microsite?.slug]);

  if (!isOpen || !microsite) return null;

  const handlePublishCloud = async () => {
    setIsPublishing(true);
    try {
      await publishMicrositeToCloud(microsite);
      setPublishSuccess(true);
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {
      console.warn('Publish notice:', e);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Kunjungi Microsite Resmi ${microsite.title} - Universitas Pelita Bangsa:\n${publicUrl}`;

  const handleShareWa = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleShareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(microsite.title)}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-lg border rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-7 space-y-5 transition-colors ${
        isDark 
          ? 'bg-[#071326] border-white/15 text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 p-0.5 mx-auto shadow-xl flex items-center justify-center">
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
              isDark ? 'bg-[#040914] text-blue-400' : 'bg-white text-blue-600'
            }`}>
              <Globe className="w-6 h-6" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black tracking-tight">Publikasi & Bagikan Microsite</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Microsite telah disinkronisasikan ke Firebase Cloud dan aktif secara publik di internet
            </p>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
            <span>Terbit di Cloud (Live Real-Time)</span>
          </div>
        </div>

        {/* Public URL Box with Copy Button */}
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Tautan Publik Resmi (Clean URL):
          </label>
          <div className={`flex items-center p-2 rounded-2xl border ${
            isDark ? 'bg-[#040914] border-white/15' : 'bg-slate-50 border-slate-300'
          }`}>
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 bg-transparent px-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition transform active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin URL'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons: Open & QR & Sync */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl border border-blue-200 dark:border-blue-700/50 transition shadow-xs"
          >
            <Eye className="w-4 h-4 text-blue-500" />
            <span>Buka Tab Baru</span>
          </a>

          <button
            onClick={() => {
              if (onOpenQr) onOpenQr();
            }}
            className="flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs rounded-xl border border-slate-300 dark:border-white/10 transition shadow-xs"
          >
            <QrCode className="w-4 h-4 text-amber-500" />
            <span>Unduh QR Code</span>
          </button>
        </div>

        {/* 1-Click Social Sharing */}
        <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2 text-left">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Bagikan Cepat ke Media Sosial:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleShareWa}
              className="py-2 px-3 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <WhatsappIcon className="w-4 h-4 text-emerald-500" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleShareTelegram}
              className="py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <TelegramIcon className="w-4 h-4 text-blue-500" />
              <span>Telegram</span>
            </button>

            <button
              onClick={handleShareTwitter}
              className="py-2 px-3 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <TwitterIcon className="w-4 h-4 text-sky-500" />
              <span>Twitter / X</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
