import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; // ← добавить
import logo from "../assets/image.png"

const Header = () => {
  const { user } = useAuth(); // ← получаем текущего пользователя

  return (
    <header className="header">
      <div className="content">
      <nav className="header-navigation align-items-center">
          <Link to="/">
          <img src={logo} alt="StartCareer logo"  className="img-fluid" style={{ maxHeight: "50px" }}/>
          </Link>
          <Link to="/about">О нас</Link>

          {/* Если пользователь не авторизован → показываем Регистрация / Войти */}
          {!user && (
            <>
              {/* <Link to="/auth/register">Регистрация</Link> */}
              <Link to="/auth/login">Войти</Link>
            </>
          )}

          {/* Если авторизован → показываем Профиль */}
          {user && (
            <Link to="/app/me">Профиль</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
