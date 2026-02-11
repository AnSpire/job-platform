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

  return (
    <div className="vacancy-panel">
      <div className="vacancy-toolbar">
        <div>
          <h1 className="vacancy-title">{title}</h1>
          <div className="vacancy-meta">
            {location ? <span className="vacancy-chip">{location}</span> : null}
            {employment_type ? (
              <span className="vacancy-chip vacancy-chip--muted">{employment_type}</span>
            ) : null}
          </div>
        </div>

        <div className="vacancy-actions">
          {isOwner ? (
            <button className="btn btn-outline-primary" onClick={onEdit} type="button">
              Редактировать
            </button>
          ) : null}
          {isOwner ? (
            <button className="btn btn-secondary" onClick={onTranslate} type="button">
              Добавить перевод
            </button>
          ) : null}
          {isOwner ? (
            <button
              className="btn btn-danger"
              onClick={onDelete}
              disabled={deleting}
              type="button"
            >
              {deleting ? "Удаление..." : "Удалить"}
            </button>
          ) : null}
        </div>
      </div>

      {error ? <div className="alert alert-danger mt-3 mb-0">{error}</div> : null}

      {salary_from || salary_to ? (
        <div className="vacancy-salary">
          <span className="badge bg-success fs-6 px-3 py-2">
            {salary_from ? `от ${salary_from} ` : ""}
            {salary_to ? `до ${salary_to} ` : ""}
            {currency ?? ""}
          </span>
        </div>
      ) : null}

      <div className="vacancy-content-block">
        <h5>Описание</h5>
        <p>{description}</p>
      </div>

      <div className="vacancy-content-block">
        <h5>Требования</h5>
        <p>{requirements || "—"}</p>
      </div>

      <div className="vacancy-content-block">
        <h5>Обязанности</h5>
        <p>{responsibilities || "—"}</p>
      </div>

      <div className="vacancy-published">
        Опубликовано: {created_at ? new Date(created_at).toLocaleDateString() : "—"}
      </div>
    </div>
  );
}
