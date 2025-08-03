// src/components/Home/VehicleFleet.jsx
import React from "react";
import "./assets/css/vehicleFleet.css"; // Import your custom CSS for the VehicleFleet
const VehicleFleet = () => {
  return (
    <>
      {/* Vehicle Fleet Header */}
      <section className="fleet-header-section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="fleet-title">Our Vehicle Fleet</h2>
              <p className="fleet-subtitle">
                Driving your dreams to reality with an exquisite fleet of
                versatile vehicles for unforgettable journeys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Adventure Section with Background */}
      <section className="adventure-section">
        <div className="adventure-overlay"></div>

        <div className="container adventure-content">
          <div className="row align-items-center">
            {/* Left Side - Adventure Text */}
            <div className="col-lg-3">
              <h1 className="adventure-title">Let's Your Adventure Begin</h1>
            </div>

            {/* Right Side - 3 Features */}
            <div className="col-lg-9">
              <div className="row">
                {/* First Class Services */}
                <div className="col-md-4 mb-4">
                  <div className="adventure-feature">
                    <div className="adventure-icon">
                      <svg
                        width="40"
                        height="40"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V7C19 10.31 16.31 13 13 13H11C7.69 13 5 10.31 5 7V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V7C7 9.21 8.79 11 11 11H13C15.21 11 17 9.21 17 7V6H7ZM12 15C14.21 15 16 16.79 16 19V20C16 20.55 15.55 21 15 21H9C8.45 21 8 20.55 8 20V19C8 16.79 9.79 15 12 15Z" />
                      </svg>
                    </div>
                    <div className="adventure-text">
                      <h4>First Class Services</h4>
                      <p>
                        Where luxury meets exceptional care, creating
                        unforgettable moments and exceeding your every
                        expectation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 24/7 Road Assistance */}
                <div className="col-md-4 mb-4">
                  <div className="adventure-feature">
                    <div className="adventure-icon">
                      <svg
                        width="40"
                        height="40"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2ZM12 6.5L11.37 9.5L8.5 9.5L11.37 9.5L12 6.5ZM12 17.5L12.63 14.5L15.5 14.5L12.63 14.5L12 17.5ZM19 15L19.5 16.5L21 17L19.5 17.5L19 19L18.5 17.5L17 17L18.5 16.5L19 15ZM8 3L8.5 4.5L10 5L8.5 5.5L8 7L7.5 5.5L6 5L7.5 4.5L8 3Z" />
                      </svg>
                    </div>
                    <div className="adventure-text">
                      <h4>24/7 road assistance</h4>
                      <p>
                        Reliable support when you need it most, keeping you on
                        the move with confidence and peace of mind.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Free Pick-Up & Drop-Off */}
                <div className="col-md-4 mb-4">
                  <div className="adventure-feature">
                    <div className="adventure-icon">
                      <svg
                        width="40"
                        height="40"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 14C5.9 14 5 13.1 5 12S5.9 10 7 10 9 10.9 9 12 8.1 14 7 14M12.6 10C11.8 7.7 9.6 6 7 6C3.7 6 1 8.7 1 12S3.7 18 7 18C9.6 18 11.8 16.3 12.6 14H16V18H20V14H23V10H12.6Z" />
                      </svg>
                    </div>
                    <div className="adventure-text">
                      <h4>Free Pick-Up & Drop-Off</h4>
                      <p>
                        Enjoy free pickup and drop-off services, adding an extra
                        layer of ease to your car rental experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VehicleFleet;
