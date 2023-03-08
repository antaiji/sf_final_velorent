import { useState } from "react";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const signup = async (email, password, clientId, firstName, lastName) => {
    setIsLoading(true);
    setError(null);
    setIsRegistered(false);

    const response = await fetch(
      "https://sf-final-project-be.herokuapp.com/api/auth/sign_up",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          clientId,
          firstName,
          lastName,
        }),
      }
    );
    const json = await response.json();
    // console.log(json);
    if (json.status === "ERR") {
      setIsLoading(false);
      setError(json.message);
    }
    if (json.status === "OK") {
      setIsRegistered(true);
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error, isRegistered };
};
