import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../EmployerProfile.css";
import Modal from "../Modal";
import ProfileCard from "../ProfileCard";
import CreateVacancyForm from "../CreateVacancyForm";
import CompanyInfoSection from "./CompanyInfoSection";
import VacanciesSection from "./VacanciesSection";
import { api } from "../../api.js";
import i18n from "../../i18n/index.js";

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
  return { ...EMPTY_VACANCY };
}

function formatApiError(err, t) {
  const status = err?.response?.status;
  const data = err?.response?.data;
  
  // FastAPI / Pydantic v2 validation error: 422 + detail: array
  if (status === 422 && Array.isArray(data?.errors)) {
    const lines = data.errors.map((e) => {
      const field = Array.isArray(e.loc)
        ? e.loc.filter(Boolean).slice(1).join(".")
        : "field";
      // e.msg обычно на английском. Можно заменить на t(...) по e.type/field, если захочешь.\
      console.log(`${field}: ${e.msg}`)
      return `${field}: ${e.msg}`;
    });
    
    console.log(lines)
    return lines; // вернем массив строк
  }

  // обычный вариант: detail строкой
  const detail = data?.detail;
  if (typeof detail === "string" && detail.trim()) return detail;

  return t("employerProfile.errors.createFailed");
}

function validateVacancy(v, t) {
  if (!v.title.trim()) return t("employerProfile.validation.titleRequired");
  if (!v.description.trim())
    return t("employerProfile.validation.descriptionRequired");

  if (v.salary_from != null && Number.isNaN(v.salary_from))
    return t("employerProfile.validation.salaryFromNumber");
  if (v.salary_to != null && Number.isNaN(v.salary_to))
    return t("employerProfile.validation.salaryToNumber");

  if (v.salary_from != null && v.salary_from < 0)
    return t("employerProfile.validation.salaryFromNegative");
  if (v.salary_to != null && v.salary_to < 0)
    return t("employerProfile.validation.salaryToNegative");

  if (
    v.salary_from != null &&
    v.salary_to != null &&
    v.salary_from > v.salary_to
  ) {
    return t("employerProfile.validation.salaryFromGreaterThanTo");
  }
  return null;
}

export default function EmployerProfile({ user, updateProfile, logout }) {
  const { t } = useTranslation();

  const [showVacancyModal, setShowVacancyModal] = useState(false);

  const [vacancyForm, setVacancyForm] = useState(getEmptyVacancyForm());
  const [vacancyError, setVacancyError] = useState([]);
  const [vacancySaving, setVacancySaving] = useState(false);

  const [vacancies, setVacancies] = useState([]);
  const [vacanciesLoading, setVacanciesLoading] = useState(false);
  const [vacanciesLoadError, setVacanciesLoadError] = useState(null);
  const modalTitle = useMemo(() => t("employerProfile.modal.title"), [t]);

  useEffect(() => {
    const employerId = user?.employer_id;
    if (!employerId) return;

    let cancelled = false;

    async function loadVacancies() {
      setVacanciesLoading(true);
      setVacanciesLoadError(null);

      try {
        const { data } = await api.get(`/vacancies/employer/${employerId}`);
        const list = Array.isArray(data) ? data : (data?.items ?? []);
        if (!cancelled) setVacancies(list);
      } catch (err) {
        if (!cancelled) {
          const status = err?.response?.status ?? "?";
          const msg =
            err?.response?.data?.detail ||
            t("employerProfile.errors.loadFailed", { status });

          setVacanciesLoadError(msg);
          console.error("Load vacancies error:", err);
        }
      } finally {
        if (!cancelled) setVacanciesLoading(false);
      }
    }

    loadVacancies();

    return () => {
      cancelled = true;
    };
  }, [user?.employer_id, t]);

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
    const employerId = user?.employer_id;

    if (!employerId) {
      const error = new Error(t("employerProfile.errors.employerIdMissing"));
      error.code = "NO_EMPLOYER_ID";
      throw error;
    }

    const payloadWithEmployer = {
      ...payload,
      employer_id: employerId,
    };
    const lang = i18n.language;
    const { data: created } = await api.post(
      "/vacancies/",
      payloadWithEmployer,
      {
        headers: {
          "Accept-Language": lang,
        },
      }
    );
    return created;
  }

  async function handleVacancySubmit(e) {
    e.preventDefault();
    setVacancyError(null);

    // const err = validateVacancy(vacancyForm, t);
    // if (err) {
    //   setVacancyError(err);
    //   return;
    // }

    setVacancySaving(true);
    try {
      const created = await createVacancy(vacancyForm);
      setVacancies((prev) => [created, ...prev]);
      setShowVacancyModal(false);
    } catch (error) {
      console.error("create vacancy failed:", error);

      // axios обычно кладёт самое важное сюда:
      console.error("response:", error?.response);
      console.error("response.data:", error?.response?.data);
      console.error("status:", error?.response?.status);
      setVacancyError(formatApiError(error, t));
    } finally {
      setVacancySaving(false);
    }
  }

  return (
    <div className="employer-profile">
      <div className="employer-profile__header">
        <h2 className="employer-profile__title">{t("employerProfile.title")}</h2>
      </div>

      <div className="employer-profile__layout">
        <aside className="employer-profile__sidebar">
          <ProfileCard
            user={user}
            updateProfile={updateProfile}
            logout={logout}
          />
          <CompanyInfoSection user={user} />
        </aside>

        <VacanciesSection
          vacancies={vacancies}
          vacanciesLoading={vacanciesLoading}
          vacanciesLoadError={vacanciesLoadError}
          onCreateClick={openVacancyModal}
        />
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
              {t("employerProfile.modal.cancel")}
            </button>

            <button
              type="submit"
              form="create-vacancy-form"
              className="btn btn-success"
              disabled={vacancySaving}
            >
              {vacancySaving
                ? t("employerProfile.modal.submitting")
                : t("employerProfile.modal.submit")}
            </button>
          </>
        }
      >
        {/* {vacancyError && (
          <div className="alert alert-danger py-2">{vacancyError}</div>
        )} */}

        <form id="create-vacancy-form" onSubmit={handleVacancySubmit}>
          <CreateVacancyForm
            value={vacancyForm}
            onFieldChange={handleVacancyFieldChange}
            errorList={vacancyError}
          />
        </form>
      </Modal>
    </div>
  );
}
