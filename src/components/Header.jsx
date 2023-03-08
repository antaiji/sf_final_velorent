import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

import "./Header.css";
import logotype from "../assets/main_logo.svg";

const Header = () => {
  const [isDropdownMenuActive, setIsDropdownMenuActive] = useState(false);
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const toggleDropdownMenu = () => {
    setIsDropdownMenuActive(!isDropdownMenuActive);
  };

  const handleLogout = () => {
    if (isDropdownMenuActive) {
      setIsDropdownMenuActive(!isDropdownMenuActive);
    }

    logout();
  };

  return (
    <header className="header">
      <nav className="container nav">
        <div className="logo">
          <Link to="/">
            <img
              src={logotype}
              alt="logo"
              className="nav_img"
              onClick={isDropdownMenuActive ? toggleDropdownMenu : undefined}
            />
          </Link>
        </div>
        <div className={isDropdownMenuActive ? "nav_menu open" : "nav_menu"}>
          <ul className="nav_ul">
            <li
              className="nav_li"
              onClick={isDropdownMenuActive ? toggleDropdownMenu : undefined}
            >
              <NavLink to="report" className="nav_a">
                Сообщить
                <br />о краже
              </NavLink>
            </li>
            {user && (
              <li
                className="nav_li"
                onClick={isDropdownMenuActive ? toggleDropdownMenu : undefined}
              >
                <NavLink to="officers" className="nav_a">
                  Ответственные
                  <br />
                  сотрудники
                </NavLink>
              </li>
            )}
            {user && (
              <li
                className="nav_li"
                onClick={isDropdownMenuActive ? toggleDropdownMenu : undefined}
              >
                <NavLink to="reports" className="nav_a">
                  Сообщения
                  <br />о кражах
                </NavLink>
              </li>
            )}
          </ul>
          <div className="nav_logging">
            {user && (
              <p
                className="nav_logging_p"
                title={user.user.email}
              >{`${user.user.email.slice(0, 7)}...`}</p>
            )}
            {user && (
              <button className="btn nav_btn-out" onClick={handleLogout}>
                Выйти
              </button>
            )}
            {!user && (
              <Link to="logsign">
                <button
                  className="btn nav_btn-in"
                  onClick={
                    isDropdownMenuActive ? toggleDropdownMenu : undefined
                  }
                >
                  Войти
                </button>
              </Link>
            )}
          </div>
        </div>
        <div
          className={isDropdownMenuActive ? "nav_toggler open" : "nav_toggler"}
          onClick={toggleDropdownMenu}
        >
          <div className="nav_toggler-bar"></div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
