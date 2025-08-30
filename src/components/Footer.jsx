// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#2c3e50",
        color: "white",
        padding: "60px 0 30px",
        marginTop: "50px",
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 style={{ fontWeight: "600", marginBottom: "20px" }}>
              MITCAR RENTAL
            </h5>
            <p style={{ color: "#bdc3c7", lineHeight: 1.6 }}>
              Antalya ve çevresinde profesyonel araç kiralama ve transfer
              hizmetleri. Modern filomuz ve deneyimli şoförlerimizle konfor ve
              güvenilirliği yaşayın.
            </p>
            <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
              <a
                href="https://www.facebook.com/"
                style={{ color: "#3498db", fontSize: "1.2rem" }}
              >
                <i className="fa fa-facebook"></i>
              </a>
              <a
                href="https://www.instagram.com/mitcarrental/"
                style={{ color: "#3498db", fontSize: "1.2rem" }}
              >
                <i className="fa fa-instagram"></i>
              </a>
              <a
                href="https://x.com/yuce07?s=21&t=J1365amuyh0JleZBNlSesQ"
                style={{ color: "#3498db", fontSize: "1.2rem" }}
              >
                <i className="fa fa-twitter"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h6 style={{ fontWeight: "600", marginBottom: "20px" }}>
              Contact Info
            </h6>
            <div style={{ color: "#bdc3c7" }}>
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <i className="fa fa-phone"></i>
                <span>0 (536) 603 9907</span>
              </div>
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <i className="fa fa-envelope"></i>
                <span>info@mitcarrental.com</span>
              </div>
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <i
                  className="fa fa-map-marker"
                  style={{ marginTop: "3px" }}
                ></i>
                <span>Antalya, Turkey</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <i className="fa fa-clock-o"></i>
                <span>Mon - Fri: 08:00 - 18:00</span>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h6 style={{ fontWeight: "600", marginBottom: "20px" }}>
              Quick Links
            </h6>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "8px" }}>
                <Link
                  to="/"
                  style={{ color: "#bdc3c7", textDecoration: "none" }}
                >
                  Home
                </Link>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Link
                  to="/cars"
                  style={{ color: "#bdc3c7", textDecoration: "none" }}
                >
                  Our Fleet
                </Link>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Link
                  to="/news"
                  style={{ color: "#bdc3c7", textDecoration: "none" }}
                >
                  News & Blog
                </Link>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <a
                  href="#"
                  style={{ color: "#bdc3c7", textDecoration: "none" }}
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr style={{ borderColor: "#34495e", margin: "30px 0" }} />

        <div className="row">
          <div className="col-md-6">
            <p style={{ color: "#95a5a6", fontSize: "0.9rem", margin: 0 }}>
              © 2024 Mitcar Rental. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p style={{ color: "#95a5a6", fontSize: "0.9rem", margin: 0 }}>
              <a
                href="#"
                style={{
                  color: "#95a5a6",
                  textDecoration: "none",
                  marginRight: "15px",
                }}
              >
                Privacy Policy
              </a>
              <a href="#" style={{ color: "#95a5a6", textDecoration: "none" }}>
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
