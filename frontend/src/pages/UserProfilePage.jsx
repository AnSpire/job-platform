import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import "./UserProfile.css";

export default function UserProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    await updateProfile(form);
    setEditing(false);
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card">

        <div className="profile-avatar">
          {user.first_name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
        </div>

        {!editing ? (
          <>
            <h2 className="profile-name">
              {user.first_name} {user.last_name}
            </h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-role">Роль: {user.role}</p>

            <button className="profile-edit" onClick={() => setEditing(true)}>
              Изменить данные
            </button>
            <button className="profile-logout" onClick={logout}>
              Выйти
            </button>
          </>
        ) : (
          <>
            <input
              className="profile-input"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="Имя"
            />

            <input
              className="profile-input"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Фамилия"
            />

            <button className="profile-save" onClick={handleSave}>
              Сохранить
            </button>
            <button className="profile-cancel" onClick={() => setEditing(false)}>
              Отмена
            </button>
          </>
        )}

      </div>
    </div>
  );
}
