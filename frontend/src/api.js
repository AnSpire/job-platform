import axios from "axios";

let accessToken = null;
let refreshToken = null;

let isRefreshing = false;
let pendingQueue = [];

export function setAccessToken(token) {
  accessToken = token;
}

export function setRefreshToken(token) {
  refreshToken = token;
}

// ваш API клиент
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, // если refresh в httpOnly cookie
});

// добавляем access в заголовок
api.interceptors.request.use((config) => {
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

async function refreshAccess() {
  // Если refresh в cookie:
  const resp = await axios.post("http://localhost:8000/api/v1/auth/refresh", null, { withCredentials: true });
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
        throw e;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
