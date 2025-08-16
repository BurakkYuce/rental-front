import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Users, Settings, Calendar, Star } from "lucide-react";
import { publicAPI } from "../../services/api";
import { useCurrency } from "../../contexts/CurrencyContext";

const CarsPartInHome = () => {
  const navigate = useNavigate();
  const {
    currentCurrency,
    exchangeRates,
    convertAndFormatPrice,
    formatPrice,
    convertAmount,
    isLoaded: currencyLoaded,
  } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [latestCars, setLatestCars] = useState([]);
  const [error, setError] = useState("");

  const loadLatestCars = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🚀 Loading latest cars...");

      const response = await publicAPI.getCars({
        limit: 3,
        sort: "created_at",
        order: "desc",
      });

      console.log("📡 Cars API response:", response);
      console.log("📊 Response data:", response.data);

      const carData = response.data?.data?.listings || response.data?.listings || response.data?.data?.cars || response.data?.cars || [];
      console.log("🚗 Extracted car data:", carData);

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
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        style={{
          color: i < rating ? "#ffd700" : "#e4e5e9",
          marginRight: "2px",
          fill: i < rating ? "#ffd700" : "none",
        }}
      />
    ));
  };

  const handleViewCar = (carId) => {
    navigate(`/cars/${carId}`);
  };

  const handleViewAllCars = () => {
    navigate("/cars");
  };

  if (error && latestCars.length === 0 && !loading) {
    return (
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <div
            className="card border-0 shadow-sm text-center p-5"
            style={{ borderRadius: "25px" }}
          >
            <h2 className="h3 fw-bold text-dark mb-4">Latest Vehicles</h2>
            <p className="text-muted mb-4 fs-5">
              Unable to load latest vehicles at the moment.
            </p>
            <button
              onClick={handleViewAllCars}
              className="btn btn-lg px-5 py-3 fw-bold text-white border-0"
              style={{
                background: "linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)",
                borderRadius: "50px",
                boxShadow: "0 8px 25px rgba(0, 255, 136, 0.3)",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 12px 35px rgba(0, 255, 136, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 25px rgba(0, 255, 136, 0.3)";
              }}
            >
              Browse All Cars
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        {/* Car Cards */}
        <div className="row g-4 justify-content-center">
          {loading ? (
            [1, 2, 3].map((index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "20px" }}>
                  <div
                    className="placeholder-glow"
                    style={{
                      height: "280px",
                      borderRadius: "20px 20px 0 0",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <div className="placeholder w-100 h-100" style={{ borderRadius: "20px 20px 0 0" }}></div>
                  </div>
                  <div className="card-body p-4">
                    <div className="placeholder-glow">
                      <div className="placeholder w-75 mb-3" style={{ height: "24px" }}></div>
                      <div className="placeholder w-100 mb-2" style={{ height: "16px" }}></div>
                      <div className="placeholder w-50 mb-3" style={{ height: "16px" }}></div>
                      <div className="placeholder w-100" style={{ height: "45px", borderRadius: "12px" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : latestCars.length > 0 ? (
            latestCars.map((car) => (
              <div key={car.id || car._id} className="col-xl-4 col-lg-6 col-md-6 mb-4">
                <div
                  className="card border-0 shadow-sm h-100 position-relative"
                  style={{
                    borderRadius: "20px",
                    transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    cursor: "pointer",
                    overflow: "hidden",
                    maxWidth: "400px",
                    margin: "0 auto",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                  }}
                >
                  {/* Car Image */}
                  <div
                    className="position-relative overflow-hidden"
                    style={{ borderRadius: "20px 20px 0 0" }}
                  >
                    <img
                      src={
                        car.mainImage?.url ||
                        car.main_image?.url ||
                        "/images/cars/default-car.jpg"
                      }
                      alt={car.title}
                      className="card-img-top"
                      style={{
                        height: "280px",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                    />

                    {/* Price Badge */}
                    <div
                      className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-3 text-white fw-bold text-center"
                      style={{
                        background: "linear-gradient(135deg, #1ecb15, #179510)",
                        boxShadow: "0 4px 15px rgba(30, 203, 21, 0.3)",
                        minWidth: "90px",
                        fontSize: "0.85rem",
                      }}
                    >
                      <div className="fs-6 lh-1 fw-bold">
                        {car.pricing?.daily
                          ? convertAndFormatPrice(
                              car.pricing.daily,
                              car.pricing?.currency || "EUR"
                            )
                          : "Contact Us"}
                      </div>
                      <small
                        className="opacity-75 text-uppercase"
                        style={{ fontSize: "0.7rem" }}
                      >
                        PER DAY
                      </small>
                    </div>

                    {/* Like Button */}
                    <button
                      className="btn position-absolute top-0 end-0 m-3 rounded-circle p-2"
                      style={{
                        width: "45px",
                        height: "45px",
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(10px)",
                        border: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#1ecb15";
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(255,255,255,0.9)";
                        e.target.style.transform = "scale(1)";
                      }}
                    >
                      <Heart size={20} style={{ color: "#666" }} />
                    </button>

                    {/* Rating Badge */}
                    <div
                      className="position-absolute bottom-0 end-0 m-3 px-3 py-1 rounded-pill d-flex align-items-center gap-1"
                      style={{
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {renderStars(car.rating || 4)}
                      <small className="fw-bold ms-1 text-muted">
                        {car.reviews || "5+"}
                      </small>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-4 d-flex flex-column">
                    <h5
                      className="card-title fw-bold text-dark mb-3"
                      style={{ fontSize: "1.3rem", lineHeight: "1.4" }}
                    >
                      {car.title}
                    </h5>

                    {/* Car Features */}
                    <div className="row g-0 mb-4 p-3 bg-light rounded-3">
                      <div className="col-4 text-center">
                        <Users
                          size={20}
                          className="text-primary mb-2 d-block mx-auto"
                          style={{ color: "#1ecb15" }}
                        />
                        <div className="small fw-semibold text-dark">
                          {car.seats || "5"} Seats
                        </div>
                      </div>
                      <div className="col-4 text-center border-start border-end">
                        <Settings
                          size={20}
                          className="text-primary mb-2 d-block mx-auto"
                          style={{ color: "#1ecb15" }}
                        />
                        <div className="small fw-semibold text-dark">
                          {car.transmission || "Auto"}
                        </div>
                      </div>
                      <div className="col-4 text-center">
                        <Calendar
                          size={20}
                          className="text-primary mb-2 d-block mx-auto"
                          style={{ color: "#1ecb15" }}
                        />
                        <div className="small fw-semibold text-dark">
                          {car.doors || "4"} Doors
                        </div>
                      </div>
                    </div>

                    {/* Car Category */}
                    <div className="mb-4">
                      <span
                        className="badge px-3 py-2 rounded-pill fw-semibold text-uppercase"
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea, #764ba2)",
                          color: "white",
                          fontSize: "0.75rem",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {car.category || car.body_type || car.bodyType || "Car"}
                      </span>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => handleViewCar(car.id || car._id)}
                      className="btn w-100 py-3 fw-bold text-white border-0 mt-auto"
                      style={{
                        background: "linear-gradient(135deg, #1ecb15, #179510)",
                        borderRadius: "12px",
                        transition: "all 0.3s ease",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        boxShadow: "0 4px 15px rgba(30, 203, 21, 0.3)",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 8px 25px rgba(30, 203, 21, 0.4)";
                        e.target.style.background = "linear-gradient(135deg, #179510, #0f6b0c)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 4px 15px rgba(30, 203, 21, 0.3)";
                        e.target.style.background = "linear-gradient(135deg, #1ecb15, #179510)";
                      }}
                    >
                      View Details
                    </button>

                    {/* Bottom accent line */}
                    <div
                      className="mt-3"
                      style={{
                        height: "3px",
                        background: "linear-gradient(to right, #1ecb15, #179510)",
                        borderRadius: "2px",
                        opacity: "0.7",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="text-center p-5 bg-white rounded-4 shadow-sm border">
                <div className="mb-4">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                    }}
                  >
                    <svg
                      width="60"
                      height="60"
                      fill="#1ecb15"
                      viewBox="0 0 24 24"
                      style={{ opacity: "0.7" }}
                    >
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-dark mb-3 fw-bold">No Featured Cars Yet</h4>
                <p className="text-muted lead mb-4">
                  {error ? "We're having trouble loading cars right now." : "Check back soon for our latest additions!"}
                </p>
                <button
                  onClick={handleViewAllCars}
                  className="btn px-4 py-2 fw-semibold"
                  style={{
                    background: "linear-gradient(135deg, #1ecb15, #179510)",
                    color: "white",
                    borderRadius: "25px",
                    border: "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  Browse All Cars
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View All Cars Button */}
        {latestCars.length > 0 && (
          <div className="row mt-5">
            <div className="col-12 text-center">
              <button
                onClick={handleViewAllCars}
                className="btn btn-lg px-5 py-3 fw-bold border-0"
                style={{
                  background: "transparent",
                  color: "#1ecb15",
                  border: "2px solid #1ecb15",
                  borderRadius: "50px",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  minWidth: "250px",
                  fontWeight: "600",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #1ecb15, #179510)";
                  e.target.style.color = "white";
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow = "0 10px 30px rgba(30, 203, 21, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#1ecb15";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                View All Cars
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CarsPartInHome;
