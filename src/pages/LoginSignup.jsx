import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSignup } from "../hooks/useSignup";
import { useLogin } from "../hooks/useLogin";
import { useInputValidation } from "../hooks/useInputValidation";

const LoginSignup = () => {
  // валидация полей формы с кастомным хуком
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInputValidation((value) =>
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(value)
  );

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInputValidation((value) => value.trim().length > 5);

  const {
    value: enteredClientID,
    isValid: enteredClientIDIsValid,
    hasError: clientIDInputHasError,
    valueChangeHandler: clientIDChangeHandler,
    inputBlurHandler: clientIDBlurHandler,
    reset: resetClientIDInput,
  } = useInputValidation((value) => value.trim() !== "");

  const [isSignUpForm, setIsSignUpForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { user } = useAuthContext();

  const { signup, error, isLoading, isRegistered } = useSignup();
  const { login, isLoginLoading, loginError } = useLogin();

  // переключение режимов формы
  const handleFormSwitch = () => {
    setIsSignUpForm(!isSignUpForm);
  };

  // регистрация юзера
  const handleRegSubmit = async (e) => {
    e.preventDefault();

    await signup(
      enteredEmail,
      enteredPassword,
      enteredClientID,
      firstName,
      lastName
    );

    resetEmailInput();
    resetPasswordInput();
    setFirstName("");
    setLastName("");
    resetClientIDInput();
  };

  // логин зарегистрированного юзера
  const handleLogSubmit = async (e) => {
    e.preventDefault();

    await login(enteredEmail, enteredPassword);

    resetEmailInput();
    resetPasswordInput();
  };

  useEffect(() => {
    setIsSignUpForm(false);
  }, []);

  let loginFormIsValid = false;

  if (enteredEmailIsValid && enteredPasswordIsValid) {
    loginFormIsValid = true;
  }

  let registerFormIsValid = false;

  if (enteredEmailIsValid && enteredPasswordIsValid && enteredClientIDIsValid) {
    registerFormIsValid = true;
  }

  const emailInputClasses = emailInputHasError
    ? "form_input form_input-warning"
    : "form_input";

  const passwordInputClasses = passwordInputHasError
    ? "form_input form_input-warning"
    : "form_input";

  const clientIDInputClasses = clientIDInputHasError
    ? "form_input form_input-warning"
    : "form_input";

  // редирект незалогиненного юзера
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <div className="grid">
        <div className="form_container">
          <h1 className="form_title">
            {isSignUpForm ? "Регистрация на сайте" : "Войти в профиль"}
          </h1>
          {!isSignUpForm && (
            <form className="form" onSubmit={handleLogSubmit}>
              <div className="form_element">
                <label className="form_label" htmlFor="email">
                  Email
                </label>
                <input
                  className={emailInputClasses}
                  placeholder="youremail@gmail.com"
                  id="email"
                  name="email"
                  onChange={emailChangeHandler}
                  onBlur={emailBlurHandler}
                  value={enteredEmail}
                />
                <div className="form_input-error-wrapper">
                  {emailInputHasError && (
                    <p className="form_input-error">
                      Пожалуйста введите корректный email
                    </p>
                  )}
                </div>
              </div>
              <div className="form_element">
                <label className="form_label" htmlFor="password">
                  Пароль
                </label>
                <input
                  className={passwordInputClasses}
                  type="password"
                  placeholder="********"
                  id="password"
                  name="password"
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                  value={enteredPassword}
                />
                <div className="form_input-error-wrapper">
                  {passwordInputHasError && (
                    <p className="form_input-error">
                      Пароль должен содержать не менее 6 символов
                    </p>
                  )}
                </div>
              </div>
              <button
                className="btn form_btn"
                type="submit"
                disabled={isLoginLoading || !loginFormIsValid}
              >
                Войти
              </button>
              <div
                className={
                  loginError ? "form_info form_info-error" : "form_info"
                }
              >
                {loginError && <span>{loginError}</span>}
              </div>
            </form>
          )}
          {isSignUpForm && (
            <form className="form" onSubmit={handleRegSubmit}>
              <div className="form_element">
                <label className="form_label" htmlFor="email">
                  Email
                </label>
                <input
                  className={emailInputClasses}
                  placeholder="youremail@gmail.com"
                  id="email"
                  name="email"
                  onChange={emailChangeHandler}
                  onBlur={emailBlurHandler}
                  value={enteredEmail}
                />
                <div className="form_input-error-wrapper">
                  {emailInputHasError && (
                    <p className="form_input-error">
                      Пожалуйста введите корректный email
                    </p>
                  )}
                </div>
              </div>
              <div className="form_element">
                <label className="form_label" htmlFor="password">
                  Пароль
                </label>
                <input
                  className={passwordInputClasses}
                  type="password"
                  placeholder="********"
                  id="password"
                  name="password"
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                  value={enteredPassword}
                />
                <div className="form_input-error-wrapper">
                  {passwordInputHasError && (
                    <p className="form_input-error">
                      Пароль должен содержать не менее 6 символов
                    </p>
                  )}
                </div>
              </div>
              <div className="form_element">
                <label className="form_label" htmlFor="first-name">
                  Имя
                </label>
                <input
                  type="text"
                  className="form_input"
                  placeholder="Имя"
                  id="first-name"
                  name="first-name"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
                <div className="form_input-error-wrapper"></div>
              </div>
              <div className="form_element">
                <label className="form_label" htmlFor="last-name">
                  Фамилия
                </label>
                <input
                  className="form_input"
                  type="text"
                  placeholder="Фамилия"
                  id="last-name"
                  name="last-name"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
                <div className="form_input-error-wrapper"></div>
              </div>
              <div className="form_element">
                <label className="form_label" htmlFor="client-id">
                  Client ID
                </label>
                <input
                  className={clientIDInputClasses}
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
              <button
                className="btn form_btn"
                type="submit"
                disabled={isLoading || !registerFormIsValid}
              >
                Зарегистрироваться
              </button>
              <div
                className={
                  isRegistered
                    ? "form_info form_info-success"
                    : error
                    ? "form_info form_info-error"
                    : "form_info"
                }
              >
                {isRegistered && (
                  <span>
                    Пользователь успешно зарегистрирован <br /> Пожалуйста
                    войдите в профиль
                  </span>
                )}
                {error && <span>{error}</span>}
              </div>
            </form>
          )}
          {isSignUpForm && (
            <p className="form_selector">
              Уже зарегистрированы?{" "}
              <span className="form_switch" onClick={handleFormSwitch}>
                Войти в профиль
              </span>
            </p>
          )}
          {!isSignUpForm && (
            <p className="form_selector">
              Нет учетной записи?{" "}
              <span className="form_switch" onClick={handleFormSwitch}>
                Зарегистрироваться
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
