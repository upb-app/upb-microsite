import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PublicMicrositePage from './pages/PublicMicrositePage';
import NotFoundPage from './pages/NotFoundPage';
import EditorTabs from './components/Editor/EditorTabs';
import ProfileSection from './components/Editor/ProfileSection';
import LinksSection from './components/Editor/LinksSection';
import DesignSection from './components/Editor/DesignSection';
import SocialSection from './components/Editor/SocialSection';
import PresetsSection from './components/Editor/PresetsSection';
import AnalyticsSection from './components/Editor/AnalyticsSection';
import DeviceFrame from './components/Preview/DeviceFrame';
import QrCodeModal from './components/Modals/QrCodeModal';
import ExportModal from './components/Modals/ExportModal';
import ShareModal from './components/Modals/ShareModal';
import PublishModal from './components/Modals/PublishModal';
import PublicViewModal from './components/Modals/PublicViewModal';
import LoginModal from './components/Auth/LoginModal';
import UserManagementModal from './components/Admin/UserManagementModal';
import MicrositeManagerModal from './components/Admin/MicrositeManagerModal';
import { DEFAULT_MICROSITE_DATA, DEFAULT_MICROSITES_LIST } from './data/defaultData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Layers, ExternalLink, Send, Copy, Check, Radio } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordLinkClick } from './services/analyticsService';
import { 
  publishMicrositeToCloud, 
  deleteMicrositeFromCloud, 
  sanitizeSlug, 
  getShareableMicrositeUrl 
} from './services/micrositeService';

const MICROSITES_STORAGE_KEY = 'upb_multi_microsites_list_v2';
const ACTIVE_SITE_KEY = 'upb_active_microsite_id_v2';

// Reserved system routes that cannot be used as public microsite slugs
const RESERVED_PATHS = [
  '',
  's',
  'dasbor',
  'dashboard',
  'asup',
  'login',
  'admin',
  'assets',
  'img',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  '404',
  '404.html'
];

function MainAppContent() {
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
  const [topBarCopied, setTopBarCopied] = useState(false);

  // Multi-microsites state
  const [microsites, setMicrosites] = useState(() => {
    try {
      const saved = localStorage.getItem(MICROSITES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading saved microsites', e);
    }
    return DEFAULT_MICROSITES_LIST;
  });

  // Active Microsite ID
  const [activeSiteId, setActiveSiteId] = useState(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_SITE_KEY);
      if (savedId) return savedId;
    } catch (e) {}
    return DEFAULT_MICROSITES_LIST[0].id;
  });

  // Ensure activeSiteId is valid and schema is fully hydrated
  const currentMicrosite = microsites.find(s => s.id === activeSiteId) || microsites[0] || DEFAULT_MICROSITES_LIST[0];
  const rawData = currentMicrosite?.data || DEFAULT_MICROSITE_DATA;
  const data = {
    ...DEFAULT_MICROSITE_DATA,
    ...rawData,
    profile: {
      ...DEFAULT_MICROSITE_DATA.profile,
      ...(rawData.profile || {})
    },
    theme: {
      ...DEFAULT_MICROSITE_DATA.theme,
      ...(rawData.theme || {})
    },
    buttonStyle: {
      ...DEFAULT_MICROSITE_DATA.buttonStyle,
      ...(rawData.buttonStyle || {})
    },
    socials: {
      ...DEFAULT_MICROSITE_DATA.socials,
      ...(rawData.socials || {})
    },
    links: Array.isArray(rawData.links) && rawData.links.length > 0 
      ? rawData.links 
      : DEFAULT_MICROSITE_DATA.links
  };

  // Persist microsites and active ID
  useEffect(() => {
    try {
      localStorage.setItem(MICROSITES_STORAGE_KEY, JSON.stringify(microsites));
      localStorage.setItem(ACTIVE_SITE_KEY, activeSiteId);
    } catch (e) {}
  }, [microsites, activeSiteId]);

  // URL Path router helpers - Strictly /s/asup for Login & /s/dasbor for Dashboard
  const isLoginRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    
    return (
      path === '/s/asup' ||
      path === '/s/asup/' ||
      hash === '#/s/asup' ||
      hash === '#/s/asup/'
    );
  };

  const isDashboardRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    
    return (
      path === '/s/dasbor' ||
      path === '/s/dasbor/' ||
      hash === '#/s/dasbor' ||
      hash === '#/s/dasbor/'
    );
  };

  const getPublicSlug = () => {
    const path = window.location.pathname;
    const hash = window.location.hash;

    // 1. Check legacy '/s/[slug]' (e.g. '/s/fakultas-teknik')
    if (path.startsWith('/s/')) {
      const segment = path.replace('/s/', '').split('?')[0].split('/')[0].trim().toLowerCase();
      if (segment && !['dasbor', 'dashboard', 'asup', 'login'].includes(segment)) {
        return segment;
      }
    }

    // 2. Check clean root path '/[slug]' (e.g. '/pmb-utama', '/fakultas-teknik')
    const firstSegment = path.split('/')[1]?.split('?')[0]?.trim().toLowerCase();
    if (firstSegment && !RESERVED_PATHS.includes(firstSegment)) {
      return firstSegment;
    }

    // 3. Check hash format '#/s/[slug]' or '#/[slug]'
    if (hash.startsWith('#/s/')) {
      const segment = hash.replace('#/s/', '').split('?')[0].split('/')[0].trim().toLowerCase();
      if (segment && !['dasbor', 'dashboard', 'asup', 'login'].includes(segment)) {
        return segment;
      }
    } else if (hash.startsWith('#/')) {
      const segment = hash.replace('#/', '').split('?')[0].split('/')[0].trim().toLowerCase();
      if (segment && !RESERVED_PATHS.includes(segment)) {
        return segment;
      }
    }

    return null;
  };

  const determineRoute = () => {
    if (isLoginRoute()) return 'login';
    if (isDashboardRoute()) return 'dashboard';
    
    const slug = getPublicSlug();
    if (slug) {
      const exists = microsites.some(s => s.slug === slug) || slug === 'pmb-utama';
      return exists ? 'public-site' : 'public-site'; // Always resolve to public site handler which checks Cloud Firestore
    }

    const path = window.location.pathname;
    if (path !== '/' && path !== '' && path !== '/index.html') {
      return 'not-found';
    }

    return 'home';
  };

  // Route State: 'home' | 'dashboard' | 'login' | 'public-site' | 'not-found'
  const [route, setRoute] = useState(determineRoute);

  // Listen for browser navigation changes
  useEffect(() => {
    const checkRoute = () => {
      setRoute(determineRoute());
    };

    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);

    // Auto-sync all current microsites to Firestore Cloud in background
    if (microsites && microsites.length > 0) {
      microsites.forEach(site => {
        publishMicrositeToCloud(site).catch(() => {});
      });
    }

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, [microsites]);

  const navigateTo = (newRoute, slug) => {
    if (newRoute === 'dashboard') {
      if (window.history.pushState) {
        window.history.pushState(null, '', '/s/dasbor');
      } else {
        window.location.hash = '/s/dasbor';
      }
      setRoute('dashboard');
    } else if (newRoute === 'login') {
      if (window.history.pushState) {
        window.history.pushState(null, '', '/s/asup');
      } else {
        window.location.hash = '/s/asup';
      }
      setRoute('login');
    } else if (newRoute === 'public-site' && slug) {
      if (window.history.pushState) {
        window.history.pushState(null, '', `/${slug}`);
      } else {
        window.location.hash = `/${slug}`;
      }
      setRoute('public-site');
    } else if (newRoute === 'not-found') {
      setRoute('not-found');
    } else {
      if (window.history.pushState) {
        window.history.pushState(null, '', '/');
      } else {
        window.location.hash = '';
      }
      setRoute('home');
    }
  };

  // Editor Tabs
  const [activeTab, setActiveTab] = useState('profile');

  // Modals state
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPublicViewOpen, setIsPublicViewOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isMicrositeManagerOpen, setIsMicrositeManagerOpen] = useState(false);
  const [previewData, setPreviewData] = useState(data);

  // Helper to update active microsite data
  const updateActiveSiteData = (updater) => {
    setMicrosites(prev => prev.map(site => {
      if (site.id === currentMicrosite.id) {
        const updatedData = typeof updater === 'function' ? updater(site.data) : updater;
        const modifiedSite = {
          ...site,
          updatedAt: new Date().toISOString().split('T')[0],
          data: updatedData
        };
        // Auto-sync to Firebase Cloud in background
        publishMicrositeToCloud(modifiedSite).catch(() => {});
        return modifiedSite;
      }
      return site;
    }));
  };

  // Update site title or slug metadata directly (atomic update across meta & profile)
  const updateSiteMeta = (field, value) => {
    setMicrosites(prev => prev.map(site => {
      if (site.id === currentMicrosite.id) {
        const modifiedSite = {
          ...site,
          [field]: value,
          updatedAt: new Date().toISOString().split('T')[0],
          data: {
            ...(site.data || DEFAULT_MICROSITE_DATA),
            profile: {
              ...(site.data?.profile || DEFAULT_MICROSITE_DATA.profile),
              [field === 'title' ? 'title' : field]: value
            }
          }
        };
        // Auto-sync to Firebase Cloud in background
        publishMicrositeToCloud(modifiedSite).catch(() => {});
        return modifiedSite;
      }
      return site;
    }));
  };

  const handleUpdateSite = (siteId, updates) => {
    setMicrosites(prev => prev.map(site => {
      if (site.id === siteId) {
        const modifiedSite = {
          ...site,
          ...updates,
          updatedAt: new Date().toISOString().split('T')[0],
          data: {
            ...(site.data || DEFAULT_MICROSITE_DATA),
            profile: {
              ...(site.data?.profile || DEFAULT_MICROSITE_DATA.profile),
              title: updates.title || site.title,
              slug: updates.slug || site.slug
            }
          }
        };
        publishMicrositeToCloud(modifiedSite).catch(() => {});
        return modifiedSite;
      }
      return site;
    }));
  };

  // Section updaters
  const updateProfile = (field, value) => {
    setMicrosites(prev => prev.map(site => {
      if (site.id === currentMicrosite.id) {
        const modifiedSite = {
          ...site,
          title: field === 'universityName' ? value : site.title,
          slug: field === 'slug' ? value : site.slug,
          updatedAt: new Date().toISOString().split('T')[0],
          data: {
            ...(site.data || DEFAULT_MICROSITE_DATA),
            profile: {
              ...(site.data?.profile || DEFAULT_MICROSITE_DATA.profile),
              [field]: value
            }
          }
        };
        publishMicrositeToCloud(modifiedSite).catch(() => {});
        return modifiedSite;
      }
      return site;
    }));
  };

  const setLinks = (updater) => {
    updateActiveSiteData(prev => ({
      ...prev,
      links: typeof updater === 'function' ? updater(prev.links) : updater
    }));
  };

  const updateTheme = (field, value) => {
    updateActiveSiteData(prev => ({
      ...prev,
      theme: { ...prev.theme, [field]: value }
    }));
  };

  const updateButtonStyle = (field, value) => {
    updateActiveSiteData(prev => ({
      ...prev,
      buttonStyle: { ...prev.buttonStyle, [field]: value }
    }));
  };

  const updateSocials = (field, value) => {
    updateActiveSiteData(prev => ({
      ...prev,
      socials: { ...prev.socials, [field]: value }
    }));
  };

  const handleApplyPreset = (presetData) => {
    updateActiveSiteData(presetData);
  };

  const handleResetDefault = () => {
    if (window.confirm('Reset microsite ini kembali ke data template awal?')) {
      updateActiveSiteData(DEFAULT_MICROSITE_DATA);
    }
  };

  const handleResetClicks = () => {
    setLinks(prev => prev.map(l => ({ ...l, clicks: 0 })));
  };

  const handleLinkClick = (linkId) => {
    const targetLink = (data?.links || []).find(l => l.id === linkId);
    if (currentMicrosite?.id && targetLink) {
      recordLinkClick(currentMicrosite.id, linkId, targetLink.title, targetLink.url);
    }
  };

  const handleTopBarCopyLink = () => {
    const origin = window.location.origin.includes('localhost') ? window.location.origin : 'https://pmbupb.site';
    const shareUrl = getShareableMicrositeUrl(currentMicrosite, origin);
    navigator.clipboard.writeText(shareUrl);
    setTopBarCopied(true);
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => setTopBarCopied(false), 2000);
  };

  // Multi-microsite actions
  const handleSelectSite = (siteId) => {
    setActiveSiteId(siteId);
    const selected = microsites.find(s => s.id === siteId);
    if (selected) {
      setPreviewData(selected.data);
    }
  };

  const handleCreateSite = ({ title, slug, category, tagline }) => {
    const cleanSlug = sanitizeSlug(slug);
    const newId = `site-${cleanSlug}-${Date.now()}`;
    const newSite = {
      id: newId,
      title,
      slug: cleanSlug,
      category: category || 'Pusat Admisi',
      status: 'Active',
      views: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      data: {
        ...DEFAULT_MICROSITE_DATA,
        profile: {
          ...DEFAULT_MICROSITE_DATA.profile,
          universityName: title,
          departmentName: title,
          tagline: tagline || DEFAULT_MICROSITE_DATA.profile.tagline,
          slug: cleanSlug
        }
      }
    };

    setMicrosites([...microsites, newSite]);
    setActiveSiteId(newId);
    setPreviewData(newSite.data);
    publishMicrositeToCloud(newSite).catch(() => {});
    confetti({ particleCount: 70, spread: 60 });
  };

  const handleDuplicateSite = (siteId) => {
    const source = microsites.find(s => s.id === siteId);
    if (!source) return;

    const newSlug = sanitizeSlug(`${source.slug}-salinan`);
    const newId = `site-${newSlug}-${Date.now()}`;
    const newSite = {
      ...source,
      id: newId,
      title: `${source.title} (Salinan)`,
      slug: newSlug,
      views: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      data: JSON.parse(JSON.stringify(source.data))
    };

    setMicrosites([...microsites, newSite]);
    setActiveSiteId(newId);
    setPreviewData(newSite.data);
    publishMicrositeToCloud(newSite).catch(() => {});
    confetti({ particleCount: 50, spread: 50 });
  };

  const handleDeleteSite = (siteId) => {
    if (microsites.length <= 1) {
      alert('Tidak dapat menghapus microsite utama terakhir.');
      return;
    }
    const target = microsites.find(s => s.id === siteId);
    if (target) {
      deleteMicrositeFromCloud(target.slug, target.id).catch(() => {});
    }
    const remaining = microsites.filter(s => s.id !== siteId);
    setMicrosites(remaining);
    if (activeSiteId === siteId) {
      setActiveSiteId(remaining[0].id);
    }
  };

  // ----------------------------------------------------------------------
  // SCENARIO 0: 404 NOT FOUND PAGE
  // Triggered when unknown paths or non-existent slugs are requested
  // ----------------------------------------------------------------------
  if (route === 'not-found') {
    return (
      <NotFoundPage onGoHome={() => navigateTo('home')} />
    );
  }

  // ----------------------------------------------------------------------
  // SCENARIO 1: STANDALONE CLEAN PUBLIC MICROSITE VIEW (`/[slug]`)
  // Accessible to anyone without login or dashboard chrome
  // ----------------------------------------------------------------------
  if (route === 'public-site') {
    const publicSlug = getPublicSlug() || 'pmb-utama';
    let publicSite = microsites.find(s => s.slug === publicSlug);

    if (!publicSite) {
      publicSite = DEFAULT_MICROSITES_LIST.find(s => s.slug === publicSlug);
    }

    if (!publicSite && (publicSlug === 'pmb-utama' || publicSlug === '')) {
      publicSite = currentMicrosite;
    }

    if (!publicSite) {
      publicSite = {
        id: `site-${publicSlug}`,
        slug: publicSlug,
        category: 'Portal Resmi',
        data: null // Leave null so PublicMicrositePage loads actual live cloud data
      };
    }

    return (
      <PublicMicrositePage 
        site={publicSite} 
        onGoHome={() => navigateTo('home')} 
      />
    );
  }

  // ----------------------------------------------------------------------
  // SCENARIO 2: ACCESSED VIA '/' (HOME PMB PORTAL)
  // ----------------------------------------------------------------------
  if (route === 'home') {
    return (
      <div className="min-h-screen font-sans">
        <HomePage />

        <PublicViewModal
          isOpen={isPublicViewOpen}
          onClose={() => setIsPublicViewOpen(false)}
          data={previewData}
          onLinkClick={handleLinkClick}
          onOpenQr={() => setIsQrModalOpen(true)}
        />

        <QrCodeModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          data={previewData}
          slug={currentMicrosite?.slug}
        />
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // SCENARIO 3: ACCESSED VIA '/s/asup' (LOGIN DEDICATED ROUTE)
  // ----------------------------------------------------------------------
  if (route === 'login') {
    // If user is already authenticated, redirect straight to dashboard
    if (currentUser) {
      navigateTo('dashboard');
      return null;
    }

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 font-sans relative transition-colors ${
        isDark ? 'bg-[#040914] text-slate-100' : 'bg-[#f4f7fb] text-slate-900'
      }`}>
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => navigateTo('home')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition ${
              isDark 
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/15' 
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
            }`}
          >
            ← Kembali ke Beranda
          </button>
        </div>

        <LoginModal
          isOpen={true}
          onClose={() => navigateTo('home')}
          onSuccessLogin={() => {
            navigateTo('dashboard');
          }}
        />
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // SCENARIO 4: ACCESSED VIA '/s/dasbor' BUT NOT LOGGED IN
  // Stealth Security: Render 404 Not Found so unauthorized visitors cannot see the dashboard URL
  // ----------------------------------------------------------------------
  if (!currentUser) {
    return (
      <NotFoundPage onGoHome={() => navigateTo('home')} />
    );
  }

  // ----------------------------------------------------------------------
  // SCENARIO 5: ACCESSED VIA '/s/dasbor' AND AUTHENTICATED
  // Clean, Uncluttered Studio with Light Default & Theme Toggle
  // ----------------------------------------------------------------------
  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-blue-600 selection:text-white ${
      isDark ? 'bg-[#040914] text-slate-100' : 'bg-[#f4f7fb] text-slate-900'
    }`}>
      
      {/* Top Main Navbar for Logged In Admin */}
      <Navbar
        data={data}
        activeSiteTitle={currentMicrosite.title}
        micrositesCount={microsites.length}
        onOpenMicrositeManager={() => setIsMicrositeManagerOpen(true)}
        onResetDefault={handleResetDefault}
        onOpenQr={() => {
          setPreviewData(data);
          setIsQrModalOpen(true);
        }}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenPublish={() => setIsPublishModalOpen(true)}
        onOpenPublicView={() => {
          setPreviewData(data);
          setIsPublicViewOpen(true);
        }}
        onOpenPresets={() => setActiveTab('presets')}
        onOpenUserManagement={() => setIsUserManagementOpen(true)}
        onGoHome={() => navigateTo('home')}
      />

      {/* Secondary Bar: Active Microsite Status & Quick Actions */}
      <div className={`border-b px-4 sm:px-6 py-2.5 transition-colors ${
        isDark ? 'bg-[#071326] border-white/10' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-2xs">
              AKTIF
            </span>
            <span className="font-bold text-xs sm:text-sm">
              {currentMicrosite.title}
            </span>
            
            {/* Direct Copyable Link Badge */}
            <div className="flex items-center gap-1.5 bg-blue-500/10 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg border border-blue-500/20">
              <span className="text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold">
                pmbupb.site/{currentMicrosite.slug}
              </span>
              <button
                type="button"
                onClick={handleTopBarCopyLink}
                className="p-1 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition"
                title="Salin Link Publik"
              >
                {topBarCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              isDark ? 'bg-white/10 text-amber-400 border-white/10' : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}>
              {currentMicrosite.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Publish & Share Quick Button */}
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl flex items-center gap-1.5 transition text-xs shadow-sm transform active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publikasikan & Link</span>
            </button>

            {/* Switch / Add Microsite Button */}
            <button
              onClick={() => setIsMicrositeManagerOpen(true)}
              className={`px-3 py-1.5 font-bold rounded-xl border flex items-center gap-1.5 transition text-xs ${
                isDark 
                  ? 'bg-[#0c2242] hover:bg-[#0f2c59] text-amber-400 border-amber-400/30' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Ganti / Tambah Situs</span>
            </button>

            {/* Preview Button */}
            <button
              onClick={() => {
                setPreviewData(data);
                setIsPublicViewOpen(true);
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-1.5 transition text-xs shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Workspace: 2-Column Split (Editor on Left, Live Preview on Right) */}
      <main className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 p-3.5 sm:p-5 items-start">
        
        {/* Left Column: Interactive Editor Studio */}
        <section className={`lg:col-span-7 border rounded-2xl sm:rounded-3xl overflow-hidden shadow-md flex flex-col min-h-[580px] transition-colors ${
          isDark ? 'bg-[#071326] border-white/15' : 'bg-white border-slate-200'
        }`}>
          
          {/* Tabs header */}
          <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Tab Panes */}
          <div className="flex-1 overflow-y-auto p-1">
            {activeTab === 'profile' && (
              <ProfileSection 
                profile={data.profile} 
                updateProfile={updateProfile}
                site={currentMicrosite}
                updateSiteMeta={updateSiteMeta}
                microsites={microsites}
              />
            )}

            {activeTab === 'links' && (
              <LinksSection links={data.links} setLinks={setLinks} />
            )}

            {activeTab === 'design' && (
              <DesignSection
                theme={data.theme}
                updateTheme={updateTheme}
                buttonStyle={data.buttonStyle}
                updateButtonStyle={updateButtonStyle}
              />
            )}

            {activeTab === 'social' && (
              <SocialSection socials={data.socials} updateSocials={updateSocials} />
            )}

            {activeTab === 'presets' && (
              <PresetsSection onApplyPreset={handleApplyPreset} />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsSection site={currentMicrosite} links={data.links} onResetClicks={handleResetClicks} />
            )}
          </div>

        </section>

        {/* Right Column: Live Mockup Device Preview */}
        <section className="lg:col-span-5 sticky top-20">
          <div className={`border rounded-2xl sm:rounded-3xl p-2.5 shadow-xl backdrop-blur-md transition-colors ${
            isDark ? 'bg-[#071326]/80 border-white/15' : 'bg-white/90 border-slate-200'
          }`}>
            <DeviceFrame
              data={data}
              onLinkClick={handleLinkClick}
              onOpenQr={() => {
                setPreviewData(data);
                setIsQrModalOpen(true);
              }}
              onOpenShare={() => setIsShareModalOpen(true)}
              onOpenPublicView={() => {
                setPreviewData(data);
                setIsPublicViewOpen(true);
              }}
            />
          </div>
        </section>

      </main>

      {/* Multi-Microsite Manager Modal */}
      <MicrositeManagerModal
        isOpen={isMicrositeManagerOpen}
        onClose={() => setIsMicrositeManagerOpen(false)}
        microsites={microsites}
        activeSiteId={activeSiteId}
        onSelectSite={handleSelectSite}
        onCreateSite={handleCreateSite}
        onDuplicateSite={handleDuplicateSite}
        onDeleteSite={handleDeleteSite}
        onUpdateSite={handleUpdateSite}
      />

      {/* Publish & Share Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        microsite={currentMicrosite}
        onOpenQr={() => {
          setPreviewData(data);
          setIsQrModalOpen(true);
        }}
      />

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        data={previewData}
        slug={currentMicrosite.slug}
      />

      {/* Export / Import Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={data}
        microsites={microsites}
        onImportData={(importedData) => {
          updateActiveSiteData(importedData);
          setPreviewData(importedData);
        }}
        onImportMicrosites={(importedList) => {
          setMicrosites(importedList);
          if (importedList.length > 0) {
            setActiveSiteId(importedList[0].id);
            setPreviewData(importedList[0].data);
          }
        }}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={previewData}
        slug={currentMicrosite.slug}
      />

      {/* Live Public Fullscreen View Modal */}
      <PublicViewModal
        isOpen={isPublicViewOpen}
        onClose={() => setIsPublicViewOpen(false)}
        data={previewData}
        onLinkClick={handleLinkClick}
        onOpenQr={() => {
          setIsPublicViewOpen(false);
          setIsQrModalOpen(true);
        }}
      />

      {/* Superadmin User Management Modal */}
      <UserManagementModal
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
