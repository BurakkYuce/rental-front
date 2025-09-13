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
          /* Mobile responsive fixes */
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
            
            /* Header visibility fixes for mobile */
            header {
              position: relative !important;
              display: block !important;
              width: 100% !important;
              z-index: 999 !important;
              min-height: 60px !important;
            }
            
            #topbar {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              min-height: 50px !important;
              padding: 8px 0 !important;
            }
            
            .topbar-left {
              flex-direction: column !important;
              gap: 5px !important;
            }
            
            .topbar-right {
              margin-top: 10px !important;
            }
            
            .container {
              padding: 0 15px !important;
            }
          }

          /* Ensure header is always visible */
          header.transparent {
            background: rgba(0, 0, 0, 0.8) !important;
          }
          
          @media (max-width: 768px) {
            header.transparent {
              background: rgba(0, 0, 0, 0.9) !important;
              position: sticky !important;
              top: 0 !important;
            }
          }
        `}
      </style>
      <header className="transparent scroll-light has-topbar">
        {/* Topbar */}
        <div id="topbar" className="topbar-dark text-light">
          <div className="container">
            <div className="topbar-left">
              <div className="topbar-widget">
                <a href="tel:+905366039907">
                  <i className="fa fa-phone"></i>0 (536) 603 9907
                </a>
              </div>
              <div className="topbar-widget">
                <a href="#">
                  <i className="fa fa-clock-o"></i>Pazartesi - Cuma 08.00 -
                  18.00
                </a>
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
