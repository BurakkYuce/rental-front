// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import CurrencySelector from "./CurrencySelector";

const Header = () => {
  return (
    <header className="transparent scroll-light has-topbar">
      {/* Topbar */}
      <div id="topbar" className="topbar-dark text-light">
        <div className="container">
          <div className="topbar-left xs-hide">
            <div className="topbar-widget">
              <div className="topbar-widget">
                <a href="#">
                  <i className="fa fa-phone"></i>+208 333 9296
                </a>
              </div>
              <div className="topbar-widget">
                <a href="#">
                  <i className="fa fa-envelope"></i>contact@rentaly.com
                </a>
              </div>
              <div className="topbar-widget">
                <a href="#">
                  <i className="fa fa-clock-o"></i>Mon - Fri 08.00 - 18.00
                </a>
              </div>
            </div>
          </div>

          <div className="topbar-right">
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              {/* Currency Selector */}
              <CurrencySelector variant="header" />

              <div className="social-icons">
                <a href="#">
                  <i className="fa fa-facebook fa-lg"></i>
                </a>
                <a href="#">
                  <i className="fa fa-twitter fa-lg"></i>
                </a>
                <a href="#">
                  <i className="fa fa-youtube fa-lg"></i>
                </a>
                <a href="#">
                  <i className="fa fa-pinterest fa-lg"></i>
                </a>
                <a href="#">
                  <i className="fa fa-instagram fa-lg"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="clearfix"></div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="de-flex sm-pt10">
              <div className="de-flex-col">
                <div className="de-flex-col">
                  {/* Logo */}
                  <div id="logo">
                    <Link to="/">
                      <img
                        className="logo-1"
                        src="images/logo-light.png"
                        alt=""
                      />
                      <img className="logo-2" src="images/logo.png" alt="" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="de-flex-col header-col-mid">
                <ul id="mainmenu">
                  <li>
                    <Link className="menu-item" to="/">
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link className="menu-item" to="/cars">
                      Cars
                    </Link>
                  </li>

                  <li>
                    <Link className="menu-item" to="/booking">
                      Booking
                    </Link>
                  </li>

                  <li>
                    <a className="menu-item" href="#">
                      Pages
                    </a>
                    <ul>
                      <li>
                        <Link className="menu-item" to="/about">
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link className="menu-item" to="/contact">
                          Contact
                        </Link>
                      </li>
                      <li>
                        <Link className="menu-item" to="/login">
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link className="menu-item" to="/register">
                          Register
                        </Link>
                      </li>
                      <li>
                        <Link className="menu-item" to="/404">
                          Page 404
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <a className="menu-item" href="#">
                      News
                    </a>
                  </li>
                </ul>
              </div>

              <div className="de-flex-col">
                <div className="menu_side_area">
                  <Link to="/login" className="btn-main">
                    Sign In
                  </Link>
                  <span id="menu-btn"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
