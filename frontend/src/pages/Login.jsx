import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function parseLoginErrors(error, fallback) {
  const data = error?.response?.data;
  if (!data) {
    return { generalError: fallback, fieldErrors: {} };
  }

  const fieldErrors = {};

  if (Array.isArray(data?.errors)) {
    for (const item of data.errors) {
      if (!item || typeof item !== "object") continue;

      const msg = typeof item.msg === "string" ? item.msg : null;
      if (!msg) continue;

      const loc = item.loc;
      let field = null;
      if (Array.isArray(loc) && loc.length > 0) {
        field = String(loc[loc.length - 1]);
      } else if (typeof loc === "string") {
        const parts = loc.split(".");
        field = parts[parts.length - 1];
      }

      if (field === "email" || field === "password") {
        fieldErrors[field] = msg;
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    if (typeof data?.detail === "string" && !["ошибка валидации", "validation error", "error de validación"].includes(data.detail.toLowerCase())) {
      return { generalError: data.detail, fieldErrors };
    }
    return { generalError: null, fieldErrors };
  }

  if (typeof data === "string") {
    return { generalError: data, fieldErrors };
  }
  if (typeof data?.detail === "string") {
    return { generalError: data.detail, fieldErrors };
  }
  if (typeof data?.message === "string") {
    return { generalError: data.message, fieldErrors };
  }

  return { generalError: fallback, fieldErrors };
}

export default function Login() {
  const { login } = useAuth();
  const { t } = useTranslation();
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [generalError, setGeneralError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  async function handle(e) {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});
    try {
      await login(email, password);
      nav(loc.state?.from?.pathname || "/app/me");
    } catch (error) {
      const parsed = parseLoginErrors(error, t("auth.login.fallbackError"));
      setGeneralError(parsed.generalError);
      setFieldErrors(parsed.fieldErrors);
    }
  }

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: 420 }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">{t("auth.login.title")}</h3>

          <form onSubmit={handle} noValidate>
            <div className="mb-3">
              <label className="form-label">{t("auth.login.email")}</label>
              <input
                className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: null }));
                  }
                }}
                placeholder={t("auth.login.emailPlaceholder")}
              />
              {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">{t("auth.login.password")}</label>
              <input
                className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: null }));
                  }
                }}
                placeholder={t("auth.login.passwordPlaceholder")}
              />
              {fieldErrors.password && (
                <div className="invalid-feedback">{fieldErrors.password}</div>
              )}
            </div>

            {generalError && (
              <div className="alert alert-danger py-2">
                {generalError}
              </div>
            )}

            <button className="btn btn-primary w-100" type="submit">
              {t("auth.login.submit")}
            </button>
          </form>
        </div>
        <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: 14 }}>
          <Link to="/auth/register">
            {t("auth.login.firstTime")}
          </Link>
        </p>
      </div>
    </div>
  );
}
