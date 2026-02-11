export default function VacancyEditForm({
  form,
  saving,
  error,
  canShowSalary,
  onChange,
  onSave,
  onCancel,
}) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-start gap-3">
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

        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={onSave} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          <button className="btn btn-outline-secondary" onClick={onCancel} disabled={saving}>
            Отмена
          </button>
        </div>
      </div>

      {error ? <div className="alert alert-danger mt-3 mb-0">{error}</div> : null}

      <div className="mb-3 text-muted mt-3">
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
      </div>

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

        {canShowSalary ? (
          <div className="mt-2 text-muted small">
            Подсказка: оставь пустым поле, если не нужно
          </div>
        ) : null}
      </div>

      <div className="content-block list-group-item">
        <h5>Описание</h5>
        <textarea
          className="form-control"
          name="description"
          value={form.description}
          onChange={onChange}
          disabled={saving}
          rows={5}
        />
      </div>

      <div className="content-block list-group-item">
        <h5>Требования</h5>
        <textarea
          className="form-control"
          name="requirements"
          value={form.requirements}
          onChange={onChange}
          disabled={saving}
          rows={4}
        />
      </div>

      <div className="content-block list-group-item">
        <h5>Обязанности</h5>
        <textarea
          className="form-control"
          name="responsibilities"
          value={form.responsibilities}
          onChange={onChange}
          disabled={saving}
          rows={4}
        />
      </div>
    </>
  );
}
