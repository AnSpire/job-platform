import React from "react";

const Footer = () => {
  return (
    <footer className="bg-light border-top mt-auto">
      <div className="container py-4">
        <div className="row">

          {/* Company info */}
          <div className="col-md-4 mb-3">
            <h5 className="text-uppercase">StartCareer</h5>
            <p className="text-muted small mb-0">
              Короткое описание компании или слоган.
            </p>
          </div>

          {/* Navigation */}
          <div className="col-md-4 mb-3">
            <h6 className="text-uppercase">Навигация</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-decoration-none text-muted">Главная</a></li>
              <li><a href="/about" className="text-decoration-none text-muted">О компании</a></li>
              <li><a href="/services" className="text-decoration-none text-muted">Услуги</a></li>
              <li><a href="/contacts" className="text-decoration-none text-muted">Контакты</a></li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="col-md-4 mb-3">
            <h6 className="text-uppercase">Контакты</h6>
            <ul className="list-unstyled text-muted small">
              <li>Email: info@company.com</li>
              <li>Телефон: +7 (000) 000-00-00</li>
              <li>Адрес: Москва</li>
            </ul>
          </div>

        </div>

        <hr />

        <div className="text-center text-muted small">
          © {new Date().getFullYear()} StartCareer. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
