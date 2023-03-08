import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useMainContext } from "./useMainContext";

export const useFetchOnDemand = () => {
  const [fetchOnDemandError, setFetchOnDemandError] = useState(null);
  const [isFetchOnDemandLoading, setIsFetchOnDemandLoading] = useState(null);
  let { user } = useAuthContext();
  const { dispatch } = useMainContext();

  const fetchOnDemand = async (prefix) => {
    setIsFetchOnDemandLoading(true);
    setFetchOnDemandError(null);

    try {
      if (!user) {
        user = JSON.parse(localStorage.getItem("user"));
      }

      const response = await fetch(
        `https://sf-final-project-be.herokuapp.com/api/${prefix}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setIsFetchOnDemandLoading(false);
        setFetchOnDemandError(json.message);
      }

      if (response.ok) {
        if (prefix === "officers") {
          dispatch({ type: "SET_OFFICERS", payload: json.officers });
        }

        if (prefix === "cases") {
          dispatch({ type: "SET_REPORTS", payload: json.data });
        }

        setIsFetchOnDemandLoading(false);
      }
    } catch (error) {
      setIsFetchOnDemandLoading(false);
      setFetchOnDemandError(error.message);
    }
  };

  return { fetchOnDemand, isFetchOnDemandLoading, fetchOnDemandError };
};
