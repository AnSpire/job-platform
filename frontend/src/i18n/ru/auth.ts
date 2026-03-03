export default {
  login: {
    title: "Вход",
    email: "Email",
    password: "Пароль",
    emailPlaceholder: "example@mail.com",
    passwordPlaceholder: "••••••••",
    submit: "Войти",
    firstTime: "Впервые на сайте?",
    fallbackError: "Ошибка входа",
  },
  register: {
    title: "Регистрация",
    success: "Регистрация успешно завершена!",
    submit: "Зарегистрироваться",
    alreadyHaveAccount: "Уже есть аккаунт?",
    fields: {
      firstName: "Имя",
      email: "Email",
      password: "Пароль",
      confirmPassword: "Подтверждение пароля",
      role: "Роль",
      rolePlaceholder: "Выберите роль",
    },
    roles: {
      student: "Студент",
      employer: "Наниматель",
    },
    validation: {
      nameRequired: "Введите имя",
      invalidEmail: "Некорректный email",
      passwordTooShort: "Пароль должен содержать минимум 6 символов",
      passwordsMismatch: "Пароли не совпадают",
      roleRequired: "Выберите роль",
    },
    errors: {
      fallback: "Ошибка при регистрации",
      network: "Не удалось подключиться к серверу.",
    },
  },
};
