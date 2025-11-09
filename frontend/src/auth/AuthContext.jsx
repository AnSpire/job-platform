import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken, setRefreshToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function silentRefresh() {
    try {
      const resp = await api.post("/auth/refresh");
      if (resp.data.access) setAccessToken(resp.data.access);
      if (resp.data.refresh) setRefreshToken(resp.data.refresh);
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
    console.log(resp.data.access_token)
    if (resp.data.access) {
        setAccessToken(resp.data.access_token);
    }
    console.log(resp.data);
    if (resp.data.refresh){ 
        setRefreshToken(resp.data.refresh_token);
        console.log(resp.data.refresh_token);
    }

    if (resp.data.user) setUser(resp.data.user);
    else await fetchMe();
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
