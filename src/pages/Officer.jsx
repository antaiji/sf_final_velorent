import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useFetchOnDemand } from "../hooks/useFetchOnDemand";
import { useAuthContext } from "../hooks/useAuthContext";
import { useMainContext } from "../hooks/useMainContext";
import useUpdate from "../hooks/useUpdate";
import Loader from "../components/Loader";
import ErrorPage from "./ErrorPage";

import "./Officer.css";

const Officer = () => {
  const { id } = useParams();

  const { user } = useAuthContext();
  const { officers } = useMainContext();
  const { fetchOnDemand, isFetchOnDemandLoading, fetchOnDemandError } =
    useFetchOnDemand();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentOfficer, setCurrentOfficer] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [fieldWarning, setFieldWarning] = useState("");
  const [notExistError, setNotExistError] = useState(false);

  const { updateItem, isUpdateLoading, updateError } = useUpdate();

  useEffect(() => {
    if (officers.length > 0) {
      let newOfficers = officers.filter((item) => item._id === id);
      if (newOfficers[0]) {
        setCurrentOfficer(newOfficers[0]);
        const { firstName, lastName, password, approved } = newOfficers[0];
        setEditableData({ firstName, lastName, password, approved });
      }
      if (!newOfficers[0]) {
        setNotExistError(true);
      }
    }
    if (officers.length === 0) {
      console.log("FOD OFFICERS");
      fetchOnDemand("officers");
    }
  }, [officers]);

  // изменение полей формы
  const handleItemChange = (key, value) => {
    const editableObj = { ...editableData };

    editableObj[key] = value;

    setEditableData((editableData) => ({
      ...editableData,
      ...editableObj,
    }));

    if (!value.length) {
      setFieldWarning(key);
      return;
    } else {
      setFieldWarning("");
    }
  };

  const handleSelect = () => {
    const editableObj = { ...editableData };

    const val = !editableObj.approved;

    setEditableData((editableData) => ({
      ...editableData,
      approved: val,
    }));
  };

  // обновление данных пользователя
  const handleEditSubmit = (e) => {
    e.preventDefault();

    const objToSend = {};
    for (let key in editableData) {
      if (editableData[key] !== currentOfficer[key]) {
        objToSend[key] = editableData[key];
      }
    }

    updateItem("officers", id, objToSend);

    setIsEditMode(!isEditMode);
  };

  // переключение режима формы
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // редирект незалогиненного пользователя
  if (!user) {
    const directUser = JSON.parse(localStorage.getItem("user"));
    if (!directUser) {
      return <Navigate to="/" />;
    }
  }

  const firstNameInputClasses =
    fieldWarning === "firstName"
      ? "form_input form_input-warning"
      : "form_input";

  const lastNameInputClasses =
    fieldWarning === "lastName"
      ? "form_input form_input-warning"
      : "form_input";

  let content;

  if (currentOfficer && !isEditMode) {
    content = (
      <div className="form">
        <div className="form_element">
          <div className="form_label">Email</div>
          <div className="officer_element-info">{currentOfficer.email}</div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label">Имя</label>
          <div className="officer_element-info">{currentOfficer.firstName}</div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label">Фамилия</label>
          <div className="officer_element-info">{currentOfficer.lastName}</div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label">Пароль</label>
          <div className="officer_element-info">************</div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label">Client ID</label>
          <div className="officer_element-info">{currentOfficer.clientId}</div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="client-id">
            Сотрудник одобрен
          </label>
          <div className="officer_element-info">
            {currentOfficer.approved ? "Да" : "Нет"}
          </div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <button
          className="btn officer_btn-edit"
          type="button"
          onClick={toggleEditMode}
        >
          Редактировать
        </button>
      </div>
    );
  }

  if (currentOfficer && isEditMode) {
    content = (
      <form className="form" onSubmit={handleEditSubmit}>
        <div className="form_element">
          <label className="form_label" htmlFor="email">
            Email
          </label>
          <input
            className="form_input officer_input"
            placeholder="youremail@gmail.com"
            type="email"
            id="email"
            name="email"
            required
            disabled
            value={currentOfficer.email}
          />
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="first-name">
            Имя
          </label>
          <input
            type="text"
            className={firstNameInputClasses}
            placeholder="Имя"
            id="first-name"
            name="first-name"
            value={editableData.firstName}
            onChange={(event) =>
              handleItemChange("firstName", event.target.value)
            }
          />
          <div className="form_input-error-wrapper">
            {fieldWarning === "firstName" && (
              <p className="form_input-error">
                Пожалуйста введите корректное имя
              </p>
            )}
          </div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="second-name">
            Фамилия
          </label>
          <input
            className={lastNameInputClasses}
            type="text"
            placeholder="Фамилия"
            id="second-name"
            name="second-name"
            value={editableData.lastName}
            onChange={(event) =>
              handleItemChange("lastName", event.target.value)
            }
          />
          <div className="form_input-error-wrapper">
            {fieldWarning === "lastName" && (
              <p className="form_input-error">Пожалуйста введите фамилию</p>
            )}
          </div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="password">
            Пароль
          </label>
          <input
            className="form_input officer_input"
            type="password"
            placeholder="************"
            id="password"
            name="password"
            disabled
          />
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="client-id">
            Client ID
          </label>
          <input
            className="form_input officer_input"
            type="text"
            placeholder="123456"
            id="client-id"
            name="client-id"
            required
            disabled
            value={currentOfficer.clientId}
          />
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="client-id">
            Сотрудник одобрен
          </label>
          <input
            type="checkbox"
            checked={editableData.approved ? "checked" : ""}
            className="form_checkbox"
            onChange={handleSelect}
          />
          <div className="form_input-error-wrapper"></div>
        </div>
        <button className="btn form_btn" type="submit" disabled={fieldWarning}>
          Сохранить
        </button>
      </form>
    );
  }

  return (
    <div className="container">
      <div className="grid">
        {fetchOnDemandError && <ErrorPage error={fetchOnDemandError} />}
        {updateError && <ErrorPage error={updateError} />}
        {notExistError && <ErrorPage error="Такого сотрудника не существует" />}
        {(isUpdateLoading || isFetchOnDemandLoading) && <Loader />}
        {!updateError &&
          !fetchOnDemandError &&
          !notExistError &&
          !isUpdateLoading &&
          !isFetchOnDemandLoading && (
            <div className="form_container">
              <h1 className="form_title">Ответственный сотрудник</h1>
              {content}
            </div>
          )}
      </div>
    </div>
  );
};

export default Officer;
