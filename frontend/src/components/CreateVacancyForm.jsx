import "./Vacancy.css";

export default function CreateVacancyForm({ value, onFieldChange }) {
  function onInput(e) {
    const { name, value: v } = e.target;
    onFieldChange(name, v);
  }

  return (
    <div className="create-vacancy-form">
      <label className="modal-label">
        Название (title) *
        <input
          className="form-control"
          name="title"
          value={value.title}
          onChange={onInput}
          maxLength={120}
        />
      </label>

      <label className="modal-label">
        Описание (description) *
        <textarea
          className="form-control"
          name="description"
          value={value.description}
          onChange={onInput}
          rows={4}
        />
      </label>

      <label className="modal-label">
        Требования (requirements)
        <textarea
          className="form-control"
          name="requirements"
          value={value.requirements ?? ""}
          onChange={onInput}
          rows={3}
        />
      </label>

      <label className="modal-label">
        Обязанности (responsibilities)
        <textarea
          className="form-control"
          name="responsibilities"
          value={value.responsibilities ?? ""}
          onChange={onInput}
          rows={3}
        />
      </label>

      <div className="modal-grid-3">
        <label className="modal-label">
          salary_from
          <input
            className="form-control"
            name="salary_from"
            value={value.salary_from ?? ""}
            onChange={onInput}
            inputMode="numeric"
          />
        </label>

        <label className="modal-label">
          salary_to
          <input
            className="form-control"
            name="salary_to"
            value={value.salary_to ?? ""}
            onChange={onInput}
            inputMode="numeric"
          />
        </label>

        <label className="modal-label">
          currency
          <input
            className="form-control"
            name="currency"
            value={value.currency ?? ""}
            onChange={onInput}
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
            value={value.location ?? ""}
            onChange={onInput}
            maxLength={100}
          />
        </label>

        <label className="modal-label">
          employment_type
          <select
            className="form-select"
            name="employment_type"
            value={value.employment_type ?? ""}
            onChange={onInput}
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
    </div>
  );
}
