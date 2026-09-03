import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  MessageSquare, 
  Code
} from 'lucide-react';
import {
  WhatsappIcon,
  TelegramIcon,
  TwitterIcon,
  LinkedinIcon,
  FacebookIcon,
} from '../Common/BrandIcons';

export default function ShareModal({ isOpen, onClose, data, slug }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' && window.location.origin.includes('localhost') 
    ? window.location.origin 
    : 'https://pmbupb.site';

  const targetSlug = slug || 'pmb-utama';
  const currentUrl = `${origin}/${targetSlug}`;
  const title = encodeURIComponent(`${data?.profile?.universityName || 'Universitas Pelita Bangsa'} - ${data?.profile?.departmentName || 'Microsite Resmi'}`);
  const urlEncoded = encodeURIComponent(currentUrl);

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: WhatsappIcon,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      url: `https://api.whatsapp.com/send?text=${title}%20${urlEncoded}`,
    },
    {
      name: 'Telegram',
      icon: TelegramIcon,
      color: 'bg-sky-600 hover:bg-sky-500 text-white',
      url: `https://t.me/share/url?url=${urlEncoded}&text=${title}`,
    },
    {
      name: 'X (Twitter)',
      icon: TwitterIcon,
      color: 'bg-slate-800 hover:bg-slate-700 text-white',
      url: `https://twitter.com/intent/tweet?text=${title}&url=${urlEncoded}`,
    },
    {
      name: 'LinkedIn',
      icon: LinkedinIcon,
      color: 'bg-blue-700 hover:bg-blue-600 text-white',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${urlEncoded}`,
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      color: 'bg-blue-800 hover:bg-blue-700 text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${urlEncoded}`,
    },
  ];

  const iframeEmbed = `<iframe src="${currentUrl}" width="100%" height="700" style="border:none;border-radius:20px;" title="${data?.profile?.universityName || 'UPB'} Microsite"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(iframeEmbed);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-5 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <Share2 className="w-4 h-4" />
            </span>
            Bagikan Microsite Kampus
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Copy Direct Link */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">Tautan Langsung (Clean URL)</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? 'Tersalin' : 'Salin'}
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-semibold text-slate-300">Bagikan ke Media Sosial:</label>
          <div className="grid grid-cols-5 gap-2">
            {shareLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition shadow-md ${item.color}`}
                  title={item.name}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-semibold mt-1 truncate max-w-full">{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Embed iframe */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-blue-400" />
            Sematkan di Website Utama (Embed Iframe)
          </label>
          <div className="relative">
            <textarea
              readOnly
              rows={2}
              value={iframeEmbed}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-400 focus:outline-none select-all"
            />
          </div>
          <button
            onClick={handleCopyEmbed}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
          >
            {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedEmbed ? 'Kode Iframe Tersalin!' : 'Salin Kode Iframe'}
          </button>
        </div>

      </div>
    </div>
  );
}
