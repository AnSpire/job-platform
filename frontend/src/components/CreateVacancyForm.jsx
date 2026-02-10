import { useMemo } from "react";
import "./CreateVacancy.css";

function buildFieldErrors(errorList) {
  const map = {}; // { currency: "...", location: "...", ... }
  if (!Array.isArray(errorList)) return map;

  for (const msg of errorList) {
    if (typeof msg !== "string") continue;

    // вытаскиваем имя поля в одинарных кавычках: 'currency'
    const m = msg.match(/'([^']+)'/);
    if (!m) continue;

    const field = m[1];
    // если по полю несколько ошибок — склеим
    map[field] = map[field] ? `${map[field]}; ${msg}` : msg;
  }

  return map;
}

export default function CreateVacancyForm({ value, onFieldChange, errorList }) {
  function onInput(e) {
    const { name, value: v } = e.target;
    onFieldChange(name, v);
  }

  const fieldErrors = useMemo(() => buildFieldErrors(errorList), [errorList]);

  const hasErr = (name) => Boolean(fieldErrors[name]);
  const inputClass = (base, name) => `${base} ${hasErr(name) ? "is-invalid" : ""}`;
  const errText = (name) => fieldErrors[name];

  return (
    <div className="create-vacancy-form">
      <label className="modal-label">
        Название (title) *
        <input
          className={inputClass("form-control", "title")}
          name="title"
          value={value.title}
          onChange={onInput}
          maxLength={120}
        />
        {hasErr("title") && <div className="invalid-feedback">{errText("title")}</div>}
      </label>

      <label className="modal-label">
        Описание (description) *
        <textarea
          className={inputClass("form-control", "description")}
          name="description"
          value={value.description}
          onChange={onInput}
          rows={4}
        />
        {hasErr("description") && (
          <div className="invalid-feedback">{errText("description")}</div>
        )}
      </label>

      <label className="modal-label">
        Требования (requirements)
        <textarea
          className={inputClass("form-control", "requirements")}
          name="requirements"
          value={value.requirements ?? ""}
          onChange={onInput}
          rows={3}
        />
        {hasErr("requirements") && (
          <div className="invalid-feedback">{errText("requirements")}</div>
        )}
      </label>

      <label className="modal-label">
        Обязанности (responsibilities)
        <textarea
          className={inputClass("form-control", "responsibilities")}
          name="responsibilities"
          value={value.responsibilities ?? ""}
          onChange={onInput}
          rows={3}
        />
        {hasErr("responsibilities") && (
          <div className="invalid-feedback">{errText("responsibilities")}</div>
        )}
      </label>

      <div className="modal-grid-3">
        <label className="modal-label">
          salary_from
          <input
            className={inputClass("form-control", "salary_from")}
            name="salary_from"
            value={value.salary_from ?? ""}
            onChange={onInput}
            inputMode="numeric"
          />
          {hasErr("salary_from") && (
            <div className="invalid-feedback">{errText("salary_from")}</div>
          )}
        </label>

        <label className="modal-label">
          salary_to
          <input
            className={inputClass("form-control", "salary_to")}
            name="salary_to"
            value={value.salary_to ?? ""}
            onChange={onInput}
            inputMode="numeric"
          />
          {hasErr("salary_to") && (
            <div className="invalid-feedback">{errText("salary_to")}</div>
          )}
        </label>

        <label className="modal-label">
          currency
          <input
            className={inputClass("form-control", "currency")}
            name="currency"
            value={value.currency ?? ""}
            onChange={onInput}
            placeholder="EUR, USD..."
            maxLength={10}
          />
          {hasErr("currency") && (
            <div className="invalid-feedback">{errText("currency")}</div>
          )}
        </label>
      </div>

      <div className="modal-grid-2">
        <label className="modal-label">
          location
          <input
            className={inputClass("form-control", "location")}
            name="location"
            value={value.location ?? ""}
            onChange={onInput}
            maxLength={100}
          />
          {hasErr("location") && (
            <div className="invalid-feedback">{errText("location")}</div>
          )}
        </label>

        <label className="modal-label">
          employment_type
          <select
            className={inputClass("form-select", "employment_type")}
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
          {hasErr("employment_type") && (
            <div className="invalid-feedback">{errText("employment_type")}</div>
          )}
        </label>
      </div>
    </div>
  );
}
