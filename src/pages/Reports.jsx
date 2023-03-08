import { Fragment, useEffect } from "react";
import { useFetchOnDemand } from "../hooks/useFetchOnDemand";
import { Link, Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useMainContext } from "../hooks/useMainContext";
import { useDelete } from "../hooks/useDelete";

import Loader from "../components/Loader";
import ErrorPage from "./ErrorPage";

const Reports = () => {
  const { reports } = useMainContext();
  const { fetchOnDemand, isFetchOnDemandLoading, fetchOnDemandError } =
    useFetchOnDemand();
  const { deleteOne } = useDelete();
  const { user } = useAuthContext();

  useEffect(() => {
    fetchOnDemand("cases");
  }, []);

  const handleDelete = async (id) => {
    await deleteOne("cases", id);
  };

  if (!user) {
    const directUser = JSON.parse(localStorage.getItem("user"));
    if (!directUser) {
      return <Navigate to="/" />;
    }
  }

  let content;

  if (reports.length === 0) {
    content = <p className="common_info">Сообщения о кражах отсутствуют</p>;
  }

  if (reports.length > 0) {
    content = (
      <Fragment>
        {reports.map((report) => {
          return (
            <div className="common_item" key={report._id}>
              <div className="common_item-item">
                <span className="common_item-title">Номер лицензии</span>
                <span className="common_item-info">{report.licenseNumber}</span>
              </div>
              <div className="common_item-item">
                <span className="common_item-title">ФИО клиента</span>
                <span className="common_item-info">{report.ownerFullName}</span>
              </div>
              <div className="common_item-item">
                <span className="common_item-title">Тип велосипеда</span>
                <span className="common_item-info">
                  {report.type === "general" ? "обычный" : "спортивный"}
                </span>
              </div>
              <hr className="common_item-hr" />
              <div className="common_item-button">
                <Link to={report._id.toString()} className="common_btn-wrapper">
                  <button className="btn common_btn common_btn-more">
                    Подробнее
                  </button>
                </Link>
                <div className="common_btn-wrapper">
                  <button
                    className="btn common_btn common_btn-delete"
                    onClick={() => handleDelete(report._id)}
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
            <h1 className="common_title">Случаи краж</h1>
            {content}
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default Reports;
