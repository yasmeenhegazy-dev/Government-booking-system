import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import { LanguageProvider } from "./lib/i18n.js";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
        <ToastContainer position="top-center" autoClose={3000} rtl theme="colored" />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
