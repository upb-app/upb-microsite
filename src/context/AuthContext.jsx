import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  checkRateLimit, 
  recordFailedLogin, 
  resetRateLimit, 
  logAuditEvent, 
  sanitizeInput, 
  validatePasswordStrength,
  hashPassword
} from '../utils/security';
import { auth, isFirebaseConfigured } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';

const USERS_STORAGE_KEY = 'upb_auth_users_db_v2';
const SESSION_STORAGE_KEY = 'upb_current_auth_session';

// Default initial Superadmin and demo admin accounts
const DEFAULT_USERS = [
  {
    id: 'user-superadmin-01',
    name: 'Super Administrator UPB',
    email: 'superadmin@pelitabangsa.ac.id',
    password: 'PasswordSuper123!',
    role: 'superadmin',
    department: 'Direktorat Sistem Informasi & Humas',
    status: 'active',
    createdAt: '2026-01-15T08:00:00.000Z',
    lastLogin: '2026-09-02T10:00:00.000Z'
  },
  {
    id: 'user-admisi-02',
    name: 'Admin Admisi & PMB',
    email: 'admin.pmb@pelitabangsa.ac.id',
    password: 'PasswordPMB2026!',
    role: 'admin_pmb',
    department: 'Pusat Penerimaan Mahasiswa Baru',
    status: 'active',
    createdAt: '2026-02-01T09:30:00.000Z',
    lastLogin: '2026-09-01T14:20:00.000Z'
  },
  {
    id: 'user-fastikom-03',
    name: 'Editor FASTIKOM',
    email: 'editor.fastikom@pelitabangsa.ac.id',
    password: 'PasswordFastikom2026!',
    role: 'admin_fakultas',
    department: 'Fakultas Teknik & Ilmu Komputer',
    status: 'active',
    createdAt: '2026-02-10T11:15:00.000Z',
    lastLogin: '2026-08-30T16:45:00.000Z'
  }
];

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
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_USERS;
  });

  // Save users DB
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {}
  }, [users]);

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
   * Login method dengan Brute-Force Rate Limiting dan Audit Trail
   */
  const login = async (email, password) => {
    const cleanEmail = sanitizeInput(email).toLowerCase();
    
    // 1. Cek Rate Limiting (Maks 5 percobaan)
    const rateCheck = checkRateLimit(cleanEmail);
    if (!rateCheck.isAllowed) {
      logAuditEvent('LOGIN_BLOCKED_RATE_LIMIT', `Email: ${cleanEmail}`, cleanEmail);
      throw new Error(rateCheck.message);
    }

    // 2. Coba Firebase Auth jika Firebase telah dikonfigurasi penuh
    if (isFirebaseConfigured()) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        resetRateLimit(cleanEmail);
        
        const userProfile = {
          id: userCredential.user.uid,
          name: userCredential.user.displayName || 'Administrator Firebase',
          email: userCredential.user.email,
          role: 'superadmin',
          status: 'active'
        };

        setCurrentUser(userProfile);
        logAuditEvent('LOGIN_SUCCESS_FIREBASE', `Firebase Auth UID: ${userCredential.user.uid}`, cleanEmail);
        return { success: true, user: userProfile };
      } catch (fbError) {
        console.error('Firebase Auth Error Code:', fbError.code, fbError.message);
        
        let errorMessage = 'Gagal login via Firebase: ' + fbError.message;
        if (fbError.code === 'auth/unauthorized-domain') {
          errorMessage = 'Domain ini belum diizinkan di Firebase! Masuk ke Firebase Console -> Authentication -> Settings -> Authorized Domains, lalu tambahkan domain ini.';
        } else if (fbError.code === 'auth/user-not-found') {
          errorMessage = 'Email belum terdaftar di Firebase Authentication.';
        } else if (fbError.code === 'auth/wrong-password' || fbError.code === 'auth/invalid-credential') {
          errorMessage = 'Password salah. Pastikan password sesuai dengan yang dibuat di Firebase Console.';
        } else if (fbError.code === 'auth/invalid-email') {
          errorMessage = 'Format email tidak valid.';
        } else if (fbError.code === 'auth/too-many-requests') {
          errorMessage = 'Terlalu banyak percobaan gagal di Firebase. Akun diblokir sementara.';
        } else if (fbError.code === 'auth/invalid-api-key' || fbError.code === 'auth/api-key-not-valid') {
          errorMessage = 'API Key Firebase tidak valid. Periksa kembali VITE_FIREBASE_API_KEY di Vercel.';
        } else if (fbError.code === 'auth/user-disabled') {
          errorMessage = 'Akun ini telah dinonaktifkan di Firebase Console.';
        }

        recordFailedLogin(cleanEmail);
        logAuditEvent('LOGIN_FAILED_FIREBASE', `${fbError.code}: ${fbError.message}`, cleanEmail);
        throw new Error(errorMessage);
      }
    }

    // 3. Fallback / Built-in Cryptographic Verification
    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      recordFailedLogin(cleanEmail);
      logAuditEvent('LOGIN_FAILED_USER_NOT_FOUND', `Email tidak terdaftar: ${cleanEmail}`, cleanEmail);
      throw new Error('Email atau password yang Anda masukkan salah.');
    }

    if (foundUser.status === 'suspended') {
      logAuditEvent('LOGIN_BLOCKED_SUSPENDED', `Akun dinonaktifkan: ${cleanEmail}`, cleanEmail);
      throw new Error('Akun ini telah dinonaktifkan oleh Superadmin. Hubungi DSI UPB.');
    }

    const hashedInput = await hashPassword(password);
    const isPasswordMatch = (foundUser.password === password) || (foundUser.password === hashedInput);

    if (!isPasswordMatch) {
      const failInfo = recordFailedLogin(cleanEmail);
      logAuditEvent('LOGIN_FAILED_WRONG_PASSWORD', `Password salah (Percobaan ke-${failInfo.attempts})`, cleanEmail);
      
      if (failInfo.isLocked) {
        throw new Error('Terlalu banyak percobaan salah! Akun dikunci sementara selama 60 detik.');
      }
      throw new Error(`Email atau password yang Anda masukkan salah. (Sisa kesempatan: ${5 - failInfo.attempts})`);
    }

    // Login Berhasil
    resetRateLimit(cleanEmail);
    const updatedUser = {
      ...foundUser,
      lastLogin: new Date().toISOString()
    };

    // Update lastLogin di DB
    setUsers(prev => prev.map(u => u.id === foundUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    logAuditEvent('LOGIN_SUCCESS', `Login berhasil sebagai role: ${updatedUser.role}`, cleanEmail);

    return { success: true, user: updatedUser };
  };

  /**
   * Logout
   */
  const logout = async () => {
    if (currentUser) {
      logAuditEvent('LOGOUT', `User ${currentUser.email} telah logout`, currentUser.email);
    }
    if (isFirebaseConfigured()) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {}
    }
    setCurrentUser(null);
  };

  /**
   * Superadmin: Menambahkan user baru
   */
  const addNewUser = async ({ name, email, password, role, department }) => {
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

    const newUser = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'editor',
      department: cleanDept,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    setUsers(prev => [newUser, ...prev]);
    logAuditEvent('USER_CREATED', `Superadmin membuat akun baru: ${cleanEmail} (${newUser.role})`, currentUser.email);

    return newUser;
  };

  /**
   * Superadmin: Toggle Status User (Active / Suspended)
   */
  const toggleUserStatus = (userId) => {
    if (!currentUser || currentUser.role !== 'superadmin') {
      throw new Error('Hanya Superadmin yang bisa mengubah status user.');
    }

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) throw new Error('User tidak ditemukan.');

    if (targetUser.id === currentUser.id) {
      throw new Error('Tidak dapat menonaktifkan akun sendiri.');
    }

    const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));

    logAuditEvent(
      'USER_STATUS_CHANGED', 
      `Status user ${targetUser.email} diubah menjadi: ${newStatus}`, 
      currentUser.email
    );
  };

  /**
   * Superadmin: Reset Password User
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
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: hashedPassword } : u));
    
    const target = users.find(u => u.id === userId);
    logAuditEvent('USER_PASSWORD_RESET', `Password user ${target?.email} direset oleh Superadmin`, currentUser.email);
  };

  /**
   * Superadmin: Hapus User
   */
  const deleteUser = (userId) => {
    if (!currentUser || currentUser.role !== 'superadmin') {
      throw new Error('Hanya Superadmin yang bisa menghapus user.');
    }

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) throw new Error('User tidak ditemukan.');

    if (targetUser.id === currentUser.id) {
      throw new Error('Tidak dapat menghapus akun Anda sendiri.');
    }

    setUsers(prev => prev.filter(u => u.id !== userId));
    logAuditEvent('USER_DELETED', `User ${targetUser.email} dihapus permanen`, currentUser.email);
  };

  const isSuperadmin = currentUser?.role === 'superadmin';

  const value = {
    currentUser,
    isSuperadmin,
    users,
    login,
    logout,
    addNewUser,
    toggleUserStatus,
    resetUserPassword,
    deleteUser
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
