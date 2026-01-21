import { useState } from "react";
import "./EmployerProfile.css";
import "./Vacancy.css";
import CreateVacancy from "./CreateVacancy";
import Modal from "./Modal";
import ProfileCard from "./ProfileCard";


export default function EmployerProfile({ user, updateProfile, logout }) {

  const [showVacancyModal, setShowVacancyModal] = useState(false);
  const [vacancyForm, setVacancyForm] = useState(getEmptyVacancyForm());
  const [vacancyError, setVacancyError] = useState(null);
  const [vacancySaving, setVacancySaving] = useState(false);


  function openVacancyModal() {
    setVacancyError(null);
    setVacancyForm(getEmptyVacancyForm());
    setShowVacancyModal(true);
  }

  function closeVacancyModal() {
    if (vacancySaving) return;
    setShowVacancyModal(false);
  }

  function handleVacancyChange(e) {
    const { name, value } = e.target;

    // salary поля хотим хранить как number|null
    if (name === "salary_from" || name === "salary_to") {
      const v = value.trim();
      setVacancyForm((prev) => ({
        ...prev,
        [name]: v === "" ? null : Number(v),
      }));
      return;
    }

    setVacancyForm((prev) => ({ ...prev, [name]: value }));
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

  async function createVacancy(payload) {
    // TODO: подключи свой клиент:
    // await api.post("/api/v1/vacancies", payload)
    // или "/api/v1/my-vacancies"
    console.log("CREATE VACANCY payload:", payload);
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
      await createVacancy(vacancyForm);
      setShowVacancyModal(false);
      // TODO: после успешного создания можно перезагрузить список вакансий
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
            Нет активный вакансий
            {/* TODO: get api/v1/my-vacancies */}
          </div>
        </div>
      </div>
      <Modal
        open={showVacancyModal}
        onClose={() => setShowVacancyModal(false)}
        title="Создать вакансию"
        disableClose={vacancySaving /* или стейт из родителя, если хочешь */}
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowVacancyModal(false)}
            >
              Отмена
            </button>
            <button
              type="submit"
              form="create-vacancy-form"
              className="btn btn-success"
            >
              Создать
            </button>
          </>
        }
      >
        <CreateVacancy
          open={showVacancyModal}
          onClose={() => setShowVacancyModal(false)}
          createVacancy={createVacancy}
          onCreated={() => {}}
        />
      </Modal>

    
    </div>
  );
}

function getEmptyVacancyForm() {
  return {
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
}
