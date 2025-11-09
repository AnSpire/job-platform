import axios from "axios";

const ACCESS_KEY = "myapp_access_token";
const REFRESH_KEY = "myapp_refresh_token";

// in-memory
let accessToken = null;
let refreshToken = null;

let isRefreshing = false;
let pendingQueue = [];

function saveToStorage(key, value) {
  if (value === null || value === undefined) {
    localStorage.removeItem(key);
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

// Инициализация переменных при загрузке модуля
(function initFromStorage() {
  const a = readFromStorage(ACCESS_KEY);
  const r = readFromStorage(REFRESH_KEY);
  accessToken = a ? a.token ?? a : null;
  refreshToken = r ? r.token ?? r : null;
})();

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

// API клиент
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, // если refresh в cookie — полезно. Для локального refresh в localStorage можно убрать, но оставить не мешает.
});

// Добавляем access в заголовки
api.interceptors.request.use((config) => {
  // если accessToken существует — ставим его
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Функция обновления — вариант использует /auth/refresh и ожидает JSON с { access, refresh }
async function refreshAccess() {
  // Если на бэке refresh у вас в cookie -> используйте withCredentials:true и url; 
  // Если refresh в localStorage — передаём его в теле/headers (по контракту бэка).
  // Ниже пример, который отправляет refresh в теле, если он у нас в storage,
  // иначе делает POST без тела (чтобы использовать cookie).
  const r = readFromStorage(REFRESH_KEY);
  let resp;
  if (r && r.token) {
    resp = await axios.post("http://localhost:8000/api/v1/auth/refresh", { refresh: r.token }, { withCredentials: true });
  } else {
    resp = await axios.post("http://localhost:8000/api/v1/auth/refresh", null, { withCredentials: true });
  }
  const data = resp.data;
  if (data.access) setAccessToken(data.access);
  if (data.refresh) setRefreshToken(data.refresh);
  return data.access;
}

function processQueue(newAccess) {
  pendingQueue.forEach((resolve) => resolve(newAccess));
  pendingQueue = [];
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;

    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        const newAccess = await new Promise((resolve) => pendingQueue.push(resolve));
        if (!newAccess) throw error;
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      }

      try {
        isRefreshing = true;
        const newAccess = await refreshAccess();
        processQueue(newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (e) {
        processQueue(null);
        // при неудаче очистим локальные токены
        clearTokens();
        throw e;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
