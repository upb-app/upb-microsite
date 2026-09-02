import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  FileCode, 
  FileJson, 
  Check, 
  Copy, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ExportModal({ isOpen, onClose, data, onImportData }) {
  const [activeTab, setActiveTab] = useState('export'); // 'export', 'import', 'html'
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `microsite-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result);
          if (parsed.profile && parsed.links) {
            onImportData(parsed);
            confetti({ particleCount: 60 });
            onClose();
          } else {
            setImportError('Format JSON tidak valid: Harus memiliki data profile dan links.');
          }
        } catch (err) {
          setImportError('Gagal membaca file JSON: Format tidak sesuai.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportText = () => {
    try {
      setImportError('');
      const parsed = JSON.parse(importJsonText);
      if (parsed.profile && parsed.links) {
        onImportData(parsed);
        confetti({ particleCount: 60 });
        onClose();
      } else {
        setImportError('Format JSON tidak valid: Harus memiliki data profile dan links.');
      }
    } catch (err) {
      setImportError('Sintaks JSON tidak valid. Pastikan format teks JSON benar.');
    }
  };

  const handleDownloadStandaloneHtml = () => {
    // Generate Standalone HTML with inline CSS and Tailwind CDN
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.profile.universityName} - ${data.profile.departmentName || 'Microsite'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    @keyframes pulseSubtle { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
    .anim-pulse { animation: pulseSubtle 2.2s infinite ease-in-out; }
    .anim-float { animation: float 3s infinite ease-in-out; }
    .anim-hover-scale { transition: all 0.25s ease; }
    .anim-hover-scale:hover { transform: translateY(-3px) scale(1.015); }
    .glass-card { background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); }
  </style>
</head>
<body class="bg-slate-950 text-white min-h-screen flex items-center justify-center p-3 sm:p-6 selection:bg-amber-500 selection:text-slate-950">
  <div class="relative w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 pb-8">
    ${data.profile.showBanner ? `
    <div class="relative w-full h-36 overflow-hidden bg-slate-800">
      <img src="${data.profile.headerBannerUrl}" class="w-full h-full object-cover" alt="Banner">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
    </div>` : ''}
    
    <div class="px-5 text-center ${data.profile.showBanner ? '-mt-12' : 'pt-6'}">
      <div class="inline-block relative mb-3">
        <div class="w-24 h-24 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-amber-500 to-blue-500 shadow-xl">
          <img src="${data.profile.avatarUrl}" class="w-full h-full object-cover rounded-xl" alt="Avatar">
        </div>
      </div>

      ${data.profile.badgeText ? `
      <div class="mb-2">
        <span class="inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          ${data.profile.badgeText}
        </span>
      </div>` : ''}

      <h1 class="text-lg font-bold uppercase tracking-tight text-white">${data.profile.universityName}</h1>
      <h2 class="text-xs font-semibold text-amber-400 mt-0.5">${data.profile.departmentName || ''}</h2>
      ${data.profile.tagline ? `<p class="text-[12px] italic text-slate-300 mt-1">"${data.profile.tagline}"</p>` : ''}
      ${data.profile.bio ? `<p class="text-xs text-slate-300/80 mt-2 leading-relaxed">${data.profile.bio}</p>` : ''}
    </div>

    <!-- Links List -->
    <div class="px-4 mt-5 space-y-3">
      ${data.links.map(link => `
        <a href="${link.url}" target="_blank" class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 transition shadow-md ${link.animation || 'anim-hover-scale'} ${link.highlight ? 'ring-2 ring-amber-400/80' : ''}">
          <div class="text-left min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-white">${link.title}</span>
              ${link.badge ? `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full ${link.badgeColor || 'bg-amber-500 text-slate-950'}">${link.badge}</span>` : ''}
            </div>
            ${link.subtitle ? `<p class="text-xs text-slate-400 mt-0.5 line-clamp-1">${link.subtitle}</p>` : ''}
          </div>
          <span class="text-slate-400 text-xs font-bold ml-2">➔</span>
        </a>
      `).join('')}
    </div>

    <div class="mt-6 pt-4 text-center px-4 border-t border-slate-800 text-[11px] text-slate-500">
      © ${new Date().getFullYear()} ${data.profile.universityName} • UPB Microsite
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `index.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <FileCode className="w-4 h-4" />
            </span>
            Ekspor & Impor Konfigurasi Microsite
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'export' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ekspor JSON
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'import' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Impor JSON
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'html' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ekspor Single HTML
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {activeTab === 'export' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Simpan seluruh konfigurasi tombol, warna, dan tautan sebagai file JSON untuk backup atau berbagi antar pengelola:
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  rows={8}
                  value={jsonString}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 focus:outline-none select-all"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadJson}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
                >
                  <Download className="w-4 h-4" />
                  Unduh File .JSON
                </button>
                <button
                  onClick={handleCopyJson}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Tersalin' : 'Salin JSON'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Unggah file backup .JSON atau tempel kode konfigurasi di bawah untuk memulihkan microsite:
              </p>

              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-2xl cursor-pointer bg-slate-950/40 transition">
                <Upload className="w-6 h-6 text-amber-400 mb-1" />
                <span className="text-xs font-semibold text-slate-200">Pilih File JSON dari Komputer</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Format .json</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Atau Tempel Kode JSON:</label>
                <textarea
                  rows={5}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder='{"profile": { ... }, "links": [ ... ]}'
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {importError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <button
                onClick={handleImportText}
                disabled={!importJsonText.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
              >
                Terapkan Konfigurasi JSON
              </button>
            </div>
          )}

          {activeTab === 'html' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Ekspor Siap Hosting (Single-File HTML)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fitur ini akan menghasilkan file <code className="text-amber-300">index.html</code> mandiri yang siap di-upload ke server cPanel universitas, GitHub Pages, Netlify, atau Vercel tanpa perlu setup backend.
                </p>
              </div>

              <button
                onClick={handleDownloadStandaloneHtml}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
              >
                <Download className="w-4 h-4" />
                Unduh index.html (Siap Host)
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
