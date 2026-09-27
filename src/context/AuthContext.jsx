import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  checkRateLimit, 
  recordFailedLogin, 
  resetRateLimit, 
  sanitizeInput, 
  validatePasswordStrength,
  hashPassword
} from '../utils/security';
import { 
  fetchUsersFromCloud, 
  saveUsersToCloud, 
  recordAuditLogToCloud, 
  fetchAuditLogsFromCloud,
  subscribeToUsers,
  DEFAULT_USERS,
  USERS_STORAGE_KEY
} from '../services/userService';

const SESSION_STORAGE_KEY = 'upb_current_auth_session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_USERS;
  });

  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Sync users from Cloud Firestore on mount & live subscription
  useEffect(() => {
    let isMounted = true;

    fetchUsersFromCloud().then(cloudUsers => {
      if (isMounted && Array.isArray(cloudUsers) && cloudUsers.length > 0) {
        setUsers(cloudUsers);
        setIsLoadingUsers(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoadingUsers(false);
    });

    fetchAuditLogsFromCloud().then(logs => {
      if (isMounted && Array.isArray(logs)) {
        setAuditLogs(logs);
      }
    }).catch(() => {});

    // Live Snapshot Listener dari Cloud Firestore
    const unsubscribe = subscribeToUsers((updatedList) => {
      if (isMounted && Array.isArray(updatedList) && updatedList.length > 0) {
        setUsers(updatedList);
        setIsLoadingUsers(false);
      }
    });

    // Cross-tab broadcast listener
    let channel;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('upb_users_sync_channel');
        channel.onmessage = (e) => {
          if (e.data?.type === 'USERS_UPDATED' && Array.isArray(e.data.users) && isMounted) {
            setUsers(e.data.users);
          }
        };
      }
    } catch (_e) {}

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
      if (channel) channel.close();
    };
  }, []);

  // Save/remove active session
  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {}
  }, [currentUser]);

  /**
   * Manual refresh user list dari Cloud Firestore
   */
  const handleSyncUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const cloudUsers = await fetchUsersFromCloud();
      if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
        setUsers(cloudUsers);
      }
      const logs = await fetchAuditLogsFromCloud();
      if (Array.isArray(logs)) {
        setAuditLogs(logs);
      }
      return cloudUsers.length;
    } finally {
      setIsLoadingUsers(false);
    }
  };

  /**
   * Login method dengan Verifikasi Database Cloud Firestore & Brute-Force Rate Limiting
   */
  const login = async (email, password) => {
    const cleanEmail = sanitizeInput(email).toLowerCase();
    
    // 1. Cek Rate Limiting (Maks 5 percobaan)
    const rateCheck = checkRateLimit(cleanEmail);
    if (!rateCheck.isAllowed) {
      recordAuditLogToCloud('LOGIN_BLOCKED_RATE_LIMIT', `Email: ${cleanEmail}`, cleanEmail);
      throw new Error(rateCheck.message);
    }

    // 2. Ambil daftar user terkini dari Cloud Firestore jika memungkinkan
    let currentUsersList = users;
    try {
      const liveUsers = await fetchUsersFromCloud();
      if (Array.isArray(liveUsers) && liveUsers.length > 0) {
        currentUsersList = liveUsers;
        setUsers(liveUsers);
      }
    } catch (_e) {}

    // 3. Verifikasi kredensial pengguna
    const foundUser = currentUsersList.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      recordFailedLogin(cleanEmail);
      recordAuditLogToCloud('LOGIN_FAILED_USER_NOT_FOUND', `Email tidak terdaftar: ${cleanEmail}`, cleanEmail);
      throw new Error('Email atau password yang Anda masukkan salah.');
    }

    if (foundUser.status === 'suspended') {
      recordAuditLogToCloud('LOGIN_BLOCKED_SUSPENDED', `Akun dinonaktifkan: ${cleanEmail}`, cleanEmail);
      throw new Error('Akun ini telah dinonaktifkan oleh Superadmin. Hubungi DSI UPB.');
    }

    const hashedInput = await hashPassword(password);
    const isPasswordMatch = (foundUser.password === password) || (foundUser.password === hashedInput);

    if (!isPasswordMatch) {
      const failInfo = recordFailedLogin(cleanEmail);
      recordAuditLogToCloud('LOGIN_FAILED_WRONG_PASSWORD', `Password salah (Percobaan ke-${failInfo.attempts})`, cleanEmail);
      
      if (failInfo.isLocked) {
        throw new Error('Terlalu banyak percobaan salah! Akun dikunci sementara selama 60 detik.');
      }
      throw new Error(`Email atau password yang Anda masukkan salah. (Sisa kesempatan: ${5 - failInfo.attempts})`);
    }

    // Login Berhasil
    resetRateLimit(cleanEmail);
    const nowIso = new Date().toISOString();
    const updatedUser = {
      ...foundUser,
      lastLogin: nowIso
    };

    // Update lastLogin di Cloud Firestore & local state
    const updatedUsersList = currentUsersList.map(u => u.id === foundUser.id ? updatedUser : u);
    setUsers(updatedUsersList);
    saveUsersToCloud(updatedUsersList).catch(() => {});
    
    setCurrentUser(updatedUser);
    recordAuditLogToCloud('LOGIN_SUCCESS', `Login berhasil sebagai role: ${updatedUser.role} (${updatedUser.name})`, cleanEmail);

    return { success: true, user: updatedUser };
  };

  /**
   * Logout
   */
  const logout = async () => {
    if (currentUser) {
      recordAuditLogToCloud('LOGOUT', `User ${currentUser.email} telah logout`, currentUser.email);
    }
    setCurrentUser(null);
  };

  /**
   * Superadmin: Menambahkan user baru secara permanen di Cloud Firestore
   */
  const addNewUser = async ({ name, email, password, role, department, assignedSlugs = [] }) => {
    if (!currentUser || currentUser.role !== 'superadmin') {
      throw new Error('Akses Ditolak: Hanya Superadmin yang memiliki wewenang membuat user baru.');
    }

    const cleanEmail = sanitizeInput(email).toLowerCase();
    const cleanName = sanitizeInput(name);
    const cleanDept = sanitizeInput(department || 'Universitas Pelita Bangsa');

    // Validasi email
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Format email tidak valid.');
    }

    // Cek duplikasi
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('Email tersebut sudah terdaftar di sistem.');
    }

    // Validasi password strength
    const passCheck = validatePasswordStrength(password);
    if (!passCheck.isValid) {
      throw new Error(passCheck.message);
    }

    const hashedPassword = await hashPassword(password);
    const nowIso = new Date().toISOString();

    const newUser = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'editor',
      department: cleanDept,
      assignedSlugs: role === 'superadmin' ? ['*'] : (assignedSlugs || []),
      status: 'active',
      createdAt: nowIso,
      lastLogin: null
    };

    const updatedList = [newUser, ...users];
    setUsers(updatedList);
    await saveUsersToCloud(updatedList);
    await recordAuditLogToCloud('USER_CREATED', `Superadmin membuat akun baru: ${cleanEmail} (${newUser.role} - ${cleanDept})`, currentUser.email);

    return newUser;
  };

  /**
   * Superadmin: Edit info user (Nama, Role, Department, Assigned Slugs)
   */
  const editUser = async (userId, updates) => {
    if (!currentUser || currentUser.role !== 'superadmin') {
      throw new Error('Hanya Superadmin yang bisa mengedit informasi pengguna.');
    }

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) throw new Error('User tidak ditemukan.');

    const modifiedUser = {
      ...targetUser,
      ...updates,
      name: updates.name ? sanitizeInput(updates.name) : targetUser.name,
      department: updates.department ? sanitizeInput(updates.department) : targetUser.department,
      role: updates.role || targetUser.role
    };

    const updatedList = users.map(u => u.id === userId ? modifiedUser : u);
    setUsers(updatedList);
    await saveUsersToCloud(updatedList);
    await recordAuditLogToCloud('USER_UPDATED', `Superadmin mengubah info user: ${targetUser.email}`, currentUser.email);

    return modifiedUser;
  };

  /**
   * Superadmin: Toggle Status User (Active / Suspended) secara permanen di Firestore
   */
  const toggleUserStatus = async (userId) => {
    if (!currentUser || currentUser.role !== 'superadmin') {
      throw new Error('Hanya Superadmin yang bisa mengubah status user.');
    }

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) throw new Error('User tidak ditemukan.');

    if (targetUser.id === currentUser.id) {
      throw new Error('Tidak dapat menonaktifkan akun Anda sendiri.');
    }

    const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';
    const updatedList = users.map(u => u.id === userId ? { ...u, status: newStatus } : u);
    setUsers(updatedList);
    await saveUsersToCloud(updatedList);

    await recordAuditLogToCloud(
      'USER_STATUS_CHANGED', 
      `Status user ${targetUser.email} diubah menjadi: ${newStatus}`, 
      currentUser.email
    );
  };

  /**
   * Superadmin: Reset Password User di Cloud Firestore
   */
  const resetUserPassword = async (userId, newPassword) => {
    if (!currentUser || currentUser.role !== 'superadmin') {
      throw new Error('Hanya Superadmin yang bisa mereset password.');
    }

    const passCheck = validatePasswordStrength(newPassword);
    if (!passCheck.isValid) {
      throw new Error(passCheck.message);
    }

    const hashedPassword = await hashPassword(newPassword);
    const target = users.find(u => u.id === userId);
    if (!target) throw new Error('User tidak ditemukan.');

    const updatedList = users.map(u => u.id === userId ? { ...u, password: hashedPassword } : u);
    setUsers(updatedList);
    await saveUsersToCloud(updatedList);
    
    await recordAuditLogToCloud('USER_PASSWORD_RESET', `Password user ${target.email} direset oleh Superadmin`, currentUser.email);
  };

  /**
   * Superadmin: Hapus User dari Cloud Firestore
   */
  const deleteUser = async (userId) => {
    if (!currentUser || currentUser.role !== 'superadmin') {
      throw new Error('Hanya Superadmin yang bisa menghapus user.');
    }

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) throw new Error('User tidak ditemukan.');

    if (targetUser.id === currentUser.id) {
      throw new Error('Tidak dapat menghapus akun Anda sendiri.');
    }

    const updatedList = users.filter(u => u.id !== userId);
    setUsers(updatedList);
    await saveUsersToCloud(updatedList);
    await recordAuditLogToCloud('USER_DELETED', `User ${targetUser.email} dihapus permanen oleh Superadmin`, currentUser.email);
  };

  const isSuperadmin = currentUser?.role === 'superadmin';

  const value = {
    currentUser,
    isSuperadmin,
    users,
    auditLogs,
    isLoadingUsers,
    login,
    logout,
    addNewUser,
    editUser,
    toggleUserStatus,
    resetUserPassword,
    deleteUser,
    handleSyncUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
