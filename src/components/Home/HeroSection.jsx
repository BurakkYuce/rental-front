// src/components/Home/HeroSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Location options for pickup and dropoff
const locationOptions = [
  "Antalya Havalimanı (AYT)",
  "Antalya Belek Otel Bölgesi",
  "Antalya Kadriye Otel Bölgesi",
  "Antalya Merkez Ofis",
  "Antalya Otogar",
  "Antalya Lara",
  "Antalya Konyaaltı",
  "Antalya Kemer",
  "Antalya Alanya",
  "Dalaman Havalimanı",
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    returnDate: "",
  });

  // Date format helper - convert DD/MM/YYYY to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateString;
  };

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDateFromInput = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date input changes
  const handleDateChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tarih validasyonu - invalid ise parametresiz /cars'a git
    let validPickupDate = null;
    let validReturnDate = null;

    // Pickup date validation
    if (formData.pickupDate) {
      const pickupDate = new Date(formData.pickupDate);
      if (
        isNaN(pickupDate.getTime()) ||
        pickupDate < new Date().setHours(0, 0, 0, 0)
      ) {
        // Invalid pickup date - direkt /cars'a git
        console.log(
          "❌ Invalid pickup date, redirecting to /cars without params"
        );
        navigate("/cars");
        return;
      }
      validPickupDate = formData.pickupDate;
    }

    // Return date validation
    if (formData.returnDate) {
      const returnDate = new Date(formData.returnDate);
      if (
        isNaN(returnDate.getTime()) ||
        returnDate < new Date().setHours(0, 0, 0, 0)
      ) {
        // Invalid return date - direkt /cars'a git
        console.log(
          "❌ Invalid return date, redirecting to /cars without params"
        );
        navigate("/cars");
        return;
      }
      validReturnDate = formData.returnDate;
    }

    // Date comparison validation
    if (validPickupDate && validReturnDate) {
      const pickupDate = new Date(validPickupDate);
      const returnDate = new Date(validReturnDate);

      if (pickupDate >= returnDate) {
        alert(
          "Dönüş tarihi alış tarihinden sonra olmalıdır. Lütfen geçerli tarihler seçiniz."
        );
        return;
      }
    }

    // Tüm validasyonlar geçti - query parametreleri ile git
    const queryParams = new URLSearchParams();

    if (formData.pickupLocation) {
      queryParams.set("pickupLocation", formData.pickupLocation);
    }
    if (formData.dropoffLocation) {
      queryParams.set("dropoffLocation", formData.dropoffLocation);
    }
    if (validPickupDate) {
      queryParams.set("pickupDate", validPickupDate);
    }
    if (validReturnDate) {
      queryParams.set("returnDate", validReturnDate);
    }

    const queryString = queryParams.toString();
    const targetUrl = queryString ? `/cars?${queryString}` : "/cars";

    console.log("✅ Valid form data, redirecting to:", targetUrl);
    navigate(targetUrl);
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
          .date-input-wrapper {
            position: relative;
            width: 100%;
          }
          .date-picker-hidden {
            position: absolute !important;
            opacity: 0 !important;
            pointer-events: none !important;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
          }
          .calendar-icon {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #666;
            font-size: 16px;
          }
          .calendar-icon:hover {
            color: #002efcff;
          }

          /* Hero button styles - DÜZELTİLDİ */
          .hero-action-button {
            background-color: #002efcff;
            color: white;
            border: none;
            border-radius: 50px;
            padding: 15px 40px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            text-transform: uppercase;
            letter-spacing: 1px;
            display: block;  /* inline-block yerine block */
            text-align: center;
            text-decoration: none;
            line-height: 1.2;
            /* white-space: nowrap; KALDIRILDI */
            box-sizing: border-box; /* Eklendi */
          }

          /* Button container styles */
          .hero-button-container {
            display: flex;
            gap: 20px;
            justify-content: center;
            align-items: stretch; /* center yerine stretch */
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
          }

          .hero-button-container .hero-action-button {
            flex: 1 1 0; /* flex: 1 yerine flex: 1 1 0 */
            max-width: 280px;
            min-width: 0; /* 200px yerine 0 */
            width: 0; /* 100% yerine 0 */
          }

          /* Desktop hover effects */
          .hero-action-button:hover {
            background-color: #001db8;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }

          /* Tablet and mobile responsive - TAM DÜZELTİLDİ */
          @media screen and (max-width: 768px) {
            .hero-button-container {
              flex-direction: column !important;
              gap: 15px !important;
              max-width: 100% !important; /* 350px yerine 100% */
              padding: 0 20px !important;
            }
            
            .hero-button-container .hero-action-button {
              flex: none !important;
              width: 100% !important;
              max-width: none !important;
              min-width: 0 !important;
              margin: 0 !important;
              display: block !important;
              box-sizing: border-box !important;
            }
          }

          /* Small mobile */
          @media screen and (max-width: 480px) {
            .hero-button-container {
              max-width: 100% !important;
              padding: 0 10px !important;
              gap: 12px !important;
            }
            
            .hero-button-container .hero-action-button {
              padding: 12px 20px !important;
              font-size: 0.95rem !important;
              width: 100% !important;
              min-width: 0 !important;
              max-width: none !important;
              flex: none !important;
              display: block !important;
              box-sizing: border-box !important;
            }
          }
        `}
      </style>
      <section
        id="section-hero"
        aria-label="section"
        className="hero-static jarallax"
        style={{
          width: "100%",
          maxWidth: "100%",
          padding: "50px",
          minHeight: "90vh",
          position: "relative",
          backgroundImage: "url(/images/background/16.jpg)",
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
                {/* Logo */}
                <div
                  style={{
                    marginBottom: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/images/logo/UMİT-2.png"
                    alt="Ümit a rent car"
                    className="hero-section-logo"
                    style={{
                      maxWidth: "300px",
                      width: "100%",
                      height: "auto",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>

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
                  Size en uygun aracı bulalım.
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
                  ANTALYA YILLIK ARAÇ KİRALAMA | FİLO KİRALAMA ANTALYA AYLIK
                  ARAÇ KİRALAMA
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
                          Alış Yeri
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
                          <option value="">Alış Yeri Seçiniz</option>
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
                          Dönüş Yeri
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
                          <option value="">Dönüş Yeri Seçiniz</option>
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
                          Alış Tarihi
                        </label>
                        <div className="date-input-wrapper">
                          <input
                            type="text"
                            value={
                              formData.pickupDate
                                ? formatDateFromInput(formData.pickupDate)
                                : ""
                            }
                            onChange={(e) => {
                              let value = e.target.value;
                              // Auto-format while typing
                              value = value.replace(/[^\d]/g, ""); // Only numbers
                              if (value.length >= 2) {
                                value =
                                  value.slice(0, 2) + "/" + value.slice(2);
                              }
                              if (value.length >= 5) {
                                value =
                                  value.slice(0, 5) + "/" + value.slice(5, 9);
                              }
                              if (value.length <= 10) {
                                const formattedForAPI =
                                  formatDateForInput(value);
                                handleDateChange("pickupDate", formattedForAPI);
                              }
                            }}
                            placeholder="GG/AA/YYYY"
                            maxLength="10"
                            style={{
                              width: "100%",
                              padding: "12px 15px",
                              paddingRight: "45px",
                              border: "2px solid #e9ecef",
                              borderRadius: "10px",
                              fontSize: "1rem",
                              backgroundColor: "white",
                              color: "#333",
                              transition: "border-color 0.3s ease",
                              fontFamily: "monospace",
                            }}
                          />
                          <input
                            type="date"
                            className="date-picker-hidden"
                            onChange={(e) => {
                              handleDateChange("pickupDate", e.target.value);
                            }}
                            value={formData.pickupDate || ""}
                            min={getTodayDate()}
                          />
                          <i
                            className="fa fa-calendar calendar-icon"
                            onClick={() => {
                              const hiddenInput = document.querySelector(
                                ".date-input-wrapper .date-picker-hidden"
                              );
                              if (hiddenInput) {
                                hiddenInput.showPicker();
                              }
                            }}
                          />
                        </div>
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
                          İade Tarihi
                        </label>
                        <div className="date-input-wrapper">
                          <input
                            type="text"
                            value={
                              formData.returnDate
                                ? formatDateFromInput(formData.returnDate)
                                : ""
                            }
                            onChange={(e) => {
                              let value = e.target.value;
                              // Auto-format while typing
                              value = value.replace(/[^\d]/g, ""); // Only numbers
                              if (value.length >= 2) {
                                value =
                                  value.slice(0, 2) + "/" + value.slice(2);
                              }
                              if (value.length >= 5) {
                                value =
                                  value.slice(0, 5) + "/" + value.slice(5, 9);
                              }
                              if (value.length <= 10) {
                                const formattedForAPI =
                                  formatDateForInput(value);
                                handleDateChange("returnDate", formattedForAPI);
                              }
                            }}
                            placeholder="GG/AA/YYYY"
                            maxLength="10"
                            style={{
                              width: "100%",
                              padding: "12px 15px",
                              paddingRight: "45px",
                              border: "2px solid #e9ecef",
                              borderRadius: "10px",
                              fontSize: "1rem",
                              backgroundColor: "white",
                              color: "#333",
                              transition: "border-color 0.3s ease",
                              fontFamily: "monospace",
                            }}
                          />
                          <input
                            type="date"
                            className="date-picker-hidden"
                            onChange={(e) => {
                              handleDateChange("returnDate", e.target.value);
                            }}
                            value={formData.returnDate || ""}
                            min={getMinReturnDate()}
                          />
                          <i
                            className="fa fa-calendar calendar-icon"
                            onClick={() => {
                              const hiddenInputs = document.querySelectorAll(
                                ".date-picker-hidden"
                              );
                              if (hiddenInputs.length > 1) {
                                hiddenInputs[1].showPicker();
                              }
                            }}
                          />
                        </div>
                      </div>
                      {/* Submit Buttons */}
                      <div className="col-lg-12 text-center mt-4">
                        <div className="hero-button-container">
                          {/* Araç kiralama butonu */}
                          <button
                            type="button"
                            className="hero-action-button"
                            onClick={() => navigate("/cars")}
                          >
                            🚗 Araç Kiralama
                          </button>

                          {/* Transfer hizmeti butonu */}
                          <button
                            type="button"
                            className="hero-action-button"
                            onClick={() => navigate("/transfer-service")}
                          >
                            🚐 Transfer Hizmeti
                          </button>
                        </div>
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
                      title: "Araç Seçin",
                      desc: "Premium filomuzdan istediğinizi seçin",
                    },
                    {
                      number: "2",
                      title: "Konum ve Tarih Belirleyin",
                      desc: "Kiralama tercihlerinizi ayarlayın",
                    },
                    {
                      number: "3",
                      title: "Rezervasyon Yapın",
                      desc: "Yerinizin garantisini alın",
                    },
                    {
                      number: "4",
                      title: "Arkanıza Yaslanın",
                      desc: "Yolculuğunuzun keyfini çıkarın",
                    },
                  ].map((step, index) => (
                    <div key={index} className="col-lg-3 col-md-6 mb-4">
                      <div style={{ color: "white", textAlign: "center" }}>
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            backgroundColor: "#002efcff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 15px auto",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            boxShadow: "0 4px 15px rgba(0, 94, 255, 0.4)",
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
