import React, { useEffect, useRef } from 'react';
import { X, Download, QrCode, Sparkles, Check, Copy } from 'lucide-react';
import QRCode from 'qrcode';

export default function QrCodeModal({ isOpen, onClose, data }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  const micrositeUrl = window.location.href.split('#')[0];

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, micrositeUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: '#0F2C59',
          light: '#FFFFFF',
        }
      }, (err) => {
        if (err) console.error(err);
      });
    }
  }, [isOpen, micrositeUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `QR-UPB-${data.profile.universityName.replace(/\s+/g, '_')}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(micrositeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6 text-center space-y-5">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center mb-3">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-100">QR Code Microsite Resmi</h3>
          <p className="text-xs text-slate-400 mt-1">{data.profile.universityName}</p>
        </div>

        {/* QR Canvas Box */}
        <div className="p-4 bg-white rounded-2xl inline-block shadow-xl border-4 border-amber-500/30">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>

        <p className="text-[11px] text-slate-400">
          Scan QR Code ini menggunakan kamera smartphone untuk membuka microsite kampus.
        </p>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
          >
            <Download className="w-4 h-4" />
            Download QR Code (PNG)
          </button>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Tautan Disalin!' : 'Salin Tautan'}
          </button>
        </div>

      </div>
    </div>
  );
}
