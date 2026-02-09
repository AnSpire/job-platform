import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

function formatSalary(v) {
  const { salary_from, salary_to, currency } = v;
  if (salary_from == null && salary_to == null) return "Зарплата не указана";

  if (salary_from != null && salary_to != null) {
    return `от ${salary_from} до ${salary_to} ${currency ?? ""}`.trim();
  }

  if (salary_from != null) {
    return `от ${salary_from} ${currency ?? ""}`.trim();
  }

  return `до ${salary_to} ${currency ?? ""}`.trim();
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}

export default function VacanciesList() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          const msg =
            err?.response?.data?.detail ||
            `Не удалось загрузить вакансии (HTTP ${err?.response?.status ?? "?"})`;
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
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="mb-1">Все вакансии</h2>
          <div className="text-muted small">Найдено: {vacancies.length}</div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
          <div className="text-muted mt-3">Загрузка вакансий...</div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : vacancies.length === 0 ? (
        <div className="alert alert-warning">Пока нет доступных вакансий</div>
      ) : (
        <div className="row g-4">
          {vacancies.map((v) => (
            <div className="col-12 col-md-6 col-lg-4" key={v.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{v.title}</h5>
                    <span className="badge bg-primary">{v.employment_type || "—"}</span>
                  </div>

                  <div className="text-muted small mb-2">📍 {v.location || "Локация не указана"}</div>

                  <p className="card-text mb-3">
                    {(v.description || "Описание отсутствует").slice(0, 140)}
                    {(v.description || "").length > 140 ? "..." : ""}
                  </p>

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge bg-success">{formatSalary(v)}</span>
                  </div>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="text-muted small">
                      Опубликовано: {formatDate(v.created_at) || "—"}
                    </span>
                    <Link to={`/vacancies/${v.id}`} className="btn btn-outline-primary btn-sm">
                      Открыть
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
