import React from "react";
import { Link } from "react-router-dom";
import "../index.css";
const Header = () => {
  return (
    <header className="header">
      <div className="content">
        <nav className="header-navigation">
          <Link to="/">Главная</Link>
          <Link to="/about">О нас</Link>
          <Link to="/auth/register">Регистрация</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
