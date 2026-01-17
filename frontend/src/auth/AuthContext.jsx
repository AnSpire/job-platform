import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken, setRefreshToken } from "../api";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  async function silentRefresh() {
    try {
      const raw = localStorage.getItem("refresh_token");
      if (!raw) return;

      const stored = JSON.parse(raw);   // <--- вот это нужно добавить
      const refresh = stored.token;
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

  async function updateProfile(data) {
    const resp = await api.patch("/users/me", data);
    setUser(resp.data); // обновили user в state
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


  async function logout() { try {
      await api.post("/auth/logout");
    } catch {}
    nav("/", {replace: true});
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    console.log("before nav");
    console.log("after nav");

  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
