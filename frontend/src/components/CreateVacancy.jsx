import { useState } from "react";
import "./Vacancy.css";

export default function CreateVacancy({
  open,
  onClose,
  onCreated,
  createVacancy, // async (payload) => ...
}) {
  const [form, setForm] = useState(getEmptyVacancyForm());
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // если модалку закрыли/открыли заново — сбрасываем форму
  // (простой способ: сбрасывать при open=true в родителе через key,
  // но здесь сделаем явный reset при open)
  if (!open) return null;

  function resetAndClose() {
    if (saving) return;
    setError(null);
    setForm(getEmptyVacancyForm());
    onClose?.();
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "salary_from" || name === "salary_to") {
      const v = value.trim();
      setForm((prev) => ({
        ...prev,
        [name]: v === "" ? null : Number(v),
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate(v) {
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const err = validate(form);
    if (err) {
      setError(err);
      return;
    }

    setSaving(true);
    try {
      await createVacancy(form);
      onCreated?.(form); // можно передать ответ API, если createVacancy его возвращает
      // закрываем и сбрасываем
      setError(null);
      setForm(getEmptyVacancyForm());
      onClose?.();
    } catch (e2) {
      setError(e2?.response?.data?.detail || "Не удалось создать вакансию");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={resetAndClose}>
      <div className="modal-window" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="m-0">Создать вакансию</h4>
          <button className="modal-close" onClick={resetAndClose} aria-label="close" disabled={saving}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <label className="modal-label">
            Название (title) *
            <input className="form-control" name="title" value={form.title} onChange={handleChange} maxLength={120} />
          </label>

          <label className="modal-label">
            Описание (description) *
            <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={4} />
          </label>

          <label className="modal-label">
            Требования (requirements)
            <textarea className="form-control" name="requirements" value={form.requirements ?? ""} onChange={handleChange} rows={3} />
          </label>

          <label className="modal-label">
            Обязанности (responsibilities)
            <textarea
              className="form-control"
              name="responsibilities"
              value={form.responsibilities ?? ""}
              onChange={handleChange}
              rows={3}
            />
          </label>

          <div className="modal-grid-3">
            <label className="modal-label">
              salary_from
              <input className="form-control" name="salary_from" value={form.salary_from ?? ""} onChange={handleChange} inputMode="numeric" />
            </label>

            <label className="modal-label">
              salary_to
              <input className="form-control" name="salary_to" value={form.salary_to ?? ""} onChange={handleChange} inputMode="numeric" />
            </label>

            <label className="modal-label">
              currency
              <input className="form-control" name="currency" value={form.currency ?? ""} onChange={handleChange} placeholder="EUR, USD..." maxLength={10} />
            </label>
          </div>

          <div className="modal-grid-2">
            <label className="modal-label">
              location
              <input className="form-control" name="location" value={form.location ?? ""} onChange={handleChange} maxLength={100} />
            </label>

            <label className="modal-label">
              employment_type
              <select className="form-select" name="employment_type" value={form.employment_type ?? ""} onChange={handleChange}>
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
            <button type="button" className="btn btn-outline-secondary" onClick={resetAndClose} disabled={saving}>
              Отмена
            </button>
            <button type="submit" className="btn btn-success" disabled={saving}>
              {saving ? "Сохранение..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
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
