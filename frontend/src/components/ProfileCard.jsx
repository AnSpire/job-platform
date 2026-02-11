import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./ProfileCard.css";

export default function ProfileCard({ user, updateProfile, logout }) {
  const { t } = useTranslation();
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
    <section className="employer-user-card">
      <div className="employer-user-card__header">
        <div className="employer-user-card__avatar">{initialAvatar}</div>
        <div className="employer-user-card__headline">
          <h3 className="employer-user-card__name">
            {user.first_name} {user.last_name}
          </h3>
          <p className="employer-user-card__email">{user.email}</p>
          <span className="employer-user-card__role-chip">
            {t("employerProfile.profile.role")}: {user.role}
          </span>
        </div>
      </div>

      {!editing ? (
        <>
          <div className="employer-user-card__meta">
            <div className="employer-user-card__meta-item">
              <span className="employer-user-card__meta-label">
                {t("employerProfile.profile.firstName")}
              </span>
              <span className="employer-user-card__meta-value">
                {user.first_name || t("employerProfile.profile.emptyValue")}
              </span>
            </div>
            <div className="employer-user-card__meta-item">
              <span className="employer-user-card__meta-label">
                {t("employerProfile.profile.lastName")}
              </span>
              <span className="employer-user-card__meta-value">
                {user.last_name || t("employerProfile.profile.emptyValue")}
              </span>
            </div>
          </div>

          <div className="employer-user-card__actions">
            <button
              className="employer-user-card__btn employer-user-card__btn--primary"
              onClick={() => setEditing(true)}
              type="button"
            >
              {t("employerProfile.profile.edit")}
            </button>
            <button
              className="employer-user-card__btn employer-user-card__btn--danger"
              onClick={logout}
              type="button"
            >
              {t("employerProfile.profile.logout")}
            </button>
          </div>
        </>
      ) : (
        <div className="employer-user-card__editor">
          <label className="employer-user-card__field">
            <span>{t("employerProfile.profile.firstName")}</span>
            <input
              className="employer-user-card__input"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder={t("employerProfile.profile.firstNamePlaceholder")}
            />
          </label>

          <label className="employer-user-card__field">
            <span>{t("employerProfile.profile.lastName")}</span>
            <input
              className="employer-user-card__input"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder={t("employerProfile.profile.lastNamePlaceholder")}
            />
          </label>

          <div className="employer-user-card__actions">
            <button
              className="employer-user-card__btn employer-user-card__btn--success"
              onClick={handleSave}
              type="button"
            >
              {t("employerProfile.profile.save")}
            </button>
            <button
              className="employer-user-card__btn employer-user-card__btn--secondary"
              onClick={() => setEditing(false)}
              type="button"
            >
              {t("employerProfile.profile.cancel")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
