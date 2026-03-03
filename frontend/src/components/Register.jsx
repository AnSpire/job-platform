import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const KNOWN_FIELDS = new Set(["first_name", "email", "password", "role"]);

function parseRegisterErrors(errorData, fallback) {
  const fieldErrors = {};
  const generalParts = [];

  if (Array.isArray(errorData?.errors)) {
    for (const item of errorData.errors) {
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

      if (field && KNOWN_FIELDS.has(field)) {
        fieldErrors[field] = msg;
      } else {
        generalParts.push(msg);
      }
    }
  }

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;
  const detail = typeof errorData?.detail === "string" ? errorData.detail : null;
  const message = typeof errorData?.message === "string" ? errorData.message : null;
  const stringBody = typeof errorData === "string" ? errorData : null;

  if (generalParts.length > 0) {
    return { fieldErrors, generalError: generalParts.join("; ") };
  }

  if (hasFieldErrors) {
    if (detail && detail !== "Validation error") {
      return { fieldErrors, generalError: detail };
    }
    return { fieldErrors, generalError: null };
  }

  return {
    fieldErrors,
    generalError: detail || message || stringBody || fallback,
  };
}

function RegistrationForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = t("auth.register.validation.nameRequired");
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = t("auth.register.validation.invalidEmail");
    if (formData.password.length < 6)
      newErrors.password = t("auth.register.validation.passwordTooShort");
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = t("auth.register.validation.passwordsMismatch");
    if (!formData.role) newErrors.role = t("auth.register.validation.roleRequired");

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setSubmitted(false);
      return;
    }

    setFieldErrors({});
    setSubmitted(false);
    const dataToSend = {
      first_name: formData.first_name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch {
          errorData = null;
        }
        const parsed = parseRegisterErrors(
          errorData,
          t("auth.register.errors.fallback")
        );
        setFieldErrors(parsed.fieldErrors);
        setGeneralError(parsed.generalError);
        return;
      }

      setSubmitted(true);
      nav("/auth/login", { replace: true });
    } catch {
      setGeneralError(t("auth.register.errors.network"));
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="h4 text-center mb-4">{t("auth.register.title")}</h2>

              {submitted && (
                <div className="alert alert-success" role="alert">
                  {t("auth.register.success")}
                </div>
              )}

              {generalError && (
                <div className="alert alert-danger py-2" role="alert">
                  {generalError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Имя */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    {t("auth.register.fields.firstName")}
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className={`form-control ${
                      fieldErrors.first_name ? "is-invalid" : ""
                    }`}
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  {fieldErrors.first_name && (
                    <div className="invalid-feedback">{fieldErrors.first_name}</div>
                  )}
                </div>


                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    {t("auth.register.fields.email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${
                      fieldErrors.email ? "is-invalid" : ""
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {fieldErrors.email && (
                    <div className="invalid-feedback">{fieldErrors.email}</div>
                  )}
                </div>

                {/* Пароль */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    {t("auth.register.fields.password")}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`form-control ${
                      fieldErrors.password ? "is-invalid" : ""
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {fieldErrors.password && (
                    <div className="invalid-feedback">{fieldErrors.password}</div>
                  )}
                </div>


                {/* Подтверждение */}
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">
                    {t("auth.register.fields.confirmPassword")}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-control ${
                      fieldErrors.confirmPassword ? "is-invalid" : ""
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {fieldErrors.confirmPassword && (
                    <div className="invalid-feedback">
                      {fieldErrors.confirmPassword}
                    </div>
                  )}
                </div>


                {/* Роль */}
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    {t("auth.register.fields.role")}
                  </label>
                  <select
                    id="role"
                    name="role"
                    className={`form-control ${fieldErrors.role ? "is-invalid" : ""}`}
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="" disabled hidden>
                      {t("auth.register.fields.rolePlaceholder")}
                    </option>
                    <option value="student">{t("auth.register.roles.student")}</option>
                    <option value="employer">{t("auth.register.roles.employer")}</option>
                  </select>
                  {fieldErrors.role && (
                    <div className="invalid-feedback">{fieldErrors.role}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  {t("auth.register.submit")}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: 14 }}>
            <Link to="/auth/login">
              {t("auth.register.alreadyHaveAccount")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
