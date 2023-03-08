import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <>
      <div className="nfpage_container">
        <h1 className="nfpage_title">404</h1>
        <p className="nfpage_info">Такой страницы не существует</p>
        <Link className="nfpage_btn" to="/">
          Вернуться на главную
        </Link>
      </div>
    </>
  );
};

export default NotFound;
