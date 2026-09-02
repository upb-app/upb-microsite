import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  KeyRound 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

export default function LoginModal({ isOpen, onClose, onSuccessLogin }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        confetti({ particleCount: 70, spread: 60 });
        if (window.history.pushState) {
          window.history.pushState(null, '', '/dasbor');
        } else {
          window.location.hash = '/dasbor';
        }
        if (onSuccessLogin) {
          onSuccessLogin(result.user);
        } else if (onClose) {
          onClose();
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Gagal login. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#0b1d3a] via-[#071326] to-[#040b17] border border-white/20 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 p-0.5 mx-auto shadow-xl shadow-blue-600/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#071326] rounded-[14px] flex items-center justify-center text-white">
              <Lock className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-white">Login Portal Pengelola</h3>
          </div>
        </div>

        {/* Error Alert (Red for Error) */}
        {errorMessage && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-xs text-red-200 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-200">Email Akun</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@pelitabangsa.ac.id"
                className="w-full pl-10 pr-4 py-2.5 bg-[#040b17] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-200">Kata Sandi (Password)</label>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#040b17] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition transform active:scale-98"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Memverifikasi Akses...
              </span>
            ) : (
              <span>Masuk ke Dashboard Pengelola</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
