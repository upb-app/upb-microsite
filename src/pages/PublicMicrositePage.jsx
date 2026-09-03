import React, { useEffect, useState } from 'react';
import { 
  QrCode, 
  Copy, 
  Check 
} from 'lucide-react';
import { recordPageView, recordLinkClick } from '../services/analyticsService';
import { DEFAULT_MICROSITE_DATA, DEFAULT_MICROSITES_LIST } from '../data/defaultData';
import { DEFAULT_LOGO } from '../utils/imageHelper';
import QrCodeModal from '../components/Modals/QrCodeModal';
import confetti from 'canvas-confetti';
import NotFoundPage from './NotFoundPage';
import MicrositeRenderer from '../components/Preview/MicrositeRenderer';
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

  const activeSlug = sanitizeSlug(initialSite?.slug || '');

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
    }, () => {
      if (isMounted) {
        setCloudSite(null);
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

  // Merge Priority: Cloud Data -> Initial Passed Site (if has actual data)
  const currentSite = cloudSite || (initialSite?.data ? initialSite : null);
  const currentSiteId = currentSite?.id || `site-${activeSlug}`;

  // 2. Record page view on mount (Unconditionally declared hook)
  useEffect(() => {
    if (activeSlug && currentSite?.data) {
      recordPageView(currentSiteId, activeSlug);
    }
  }, [activeSlug, currentSiteId, currentSite?.data]);

  const rawData = currentSite?.data || {};

  const mergedData = {
    profile: {
      universityName: rawData.profile?.universityName || rawData.profile?.title || currentSite?.title || 'Universitas Pelita Bangsa',
      departmentName: rawData.profile?.departmentName || '',
      tagline: rawData.profile?.tagline || '',
      bio: rawData.profile?.bio || '',
      avatarUrl: rawData.profile?.avatarUrl || DEFAULT_LOGO,
      headerBannerUrl: rawData.profile?.headerBannerUrl || rawData.profile?.bannerUrl || '/img/upb-bg2.JPG',
      showBanner: rawData.profile?.showBanner !== false,
      isVerified: rawData.profile?.isVerified !== false,
      badgeText: rawData.profile?.badgeText || '',
      location: rawData.profile?.location || '',
      email: rawData.profile?.email || '',
      title: rawData.profile?.title || currentSite?.title || rawData.profile?.universityName || 'Universitas Pelita Bangsa'
    },
    theme: rawData.theme || DEFAULT_MICROSITE_DATA.theme,
    buttonStyle: rawData.buttonStyle || DEFAULT_MICROSITE_DATA.buttonStyle,
    socials: rawData.socials || DEFAULT_MICROSITE_DATA.socials,
    links: Array.isArray(rawData.links) ? rawData.links : []
  };

  // 3. Dynamic Browser Title & Meta Tags (Unconditionally declared hook before any early returns)
  useEffect(() => {
    if (mergedData?.profile && currentSite?.data) {
      const p = mergedData.profile;
      const displayTitle = p.departmentName 
        ? `${p.departmentName} - ${p.universityName}`
        : `${p.universityName} • ${p.tagline || 'Portal PMB Resmi'}`;
      document.title = displayTitle;

      const desc = p.tagline ? `${p.tagline} • ${p.bio || ''}` : (p.bio || 'Portal Resmi Universitas Pelita Bangsa');
      
      const setMeta = (selector, attr, val) => {
        let tag = document.querySelector(selector);
        if (tag) tag.setAttribute(attr, val);
      };

      setMeta('meta[name="description"]', 'content', desc);
      setMeta('meta[property="og:title"]', 'content', displayTitle);
      setMeta('meta[property="og:description"]', 'content', desc);
      if (p.headerBannerUrl || p.avatarUrl) {
        const img = p.headerBannerUrl || p.avatarUrl;
        const fullImg = img.startsWith('http') ? img : `https://pmbupb.site${img.startsWith('/') ? '' : '/'}${img}`;
        setMeta('meta[property="og:image"]', 'content', fullImg);
      }
    }
  }, [mergedData.profile, currentSite?.data]);

  // Check if site data is available
  const hasValidData = Boolean(
    cloudSite?.data || 
    initialSite?.data || 
    (typeof localStorage !== 'undefined' && localStorage.getItem(`upb_site_slug_${activeSlug}`))
  );

  // Loading state while resolving live cloud data
  if (isLoading && !hasValidData) {
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

  // If loading finished and NO data found in Cloud/Storage, render 404
  if (!isLoading && !hasValidData) {
    return <NotFoundPage onGoHome={onGoHome} />;
  }

  const links = mergedData.links;

  const handleLinkClick = (linkId) => {
    const targetLink = links.find(l => l.id === linkId);
    if (targetLink) {
      recordLinkClick(currentSiteId, linkId, targetLink.title, targetLink.url, activeSlug);
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

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-slate-950 overflow-x-hidden">
      
      {/* Floating Top Header Navigation */}
      <header className="relative z-30 max-w-lg mx-auto w-full px-4 pt-4 flex items-center justify-end pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition shadow-sm"
            title="Salin Link Publik"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
          </button>

          <button
            onClick={() => setIsQrOpen(true)}
            className="p-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 rounded-xl text-white transition shadow-sm"
            title="Tampilkan QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 100% Full-Fidelity Microsite Renderer (Pixel-Perfect with Dashboard Preview) */}
      <main className="flex-1 w-full -mt-12">
        <MicrositeRenderer 
          data={mergedData} 
          onLinkClick={handleLinkClick}
          onShareClick={handleCopyLink}
          isFullScreen={true}
        />
      </main>

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        data={mergedData}
        slug={activeSlug}
      />

    </div>
  );
}
