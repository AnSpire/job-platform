import React, { useState } from "react";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import "./Register.css";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.name = "Введите имя";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Некорректный email";
    if (formData.password.length < 6)
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Пароли не совпадают";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
      return;
    }

    setErrors({});
    setSubmitted(false);

    const { confirmPassword, ...dataToSend } = formData;
    console.log(formData)

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
        const errorData = await response.json();
        console.error("Ошибка регистрации:", errorData);
        alert(
          "Ошибка при регистрации: " +
            (errorData.detail || "Неизвестная ошибка")
        );
        return;
      }

      const data = await response.json();
      console.log("✅ Регистрация прошла успешно:", data);
      setSubmitted(true);
      nav("/auth/login", {replace: true})
    } catch (error) {
      console.error("Ошибка при соединении с сервером:", error);
      alert("Не удалось подключиться к серверу.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="h4 text-center mb-4">Регистрация</h2>

              {submitted && (
                <div className="alert alert-success" role="alert">
                  Регистрация успешно завершена!
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Имя */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Имя
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>


                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Пароль */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Пароль
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>


                {/* Подтверждение */}
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">
                    Подтверждение пароля
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>


                {/* Роль */}
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Роль
                  </label>
                  <select
                    id="role"
                    name="role"
                    className={`form-control ${errors.role ? "is-invalid" : ""}`}
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="" disabled hidden>Выберите роль</option>
                    <option value="student">Студент</option>
                    <option value="employer">Наниматель</option>
                  </select>
                  {errors.role && (
                    <div className="invalid-feedback">{errors.role}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Зарегистрироваться
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: 14 }}>
            <Link to="/auth/login">
              Уже есть аккаунт? {/* сюда можно добавить ссылку на логин */}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
