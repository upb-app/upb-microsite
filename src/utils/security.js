/**
 * Security & Sanitization Utilities
 * Proteksi terhadap XSS, Injection, Brute-Force Rate Limiting, Password Hashing, dan Audit Logging
 */

const RATE_LIMIT_STORAGE_KEY = 'upb_auth_rate_limit';
const AUDIT_LOGS_STORAGE_KEY = 'upb_security_audit_logs';
const PASSWORD_SALT = 'UPB_MICROSITE_SECURE_SALT_2026_';

/**
 * Hash Password Menggunakan SHA-256 Web Crypto API
 * Menghindari penyimpanan password dalam bentuk plain-text
 */
export async function hashPassword(plainPassword) {
  if (!plainPassword) return '';
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(PASSWORD_SALT + plainPassword);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback simple hash for older environments
    let hash = 0;
    for (let i = 0; i < plainPassword.length; i++) {
      hash = (hash << 5) - hash + plainPassword.charCodeAt(i);
      hash |= 0;
    }
    return `hashed_${Math.abs(hash)}`;
  }
}

/**
 * Sanitasi string input untuk mencegah Cross-Site Scripting (XSS)
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validasi dan sanitasi URL untuk mencegah javascript: URI injection
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  
  // Deteksi scheme berbahaya
  const dangerousSchemes = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = trimmed.toLowerCase();
  
  for (const scheme of dangerousSchemes) {
    if (lowerUrl.startsWith(scheme)) {
      console.warn(`[Security Alert] Dangerous URL scheme blocked: ${scheme}`);
      return '#blocked-insecure-url';
    }
  }

  // Izinkan http, https, mailto, tel, dan relative path
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  ) {
    return trimmed;
  }

  // Default tambahkan https jika user menginput domain tanpa protocol
  if (trimmed.includes('.') && !trimmed.includes('://')) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

/**
 * Validasi kekuatan password untuk pembuatan user baru
 */
export function validatePasswordStrength(password) {
  if (!password || password.length < 8) {
    return { isValid: false, message: 'Password minimal 8 karakter.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password harus mengandung minimal satu huruf kapital (A-Z).' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password harus mengandung minimal satu angka (0-9).' };
  }
  return { isValid: true, message: 'Password kuat.' };
}

/**
 * Mekanisme Brute-Force Rate Limiting pada Login
 * Maksimal 5 percobaan gagal berturut-turut, setelah itu akun terkunci selama 60 detik
 */
export function checkRateLimit(identifier = 'global_login') {
  try {
    const raw = localStorage.getItem(`${RATE_LIMIT_STORAGE_KEY}_${identifier}`);
    const data = raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: 0 };
    const now = Date.now();

    if (data.lockedUntil > now) {
      const remainingSeconds = Math.ceil((data.lockedUntil - now) / 1000);
      return {
        isAllowed: false,
        remainingSeconds,
        message: `Terlalu banyak percobaan login gagal. Silakan coba lagi dalam ${remainingSeconds} detik demi keamanan.`
      };
    }

    return { isAllowed: true, attempts: data.attempts };
  } catch (e) {
    return { isAllowed: true, attempts: 0 };
  }
}

export function recordFailedLogin(identifier = 'global_login') {
  try {
    const raw = localStorage.getItem(`${RATE_LIMIT_STORAGE_KEY}_${identifier}`);
    const data = raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: 0 };
    const attempts = data.attempts + 1;
    let lockedUntil = 0;

    if (attempts >= 5) {
      lockedUntil = Date.now() + 60 * 1000; // Lockout 60 detik
    }

    localStorage.setItem(
      `${RATE_LIMIT_STORAGE_KEY}_${identifier}`,
      JSON.stringify({ attempts, lockedUntil })
    );

    return { attempts, isLocked: attempts >= 5 };
  } catch (e) {
    return { attempts: 1, isLocked: false };
  }
}

export function resetRateLimit(identifier = 'global_login') {
  try {
    localStorage.removeItem(`${RATE_LIMIT_STORAGE_KEY}_${identifier}`);
  } catch (e) {}
}

/**
 * Catat Security Audit Log
 */
export function logAuditEvent(action, details, userEmail = 'System') {
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
    const logs = raw ? JSON.parse(raw) : [];

    const newLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      user: userEmail,
      userAgent: navigator.userAgent.substring(0, 80),
      ip: '182.22.10.173'
    };

    const updated = [newLog, ...logs].slice(0, 100);
    localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(updated));
    return newLog;
  } catch (e) {
    console.error('Failed to log audit event', e);
  }
}

export function getAuditLogs() {
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
