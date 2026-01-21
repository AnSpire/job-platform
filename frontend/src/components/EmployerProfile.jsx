import { useMemo, useState } from "react";
import "./EmployerProfile.css";
import "./Vacancy.css";
import Modal from "./Modal";
import ProfileCard from "./ProfileCard";
import CreateVacancyForm from "./CreateVacancyForm";

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

  if (v.salary_from != null && Number.isNaN(v.salary_from)) return "salary_from должно быть числом";
  if (v.salary_to != null && Number.isNaN(v.salary_to)) return "salary_to должно быть числом";

  if (v.salary_from != null && v.salary_from < 0) return "salary_from не может быть отрицательной";
  if (v.salary_to != null && v.salary_to < 0) return "salary_to не может быть отрицательной";

  if (v.salary_from != null && v.salary_to != null && v.salary_from > v.salary_to) {
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

  const modalTitle = useMemo(() => "Создать вакансию", []);

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
      setVacancyForm((prev) => ({ ...prev, [name]: v === "" ? null : Number(v) }));
      return;
    }
    setVacancyForm((prev) => ({ ...prev, [name]: value }));
  }

  async function createVacancy(payload) {
    // TODO: подключи свой клиент:
    // const { data } = await api.post("/api/v1/vacancies", payload);
    // return data;
    console.log("CREATE VACANCY payload:", payload);

    // имитируем возврат созданной вакансии:
    return { id: crypto.randomUUID(), ...payload };
  }

  async function handleVacancySubmit(e) {
    e.preventDefault();
    setVacancyError(null);

    const err = validateVacancy(vacancyForm);

    alert("submit")
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
      setVacancyError(error?.response?.data?.detail || "Не удалось создать вакансию");
    } finally {
      setVacancySaving(false);
    }
  }

  return (
    <div className="employer-profile">
      <h2 className="mb-5">Личный кабинет работодателя</h2>

      <div className="d-flex">
        <ProfileCard user={user} updateProfile={updateProfile} logout={logout} />

        <div className="vacancies ps-3">
          <div className="top-side d-flex justify-content-between">
            <h3 className="mb-3">Мои вакансии</h3>
            <button className="btn btn-success" onClick={openVacancyModal}>
              Создать вакансию
            </button>
          </div>

          <div className="vacancies-list">
            {vacancies.length === 0 ? (
              "Нет активных вакансий"
            ) : (
              <ul className="list-group">
                {vacancies.map((v) => (
                  <li key={v.id} className="list-group-item">
                    <div className="fw-semibold">{v.title}</div>
                    <div className="text-muted small">{v.location || "—"}</div>
                  </li>
                ))}
              </ul>
            )}
            {/* TODO: get api/v1/my-vacancies */}
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
        {vacancyError && <div className="alert alert-danger py-2">{vacancyError}</div>}

        <form id="create-vacancy-form" onSubmit={handleVacancySubmit}>
          <CreateVacancyForm value={vacancyForm} onFieldChange={handleVacancyFieldChange} />
        </form>
      </Modal>
    </div>
  );
}
