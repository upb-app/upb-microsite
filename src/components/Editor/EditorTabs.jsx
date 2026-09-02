import React from 'react';
import { 
  User, 
  Link2, 
  Palette, 
  Share2, 
  Sparkles, 
  BarChart3
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function EditorTabs({ activeTab, setActiveTab }) {
  const { isDark } = useTheme();

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'links', label: 'Tautan & Tombol', icon: Link2 },
    { id: 'design', label: 'Desain', icon: Palette },
    { id: 'social', label: 'Medsos', icon: Share2 },
    { id: 'presets', label: 'Preset', icon: Sparkles },
    { id: 'analytics', label: 'Analitik', icon: BarChart3 },
  ];

  return (
    <div className={`flex items-center gap-1.5 p-2 border-b overflow-x-auto scrollbar-none sticky top-0 z-20 backdrop-blur-md transition-colors ${
      isDark 
        ? 'bg-[#040914]/90 border-white/10' 
        : 'bg-slate-50/90 border-slate-200'
    }`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-amber-400 text-slate-950 shadow-sm ring-1 ring-amber-500/50'
                : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/70')
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
