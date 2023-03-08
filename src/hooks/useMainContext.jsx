import { useContext } from "react";
import { MainContext } from "../context/MainContext";

export const useMainContext = () => {
  const context = useContext(MainContext);

  if (!context) {
    throw Error(
      "useMainContext должен использоваться внутри MainContextProvider"
    );
  }

  return context;
};
