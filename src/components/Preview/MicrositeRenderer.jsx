import React from 'react';
import { BadgeCheck, MapPin, Mail, Share2, Sparkles, Building2 } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import SocialIconsBar from './SocialIconsBar';
import { normalizeImageUrl, DEFAULT_LOGO, DEFAULT_BANNER } from '../../utils/imageHelper';

export default function MicrositeRenderer({ 
  data, 
  onLinkClick, 
  onShareClick,
  isFullScreen = false 
}) {
  const { profile = {}, theme = {}, buttonStyle = {}, links = [], socials = {} } = data || {};

  const avatarUrl = normalizeImageUrl(profile.avatarUrl, DEFAULT_LOGO);
  const bannerUrl = normalizeImageUrl(profile.headerBannerUrl || profile.bannerUrl, DEFAULT_BANNER);
  const bgImageUrl = normalizeImageUrl(theme.bgImageUrl || theme.bgImage, DEFAULT_BANNER);

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
    bgStyles.backgroundImage = `url(${bgImageUrl})`;
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
            <img 
              src={bannerUrl} 
              alt="Header Banner Kampus" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = DEFAULT_BANNER;
              }}
            />
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
            <div className="relative w-24 h-24 sm:w-26 sm:h-26 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-amber-500 via-upb-600 to-blue-400 shadow-xl shadow-black/40 flex items-center justify-center">
              <img 
                src={avatarUrl} 
                alt={profile.universityName || profile.title || 'UPB'} 
                className="w-full h-full object-contain rounded-xl bg-white p-1"
                onError={(e) => {
                  e.target.src = DEFAULT_LOGO;
                }}
              />
            </div>
            {(profile.isVerified || profile.verified) && (
              <div className="absolute -bottom-1.5 -right-1.5 bg-blue-600 text-white rounded-full p-1 shadow-lg border-2 border-slate-900" title="Akun Resmi Terverifikasi">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Titles & Tagline */}
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center justify-center gap-1.5 drop-shadow-sm">
            <span>{profile.universityName || profile.title || 'UNIVERSITAS PELITA BANGSA'}</span>
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-amber-400 mt-0.5 tracking-wide">
            {profile.departmentName || profile.tagline || 'Portal Informasi Resmi & Admisi'}
          </p>

          {profile.bio && (
            <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed px-2 font-normal">
              {profile.bio}
            </p>
          )}

          {/* Location & Contact Meta Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-slate-400">
            {profile.location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-xs">
                <MapPin className="w-3 h-3 text-red-400" />
                {profile.location}
              </span>
            )}
            {profile.email && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-xs">
                <Mail className="w-3 h-3 text-amber-400" />
                {profile.email}
              </span>
            )}
          </div>

          {/* Social Icons Bar (Position: Top) */}
          {socials.position === 'top' && (
            <div className="mt-4">
              <SocialIconsBar socials={socials} />
            </div>
          )}
        </div>

        {/* Links Button Stack */}
        <div className="w-full px-4 sm:px-5 mt-5 space-y-3 flex-1">
          {links
            .filter(link => link.isActive !== false)
            .map((link) => (
              <AnimatedButton 
                key={link.id} 
                link={link} 
                buttonStyle={buttonStyle}
                onLinkClick={onLinkClick} 
              />
            ))}
        </div>

        {/* Social Icons Bar (Position: Bottom) */}
        {socials.position !== 'top' && (
          <div className="mt-6 px-4">
            <SocialIconsBar socials={socials} />
          </div>
        )}

        {/* Official Footer Branding */}
        <footer className="mt-8 pt-4 border-t border-slate-800/80 text-center px-4 text-slate-500 text-[11px]">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            <span>© {new Date().getFullYear()} Universitas Pelita Bangsa</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Membangun Generasi Unggul Berkarakter & Berdaya Saing Global
          </p>
        </footer>

      </div>
    </div>
  );
}
