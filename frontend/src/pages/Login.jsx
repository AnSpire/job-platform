import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  async function handle(e) {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      nav(loc.state?.from?.pathname || "/app");
    } catch (error) {
      setErr(error?.response?.data?.detail || "Ошибка входа");
    }
  }

  return (
    <form onSubmit={handle}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
      {err && <div style={{ color: "red" }}>{err}</div>}
      <button>Войти</button>
    </form>
  );
}
