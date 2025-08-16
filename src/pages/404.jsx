// src/pages/404Page.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import BackToHomeButton from "../components/BackToHomeButton";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="error-page-404">
      {/* Back to Home Button */}
      <BackToHomeButton />
      
      <div className="error-container">
        <div className="error-content">
          <div className="error-left">
            <h1 className="error-title">Something's missing.</h1>
            <p className="error-description">
              Looks like this page is missing. Don't worry though, our best team
              is on the case.
            </p>
            <button className="go-back-btn" onClick={handleGoBack}>
              Go Back
            </button>
          </div>
          <div className="error-right">
            <h2 className="error-code">404</h2>
            <p className="error-status">Not Found</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .error-page-404 {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
            url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
          overflow: hidden;
        }

        .error-container {
          max-width: 1200px;
          width: 100%;
          padding: 0 40px;
        }

        .error-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 60px;
          width: 100%;
        }

        .error-left {
          flex: 1;
          min-width: 300px;
          max-width: 500px;
        }

        .error-right {
          flex: 1;
          text-align: right;
          min-width: 300px;
          max-width: 500px;
        }

        .error-title {
          font-size: 3.5rem;
          font-weight: 300;
          margin-bottom: 24px;
          line-height: 1.1;
          color: #ffffff;
        }

        .error-description {
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 32px;
          opacity: 0.9;
          color: #ffffff;
          font-weight: 300;
        }

        .go-back-btn {
          background: #4caf50;
          color: white;
          border: none;
          padding: 14px 28px;
          font-size: 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .go-back-btn:hover {
          background: #45a049;
          transform: translateY(-2px);
        }

        .error-code {
          font-size: 12rem;
          font-weight: 700;
          margin: 0;
          line-height: 1;
          opacity: 0.9;
          color: white;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .error-status {
          font-size: 1.8rem;
          margin-top: 16px;
          opacity: 0.8;
          color: #ffffff;
          font-weight: 300;
        }

        @media (max-width: 768px) {
          .error-page-404 {
            position: absolute;
            min-height: 100vh;
          }

          .error-container {
            padding: 0 20px;
          }

          .error-content {
            flex-direction: column;
            text-align: center;
            gap: 40px;
          }

          .error-right {
            text-align: center;
            order: -1;
          }

          .error-title {
            font-size: 2.5rem;
          }

          .error-code {
            font-size: 8rem;
          }

          .error-description {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .error-title {
            font-size: 2rem;
          }

          .error-code {
            font-size: 6rem;
          }

          .error-description {
            font-size: 1rem;
          }

          .go-back-btn {
            padding: 12px 24px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
