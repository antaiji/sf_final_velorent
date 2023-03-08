import { Fragment, useEffect } from "react";
import { useFetchOnDemand } from "../hooks/useFetchOnDemand";
import { Link, Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useMainContext } from "../hooks/useMainContext";
import { useDelete } from "../hooks/useDelete";
import { useLogout } from "../hooks/useLogout";

import Loader from "../components/Loader";
import ErrorPage from "./ErrorPage";

const Officers = () => {
  const { officers } = useMainContext();
  const { fetchOnDemand, isFetchOnDemandLoading, fetchOnDemandError } =
    useFetchOnDemand();
  const { deleteOne } = useDelete();
  const { user } = useAuthContext();
  const { logout } = useLogout();

  useEffect(() => {
    fetchOnDemand("officers");
  }, []);

  // удаление сотрудника
  const handleDelete = async (id) => {
    await deleteOne("officers", id);
    if (user.user.id === id) {
      logout();
    }
  };

  // редирект незалогиненного юзера
  if (!user) {
    const directUser = JSON.parse(localStorage.getItem("user"));
    if (!directUser) {
      return <Navigate to="/" />;
    }
  }

  let content;

  if (officers.length > 0) {
    content = (
      <Fragment>
        {officers.map((officer) => {
          return (
            <div className="common_item" key={officer._id}>
              <div className="common_item-item">
                <span className="common_item-title">Имя</span>
                <span className="common_item-info">{officer.firstName}</span>
              </div>
              <div className="common_item-item">
                <span className="common_item-title">Фамилия</span>
                <span className="common_item-info">{officer.lastName}</span>
              </div>
              <div className="common_item-item">
                <span className="common_item-title">Email</span>
                <span className="common_item-info">{officer.email}</span>
              </div>
              <hr className="common_item-hr" />
              <div className="common_item-button">
                <Link
                  to={officer._id.toString()}
                  className="common_btn-wrapper"
                >
                  <button className="btn common_btn common_btn-more">
                    Подробнее
                  </button>
                </Link>
                <div className="common_btn-wrapper">
                  <button
                    className="btn common_btn common_btn-delete"
                    onClick={() => handleDelete(officer._id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </Fragment>
    );
  }

  return (
    <div className="container">
      <div className="grid">
        {isFetchOnDemandLoading && <Loader />}
        {fetchOnDemandError && <ErrorPage error={fetchOnDemandError} />}
        {!isFetchOnDemandLoading && !fetchOnDemandError && (
          <Fragment>
            <h1 className="common_title">Ответственные сотрудники</h1>
            {content}
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default Officers;
