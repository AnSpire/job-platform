import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import headerRu from "./ru/header";
import footerRu from "./ru/footer";
import vacanciesRu from "./ru/vacancies";
import employerProfileRu from "./ru/employerProfile";

import headerEn from "./en/header";
import footerEn from "./en/footer";
import vacanciesEn from "./en/vacancies";
import employerProfileEn from "./en/employerProfile";

import headerEs from "./es/header";
import footerEs from "./es/footer";
import vacanciesEs from "./es/vacancies";
import employerProfileEs from "./es/employerProfile";

const resources = {
  ru: {
    translation: {
      header: headerRu,
      footer: footerRu,
      vacancies: vacanciesRu,
      employerProfile: employerProfileRu
    },
  },
  en: {
    translation: {
      header: headerEn,
      footer: footerEn,
      vacancies: vacanciesEn,
      employerProfile: employerProfileEn
    },
  },
  es: {
    translation: {
      header: headerEs,
      footer: footerEs,
      vacancies: vacanciesEs,
      employerProfile: employerProfileEs
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
