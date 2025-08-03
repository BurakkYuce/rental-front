// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./assets/css/bootstrap.min.css";
import "./assets/css/plugins.css";
import "./assets/css/style.css";

// Pages
import HomePage from "./HomePage.jsx";
import NotFoundPage from "./pages/404.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
