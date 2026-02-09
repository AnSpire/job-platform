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
