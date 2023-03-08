import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useMainContext } from "./useMainContext";

const useUpdate = () => {
  const [updateError, setUpdateError] = useState(null);
  const [isUpdateLoading, setIsUpdateLoading] = useState(null);
  const { user } = useAuthContext();
  const { dispatch } = useMainContext();

  const updateItem = async (prefix, id, data) => {
    setIsUpdateLoading(true);
    setUpdateError(null);

    const response = await fetch(
      `https://sf-final-project-be.herokuapp.com/api/${prefix}/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      }
    );

    const json = await response.json();

    if (json.status === "ERR") {
      setIsUpdateLoading(false);
      setUpdateError(json.message);
    }
    if (json.status === "OK") {
      if (prefix === "officers") {
        dispatch({
          type: "UPDATE_OFFICER",
          payload: { id: id, data: json.data },
        });
      }

      if (prefix === "cases") {
        dispatch({
          type: "UPDATE_REPORT",
          payload: { id: id, data: json.data },
        });
      }

      setIsUpdateLoading(false);
    }
  };

  return { updateItem, isUpdateLoading, updateError };
};

export default useUpdate;
