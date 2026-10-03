/**
 * Universal cookie utilities for secure token and user identity management.
 * Stores sensitive authentication tokens and user credentials cleanly and securely.
 */

/**
 * Set a cookie in the browser
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Expiration in days
 */
export const setCookie = (name, value, days = 7) => {
  if (typeof document === 'undefined') return;
  
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  
  // Set with path=/ so cookie is available application-wide
  document.cookie = `${name}=${encodeURIComponent(value || '')}${expires}; path=/; SameSite=Lax${secureFlag}`;
};

/**
 * Retrieve a cookie by name
 * @param {string} name - Cookie name
 * @returns {string|null}
 */
export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      try {
        const val = decodeURIComponent(c.substring(nameEQ.length));
        if (val === 'undefined' || val === 'null') return null;
        return val;
      } catch {
        const raw = c.substring(nameEQ.length);
        if (raw === 'undefined' || raw === 'null') return null;
        return raw;
      }
    }
  }
  return null;
};

/**
 * Remove a cookie by name across all standard paths
 * @param {string} name - Cookie name
 */
export const removeCookie = (name) => {
  if (typeof document === 'undefined') return;
  
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  
  // Set expiration in the past with path=/ and SameSite=Lax
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax${secureFlag}`;
};

// Recognized token keys
export const TOKEN_KEYS = ['access', 'refresh', 'access_token', 'refresh_token', 'token', 'auth-token'];
export const USER_KEYS = ['user_name', 'user_email', 'user_role', 'user_id'];

/**
 * Store access & refresh tokens in cookies and purge from localStorage
 * @param {{ access?: string, refresh?: string }} tokens
 */
export const setAuthTokens = ({ access, refresh }) => {
  if (access) {
    setCookie('access', access, 7);
    setCookie('access_token', access, 7);
  }
  
  if (refresh) {
    setCookie('refresh', refresh, 30);
    setCookie('refresh_token', refresh, 30);
  }

  // Purge sensitive tokens from localStorage to keep storage clean & secure
  if (typeof window !== 'undefined') {
    try {
      TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      console.warn('Could not purge tokens from localStorage:', e);
    }
  }
};

/**
 * Retrieve access token: checks cookies first, with backward-compatibility fallback to localStorage
 * @returns {string|null}
 */
export const getAccessToken = () => {
  // Check cookies first
  const cookieToken = getCookie('access') || getCookie('access_token') || getCookie('token') || getCookie('auth-token');
  if (cookieToken) return cookieToken;

  // Fallback to localStorage if legacy session exists
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('access') || localStorage.getItem('access_token') || localStorage.getItem('token');
      if (stored && stored !== 'undefined' && stored !== 'null') return stored;
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Retrieve refresh token: checks cookies first, with backward-compatibility fallback to localStorage
 * @returns {string|null}
 */
export const getRefreshToken = () => {
  // Check cookies first
  const cookieToken = getCookie('refresh') || getCookie('refresh_token');
  if (cookieToken) return cookieToken;

  // Fallback to localStorage if legacy session exists
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('refresh') || localStorage.getItem('refresh_token');
      if (stored && stored !== 'undefined' && stored !== 'null') return stored;
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Decode JWT token payload safely
 * @param {string} token 
 * @returns {object|null}
 */
export const decodeToken = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Store user identity securely in cookies and localStorage
 * Emits an instant update event across all navigation bars.
 * @param {{ name?: string, email?: string, role?: string, id?: string|number }} user
 */
export const setAuthUser = ({ name, email, role, id }) => {
  if (typeof window === 'undefined') return;

  // Sanitize email
  const cleanEmail = email && email !== 'undefined' && email !== 'null' ? String(email).trim() : '';
  
  // Sanitize name: avoid literal "undefined" or "null"
  let cleanName = name && name !== 'undefined' && name !== 'null' ? String(name).trim() : '';
  if (!cleanName && cleanEmail) {
    cleanName = cleanEmail.split('@')[0];
  }

  const cleanRole = role && role !== 'undefined' && role !== 'null' ? String(role).trim() : '';
  const cleanId = id && id !== 'undefined' && id !== 'null' ? String(id).trim() : '';

  if (cleanName) {
    setCookie('user_name', cleanName, 30);
    try { localStorage.setItem('user_name', cleanName); } catch {}
  }
  if (cleanEmail) {
    setCookie('user_email', cleanEmail, 30);
    try { localStorage.setItem('user_email', cleanEmail); } catch {}
  }
  if (cleanRole) {
    setCookie('user_role', cleanRole, 30);
    try { localStorage.setItem('user_role', cleanRole); } catch {}
  }
  if (cleanId) {
    setCookie('user_id', cleanId, 30);
    try { localStorage.setItem('user_id', cleanId); } catch {}
  }

  // Instant notification to all active components
  try {
    window.dispatchEvent(new CustomEvent('velqino:auth-user-updated', {
      detail: { name: cleanName, email: cleanEmail, role: cleanRole, id: cleanId }
    }));
  } catch {}
};

/**
 * Retrieve user identity (combining cookies, localStorage, and token claims)
 * Guarantees that neither name nor email returns the literal string "undefined".
 * @returns {{ name: string, email: string, role: string, id: string }}
 */
export const getAuthUser = () => {
  let name = getCookie('user_name');
  let email = getCookie('user_email');
  let role = getCookie('user_role');
  let id = getCookie('user_id');

  // Purge corrupt cookies if any exist
  if (name === 'undefined' || name === 'null') {
    removeCookie('user_name');
    name = null;
  }
  if (email === 'undefined' || email === 'null') {
    removeCookie('user_email');
    email = null;
  }
  if (role === 'undefined' || role === 'null') {
    removeCookie('user_role');
    role = null;
  }
  if (id === 'undefined' || id === 'null') {
    removeCookie('user_id');
    id = null;
  }

  if (typeof window !== 'undefined') {
    try {
      const getValidLocal = (key) => {
        const val = localStorage.getItem(key);
        if (val === 'undefined' || val === 'null' || !val) {
          if (val === 'undefined' || val === 'null') {
            try { localStorage.removeItem(key); } catch {}
          }
          return null;
        }
        return val;
      };
      if (!name) name = getValidLocal('user_name');
      if (!email) email = getValidLocal('user_email');
      if (!role) role = getValidLocal('user_role');
      if (!id) id = getValidLocal('user_id');
    } catch {}
  }

  // Attempt decoding token for claims if needed
  if ((!id || !email || !name || !role) && typeof window !== 'undefined') {
    const token = getAccessToken();
    if (token) {
      const payload = decodeToken(token);
      if (payload) {
        if (!id && (payload.user_id || payload.id || payload.sub)) id = String(payload.user_id || payload.id || payload.sub);
        if (!email && (payload.email || payload.user_email)) email = payload.email || payload.user_email;
        if (!role && (payload.role || payload.user_role)) role = payload.role || payload.user_role;
        if (!name && (payload.username || payload.name || payload.business_name)) {
          name = payload.username || payload.name || payload.business_name;
        }
      }
    }
  }

  // Fallback name from email if name is still missing
  if (!name && email) {
    name = email.split('@')[0];
  }

  // Double check literal invalid strings one last time
  if (name === 'undefined' || name === 'null') name = '';
  if (email === 'undefined' || email === 'null') email = '';
  if (role === 'undefined' || role === 'null') role = '';
  if (id === 'undefined' || id === 'null') id = '';

  // Synchronize cleaned identity to persistent cookies if valid
  if (typeof window !== 'undefined' && (name || email)) {
    if (name) setCookie('user_name', name, 30);
    if (email) setCookie('user_email', email, 30);
  }

  return {
    name: name || '',
    email: email || '',
    role: role || '',
    id: id || ''
  };
};

/**
 * Clear all authentication tokens and user identity from cookies and localStorage on logout
 */
export const clearAuthTokens = () => {
  // Clear token & user cookies
  [...TOKEN_KEYS, ...USER_KEYS].forEach((key) => removeCookie(key));

  // Clear from localStorage
  if (typeof window !== 'undefined') {
    try {
      [...TOKEN_KEYS, ...USER_KEYS].forEach((key) => localStorage.removeItem(key));
      localStorage.removeItem('wholesaler_id');
      localStorage.removeItem('wholesaler_pending_orders');
      localStorage.removeItem('wholesaler_customers_count');
      localStorage.removeItem('is_wholesaler_registered');
      localStorage.removeItem('is_retailer_registered');
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    try {
      window.dispatchEvent(new CustomEvent('velqino:auth-user-updated', {
        detail: { name: '', email: '', role: '', id: '' }
      }));
    } catch {}
  }
};
