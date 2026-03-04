import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./CreateVacancy.css";

type VacancyFormValue = {
  title: string;
  description: string;
  requirements?: string | null;
  responsibilities?: string | null;
  salary_from?: string | number | null;
  salary_to?: string | number | null;
  currency?: string | null;
  location?: string | null;
  employment_type?: string | null;
};

type FieldErrorMap = Record<string, string>;

type Props = {
  value: VacancyFormValue;
  onFieldChange: (name: keyof VacancyFormValue, value: string) => void;
  errorList?: unknown; // приходит что угодно, мы проверим внутри
};

function buildFieldErrors(errorList: unknown): FieldErrorMap {
  const map: FieldErrorMap = {};
  if (!Array.isArray(errorList)) return map;

  for (const item of errorList) {
    if (typeof item !== "string") continue;

    // ищем имя поля в одинарных кавычках: 'currency'
    const m = item.match(/'([^']+)'/);
    if (!m) continue;

    const field = m[1];
    map[field] = map[field] ? `${map[field]}; ${item}` : item;
  }

  return map;
}

export default function CreateVacancyForm({ value, onFieldChange, errorList }: Props) {
  const { t } = useTranslation();

  function onInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const name = e.target.name as keyof VacancyFormValue;
    const v = e.target.value;
    onFieldChange(name, v);
  }

  const fieldErrors = useMemo(() => buildFieldErrors(errorList), [errorList]);

  const hasErr = (name: keyof VacancyFormValue) => Boolean(fieldErrors[String(name)]);
  const errText = (name: keyof VacancyFormValue) => fieldErrors[String(name)];
  const inputClass = (base: string, name: keyof VacancyFormValue) =>
    `${base} ${hasErr(name) ? "is-invalid" : ""}`;

  return (
    <div className="create-vacancy-form">
      <label className="modal-label">
        {t("employerProfile.vacancyForm.fields.title")} *
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
        {t("employerProfile.vacancyForm.fields.description")}
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
        {t("employerProfile.vacancyForm.fields.requirements")}
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
        {t("employerProfile.vacancyForm.fields.responsibilities")}
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
          {t("employerProfile.vacancyForm.fields.salaryFrom")}
          <input
            className={inputClass("form-control", "salary_from")}
            name="salary_from"
            value={String(value.salary_from ?? "")}
            onChange={onInput}
            inputMode="numeric"
          />
          {hasErr("salary_from") && (
            <div className="invalid-feedback">{errText("salary_from")}</div>
          )}
        </label>

        <label className="modal-label">
          {t("employerProfile.vacancyForm.fields.salaryTo")}
          <input
            className={inputClass("form-control", "salary_to")}
            name="salary_to"
            value={String(value.salary_to ?? "")}
            onChange={onInput}
            inputMode="numeric"
          />
          {hasErr("salary_to") && (
            <div className="invalid-feedback">{errText("salary_to")}</div>
          )}
        </label>

        <label className="modal-label">
          {t("employerProfile.vacancyForm.fields.currency")}
          <select
            className={inputClass("form-select", "currency")}
            name="currency"
            value={value.currency ?? ""}
            onChange={onInput}
          >
            <option value="RUB">RUB</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          {hasErr("currency") && (
            <div className="invalid-feedback d-block">{errText("currency")}</div>
          )}
        </label>
      </div>

      <div className="modal-grid-2">
        <label className="modal-label">
          {t("employerProfile.vacancyForm.fields.location")}
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
          {t("employerProfile.vacancyForm.fields.employmentType")}
          <select
            className={inputClass("form-select", "employment_type")}
            name="employment_type"
            value={value.employment_type ?? ""}
            onChange={onInput}
          >
            <option value="">{t("employerProfile.vacancyForm.employment.notSelected")}</option>
            <option value="full_time">{t("vacancies.employment.full_time")}</option>
            <option value="part_time">{t("vacancies.employment.part_time")}</option>
            <option value="internship">{t("vacancies.employment.internship")}</option>
            <option value="contract">{t("vacancies.employment.contract")}</option>
            <option value="remote">{t("vacancies.employment.remote")}</option>
          </select>

          {/* для select иногда надо d-block */}
          {hasErr("employment_type") && (
            <div className="invalid-feedback d-block">{errText("employment_type")}</div>
          )}
        </label>
      </div>
    </div>
  );
}
