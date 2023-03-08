import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useMainContext } from "./useMainContext";

export const useFetchEverything = () => {
  const [fetchEverythingError, setFetchEverythingError] = useState(null);
  const [isFetchEverythingLoading, setIsFetchEverythingLoading] =
    useState(null);
  let { user } = useAuthContext();
  const { dispatch } = useMainContext();

  const fetchEverything = async (prefix) => {
    setIsFetchEverythingLoading(true);
    setFetchEverythingError(null);

    try {
      if (!user) {
        user = JSON.parse(localStorage.getItem("user"));
      }

      const data = await Promise.all([
        fetch(`https://sf-final-project-be.herokuapp.com/api/officers/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }),
        fetch(`https://sf-final-project-be.herokuapp.com/api/cases/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }),
      ]);

      const jsonOfficers = await data[0].json();
      const jsonReports = await data[1].json();

      dispatch({ type: "SET_OFFICERS", payload: jsonOfficers.officers });

      dispatch({ type: "SET_REPORTS", payload: jsonReports.data });

      setIsFetchEverythingLoading(false);
    } catch (error) {
      setIsFetchEverythingLoading(false);
      setFetchEverythingError(error.message);
    }
  };

  return { fetchEverything, isFetchEverythingLoading, fetchEverythingError };
};
