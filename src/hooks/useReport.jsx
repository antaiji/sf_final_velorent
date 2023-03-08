import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useReport = () => {
  const [creationError, setCreationError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [isCreated, setIsCreated] = useState(false);

  const { user } = useAuthContext();

  const create = async (
    licenseNumber,
    ownerFullName,
    type,
    clientId,
    officer,
    color,
    date,
    description
  ) => {
    setIsLoading(true);
    setCreationError(null);
    setIsCreated(false);

    let url;
    let payload;

    if (user) {
      url = "https://sf-final-project-be.herokuapp.com/api/cases/";
      payload = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseNumber,
          ownerFullName,
          type,
          officer,
          color,
          date,
          description,
        }),
      };
    }

    if (!user) {
      url = "https://sf-final-project-be.herokuapp.com/api/public/report";
      payload = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseNumber,
          ownerFullName,
          type,
          clientId,
          color,
          date,
          description,
        }),
      };
    }

    const response = await fetch(url, payload);
    const json = await response.json();
    // console.log(json);
    if (json.status === "ERR") {
      setIsLoading(false);
      setCreationError(json.message);
    }
    if (json.status === "OK") {
      setIsCreated(true);
      setIsLoading(false);
    }
  };

  return { create, isLoading, creationError, isCreated };
};
