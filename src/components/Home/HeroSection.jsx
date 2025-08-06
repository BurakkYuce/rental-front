// src/components/Home/HeroSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Location options for pickup and dropoff
const locationOptions = [
  "Antalya Havalimanı (AYT)",
  "Antalya Belek Otel Teslimi",
  "Antalya Merkez Ofis",
  "Antalya Otogar",
  "Antalya Lara",
  "Antalya Konyaaltı",
  "Antalya Kemer",
  "Antalya Alanya"
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    returnDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.pickupDate && formData.returnDate) {
      const pickupDate = new Date(formData.pickupDate);
      const returnDate = new Date(formData.returnDate);

      if (pickupDate >= returnDate) {
        alert(
          "Return date must be after pickup date. Please select valid dates."
        );
        return;
      }
    }

    const queryParams = new URLSearchParams();
    if (formData.pickupLocation)
      queryParams.set("pickupLocation", formData.pickupLocation);
    if (formData.dropoffLocation)
      queryParams.set("dropoffLocation", formData.dropoffLocation);
    if (formData.pickupDate) queryParams.set("pickupDate", formData.pickupDate);
    if (formData.returnDate) queryParams.set("returnDate", formData.returnDate);

    navigate(`/cars?${queryParams.toString()}`);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getMinReturnDate = () => {
    if (formData.pickupDate) {
      const pickupDate = new Date(formData.pickupDate);
      pickupDate.setDate(pickupDate.getDate() + 1);
      return pickupDate.toISOString().split("T")[0];
    }
    return getTodayDate();
  };

  return (
    <>
      <style>
        {`
          input[type="date"] {
            background-color: #ffffff !important;
            color: #333 !important;
            opacity: 1 !important;
            visibility: visible !important;
            -webkit-appearance: none !important;
            -moz-appearance: textfield !important;
            appearance: none !important;
            -webkit-text-fill-color: #333 !important;
          }
          input[type="date"]::-webkit-calendar-picker-indicator {
            opacity: 1 !important;
            filter: invert(1) !important;
            cursor: pointer;
          }
          input[type="date"]::-webkit-datetime-edit {
            color: #333 !important;
            background-color: transparent !important;
          }
          input[type="date"]::-webkit-datetime-edit-text {
            color: #333 !important;
          }
          input[type="date"]::-webkit-datetime-edit-month-field {
            color: #333 !important;
          }
          input[type="date"]::-webkit-datetime-edit-day-field {
            color: #333 !important;
          }
          input[type="date"]::-webkit-datetime-edit-year-field {
            color: #333 !important;
          }
        `}
      </style>
      <section
      id="section-hero"
      aria-label="section"
      className="hero-static jarallax"
      style={{
        width: "100%", // ✅
        maxWidth: "100%", // ✅
        padding: "50px",
        minHeight: "90vh",
        position: "relative",
        backgroundImage: "url(/images/background/1.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background overlay */}
      <div
        style={{
          display: "flex",
          position: "absolute",

          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        }}
      ></div>

      {/* Full width content container */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "90vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "100px 0 60px 0",
        }}
      >
        <div
          className="container"
          style={{ width: "100%", maxWidth: "1200px" }}
        >
          <div className="row align-items-center">
            <div className="col-lg-12 text-center text-light mb-5">
              <h1
                style={{
                  color: "white",
                  textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
                  fontSize: "2.8rem",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  lineHeight: "1.2",
                }}
              >
                Looking for a{" "}
                <span
                  style={{
                    color: "#00ff88",
                    padding: "10px ",
                    marginTop: "20px",
                  }}
                >
                  vehicle
                </span>
                ? You're at the right place.
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.9)",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                  fontSize: "1.2rem",
                  marginBottom: "30px",
                  maxWidth: "600px",
                  margin: "0 auto 30px auto",
                }}
              >
                Discover the perfect vehicle for your journey with our premium
                rental service
              </p>
            </div>

            <div className="col-lg-12">
              <div
                className="rental-form-container"
                style={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderRadius: "15px",
                  padding: "30px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
                  maxWidth: "900px",
                  margin: "0 auto",
                  position: "relative",
                  zIndex: "1",
                }}
              >
                <form
                  name="contactForm"
                  id="contact_form"
                  method="post"
                  onSubmit={handleSubmit}
                >
                  <div className="row">
                    {/* Form Input Fields */}
                    <div className="col-lg-3 col-md-6 mb-3">
                      <label
                        htmlFor="pickupLocation"
                        style={{
                          color: "#333",
                          fontWeight: "600",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Pick Up Location
                      </label>
                      <select
                        id="pickupLocation"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "12px 15px",
                          border: "2px solid #e9ecef",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          backgroundColor: "white",
                          color: "#333",
                          transition: "border-color 0.3s ease",
                        }}
                      >
                        <option value="">Select pickup location</option>
                        {locationOptions.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                      <label
                        style={{
                          color: "#333",
                          fontWeight: "600",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Drop Off Location
                      </label>
                      <select
                        name="dropoffLocation"
                        value={formData.dropoffLocation}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "12px 15px",
                          border: "2px solid #e9ecef",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          backgroundColor: "white",
                          color: "#333",
                          transition: "border-color 0.3s ease",
                        }}
                      >
                        <option value="">Select dropoff location</option>
                        {locationOptions.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                      <label
                        style={{
                          color: "#333",
                          fontWeight: "600",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Pick Up Date
                      </label>
                      <input
                        type="date"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleInputChange}
                        min={getTodayDate()}
                        style={{
                          width: "100%",
                          padding: "12px 15px",
                          border: "2px solid #e9ecef",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          backgroundColor: "#ffffff",
                          color: "#333",
                          transition: "border-color 0.3s ease",
                          opacity: "1",
                          visibility: "visible",
                          zIndex: "10",
                          position: "relative",
                          boxShadow: "inset 0 0 0 1000px #ffffff",
                          WebkitBoxShadow: "inset 0 0 0 1000px #ffffff",
                          MozBoxShadow: "inset 0 0 0 1000px #ffffff",
                          WebkitTextFillColor: "#333",
                          filter: "none",
                        }}
                      />
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                      <label
                        style={{
                          color: "#333",
                          fontWeight: "600",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Return Date
                      </label>
                      <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleInputChange}
                        min={getMinReturnDate()}
                        style={{
                          width: "100%",
                          padding: "12px 15px",
                          border: "2px solid #e9ecef",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          backgroundColor: "#ffffff",
                          color: "#333",
                          transition: "border-color 0.3s ease",
                          opacity: "1",
                          visibility: "visible",
                          zIndex: "10",
                          position: "relative",
                          boxShadow: "inset 0 0 0 1000px #ffffff",
                          WebkitBoxShadow: "inset 0 0 0 1000px #ffffff",
                          MozBoxShadow: "inset 0 0 0 1000px #ffffff",
                          WebkitTextFillColor: "#333",
                          filter: "none",
                        }}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="col-lg-12 text-center mt-4">
                      <button
                        type="submit"
                        style={{
                          backgroundColor: "#00ff88",
                          color: "white",
                          border: "none",
                          borderRadius: "50px",
                          padding: "15px 40px",
                          fontSize: "1.1rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 15px rgba(0, 255, 136, 0.4)",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#00cc6a";
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow =
                            "0 6px 20px rgba(0, 255, 136, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#00ff88";
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow =
                            "0 4px 15px rgba(0, 255, 136, 0.4)";
                        }}
                      >
                        🚗 Find Your Perfect Vehicle
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Process Steps */}
            <div className="col-lg-12 mt-5">
              <div className="row text-center">
                {[
                  {
                    number: "1",
                    title: "Choose a vehicle",
                    desc: "Select from our premium fleet",
                  },
                  {
                    number: "2",
                    title: "Pick location & date",
                    desc: "Set your rental preferences",
                  },
                  {
                    number: "3",
                    title: "Make a booking",
                    desc: "Secure your reservation",
                  },
                  {
                    number: "4",
                    title: "Sit back & relax",
                    desc: "Enjoy your journey",
                  },
                ].map((step, index) => (
                  <div key={index} className="col-lg-3 col-md-6 mb-4">
                    <div style={{ color: "white", textAlign: "center" }}>
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          backgroundColor: "#00ff88",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 15px auto",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          boxShadow: "0 4px 15px rgba(0, 255, 136, 0.4)",
                        }}
                      >
                        {step.number}
                      </div>
                      <h4
                        style={{
                          color: "white",
                          textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                          marginBottom: "10px",
                        }}
                      >
                        {step.title}
                      </h4>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.9)",
                          textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                        }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default HeroSection;
