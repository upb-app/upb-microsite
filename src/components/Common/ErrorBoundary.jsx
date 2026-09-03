import React from 'react';
import { RotateCcw, AlertTriangle, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UPB Studio Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.removeItem('upb_multi_microsites_list_v2');
      localStorage.removeItem('upb_active_microsite_id_v2');
      localStorage.removeItem('upb_realtime_analytics_data_v2');
      localStorage.removeItem('upb_realtime_activity_logs_v2');
    } catch (e) {}
    window.location.href = '/s/dasbor';
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#040914] text-white flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-[#071326] border border-white/20 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight">Memulihkan Sesi Dasbor</h2>
              <p className="text-xs text-slate-400 mt-1">
                Terdeteksi data cache lama browser yang perlu disinkronkan ulang.
              </p>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-left overflow-x-auto max-h-24 text-[11px] font-mono text-red-300">
              {this.state.error?.message || 'Unknown runtime state'}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={this.handleGoHome}
                className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/15 transition flex items-center justify-center gap-1.5"
              >
                <Home className="w-4 h-4" />
                <span>Beranda</span>
              </button>

              <button
                onClick={this.handleReset}
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Pulihkan Sesi</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
