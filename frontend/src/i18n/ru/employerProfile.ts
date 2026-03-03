export default {
  title: "Личный кабинет работодателя",
  myVacancies: "Мои вакансии",
  createVacancy: "Создать вакансию",

  profile: {
    role: "Роль",
    firstName: "Имя",
    lastName: "Фамилия",
    emptyValue: "Не указано",
    edit: "Редактировать",
    logout: "Выйти",
    save: "Сохранить",
    cancel: "Отмена",
    firstNamePlaceholder: "Введите имя",
    lastNamePlaceholder: "Введите фамилию",
  },

  company: {
    title: "Компания работодателя",
    liveBadge: "Live",
    industry: "Сфера",
    location: "Локация",
    website: "Сайт",
    about: "О компании",
    loading: "Загрузка информации о компании...",
    employerMissing: "У текущего пользователя не найден employer_id.",
    notAssigned: "Сейчас работодателю не присвоена никакая компания.",
    fetchError: "Не удалось загрузить информацию о компании (HTTP {{status}})",
    noData: "Не указано",
    websiteUnavailable: "Сайт не указан",
    locationUnavailable: "Локация не указана",
    descriptionUnavailable: "Описание пока отсутствует",
    logoAlt: "Логотип компании {{name}}",
  },

  vacancies: {
    loading: "Загрузка вакансий...",
    empty: "Нет активных вакансий",
    locationFallback: "—",
    subtitle: "Управляйте публикациями и отслеживайте открытые позиции",
  },

  modal: {
    title: "Создать вакансию",
    cancel: "Отмена",
    submit: "Создать",
    submitting: "Создание...",
  },

  vacancyForm: {
    fields: {
      title: "Название",
      description: "Описание",
      requirements: "Требования",
      responsibilities: "Обязанности",
      salaryFrom: "Зарплата от",
      salaryTo: "Зарплата до",
      currency: "Валюта",
      location: "Локация",
      employmentType: "Тип занятости",
    },
    placeholders: {
      currency: "EUR, USD...",
    },
    employment: {
      notSelected: "(не выбрано)",
    },
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
