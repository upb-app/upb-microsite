export const DEFAULT_MICROSITE_DATA = {
  profile: {
    universityName: "UNIVERSITAS PELITA BANGSA",
    departmentName: "Portal Informasi Resmi & Layanan Terpadu",
    tagline: "Membangun Generasi Unggul Berkarakter & Berdaya Saing Global",
    bio: "Selamat datang di kanal resmi informasi akademik, admisi, dan layanan kemahasiswaan Universitas Pelita Bangsa.",
    avatarUrl: "./img/logo-universitas-pelita-bangsa.png",
    headerBannerUrl: "./img/upb-bg2.JPG",
    showBanner: true,
    isVerified: true,
    badgeText: "Kampus Terakreditasi",
    location: "Cikarang Pusat, Kab. Bekasi",
    email: "humas@pelitabangsa.ac.id",
  },
  theme: {
    bgType: "gradient", // 'solid', 'gradient', 'image', 'mesh'
    bgColor: "#071326",
    bgGradient: "from-[#040914] via-[#071326] to-[#0c2242]",
    bgImageUrl: "./img/upb-bg2.JPG",
    bgOverlayOpacity: 75,
    bgBlur: "sm", // 'none', 'sm', 'md', 'lg'
    textColor: "#ffffff",
    accentColor: "#f59e0b",
    fontFamily: "sans", // 'sans', 'serif', 'mono'
    cardStyle: "glass", // 'glass', 'solid', 'outline', 'minimal'
  },
  buttonStyle: {
    variant: "glass", // 'solid', 'glass', 'outline', 'gradient', 'soft'
    rounded: "rounded-xl", // 'rounded-none', 'rounded-lg', 'rounded-xl', 'rounded-full'
    animation: "anim-hover-scale", // 'none', 'anim-pulse', 'anim-float', 'anim-glow', 'anim-bounce', 'anim-shimmer', 'anim-hover-scale'
    bgColor: "rgba(12, 34, 66, 0.7)",
    textColor: "#ffffff",
    borderColor: "rgba(245, 158, 11, 0.4)",
    hoverBgColor: "#0f2c59",
    hoverTextColor: "#fbbf24",
    shadow: "shadow-md shadow-blue-950/40",
  },
  links: [
    {
      id: "link-1",
      title: "Penerimaan Mahasiswa Baru (PMB) 2026/2027",
      subtitle: "Daftar online & klaim potongan biaya kuliah gelombang 1",
      url: "https://sibara.pelitabangsa.ac.id",
      icon: "UserPlus",
      animation: "anim-pulse",
      badge: "HOT ADMISI",
      badgeColor: "bg-amber-500 text-slate-950",
      highlight: true,
      customColor: "",
      clicks: 1420,
    },
    {
      id: "link-2",
      title: "Sistem Informasi Akademik (SIAKAD UPB)",
      subtitle: "Pengisian KRS, jadwal kuliah, dan riwayat nilai KHS",
      url: "https://ecampus.pelitabangsa.ac.id",
      icon: "GraduationCap",
      animation: "anim-hover-scale",
      badge: "PORTAL RESMI",
      badgeColor: "bg-blue-600 text-white",
      highlight: false,
      customColor: "",
      clicks: 3840,
    },
    {
      id: "link-3",
      title: "Download Kalender Akademik & Buku Panduan",
      subtitle: "Panduan lengkap semester ganjil/genap tahun ajaran baru",
      url: "https://pelitabangsa.ac.id/panduan",
      icon: "Download",
      animation: "anim-hover-scale",
      badge: "PDF",
      badgeColor: "bg-emerald-600 text-white",
      highlight: false,
      customColor: "",
      clicks: 890,
    },
    {
      id: "link-4",
      title: "E-Library & Repositori Karya Ilmiah",
      subtitle: "Akses ribuan jurnal internasional, ebook & tugas akhir",
      url: "https://elibrary.pelitabangsa.ac.id",
      icon: "Library",
      animation: "anim-float",
      badge: "AKSES MAHASISWA",
      badgeColor: "bg-indigo-600 text-white",
      highlight: false,
      customColor: "",
      clicks: 654,
    },
    {
      id: "link-5",
      title: "Layanan Konsultasi WhatsApp Humas & PMB",
      subtitle: "Fast response Senin - Sabtu (08.00 - 17.00 WIB)",
      url: "https://wa.me/6281944283488",
      icon: "MessageSquare",
      animation: "anim-glow",
      badge: "ONLINE",
      badgeColor: "bg-green-500 text-slate-950",
      highlight: false,
      customColor: "",
      clicks: 2190,
    },
  ],
  socials: {
    instagram: "https://instagram.com/kampuspelitabangsa",
    youtube: "https://youtube.com/@UNIVERSITASPELITABANGSAOFFICIAL",
    tiktok: "https://tiktok.com/@upb_official",
    linkedin: "https://linkedin.com/school/universitas-pelita-bangsa",
    whatsapp: "https://wa.me/6281944283488",
    facebook: "https://facebook.com/UniversitasPelitaBangsa",
    twitter: "https://x.com/upb_official",
    website: "https://pelitabangsa.ac.id",
    telegram: "",
    spotify: "",
    position: "bottom", // 'top', 'bottom', 'both'
  }
};

export const DEFAULT_MICROSITES_LIST = [
  {
    id: "site-pmb-utama",
    title: "Portal PMB & Admisi Universitas",
    slug: "pmb-utama",
    category: "Pusat Admisi",
    status: "Active",
    views: 14250,
    createdAt: "2026-08-01",
    updatedAt: "2026-09-02",
    data: { ...DEFAULT_MICROSITE_DATA }
  },
  {
    id: "site-ft",
    title: "Fakultas Teknik (FT)",
    slug: "fakultas-teknik",
    category: "Fakultas",
    status: "Active",
    views: 8930,
    createdAt: "2026-08-05",
    updatedAt: "2026-09-01",
    data: {
      ...DEFAULT_MICROSITE_DATA,
      profile: {
        ...DEFAULT_MICROSITE_DATA.profile,
        departmentName: "Fakultas Teknik (FT)",
        tagline: "Inovasi Rekayasa Teknologi, AI, & Manufaktur Industri",
        bio: "Layanan resmi Program Studi S1 Teknik Informatika, Arsitektur, Teknik Sipil, Teknik Industri, Teknik Lingkungan & THP.",
      },
      theme: {
        ...DEFAULT_MICROSITE_DATA.theme,
        bgGradient: "from-[#021024] via-[#052659] to-[#0c356a]",
        accentColor: "#3b82f6"
      }
    }
  },
  {
    id: "site-feb",
    title: "Fakultas Ekonomi & Bisnis (FEB)",
    slug: "fakultas-ekonomi-bisnis",
    category: "Fakultas",
    status: "Active",
    views: 7420,
    createdAt: "2026-08-10",
    updatedAt: "2026-08-30",
    data: {
      ...DEFAULT_MICROSITE_DATA,
      profile: {
        ...DEFAULT_MICROSITE_DATA.profile,
        departmentName: "Fakultas Ekonomi dan Bisnis (FEB)",
        tagline: "Mencetak Entrepreneur Mandiri dan Pemimpin Bisnis Global",
        bio: "Layanan resmi S2 Manajemen, S1 Manajemen, S1 Bisnis Digital, S1 Kewirausahaan, S1 Ekonomi Syariah, dan D3 Akuntansi.",
      },
      theme: {
        ...DEFAULT_MICROSITE_DATA.theme,
        bgGradient: "from-[#1a120b] via-[#3c2a21] to-[#0c2242]",
        accentColor: "#f59e0b"
      }
    }
  },
  {
    id: "site-fikt",
    title: "Fakultas Ilmu Keguruan & Tarbiyah (FIKT)",
    slug: "fikt-upb",
    category: "Fakultas",
    status: "Active",
    views: 5120,
    createdAt: "2026-08-12",
    updatedAt: "2026-08-28",
    data: {
      ...DEFAULT_MICROSITE_DATA,
      profile: {
        ...DEFAULT_MICROSITE_DATA.profile,
        departmentName: "Fakultas Ilmu Keguruan dan Tarbiyah (FIKT)",
        tagline: "Pendidik Berkarakter, Unggul, dan Berakhlak Mulia",
        bio: "Layanan resmi S1 PGSD, S1 PGPAUD, S1 Bimbingan & Konseling, S1 Manajemen Pendidikan Islam, dan S1 Pendidikan IPA.",
      },
      theme: {
        ...DEFAULT_MICROSITE_DATA.theme,
        bgGradient: "from-[#051f20] via-[#0b2b26] to-[#0c2242]",
        accentColor: "#10b981"
      }
    }
  },
  {
    id: "site-fh",
    title: "Fakultas Hukum (FH)",
    slug: "fakultas-hukum",
    category: "Fakultas",
    status: "Active",
    views: 4310,
    createdAt: "2026-08-15",
    updatedAt: "2026-08-25",
    data: {
      ...DEFAULT_MICROSITE_DATA,
      profile: {
        ...DEFAULT_MICROSITE_DATA.profile,
        departmentName: "Fakultas Hukum (FH)",
        tagline: "Menegakkan Keadilan, Integritas, dan Profesionalisme Hukum",
        bio: "Layanan resmi Program Studi S1 Ilmu Hukum Universitas Pelita Bangsa.",
      },
      theme: {
        ...DEFAULT_MICROSITE_DATA.theme,
        bgGradient: "from-[#1a0c0c] via-[#2d1214] to-[#071326]",
        accentColor: "#ef4444"
      }
    }
  }
];
