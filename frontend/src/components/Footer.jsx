import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-light border-top mt-auto">
      <div className="container py-4">
        <div className="row">

          {/* Company info */}
          <div className="col-md-4 mb-3">
            <h5 className="text-uppercase">{t("footer.companyTitle")}</h5>
            <p className="text-muted small mb-0">
              {t("footer.companyDescription")}
            </p>
          </div>

          {/* Navigation */}
          <div className="col-md-4 mb-3">
            <h6 className="text-uppercase">{t("footer.navigationTitle")}</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-decoration-none text-muted">{t("footer.nav.home")}</a></li>
              <li><a href="/about" className="text-decoration-none text-muted">{t("footer.nav.about")}</a></li>
              <li><a href="/services" className="text-decoration-none text-muted">{t("footer.nav.services")}</a></li>
              <li><a href="/contacts" className="text-decoration-none text-muted">{t("footer.nav.contacts")}</a></li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="col-md-4 mb-3">
            <h6 className="text-uppercase">{t("footer.contactsTitle")}</h6>
            <ul className="list-unstyled text-muted small">
              <li>{t("footer.contacts.email")}</li>
              <li>{t("footer.contacts.phone")}</li>
              <li>{t("footer.contacts.address")}</li>
            </ul>
          </div>

        </div>

        <hr />

        <div className="text-center text-muted small">
          © {new Date().getFullYear()} {t("footer.companyTitle")}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
