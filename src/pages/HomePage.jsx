import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  X,
  Sun,
  Moon,
  ArrowUpRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function HomePage() {
  const { isDark, toggleTheme } = useTheme();
  
  // Active View Tab: 'hero' | 'faculties' | 'programs'
  const [activeView, setActiveView] = useState('hero');
  
  // Filter category for Programs tab
  const [activeProgramFilter, setActiveProgramFilter] = useState('all');

  // Modals for detail previews: 'biaya', 'alur', 'syarat', 'keunggulan'
  const [activeModal, setActiveModal] = useState(null);

  // 4 Fakultas Resmi Sesuai Brosur
  const facultiesData = [
    {
      id: 'feb',
      name: 'Fakultas Ekonomi dan Bisnis (FEB)',
      code: 'FEB',
      color: 'bg-amber-600',
      tagColor: 'text-amber-400',
      prodis: [
        'S2 Manajemen (Pascasarjana)',
        'S1 Manajemen',
        'S1 Kewirausahaan',
        'S1 Bisnis Digital',
        'S1 Ekonomi Syariah',
        'D3 Akuntansi'
      ],
      spp: { pagi: 'Rp 350.000', malam: 'Rp 550.000', weekend: 'Rp 650.000' }
    },
    {
      id: 'ft',
      name: 'Fakultas Teknik (FT)',
      code: 'FT',
      color: 'bg-blue-600',
      tagColor: 'text-blue-400',
      prodis: [
        'S1 Arsitektur',
        'S1 Teknik Informatika',
        'S1 Teknik Lingkungan',
        'S1 Teknik Sipil',
        'S1 Teknik Industri',
        'S1 Teknologi Hasil Pertanian'
      ],
      spp: { pagi: 'Rp 400.000', malam: 'Rp 650.000', weekend: 'Rp 700.000' }
    },
    {
      id: 'fikt',
      name: 'Fakultas Ilmu Keguruan dan Tarbiyah (FIKT)',
      code: 'FIKT',
      color: 'bg-emerald-600',
      tagColor: 'text-emerald-400',
      prodis: [
        'S1 Pendidikan Guru Sekolah Dasar (PGSD)',
        'S1 Pendidikan Guru PAUD (PGPAUD)',
        'S1 Bimbingan dan Konseling Pendidikan Islam',
        'S1 Manajemen Pendidikan Islam',
        'S1 Pendidikan Ilmu Pengetahuan Alam (IPA)'
      ],
      spp: { pagi: 'Rp 350.000', malam: 'Rp 550.000', weekend: 'Rp 650.000' }
    },
    {
      id: 'fh',
      name: 'Fakultas Hukum (FH)',
      code: 'FH',
      color: 'bg-crimson-600',
      tagColor: 'text-crimson-400',
      prodis: [
        'S1 Ilmu Hukum'
      ],
      spp: { pagi: 'Rp 350.000', malam: 'Rp 550.000', weekend: 'Rp 650.000' }
    }
  ];

  // 3 Program Kelas Resmi Sesuai Brosur
  const programs = [
    {
      num: '01',
      title: 'Program Kelas Reguler Pagi',
      category: 'reguler',
      badge: 'Lulusan SMA/SMK',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      desc: 'Perkuliahan penuh waktu pagi/siang dengan pembelajaran interaktif dan kurikulum berbasis entrepreneurship & industri.',
      spp: 'SPP mulai Rp 350.000 / bln'
    },
    {
      num: '02',
      title: 'Program Kelas Reguler Malam',
      category: 'karyawan',
      badge: 'Kuliah Sambil Kerja (HOT)',
      isHighlight: true,
      image: '/img/upb-bg2.JPG',
      desc: 'Dirancang khusus bagi pekerja industri agar tetap produktif dan berprestasi tanpa mengganggu jam kerja shift.',
      spp: 'SPP mulai Rp 550.000 / bln'
    },
    {
      num: '03',
      title: 'Program Kelas Reguler Akhir Pekan (Sabtu)',
      category: 'weekend',
      badge: 'Fleksibel Weekend',
      image: '/img/upb-bg.JPG',
      desc: 'Perkuliahan fleksibel di hari Sabtu dengan metode hybrid learning bagi profesional dan pekerja pabrik.',
      spp: 'SPP mulai Rp 650.000 / bln'
    }
  ];

  // 8 Keunggulan Resmi UPB (Sesuai Brosur Halaman 1 "Kenapa Harus UPB?")
  const keunggulanUPB = [
    {
      title: 'Pendidikan Berkualitas & Terakreditasi',
      desc: 'Kurikulum berbasis Outcome-Based Education (OBE) dan terakreditasi resmi BAN-PT & LAM.'
    },
    {
      title: 'Biaya Kuliah Terjangkau & Ringan',
      desc: 'Sistem pembayaran SPP bulanan tanpa bunga mulai dari Rp 350.000 / bulan.'
    },
    {
      title: 'Dosen Profesional & Berpengalaman',
      desc: 'Tenaga pengajar bergelar Master, Doktor, Guru Besar, serta praktisi industri berpengalaman.'
    },
    {
      title: 'Fasilitas Kampus Lengkap & Terpadu',
      desc: 'Smart Classroom, Laboratorium Komputer AI, Perpustakaan Digital, dan Student Center.'
    },
    {
      title: 'Kuliah Sambil Kerja, Tetap Produktif',
      desc: 'Pilihan kelas malam dan kelas akhir pekan (Sabtu) fleksibel tanpa mengganggu jam kerja shift.'
    },
    {
      title: 'Banyak Pilihan Program Studi',
      desc: 'Tersedia 4 Fakultas unggulan (FEB, FT, FIKT, FH) dengan jenjang D3, S1, dan S2 Pascasarjana.'
    },
    {
      title: 'Kampus Berbasis Entrepreneur',
      desc: 'Pusat inkubasi bisnis dan pengembangan wirausaha digital berdaya saing mandiri.'
    },
    {
      title: 'Lokasi Strategis di Pusat Industri',
      desc: 'Terhubung langsung dengan 500+ korporasi mitra di kawasan industri Cikarang dan sekitarnya.'
    }
  ];

  return (
    <div className={`h-screen w-screen overflow-hidden font-sans flex flex-col justify-between relative transition-colors duration-500 selection:bg-crimson-600 selection:text-white p-2 sm:p-3.5 lg:p-5 ${
      isDark 
        ? 'bg-[#040914]' 
        : 'bg-[#0f2444]'
    }`}>
      
      {/* Outer Curved Container with Viewport Framing */}
      <div className={`relative w-full h-full rounded-[20px] sm:rounded-[28px] lg:rounded-[32px] overflow-hidden shadow-2xl flex flex-col justify-between transition-colors duration-500 ${
        isDark 
          ? 'bg-[#071326] border border-white/15' 
          : 'bg-[#f4f7fb] border border-slate-300'
      }`}>

        {/* ========================================================================= */}
        {/* 1. TOP HEADER (Clear, Structured, Perfectly Spaced) */}
        {/* ========================================================================= */}
        <header className={`relative z-20 w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4 border-b ${
          isDark ? 'border-white/10 bg-[#071326]/90' : 'border-slate-200/80 bg-white/90'
        } backdrop-blur-md flex-shrink-0`}>
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer" onClick={() => setActiveView('hero')}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl sm:rounded-2xl bg-white dark:bg-white/10 p-1 sm:p-1.5 shadow-md border border-slate-200 dark:border-white/15 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img 
                src="/img/logo-universitas-pelita-bangsa.png" 
                alt="Logo Universitas Pelita Bangsa" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="text-left">
              <span className={`font-black text-sm sm:text-base lg:text-lg tracking-wider uppercase leading-none block ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                PELITA BANGSA<sup className="text-[10px] ml-0.5 text-crimson-600">®</sup>
              </span>
              <p className="text-[10px] sm:text-xs text-slate-400 font-semibold leading-tight hidden sm:block mt-0.5">
                Langkah Nyata Bangun Potensi, Capai Prestasi
              </p>
            </div>
          </div>

          {/* 2-Column Minimalist Nav Menu with Comfortable Typography */}
          <div className="hidden md:flex items-center gap-5 lg:gap-7 text-xs sm:text-sm font-bold tracking-wide uppercase">
            <div className="flex items-center gap-3.5 lg:gap-5">
              <button 
                onClick={() => setActiveView('hero')} 
                className={`transition py-1 ${activeView === 'hero' ? 'text-crimson-600 underline underline-offset-8 font-black' : (isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950')}`}
              >
                BERANDA
              </button>
              <button 
                onClick={() => setActiveView('faculties')} 
                className={`transition py-1 ${activeView === 'faculties' ? 'text-crimson-600 underline underline-offset-8 font-black' : (isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950')}`}
              >
                FAKULTAS & PRODI
              </button>
              <button 
                onClick={() => setActiveView('programs')} 
                className={`transition py-1 ${activeView === 'programs' ? 'text-crimson-600 underline underline-offset-8 font-black' : (isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950')}`}
              >
                3 PROGRAM KELAS
              </button>
            </div>

            <div className="w-px h-4 bg-slate-300 dark:bg-white/20"></div>

            <div className="flex items-center gap-3.5 lg:gap-5">
              <button 
                onClick={() => setActiveModal('biaya')} 
                className={`transition py-1 ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'}`}
              >
                BIAYA KULIAH
              </button>
              <button 
                onClick={() => setActiveModal('alur')} 
                className={`transition py-1 ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'}`}
              >
                ALUR PENDAFTARAN
              </button>
              <button 
                onClick={() => setActiveModal('keunggulan')} 
                className={`transition py-1 ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'}`}
              >
                KEUNGGULAN UPB
              </button>
            </div>
          </div>

          {/* Right Action: Language Badge, Theme Toggle & SIBARA Direct Registration */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Entrepreneur Campus Badge Trigger */}
            <button
              onClick={() => setActiveModal('keunggulan')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition ${
                isDark ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-crimson-500" />
              <span>KAMPUS ENTREPRENEUR</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition border ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-amber-400' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              }`}
              title={isDark ? "Mode Terang" : "Mode Gelap"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>



            {/* Direct SIBARA Registration CTA */}
            <a
              href="https://sibara.pelitabangsa.ac.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 sm:px-4.5 py-1.5 sm:py-2 bg-crimson-600 hover:bg-crimson-500 text-white font-black text-xs sm:text-sm rounded-full shadow-md transition transform active:scale-95 flex items-center gap-1.5 uppercase tracking-wide"
            >
              <span>MULAI DAFTAR</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </header>

        {/* ========================================================================= */}
        {/* 2. DYNAMIC MAIN BODY */}
        {/* ========================================================================= */}
        
        {/* ------------------------------------------------------------------------- */}
        {/* VIEW 1: HERO MAIN BANNER (Polished Margins, Paddings & Flow) */}
        {/* ------------------------------------------------------------------------- */}
        {activeView === 'hero' && (
          <div className="relative flex-1 flex flex-col justify-between overflow-y-auto sm:overflow-hidden animate-fadeIn min-h-0">
            
            {/* Real Campus Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/img/upb-bg2.JPG" 
                alt="Universitas Pelita Bangsa" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35"></div>
            </div>

            {/* Center Stage: Bold Condensed Headline & Harmonious Spacing */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-5 sm:px-10 lg:px-14 py-4 sm:py-6">
              <div className="max-w-4xl space-y-2.5 sm:space-y-3.5 text-left">
                
                {/* Badges Row */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-crimson-600 text-white shadow-lg">
                    PENERIMAAN MAHASISWA BARU (PMB)
                  </span>
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider bg-black/60 px-2.5 py-1 rounded-full border border-white/20">
                    DIKTISAINTEK BERDAMPAK
                  </span>
                </div>

                {/* Hero Huge Heading */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-[0.95] drop-shadow-2xl font-sans">
                  UNIVERSITAS <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
                    PELITA BANGSA
                  </span>
                </h1>

                {/* Subtitle Description */}
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-100 max-w-3xl leading-relaxed drop-shadow font-medium">
                  <strong>Kuliah Sambil Kerja, Tetap Produktif dan Berprestasi.</strong> Kampus Berbasis Entrepreneur dengan 4 Fakultas Unggulan (FEB, FT, FIKT, FH) dan 3 Pilihan Program Kelas (Reguler Pagi, Reguler Malam, Reguler Akhir Pekan).
                </p>

                {/* Quick Points List from Brochure */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 pt-1 text-xs sm:text-sm text-slate-100 font-semibold max-w-3xl">
                  <div className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-4 h-4 text-crimson-500 flex-shrink-0" /> Pendidikan Berkualitas</div>
                  <div className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-4 h-4 text-crimson-500 flex-shrink-0" /> Biaya Mulai 350rb/bln</div>
                  <div className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-4 h-4 text-crimson-500 flex-shrink-0" /> Dosen Profesional & Praktisi</div>
                  <div className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-4 h-4 text-crimson-500 flex-shrink-0" /> Kampus Entrepreneur</div>
                </div>

                {/* Mobile-Only CTA Button - Placed Directly Below Text on Mobile */}
                <div className="pt-2.5 sm:hidden">
                  <a
                    href="https://sibara.pelitabangsa.ac.id/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between gap-3 px-5 py-3 w-full max-w-xs bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_8px_25px_rgba(245,158,11,0.55)] border-2 border-yellow-100 ring-4 ring-yellow-400/30 active:scale-95 transition-all"
                  >
                    <span className="drop-shadow-sm font-black tracking-wider">MULAI DAFTAR PMB</span>
                    <div className="w-6 h-6 rounded-xl bg-slate-950 text-yellow-400 flex items-center justify-center shadow-md flex-shrink-0">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </a>
                </div>

              </div>
            </div>

            {/* Desktop-Only Inverted Cut-Out Curved CTA Button (Bottom Right of Hero) */}
            <div className="hidden sm:block absolute sm:bottom-16 md:bottom-18 lg:bottom-20 sm:right-6 md:right-8 lg:right-12 z-30">
              <a
                href="https://sibara.pelitabangsa.ac.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 sm:gap-4 sm:px-7 sm:py-3.5 md:px-9 md:py-4.5 lg:px-12 lg:py-5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 hover:from-yellow-300 hover:to-amber-400 font-black sm:text-sm md:text-base lg:text-lg uppercase tracking-wider rounded-2xl sm:rounded-3xl md:rounded-[28px] shadow-[0_10px_35px_rgba(245,158,11,0.55)] hover:shadow-[0_15px_45px_rgba(245,158,11,0.8)] border-2 sm:border-3 border-yellow-100/90 transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-105 active:scale-95 group ring-4 ring-yellow-400/30"
              >
                <span className="drop-shadow-sm whitespace-nowrap">MULAI DAFTAR</span>
                <div className="sm:w-7 sm:h-7 md:w-9 md:h-9 rounded-xl sm:rounded-2xl bg-slate-950 text-yellow-400 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-black transition-all flex-shrink-0">
                  <ArrowRight className="sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </div>

            {/* Bottom 3-Column Metric Stat Strip with Perfect Padding */}
            <div className={`relative z-10 w-full grid grid-cols-1 sm:grid-cols-3 border-t ${
              isDark ? 'bg-[#071326] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            } px-5 sm:px-8 lg:px-14 py-2.5 sm:py-3.5 gap-3 sm:gap-5 flex-shrink-0`}>
              
              <div className="flex items-center gap-3 sm:border-r border-slate-300 dark:border-white/10 pr-3 cursor-pointer" onClick={() => setActiveModal('biaya')}>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-crimson-600 font-mono">Rp 350K</div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider">SPP BULANAN MULAI</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Cicilan bulanan tanpa bunga</p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:border-r border-slate-300 dark:border-white/10 pr-3 cursor-pointer" onClick={() => setActiveView('faculties')}>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-blue-600 font-mono">4 FAKULTAS</div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider">FEB • FT • FIKT • FH</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Jenjang D3, S1, dan S2 Pascasarjana</p>
                </div>
              </div>

              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveModal('keunggulan')}>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-600 font-mono">ENTREPRENEUR</div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider">KAMPUS ENTREPRENEUR</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Membangun potensi, capai prestasi</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* VIEW 2: 4 FAKULTAS & PRODI RESMI */}
        {/* ------------------------------------------------------------------------- */}
        {activeView === 'faculties' && (
          <div className="relative flex-1 flex flex-col justify-between p-5 sm:p-7 lg:p-10 overflow-y-auto animate-fadeIn text-left min-h-0">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3.5 border-b border-slate-300 dark:border-white/10 flex-shrink-0">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-crimson-600">PROGRAM STUDI RESMI UPB</span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight">FAKULTAS DAN PROGRAM STUDI</h2>
              </div>
              <a
                href="https://sibara.pelitabangsa.ac.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-bold text-crimson-600 hover:underline uppercase flex items-center gap-1"
              >
                <span>Daftar di SIBARA</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* 4 Fakultas Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-5 my-auto py-3.5">
              {facultiesData.map((fac) => (
                <div 
                  key={fac.id}
                  className={`p-4 lg:p-5 rounded-3xl border shadow-xl flex flex-col justify-between space-y-3 ${
                    isDark ? 'bg-[#0b1d3a] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="space-y-2.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black uppercase text-white ${fac.color}`}>
                      {fac.code}
                    </span>
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-tight">{fac.name}</h3>

                    <ul className="space-y-1 pt-1.5 border-t border-slate-200 dark:border-white/10">
                      {fac.prodis.map((prodi, idx) => (
                        <li key={idx} className="text-xs sm:text-sm flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                          <span className="text-crimson-600 font-bold">•</span>
                          <span>{prodi}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200 dark:border-white/10 text-xs">
                    <span className="text-slate-400 block mb-0.5">Estimasi SPP Bulanan:</span>
                    <span className="font-bold font-mono text-crimson-600 dark:text-crimson-400">Pagi: {fac.spp.pagi} | Malam: {fac.spp.malam}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2.5 flex flex-col sm:flex-row items-center justify-between border-t border-slate-300 dark:border-white/10 text-xs gap-2 flex-shrink-0">
              <span className="text-slate-500">Lulus SMA/SMK/MA dari semua jurusan dapat mendaftar ke seluruh program studi.</span>
              <button onClick={() => setActiveModal('biaya')} className="font-bold text-blue-600 hover:underline">
                Lihat Tabel Biaya Lengkap →
              </button>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* VIEW 3: 3 PROGRAM KELAS */}
        {/* ------------------------------------------------------------------------- */}
        {activeView === 'programs' && (
          <div className="relative flex-1 flex flex-col justify-between p-5 sm:p-7 lg:p-10 overflow-y-auto animate-fadeIn text-left min-h-0">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3.5 border-b border-slate-300 dark:border-white/10 flex-shrink-0">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-crimson-600">JADWAL KULIAH FLEKSIBEL</span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight">TERSEDIA 3 PROGRAM KELAS</h2>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-500">Kuliah Sambil Kerja, Tetap Produktif dan Berprestasi</span>
            </div>

            {/* 3 Program Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 my-auto py-3.5">
              {programs.map((item, idx) => (
                <div 
                  key={idx}
                  className={`rounded-3xl p-4 sm:p-5 border shadow-xl flex flex-col justify-between ${
                    item.isHighlight 
                      ? 'bg-amber-400 text-slate-950 border-amber-500 ring-2 ring-amber-400' 
                      : (isDark ? 'bg-[#0b1d3a] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900')
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xl sm:text-2xl font-black font-mono">{item.num}</span>
                      <span className={`text-[11px] sm:text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        item.isHighlight ? 'bg-black text-white' : 'bg-crimson-600 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    </div>

                    <div className="h-32 sm:h-36 rounded-2xl overflow-hidden shadow-inner">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-black uppercase">{item.title}</h3>
                      <p className={`text-xs mt-1 leading-relaxed ${item.isHighlight ? 'text-slate-900' : 'text-slate-500 dark:text-slate-300'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold font-mono">{item.spp}</span>
                    <a 
                      href="https://sibara.pelitabangsa.ac.id/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`p-2 rounded-xl transition ${item.isHighlight ? 'bg-black text-white' : 'bg-crimson-600 text-white'}`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2.5 flex flex-col sm:flex-row items-center justify-between border-t border-slate-300 dark:border-white/10 text-xs gap-2 flex-shrink-0">
              <span className="text-slate-500">*SPP untuk Kampus Bekasi Kota: Reguler Malam & Weekend Rp 500.000 - Rp 600.000/bln.</span>
              <button onClick={() => setActiveModal('syarat')} className="font-bold text-crimson-600 hover:underline">
                Syarat Pendaftaran →
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. MODALS RESMI (Clean, Responsive & Well-Padded) */}
      {/* ========================================================================= */}

      {/* A. BIAYA KULIAH D3 DAN S1 MODAL */}
      {activeModal === 'biaya' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-5 sm:p-7 space-y-4 max-h-[88vh] overflow-y-auto text-slate-900 border border-slate-200 text-left">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl">
              <X className="w-5 h-5" />
            </button>
            
            <div className="space-y-1">
              <span className="text-xs font-bold text-crimson-600 uppercase tracking-widest">Informasi Keuangan Resmi</span>
              <h3 className="text-lg sm:text-xl font-black uppercase">BIAYA KULIAH D3 DAN S1 UPB</h3>
            </div>

            {/* Header Biaya Masuk */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-center">
                <span className="text-xs font-bold text-blue-900 uppercase">Biaya Pendaftaran</span>
                <p className="text-lg sm:text-xl font-black text-blue-950 mt-0.5">Rp 500.000,-</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                <span className="text-xs font-bold text-amber-900 uppercase">Biaya Awal Masuk</span>
                <p className="text-lg sm:text-xl font-black text-amber-950 mt-0.5">Rp 1.250.000,-</p>
              </div>
            </div>

            {/* Tabel Rincian SPP Bulanan */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs sm:text-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#0c2242] text-white">
                  <tr>
                    <th className="p-2.5 sm:p-3">Fakultas</th>
                    <th className="p-2.5 sm:p-3">Reguler Pagi</th>
                    <th className="p-2.5 sm:p-3">Reguler Malam</th>
                    <th className="p-2.5 sm:p-3">Reguler Weekend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 sm:p-3 font-bold">1. FEB (Ekonomi & Bisnis)</td>
                    <td className="p-2.5 sm:p-3">Rp 350.000/bln</td>
                    <td className="p-2.5 sm:p-3 font-semibold">Rp 550.000/bln*</td>
                    <td className="p-2.5 sm:p-3 font-semibold">Rp 650.000/bln*</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 sm:p-3 font-bold">2. FT (Teknik)</td>
                    <td className="p-2.5 sm:p-3">Rp 400.000/bln</td>
                    <td className="p-2.5 sm:p-3 font-semibold">Rp 650.000/bln*</td>
                    <td className="p-2.5 sm:p-3 font-semibold">Rp 700.000/bln*</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 sm:p-3 font-bold">3. FIKT (Keguruan & Tarbiyah)</td>
                    <td className="p-2.5 sm:p-3">Rp 350.000/bln</td>
                    <td className="p-2.5 sm:p-3 font-semibold">Rp 550.000/bln*</td>
                    <td className="p-2.5 sm:p-3 font-semibold">Rp 650.000/bln*</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 sm:p-3 font-bold">4. FH (Hukum)</td>
                    <td className="p-2.5 sm:p-3">Rp 350.000/bln</td>
                    <td className="p-2.5 sm:p-3 font-semibold">Rp 550.000/bln*</td>
                    <td className="p-2.5 sm:p-3 font-semibold">Rp 650.000/bln*</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Komponen Biaya Lainnya Sesuai Brosur */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200"><span className="text-slate-500 block text-[11px]">Biaya UTS:</span><span className="font-bold">Rp 75.000 / Matkul</span></div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200"><span className="text-slate-500 block text-[11px]">Biaya UAS:</span><span className="font-bold">Rp 75.000 / Matkul</span></div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200"><span className="text-slate-500 block text-[11px]">Her-Registrasi:</span><span className="font-bold">Rp 500K - 750K/Smt</span></div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200"><span className="text-slate-500 block text-[11px]">Lab & Perpus:</span><span className="font-bold">Rp 250.000 (1x)</span></div>
            </div>

            <p className="text-xs text-slate-500 leading-normal">
              *) Khusus SPP Kampus Bekasi Kota: Reguler Malam Rp 500.000/bln & Reguler Akhir Pekan Rp 500.000/bln.
            </p>

            <a
              href="https://sibara.pelitabangsa.ac.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block py-3 bg-crimson-600 hover:bg-crimson-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-md text-center uppercase tracking-wider"
            >
              MULAI DAFTAR DI SIBARA UPB
            </a>
          </div>
        </div>
      )}

      {/* B. ALUR PENDAFTARAN MODAL (10 Langkah Sesuai Brosur Halaman 2) */}
      {activeModal === 'alur' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-5 sm:p-7 space-y-4 max-h-[88vh] overflow-y-auto text-slate-900 border border-slate-200 text-left">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-crimson-600 uppercase tracking-widest">Panduan Admisi</span>
              <h3 className="text-lg sm:text-xl font-black uppercase">ALUR PENDAFTARAN PMB UPB</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
              {[
                { step: '1', title: 'Menentukan Jalur Pendaftaran', desc: 'Pilih Reguler Pagi, Reguler Malam, atau Akhir Pekan.' },
                { step: '2', title: 'Input Data Formulir', desc: 'Buka portal resmi s.id/universitaspelitabangsa / SIBARA.' },
                { step: '3', title: 'Pembayaran Formulir', desc: 'Lakukan pembayaran biaya pendaftaran Rp 500.000.' },
                { step: '4', title: 'Login Sistem PMB', desc: 'Masuk dengan akun yang didaftarkan.' },
                { step: '5', title: 'Input Biodata Pendaftar', desc: 'Lengkapi data diri dan riwayat pendidikan.' },
                { step: '6', title: 'Upload Berkas Pendaftar', desc: 'Unggah KTP, KK, Ijazah/SKHUN, dan Pas Foto.' },
                { step: '7', title: 'Finalisasi Data Pendaftaran', desc: 'Periksa kembali kelengkapan seluruh data.' },
                { step: '8', title: 'Proses Seleksi Pendaftaran', desc: 'Verifikasi berkas oleh panitia admisi.' },
                { step: '9', title: 'Pengumuman Kelulusan', desc: 'Cek status kelulusan di portal PMB.' },
                { step: '10', title: 'Daftar Ulang & Kumpul Berkas', desc: 'Pembayaran daftar ulang & serahkan berkas ke TU.' },
              ].map((s) => (
                <div key={s.step} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-crimson-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900">{s.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://sibara.pelitabangsa.ac.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block py-3 bg-[#0c2242] hover:bg-[#071326] text-white font-black text-xs sm:text-sm rounded-xl shadow-md text-center uppercase tracking-wider"
            >
              Mulai Pendaftaran Online SIBARA
            </a>
          </div>
        </div>
      )}

      {/* C. SYARAT PENDAFTARAN MODAL (Sesuai Brosur Halaman 2) */}
      {activeModal === 'syarat' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-5 sm:p-7 space-y-4 max-h-[88vh] overflow-y-auto text-slate-900 border border-slate-200 text-left">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-crimson-600 uppercase tracking-widest">Persyaratan Berkas</span>
              <h3 className="text-lg sm:text-xl font-black uppercase">SYARAT PENDAFTARAN MAHASISWA BARU</h3>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Lulus SMA & SMK/Sederajat dari Semua Jurusan</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Mengisi Formulir Pendaftaran Online (SIBARA)</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Fotokopi Legalisir Ijazah SMA/SMK/Sederajat (2 Lembar)</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Fotokopi Legalisir SKHUN/Transkrip Nilai SMA/SMK (2 Lembar)</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Fotokopi KTP & Kartu Keluarga (KK) (2 Lembar)</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Pas Foto Berwarna 2x3, 3x4, 4x6 (Masing-masing 2 Lembar):
                <div className="text-xs text-slate-500 pl-6 mt-1 space-y-0.5">
                  <p>• Background Kuning: FEB, FH, FIKT</p>
                  <p>• Background Biru: FT (Fakultas Teknik)</p>
                </div>
              </li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /> Bagi Mahasiswa Pindahan/Konversi: Fotokopi Legalisir Transkrip Nilai & Surat Keterangan Kuliah dari PT Asal + Print Riwayat PDDikti</li>
            </ul>

            <a
              href="https://sibara.pelitabangsa.ac.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block py-3 bg-crimson-600 hover:bg-crimson-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-md text-center uppercase tracking-wider"
            >
              MULAI DAFTAR DI SIBARA UPB
            </a>
          </div>
        </div>
      )}

      {/* D. KEUNGGULAN UPB (KENAPA HARUS UPB?) MODAL (Sesuai Brosur Halaman 1) */}
      {activeModal === 'keunggulan' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-5 sm:p-7 space-y-4 max-h-[88vh] overflow-y-auto text-slate-900 border border-slate-200 text-left">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-crimson-600 uppercase tracking-widest">Keunggulan Kampus</span>
              <h3 className="text-lg sm:text-xl font-black uppercase">KENAPA HARUS UNIVERSITAS PELITA BANGSA?</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {keunggulanUPB.map((item, idx) => (
                <div key={idx} className="p-3 sm:p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs sm:text-sm flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-crimson-600/15 text-crimson-600 flex items-center justify-center font-black flex-shrink-0 mt-0.5 text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs sm:text-sm border-t border-slate-200">
              <span className="text-slate-500 font-medium">Diktisaintek Berdampak • Akreditasi BAN-PT</span>
              <a
                href="https://sibara.pelitabangsa.ac.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-crimson-600 hover:bg-crimson-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-md uppercase tracking-wider text-center"
              >
                MULAI DAFTAR SEKARANG
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
