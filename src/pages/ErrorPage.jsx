import { Link } from "react-router-dom";
import "./ErrorPage.css";

const Error = ({ error }) => {
  return (
    <>
      <div className="errorpage_container">
        <h1 className="errorpage_title">Упс! Что-то пошло не так...</h1>
        <p className="errorpage_info">{error}</p>
        <Link className="errorpage_btn" to="/">
          Вернуться на главную
        </Link>
      </div>
    </>
  );
};

export default Error;
