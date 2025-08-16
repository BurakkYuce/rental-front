// src/components/BackToHomeButton.jsx
import React from "react";
import { Link } from "react-router-dom";

const BackToHomeButton = ({ 
  position = "fixed", 
  top = "100px", 
  right = "20px",
  variant = "default"
}) => {
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#1ECB15",
    color: "white",
    textDecoration: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(30, 203, 21, 0.3)",
    zIndex: 1000,
  };

  const positionStyles = position === "fixed" ? {
    position: "fixed",
    top,
    right,
  } : {};

  const variantStyles = variant === "inline" ? {
    position: "static",
    margin: "20px 0",
  } : {};

  return (
    <Link
      to="/"
      style={{
        ...baseStyles,
        ...positionStyles,
        ...variantStyles,
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#179510";
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = "0 6px 20px rgba(30, 203, 21, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "#1ECB15";
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 4px 12px rgba(30, 203, 21, 0.3)";
      }}
    >
      <i className="fa fa-home" style={{ fontSize: "1rem" }}></i>
      Ana Sayfaya Dön
    </Link>
  );
};

export default BackToHomeButton;