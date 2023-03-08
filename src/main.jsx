import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext";
import { MainContextProvider } from "./context/MainContext";

// wrap App with contexts
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <MainContextProvider>
        <App />
      </MainContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
