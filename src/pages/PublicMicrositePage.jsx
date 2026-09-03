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

  // If site is marked as Inactive by Admin, display clean maintenance page
  const isSiteInactive = currentSite.status === 'Inactive' || currentSite.isActive === false;
  if (!isLoading && isSiteInactive) {
    return (
      <div className="min-h-screen bg-[#040914] text-white flex flex-col items-center justify-between p-4 sm:p-6 font-sans">
        <div />
        <div className="max-w-md w-full mx-auto text-center space-y-5 bg-[#071326]/90 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="w-20 h-20 rounded-3xl bg-white p-2 mx-auto shadow-xl ring-4 ring-amber-500/20 flex items-center justify-center">
            <img src={DEFAULT_LOGO} alt="UPB" className="w-full h-full object-contain" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Tutup Sementara
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {currentSite.title || 'Universitas Pelita Bangsa'}
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
              Halaman microsite ini sedang dinonaktifkan sementara untuk pemeliharaan data atau penyesuaian gelombang pendaftaran baru oleh administrator.
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <a
              href="https://pelitabangsa.ac.id"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl border border-blue-500/40 transition block shadow-lg"
            >
              Kunjungi Portal Utama UPB
            </a>
          </div>
        </div>

        <footer className="text-xs text-slate-500 text-center py-2">
          © {new Date().getFullYear()} Universitas Pelita Bangsa
        </footer>
      </div>
    );
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

  const mergedData = {
    profile: {
      ...profile,
      title: profile.title || currentSite.title || profile.departmentName || profile.universityName
    },
    theme,
    buttonStyle,
    socials,
    links
  };

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
        data={{ profile }}
        slug={activeSlug}
      />

    </div>
  );
}
