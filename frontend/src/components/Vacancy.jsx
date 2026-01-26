import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import "./Vacancy.css"

export default function Vacancy() {
  const { vacancyId } = useParams();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVacancy() {
      try {
        const response = await api.get(`/vacancies/${vacancyId}`);
        setVacancy(response.data);
      } catch {
        setError("Не удалось загрузить вакансию");
      } finally {
        setLoading(false);
      }
    }

    fetchVacancy();
  }, [vacancyId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">Вакансия не найдена</div>
      </div>
    );
  }

  const {
    title,
    description,
    requirements,
    responsibilities,
    salary_from,
    salary_to,
    currency,
    location,
    employment_type,
    created_at,
  } = vacancy;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="">
            <div className="card-body list-group">
              <h1 className="card-title mb-3">{title}</h1>

              <div className="mb-3 text-muted">
                {location && <span className="me-3">📍 {location}</span>}
                {employment_type && <span>{employment_type}</span>}
              </div>

              {(salary_from || salary_to) && (
                <div className="mb-4">
                  <span className="badge bg-success fs-6">
                    {salary_from && `от ${salary_from} `}
                    {salary_to && `до ${salary_to} `}
                    {currency ?? ""}
                  </span>
                </div>
              )}
              <div className="content-block list-group-item">
                <h5>Описание</h5>
                <p>{description}</p>
              </div>

              {requirements && (
                <div className="content-block list-group-item">
                  <h5>Требования</h5>
                  <p>{requirements}</p>
                </div>
              )}

              {responsibilities && (
                <div className="content-block list-group-item">
                  <h5>Обязанности</h5>
                  <p>{responsibilities}</p>
                </div>
              )}

              <hr />

              <div className="text-muted small">
                Опубликовано: {new Date(created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
