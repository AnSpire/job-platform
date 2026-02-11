import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import "./Vacancy.css";

export default function Vacancy() {
  const { vacancyId } = useParams();
  const { user } = useAuth();

  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    salary_from: "",
    salary_to: "",
    currency: "",
    location: "",
    employment_type: "",
  });

  useEffect(() => {
    async function fetchVacancy() {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/vacancies/${vacancyId}`);
        setVacancy(response.data);
      } catch {
        setError("Не удалось загрузить вакансию");
      } finally {
        setLoading(false);
      }
    }

    fetchVacancy();
  }, [vacancyId]);

  // Когда загрузили vacancy — заполняем form (но аккуратно, чтобы не затирать ввод во время редактирования)
  useEffect(() => {
    if (!vacancy) return;
    if (isEditing) return;

    setForm({
      title: vacancy.title ?? "",
      description: vacancy.description ?? "",
      requirements: vacancy.requirements ?? "",
      responsibilities: vacancy.responsibilities ?? "",
      salary_from: vacancy.salary_from ?? "",
      salary_to: vacancy.salary_to ?? "",
      currency: vacancy.currency ?? "",
      location: vacancy.location ?? "",
      employment_type: vacancy.employment_type ?? "",
    });
  }, [vacancy, isEditing]);

  const canShowSalary = useMemo(() => {
    return form.salary_from !== "" || form.salary_to !== "";
  }, [form.salary_from, form.salary_to]);

  const isOwner = useMemo(() => {
    if (!user || !vacancy) return false;
    if (!user.employer_id) return false;
    return vacancy.employer_id === user.employer_id;
  }, [user, vacancy]);

  useEffect(() => {
    if (isEditing && !isOwner) {
      setIsEditing(false);
    }
  }, [isEditing, isOwner]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit() {
    if (!isOwner) return;
    if (!vacancy) return;
    setForm({
      title: vacancy.title ?? "",
      description: vacancy.description ?? "",
      requirements: vacancy.requirements ?? "",
      responsibilities: vacancy.responsibilities ?? "",
      salary_from: vacancy.salary_from ?? "",
      salary_to: vacancy.salary_to ?? "",
      currency: vacancy.currency ?? "",
      location: vacancy.location ?? "",
      employment_type: vacancy.employment_type ?? "",
    });
    setIsEditing(true);
    setError(null);
  }

  function cancelEdit() {
    setIsEditing(false);
    setError(null);
    // form снова подтянется из vacancy через useEffect (потому что isEditing станет false)
  }

  function normalizePayload(f) {
    // Если у вас на бэке salary поля числовые, лучше отправлять number или null.
    // Здесь: пустую строку -> null, число -> Number
    const toNumberOrNull = (v) => {
      if (v === "" || v === null || v === undefined) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    return {
      title: f.title.trim(),
      description: f.description.trim(),
      requirements: f.requirements.trim() || null,
      responsibilities: f.responsibilities.trim() || null,
      salary_from: toNumberOrNull(f.salary_from),
      salary_to: toNumberOrNull(f.salary_to),
      currency: f.currency.trim() || null,
      location: f.location.trim() || null,
      employment_type: f.employment_type.trim() || null,
    };
  }

  function handleTranslate(){
      
  }



  async function save() {
    if (!isOwner) return;
    setSaving(true);
    setError(null);

    try {
      const payload = normalizePayload(form);

      // PATCH — чаще удобнее для частичного обновления
      const response = await api.patch(`/vacancies/${vacancyId}`, payload);

      setVacancy(response.data);     // обновили UI новыми данными
      setIsEditing(false);          // вышли из режима редактирования
    } catch {
      setError("Не удалось сохранить изменения");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (error && !vacancy) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">Вакансия не найдена</div>
      </div>
    );
  }

  const {
    created_at,
  } = vacancy;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">

          <div className="card">
            <div className="card-body list-group">

              {/* Верхняя панель: заголовок + кнопки */}
              <div className="d-flex justify-content-between align-items-start gap-3">
                {!isEditing ? (
                  <h1 className="card-title mb-3">{vacancy.title}</h1>
                ) : (
                  <div className="w-100">
                    <label className="form-label">Название</label>
                    <input
                      className="form-control"
                      name="title"
                      value={form.title}
                      onChange={onChange}
                      disabled={saving}
                    />
                  </div>
                )}

                {!isEditing ? (
                  isOwner ? (
                    <button className="btn btn-outline-primary" onClick={startEdit}>
                      Редактировать
                    </button>
                  ) : null
                ) : (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={save}
                      disabled={saving}
                    >
                      {saving ? "Сохранение..." : "Сохранить"}
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={cancelEdit}
                      disabled={saving}
                    >
                      Отмена
                    </button>
                  </div>
                )}
                {isOwner ? (
                    <button className="btn btn-secondary" onClick={handleTranslate}> Добавить перевод</button>
                ) :
                 null}
              </div>

              {error && (
                <div className="alert alert-danger mt-3 mb-0">{error}</div>
              )}

              {/* Локация / тип занятости */}
              <div className="mb-3 text-muted mt-3">
                {!isEditing ? (
                  <>
                    {vacancy.location && <span className="me-3">📍 {vacancy.location}</span>}
                    {vacancy.employment_type && <span>{vacancy.employment_type}</span>}
                  </>
                ) : (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Локация</label>
                      <input
                        className="form-control"
                        name="location"
                        value={form.location}
                        onChange={onChange}
                        disabled={saving}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Тип занятости</label>
                      <input
                        className="form-control"
                        name="employment_type"
                        value={form.employment_type}
                        onChange={onChange}
                        disabled={saving}
                        placeholder="Напр. Full-time / Part-time"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Зарплата */}
              {(!isEditing && (vacancy.salary_from || vacancy.salary_to)) && (
                <div className="mb-4">
                  <span className="badge bg-success fs-6">
                    {vacancy.salary_from && `от ${vacancy.salary_from} `}
                    {vacancy.salary_to && `до ${vacancy.salary_to} `}
                    {vacancy.currency ?? ""}
                  </span>
                </div>
              )}

              {isEditing && (
                <div className="mb-4">
                  <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label">Зарплата от</label>
                      <input
                        type="number"
                        className="form-control"
                        name="salary_from"
                        value={form.salary_from}
                        onChange={onChange}
                        disabled={saving}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Зарплата до</label>
                      <input
                        type="number"
                        className="form-control"
                        name="salary_to"
                        value={form.salary_to}
                        onChange={onChange}
                        disabled={saving}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Валюта</label>
                      <input
                        className="form-control"
                        name="currency"
                        value={form.currency}
                        onChange={onChange}
                        disabled={saving}
                        placeholder="RUB, EUR, USD..."
                      />
                    </div>
                  </div>

                  {canShowSalary && (
                    <div className="mt-2 text-muted small">
                      Подсказка: оставь пустым поле, если не нужно
                    </div>
                  )}
                </div>
              )}

              {/* Описание */}
              <div className="content-block list-group-item">
                <h5>Описание</h5>
                {!isEditing ? (
                  <p>{vacancy.description}</p>
                ) : (
                  <textarea
                    className="form-control"
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    disabled={saving}
                    rows={5}
                  />
                )}
              </div>

              {/* Требования */}
              <div className="content-block list-group-item">
                <h5>Требования</h5>
                {!isEditing ? (
                  <p>{vacancy.requirements}</p>
                ) : (
                  <textarea
                    className="form-control"
                    name="requirements"
                    value={form.requirements}
                    onChange={onChange}
                    disabled={saving}
                    rows={4}
                  />
                )}
              </div>

              {/* Обязанности */}
              <div className="content-block list-group-item">
                <h5>Обязанности</h5>
                {!isEditing ? (
                  <p>{vacancy.responsibilities}</p>
                ) : (
                  <textarea
                    className="form-control"
                    name="responsibilities"
                    value={form.responsibilities}
                    onChange={onChange}
                    disabled={saving}
                    rows={4}
                  />
                )}
              </div>

              <hr />

              <div className="text-muted small">
                Опубликовано: {created_at ? new Date(created_at).toLocaleDateString() : "—"}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
