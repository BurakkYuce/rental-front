// src/components/Home/VehicleFleet.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { publicAPI } from "../../services/api";
import { useCurrency } from "../../contexts/CurrencyContext";
// import "../../assets/css/vehicle-fleet.css"; // CSS handled by main stylesheets
import "../../assets/css/bootstrap.min.css"; // Importing Bootstrap for styling

const VehicleFleet = () => {
  const navigate = useNavigate();
  const { convertAndFormatPrice } = useCurrency();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  // Load all cars on component mount
  useEffect(() => {
    loadAllCars();
  }, []);

  const loadAllCars = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Loading all cars...");
      const response = await publicAPI.getCars({
        limit: 50, // Get more cars for slider
        page: 1,
        status: "active",
      });
      console.log("🚗 Cars API response:", response);
      console.log("🚗 Response structure:", response.data);

      // Handle both possible response structures
      let carsData = [];
      if (response.data && response.data.success) {
        carsData =
          response.data.data?.listings ||
          response.data.data?.cars ||
          response.data.listings ||
          [];
      }
      console.log("🚗 Processed cars data:", carsData);
      console.log("🚗 Sample car data (first car):", carsData[0]);

      setCars(carsData);

      if (carsData.length === 0) {
        console.warn("No cars found in API response");
      }
    } catch (error) {
      console.error("Failed to load cars:", error);
      setError("Failed to load cars. Please try again later.");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCar = (carId) => {
    navigate(`/cars/${carId}`);
  };

  const handleViewAllCars = () => {
    navigate("/cars");
  };

  // Slider navigation
  const nextSlide = () => {
    if (cars.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(cars.length / 3));
    }
  };

  const prevSlide = () => {
    if (cars.length > 0) {
      setCurrentSlide(
        (prev) =>
          (prev - 1 + Math.ceil(cars.length / 3)) % Math.ceil(cars.length / 3)
      );
    }
  };

  // Auto-slide effect
  useEffect(() => {
    if (cars.length > 3) {
      const interval = setInterval(nextSlide, 5000); // Auto slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [cars.length]);

  console.log("🚗 VehicleFleet component rendering...");

  return (
    <>
      {/* Adventure Section with Background */}
      <section
        style={{
          backgroundImage: "url(/images/background/3.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundAttachment: "fixed",
          position: "relative",
          minHeight: "500px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1,
          }}
        ></div>

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            {/* Left Side - Adventure Text */}
            <div className="col-lg-3">
              <h1
                style={{
                  color: "white",
                  fontSize: "3rem",
                  fontWeight: "700",
                  lineHeight: "1.2",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                }}
              >
                Maceranız Başlasın
              </h1>
            </div>

            {/* Right Side - 3 Features */}
            <div className="col-lg-9">
              <div className="row">
                {/* First Class Services */}
                <div className="col-md-4 mb-4">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#1ecb15",
                        borderRadius: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 4px 20px rgba(30, 203, 21, 0.3)",
                      }}
                    >
                      {/* Trophy Icon */}
                      <svg
                        width="40"
                        height="40"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V7C19 10.31 16.31 13 13 13H11C7.69 13 5 10.31 5 7V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V7C7 9.21 8.79 11 11 11H13C15.21 11 17 9.21 17 7V6H7ZM12 15C14.21 15 16 16.79 16 19V20C16 20.55 15.55 21 15 21H9C8.45 21 8 20.55 8 20V19C8 16.79 9.79 15 12 15Z" />
                      </svg>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: "white",
                          fontSize: "1.4rem",
                          fontWeight: "700",
                          marginBottom: "12px",
                          textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                        }}
                      >
                        Birinci Sınıf Hizmet
                      </h4>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.9)",
                          fontSize: "1rem",
                          lineHeight: "1.6",
                          margin: "0",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                        }}
                      >
                        Lüksün olağanüstü özenle buluştuğu yerde,
                        beklentilerinizi aşan ve unutulmaz anlar yaratan bir
                        deneyim.{" "}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 24/7 Road Assistance */}
                <div className="col-md-4 mb-4">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#1ecb15",
                        borderRadius: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 4px 20px rgba(30, 203, 21, 0.3)",
                      }}
                    >
                      {/* Warning/Support Icon */}
                      <svg
                        width="40"
                        height="40"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2ZM12 6.5L11.37 9.5L8.5 9.5L11.37 9.5L12 6.5ZM12 17.5L12.63 14.5L15.5 14.5L12.63 14.5L12 17.5ZM19 15L19.5 16.5L21 17L19.5 17.5L19 19L18.5 17.5L17 17L18.5 16.5L19 15ZM8 3L8.5 4.5L10 5L8.5 5.5L8 7L7.5 5.5L6 5L7.5 4.5L8 3Z" />
                      </svg>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: "white",
                          fontSize: "1.4rem",
                          fontWeight: "700",
                          marginBottom: "12px",
                          textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                        }}
                      >
                        7/24 Yol Yardımı
                      </h4>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.9)",
                          fontSize: "1rem",
                          lineHeight: "1.6",
                          margin: "0",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                        }}
                      >
                        En çok ihtiyaç duyduğunuz anda yanınızda; güvenle ve
                        huzurla yola devam etmenizi sağlar.{" "}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Free Pick-Up & Drop-Off */}
                <div className="col-md-4 mb-4">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#1ecb15",
                        borderRadius: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 4px 20px rgba(30, 203, 21, 0.3)",
                      }}
                    >
                      {/* Key Icon */}
                      <svg
                        width="40"
                        height="40"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 14C5.9 14 5 13.1 5 12S5.9 10 7 10 9 10.9 9 12 8.1 14 7 14M12.6 10C11.8 7.7 9.6 6 7 6C3.7 6 1 8.7 1 12S3.7 18 7 18C9.6 18 11.8 16.3 12.6 14H16V18H20V14H23V10H12.6Z" />
                      </svg>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: "white",
                          fontSize: "1.4rem",
                          fontWeight: "700",
                          marginBottom: "12px",
                          textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                        }}
                      >
                        Ücretsiz Alım ve Teslimat
                      </h4>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.9)",
                          fontSize: "1rem",
                          lineHeight: "1.6",
                          margin: "0",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                        }}
                      >
                        Ücretsiz araç teslim alma ve bırakma hizmetiyle kiralama
                        deneyiminizi daha da kolaylaştırın.{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cars Slider Section */}
      <section style={{ backgroundColor: "#f8f9fa", padding: "100px 0" }}>
        <div className="container-fluid px-5">
          {/* Cars Slider */}
          <div className="row">
            <div className="col-12">
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  minHeight: "450px",
                }}
              >
                {loading ? (
                  // Loading state
                  <div className="row">
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="col-lg-4 col-md-6 mb-4">
                        <div
                          style={{
                            backgroundColor: "white",
                            borderRadius: "15px",
                            padding: "25px",
                            textAlign: "center",
                            color: "#6c757d",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          }}
                        >
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p style={{ marginTop: "15px", marginBottom: 0 }}>
                            Loading cars...
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  // Error state
                  <div className="row">
                    <div className="col-12">
                      <div
                        style={{
                          backgroundColor: "white",
                          borderRadius: "15px",
                          padding: "40px",
                          textAlign: "center",
                          color: "#dc3545",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        }}
                      >
                        <svg
                          width="48"
                          height="48"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          style={{ marginBottom: "20px" }}
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <h4 style={{ marginBottom: "15px" }}>{error}</h4>
                        <button
                          onClick={loadAllCars}
                          style={{
                            backgroundColor: "#1ecb15",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "10px 20px",
                            fontSize: "1rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#00cc6a";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#1ecb15";
                          }}
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                ) : cars.length === 0 ? (
                  // No cars available state
                  <div className="row">
                    <div className="col-12">
                      <div
                        style={{
                          backgroundColor: "white",
                          borderRadius: "15px",
                          padding: "40px",
                          textAlign: "center",
                          color: "#6c757d",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        }}
                      >
                        <svg
                          width="48"
                          height="48"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          style={{ marginBottom: "20px" }}
                        >
                          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                        </svg>
                        <h4 style={{ marginBottom: "15px" }}>
                          No Cars Available
                        </h4>
                        <p style={{ marginBottom: "20px" }}>
                          There are currently no cars available. Please check
                          back later.
                        </p>
                        <button
                          onClick={loadAllCars}
                          style={{
                            backgroundColor: "#1ecb15",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "10px 20px",
                            fontSize: "1rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#00cc6a";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#1ecb15";
                          }}
                        >
                          Refresh
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Slider Container */}
                    <div
                      ref={sliderRef}
                      style={{
                        display: "flex",
                        transition: "transform 0.5s ease",
                        transform: `translateX(-${currentSlide * 100}%)`,
                      }}
                    >
                      {/* Group cars into slides of 3 */}
                      {Array.from({ length: Math.ceil(cars.length / 3) }).map(
                        (_, slideIndex) => (
                          <div
                            key={slideIndex}
                            style={{
                              minWidth: "100%",
                              display: "flex",
                              gap: "40px",
                              padding: "0 20px",
                            }}
                          >
                            {cars
                              .slice(slideIndex * 3, slideIndex * 3 + 3)
                              .map((car) => {
                                // Debug car image data
                                console.log(
                                  `🖼️ Car ${car.brand} ${car.model} image data:`,
                                  {
                                    mainImage: car.mainImage,
                                    main_image: car.main_image,
                                    image: car.image,
                                    images: car.images,
                                  }
                                );

                                return (
                                  <div
                                    key={car.id || car._id}
                                    style={{
                                      flex: "1",
                                      maxWidth: "calc(33.333% - 27px)",
                                      minHeight: "420px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        backgroundColor: "white",
                                        borderRadius: "15px",
                                        overflow: "hidden",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                        transition:
                                          "transform 0.3s ease, box-shadow 0.3s ease",
                                        cursor: "pointer",
                                        height: "100%",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.transform =
                                          "translateY(-10px)";
                                        e.currentTarget.style.boxShadow =
                                          "0 8px 30px rgba(0,0,0,0.15)";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.transform =
                                          "translateY(0)";
                                        e.currentTarget.style.boxShadow =
                                          "0 4px 20px rgba(0,0,0,0.1)";
                                      }}
                                    >
                                      {/* Car Image */}
                                      <div
                                        style={{
                                          position: "relative",
                                          overflow: "hidden",
                                        }}
                                      >
                                        {car.mainImage?.url ||
                                        car.main_image?.url ||
                                        car.image?.url ||
                                        car.image ||
                                        car.images?.main?.url ? (
                                          <img
                                            src={
                                              car.mainImage?.url ||
                                              car.main_image?.url ||
                                              car.image?.url ||
                                              car.image ||
                                              car.images?.main?.url
                                            }
                                            alt={
                                              car.mainImage?.alt ||
                                              car.main_image?.alt ||
                                              car.image?.alt ||
                                              `${car.brand} ${car.model}`
                                            }
                                            onError={(e) => {
                                              console.warn(
                                                `🖼️ Image failed to load for ${car.brand} ${car.model}:`,
                                                e.target.src
                                              );
                                              // Hide the image and show the fallback div instead
                                              e.target.style.display = "none";
                                              e.target.parentNode.querySelector(
                                                ".fallback-image"
                                              ).style.display = "flex";
                                            }}
                                            style={{
                                              width: "100%",
                                              height: "250px",
                                              objectFit: "cover",
                                              transition: "transform 0.3s ease",
                                            }}
                                          />
                                        ) : null}

                                        {/* Fallback Image Div */}
                                        <div
                                          className="fallback-image"
                                          style={{
                                            display:
                                              car.mainImage?.url ||
                                              car.main_image?.url ||
                                              car.image?.url ||
                                              car.image ||
                                              car.images?.main?.url
                                                ? "none"
                                                : "flex",
                                            width: "100%",
                                            height: "250px",
                                            backgroundColor: "#1ecb15",
                                            color: "white",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "1.2rem",
                                            fontWeight: "600",
                                            textAlign: "center",
                                            padding: "20px",
                                            boxSizing: "border-box",
                                          }}
                                        >
                                          {car.brand} {car.model}
                                        </div>

                                        {/* Status Badge */}
                                        {car.status === "active" && (
                                          <div
                                            style={{
                                              position: "absolute",
                                              top: "15px",
                                              left: "15px",
                                              backgroundColor:
                                                "rgba(30, 203, 21, 0.9)",
                                              borderRadius: "6px",
                                              padding: "3px 6px",
                                              textAlign: "center",
                                            }}
                                          >
                                            <div
                                              style={{
                                                color: "white",
                                                fontSize: "0.6rem",
                                                fontWeight: "600",
                                                textTransform: "uppercase",
                                              }}
                                            >
                                              Available
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Car Content */}
                                      <div style={{ padding: "20px" }}>
                                        <h5
                                          style={{
                                            color: "#2c3e50",
                                            fontSize: "1.1rem",
                                            fontWeight: "700",
                                            marginBottom: "8px",
                                            lineHeight: "1.4",
                                          }}
                                        >
                                          {car.brand} {car.model}
                                        </h5>

                                        <p
                                          style={{
                                            color: "#6c757d",
                                            fontSize: "0.8rem",
                                            marginBottom: "12px",
                                          }}
                                        >
                                          Year: {car.year}
                                        </p>

                                        {/* Car Features */}
                                        <div
                                          style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: "8px",
                                            marginBottom: "15px",
                                            fontSize: "0.75rem",
                                            color: "#6c757d",
                                            padding: "12px",
                                            backgroundColor: "#f8f9fa",
                                            borderRadius: "8px",
                                          }}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "5px",
                                              padding: "4px 0",
                                            }}
                                          >
                                            👥 {car.seats || "5"} Seats
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "5px",
                                              padding: "4px 0",
                                            }}
                                          >
                                            ⚙️ {car.transmission || "Auto"}
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "5px",
                                              padding: "4px 0",
                                            }}
                                          >
                                            🚪 {car.doors || "4"} Doors
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "5px",
                                              padding: "4px 0",
                                            }}
                                          >
                                            ⛽ {car.fuelType || "Petrol"}
                                          </div>
                                        </div>

                                        {/* View Details Button */}
                                        <button
                                          onClick={() =>
                                            handleViewCar(car._id || car.id)
                                          }
                                          style={{
                                            backgroundColor: "#1ecb15",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "6px",
                                            padding: "8px 16px",
                                            fontSize: "0.8rem",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px",
                                            width: "100%",
                                          }}
                                          onMouseEnter={(e) => {
                                            e.target.style.backgroundColor =
                                              "#00cc6a";
                                            e.target.style.transform =
                                              "translateY(-2px)";
                                          }}
                                          onMouseLeave={(e) => {
                                            e.target.style.backgroundColor =
                                              "#1ecb15";
                                            e.target.style.transform =
                                              "translateY(0)";
                                          }}
                                        >
                                          View Details
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )
                      )}
                    </div>

                    {/* Navigation Arrows */}
                    {cars.length > 3 && (
                      <>
                        <button
                          onClick={prevSlide}
                          style={{
                            position: "absolute",
                            left: "-70px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "#1ecb15",
                            border: "none",
                            borderRadius: "50%",
                            width: "60px",
                            height: "60px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 6px 20px rgba(30, 203, 21, 0.4)",
                            transition: "all 0.3s ease",
                            zIndex: 10,
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#179510";
                            e.target.style.transform =
                              "translateY(-50%) scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#1ecb15";
                            e.target.style.transform =
                              "translateY(-50%) scale(1)";
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            fill="white"
                            viewBox="0 0 24 24"
                          >
                            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                          </svg>
                        </button>

                        <button
                          onClick={nextSlide}
                          style={{
                            position: "absolute",
                            right: "-70px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "#1ecb15",
                            border: "none",
                            borderRadius: "50%",
                            width: "60px",
                            height: "60px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 6px 20px rgba(30, 203, 21, 0.4)",
                            transition: "all 0.3s ease",
                            zIndex: 10,
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#179510";
                            e.target.style.transform =
                              "translateY(-50%) scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#1ecb15";
                            e.target.style.transform =
                              "translateY(-50%) scale(1)";
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            fill="white"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Slide Indicators */}
                    {cars.length > 3 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "15px",
                          marginTop: "40px",
                        }}
                      >
                        {Array.from({ length: Math.ceil(cars.length / 3) }).map(
                          (_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              style={{
                                width: currentSlide === index ? "40px" : "15px",
                                height: "15px",
                                borderRadius: "25px",
                                border: "2px solid #1ecb15",
                                backgroundColor:
                                  currentSlide === index
                                    ? "#1ecb15"
                                    : "transparent",
                                cursor: "pointer",
                                transition: "all 0.4s ease",
                                boxShadow:
                                  currentSlide === index
                                    ? "0 4px 12px rgba(30, 203, 21, 0.3)"
                                    : "none",
                              }}
                              onMouseEnter={(e) => {
                                if (currentSlide !== index) {
                                  e.target.style.backgroundColor =
                                    "rgba(30, 203, 21, 0.1)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (currentSlide !== index) {
                                  e.target.style.backgroundColor =
                                    "transparent";
                                }
                              }}
                            />
                          )
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VehicleFleet;
