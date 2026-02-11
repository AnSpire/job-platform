import type { ChangeEvent } from "react";

type TranslationFormValue = {
  lang: string;
  title: string;
  location: string;
  description: string;
  requirements: string;
  responsibilities: string;
};

type Props = {
  form: TranslationFormValue;
  saving: boolean;
  error: string | null;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function VacancyTranslationForm({
  form,
  saving,
  error,
  onChange,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="vacancy-panel">
      <div className="vacancy-toolbar">
        <h2 className="vacancy-form-title">Добавить перевод</h2>

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

      <div className="vacancy-field-group">
        <label className="form-label">Язык перевода</label>
        <select
          className="form-select"
          name="lang"
          value={form.lang}
          onChange={onChange}
          disabled={saving}
        >
          <option value="en">English (en)</option>
          <option value="es">Español (es)</option>
        </select>
      </div>

      <div className="vacancy-content-block">
        <label className="form-label">Название</label>
        <input
          className="form-control"
          name="title"
          value={form.title}
          onChange={onChange}
          disabled={saving}
        />
      </div>

      <div className="vacancy-content-block">
        <label className="form-label">Локация</label>
        <input
          className="form-control"
          name="location"
          value={form.location}
          onChange={onChange}
          disabled={saving}
        />
      </div>

      <div className="vacancy-content-block">
        <label className="form-label">Описание</label>
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
        <label className="form-label">Требования</label>
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
        <label className="form-label">Обязанности</label>
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
