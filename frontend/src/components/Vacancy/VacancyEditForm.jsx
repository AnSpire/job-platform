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
    <div className="vacancy-panel">
      <div className="vacancy-toolbar">
        <div className="vacancy-field-group vacancy-field-group--grow">
          <label className="form-label">Название вакансии</label>
          <input
            className="form-control"
            name="title"
            value={form.title}
            onChange={onChange}
            disabled={saving}
          />
        </div>

        <div className="vacancy-actions">
          <button className="btn btn-primary" onClick={onSave} disabled={saving} type="button">
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={onCancel}
            disabled={saving}
            type="button"
          >
            Отмена
          </button>
        </div>
      </div>

      {error ? <div className="alert alert-danger mt-3 mb-0">{error}</div> : null}

      <div className="vacancy-grid-2">
        <div className="vacancy-field-group">
            <label className="form-label">Локация</label>
            <input
              className="form-control"
              name="location"
              value={form.location}
              onChange={onChange}
              disabled={saving}
            />
        </div>
        <div className="vacancy-field-group">
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

      <div className="vacancy-grid-3">
        <div className="vacancy-field-group">
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
        <div className="vacancy-field-group">
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
        <div className="vacancy-field-group">
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
        <div className="vacancy-helper-text">Подсказка: оставь пустым поле, если не нужно</div>
      ) : null}

      <div className="vacancy-content-block">
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

      <div className="vacancy-content-block">
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

      <div className="vacancy-content-block">
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
    </div>
  );
}
