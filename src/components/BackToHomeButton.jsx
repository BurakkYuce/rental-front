// src/components/BackToHomeButton.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./BackToHomeButton.css";

const BackToHomeButton = ({
  top = "100px",
  right = "20px",
  // Mobil için yeni props ekledik
  mobileBottom = "100px",
  mobileRight = "20px",
  variant = "default",
}) => {
  const handleClick = () => {
    // Sayfanın en üstüne kaydir
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <Link
      to="/"
      className={`back-to-home-button ${variant === "inline" ? "inline" : ""}`}
      style={{
        // Desktop için
        "--desktop-top": top,
        "--desktop-right": right,
        // Mobil için yeni CSS değişkenleri
        "--mobile-bottom": mobileBottom,
        "--mobile-right": mobileRight,
      }}
      onClick={handleClick}
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