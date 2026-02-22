import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api.js";

function getInitials(name) {
  if (!name || typeof name !== "string") return "CO";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "CO";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function CompanyInfoSection({ user }) {
  const { t } = useTranslation();
  const employerId = user?.employer_id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companyId, setCompanyId] = useState(undefined);
  const [company, setCompany] = useState(null);
  const [logoBroken, setLogoBroken] = useState(false);

  useEffect(() => {
    if (!employerId) {
      setCompanyId(undefined);
      setCompany(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadCompanyInfo() {
      setLoading(true);
      setError(null);
      setCompany(null);
      setCompanyId(undefined);
      setLogoBroken(false);

      try {
        const { data: employerData } = await api.get(`/employers/${employerId}`);
        const resolvedCompanyId = employerData?.company_id ?? null;

        if (cancelled) return;
        setCompanyId(resolvedCompanyId);

        if (resolvedCompanyId === null) return;

        const { data: companyData } = await api.get(`/companies/${resolvedCompanyId}`);
        if (!cancelled) {
          setCompany(companyData ?? null);
          console.log(companyData.logo_url);
        }
      } catch (err) {
        if (cancelled) return;

        const status = err?.response?.status ?? "?";
        const detail = err?.response?.data?.detail;
        setError(
          typeof detail === "string" && detail.trim()
            ? detail
            : t("employerProfile.company.fetchError", { status }),
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCompanyInfo();

    return () => {
      cancelled = true;
    };
  }, [employerId, t]);

  const companyInitials = useMemo(() => getInitials(company?.name), [company?.name]);

  return (
    <section className="employer-company-card">
      <div className="employer-company-card__head">
        <h3>{t("employerProfile.company.title")}</h3>
        <span>{t("employerProfile.company.liveBadge")}</span>
      </div>

      {!employerId && (
        <p className="employer-company-card__state">{t("employerProfile.company.employerMissing")}</p>
      )}

      {employerId && loading && (
        <p className="employer-company-card__state">{t("employerProfile.company.loading")}</p>
      )}

      {employerId && !loading && error && (
        <p className="employer-company-card__state employer-company-card__state--error">{error}</p>
      )}

      {employerId && !loading && !error && companyId === null && (
        <p className="employer-company-card__state">{t("employerProfile.company.notAssigned")}</p>
      )}

      {employerId && !loading && !error && companyId !== null && company && (
        <>
          <div className="employer-company-card__company">
            <div className="employer-company-card__logo-wrap" aria-hidden="true">
              {company.logo_url && !logoBroken ? (
                <img
                  src={company.logo_url}
                  alt={t("employerProfile.company.logoAlt", { name: company.name || "Company" })}
                  className="employer-company-card__logo"
                  onError={() => setLogoBroken(true)}
                  loading="lazy"
                />
              ) : (
                <span className="employer-company-card__logo-fallback">{companyInitials}</span>
              )}
            </div>

            <p className="employer-company-card__name">{company.name || t("employerProfile.company.noData")}</p>
          </div>

          <div className="employer-company-card__grid">
            <div>
              <span>{t("employerProfile.company.industry")}</span>
              <strong>{company.industry || t("employerProfile.company.noData")}</strong>
            </div>

            <div>
              <span>{t("employerProfile.company.location")}</span>
              <strong>{company.location || t("employerProfile.company.locationUnavailable")}</strong>
            </div>

            <div>
              <span>{t("employerProfile.company.website")}</span>
              <strong>
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="employer-company-card__link"
                  >
                    {company.website}
                  </a>
                ) : (
                  t("employerProfile.company.websiteUnavailable")
                )}
              </strong>
            </div>
          </div>

          <p className="employer-company-card__about">
            {t("employerProfile.company.about")}: {company.description || t("employerProfile.company.descriptionUnavailable")}
          </p>
        </>
      )}
    </section>
  );
}
