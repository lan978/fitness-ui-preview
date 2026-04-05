import React from "react";
import ReactDOM from "react-dom/client";
import BrandStorefrontPage from "./pages/BrandStorefrontPage";
import "./styles.css";

function handleBack() {
  window.location.href = "/";
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrandStorefrontPage onBack={handleBack} />
  </React.StrictMode>
);
