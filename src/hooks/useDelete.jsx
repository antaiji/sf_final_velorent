import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useMainContext } from "./useMainContext";

export const useDelete = () => {
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(null);
  const { user } = useAuthContext();
  const { dispatch } = useMainContext();

  const deleteOne = async (prefix, id) => {
    setIsDeleteLoading(true);
    setDeleteError(null);

    const response = await fetch(
      `https://sf-final-project-be.herokuapp.com/api/${prefix}/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    const json = await response.json();

    if (json.status === "ERR") {
      setIsDeleteLoading(false);
      setDeleteError(json.message);
    }
    if (json.status === "OK") {
      if (prefix === "officers") {
        dispatch({ type: "DELETE_OFFICER", payload: id });
      }

      if (prefix === "cases") {
        dispatch({ type: "DELETE_REPORT", payload: id });
      }

      // update loading state
      setIsDeleteLoading(false);
    }
  };

  return { deleteOne, isDeleteLoading, deleteError };
};
