import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
import VacancyView from "./VacancyView.jsx";
import VacancyEditForm from "./VacancyEditForm.jsx";
import VacancyTranslationForm from "./VacancyTranslationForm";
import "./Vacancy.css";

const EMPTY_FORM = {
  title: "",
  description: "",
  requirements: "",
  responsibilities: "",
  salary_from: "",
  salary_to: "",
  currency: "",
  location: "",
  employment_type: "",
};

const EMPTY_TRANSLATION_FORM = {
  lang: "en",
  title: "",
  location: "",
  description: "",
  requirements: "",
  responsibilities: "",
};

function mapVacancyToForm(vacancy) {
  if (!vacancy) return EMPTY_FORM;

  return {
    title: vacancy.title ?? "",
    description: vacancy.description ?? "",
    requirements: vacancy.requirements ?? "",
    responsibilities: vacancy.responsibilities ?? "",
    salary_from: vacancy.salary_from ?? "",
    salary_to: vacancy.salary_to ?? "",
    currency: vacancy.currency ?? "",
    location: vacancy.location ?? "",
    employment_type: vacancy.employment_type ?? "",
  };
}

function mapVacancyToTranslationForm(vacancy) {
  if (!vacancy) return EMPTY_TRANSLATION_FORM;

  return {
    lang: ["ru", "en", "es"].includes(i18n.language) ? i18n.language : "en",
    title: vacancy.title ?? "",
    location: vacancy.location ?? "",
    description: vacancy.description ?? "",
    requirements: vacancy.requirements ?? "",
    responsibilities: vacancy.responsibilities ?? "",
  };
}

function normalizePayload(form) {
  const toNumberOrNull = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  };

  return {
    title: form.title.trim(),
    description: form.description.trim(),
    requirements: form.requirements.trim() || null,
    responsibilities: form.responsibilities.trim() || null,
    salary_from: toNumberOrNull(form.salary_from),
    salary_to: toNumberOrNull(form.salary_to),
    currency: form.currency.trim() || null,
    location: form.location.trim() || null,
    employment_type: form.employment_type.trim() || null,
  };
}

function normalizeTranslationPayload(form) {
  return {
    title: form.title.trim(),
    location: form.location.trim() || null,
    description: form.description.trim(),
    requirements: form.requirements.trim() || null,
    responsibilities: form.responsibilities.trim() || null,
  };
}

export default function VacancyPage() {
  const { i18n } = useTranslation();
  const { vacancyId } = useParams();
  const { user } = useAuth();

  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [mode, setMode] = useState("view");
  const [form, setForm] = useState(EMPTY_FORM);
  const [translationForm, setTranslationForm] = useState(EMPTY_TRANSLATION_FORM);

  useEffect(() => {
    async function fetchVacancy() {
      setLoading(true);
      setError(null);
      // alert("get")
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
  }, [vacancyId, i18n.language]);

  useEffect(() => {
    if (!vacancy || mode !== "view") return;
    setForm(mapVacancyToForm(vacancy));
    setTranslationForm(mapVacancyToTranslationForm(vacancy));
  }, [vacancy, mode]);

  const canShowSalary = useMemo(
    () => form.salary_from !== "" || form.salary_to !== "",
    [form.salary_from, form.salary_to]
  );

  const isOwner = useMemo(() => {
    if (!user?.employer_id || !vacancy) return false;
    return vacancy.employer_id === user.employer_id;
  }, [user, vacancy]);

  useEffect(() => {
    if (mode !== "view" && !isOwner) {
      setMode("view");
    }
  }, [mode, isOwner]);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onTranslationChange(event) {
    const { name, value } = event.target;
    setTranslationForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit() {
    if (!isOwner || !vacancy) return;
    setForm(mapVacancyToForm(vacancy));
    setMode("edit");
    setError(null);
  }

  function startTranslate() {
    if (!isOwner || !vacancy) return;
    setTranslationForm(mapVacancyToTranslationForm(vacancy));
    setMode("translate");
    setError(null);
  }

  function cancelForm() {
    setMode("view");
    setError(null);
  }

  async function save() {
    if (!isOwner) return;

    setSaving(true);
    setError(null);

    try {
      const payload = normalizePayload(form);
      const response = await api.patch(`/vacancies/${vacancyId}`, payload);
      setVacancy(response.data);
      setMode("view");
    } catch {
      setError("Не удалось сохранить изменения");
    } finally {
      setSaving(false);
    }
  }

  async function saveTranslation() {
    if (!isOwner) return;

    setSaving(true);
    setError(null);

    try {
      const payload = normalizeTranslationPayload(translationForm);
      await api.put(`/vacancies/${vacancyId}/translations/${translationForm.lang}`, payload);
      setMode("view");
    } catch (error) {
      console.error("Ошибка при сохранении перевода:", error);

      // если это axios — можно вывести подробнее
      if (error.response) {
        console.error("Ответ сервера:", error.response.data);
        console.error("Статус:", error.response.status);
      }

      setError("Не удалось сохранить перевод");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (error && !vacancy) {
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

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body list-group">
              {mode === "edit" ? (
                <VacancyEditForm
                  form={form}
                  saving={saving}
                  error={error}
                  canShowSalary={canShowSalary}
                  onChange={onChange}
                  onSave={save}
                  onCancel={cancelForm}
                />
              ) : mode === "translate" ? (
                <VacancyTranslationForm
                  form={translationForm}
                  saving={saving}
                  error={error}
                  onChange={onTranslationChange}
                  onSave={saveTranslation}
                  onCancel={cancelForm}
                />
              ) : (
                <VacancyView
                  vacancy={vacancy}
                  isOwner={isOwner}
                  error={error}
                  onEdit={startEdit}
                  onTranslate={startTranslate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
