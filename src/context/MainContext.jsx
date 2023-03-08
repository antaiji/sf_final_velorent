import { createContext, useReducer } from "react";

export const MainContext = createContext();

export const mainReducer = (state, action) => {
  switch (action.type) {
    case "SET_OFFICERS":
      return {
        officers: action.payload,
        reports: [...state.reports],
      };
    case "ADD_OFFICER":
      return {
        officers: [action.payload, ...state.officers],
        reports: [...state.reports],
      };
    case "DELETE_OFFICER":
      return {
        officers: state.officers.filter(
          (officer) => officer._id !== action.payload
        ),
        reports: [...state.reports],
      };
    case "UPDATE_OFFICER":
      return {
        officers: state.officers.map((officer) => {
          if (officer._id === action.payload.id) {
            return { ...officer, ...action.payload.data };
          }
          return officer;
        }),
        reports: [...state.reports],
      };
    case "SET_REPORTS":
      return {
        officers: [...state.officers],
        reports: action.payload,
      };
    case "ADD_REPORT":
      return {
        officers: [...state.officers],
        reports: [action.payload, ...state.reports],
      };
    case "DELETE_REPORT":
      return {
        officers: [...state.officers],
        reports: state.reports.filter(
          (report) => report._id !== action.payload
        ),
      };
    case "UPDATE_REPORT":
      return {
        officers: [...state.officers],
        reports: state.reports.map((report) => {
          if (report._id === action.payload.id) {
            return { ...report, ...action.payload.data };
          }
          return report;
        }),
      };

    default:
      return state;
  }
};

export const MainContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, {
    officers: [],
    reports: [],
  });

  return (
    <MainContext.Provider value={{ ...state, dispatch }}>
      {children}
    </MainContext.Provider>
  );
};
