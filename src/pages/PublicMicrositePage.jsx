import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Mail, 
  ExternalLink, 
  QrCode, 
  ArrowLeft, 
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
import { normalizeImageUrl, DEFAULT_LOGO, DEFAULT_BANNER } from '../utils/imageHelper';
import { DEFAULT_MICROSITE_DATA, DEFAULT_MICROSITES_LIST } from '../data/defaultData';
import QrCodeModal from '../components/Modals/QrCodeModal';
import confetti from 'canvas-confetti';
import NotFoundPage from './NotFoundPage';
import { 
  fetchPublishedMicrosite, 
  subscribeToPublishedMicrosite, 
  sanitizeSlug 
} from '../services/micrositeService';

export default function PublicMicrositePage({ site: initialSite, onGoHome }) {
  const [cloudSite, setCloudSite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const activeSlug = sanitizeSlug(initialSite?.slug || 'pmb-utama');

  // 1. Real-time Cloud Firestore & Cross-Tab Subscription
  useEffect(() => {
    if (!activeSlug) return;
    let isMounted = true;

    // Safety timeout: Maximum 800ms loading, then render whatever data is resolved
    const safetyTimer = setTimeout(() => {
      if (isMounted) setIsLoading(false);
    }, 800);

    // Fetch data terkini dari Firebase Cloud Firestore & Universal Decoder
    fetchPublishedMicrosite(activeSlug).then((data) => {
      if (isMounted) {
        if (data && data.data) {
          setCloudSite(data);
        }
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

    // Real-time Live Listener Firestore
    const unsubscribe = subscribeToPublishedMicrosite(activeSlug, (data) => {
      if (isMounted && data && data.data) {
        setCloudSite(data);
        setIsLoading(false);
      }
    });

    // BroadcastChannel Listener untuk sinkronisasi antar-tab dalam browser yang sama
    let channel;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('upb_microsites_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'MICROSITE_UPDATED' && event.data?.slug === activeSlug) {
            if (isMounted && event.data?.site) {
              setCloudSite(event.data.site);
              setIsLoading(false);
            }
          }
          if (event.data?.type === 'MICROSITE_DELETED' && event.data?.slug === activeSlug) {
            if (isMounted) {
              setCloudSite(null);
              setIsLoading(false);
            }
          }
        };
      }
    } catch (_e) {}

    // Storage event listener (sync saat admin edit di tab dasbor)
    const handleStorage = (e) => {
      if (e.key === 'upb_multi_microsites_list_v2' && e.newValue) {
        try {
          const list = JSON.parse(e.newValue);
          const found = list.find(s => s.slug === activeSlug);
          if (found && isMounted) {
            setCloudSite(found);
            setIsLoading(false);
          }
        } catch (_err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // Custom Event listener
    const handleCustom = (e) => {
      if (e.detail && e.detail.slug === activeSlug && isMounted) {
        setCloudSite(e.detail);
        setIsLoading(false);
      }
    };
    window.addEventListener('upb-microsite-published', handleCustom);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      if (unsubscribe) unsubscribe();
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('upb-microsite-published', handleCustom);
    };
  }, [activeSlug]);

  // Merge Priority: Cloud Data -> Initial Passed Site -> Matching Official Preset -> Clean Baseline
  const isOfficialPresetSlug = DEFAULT_MICROSITES_LIST.some(s => s.slug === activeSlug);
  const matchingPreset = isOfficialPresetSlug ? DEFAULT_MICROSITES_LIST.find(s => s.slug === activeSlug) : null;

  const currentSite = cloudSite || (initialSite?.data ? initialSite : null) || matchingPreset || {};
  const currentSiteId = currentSite.id || `site-${activeSlug}`;

  // 2. Record page view on mount (Unconditionally declared hook)
  useEffect(() => {
    if (activeSlug) {
      recordPageView(currentSiteId, activeSlug);
    }
  }, [activeSlug, currentSiteId]);

  // Check if site data is available
  const hasValidData = Boolean(
    cloudSite?.data || 
    initialSite?.data || 
    matchingPreset?.data || 
    (typeof localStorage !== 'undefined' && localStorage.getItem(`upb_site_slug_${activeSlug}`))
  );

  // Loading state while resolving live cloud data
  if (isLoading && !hasValidData && activeSlug !== 'pmb-utama') {
    return (
      <div className="min-h-screen bg-[#040914] text-white flex flex-col items-center justify-center space-y-4 p-4 font-sans">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 p-0.5 shadow-2xl animate-pulse">
          <div className="w-full h-full rounded-[22px] bg-[#071326] flex items-center justify-center">
            <img src={DEFAULT_LOGO} alt="UPB" className="w-10 h-10 object-contain" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-sm font-black tracking-wider text-slate-200 uppercase">Memuat Microsite...</h3>
          <p className="text-xs font-mono text-blue-400">pmbupb.site/{activeSlug}</p>
        </div>
      </div>
    );
  }

  // If loading finished and NO data found anywhere, render 404
  if (!isLoading && !hasValidData && activeSlug !== 'pmb-utama') {
    return <NotFoundPage onGoHome={onGoHome} />;
  }

  const rawData = currentSite.data || matchingPreset?.data || DEFAULT_MICROSITE_DATA;

  const profile = {
    ...DEFAULT_MICROSITE_DATA.profile,
    ...(matchingPreset?.data?.profile || {}),
    ...(rawData.profile || {})
  };

  const theme = {
    ...DEFAULT_MICROSITE_DATA.theme,
    ...(matchingPreset?.data?.theme || {}),
    ...(rawData.theme || {})
  };

  const buttonStyle = {
    ...DEFAULT_MICROSITE_DATA.buttonStyle,
    ...(matchingPreset?.data?.buttonStyle || {}),
    ...(rawData.buttonStyle || {})
  };

  const socials = {
    ...DEFAULT_MICROSITE_DATA.socials,
    ...(matchingPreset?.data?.socials || {}),
    ...(rawData.socials || {})
  };

  const links = Array.isArray(rawData.links) && rawData.links.length > 0
    ? rawData.links
    : (matchingPreset?.data?.links || []);

  // Single Clean Title Resolution
  const mainTitle = profile.title || currentSite.title || profile.departmentName || profile.universityName || 'UNIVERSITAS PELITA BANGSA';
  
  const secondaryTitle = (
    profile.departmentName && 
    profile.departmentName.trim().toLowerCase() !== mainTitle.trim().toLowerCase()
  ) ? profile.departmentName : (
    (profile.universityName && 
     profile.universityName.trim().toLowerCase() !== mainTitle.trim().toLowerCase() && 
     profile.universityName !== 'UNIVERSITAS PELITA BANGSA') ? profile.universityName : null
  );

  const displayTagline = profile.tagline || '';
  const displayBio = profile.bio || '';

  const avatarUrl = normalizeImageUrl(profile.avatarUrl, DEFAULT_LOGO);
  const bannerUrl = (profile.showBanner !== false && (profile.headerBannerUrl || profile.bannerUrl))
    ? normalizeImageUrl(profile.headerBannerUrl || profile.bannerUrl, DEFAULT_BANNER)
    : null;
  const bgImageUrl = (theme.bgType === 'image' && (theme.bgImageUrl || theme.bgImage))
    ? normalizeImageUrl(theme.bgImageUrl || theme.bgImage, DEFAULT_BANNER)
    : null;

  const handleLinkClick = (link) => {
    if (link && link.id) {
      recordLinkClick(currentSiteId, link.id, link.title, link.url);
    }
  };

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' && window.location.origin.includes('localhost') 
      ? window.location.origin 
      : 'https://pmbupb.site';
    const cleanUrl = `${origin}/${activeSlug}`;
    navigator.clipboard.writeText(cleanUrl);
    setCopied(true);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  // Background Style
  const getBackgroundStyle = () => {
    if (theme.bgType === 'image' && bgImageUrl) {
      return {
        backgroundImage: `url('${bgImageUrl}')`,
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
    const shape = buttonStyle.shape || buttonStyle.rounded || 'rounded-xl';
    switch (shape) {
      case 'rounded-full':
      case 'pill': return 'rounded-full';
      case 'rounded-none':
      case 'square': return 'rounded-none';
      case 'rounded-lg': return 'rounded-lg';
      case 'rounded-2xl': return 'rounded-2xl';
      default: return 'rounded-xl';
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
      case 'anim-pulse':
      case 'pulse': return 'animate-pulse';
      case 'anim-bounce':
      case 'bounce': return 'animate-bounce';
      case 'anim-glow':
      case 'glow': return 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950';
      case 'anim-hover-scale': return 'hover:scale-[1.02]';
      default: return '';
    }
  };

  return (
    <div 
      className={`min-h-screen text-slate-100 flex flex-col justify-between relative overflow-x-hidden font-sans ${
        theme.bgType === 'gradient' ? (theme.bgGradient || 'bg-gradient-to-b from-[#0b1d3a] via-[#071326] to-[#040b17]') : ''
      }`}
      style={getBackgroundStyle()}
    >
      {/* Background Overlay */}
      {theme.bgType === 'image' && (
        <div 
          className="absolute inset-0 bg-slate-950 pointer-events-none"
          style={{ opacity: theme.bgOverlayOpacity ? theme.bgOverlayOpacity / 100 : (theme.overlayOpacity ? theme.overlayOpacity / 100 : 0.75) }}
        />
      )}

      {/* Floating Top Bar */}
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
        {bannerUrl && (
          <div className="w-full h-32 sm:h-36 rounded-2xl overflow-hidden mb-[-40px] shadow-lg border border-white/15 bg-slate-800">
            <img 
              src={bannerUrl} 
              alt="Banner Header" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = DEFAULT_BANNER;
              }}
            />
          </div>
        )}

        {/* Profile Avatar / Logo */}
        <div className="relative mb-3 flex-shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-1.5 shadow-2xl border-2 border-white/30 overflow-hidden ring-4 ring-black/20 flex items-center justify-center">
            <img 
              src={avatarUrl} 
              alt={mainTitle || 'Logo UPB'} 
              className="w-full h-full object-contain rounded-2xl"
              onError={(e) => {
                e.target.src = DEFAULT_LOGO;
              }}
            />
          </div>
          {(profile.verified !== false && profile.isVerified !== false) && (
            <div className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 text-white rounded-full shadow-md border-2 border-slate-900" title="Terverifikasi Resmi">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Profile Information: Single Clean Title without duplication */}
        <div className="text-center space-y-1.5 mb-6 w-full">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
            {mainTitle}
          </h1>

          {secondaryTitle && (
            <p className="text-xs sm:text-sm font-semibold text-amber-400 drop-shadow-sm">
              {secondaryTitle}
            </p>
          )}

          {displayTagline && (
            <p className="text-xs sm:text-sm font-medium text-slate-300 drop-shadow-sm">
              {displayTagline}
            </p>
          )}

          {displayBio && (
            <p className="text-xs text-slate-300/90 max-w-sm mx-auto leading-relaxed drop-shadow-sm pt-1">
              {displayBio}
            </p>
          )}

          {/* Location & Email Tags */}
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
        <div className="w-full space-y-3 mb-6">
          {links.length === 0 ? (
            <div className="p-5 text-center bg-black/30 border border-white/10 rounded-2xl text-xs text-slate-400">
              Belum ada tautan yang ditambahkan ke microsite ini.
            </div>
          ) : (
            links
              .filter(link => link.isActive !== false)
              .map((link, idx) => {
                const safeUrl = sanitizeUrl(link.url);
                const shapeClass = getButtonShapeClass();
                const variantClass = getButtonVariantClass();
                const animClass = getAnimationClass(link.animation);
                const itemKey = link.id || `link-idx-${idx}`;

                return (
                  <a
                    key={itemKey}
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
                            {link.title || 'Tautan Informasi'}
                          </span>
                          {link.badge && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        {(link.subtitle || link.description) && (
                          <p className="text-xs opacity-80 mt-0.5 truncate max-w-[240px] sm:max-w-xs">
                            {link.subtitle || link.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition flex-shrink-0" />
                  </a>
                );
              })
          )}
        </div>

        {/* Bottom Socials */}
        {(socials.position === 'bottom' || socials.position === 'both' || !socials.position) && (
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

      {/* Public Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-400/80 border-t border-white/10 bg-black/30 backdrop-blur-sm">
        <p className="font-semibold tracking-wide">
          © {new Date().getFullYear()} Universitas Pelita Bangsa. Hak Cipta Dilindungi.
        </p>
      </footer>

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        data={{ profile }}
        slug={activeSlug}
      />

    </div>
  );
}
