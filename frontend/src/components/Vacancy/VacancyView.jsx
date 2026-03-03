import { useTranslation } from "react-i18next";

export default function VacancyView({
  vacancy,
  isOwner,
  error,
  deleting,
  onEdit,
  onTranslate,
  onDelete,
}) {
  const {
    title,
    location,
    employment_type,
    salary_from,
    salary_to,
    currency,
    description,
    requirements,
    responsibilities,
    created_at,
  } = vacancy;
  const { t, i18n } = useTranslation();

  const employmentTypeKey = employment_type
    ? `vacancies.employment.${employment_type}`
    : null;
  const employmentLabel =
    employmentTypeKey && t(employmentTypeKey) !== employmentTypeKey
      ? t(employmentTypeKey)
      : employment_type;

  const salaryText =
    salary_from != null && salary_to != null
      ? t("vacancies.salary.range", { from: salary_from, to: salary_to, currency: currency ?? "" })
      : salary_from != null
        ? t("vacancies.salary.from", { from: salary_from, currency: currency ?? "" })
        : salary_to != null
          ? t("vacancies.salary.to", { to: salary_to, currency: currency ?? "" })
          : null;

  return (
    <div className="vacancy-panel">
      <div className="vacancy-toolbar">
        <div>
          <h1 className="vacancy-title">{title}</h1>
          <div className="vacancy-meta">
            {location ? <span className="vacancy-chip">{location}</span> : null}
            {employmentLabel ? (
              <span className="vacancy-chip vacancy-chip--muted">{employmentLabel}</span>
            ) : null}
          </div>
        </div>

        <div className="vacancy-actions">
          {isOwner ? (
            <button className="btn btn-outline-primary" onClick={onEdit} type="button">
              {t("vacancies.view.edit")}
            </button>
          ) : null}
          {isOwner ? (
            <button className="btn btn-secondary" onClick={onTranslate} type="button">
              {t("vacancies.view.addTranslation")}
            </button>
          ) : null}
          {isOwner ? (
            <button
              className="btn btn-danger"
              onClick={onDelete}
              disabled={deleting}
              type="button"
            >
              {deleting ? t("vacancies.view.deleting") : t("vacancies.view.delete")}
            </button>
          ) : null}
        </div>
      </div>

      {error ? <div className="alert alert-danger mt-3 mb-0">{error}</div> : null}

      {salaryText ? (
        <div className="vacancy-salary">
          <span className="badge bg-success fs-6 px-3 py-2">{salaryText}</span>
        </div>
      ) : null}

      <div className="vacancy-content-block">
        <h5>{t("vacancies.view.description")}</h5>
        <p>{description || t("vacancies.noDescription")}</p>
      </div>

      <div className="vacancy-content-block">
        <h5>{t("vacancies.view.requirements")}</h5>
        <p>{requirements || t("vacancies.view.notSpecified")}</p>
      </div>

      <div className="vacancy-content-block">
        <h5>{t("vacancies.view.responsibilities")}</h5>
        <p>{responsibilities || t("vacancies.view.notSpecified")}</p>
      </div>

      <div className="vacancy-published">
        {t("vacancies.published")}{" "}
        {created_at ? new Date(created_at).toLocaleDateString(i18n.language) : t("vacancies.view.notSpecified")}
      </div>
    </div>
  );
}
