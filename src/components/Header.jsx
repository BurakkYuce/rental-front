// src/components/Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CurrencySelector from "./CurrencySelector";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <style>
        {`
          /* Mobile responsive fixes */
          @media (max-width: 768px) {
            /* Hide desktop topbar on mobile */
            #topbar {
              display: none !important;
            }
            
            /* Mobile header styles */
            .mobile-header {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              padding: 10px 15px !important;
              background: rgba(0, 0, 0, 0.9) !important;
              position: sticky !important;
              top: 0 !important;
              z-index: 999 !important;
            }
            
            .mobile-header-left {
              display: flex !important;
              align-items: center !important;
              gap: 15px !important;
            }
            
            .mobile-logo img {
              height: 40px !important;
              width: auto !important;
            }
            
            .hamburger-menu {
              display: flex !important;
              flex-direction: column !important;
              cursor: pointer !important;
              padding: 5px !important;
            }
            
            .hamburger-line {
              width: 25px !important;
              height: 3px !important;
              background-color: white !important;
              margin: 2px 0 !important;
              transition: 0.3s !important;
            }
            
            .hamburger-menu.active .hamburger-line:nth-child(1) {
              transform: rotate(-45deg) translate(-5px, 6px) !important;
            }
            
            .hamburger-menu.active .hamburger-line:nth-child(2) {
              opacity: 0 !important;
            }
            
            .hamburger-menu.active .hamburger-line:nth-child(3) {
              transform: rotate(45deg) translate(-5px, -6px) !important;
            }
            
            /* Mobile menu overlay */
            .mobile-menu-overlay {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              background: rgba(0, 0, 0, 0.8) !important;
              z-index: 1000 !important;
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
              opacity: 0 !important;
              visibility: hidden !important;
              transition: all 0.3s ease !important;
            }
            
            .mobile-menu-overlay.active {
              opacity: 1 !important;
              visibility: visible !important;
            }
            
            .mobile-menu-content {
              background: white !important;
              border-radius: 10px !important;
              padding: 30px !important;
              max-width: 300px !important;
              width: 90% !important;
              text-align: center !important;
              transform: translateY(-50px) !important;
              transition: transform 0.3s ease !important;
            }
            
            .mobile-menu-overlay.active .mobile-menu-content {
              transform: translateY(0) !important;
            }
            
            .mobile-menu-close {
              position: absolute !important;
              top: 15px !important;
              right: 20px !important;
              background: none !important;
              border: none !important;
              font-size: 24px !important;
              cursor: pointer !important;
              color: #333 !important;
            }
            
            .mobile-menu-title {
              font-size: 20px !important;
              font-weight: bold !important;
              margin-bottom: 20px !important;
              color: #333 !important;
            }
            
            .mobile-menu-items {
              display: flex !important;
              flex-direction: column !important;
              gap: 15px !important;
            }
            
            .mobile-menu-item {
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 15px !important;
              border: 2px solid #007bff !important;
              border-radius: 8px !important;
              text-decoration: none !important;
              color: #007bff !important;
              font-weight: 500 !important;
              transition: all 0.3s ease !important;
            }
            
            .mobile-menu-item:hover {
              background: #007bff !important;
              color: white !important;
            }
            
            .mobile-menu-item i {
              margin-right: 10px !important;
              font-size: 18px !important;
            }
          }
          
          @media (min-width: 769px) {
            .mobile-header {
              display: none !important;
            }
            
            .mobile-menu-overlay {
              display: none !important;
            }
            
            /* Desktop header styles */
            header {
              position: relative !important;
              display: block !important;
              width: 100% !important;
              z-index: 999 !important;
            }
            
            #topbar {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              padding: 8px 0 !important;
            }
            
            .social-icons a {
              margin: 0 5px !important;
              color: white !important;
            }
          }

          /* Ensure header is always visible */
          header.transparent {
            background: rgba(0, 0, 0, 0.8) !important;
          }
        `}
      </style>

      <header className="transparent scroll-light has-topbar">
        {/* Desktop Topbar */}
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
                  <i className="fa fa-clock-o"></i>Pazartesi - Cuma 08.00 - 18.00
                </a>
              </div>
            </div>

            <div className="topbar-right">
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <CurrencySelector variant="header" />
                <div className="social-icons">
                  <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-facebook fa-lg"></i>
                  </a>
                  <a href="https://x.com/yuce07?s=21&t=J1365amuyh0JleZBNlSesQ" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-twitter fa-lg"></i>
                  </a>
                  <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-youtube fa-lg"></i>
                  </a>
                  <a href="https://tr.pinterest.com/" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-pinterest fa-lg"></i>
                  </a>
                  <a href="https://www.instagram.com/mitcarrental/" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-instagram fa-lg"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="mobile-header">
          <div className="mobile-header-left">
            <Link to="/" className="mobile-logo">
              <img src="public\images\logo\UMİT-2.png" alt="Yüce Rent a Car" />
            </Link>
            <CurrencySelector variant="header" />
          </div>
          
          <div 
            className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <button className="mobile-menu-close" onClick={closeMobileMenu}>
            ×
          </button>
          
          <div className="mobile-menu-title">Kısayollar</div>
          
          <div className="mobile-menu-items">
            <Link to="/cars" className="mobile-menu-item" onClick={closeMobileMenu}>
              <i className="fa fa-car"></i>
              Arabalar
            </Link>
            
            <Link to="/transfer-services" className="mobile-menu-item" onClick={closeMobileMenu}>
              <i className="fa fa-bus"></i>
              Transfer Hizmeti
            </Link>
            
            <Link to="/news" className="mobile-menu-item" onClick={closeMobileMenu}>
              <i className="fa fa-newspaper-o"></i>
              Bloglar
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;