import { useMemo, useState } from "react";
export default function ProfileCard({
        user,
        updateProfile,
        logout
    })
{
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
  });

  const initialAvatar = useMemo(() => {
    return (user.first_name?.[0] ?? user.email?.[0] ?? "?").toUpperCase();
  }, [user.first_name, user.email]);


  async function handleSave() {
    await updateProfile(form);
    setEditing(false);
  }


    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    return (
        <div className="profile-card">
          <div className="profile-avatar">{initialAvatar}</div>

          {!editing ? (
            <>
              <h2 className="profile-name">
                {user.first_name} {user.last_name}
              </h2>

              <p className="profile-email">{user.email}</p>
              <p className="profile-role">Роль: {user.role}</p>

              <button className="profile-edit me-2" onClick={() => setEditing(true)}>
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
    )
}