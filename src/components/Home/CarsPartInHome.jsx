// src/components/Home/CarsPartInHome.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Users, Settings, Calendar } from "lucide-react";
import { publicAPI } from "../../services/api";
import { useCurrency } from "../../contexts/CurrencyContext";

// Utility function for price conversion
const convertPricing = (priceInEUR, targetCurrency, exchangeRates) => {
  if (!exchangeRates || !exchangeRates[targetCurrency]) {
    return priceInEUR; // Return original price if no exchange rate available
  }
  return priceInEUR * exchangeRates[targetCurrency];
};

// Utility function to get currency symbol
const getCurrencySymbol = (currency) => {
  const symbols = {
    EUR: "€",
    USD: "$",
    TRY: "₺",
  };
  return symbols[currency] || currency;
};

const CarsPartInHome = () => {
  const navigate = useNavigate();
  // Get currency context
  const { 
    currentCurrency, 
    exchangeRates, 
    convertAndFormatPrice, 
    formatPrice, 
    convertAmount,
    isLoaded: currencyLoaded 
  } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [latestCars, setLatestCars] = useState([]);
  const [error, setError] = useState("");

  // No hardcoded fallback cars - show real data only

  const loadLatestCars = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🚀 Loading latest cars...");

      // Get latest cars sorted by creation date (most recent first)
      const response = await publicAPI.getCars({ 
        limit: 3,
        sort: 'created_at',
        order: 'desc'
      });

      console.log("📡 Cars API response:", response);
      console.log("📊 Response data:", response.data);

      // Extract listings from response.data.listings (PostgreSQL structure)
      const carData = response.data.listings || response.data.data || response.data.cars || [];
      console.log("🚗 Extracted car data:", carData);

      // Take first 3 cars
      const cars = Array.isArray(carData) ? carData.slice(0, 3) : [];

      console.log("🏁 Final latest cars to display:", cars);
      setLatestCars(cars);
    } catch (error) {
      console.error("❌ Failed to load cars:", error);
      setError("Failed to load latest cars");
      setLatestCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLatestCars();
  }, [loadLatestCars]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? "#ffd700" : "#e4e5e9",
            fontSize: "14px",
            marginRight: "2px",
          }}
        >
          
        </span>
      );
    }
    return stars;
  };

  const handleViewCar = (carId) => {
    navigate(`/cars/${carId}`);
  };

  const handleViewAllCars = () => {
    navigate("/cars");
  };

  // Show error state if there's a critical error
  if (error && latestCars.length === 0 && !loading) {
    return (
      <section style={{ backgroundColor: "#f8f9fa", padding: "80px 0" }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "#2c3e50",
                  marginBottom: "20px",
                }}
              >
                Latest Vehicles
              </h2>
              <div
                style={{
                  backgroundColor: "white",
                  padding: "50px",
                  borderRadius: "15px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              >
                <p
                  style={{
                    fontSize: "1.2rem",
                    color: "#666",
                    marginBottom: "20px",
                  }}
                >
                  Unable to load latest vehicles at the moment.
                </p>
                <button
                  onClick={handleViewAllCars}
                  style={{
                    backgroundColor: "#00ff88",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 30px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Browse All Cars
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ backgroundColor: "#f8f9fa", padding: "80px 0" }}>
      <div className="container">
        {/* Section Header */}
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#2c3e50",
                marginBottom: "20px",
              }}
            >
              Featured Vehicles
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#6c757d",
                maxWidth: "700px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              Check out our newest additions - fresh arrivals to our fleet,
              ready for your next journey,
              <br />
              featuring the latest cars just added to our collection.
            </p>
          </div>
        </div>

        {/* Car Cards */}
        <div className="row">
          {/* Debug info */}
          {console.log(
            "🎨 Rendering cars section. Loading:",
            loading,
            "Cars count:",
            latestCars.length,
            "Cars:",
            latestCars
          )}
          {loading ? (
            // Loading skeleton
            [1, 2, 3].map((index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    padding: "25px",
                    textAlign: "center",
                    color: "#6c757d",
                  }}
                >
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p style={{ marginTop: "15px", marginBottom: 0 }}>
                    Loading...
                  </p>
                </div>
              </div>
            ))
          ) : latestCars.length > 0 ? (
            latestCars.map((car) => {
              return (
                <div key={car.id || car._id} className="col-lg-4 col-md-6 mb-4">
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: "15px",
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      cursor: "pointer",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-10px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 30px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(0,0,0,0.1)";
                    }}
                  >
                    {/* Car Image */}
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img
                        src={
                          car.mainImage?.url || 
                          car.main_image?.url ||
                          "/images/cars/default-car.jpg"
                        }
                        alt={car.title}
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                      />

                      {/* Price Badge */}
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          left: "20px",
                          backgroundColor: "#00ff88",
                          borderRadius: "10px",
                          padding: "8px 12px",
                          textAlign: "center",
                          boxShadow: "0 2px 10px rgba(0, 255, 136, 0.3)",
                        }}
                      >
                        <div
                          style={{
                            color: "white",
                            fontSize: "1.2rem",
                            fontWeight: "700",
                            lineHeight: "1",
                          }}
                        >
                          {car.pricing?.daily 
                            ? convertAndFormatPrice(car.pricing.daily, car.pricing?.currency || 'TRY')
                            : "Price not available"}
                        </div>
                        <div
                          style={{
                            color: "white",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            lineHeight: "1",
                          }}
                        >
                          PER DAY
                        </div>
                      </div>

                      {/* Like Button */}
                      <button
                        style={{
                          position: "absolute",
                          top: "20px",
                          right: "20px",
                          background: "rgba(255,255,255,0.9)",
                          border: "none",
                          borderRadius: "25px",
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#00ff88";
                          e.target.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(255,255,255,0.9)";
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        <Heart size={18} color="#666" />
                      </button>

                      {/* Rating Badge */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "15px",
                          right: "15px",
                          background: "rgba(255,255,255,0.95)",
                          borderRadius: "20px",
                          padding: "5px 10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {renderStars(4)}
                        <span style={{ color: "#333", marginLeft: "5px" }}>
                          5+
                        </span>
                      </div>
                    </div>

                    {/* Car Content */}
                    <div
                      style={{
                        padding: "25px",
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <h4
                        style={{
                          color: "#2c3e50",
                          fontSize: "1.3rem",
                          fontWeight: "700",
                          marginBottom: "15px",
                          lineHeight: "1.4",
                        }}
                      >
                        {car.title}
                      </h4>

                      {/* Car Features */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "20px",
                          padding: "15px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={{ textAlign: "center", flex: 1 }}>
                          <Users
                            size={16}
                            color="#666"
                            style={{ marginBottom: "5px" }}
                          />
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              fontWeight: "600",
                            }}
                          >
                            {car.seats || "5"} Seats
                          </div>
                        </div>
                        <div style={{ textAlign: "center", flex: 1 }}>
                          <Settings
                            size={16}
                            color="#666"
                            style={{ marginBottom: "5px" }}
                          />
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              fontWeight: "600",
                            }}
                          >
                            {car.transmission || "Auto"}
                          </div>
                        </div>
                        <div style={{ textAlign: "center", flex: 1 }}>
                          <Calendar
                            size={16}
                            color="#666"
                            style={{ marginBottom: "5px" }}
                          />
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              fontWeight: "600",
                            }}
                          >
                            {car.doors || "4"} Doors
                          </div>
                        </div>
                      </div>

                      {/* Car Type */}
                      <div
                        style={{
                          backgroundColor: "#e3f2fd",
                          color: "#1976d2",
                          padding: "8px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          textAlign: "center",
                          marginBottom: "20px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {car.category || car.body_type || car.bodyType || "Car"}
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => handleViewCar(car.id || car._id)}
                        style={{
                          backgroundColor: "#00ff88",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 20px",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginTop: "auto",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#00cc6a";
                          e.target.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#00ff88";
                          e.target.style.transform = "translateY(0)";
                        }}
                      >
                        View Details
                      </button>

                      {/* Bottom Border */}
                      <div
                        style={{
                          marginTop: "20px",
                          height: "3px",
                          background:
                            "linear-gradient(to right, #00ff88, #00cc6a)",
                          borderRadius: "2px",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12">
              <div
                style={{
                  textAlign: "center",
                  padding: "50px",
                  color: "#666",
                  backgroundColor: "white",
                  borderRadius: "15px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              >
                <p style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
                  No cars added yet. Check back soon for our latest additions!
                </p>
                <p style={{ fontSize: "1rem", color: "#999" }}>
                  {error || "Please check back later or browse all cars."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* View All Cars Button */}
        <div className="row">
          <div className="col-12 text-center mt-4">
            <button
              style={{
                backgroundColor: "transparent",
                color: "#00ff88",
                border: "2px solid #00ff88",
                borderRadius: "8px",
                padding: "12px 30px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#00ff88";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#00ff88";
              }}
              onClick={handleViewAllCars}
            >
              View All Cars
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarsPartInHome;
