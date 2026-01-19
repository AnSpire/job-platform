import { useMemo, useState } from "react";
import "./EmployerProfile.css";
import "./Vacancy.css";


export default function EmployerProfile({ user, updateProfile, logout }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
  });

  // --- vacancy modal state ---
  const [showVacancyModal, setShowVacancyModal] = useState(false);
  const [vacancyForm, setVacancyForm] = useState(getEmptyVacancyForm());
  const [vacancyError, setVacancyError] = useState(null);
  const [vacancySaving, setVacancySaving] = useState(false);

  const initialAvatar = useMemo(() => {
    return (user.first_name?.[0] ?? user.email?.[0] ?? "?").toUpperCase();
  }, [user.first_name, user.email]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    await updateProfile(form);
    setEditing(false);
  }

  function openVacancyModal() {
    setVacancyError(null);
    setVacancyForm(getEmptyVacancyForm());
    setShowVacancyModal(true);
  }

  function closeVacancyModal() {
    if (vacancySaving) return;
    setShowVacancyModal(false);
  }

  function handleVacancyChange(e) {
    const { name, value } = e.target;

    // salary поля хотим хранить как number|null
    if (name === "salary_from" || name === "salary_to") {
      const v = value.trim();
      setVacancyForm((prev) => ({
        ...prev,
        [name]: v === "" ? null : Number(v),
      }));
      return;
    }

    setVacancyForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateVacancy(v) {
    if (!v.title.trim()) return "Поле title (Название) обязательно";
    if (!v.description.trim()) return "Поле description (Описание) обязательно";

    if (v.salary_from != null && Number.isNaN(v.salary_from)) return "salary_from должно быть числом";
    if (v.salary_to != null && Number.isNaN(v.salary_to)) return "salary_to должно быть числом";

    if (v.salary_from != null && v.salary_from < 0) return "salary_from не может быть отрицательной";
    if (v.salary_to != null && v.salary_to < 0) return "salary_to не может быть отрицательной";

    if (v.salary_from != null && v.salary_to != null && v.salary_from > v.salary_to) {
      return "salary_from не может быть больше salary_to";
    }
    return null;
  }

  async function createVacancy(payload) {
    // TODO: подключи свой клиент:
    // await api.post("/api/v1/vacancies", payload)
    // или "/api/v1/my-vacancies"
    console.log("CREATE VACANCY payload:", payload);
  }

  async function handleVacancySubmit(e) {
    e.preventDefault();
    setVacancyError(null);

    const err = validateVacancy(vacancyForm);
    if (err) {
      setVacancyError(err);
      return;
    }

    setVacancySaving(true);
    try {
      await createVacancy(vacancyForm);
      setShowVacancyModal(false);
      // TODO: после успешного создания можно перезагрузить список вакансий
    } catch (error) {
      setVacancyError(error?.response?.data?.detail || "Не удалось создать вакансию");
    } finally {
      setVacancySaving(false);
    }
  }

  return (
    <div className="employer-profile">
      <h2 className="mb-5">Личный кабинет работодателя</h2>

      <div className="d-flex">
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

        <div className="vacancies ps-3">
          <div className="top-side d-flex justify-content-between">
            <h3 className="mb-3">Мои вакансии</h3>
            <button className="btn btn-success" onClick={openVacancyModal}>
              Создать вакансию
            </button>
          </div>

          <div className="vacancies-list">
            Нет активный вакансий
            {/* TODO: get api/v1/my-vacancies */}
          </div>
        </div>
      </div>

      {showVacancyModal && (
        <div className="modal-overlay" onMouseDown={closeVacancyModal}>
          <div className="modal-window" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4 className="m-0">Создать вакансию</h4>
              <button className="modal-close" onClick={closeVacancyModal} aria-label="close">
                ×
              </button>
            </div>

            <form onSubmit={handleVacancySubmit} className="modal-body">
              {vacancyError && <div className="alert alert-danger py-2">{vacancyError}</div>}

              <label className="modal-label">
                Название (title) *
                <input
                  className="form-control"
                  name="title"
                  value={vacancyForm.title}
                  onChange={handleVacancyChange}
                  maxLength={120}
                />
              </label>

              <label className="modal-label">
                Описание (description) *
                <textarea
                  className="form-control"
                  name="description"
                  value={vacancyForm.description}
                  onChange={handleVacancyChange}
                  rows={4}
                />
              </label>

              <label className="modal-label">
                Требования (requirements)
                <textarea
                  className="form-control"
                  name="requirements"
                  value={vacancyForm.requirements ?? ""}
                  onChange={handleVacancyChange}
                  rows={3}
                />
              </label>

              <label className="modal-label">
                Обязанности (responsibilities)
                <textarea
                  className="form-control"
                  name="responsibilities"
                  value={vacancyForm.responsibilities ?? ""}
                  onChange={handleVacancyChange}
                  rows={3}
                />
              </label>

              <div className="modal-grid-3">
                <label className="modal-label">
                  salary_from
                  <input
                    className="form-control"
                    name="salary_from"
                    value={vacancyForm.salary_from ?? ""}
                    onChange={handleVacancyChange}
                    inputMode="numeric"
                  />
                </label>

                <label className="modal-label">
                  salary_to
                  <input
                    className="form-control"
                    name="salary_to"
                    value={vacancyForm.salary_to ?? ""}
                    onChange={handleVacancyChange}
                    inputMode="numeric"
                  />
                </label>

                <label className="modal-label">
                  currency
                  <input
                    className="form-control"
                    name="currency"
                    value={vacancyForm.currency ?? ""}
                    onChange={handleVacancyChange}
                    placeholder="EUR, USD..."
                    maxLength={10}
                  />
                </label>
              </div>

              <div className="modal-grid-2">
                <label className="modal-label">
                  location
                  <input
                    className="form-control"
                    name="location"
                    value={vacancyForm.location ?? ""}
                    onChange={handleVacancyChange}
                    maxLength={100}
                  />
                </label>

                <label className="modal-label">
                  employment_type
                  <select
                    className="form-select"
                    name="employment_type"
                    value={vacancyForm.employment_type ?? ""}
                    onChange={handleVacancyChange}
                  >
                    <option value="">(не выбрано)</option>
                    <option value="full_time">full_time</option>
                    <option value="part_time">part_time</option>
                    <option value="internship">internship</option>
                    <option value="contract">contract</option>
                    <option value="remote">remote</option>
                  </select>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={closeVacancyModal} disabled={vacancySaving}>
                  Отмена
                </button>
                <button type="submit" className="btn btn-success" disabled={vacancySaving}>
                  {vacancySaving ? "Сохранение..." : "Создать"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function getEmptyVacancyForm() {
  return {
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    salary_from: null,
    salary_to: null,
    currency: "",
    location: "",
    employment_type: "",
  };
}
