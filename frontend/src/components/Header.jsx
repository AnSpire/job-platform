import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthContext";
import logo from "../assets/image.png";
import "./Header.css";

const Header = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const headerRef = useRef(null);
  const mobileFirstLinkRef = useRef(null);
  const moreFirstLinkRef = useRef(null);

  const navItems = useMemo(
    () => [
      { to: "/vacancies", key: "header.nav.vacancies", primary: true, enabled: true },
      { to: "/companies", key: "header.nav.companies", primary: true, enabled: true }, // TODO: route
      { to: "/courses", key: "header.nav.courses", primary: true, enabled: true }, // TODO: route
      { to: "/blog", key: "header.nav.blog", primary: true, enabled: true }, // TODO: route
      { to: "/contact", key: "header.nav.contacts", primary: true, enabled: true }, // TODO: route
    ],
    [],
  );

  const primaryItems = navItems.filter((item) => item.enabled && item.primary);
  const moreItems = navItems.filter((item) => item.enabled && !item.primary);

  function closeAllMenus() {
    setMenuOpen(false);
    setMoreOpen(false);
  }

  function toggleMobileMenu() {
    setMenuOpen((prev) => !prev);
    setMoreOpen(false);
  }

  function toggleMoreMenu() {
    setMoreOpen((prev) => !prev);
    setMenuOpen(false);
  }

  function handleNavClick() {
    closeAllMenus();
  }

  function handleLanguageChange(e) {
    i18n.changeLanguage(e.target.value);
  }

  useEffect(() => {
    function onClickOutside(e) {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(e.target)) {
        closeAllMenus();
      }
    }

    function onKeyDown(e) {
      if (e.key === "Escape") {
        closeAllMenus();
      }
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("touchstart", onClickOutside);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("touchstart", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      mobileFirstLinkRef.current?.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    if (moreOpen) {
      moreFirstLinkRef.current?.focus();
    }
  }, [moreOpen]);

  return (
    <header className="site-header border-bottom bg-white" ref={headerRef}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between gap-3 py-3">
          <Link to="/" className="d-inline-flex align-items-center gap-2">
            <img
              src={logo}
              alt={t("header.logoAlt")}
              className="img-fluid"
              style={{ maxHeight: "46px" }}
            />
          </Link>

          <nav
            className="d-none d-lg-flex align-items-center gap-3 header-nav"
            aria-label={t("header.aria.primary")}
          >
            <Link to="/about" className="nav-link px-0" onClick={handleNavClick}>
              {t("header.nav.about")}
            </Link>
            {primaryItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="nav-link px-0"
                onClick={handleNavClick}
              >
                {t(item.key)}
              </Link>
            ))}

            {moreItems.length > 0 && (
              <div className="position-relative">
                <button
                  type="button"
                  className="btn btn-link nav-link px-0 header-more-toggle"
                  onClick={toggleMoreMenu}
                  aria-haspopup="menu"
                  aria-expanded={moreOpen}
                  aria-controls="header-more-menu"
                >
                  {t("header.more")}
                </button>
                {moreOpen && (
                  <div
                    id="header-more-menu"
                    className="header-more-menu dropdown-menu show"
                    role="menu"
                  >
                    {moreItems.map((item, index) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        role="menuitem"
                        className="dropdown-item"
                        onClick={handleNavClick}
                        ref={index === 0 ? moreFirstLinkRef : null}
                      >
                        {t(item.key)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="d-none d-lg-flex align-items-center gap-3">
            <select
              className="form-select form-select-sm"
              value={i18n.language}
              onChange={handleLanguageChange}
              aria-label={t("header.lang.aria")}
              style={{ width: "auto" }}
            >
              <option value="ru">RU</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
            {!user && (
              <Link to="/auth/login" className="btn btn-outline-primary">
                {t("header.login")}
              </Link>
            )}
            {user && (
              <Link to="/app/me" className="btn btn-primary">
                {t("header.profile")}
              </Link>
            )}
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary d-lg-none header-burger"
            onClick={toggleMobileMenu}
            aria-label={t("header.aria.openMenu")}
            aria-expanded={menuOpen}
            aria-controls="header-mobile-menu"
          >
            <span className="header-burger-lines" aria-hidden="true" />
          </button>
        </div>

        <div
          id="header-mobile-menu"
          className={`header-mobile-menu d-lg-none ${menuOpen ? "open" : ""}`}
        >
          <nav className="d-flex flex-column gap-2" aria-label={t("header.aria.mobile")}>
            <select
              className="form-select form-select-sm mb-2"
              value={i18n.language}
              onChange={handleLanguageChange}
              aria-label={t("header.lang.aria")}
              style={{ width: "auto" }}
            >
              <option value="ru">RU</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
            <Link
              to="/about"
              className="nav-link"
              onClick={handleNavClick}
              ref={mobileFirstLinkRef}
            >
              {t("header.nav.about")}
            </Link>
            {navItems
              .filter((item) => item.enabled)
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="nav-link"
                  onClick={handleNavClick}
                >
                  {t(item.key)}
                </Link>
              ))}

            <div className="border-top pt-3 mt-2">
              {!user && (
                <Link to="/auth/login" className="btn btn-outline-primary login-button" onClick={handleNavClick}>
                  {t("header.login")}
                </Link>
              )}
              {user && (
                <Link to="/app/me" className="btn btn-primary w-100" onClick={handleNavClick}>
                  {t("header.profile")}
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
