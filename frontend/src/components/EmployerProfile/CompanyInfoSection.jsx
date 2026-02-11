import { useTranslation } from "react-i18next";

const COMPANY_INFO = {
  name: "ApexHire",
  industry: "HR Tech",
  teamSize: "80-120",
  website: "https://apexhire.example",
  city: "Berlin",
  country: "Germany",
  about: "Building tools for smarter hiring pipelines and candidate experience.",
};

export default function CompanyInfoSection() {
  const { t } = useTranslation();

  return (
    <section className="employer-company-card">
      <div className="employer-company-card__head">
        <h3>{t("employerProfile.company.title")}</h3>
        <span>{t("employerProfile.company.hardcodedBadge")}</span>
      </div>

      <p className="employer-company-card__name">{COMPANY_INFO.name}</p>

      <div className="employer-company-card__grid">
        <div>
          <span>{t("employerProfile.company.industry")}</span>
          <strong>{COMPANY_INFO.industry}</strong>
        </div>
        <div>
          <span>{t("employerProfile.company.teamSize")}</span>
          <strong>{COMPANY_INFO.teamSize}</strong>
        </div>
        <div>
          <span>{t("employerProfile.company.location")}</span>
          <strong>
            {COMPANY_INFO.city}, {COMPANY_INFO.country}
          </strong>
        </div>
        <div>
          <span>{t("employerProfile.company.website")}</span>
          <strong>{COMPANY_INFO.website}</strong>
        </div>
      </div>

      <p className="employer-company-card__about">
        {t("employerProfile.company.about")}: {COMPANY_INFO.about}
      </p>
    </section>
  );
}
