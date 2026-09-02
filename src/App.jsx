import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PublicMicrositePage from './pages/PublicMicrositePage';
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
import { Layers, ExternalLink, Send, Radio } from 'lucide-react';
import confetti from 'canvas-confetti';

const MICROSITES_STORAGE_KEY = 'upb_multi_microsites_list_v2';
const ACTIVE_SITE_KEY = 'upb_active_microsite_id_v2';

function MainAppContent() {
  const { currentUser, isSuperadmin } = useAuth();
  const { isDark } = useTheme();

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

  // URL Path router helpers
  const isDashboardRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path.includes('/dasbor') || 
      path.includes('/dashboard') || 
      hash.includes('/dasbor') || 
      hash.includes('dasbor') ||
      search.includes('dasbor')
    );
  };

  const getPublicSlug = () => {
    const hash = window.location.hash;
    const path = window.location.pathname;
    
    // Check hash route format '#/s/[slug]'
    if (hash.startsWith('#/s/')) {
      return hash.replace('#/s/', '').split('?')[0].split('/')[0].trim().toLowerCase();
    }
    // Check path format '/s/[slug]'
    if (path.startsWith('/s/')) {
      return path.replace('/s/', '').split('?')[0].split('/')[0].trim().toLowerCase();
    }
    return null;
  };

  // Route State: 'home' | 'dashboard' | 'public-site'
  const [route, setRoute] = useState(() => {
    if (getPublicSlug()) return 'public-site';
    if (isDashboardRoute()) return 'dashboard';
    return 'home';
  });

  // Listen for browser navigation changes
  useEffect(() => {
    const checkRoute = () => {
      const slug = getPublicSlug();
      if (slug) {
        setRoute('public-site');
      } else if (isDashboardRoute()) {
        setRoute('dashboard');
      } else {
        setRoute('home');
      }
    };

    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const navigateTo = (newRoute, slug) => {
    if (newRoute === 'dashboard') {
      if (window.history.pushState) {
        window.history.pushState(null, '', '/dasbor');
      } else {
        window.location.hash = '/dasbor';
      }
      setRoute('dashboard');
    } else if (newRoute === 'public-site' && slug) {
      if (window.history.pushState) {
        window.history.pushState(null, '', `/s/${slug}`);
      } else {
        window.location.hash = `/s/${slug}`;
      }
      setRoute('public-site');
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
        return {
          ...site,
          updatedAt: new Date().toISOString().split('T')[0],
          data: updatedData
        };
      }
      return site;
    }));
  };

  // Section updaters
  const updateProfile = (field, value) => {
    updateActiveSiteData(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
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
    setLinks(prev => prev.map(l => {
      if (l.id === linkId) {
        return { ...l, clicks: (l.clicks || 0) + 1 };
      }
      return l;
    }));
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
    const newSite = {
      id: `site-${Date.now()}`,
      title,
      slug,
      category: category || 'Fakultas',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      views: 0,
      isPublished: true,
      data: {
        ...DEFAULT_MICROSITE_DATA,
        profile: {
          ...DEFAULT_MICROSITE_DATA.profile,
          title,
          tagline: tagline || 'Portal Resmi Universitas Pelita Bangsa',
          bio: `Pusat informasi dan layanan digital terpadu untuk ${title} Universitas Pelita Bangsa.`
        }
      }
    };

    setMicrosites(prev => [newSite, ...prev]);
    setActiveSiteId(newSite.id);
  };

  const handleDuplicateSite = (siteId) => {
    const target = microsites.find(s => s.id === siteId);
    if (!target) return;

    const copySite = {
      ...target,
      id: `site-${Date.now()}`,
      title: `${target.title} (Salinan)`,
      slug: `${target.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      views: 0,
      data: JSON.parse(JSON.stringify(target.data))
    };

    setMicrosites(prev => [copySite, ...prev]);
    setActiveSiteId(copySite.id);
    confetti({ particleCount: 50 });
  };

  const handleDeleteSite = (siteId) => {
    if (microsites.length <= 1) {
      alert('Tidak dapat menghapus satu-satunya microsite yang tersisa.');
      return;
    }

    const remaining = microsites.filter(s => s.id !== siteId);
    setMicrosites(remaining);
    if (activeSiteId === siteId) {
      setActiveSiteId(remaining[0].id);
    }
  };

  // ----------------------------------------------------------------------
  // SCENARIO 0: STANDALONE PUBLIC MICROSITE VIEW (`/#/s/[slug]`)
  // Accessible to anyone without login or dashboard chrome
  // ----------------------------------------------------------------------
  if (route === 'public-site') {
    const publicSlug = getPublicSlug();
    const publicSite = microsites.find(s => s.slug === publicSlug) || currentMicrosite;

    return (
      <PublicMicrositePage 
        site={publicSite} 
        onGoHome={() => navigateTo('home')} 
      />
    );
  }

  // ----------------------------------------------------------------------
  // SCENARIO 1: ACCESSED VIA '/' (HOME PMB PORTAL)
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
        />
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // SCENARIO 2: ACCESSED VIA '/dasbor' BUT NOT LOGGED IN
  // ----------------------------------------------------------------------
  if (!currentUser) {
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
            if (window.history.pushState) {
              window.history.pushState(null, '', '/dasbor');
            } else {
              window.location.hash = '/dasbor';
            }
            setRoute('dashboard');
          }}
        />
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // SCENARIO 3: ACCESSED VIA '/dasbor' AND AUTHENTICATED
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
      <div className={`border-b px-4 sm:px-6 py-2 transition-colors ${
        isDark ? 'bg-[#071326] border-white/10' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-600 text-white">
              AKTIF
            </span>
            <span className="font-bold text-xs sm:text-sm">
              {currentMicrosite.title}
            </span>
            <span className="text-slate-400 font-mono text-[11px] hidden md:inline">
              (pmbupb.site/s/{currentMicrosite.slug})
            </span>
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
              className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg flex items-center gap-1.5 transition text-xs shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publikasikan & Link</span>
            </button>

            {/* Switch / Add Microsite Button */}
            <button
              onClick={() => setIsMicrositeManagerOpen(true)}
              className={`px-3 py-1 font-bold rounded-lg border flex items-center gap-1.5 transition text-xs ${
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
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5 transition text-xs shadow-sm"
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
              <ProfileSection profile={data.profile} updateProfile={updateProfile} />
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

      {/* Modals */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        data={previewData}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={data}
        onImportData={(imported) => updateActiveSiteData(imported)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={data}
      />

      <PublicViewModal
        isOpen={isPublicViewOpen}
        onClose={() => setIsPublicViewOpen(false)}
        data={previewData}
        onLinkClick={handleLinkClick}
        onOpenQr={() => setIsQrModalOpen(true)}
      />

      <UserManagementModal
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainAppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
