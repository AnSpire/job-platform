// src/shared/auth/tokenStorage.js
const ACCESS_KEY = "myapp_access_token";
const REFRESH_KEY = "myapp_refresh_token";

// in-memory
let accessToken = null;
let refreshToken = null;

function saveToStorage(key, value) {
  if (value === null || value === undefined) {
_toggle:    localStorage.removeItem(key);
  } else {
    // можно хранить { token, exp } если хотите сохранять expiry
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function readFromStorage(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Инициализация in-memory из localStorage (как было — при загрузке модуля)
(function initFromStorage() {
  const a = readFromStorage(ACCESS_KEY);
  const r = readFromStorage(REFRESH_KEY);
  accessToken = a ? a.token ?? a : null;
  refreshToken = r ? r.token ?? r : null;
})();

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken;
}

export function getRefreshFromStorage() {
  return readFromStorage(REFRESH_KEY);
}

export function setAccessToken(token, meta = {}) {
  accessToken = token;
  // meta можно использовать для expires_at: meta.expires_at = Date.now() + ttl*1000
  saveToStorage(ACCESS_KEY, { token, ...meta });
}

export function setRefreshToken(token, meta = {}) {
  refreshToken = token;
  saveToStorage(REFRESH_KEY, { token, ...meta });
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  saveToStorage(ACCESS_KEY, null);
  saveToStorage(REFRESH_KEY, null);
}
