import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Users, 
  ShieldCheck, 
  KeyRound, 
  Trash2, 
  Power, 
  Check, 
  AlertCircle, 
  Search, 
  History,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAuditLogs } from '../../utils/security';
import confetti from 'canvas-confetti';

const ROLE_OPTIONS = [
  { id: 'superadmin', label: 'Super Administrator', desc: 'Hak akses penuh, kelola user & konten', color: 'bg-blue-600/20 text-blue-300 border-blue-600/40' },
  { id: 'admin_pmb', label: 'Admin Admisi & PMB', desc: 'Kelola informasi pendaftaran mahasiswa', color: 'bg-white/10 text-white border-white/20' },
  { id: 'admin_fakultas', label: 'Admin Fakultas / Prodi', desc: 'Kelola informasi fakultas/jurusan', color: 'bg-indigo-600/20 text-indigo-300 border-indigo-600/40' },
  { id: 'editor', label: 'Content Editor', desc: 'Edit tautan & konten tanpa akses user', color: 'bg-emerald-600/20 text-emerald-300 border-emerald-600/40' },
];

export default function UserManagementModal({ isOpen, onClose }) {
  const { 
    currentUser, 
    isSuperadmin, 
    users, 
    addNewUser, 
    toggleUserStatus, 
    resetUserPassword, 
    deleteUser 
  } = useAuth();

  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('admin_fakultas');
  const [newDepartment, setNewDepartment] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  const [resettingUserId, setResettingUserId] = useState(null);
  const [newResetPassword, setNewResetPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  if (!isOpen) return null;

  if (!isSuperadmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
        <div className="w-full max-w-md bg-navy-900 border border-white/15 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Akses Ditolak</h3>
          <p className="text-xs text-slate-300">
            Hanya akun dengan hak akses <strong>Super Administrator</strong> yang dapat mengelola pengguna.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  const handleCreateUser = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      addNewUser({
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
        department: newDepartment
      });

      confetti({ particleCount: 50 });
      setFormSuccess(`Akun untuk ${newEmail} berhasil dibuat!`);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewDepartment('');
      setTimeout(() => {
        setActiveTab('list');
        setFormSuccess('');
      }, 1500);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    try {
      resetUserPassword(resettingUserId, newResetPassword);
      setResetMessage('Password berhasil diperbarui!');
      setTimeout(() => {
        setResettingUserId(null);
        setNewResetPassword('');
        setResetMessage('');
      }, 1200);
    } catch (err) {
      setResetMessage(`Error: ${err.message}`);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const auditLogs = getAuditLogs();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#0b1d3a] via-[#071326] to-[#040b17] border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-navy-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-600/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Manajemen Pengguna & Hak Akses</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-600 text-white rounded-full">
                  Superadmin
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Kelola akun administrator unit kampus dan pantau audit keamanan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#040b17] p-2 gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar User ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'add'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah User Baru</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'audit'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Log Audit Keamanan</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {/* 1. LIST USERS TAB */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, email, prodi, atau role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#040b17] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-3">
                {filteredUsers.map((user) => {
                  const roleConfig = ROLE_OPTIONS.find(r => r.id === user.role) || ROLE_OPTIONS[3];
                  const isCurrent = user.id === currentUser?.id;
                  const isActive = user.status === 'active';

                  return (
                    <div
                      key={user.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#0b1d3a] to-[#071326] border-white/15 hover:border-white/30 shadow-lg'
                          : 'bg-[#040b17] border-white/5 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-navy-950 border border-white/15 flex items-center justify-center font-bold text-white flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
                            {isCurrent && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                                Anda
                              </span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleConfig.color}`}>
                              {roleConfig.label}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              {isActive ? 'Aktif' : 'Dinonaktifkan'}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300 font-mono mt-0.5 truncate">{user.email}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {user.department || 'Universitas Pelita Bangsa'}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                        <button
                          type="button"
                          onClick={() => setResettingUserId(user.id)}
                          className="px-2.5 py-1.5 bg-[#040b17] hover:bg-white/10 text-white text-xs font-medium rounded-xl border border-white/15 flex items-center gap-1 transition"
                          title="Reset Password"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                          <span className="hidden sm:inline">Reset Pass</span>
                        </button>

                        {/* Suspend / Deactivate (Red for Suspended) */}
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(user.id)}
                            className={`px-2.5 py-1.5 text-xs font-medium rounded-xl border flex items-center gap-1 transition ${
                              isActive 
                                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30' 
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}
                            title={isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{isActive ? 'Suspend' : 'Aktifkan'}</span>
                          </button>
                        )}

                        {/* Delete Permanently (Red for Permanent Delete) */}
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Hapus permanen akun ${user.email}? Tindakan ini tidak dapat dibatalkan.`)) {
                                deleteUser(user.id);
                              }
                            }}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition border border-transparent hover:border-red-500/30"
                            title="Hapus Akun Permanen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. ADD USER TAB */}
          {activeTab === 'add' && (
            <form onSubmit={handleCreateUser} className="space-y-4 max-w-xl mx-auto">
              <div className="bg-[#040b17] p-4 rounded-2xl border border-white/15 space-y-1">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-400" />
                  Form Pendaftaran Administrator Baru
                </h4>
                <p className="text-[11px] text-slate-300">
                  Akun yang dibuat akan langsung tersimpan dengan enkripsi sesi aman di database Firebase.
                </p>
              </div>

              {formSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                  <Check className="w-4 h-4" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Budi Santoso, S.Kom."
                    className="w-full px-3 py-2 bg-[#040b17] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">Email Resmi Kampus</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="nama@pelitabangsa.ac.id"
                    className="w-full px-3 py-2 bg-[#040b17] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">Password Awal (Min 8 karakter)</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="PasswordBaru123!"
                    className="w-full px-3 py-2 bg-[#040b17] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">Unit Kerja / Fakultas</label>
                  <input
                    type="text"
                    required
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="Contoh: Fakultas Teknik / BEM UPB"
                    className="w-full px-3 py-2 bg-[#040b17] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="block text-xs font-semibold text-slate-200">Pilih Role & Hak Akses</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ROLE_OPTIONS.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setNewRole(role.id)}
                      className={`p-3 rounded-xl border text-left transition ${
                        newRole === role.id
                          ? 'border-blue-500 bg-blue-600/20 ring-1 ring-blue-500'
                          : 'border-white/10 bg-[#040b17] hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{role.label}</span>
                        {newRole === role.id && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                      <p className="text-[10px] text-slate-300 mt-0.5">{role.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition"
              >
                Simpan & Daftarkan Administrator Baru
              </button>
            </form>
          )}

          {/* 3. AUDIT LOGS TAB */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="bg-[#040b17] p-3.5 rounded-2xl border border-white/15 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Catatan Forensik Keamanan (Audit Trails)</h4>
                  <p className="text-[11px] text-slate-300">Seluruh aktivitas login, pembuatan user, dan perubahan status tercatat permanen.</p>
                </div>
                <span className="text-[10px] font-mono text-blue-300 bg-blue-600/20 px-2.5 py-0.5 rounded-full border border-blue-600/30">
                  {auditLogs.length} Events
                </span>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-gradient-to-r from-[#0b1d3a] to-[#071326] rounded-xl border border-white/10 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white">{log.action}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-slate-200 text-[11px]">{log.details}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-0.5">
                      <span>User: {log.user}</span>
                      <span>•</span>
                      <span>IP: {log.ip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sub-modal: Reset Password */}
        {resettingUserId && (
          <div className="fixed inset-0 z-60 bg-navy-950/90 flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-[#0b1d3a] to-[#071326] border border-white/20 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-blue-400" />
                  Reset Password User
                </h4>
                <button onClick={() => setResettingUserId(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {resetMessage && (
                <p className="text-xs text-white p-2 bg-blue-600/20 border border-blue-600/30 rounded-lg">{resetMessage}</p>
              )}

              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-200">Password Baru</label>
                  <input
                    type="password"
                    required
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                    placeholder="Min 8 karakter, angka & huruf kapital"
                    className="w-full px-3 py-2 bg-[#040b17] border border-white/20 rounded-xl text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Simpan Password Baru
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
