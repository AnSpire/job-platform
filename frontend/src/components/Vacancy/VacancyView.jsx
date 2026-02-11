export default function VacancyView({ vacancy, isOwner, error, onEdit, onTranslate }) {
  const { title, location, employment_type, salary_from, salary_to, currency, description, requirements, responsibilities, created_at } = vacancy;

  return (
    <>
      <div className="d-flex justify-content-between align-items-start gap-3">
        <h1 className="card-title mb-3">{title}</h1>

        <div className="d-flex gap-2">
          {isOwner ? (
            <button className="btn btn-outline-primary" onClick={onEdit}>
              Редактировать
            </button>
          ) : null}
          {isOwner ? (
            <button className="btn btn-secondary" onClick={onTranslate}>
              Добавить перевод
            </button>
          ) : null}
        </div>
      </div>

      {error ? <div className="alert alert-danger mt-3 mb-0">{error}</div> : null}

      <div className="mb-3 text-muted mt-3">
        {location ? <span className="me-3">📍 {location}</span> : null}
        {employment_type ? <span>{employment_type}</span> : null}
      </div>

      {salary_from || salary_to ? (
        <div className="mb-4">
          <span className="badge bg-success fs-6">
            {salary_from ? `от ${salary_from} ` : ""}
            {salary_to ? `до ${salary_to} ` : ""}
            {currency ?? ""}
          </span>
        </div>
      ) : null}

      <div className="content-block list-group-item">
        <h5>Описание</h5>
        <p>{description}</p>
      </div>

      <div className="content-block list-group-item">
        <h5>Требования</h5>
        <p>{requirements}</p>
      </div>

      <div className="content-block list-group-item">
        <h5>Обязанности</h5>
        <p>{responsibilities}</p>
      </div>

      <hr />

      <div className="text-muted small">
        Опубликовано: {created_at ? new Date(created_at).toLocaleDateString() : "—"}
      </div>
    </>
  );
}
