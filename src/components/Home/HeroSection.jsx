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

  // Format date from YYYY-MM-DD to DD/MM/YYYY for display
  const formatDateForDisplay = (dateString) => {
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

  // Trigger date picker for Apple/iOS compatibility
  const triggerDatePicker = (inputRef) => {
    if (inputRef && inputRef.current) {
      // For better iOS/Safari compatibility
      inputRef.current.focus();
      inputRef.current.click();

      // Fallback for modern browsers
      if (inputRef.current.showPicker) {
        try {
          inputRef.current.showPicker();
        } catch (error) {
          console.log("showPicker not supported, using fallback");
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Date validation - if invalid go to /cars without params
    let validPickupDate = null;
    let validReturnDate = null;

    // Pickup date validation
    if (formData.pickupDate) {
      const pickupDate = new Date(formData.pickupDate);
      if (
        isNaN(pickupDate.getTime()) ||
        pickupDate < new Date().setHours(0, 0, 0, 0)
      ) {
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

    // All validations passed - go with query parameters
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

  // Create refs for date inputs
  const pickupDateRef = React.useRef(null);
  const returnDateRef = React.useRef(null);

  return (
    <>
      <style>
        {`
          .date-input-wrapper {
            position: relative;
            width: 100%;
          }
          
          .date-display-input {
            width: 100% !important;
            padding: 12px 15px !important;
            padding-right: 45px !important;
            border: 2px solid #e9ecef !important;
            border-radius: 10px !important;
            fontSize: 1rem !important;
            background-color: white !important;
            color: #333 !important;
            transition: border-color 0.3s ease !important;
            font-family: monospace !important;
            cursor: pointer !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
          }
          
          .date-display-input:focus {
            outline: none !important;
            border-color: #002efcff !important;
            box-shadow: 0 0 0 3px rgba(0, 46, 252, 0.1) !important;
          }
          
          .date-picker-hidden {
            position: absolute !important;
            opacity: 0 !important;
            pointer-events: none !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: -1 !important;
          }
          
          .calendar-icon {
            position: absolute !important;
            right: 15px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            cursor: pointer !important;
            color: #666 !important;
            font-size: 16px !important;
            z-index: 2 !important;
          }
          
          .calendar-icon:hover {
            color: #002efcff !important;
          }

          .hero-action-button {
            background: linear-gradient(135deg, #002efcff 0%, #001db8 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 12px !important;
            padding: 16px 24px !important;
            font-size: 1.1rem !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 15px rgba(0, 46, 252, 0.3) !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            text-align: center !important;
            text-decoration: none !important;
            line-height: 1.4 !important;
            box-sizing: border-box !important;
            display: block !important;
            width: 100% !important;
            min-height: 56px !important;
            margin: 0 !important;
            outline: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
          }

          .hero-action-button:hover {
            background: linear-gradient(135deg, #001db8 0%, #001299 100%) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(0, 46, 252, 0.4) !important;
          }

          .hero-action-button:active {
            transform: translateY(0px) !important;
            box-shadow: 0 2px 10px rgba(0, 46, 252, 0.3) !important;
          }

          .hero-button-container {
            display: flex !important;
            gap: 16px !important;
            justify-content: center !important;
            width: 100% !important;
            max-width: 600px !important;
            margin: 0 auto !important;
          }

          .hero-button-container .hero-action-button {
            flex: 1 !important;
          }

          @media (max-width: 768px) {
            .hero-button-container {
              flex-direction: column !important;
              padding: 0 20px !important;
            }
            
            .hero-action-button {
              padding: 14px 20px !important;
              font-size: 1.05rem !important;
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
                            className="date-display-input"
                            value={formatDateForDisplay(formData.pickupDate)}
                            placeholder="GG/AA/YYYY"
                            readOnly
                            onClick={() => triggerDatePicker(pickupDateRef)}
                          />
                          <input
                            ref={pickupDateRef}
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
                            onClick={() => triggerDatePicker(pickupDateRef)}
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
                            className="date-display-input"
                            value={formatDateForDisplay(formData.returnDate)}
                            placeholder="GG/AA/YYYY"
                            readOnly
                            onClick={() => triggerDatePicker(returnDateRef)}
                          />
                          <input
                            ref={returnDateRef}
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
                            onClick={() => triggerDatePicker(returnDateRef)}
                          />
                        </div>
                      </div>
                      {/* Submit Buttons */}
                      <div>
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
