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
  accessToken = a ? (a.token ?? a) : null;
  refreshToken = r ? (r.token ?? r) : null;
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
export const api = axios.create({
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
  const r = readFromStorage(REFRESH_KEY);

  try {
    const url = "http://localhost:8000/api/v1/auth/refresh";

    const resp =
      r && r.token
        ? await axios.post(
            url,
            { refresh_token: r.token },
            { withCredentials: true },
          )
        : await axios.post(url, null, { withCredentials: true });

    const data = resp.data;

    if (data?.access) setAccessToken(data.access);
    if (data?.refresh) setRefreshToken(data.refresh);

    return data?.access ?? null;
  } catch (err) {
    // axios-ошибка
    if (axios.isAxiosError(err)) {
      // Сервер ответил (4xx/5xx)
      if (err.response) {
        const status = err.response.status;
        const payload = err.response.data;

        console.error("[refreshAccess] Server error:", {
          status,
          payload,
          message: err.message,
        });

        // Пример: если refresh протух/невалиден — чистим токены
        if (status === 401 || status === 403) {
          try {
            setAccessToken(null);
            setRefreshToken(null);
            // если нужно ещё и storage почистить:
            // removeFromStorage(REFRESH_KEY);
          } catch (_) {}
        }

        // Вариант 1: вернуть null, чтобы вызывающий понял, что обновление не удалось
        return null;

        // Вариант 2 (если удобнее): пробросить дальше
        // throw new Error(`Refresh failed (${status})`);
      }

      // Запрос ушёл, но ответа нет (CORS/сеть/сервер недоступен)
      if (err.request) {
        console.error("[refreshAccess] No response:", {
          message: err.message,
        });
        return null;
      }

      // Ошибка при настройке запроса
      console.error("[refreshAccess] Request setup error:", err.message);
      return null;
    }

    // Не-axios ошибка
    console.error("[refreshAccess] Unknown error:", err);
    return null;
  }
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
        const newAccess = await new Promise((resolve) =>
          pendingQueue.push(resolve),
        );
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
  },
);

export default api;
