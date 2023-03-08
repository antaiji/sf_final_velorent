import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useFetchEverything } from "../hooks/useFetchEverything";
import { useAuthContext } from "../hooks/useAuthContext";
import { useMainContext } from "../hooks/useMainContext";
import useUpdate from "../hooks/useUpdate";
import Loader from "../components/Loader";
import ErrorPage from "./ErrorPage";

import "./Officer.css";

const Report = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { officers, reports } = useMainContext();
  const { fetchEverything, isFetchEverythingLoading, fetchEverythingError } =
    useFetchEverything();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [currentOfficerName, setCurrentOfficerName] = useState("");
  const [editableData, setEditableData] = useState({});
  const [approvedOfficers, setApprovedOfficers] = useState("");
  const [notExistError, setNotExistError] = useState(false);

  const [fieldWarning, setFieldWarning] = useState("");

  const { updateItem, isUpdateLoading, updateError } = useUpdate();

  useEffect(() => {
    const setAll = (cb) => {
      let newOfficers;
      if (officers.length !== 0) {
        newOfficers = officers.filter((item) => item.approved);
        setApprovedOfficers(newOfficers);
      }
      if (reports.length !== 0) {
        let newReports = reports.filter((item) => item._id === id);
        if (newReports[0]) {
          setCurrentReport(newReports[0]);
          const {
            status,
            licenseNumber,
            ownerFullName,
            type,
            color,
            date,
            officer,
            description,
            resolution,
          } = newReports[0];
          setEditableData({
            status,
            licenseNumber,
            ownerFullName,
            type,
            color,
            date,
            officer,
            description,
            resolution,
          });

          cb(officer, newOfficers);
        }
        if (!newReports[0]) {
          setNotExistError(true);
        }
      }
    };

    const setCurrOff = (off, offs) => {
      if (off) {
        let newOfficers = offs.filter((item) => item._id === off);
        if (newOfficers[0]) {
          setCurrentOfficerName(
            `${newOfficers[0].firstName} ${newOfficers[0].lastName}`
          );
        } else {
          setCurrentOfficerName("Сотрудник неизвестен");
        }
      }
    };

    setAll(setCurrOff);
  }, [officers, reports]);

  useEffect(() => {
    if (officers.length === 0) {
      fetchEverything();
    }
  }, []);

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

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const objToSend = {};
    for (let key in editableData) {
      if (editableData[key] !== currentReport[key]) {
        objToSend[key] = editableData[key];
      }
    }

    if (Object.keys(objToSend).length) {
      updateItem("cases", id, objToSend);
    }

    setIsEditMode(!isEditMode);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  if (!user) {
    const directUser = JSON.parse(localStorage.getItem("user"));
    if (!directUser) {
      return <Navigate to="/" />;
    }
  }

  let content;

  const licenseNumberClasses =
    fieldWarning === "licenseNumber"
      ? "form_input form_input-warning"
      : "form_input";

  const ownerFullNameClasses =
    fieldWarning === "ownerFullName"
      ? "form_input form_input-warning"
      : "form_input";

  if (currentReport && !isEditMode) {
    content = (
      <div className="form">
        <div className="form_element">
          <div className="form_label">Статус</div>
          <div className="officer_element-info">
            {currentReport.status === "new"
              ? "новый"
              : currentReport.status === "in_progress"
              ? "в процессе"
              : "завершен"}
          </div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label">Номер лицензии</label>
          <div className="officer_element-info">
            {currentReport.licenseNumber}
          </div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label">Тип велосипеда</label>
          <div className="officer_element-info">
            {currentReport.type === "general" ? "обычный" : "спортивный"}
          </div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label">ФИО клиента</label>
          <div className="officer_element-info">
            {currentReport.ownerFullName}
          </div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label">ID клиента</label>
          <div className="officer_element-info">{currentReport.clientId}</div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="client-id">
            Дата создания сообщения
          </label>
          <div className="officer_element-info">
            {currentReport.createdAt
              ? currentReport.createdAt.slice(0, 16).replace("T", ", ")
              : "***"}
          </div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="client-id">
            Дата обновления сообщения
          </label>
          <div className="officer_element-info">
            {currentReport.updatedAt
              ? currentReport.updatedAt.slice(0, 16).replace("T", ", ")
              : "***"}
          </div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="client-id">
            Цвет велосипеда
          </label>
          <div className="officer_element-info">
            {currentReport.color ? currentReport.color : "***"}
          </div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="client-id">
            Дата кражи
          </label>
          <div className="officer_element-info">
            {currentReport.date
              ? currentReport.date.slice(0, 16).replace("T", ", ")
              : "***"}
          </div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="client-id">
            Ответственный сотрудник
          </label>
          <div className="officer_element-info">
            {editableData.officer ? currentOfficerName : "***"}
          </div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="client-id">
            Дополнительный комментарий
          </label>
          <div className="officer_element-info">
            {currentReport.description ? currentReport.description : "***"}
          </div>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="client-id">
            Заключительный комментарий
          </label>
          <div className="officer_element-info">
            {currentReport.resolution ? currentReport.resolution : "***"}
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

  if (currentReport && isEditMode) {
    content = (
      <form className="form" onSubmit={handleEditSubmit}>
        <div className="form_element">
          <label className="form_label" htmlFor="btype">
            Статус
          </label>
          <select
            className="form_input"
            name="btype"
            id="btype"
            onChange={(event) => handleItemChange("status", event.target.value)}
            value={editableData.status}
          >
            <option disabled value="">
              Выбрать тип
            </option>
            <option value="new">Новый</option>
            <option value="in_progress">В процессе</option>
            {editableData.resolution && <option value="done">Завершен</option>}
          </select>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="license">
            Номер лицензии
          </label>
          <input
            className={licenseNumberClasses}
            placeholder="123455678"
            onChange={(event) =>
              handleItemChange("licenseNumber", event.target.value)
            }
            type="license"
            id="license"
            name="license"
            value={editableData.licenseNumber ? editableData.licenseNumber : ""}
          />
          <div className="form_input-error-wrapper">
            {fieldWarning === "licenseNumber" && (
              <p className="form_input-error">
                Пожалуйста введите номер лицензии
              </p>
            )}
          </div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="btype">
            Тип велосипеда
          </label>
          <select
            className="form_input"
            name="btype"
            id="btype"
            onChange={(event) => handleItemChange("type", event.target.value)}
            value={editableData.type ? editableData.type : ""}
          >
            <option disabled value="">
              Выбрать тип
            </option>
            <option value="general">Обычный</option>
            <option value="sport">Спортивный</option>
          </select>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="client">
            ФИО клиента
          </label>
          <input
            type="text"
            className={ownerFullNameClasses}
            placeholder="ФИО клиента"
            id="client"
            name="client"
            value={editableData.ownerFullName ? editableData.ownerFullName : ""}
            onChange={(event) =>
              handleItemChange("ownerFullName", event.target.value)
            }
          />
          <div className="form_input-error-wrapper">
            {fieldWarning === "ownerFullName" && (
              <p className="form_input-error">Пожалуйста введите ФИО</p>
            )}
          </div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="client-id">
            ID клиента
          </label>
          <input
            onChange={(event) => console.log(event.target.value)}
            className="form_input"
            type="text"
            id="client-id"
            name="client-id"
            value={currentReport.clientId ? currentReport.clientId : ""}
            disabled
          />
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="creation">
            Дата создания сообщения
          </label>
          <input
            onChange={(event) => console.log(event.target.value)}
            className="form_input"
            type="datetime-local"
            id="creation"
            name="creation"
            value={
              currentReport.createdAt !== null
                ? currentReport.createdAt.slice(0, 16)
                : ""
            }
            disabled
          />
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="editing">
            Дата обновления сообщения
          </label>
          <input
            onChange={(event) => console.log(event.target.value)}
            className="form_input"
            type="datetime-local"
            id="editing"
            name="editing"
            value={
              currentReport.updatedAt !== null
                ? currentReport.updatedAt.slice(0, 16)
                : ""
            }
            disabled
          />
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="color">
            Цвет велосипеда
          </label>
          <input
            className="form_input"
            type="text"
            placeholder="Цвет велосипеда"
            id="color"
            name="color"
            value={editableData.color ? editableData.color : ""}
            onChange={(event) => handleItemChange("color", event.target.value)}
          />
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="date">
            Дата кражи
          </label>
          <input
            onChange={(event) => handleItemChange("date", event.target.value)}
            className="form_input"
            type="datetime-local"
            id="date"
            name="date"
            value={editableData.date ? editableData.date.slice(0, 16) : ""}
          />
          <div className="form_input-error-wrapper"></div>
        </div>

        <div className="form_element">
          <label className="form_label" htmlFor="cofficer">
            Ответственный сотрудник
          </label>
          <select
            className="form_input"
            name="cofficer"
            id="cofficer"
            onChange={(event) =>
              handleItemChange("officer", event.target.value)
            }
            value={editableData.officer ? editableData.officer : ""}
          >
            <option disabled value="">
              Выбрать сотрудника
            </option>
            {approvedOfficers &&
              approvedOfficers.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >{`${item.firstName} ${item.lastName}`}</option>
              ))}
          </select>
          <div className="form_input-error-wrapper"></div>
        </div>

        <div className="form_element">
          <label className="form_label" htmlFor="addinfo">
            Дополнительный комментарий
          </label>
          <textarea
            onChange={(event) => {
              handleItemChange("description", event.target.value);
            }}
            className="form_input"
            placeholder="Дополнительный комментарий..."
            id="addinfo"
            name="addinfo"
            rows="5"
            value={editableData.description ? editableData.description : ""}
          ></textarea>
          <div className="form_input-error-wrapper"></div>
        </div>
        <div className="form_element">
          <label className="form_label" htmlFor="resolution">
            Заключительный комментарий
          </label>
          <textarea
            onChange={(event) =>
              handleItemChange("resolution", event.target.value)
            }
            className="form_input"
            placeholder="Заключительный комментарий..."
            id="resolution"
            name="resolution"
            rows="5"
            value={editableData.resolution ? editableData.resolution : ""}
          ></textarea>
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
        {fetchEverythingError && <ErrorPage error={fetchEverythingError} />}
        {updateError && <ErrorPage error={updateError} />}
        {notExistError && (
          <ErrorPage error="Такого случая кражи не существует" />
        )}
        {(isUpdateLoading || isFetchEverythingLoading) && <Loader />}
        {!updateError &&
          !fetchEverythingError &&
          !notExistError &&
          !isUpdateLoading &&
          !isFetchEverythingLoading && (
            <div className="form_container officer_container">
              <h1 className="form_title">Сообщение о краже</h1>
              {content}
            </div>
          )}
      </div>
    </div>
  );
};

export default Report;
