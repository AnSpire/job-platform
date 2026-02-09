import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api.js";

function formatSalary(v, t) {
  const { salary_from, salary_to, currency } = v;

  if (salary_from == null && salary_to == null) return t("vacancies.salary.notSpecified");

  const cur = currency ?? "";

  if (salary_from != null && salary_to != null) {
    return t("vacancies.salary.range", { from: salary_from, to: salary_to, currency: cur }).trim();
  }

  if (salary_from != null) {
    return t("vacancies.salary.from", { from: salary_from, currency: cur }).trim();
  }

  return t("vacancies.salary.to", { to: salary_to, currency: cur }).trim();
}

function formatDate(value, language) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(language); // важно: под язык
}

export default function VacanciesList() {
  const { t, i18n } = useTranslation();

  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // словарь для employment_type -> ключ переводов
  const employmentKey = useMemo(
    () => ({
      full_time: "vacancies.employment.full_time",
      part_time: "vacancies.employment.part_time",
      contract: "vacancies.employment.contract",
      internship: "vacancies.employment.internship",
      remote: "vacancies.employment.remote",
      // добавь свои варианты, если есть
    }),
    []
  );

  const translateEmployment = (value) => {
    if (!value) return t("common.dash"); // "—"
    const key = employmentKey[value];
    // если пришло уже "Full-time" или "Полная занятость" — покажем как есть
    return key ? t(key) : value;
  };

  useEffect(() => {
    let cancelled = false;

    async function loadVacancies() {
      setLoading(true);
      setError(null);

      try {
        const { data } = await api.get("/vacancies");
        const list = Array.isArray(data) ? data : (data?.items ?? []);
        if (!cancelled) setVacancies(list);
      } catch (err) {
        if (!cancelled) {
          const status = err?.response?.status ?? "?";
          const detail = err?.response?.data?.detail;

          const msg =
            detail ||
            t("vacancies.errors.loadFailed", { status });

          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadVacancies();

    return () => {
      cancelled = true;
    };
  }, [t]);

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="mb-1">{t("vacancies.title")}</h1>
          <div className="text-muted small">
            {t("vacancies.found", { count: vacancies.length })}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
          <div className="text-muted mt-3">{t("vacancies.loading")}</div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : vacancies.length === 0 ? (
        <div className="alert alert-warning">{t("vacancies.empty")}</div>
      ) : (
        <div className="row g-4">
          {vacancies.map((v) => (
            <div className="col-12 col-md-6 col-lg-4" key={v.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{v.title}</h5>
                    <span className="badge bg-primary">
                      {translateEmployment(v.employment_type)}
                    </span>
                  </div>

                  <div className="text-muted small mb-2">
                    {t("vacancies.locationPrefix")} {v.location || t("vacancies.locationNotSpecified")}
                  </div>

                  <p className="card-text mb-3">
                    {(v.description || t("vacancies.noDescription")).slice(0, 140)}
                    {(v.description || "").length > 140 ? "..." : ""}
                  </p>

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge bg-success">{formatSalary(v, t)}</span>
                  </div>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="text-muted small">
                      {t("vacancies.published")}{" "}
                      {formatDate(v.created_at, i18n.language) || t("common.dash")}
                    </span>
                    <Link to={`/vacancies/${v.id}`} className="btn btn-outline-primary btn-sm">
                      {t("vacancies.open")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
