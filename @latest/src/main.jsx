// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Home from "./assets/pages/Home.jsx";
import Careers from "./assets/pages/Careers.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/careers" element={<Careers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
