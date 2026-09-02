import React from 'react';
import { BadgeCheck, MapPin, Mail, Share2, Sparkles, Building2 } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import SocialIconsBar from './SocialIconsBar';

export default function MicrositeRenderer({ 
  data, 
  onLinkClick, 
  onShareClick,
  isFullScreen = false 
}) {
  const { profile, theme, buttonStyle, links, socials } = data;

  // Background style computation
  let bgStyles = {};
  let bgClasses = "";

  if (theme.bgType === 'solid') {
    bgStyles.backgroundColor = theme.bgColor || '#0f172a';
  } else if (theme.bgType === 'gradient') {
    bgClasses = `bg-gradient-to-b ${theme.bgGradient || 'from-slate-900 via-upb-900 to-slate-950'}`;
  } else if (theme.bgType === 'mesh') {
    bgClasses = `bg-gradient-to-tr ${theme.bgGradient || 'from-[#050b14] via-[#09182a] to-[#041d38]'}`;
  } else if (theme.bgType === 'image') {
    bgStyles.backgroundImage = `url(${theme.bgImageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80'})`;
    bgStyles.backgroundSize = 'cover';
    bgStyles.backgroundPosition = 'center';
  }

  // Font family class
  const fontClass = theme.fontFamily === 'serif' 
    ? 'font-serif' 
    : theme.fontFamily === 'mono' 
      ? 'font-mono' 
      : 'font-sans';

  // Blur class
  const blurClass = theme.bgBlur === 'sm' ? 'backdrop-blur-sm' :
                    theme.bgBlur === 'md' ? 'backdrop-blur-md' :
                    theme.bgBlur === 'lg' ? 'backdrop-blur-lg' : '';

  return (
    <div 
      className={`relative w-full min-h-full transition-all duration-500 overflow-x-hidden ${fontClass} ${bgClasses}`}
      style={bgStyles}
    >
      {/* Background Overlay for Image / Dimming */}
      {theme.bgType === 'image' && (
        <div 
          className={`absolute inset-0 bg-slate-950 ${blurClass}`}
          style={{ opacity: (theme.bgOverlayOpacity ?? 75) / 100 }}
        />
      )}

      {/* Decorative ambient lighting elements for modern minimalist feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col min-h-full pb-8">
        
        {/* Header Banner Image */}
        {profile.showBanner && (
          <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-slate-800">
            {profile.headerBannerUrl ? (
              <img 
                src={profile.headerBannerUrl} 
                alt="Header Banner Kampus" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-upb-900 via-blue-900 to-amber-900 flex items-center justify-center opacity-70">
                <Building2 className="w-12 h-12 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-slate-950/80" />
            
            {/* Share action button in banner */}
            {onShareClick && (
              <button 
                onClick={onShareClick}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/90 hover:text-white border border-white/20 transition shadow-sm"
                title="Bagikan Microsite"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Profile Identity Card */}
        <div className={`px-5 text-center ${profile.showBanner ? '-mt-14' : 'pt-6'}`}>
          
          {/* Avatar / Logo */}
          <div className="relative inline-block mx-auto mb-3">
            <div className="relative w-24 h-24 sm:w-26 sm:h-26 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-amber-500 via-upb-600 to-blue-400 shadow-xl shadow-black/40">
              <img 
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=300&auto=format&fit=crop&q=80"} 
                alt={profile.universityName} 
                className="w-full h-full object-cover rounded-xl bg-slate-900"
              />
            </div>

            {/* Verified Badge */}
            {profile.isVerified && (
              <div 
                className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md border-2 border-slate-900"
                title="Akun Resmi Terverifikasi"
              >
                <BadgeCheck className="w-4 h-4 fill-slate-950 text-amber-400" />
              </div>
            )}
          </div>

          {/* Badge Label (e.g. Kampus Terakreditasi) */}
          {profile.badgeText && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {profile.badgeText}
              </span>
            </div>
          )}

          {/* University Title & Department */}
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase drop-shadow-sm">
            {profile.universityName || "UNIVERSITAS PELITA BANGSA"}
          </h1>
          
          {profile.departmentName && (
            <h2 className="text-xs sm:text-sm font-semibold text-amber-400 mt-0.5 tracking-wide">
              {profile.departmentName}
            </h2>
          )}

          {/* Tagline & Slogan */}
          {profile.tagline && (
            <p className="text-[12px] italic text-slate-300 font-medium mt-1">
              "{profile.tagline}"
            </p>
          )}

          {/* Bio Description */}
          {profile.bio && (
            <p className="text-xs text-slate-300/90 mt-2 max-w-sm mx-auto leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Location & Email Info Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-slate-400">
            {profile.location && (
              <span className="flex items-center gap-1 bg-slate-900/40 px-2.5 py-1 rounded-lg border border-white/5">
                <MapPin className="w-3 h-3 text-amber-400" />
                {profile.location}
              </span>
            )}
            {profile.email && (
              <a 
                href={`mailto:${profile.email}`} 
                className="flex items-center gap-1 bg-slate-900/40 px-2.5 py-1 rounded-lg border border-white/5 hover:text-amber-300 transition"
              >
                <Mail className="w-3 h-3 text-blue-400" />
                {profile.email}
              </a>
            )}
          </div>

          {/* Top Socials if configured */}
          {(socials.position === 'top' || socials.position === 'both') && (
            <div className="mt-2">
              <SocialIconsBar socials={socials} />
            </div>
          )}
        </div>

        {/* Links List Section */}
        <div className="px-4 mt-5 space-y-3 flex-1">
          {links && links.length > 0 ? (
            links.map((link) => (
              <AnimatedButton
                key={link.id}
                link={link}
                globalButtonStyle={buttonStyle}
                accentColor={theme.accentColor}
                onLinkClick={onLinkClick}
              />
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-700/50 rounded-xl p-4">
              Belum ada tautan ditambahkan. Tambahkan tautan di menu Editor.
            </div>
          )}
        </div>

        {/* Bottom Socials */}
        {(socials.position === 'bottom' || socials.position === 'both' || !socials.position) && (
          <div className="mt-6 px-4">
            <SocialIconsBar socials={socials} />
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 text-center px-4 border-t border-white/10">
          <p className="text-[11px] font-medium text-slate-400">
            © {new Date().getFullYear()} {profile.universityName || "Universitas Pelita Bangsa"}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Dikelola dengan <span className="text-amber-400 font-semibold">UPB Microsite Hub</span>
          </p>
        </div>

      </div>
    </div>
  );
}
