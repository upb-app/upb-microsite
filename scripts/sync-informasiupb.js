import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAihSxnEjSQR04I4m92NoO-o5DJYj8FYUA",
  authDomain: "upb-microsite.firebaseapp.com",
  projectId: "upb-microsite",
  storageBucket: "upb-microsite.firebasestorage.app",
  messagingSenderId: "952053384507",
  appId: "1:952053384507:web:f1164a1fc956cb4bb4a31e",
  measurementId: "G-8XL8G9PP9N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const payload = {
  id: "site-informasiupb",
  title: "UNIVERSITAS PELITA BANGSA",
  slug: "informasiupb",
  category: "Pusat Admisi",
  status: "Active",
  updatedAt: new Date().toISOString(),
  publishedAt: new Date().toISOString(),
  cloudSyncStatus: "live",
  data: {
    profile: {
      universityName: "UNIVERSITAS PELITA BANGSA",
      departmentName: "",
      tagline: "",
      bio: "",
      avatarUrl: "/img/logo-universitas-pelita-bangsa.png",
      headerBannerUrl: "/img/upb-bg2.JPG",
      showBanner: true,
      isVerified: true,
      badgeText: "",
      location: "",
      email: "",
      title: "UNIVERSITAS PELITA BANGSA"
    },
    theme: {
      bgType: "gradient",
      bgColor: "#071326",
      bgGradient: "from-[#040914] via-[#071326] to-[#0c2242]",
      bgImageUrl: "/img/upb-bg2.JPG",
      bgOverlayOpacity: 75,
      bgBlur: "sm",
      textColor: "#ffffff",
      accentColor: "#f59e0b",
      fontFamily: "sans",
      cardStyle: "glass",
    },
    buttonStyle: {
      variant: "glass",
      rounded: "rounded-xl",
      animation: "anim-hover-scale",
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
        title: "Website Pendaftaran Online PMB UPB",
        subtitle: "Penerimaan Mahasiswa Baru (PMB) 2026/2027",
        url: "https://sibara.pelitabangsa.ac.id",
        icon: "UserPlus",
        animation: "anim-hover-scale",
        badge: "SIBARA.PELITABANGSA.AC.ID",
        badgeColor: "bg-amber-500 text-slate-950 font-bold",
        highlight: true,
        customBgColor: "#1d4ed8",
        customGradient: "",
        customBorderColor: "#f59e0b",
        customTextColor: "#ffffff",
        customIconBg: "rgba(0, 0, 0, 0.25)",
        customIconBorder: "rgba(255, 255, 255, 0.2)",
        clicks: 0,
        isActive: true
      },
      {
        id: "link-2",
        title: "Alur Pendaftaran Mahasiswa Baru",
        subtitle: "Download File Lampiran Alur Pendaftaran PMB UP...",
        url: "https://pelitabangsa.ac.id",
        icon: "Info",
        animation: "anim-hover-scale",
        badge: "PDF",
        badgeColor: "bg-emerald-500 text-white font-bold",
        highlight: false,
        customColor: "",
        clicks: 0,
        isActive: true
      },
      {
        id: "link-3",
        title: "Brosur Universitas Pelita Bangsa Tahun 2026",
        subtitle: "Download File Lampiran Brosur PMB UPB 2026",
        url: "https://pelitabangsa.ac.id",
        icon: "Download",
        animation: "anim-hover-scale",
        badge: "PDF",
        badgeColor: "bg-emerald-500 text-white font-bold",
        highlight: false,
        customColor: "",
        clicks: 0,
        isActive: true
      },
      {
        id: "link-4",
        title: "Grup WhatsApp PMB UPB 2026",
        subtitle: "",
        url: "https://chat.whatsapp.com/",
        icon: "MessageSquare",
        animation: "anim-hover-scale",
        badge: "WA GRUP PMB UPB 2026",
        badgeColor: "bg-emerald-500 text-slate-950 font-bold",
        highlight: false,
        customColor: "",
        clicks: 0,
        isActive: true
      },
      {
        id: "link-5",
        title: "CALL CENTER UPB 2026",
        subtitle: "Layanan informasi & bantuan mahasiswa",
        url: "https://wa.me/6281944283488",
        icon: "Phone",
        animation: "anim-hover-scale",
        badge: "",
        highlight: false,
        customColor: "",
        clicks: 0,
        isActive: true
      }
    ],
    socials: {
      instagram: "https://instagram.com/kampuspelitabangsa",
      youtube: "https://youtube.com/@UNIVERSITASPELITABANGSAOFFICIAL",
      tiktok: "https://tiktok.com/@upb_official",
      linkedin: "https://linkedin.com/school/universitas-pelita-bangsa",
      whatsapp: "https://wa.me/6281944283488",
      twitter: "https://x.com/upb_official",
      facebook: "https://facebook.com/UniversitasPelitaBangsa",
      website: "https://pelitabangsa.ac.id",
      telegram: "",
      spotify: "",
      position: "bottom"
    }
  }
};

async function sync() {
  console.log("Saving to published_microsites/informasiupb...");
  await setDoc(doc(db, 'published_microsites', 'informasiupb'), payload, { merge: true });
  await setDoc(doc(db, 'microsites_registry', payload.id), {
    id: payload.id,
    slug: 'informasiupb',
    title: payload.title,
    updatedAt: new Date().toISOString()
  }, { merge: true });
  console.log("Successfully published informasiupb to Cloud Firestore!");
  process.exit(0);
}

sync().catch(err => {
  console.error("Error publishing to Cloud Firestore:", err);
  process.exit(1);
});
