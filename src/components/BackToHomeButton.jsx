// src/components/BackToHomeButton.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./BackToHomeButton.css";

const BackToHomeButton = ({
  top = "100px",
  right = "20px",
  variant = "default",
}) => {
  return (
    <Link
      to="/"
      className={`back-to-home-button ${variant === "inline" ? "inline" : ""}`}
      style={{
        "--desktop-top": top,
        "--desktop-right": right,
      }}
    >
      {/* Mobile: Only house emoji */}
      <span className="mobile-content">🏠</span>

      {/* Desktop: Icon + Text */}
      <span className="desktop-content">
        <i className="fa fa-home"></i>
        <span>Ana Sayfaya Dön</span>
      </span>
    </Link>
  );
};

export default BackToHomeButton;
