import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function VacanciesSection({
  vacancies,
  vacanciesLoading,
  vacanciesLoadError,
  onCreateClick,
}) {
  const { t } = useTranslation();

  return (
    <section className="employer-vacancies-card">
      <div className="employer-vacancies-card__top">
        <div>
          <h3>{t("employerProfile.myVacancies")}</h3>
          <p>{t("employerProfile.vacancies.subtitle")}</p>
        </div>
        <button
          className="employer-vacancies-card__create-btn"
          onClick={onCreateClick}
          type="button"
        >
          {t("employerProfile.createVacancy")}
        </button>
      </div>

      <div className="employer-vacancies-card__list-wrap">
        {vacanciesLoading ? (
          <div className="employer-vacancies-card__hint">
            {t("employerProfile.vacancies.loading")}
          </div>
        ) : vacancies.length === 0 ? (
          <div className="employer-vacancies-card__hint">
            {t("employerProfile.vacancies.empty")}
          </div>
        ) : (
          <ul className="employer-vacancies-card__list">
            {vacancies.map((vacancy) => (
              <li key={vacancy.id} className="employer-vacancies-card__item">
                <Link
                  to={`/vacancies/${vacancy.id}`}
                  className="employer-vacancies-card__link"
                >
                  <div className="employer-vacancies-card__item-top">
                    <div className="employer-vacancies-card__item-title">
                      {vacancy.title}
                    </div>
                    {vacancy.employment_type && (
                      <span className="employer-vacancies-card__item-type">
                        {vacancy.employment_type}
                      </span>
                    )}
                  </div>
                  <div className="employer-vacancies-card__item-location">
                    {vacancy.location ||
                      t("employerProfile.vacancies.locationFallback")}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {vacanciesLoadError && (
          <div className="alert alert-danger py-2 mt-3" role="alert">
            {vacanciesLoadError}
          </div>
        )}
      </div>
    </section>
  );
}
