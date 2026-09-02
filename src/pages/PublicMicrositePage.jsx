import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Mail, 
  ExternalLink, 
  Share2, 
  QrCode, 
  ArrowLeft,
  Sparkles,
  Globe,
  Copy,
  Check
} from 'lucide-react';
import DynamicIcon from '../components/Common/DynamicIcon';
import { 
  InstagramIcon, 
  YoutubeIcon, 
  LinkedinIcon, 
  TikTokIcon, 
  WhatsappIcon 
} from '../components/Common/BrandIcons';
import { sanitizeUrl } from '../utils/security';
import { recordPageView, recordLinkClick } from '../services/analyticsService';
import QrCodeModal from '../components/Modals/QrCodeModal';
import confetti from 'canvas-confetti';

export default function PublicMicrositePage({ site, onGoHome }) {
  const [copied, setCopied] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const data = site?.data || {};
  const profile = data.profile || {};
  const links = data.links || [];
  const theme = data.theme || {};
  const buttonStyle = data.buttonStyle || {};
  const socials = data.socials || {};

  // Record page view on mount
  useEffect(() => {
    if (site?.id) {
      recordPageView(site.id, site.slug);
    }
  }, [site?.id, site?.slug]);

  const handleLinkClick = (link) => {
    if (site?.id && link.id) {
      recordLinkClick(site.id, link.id, link.title, link.url);
    }
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  // Get background style
  const getBackgroundStyle = () => {
    if (theme.bgType === 'image' && theme.bgImage) {
      return {
        backgroundImage: `url('${theme.bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      };
    }
    if (theme.bgType === 'gradient' && theme.bgGradient) {
      return {};
    }
    return { backgroundColor: theme.bgColor || '#040914' };
  };

  // Social icon helper
  const renderSocialIcon = (platform) => {
    switch (platform) {
      case 'instagram': return <InstagramIcon className="w-4 h-4" />;
      case 'youtube': return <YoutubeIcon className="w-4 h-4" />;
      case 'linkedin': return <LinkedinIcon className="w-4 h-4" />;
      case 'tiktok': return <TikTokIcon className="w-4 h-4" />;
      case 'whatsapp': return <WhatsappIcon className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  // Button shape classes
  const getButtonShapeClass = () => {
    switch (buttonStyle.shape) {
      case 'pill': return 'rounded-full';
      case 'square': return 'rounded-none';
      case 'rounded-lg': return 'rounded-lg';
      default: return 'rounded-2xl';
    }
  };

  // Button variant classes
  const getButtonVariantClass = () => {
    switch (buttonStyle.variant) {
      case 'outline':
        return 'bg-transparent border-2 border-white/40 hover:bg-white/15 text-white shadow-md';
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white shadow-lg';
      case 'solid-dark':
        return 'bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white shadow-md';
      case 'gradient-blue':
        return 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg border border-blue-400/30';
      case 'gradient-amber':
        return 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black shadow-lg shadow-amber-400/20';
      default: // 'solid'
        return 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20';
    }
  };

  // Animation class
  const getAnimationClass = (animation) => {
    switch (animation) {
      case 'pulse': return 'animate-pulse';
      case 'bounce': return 'animate-bounce';
      case 'glow': return 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950';
      case 'shake': return 'hover:animate-shake';
      default: return '';
    }
  };

  return (
    <div 
      className={`min-h-screen text-slate-100 flex flex-col justify-between relative overflow-x-hidden ${
        theme.bgType === 'gradient' ? (theme.bgGradient || 'bg-gradient-to-b from-[#0b1d3a] via-[#071326] to-[#040b17]') : ''
      }`}
      style={getBackgroundStyle()}
    >
      {/* Background Overlay */}
      {theme.bgType === 'image' && (
        <div 
          className="absolute inset-0 bg-navy-950 pointer-events-none"
          style={{ opacity: theme.overlayOpacity ? theme.overlayOpacity / 100 : 0.75 }}
        />
      )}

      {/* Floating Top Bar (Public Navigation & Sharing) */}
      <header className="relative z-20 max-w-lg mx-auto w-full px-4 pt-4 flex items-center justify-between">
        <button
          onClick={onGoHome}
          className="px-3 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Beranda PMB</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition shadow-sm"
            title="Salin Link Publik"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
          </button>

          <button
            onClick={() => setIsQrOpen(true)}
            className="p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 rounded-xl text-white transition shadow-sm"
            title="Tampilkan QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Public Microsite Card */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-6 sm:py-8 flex-1 flex flex-col items-center">
        
        {/* Banner Cover if configured */}
        {profile.bannerUrl && (
          <div className="w-full h-32 sm:h-36 rounded-2xl overflow-hidden mb-[-40px] shadow-lg border border-white/15">
            <img 
              src={profile.bannerUrl} 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Profile Avatar / Logo */}
        <div className="relative mb-3 flex-shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-1.5 shadow-2xl border-2 border-white/30 overflow-hidden ring-4 ring-black/20">
            <img 
              src={profile.avatarUrl || '/img/logo-universitas-pelita-bangsa.png'} 
              alt={profile.title} 
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
          {profile.verified && (
            <div className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 text-white rounded-full shadow-md border-2 border-slate-900" title="Terverifikasi Resmi">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Profile Information */}
        <div className="text-center space-y-2 mb-6 w-full">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
            {profile.title || 'Universitas Pelita Bangsa'}
          </h1>

          {profile.tagline && (
            <p className="text-xs sm:text-sm font-semibold text-amber-300 drop-shadow-sm">
              {profile.tagline}
            </p>
          )}

          {profile.bio && (
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed drop-shadow-sm">
              {profile.bio}
            </p>
          )}

          {/* Location & Badge Tags */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-1 text-[11px]">
            {profile.location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 text-slate-200">
                <MapPin className="w-3 h-3 text-red-400" />
                {profile.location}
              </span>
            )}
            {profile.email && (
              <a 
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 text-slate-200 hover:text-white"
              >
                <Mail className="w-3 h-3 text-blue-400" />
                {profile.email}
              </a>
            )}
          </div>
        </div>

        {/* Top Socials */}
        {socials.position === 'top' && (
          <div className="flex items-center justify-center gap-2.5 mb-6 flex-wrap">
            {Object.entries(socials)
              .filter(([key, val]) => key !== 'position' && val && val.trim() !== '')
              .map(([platform, url]) => (
                <a
                  key={platform}
                  href={sanitizeUrl(url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-black/40 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/15 text-white transition transform hover:scale-110 shadow-md"
                  title={platform.toUpperCase()}
                >
                  {renderSocialIcon(platform)}
                </a>
              ))}
          </div>
        )}

        {/* Interactive Links / Buttons List */}
        <div className="w-full space-y-3.5 mb-6">
          {links
            .filter(link => link.isActive !== false)
            .map((link) => {
              const safeUrl = sanitizeUrl(link.url);
              const shapeClass = getButtonShapeClass();
              const variantClass = getButtonVariantClass();
              const animClass = getAnimationClass(link.animation);

              return (
                <a
                  key={link.id}
                  href={safeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link)}
                  className={`group w-full p-4 flex items-center justify-between transition-all duration-300 transform active:scale-98 ${shapeClass} ${variantClass} ${animClass}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    {link.icon && (
                      <div className="p-2 rounded-xl bg-black/20 text-white flex-shrink-0">
                        <DynamicIcon name={link.icon} className="w-5 h-5" />
                      </div>
                    )}

                    <div className="text-left min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm tracking-tight truncate">
                          {link.title}
                        </span>
                        {link.badge && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      {link.description && (
                        <p className="text-xs opacity-80 mt-0.5 truncate max-w-[240px] sm:max-w-xs">
                          {link.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition flex-shrink-0" />
                </a>
              );
            })}
        </div>

        {/* Bottom Socials */}
        {socials.position !== 'top' && (
          <div className="flex items-center justify-center gap-2.5 mb-6 flex-wrap">
            {Object.entries(socials)
              .filter(([key, val]) => key !== 'position' && val && val.trim() !== '')
              .map(([platform, url]) => (
                <a
                  key={platform}
                  href={sanitizeUrl(url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-black/40 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/15 text-white transition transform hover:scale-110 shadow-md"
                  title={platform.toUpperCase()}
                >
                  {renderSocialIcon(platform)}
                </a>
              ))}
          </div>
        )}

      </main>

      {/* Official Footer */}
      <footer className="relative z-10 py-4 border-t border-white/10 text-center text-xs text-slate-400 max-w-md mx-auto w-full px-4">
        <p className="font-semibold text-slate-300">
          © {new Date().getFullYear()} Universitas Pelita Bangsa
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Kampus Berbasis Entrepreneur & Teknologi
        </p>
      </footer>

      {/* QR Code Modal for Public View */}
      {isQrOpen && (
        <QrCodeModal 
          isOpen={isQrOpen} 
          onClose={() => setIsQrOpen(false)} 
          data={data}
        />
      )}
    </div>
  );
}
