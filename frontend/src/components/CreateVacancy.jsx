import { useEffect, useState } from "react";
import "./Vacancy.css";

export default function CreateVacancy({
  open,
  onClose,
  onCreated,
  createVacancy, // async (payload) => ...
  setModalTitle, // опционально: если хочешь управлять title изнутри (можно не передавать)
}) {
  const [form, setForm] = useState(getEmptyVacancyForm());
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // когда модалка открылась — сбросим стейт
  useEffect(() => {
    if (!open) return;
    setError(null);
    setSaving(false);
    setForm(getEmptyVacancyForm());
  }, [open]);

  // если хочешь, чтобы CreateVacancy мог задавать заголовок модалки (не обязательно)
  useEffect(() => {
    if (!setModalTitle) return;
    setModalTitle("Создать вакансию");
  }, [setModalTitle]);

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
      const result = await createVacancy(form);
      onCreated?.(result ?? form);
      resetAndClose();
    } catch (e2) {
      setError(e2?.response?.data?.detail || "Не удалось создать вакансию");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="create-vacancy-form">
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

      {/* ВАЖНО:
         Кнопки в футере модалки будут снаружи.
         Но submit-кнопка может триггерить этот form через form="..." — если захочешь.
         Здесь можно оставить пусто или добавить подсказки/доп контент.
      */}
    </form>
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
