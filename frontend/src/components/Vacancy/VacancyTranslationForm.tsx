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
    <>
      <div className="d-flex justify-content-between align-items-start gap-3">
        <h2 className="h4 mb-3">Добавить перевод</h2>

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

      <div className="mb-3 mt-3">
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

      <div className="content-block list-group-item">
        <label className="form-label">Название</label>
        <input
          className="form-control"
          name="title"
          value={form.title}
          onChange={onChange}
          disabled={saving}
        />
      </div>

      <div className="content-block list-group-item">
        <label className="form-label">Локация</label>
        <input
          className="form-control"
          name="location"
          value={form.location}
          onChange={onChange}
          disabled={saving}
        />
      </div>

      <div className="content-block list-group-item">
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

      <div className="content-block list-group-item">
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

      <div className="content-block list-group-item">
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
    </>
  );
}
