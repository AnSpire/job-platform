export default {
  title: "Личный кабинет работодателя",
  myVacancies: "Мои вакансии",
  createVacancy: "Создать вакансию",

  vacancies: {
    loading: "Загрузка вакансий...",
    empty: "Нет активных вакансий",
    locationFallback: "—",
  },

  modal: {
    title: "Создать вакансию",
    cancel: "Отмена",
    submit: "Создать",
    submitting: "Создание...",
  },

  errors: {
    createFailed: "Не удалось создать вакансию",
    loadFailed: "Не удалось загрузить вакансии (HTTP {{status}})",
    employerIdMissing: "ID работодателя отсутствует",
  },

  validation: {
    titleRequired: "Поле «Название» обязательно",
    descriptionRequired: "Поле «Описание» обязательно",
    salaryFromNumber: "Минимальная зарплата должна быть числом",
    salaryToNumber: "Максимальная зарплата должна быть числом",
    salaryFromNegative: "Минимальная зарплата не может быть отрицательной",
    salaryToNegative: "Максимальная зарплата не может быть отрицательной",
    salaryFromGreaterThanTo:
      "Минимальная зарплата не может быть больше максимальной",
  },
};
