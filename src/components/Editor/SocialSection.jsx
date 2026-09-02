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

export default function SocialSection({ socials, updateSocials }) {
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
                socials.position === pos.id || (!socials.position && pos.id === 'bottom')
                  ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-xs block font-bold">{pos.label}</span>
              <span className="text-[10px] opacity-75">{pos.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Social Links Input List */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3.5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Kanal Media Sosial Resmi</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1.5">Kosongkan kolom yang tidak ingin ditampilkan pada microsite.</p>

        <div className="space-y-3 pt-1">
          {SOCIAL_FIELDS.map((field) => {
            const Icon = field.icon;
            const value = socials[field.key] || '';

            return (
              <div key={field.key} className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span className={`p-1 bg-white dark:bg-slate-900 rounded-lg ${field.color} border border-slate-200 dark:border-slate-700/60 shadow-2xs`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  {field.label}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateSocials(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition font-mono"
                />
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
