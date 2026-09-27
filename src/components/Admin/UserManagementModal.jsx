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
  RefreshCw,
  Edit3,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Globe,
  Clock,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

const ROLE_OPTIONS = [
  { 
    id: 'superadmin', 
    label: 'Super Administrator', 
    desc: 'Hak akses penuh, kelola seluruh user, sistem & semua microsite', 
    color: 'bg-blue-600/20 text-blue-300 border-blue-600/40',
    badgeBg: 'bg-blue-600 text-white'
  },
  { 
    id: 'admin_pmb', 
    label: 'Admin Admisi & PMB', 
    desc: 'Kelola informasi pendaftaran mahasiswa, brosur & admisi', 
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    badgeBg: 'bg-amber-600 text-white'
  },
  { 
    id: 'admin_fakultas', 
    label: 'Admin Fakultas / Prodi', 
    desc: 'Kelola informasi fakultas, prodi, dan kegiatan akademik', 
    color: 'bg-indigo-600/20 text-indigo-300 border-indigo-600/40',
    badgeBg: 'bg-indigo-600 text-white'
  },
  { 
    id: 'editor', 
    label: 'Content Editor', 
    desc: 'Edit tautan & konten microsite yang ditugaskan', 
    color: 'bg-emerald-600/20 text-emerald-300 border-emerald-600/40',
    badgeBg: 'bg-emerald-600 text-white'
  },
];

export default function UserManagementModal({ isOpen, onClose }) {
  const { 
    currentUser, 
    isSuperadmin, 
    users, 
    auditLogs,
    isLoadingUsers,
    addNewUser, 
    editUser,
    toggleUserStatus, 
    resetUserPassword, 
    deleteUser,
    handleSyncUsers
  } = useAuth();

  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form Tambah User
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newRole, setNewRole] = useState('admin_fakultas');
  const [newDepartment, setNewDepartment] = useState('');
  const [newAssignedSlugs, setNewAssignedSlugs] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Sub-modal: Edit User
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editRole, setEditRole] = useState('editor');
  const [editAssignedSlugs, setEditAssignedSlugs] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  // Sub-modal: Reset Password
  const [resettingUser, setResettingUser] = useState(null);
  const [newResetPassword, setNewResetPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  // Audit Logs search
  const [auditSearch, setAuditSearch] = useState('');

  if (!isOpen) return null;

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync dari Cloud Firestore
  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const count = await handleSyncUsers();
      showToast(`Berhasil menyinkronkan ${count || users.length} pengguna dari Cloud Firestore.`);
    } catch (err) {
      showToast(`Gagal menyinkronkan: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isSuperadmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
        <div className="w-full max-w-md bg-gradient-to-b from-[#0b1d3a] to-[#040b17] border border-white/15 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Akses Ditolak</h3>
          <p className="text-xs text-slate-300">
            Hanya akun dengan hak akses <strong>Super Administrator</strong> yang dapat mengelola pengguna dan hak akses sistem.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  // Handle Tambah User Baru
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIsSubmittingNew(true);

    try {
      const parsedSlugs = newAssignedSlugs
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);

      await addNewUser({
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
        department: newDepartment,
        assignedSlugs: parsedSlugs
      });

      confetti({ particleCount: 50, spread: 60 });
      setFormSuccess(`Akun untuk ${newEmail} berhasil didaftarkan ke Cloud Firestore!`);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewDepartment('');
      setNewAssignedSlugs('');
      showToast(`Pengguna ${newEmail} berhasil dibuat!`);

      setTimeout(() => {
        setActiveTab('list');
        setFormSuccess('');
      }, 1200);
    } catch (err) {
      setFormError(err.message || 'Gagal membuat pengguna.');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  // Open Edit User Modal
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name || '');
    setEditDepartment(user.department || '');
    setEditRole(user.role || 'editor');
    setEditAssignedSlugs(Array.isArray(user.assignedSlugs) ? user.assignedSlugs.join(', ') : '');
    setEditError('');
  };

  // Submit Edit User
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSavingEdit(true);
    setEditError('');

    try {
      const parsedSlugs = editAssignedSlugs
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);

      await editUser(editingUser.id, {
        name: editName,
        department: editDepartment,
        role: editRole,
        assignedSlugs: parsedSlugs
      });

      showToast(`Data akun ${editingUser.email} berhasil diperbarui di Cloud.`);
      setEditingUser(null);
    } catch (err) {
      setEditError(err.message || 'Gagal menyimpan perubahan user.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handle Toggle Active/Suspend Status
  const handleToggleStatus = async (user) => {
    setActionLoadingId(user.id);
    try {
      await toggleUserStatus(user.id);
      const nextStatus = user.status === 'active' ? 'dinonaktifkan (suspend)' : 'diaktifkan';
      showToast(`Akun ${user.email} berhasil ${nextStatus}.`);
    } catch (err) {
      showToast(`Gagal mengubah status: ${err.message}`, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Open Reset Password
  const handleOpenReset = (user) => {
    setResettingUser(user);
    setNewResetPassword('');
    setResetMessage('');
    setResetError('');
  };

  // Submit Reset Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resettingUser) return;
    setIsResetting(true);
    setResetError('');
    setResetMessage('');

    try {
      await resetUserPassword(resettingUser.id, newResetPassword);
      setResetMessage('Password baru berhasil disimpan di Cloud Firestore!');
      showToast(`Password untuk ${resettingUser.email} berhasil direset.`);
      setTimeout(() => {
        setResettingUser(null);
        setNewResetPassword('');
        setResetMessage('');
      }, 1200);
    } catch (err) {
      setResetError(err.message || 'Gagal mereset password.');
    } finally {
      setIsResetting(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Hapus permanen akun ${user.email} (${user.name})?\n\nTindakan ini akan menghapus akses secara permanen dari Cloud Firestore.`)) {
      return;
    }

    setActionLoadingId(user.id);
    try {
      await deleteUser(user.id);
      showToast(`Akun ${user.email} telah dihapus permanen.`);
    } catch (err) {
      showToast(`Gagal menghapus user: ${err.message}`, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'active' ? u.status === 'active' :
      statusFilter === 'suspended' ? u.status === 'suspended' : true;

    return matchesSearch && matchesStatus;
  });

  // Filter Audit Logs
  const filteredAuditLogs = (auditLogs || []).filter(log => {
    if (!auditSearch) return true;
    const query = auditSearch.toLowerCase();
    return (
      log.action?.toLowerCase().includes(query) ||
      log.details?.toLowerCase().includes(query) ||
      log.user?.toLowerCase().includes(query) ||
      log.ip?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/85 backdrop-blur-md animate-fadeIn">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-70 px-4 py-3 rounded-2xl border shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-slideDown ${
          toastMessage.type === 'error' 
            ? 'bg-red-950/90 text-red-200 border-red-500/50 shadow-red-900/30' 
            : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-emerald-900/30'
        }`}>
          {toastMessage.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#0b1d3a] via-[#071326] to-[#040b17] border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-navy-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-600/30 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Manajemen Pengguna & Hak Akses
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-600 text-white rounded-full">
                  Superadmin
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Cloud Live
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Kelola akun administrator unit kampus secara permanen di database Cloud Firestore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sync Cloud Button */}
            <button
              onClick={handleManualSync}
              disabled={isSyncing || isLoadingUsers}
              className="p-2 sm:px-3 sm:py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition"
              title="Sinkronkan data dari Cloud Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isSyncing || isLoadingUsers ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Cloud'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#040b17] p-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar Pengguna ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Log Audit Keamanan ({auditLogs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {/* ======================================================== */}
          {/* 1. DAFTAR USER TAB                                       */}
          {/* ======================================================== */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-2.5 justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama, email, prodi, atau role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#040b17] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-[#040b17] p-1 border border-white/15 rounded-xl self-start">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg transition ${
                      statusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Semua ({users.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('active')}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg transition ${
                      statusFilter === 'active' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Aktif ({users.filter(u => u.status === 'active').length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('suspended')}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg transition ${
                      statusFilter === 'suspended' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Suspend ({users.filter(u => u.status === 'suspended').length})
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {isLoadingUsers && users.length === 0 && (
                <div className="py-12 text-center text-slate-400 space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-400" />
                  <p className="text-xs">Mengambil data pengguna dari Cloud Firestore...</p>
                </div>
              )}

              {/* Empty Search Result */}
              {!isLoadingUsers && filteredUsers.length === 0 && (
                <div className="py-12 text-center text-slate-400 space-y-2 bg-[#040b17] rounded-2xl border border-white/10 p-6">
                  <Users className="w-8 h-8 mx-auto text-slate-500" />
                  <p className="text-xs font-bold text-white">Tidak ada pengguna yang cocok</p>
                  <p className="text-[11px] text-slate-400">Coba ubah kata kunci pencarian atau filter status Anda.</p>
                </div>
              )}

              {/* Users List Grid */}
              <div className="space-y-3">
                {filteredUsers.map((user) => {
                  const roleConfig = ROLE_OPTIONS.find(r => r.id === user.role) || ROLE_OPTIONS[3];
                  const isCurrent = user.id === currentUser?.id;
                  const isActive = user.status === 'active';
                  const isActionLoading = actionLoadingId === user.id;

                  const formattedLastLogin = user.lastLogin 
                    ? new Date(user.lastLogin).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Belum pernah login';

                  return (
                    <div
                      key={user.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#0b1d3a] to-[#071326] border-white/15 hover:border-white/30 shadow-lg'
                          : 'bg-[#040b17] border-red-500/20 opacity-75'
                      }`}
                    >
                      {/* Left info */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md ${
                          user.role === 'superadmin' 
                            ? 'bg-blue-600/30 border-blue-500/50 text-blue-300' 
                            : 'bg-navy-950 border-white/15 text-white'
                        }`}>
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                              {user.name}
                            </h4>
                            {isCurrent && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                                Akun Anda
                              </span>
                            )}
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${roleConfig.color}`}>
                              {roleConfig.label}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                              {isActive ? 'Aktif' : 'Suspended'}
                            </span>
                          </div>

                          <p className="text-xs text-blue-300 font-mono">{user.email}</p>

                          <div className="flex items-center gap-4 flex-wrap text-[11px] text-slate-300 pt-0.5">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              {user.department || 'Universitas Pelita Bangsa'}
                            </span>
                            
                            <span className="flex items-center gap-1 text-slate-400">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              Login: {formattedLastLogin}
                            </span>

                            {Array.isArray(user.assignedSlugs) && user.assignedSlugs.length > 0 && (
                              <span className="flex items-center gap-1 text-slate-300">
                                <Globe className="w-3.5 h-3.5 text-blue-400" />
                                {user.assignedSlugs.includes('*') ? 'Semua Microsite (*)' : user.assignedSlugs.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10 justify-end">
                        
                        {/* Edit User Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(user)}
                          disabled={isActionLoading}
                          className="px-2.5 py-1.5 bg-[#040b17] hover:bg-white/10 text-white text-xs font-semibold rounded-xl border border-white/15 flex items-center gap-1 transition"
                          title="Edit Informasi User"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        {/* Reset Password Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenReset(user)}
                          disabled={isActionLoading}
                          className="px-2.5 py-1.5 bg-[#040b17] hover:bg-white/10 text-white text-xs font-semibold rounded-xl border border-white/15 flex items-center gap-1 transition"
                          title="Reset Kata Sandi Akun"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                          <span className="hidden sm:inline">Reset Pass</span>
                        </button>

                        {/* Suspend / Activate Button */}
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            disabled={isActionLoading}
                            className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1 transition disabled:opacity-50 ${
                              isActive 
                                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30' 
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}
                            title={isActive ? 'Nonaktifkan Akun Pengguna' : 'Aktifkan Kembali Akun'}
                          >
                            {isActionLoading ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Power className="w-3.5 h-3.5" />
                            )}
                            <span className="hidden sm:inline">{isActive ? 'Suspend' : 'Aktifkan'}</span>
                          </button>
                        )}

                        {/* Delete User Permanently */}
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            disabled={isActionLoading}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition border border-transparent hover:border-red-500/30 disabled:opacity-50"
                            title="Hapus Akun Pengguna Secara Permanen"
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

          {/* ======================================================== */}
          {/* 2. TAMBAH USER BARU TAB                                  */}
          {/* ======================================================== */}
          {activeTab === 'add' && (
            <form onSubmit={handleCreateUser} className="space-y-4 max-w-xl mx-auto">
              
              <div className="bg-[#040b17] p-4 rounded-2xl border border-white/15 space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-400" />
                  Form Pendaftaran Administrator Baru
                </h4>
                <p className="text-[11px] text-slate-300">
                  Akun yang dibuat akan langsung tersimpan secara permanen dengan hashing SHA-256 di database Cloud Firestore.
                </p>
              </div>

              {formSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs text-emerald-300 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center gap-2 text-xs text-red-300 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">Nama Lengkap Administrator</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Dr. Ir. H. Ahmad, M.Kom."
                    className="w-full px-3 py-2.5 bg-[#040b17] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
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
                    className="w-full px-3 py-2.5 bg-[#040b17] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">Password Awal (Min 8 Karakter)</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="PasswordKuat2026!"
                      className="w-full pl-3 pr-10 py-2.5 bg-[#040b17] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">Unit Kerja / Fakultas / Biro</label>
                  <input
                    type="text"
                    required
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="Contoh: Fakultas Teknik & Ilmu Komputer"
                    className="w-full px-3 py-2.5 bg-[#040b17] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Hak Akses Microsite */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-200">
                  Slug Microsite yang Ditugaskan (Opsional, pisahkan koma)
                </label>
                <input
                  type="text"
                  value={newAssignedSlugs}
                  onChange={(e) => setNewAssignedSlugs(e.target.value)}
                  placeholder="Contoh: informasiupb, pmb-utama, fakultas-teknik (Kosongkan jika semua)"
                  className="w-full px-3 py-2.5 bg-[#040b17] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-semibold text-slate-200">Pilih Role & Tingkat Kewenangan</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ROLE_OPTIONS.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setNewRole(role.id)}
                      className={`p-3 rounded-2xl border text-left transition ${
                        newRole === role.id
                          ? 'border-blue-500 bg-blue-600/20 ring-1 ring-blue-500 shadow-md'
                          : 'border-white/10 bg-[#040b17] hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{role.label}</span>
                        {newRole === role.id && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">{role.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingNew}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
              >
                {isSubmittingNew ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menyimpan ke Cloud Firestore...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Daftarkan & Simpan Administrator Baru</span>
                  </>
                )}
              </button>

            </form>
          )}

          {/* ======================================================== */}
          {/* 3. AUDIT LOGS TAB                                        */}
          {/* ======================================================== */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              
              <div className="bg-[#040b17] p-4 rounded-2xl border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    Catatan Forensik Keamanan (Audit Trails)
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Setiap aktivitas login, pendaftaran user, reset password, dan perubahan hak akses tercatat permanen di Cloud Firestore.
                  </p>
                </div>
                <span className="text-xs font-mono text-blue-300 bg-blue-600/20 px-3 py-1 rounded-full border border-blue-600/30 self-start sm:self-auto">
                  {auditLogs.length} Events Tercatat
                </span>
              </div>

              {/* Search Audit Logs */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter aktivitas berdasarkan aksi, user, detail, atau IP..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#040b17] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Logs List */}
              <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                {filteredAuditLogs.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 bg-[#040b17] rounded-2xl border border-white/10 p-6">
                    <History className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                    <p className="text-xs font-bold text-white">Belum ada log audit yang cocok</p>
                  </div>
                ) : (
                  filteredAuditLogs.map((log) => {
                    const isSuccess = log.action.includes('SUCCESS') || log.action.includes('CREATED');
                    const isDanger = log.action.includes('FAILED') || log.action.includes('DELETED') || log.action.includes('BLOCKED');

                    return (
                      <div 
                        key={log.id} 
                        className="p-3.5 bg-gradient-to-r from-[#0b1d3a] to-[#071326] rounded-2xl border border-white/10 text-xs space-y-1.5 hover:border-white/20 transition"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                            isSuccess 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                              : isDanger 
                              ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }`}>
                            {log.action}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(log.timestamp).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </span>
                        </div>

                        <p className="text-slate-200 text-xs leading-relaxed">{log.details}</p>

                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-1 border-t border-white/5 flex-wrap">
                          <span className="text-blue-300">Aktor: {log.user}</span>
                          <span>•</span>
                          <span>IP: {log.ip || '182.22.10.173'}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* SUB-MODAL: EDIT USER                                     */}
        {/* ======================================================== */}
        {editingUser && (
          <div className="fixed inset-0 z-60 bg-navy-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-gradient-to-b from-[#0b1d3a] to-[#071326] border border-white/20 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-400" />
                  Edit Akun: {editingUser.email}
                </h4>
                <button 
                  onClick={() => setEditingUser(null)} 
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {editError && (
                <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-200">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#040b17] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-200">Unit Kerja / Fakultas</label>
                  <input
                    type="text"
                    required
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-[#040b17] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-200">Hak Akses Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-3 py-2 bg-[#040b17] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {ROLE_OPTIONS.map(r => (
                      <option key={r.id} value={r.id} className="bg-navy-900 text-white">
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-200">Assigned Slugs (Pisahkan koma)</label>
                  <input
                    type="text"
                    value={editAssignedSlugs}
                    onChange={(e) => setEditAssignedSlugs(e.target.value)}
                    placeholder="informasiupb, pmb-utama"
                    className="w-full px-3 py-2 bg-[#040b17] border border-white/20 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    {isSavingEdit ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <span>Simpan Perubahan</span>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-MODAL: RESET PASSWORD                                */}
        {/* ======================================================== */}
        {resettingUser && (
          <div className="fixed inset-0 z-60 bg-navy-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-gradient-to-b from-[#0b1d3a] to-[#071326] border border-white/20 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-blue-400" />
                  Reset Password User
                </h4>
                <button 
                  onClick={() => setResettingUser(null)} 
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-300">
                Mereset password untuk akun: <strong className="text-white font-mono">{resettingUser.email}</strong>
              </div>

              {resetMessage && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>{resetMessage}</span>
                </div>
              )}

              {resetError && (
                <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-200">Password Baru</label>
                  <div className="relative">
                    <input
                      type={showResetPassword ? 'text' : 'password'}
                      required
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      placeholder="Min 8 karakter, huruf & angka"
                      className="w-full pl-3 pr-10 py-2 bg-[#040b17] border border-white/20 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResettingUser(null)}
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    {isResetting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <span>Simpan Password</span>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
