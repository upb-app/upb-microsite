import React from 'react';
import { Globe, Share2 } from 'lucide-react';
import {
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  FacebookIcon,
  TwitterIcon,
  TikTokIcon,
  WhatsappIcon,
  SpotifyIcon,
  TelegramIcon,
} from '../Common/BrandIcons';

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/kampuspelitabangsa', icon: InstagramIcon, color: 'text-pink-500' },
  { key: 'youtube', label: 'YouTube Channel', placeholder: 'https://youtube.com/@UNIVERSITASPELITABANGSAOFFICIAL', icon: YoutubeIcon, color: 'text-red-500' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@upb_official', icon: TikTokIcon, color: 'text-slate-800 dark:text-slate-200' },
  { key: 'linkedin', label: 'LinkedIn Institusi', placeholder: 'https://linkedin.com/school/universitas-pelita-bangsa', icon: LinkedinIcon, color: 'text-blue-500' },
  { key: 'whatsapp', label: 'WhatsApp Call Center', placeholder: 'https://wa.me/6281944283488', icon: WhatsappIcon, color: 'text-emerald-500' },
  { key: 'facebook', label: 'Facebook Page', placeholder: 'https://facebook.com/UniversitasPelitaBangsa', icon: FacebookIcon, color: 'text-blue-600' },
  { key: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/upb_official', icon: TwitterIcon, color: 'text-slate-800 dark:text-slate-200' },
  { key: 'website', label: 'Website Utama Kampus', placeholder: 'https://pelitabangsa.ac.id', icon: Globe, color: 'text-amber-500' },
  { key: 'telegram', label: 'Telegram Broadcast', placeholder: 'https://t.me/upb_announcement', icon: TelegramIcon, color: 'text-sky-500' },
  { key: 'spotify', label: 'Spotify Podcast Kampus', placeholder: 'https://open.spotify.com/show/...', icon: SpotifyIcon, color: 'text-green-500' },
];

export default function SocialSection({ socials = {}, updateSocials }) {
  const s = socials || {};

  return (
    <div className="p-4 sm:p-5 space-y-5 animate-fadeIn text-left">
      
      {/* 1. Header & Position Setting */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
            <Share2 className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Posisi & Tampilan Icon Media Sosial</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pilih letak icon sosial media pada tampilan microsite</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'bottom', label: 'Bawah Halaman', desc: 'Di atas footer' },
            { id: 'top', label: 'Bawah Profil', desc: 'Di bawah bio' },
            { id: 'both', label: 'Atas & Bawah', desc: 'Keduanya' },
          ].map((pos) => (
            <button
              key={pos.id}
              type="button"
              onClick={() => updateSocials('position', pos.id)}
              className={`p-2.5 rounded-xl border text-center transition ${
                s.position === pos.id || (!s.position && pos.id === 'bottom')
                  ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-xs block font-bold">{pos.label}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">{pos.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Form Tautan Akun Sosial Media */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Tautan Akun Resmi Universitas</h3>

        <div className="space-y-3">
          {SOCIAL_FIELDS.map((field) => {
            const IconComponent = field.icon;
            return (
              <div key={field.key} className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <IconComponent className={`w-3.5 h-3.5 ${field.color}`} />
                  <span>{field.label}</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={s[field.key] || ''}
                    onChange={(e) => updateSocials(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition"
                  />
                  {s[field.key] && (
                    <button
                      type="button"
                      onClick={() => updateSocials(field.key, '')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-red-500"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
