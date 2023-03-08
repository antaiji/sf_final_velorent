import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoginLoading(true);
    setLoginError(null);

    const response = await fetch(
      "https://sf-final-project-be.herokuapp.com/api/auth/sign_in",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const json = await response.json();

    if (json.status === "ERR") {
      setIsLoginLoading(false);
      setLoginError(json.message);
    }
    if (json.status === "OK") {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json.data));

      // update the auth context
      dispatch({ type: "LOGIN", payload: json.data });

      // update loading state
      setIsLoginLoading(false);
    }
  };

  return { login, isLoginLoading, loginError };
};
