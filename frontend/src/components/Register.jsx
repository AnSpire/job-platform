import React, { useState } from "react";
import "../RegisterForm.css";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Введите имя";
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

  // создаём объект без confirmPassword
  const { confirmPassword, ...dataToSend } = formData;

  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend), // отправляем только name, email, password
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Ошибка регистрации:", errorData);
      alert("Ошибка при регистрации: " + (errorData.detail || "Неизвестная ошибка"));
      return;
    }

    const data = await response.json();
    console.log("✅ Регистрация прошла успешно:", data);
    setSubmitted(true);
  } catch (error) {
    console.error("Ошибка при соединении с сервером:", error);
    alert("Не удалось подключиться к серверу.");
  }
};



  return (
    <div className="registration-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="name">Имя</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Подтверждение пароля</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        <button type="submit">Зарегистрироваться</button>
      </form>

      {submitted && (
        <p className="success">Регистрация успешно завершена!</p>
      )}
    </div>
  );
}

export default RegistrationForm;
