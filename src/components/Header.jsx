// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import CurrencySelector from "./CurrencySelector";

const Header = () => {
  return (
    <>
      {/* Add mobile-specific CSS */}
      <style>
        {`
          @media (max-width: 768px) {
            .topbar-widget:nth-child(2) {
              display: none !important;
            }
            .social-icons {
              display: none !important;
            }
            .topbar-widget a {
              font-size: 0.75rem !important;
            }
            #topbar .topbar-widget {
              margin-right: 10px !important;
            }
          }
          #menu-btn {
            display: none !important;
          }
        `}
      </style>
      <header className="transparent scroll-light has-topbar">
        {/* Topbar */}
        <div id="topbar" className="topbar-dark text-light">
          <div className="container">
            <div className="topbar-left">
              <div className="topbar-widget">
                <div className="topbar-widget">
                  <a href="#">
                    <i className="fa fa-phone"></i>0 (536) 603 9907
                  </a>
                </div>
                <div className="topbar-widget"></div>
                <div className="topbar-widget">
                  <a href="#">
                    <i className="fa fa-clock-o"></i>Pazartesi - Cuma 08.00 -
                    18.00
                  </a>
                </div>
              </div>
            </div>

            <div className="topbar-right">
              <div
                style={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                {/* Currency Selector */}
                <CurrencySelector variant="header" />

                <div className="social-icons">
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-facebook fa-lg"></i>
                  </a>
                  <a
                    href="https://x.com/yuce07?s=21&t=J1365amuyh0JleZBNlSesQ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-twitter fa-lg"></i>
                  </a>
                  <a
                    href="https://www.youtube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-youtube fa-lg"></i>
                  </a>
                  <a
                    href="https://tr.pinterest.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-pinterest fa-lg"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/mitcarrental/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-instagram fa-lg"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
