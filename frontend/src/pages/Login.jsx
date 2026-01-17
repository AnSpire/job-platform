import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

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
      nav(loc.state?.from?.pathname || "/app/me");
    } catch (error) {
      setErr(error?.response?.data?.detail || "Ошибка входа");
    }
  }

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: 420 }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Вход</h3>

          <form onSubmit={handle}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Пароль</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {err && (
              <div className="alert alert-danger py-2">
                {err}
              </div>
            )}

            <button className="btn btn-primary w-100" type="submit">
              Войти
            </button>
          </form>
        </div>
        <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: 14 }}>
          <Link to="/auth/register">
            Впервые на сайте? {/* сюда можно добавить ссылку на логин */}
          </Link>
        </p>
      </div>
    </div>
  );
}
