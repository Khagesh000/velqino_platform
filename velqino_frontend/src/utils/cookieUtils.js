/**
 * Universal cookie utilities for secure token management.
 * Stores sensitive authentication tokens in cookies rather than localStorage.
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
        return decodeURIComponent(c.substring(nameEQ.length));
      } catch {
        return c.substring(nameEQ.length);
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
      return localStorage.getItem('access') || localStorage.getItem('access_token') || localStorage.getItem('token') || null;
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
      return localStorage.getItem('refresh') || localStorage.getItem('refresh_token') || null;
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Clear all authentication tokens from cookies and localStorage on logout
 */
export const clearAuthTokens = () => {
  // Clear cookies
  TOKEN_KEYS.forEach((key) => removeCookie(key));

  // Clear from localStorage
  if (typeof window !== 'undefined') {
    try {
      TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      console.warn('Could not clear tokens from localStorage:', e);
    }
  }
};
