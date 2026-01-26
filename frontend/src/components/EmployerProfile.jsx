import { useMemo, useState, useEffect } from "react";
import "./EmployerProfile.css";
// import "./Vacancy.css";
import Modal from "./Modal";
import ProfileCard from "./ProfileCard";
import CreateVacancyForm from "./CreateVacancyForm";
import { api } from "../api.js";
import { Link } from "react-router";

const EMPTY_VACANCY = {
  title: "",
  description: "",
  requirements: "",
  responsibilities: "",
  salary_from: null,
  salary_to: null,
  currency: "",
  location: "",
  employment_type: "",
};

function getEmptyVacancyForm() {
  // если захочешь — тут можно добавить значения по умолчанию
  return { ...EMPTY_VACANCY };
}

function validateVacancy(v) {
  if (!v.title.trim()) return "Поле title (Название) обязательно";
  if (!v.description.trim()) return "Поле description (Описание) обязательно";

  if (v.salary_from != null && Number.isNaN(v.salary_from))
    return "salary_from должно быть числом";
  if (v.salary_to != null && Number.isNaN(v.salary_to))
    return "salary_to должно быть числом";

  if (v.salary_from != null && v.salary_from < 0)
    return "salary_from не может быть отрицательной";
  if (v.salary_to != null && v.salary_to < 0)
    return "salary_to не может быть отрицательной";

  if (
    v.salary_from != null &&
    v.salary_to != null &&
    v.salary_from > v.salary_to
  ) {
    return "salary_from не может быть больше salary_to";
  }
  return null;
}

export default function EmployerProfile({ user, updateProfile, logout }) {
  const [showVacancyModal, setShowVacancyModal] = useState(false);

  const [vacancyForm, setVacancyForm] = useState(getEmptyVacancyForm());
  const [vacancyError, setVacancyError] = useState(null);
  const [vacancySaving, setVacancySaving] = useState(false);

  // (опционально) если будешь хранить список вакансий
  const [vacancies, setVacancies] = useState([]);
  const [vacanciesLoading, setVacanciesLoading] = useState(false);
  const [vacanciesLoadError, setVacanciesLoadError] = useState(null);

  const modalTitle = useMemo(() => "Создать вакансию", []);
  useEffect(() => {
    const employerId = user?.employer_id;

    // пока employer_id нет — ничего не грузим
    if (!employerId) return;

    let cancelled = false;

    async function loadVacancies() {
      setVacanciesLoading(true);
      setVacanciesLoadError(null);

      try {
        const { data } = await api.get(`/vacancies/employer/${employerId}`);

        // если бэк возвращает не массив, а { items: [...] } — подстрой здесь
        const list = Array.isArray(data) ? data : (data?.items ?? []);

        if (!cancelled) setVacancies(list);
      } catch (err) {
        if (!cancelled) {
          const msg =
            err?.response?.data?.detail ||
            `Не удалось загрузить вакансии (HTTP ${err?.response?.status ?? "?"})`;

          setVacanciesLoadError(msg);

          // опционально: лог
          if (err.response) {
            console.error("Load vacancies error:", {
              status: err.response.status,
              data: err.response.data,
            });
          } else {
            console.error("Load vacancies error:", err);
          }
        }
      } finally {
        if (!cancelled) setVacanciesLoading(false);
      }
    }

    loadVacancies();

    return () => {
      cancelled = true; // чтобы не сетать стейт после размонтирования
    };
  }, [user?.employer_id]);

  function openVacancyModal() {
    setVacancyError(null);
    setVacancyForm(getEmptyVacancyForm());
    setShowVacancyModal(true);
  }

  function closeVacancyModal() {
    if (vacancySaving) return;
    setShowVacancyModal(false);
  }

  function handleVacancyFieldChange(name, value) {
    // salary хотим хранить number|null
    if (name === "salary_from" || name === "salary_to") {
      const v = String(value).trim();
      setVacancyForm((prev) => ({
        ...prev,
        [name]: v === "" ? null : Number(v),
      }));
      return;
    }
    setVacancyForm((prev) => ({ ...prev, [name]: value }));
  }

  async function createVacancy(payload) {
    try {
      // const { data } = await api.get("/users/my_employer_id");
      const employerId = user?.employer_id;

      if (!employerId) {
        const error = new Error("Employer ID is missing");
        error.code = "NO_EMPLOYER_ID";
        throw error;
      }

      const payloadWithEmployer = {
        ...payload,
        employer_id: employerId,
        // employer_id: data.employer_id,
      };
      const { data: created } = await api.post(
        "/vacancies/",
        payloadWithEmployer,
      );
      return created;
    } catch (err) {
      if (err.response) {
        // ответ пришёл от бэка (4xx / 5xx)
        console.error("Create vacancy error:", {
          status: err.response.status,
          data: err.response.data,
        });
      } else if (err.request) {
        // запрос ушёл, но ответа нет
        console.error("Create vacancy: no response from server", err.request);
      } else {
        // ошибка до отправки запроса
        console.error("Create vacancy: request setup error", err.message);
      }

      throw err; // важно: не глотаем ошибку
    }
  }

  async function handleVacancySubmit(e) {
    e.preventDefault();
    setVacancyError(null);

    const err = validateVacancy(vacancyForm);

    if (err) {
      setVacancyError(err);
      return;
    }

    setVacancySaving(true);
    try {
      const created = await createVacancy(vacancyForm);

      // если ведёшь список — обнови его сразу
      setVacancies((prev) => [created, ...prev]);

      setShowVacancyModal(false);
    } catch (error) {
      setVacancyError(
        error?.response?.data?.detail || "Не удалось создать вакансию",
      );
    } finally {
      setVacancySaving(false);
    }
  }

  return (
    <div className="employer-profile">
      <h2 className="mb-5">Личный кабинет работодателя</h2>

      <div className="d-flex">
        <ProfileCard
          user={user}
          updateProfile={updateProfile}
          logout={logout}
        />

        <div className="vacancies ps-3">
          <div className="top-side d-flex justify-content-between">
            <h3 className="mb-3">Мои вакансии</h3>
            <button className="btn btn-success" onClick={openVacancyModal}>
              Создать вакансию
            </button>
          </div>

          <div className="vacancies-list">
            {vacanciesLoading ? (
              <div className="text-muted">Загрузка вакансий...</div>
            ) : vacancies.length === 0 ? (
              <div className="text-muted">Нет активных вакансий</div>
            ) : (
              <ul className="list-group">
                {vacancies.map((v) => (
                  <li
                    key={v.id}
                    className="list-group-item list-group-item-action"
                  >
                    <Link to={`/vacancies/${v.id}`}>
                      <div className="fw-semibold">{v.title}</div>
                      <div className="text-muted small">
                        {v.location || "—"}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={showVacancyModal}
        onClose={closeVacancyModal}
        title={modalTitle}
        disableClose={vacancySaving}
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeVacancyModal}
              disabled={vacancySaving}
            >
              Отмена
            </button>

            <button
              type="submit"
              form="create-vacancy-form"
              className="btn btn-success"
              disabled={vacancySaving}
            >
              {vacancySaving ? "Создание..." : "Создать"}
            </button>
          </>
        }
      >
        {vacancyError && (
          <div className="alert alert-danger py-2">{vacancyError}</div>
        )}

        <form id="create-vacancy-form" onSubmit={handleVacancySubmit}>
          <CreateVacancyForm
            value={vacancyForm}
            onFieldChange={handleVacancyFieldChange}
          />
        </form>
      </Modal>
    </div>
  );
}
