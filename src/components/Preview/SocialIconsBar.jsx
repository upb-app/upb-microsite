import React from 'react';
import { Globe, MessageSquare } from 'lucide-react';
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

export default function SocialIconsBar({ socials = {}, variant = "standard" }) {
  const socialConfigs = [
    { key: 'instagram', icon: InstagramIcon, label: 'Instagram', color: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white', glow: 'rgba(236, 72, 153, 0.4)' },
    { key: 'youtube', icon: YoutubeIcon, label: 'YouTube', color: 'hover:bg-red-600 hover:text-white', glow: 'rgba(239, 68, 68, 0.4)' },
    { key: 'tiktok', icon: TikTokIcon, label: 'TikTok', color: 'hover:bg-slate-950 hover:text-white', glow: 'rgba(255, 255, 255, 0.3)' },
    { key: 'linkedin', icon: LinkedinIcon, label: 'LinkedIn', color: 'hover:bg-blue-600 hover:text-white', glow: 'rgba(37, 99, 235, 0.4)' },
    { key: 'whatsapp', icon: WhatsappIcon, label: 'WhatsApp', color: 'hover:bg-emerald-500 hover:text-slate-950', glow: 'rgba(16, 185, 129, 0.4)' },
    { key: 'twitter', icon: TwitterIcon, label: 'X (Twitter)', color: 'hover:bg-slate-900 hover:text-white', glow: 'rgba(255, 255, 255, 0.3)' },
    { key: 'facebook', icon: FacebookIcon, label: 'Facebook', color: 'hover:bg-blue-700 hover:text-white', glow: 'rgba(29, 78, 216, 0.4)' },
    { key: 'website', icon: Globe, label: 'Website', color: 'hover:bg-amber-500 hover:text-slate-950', glow: 'rgba(245, 158, 11, 0.4)' },
    { key: 'telegram', icon: TelegramIcon, label: 'Telegram', color: 'hover:bg-sky-500 hover:text-white', glow: 'rgba(14, 165, 233, 0.4)' },
    { key: 'spotify', icon: SpotifyIcon, label: 'Spotify', color: 'hover:bg-green-500 hover:text-slate-950', glow: 'rgba(34, 197, 94, 0.4)' },
  ];

  const activeSocials = socialConfigs.filter(s => socials[s.key] && socials[s.key].trim() !== '');

  if (activeSocials.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 py-3">
      {activeSocials.map(({ key, icon: Icon, label, color }) => {
        const url = socials[key];
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            className={`w-9 h-9 rounded-full flex items-center justify-center bg-slate-900/60 backdrop-blur-md border border-white/10 text-slate-300 transition-all duration-300 hover:scale-115 hover:border-white/30 shadow-md ${color}`}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
}
