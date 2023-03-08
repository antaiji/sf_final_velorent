import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useMainContext } from "../hooks/useMainContext";
import { useFetchOnDemand } from "../hooks/useFetchOnDemand";
import { useInputValidation } from "../hooks/useInputValidation";
import { useReport } from "../hooks/useReport";

const ReportNew = () => {
  const { user } = useAuthContext();
  const { officers } = useMainContext();
  const { create, isLoading, creationError, isCreated } = useReport();
  const { fetchOnDemand, isFetchOnDemandLoading, fetchOnDemandError } =
    useFetchOnDemand();

  const {
    value: enteredLicense,
    isValid: enteredLicenseIsValid,
    hasError: licenseInputHasError,
    valueChangeHandler: licenseChangeHandler,
    inputBlurHandler: licenseBlurHandler,
    reset: resetLicenseInput,
  } = useInputValidation((value) => value.trim() !== "");

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInputValidation((value) => value.trim() !== "");

  const {
    value: enteredType,
    isValid: enteredTypeIsValid,
    hasError: typeInputHasError,
    valueChangeHandler: typeChangeHandler,
    inputBlurHandler: typeBlurHandler,
    reset: resetTypeInput,
  } = useInputValidation(
    (value) => value.trim() === "general" || value.trim() === "sport"
  );

  const {
    value: enteredClientID,
    isValid: enteredClientIDIsValid,
    hasError: clientIDInputHasError,
    valueChangeHandler: clientIDChangeHandler,
    inputBlurHandler: clientIDBlurHandler,
    reset: resetClientIDInput,
  } = useInputValidation((value) => value.trim() !== "");

  const [officer, setOfficer] = useState("");
  const [color, setColor] = useState("");
  const [approvedOfficers, setApprovedOfficers] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (user) {
      if (officers.length > 0) {
        let newOfficers = officers.filter((item) => item.approved);
        setApprovedOfficers(newOfficers);
      }
      if (officers.length === 0) {
        fetchOnDemand("officers");
      }
    }
  }, [user, officers]);

  const handleColor = (e) => {
    setColor(e.target.value);
  };

  const handleOfficer = (e) => {
    setOfficer(e.target.value);
  };

  const handleCreateDate = (e) => {
    setCreateDate(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    await create(
      enteredLicense,
      enteredName,
      enteredType,
      enteredClientID,
      officer,
      color,
      createDate,
      description
    );

    resetLicenseInput();
    resetNameInput();
    resetTypeInput("");
    resetClientIDInput();
    setOfficer("");
    setColor("");
    setCreateDate("");
    setDescription("");
  };

  let reportFormIsValid = false;

  if (
    user &&
    enteredLicenseIsValid &&
    enteredNameIsValid &&
    enteredTypeIsValid
  ) {
    reportFormIsValid = true;
  }

  if (
    !user &&
    enteredLicenseIsValid &&
    enteredNameIsValid &&
    enteredTypeIsValid &&
    enteredClientIDIsValid
  ) {
    reportFormIsValid = true;
  }

  const licenseInputClasses = licenseInputHasError
    ? "form_input form_input-warning"
    : "form_input";

  const nameInputClasses = nameInputHasError
    ? "form_input form_input-warning"
    : "form_input";

  const typeInputClasses = typeInputHasError
    ? "form_input form_input-warning"
    : "form_input";

  return (
    <div className="container">
      <div className="grid">
        <div className="form_container">
          <h1 className="form_title">Сообщить о краже</h1>
          <form className="form" onSubmit={handleReportSubmit}>
            <div className="form_element">
              <label className="form_label" htmlFor="license">
                Номер лицензии
              </label>
              <input
                className={licenseInputClasses}
                placeholder="12345678"
                type="text"
                id="license"
                name="license"
                onChange={licenseChangeHandler}
                onBlur={licenseBlurHandler}
                value={enteredLicense}
              />
              <div className="form_input-error-wrapper">
                {licenseInputHasError && (
                  <p className="form_input-error">
                    Пожалуйста введите корректный номер лицензии
                  </p>
                )}
              </div>
            </div>
            <div className="form_element">
              <label className="form_label" htmlFor="client">
                ФИО клиента
              </label>
              <input
                className={nameInputClasses}
                type="text"
                placeholder="ФИО"
                id="client"
                name="client"
                onChange={nameChangeHandler}
                onBlur={nameBlurHandler}
                value={enteredName}
              />
              <div className="form_input-error-wrapper">
                {nameInputHasError && (
                  <p className="form_input-error">
                    Пожалуйста введите корректные ФИО
                  </p>
                )}
              </div>
            </div>
            {!user && (
              <div className="form_element">
                <label className="form_label" htmlFor="client-id">
                  Client ID
                </label>
                <input
                  className="form_input"
                  type="text"
                  placeholder="123456"
                  id="client-id"
                  name="client-id"
                  onChange={clientIDChangeHandler}
                  onBlur={clientIDBlurHandler}
                  value={enteredClientID}
                />
                <div className="form_input-error-wrapper">
                  {clientIDInputHasError && (
                    <p className="form_input-error">
                      Пожалуйста введите ClientID
                    </p>
                  )}
                </div>
              </div>
            )}
            {user && (
              <div className="form_element">
                <label className="form_label" htmlFor="officer">
                  Ответственный сотрудник
                </label>
                <select
                  className="form_input"
                  name="officer"
                  id="officer"
                  onChange={handleOfficer}
                  value={officer}
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
            )}
            <div className="form_element">
              <label className="form_label" htmlFor="btype">
                Тип велосипеда
              </label>
              <select
                className={typeInputClasses}
                name="btype"
                id="btype"
                onChange={typeChangeHandler}
                onBlur={typeBlurHandler}
                value={enteredType}
              >
                <option disabled value="">
                  Выбрать тип
                </option>
                <option value="general">Обычный</option>
                <option value="sport">Спортивный</option>
              </select>
              <div className="form_input-error-wrapper">
                {typeInputHasError && (
                  <p className="form_input-error">
                    Пожалуйста выберите тип велосипеда
                  </p>
                )}
              </div>
            </div>
            <div className="form_element">
              <label className="form_label" htmlFor="bcolor">
                Цвет велосипеда
              </label>
              <input
                onChange={handleColor}
                className="form_input"
                type="text"
                placeholder="цвет"
                id="bcolor"
                name="bcolor"
                value={color}
              />
              <div className="form_input-error-wrapper"></div>
            </div>
            <div className="form_element">
              <label className="form_label" htmlFor="localdate">
                Дата кражи:{" "}
              </label>
              <input
                onChange={handleCreateDate}
                className="form_input"
                type="datetime-local"
                id="localdate"
                name="date"
                value={createDate}
              />
              <div className="form_input-error-wrapper"></div>
            </div>
            <div className="form_element">
              <label className="form_label" htmlFor="addinfo">
                Дополнительный комментарий
              </label>
              <textarea
                onChange={handleDescription}
                className="form_input"
                placeholder="Дополнительный комментарий..."
                id="addinfo"
                name="addinfo"
                rows="5"
                value={description}
              ></textarea>
              <div className="form_input-error-wrapper"></div>
            </div>
            <button
              disabled={
                isFetchOnDemandLoading || isLoading || !reportFormIsValid
              }
              className="btn form_btn"
              type="submit"
            >
              Сообщить о краже
            </button>
            <div
              className={
                isCreated
                  ? "form_info form_info-success"
                  : creationError || fetchOnDemandError
                  ? "form_info form_info-error"
                  : "form_info"
              }
            >
              {isCreated && <span>Сообщение о краже успешно добавлено</span>}
              {creationError && <span>{creationError}</span>}
              {fetchOnDemandError && <span>{fetchOnDemandError}</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportNew;
