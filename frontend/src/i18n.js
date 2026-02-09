import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ru: {
    translation: {
      header: {
        logoAlt: "StartCareer логотип",
        nav: {
          about: "О нас",
          vacancies: "Вакансии",
          companies: "Компании",
          courses: "Курсы",
          blog: "Блог",
          contacts: "Контакты",
        },
        more: "Еще",
        login: "Войти",
        profile: "Профиль",
        lang: {
          aria: "Выбор языка",
        },
        aria: {
          primary: "Основная навигация",
          mobile: "Мобильная навигация",
          openMenu: "Открыть меню",
        },
      },
      footer: {
        companyTitle: "StartCareer",
        companyDescription: "Короткое описание компании или слоган.",
        navigationTitle: "Навигация",
        nav: {
          home: "Главная",
          about: "О компании",
          services: "Услуги",
          contacts: "Контакты",
        },
        contactsTitle: "Контакты",
        contacts: {
          email: "Email: info@company.com",
          phone: "Телефон: +7 (000) 000-00-00",
          address: "Адрес: Москва",
        },
        rights: "Все права защищены.",
      },
       vacancies: {
        title: "Все вакансии",
        found: "Найдено: {{count}}",
        loading: "Загрузка вакансий...",
        empty: "Пока нет доступных вакансий",
        open: "Открыть",
        published: "Опубликовано:",
        locationPrefix: "📍",
        locationNotSpecified: "Локация не указана",
        noDescription: "Описание отсутствует",
        errors: {
          loadFailed: "Не удалось загрузить вакансии (HTTP {{status}})"
        },
        salary: {
          notSpecified: "Зарплата не указана",
          range: "от {{from}} до {{to}} {{currency}}",
          from: "от {{from}} {{currency}}",
          to: "до {{to}} {{currency}}"
        },
        employment: {
          full_time: "Полная занятость",
          part_time: "Частичная занятость",
          contract: "Контракт",
          internship: "Стажировка",
          remote: "Удалённо"
        }
      }
    },
  },
  en: {
    translation: {
      header: {
        logoAlt: "StartCareer logo",
        nav: {
          about: "About us",
          vacancies: "Vacancies",
          companies: "Companies",
          courses: "Courses",
          blog: "Blog",
          contacts: "Contacts",
        },
        more: "More",
        login: "Sign in",
        profile: "Profile",
        lang: {
          aria: "Language selector",
        },
        aria: {
          primary: "Primary navigation",
          mobile: "Mobile navigation",
          openMenu: "Open menu",
        },
      },
      footer: {
        companyTitle: "StartCareer",
        companyDescription: "A short company description or slogan.",
        navigationTitle: "Navigation",
        nav: {
          home: "Home",
          about: "About the company",
          services: "Services",
          contacts: "Contacts",
        },
        contactsTitle: "Contacts",
        contacts: {
          email: "Email: info@company.com",
          phone: "Phone: +7 (000) 000-00-00",
          address: "Address: Moscow",
        },
        rights: "All rights reserved.",
      },
       vacancies: {
        title: "All vacancies",
        found: "Found: {{count}}",
        loading: "Loading vacancies...",
        empty: "No vacancies available yet",
        open: "Open",
        published: "Published:",
        locationPrefix: "📍",
        locationNotSpecified: "Location not specified",
        noDescription: "No description",
        errors: {
          loadFailed: "Failed to load vacancies (HTTP {{status}})"
        },
        salary: {
          notSpecified: "Salary not specified",
          range: "from {{from}} to {{to}} {{currency}}",
          from: "from {{from}} {{currency}}",
          to: "up to {{to}} {{currency}}"
        },
        employment: {
          full_time: "Full-time",
          part_time: "Part-time",
          contract: "Contract",
          internship: "Internship",
          remote: "Remote"
        }
      }
    },
  },
  es: {
    translation: {
      header: {
        logoAlt: "Logo de StartCareer",
        nav: {
          about: "Sobre nosotros",
          vacancies: "Vacantes",
          companies: "Empresas",
          courses: "Cursos",
          blog: "Blog",
          contacts: "Contacto",
        },
        more: "Más",
        login: "Iniciar sesión",
        profile: "Perfil",
        lang: {
          aria: "Selector de idioma",
        },
        aria: {
          primary: "Navegación principal",
          mobile: "Navegación móvil",
          openMenu: "Abrir menú",
        },
      },
      footer: {
        companyTitle: "StartCareer",
        companyDescription: "Una breve descripcion de la empresa o eslogan.",
        navigationTitle: "Navegacion",
        nav: {
          home: "Inicio",
          about: "Sobre la empresa",
          services: "Servicios",
          contacts: "Contacto",
        },
        contactsTitle: "Contactos",
        contacts: {
          email: "Email: info@company.com",
          phone: "Telefono: +7 (000) 000-00-00",
          address: "Direccion: Moscu",
        },
        rights: "Todos los derechos reservados.",
      },
      vacancies: {
        title: "Todas las vacantes",
        found: "Encontradas: {{count}}",
        loading: "Cargando vacantes...",
        empty: "Aún no hay vacantes disponibles",
        open: "Abrir",
        published: "Publicado:",
        locationPrefix: "📍",
        locationNotSpecified: "Ubicación no especificada",
        noDescription: "Sin descripción",
        errors: {
          loadFailed: "No se pudieron cargar las vacantes (HTTP {{status}})",
        },
        salary: {
          notSpecified: "Salario no especificado",
          range: "de {{from}} a {{to}} {{currency}}",
          from: "desde {{from}} {{currency}}",
          to: "hasta {{to}} {{currency}}",
        },
        employment: {
          full_time: "Tiempo completo",
          part_time: "Medio tiempo",
          contract: "Contrato",
          internship: "Prácticas",
          remote: "Remoto",
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ru",
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
