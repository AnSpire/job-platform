import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken, setRefreshToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function silentRefresh() {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) return;

      const resp = await api.post("/auth/refresh", { refresh_token: refresh });
      setAccessToken(resp.data.access_token);
      setRefreshToken(resp.data.refresh_token);
    } catch {}
  }


  async function fetchMe() {
    const resp = await api.get("/users/me");
    setUser(resp.data);
  }

  useEffect(() => {
    (async () => {
      try {
        await silentRefresh();
        await fetchMe();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(email, password) {
    const resp = await api.post("/auth/login/", { email, password });

    if (resp.data.access_token) {
      setAccessToken(resp.data.access_token);
    }
    if (resp.data.refresh_token) {
      setRefreshToken(resp.data.refresh_token);
    }

    await fetchMe();
  }


  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {}

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
