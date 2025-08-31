import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { publicAPI } from "../../services/api";

const CarsPartInHome = () => {
  const navigate = useNavigate();
  const sliderRef = useRef();

  const [loading, setLoading] = useState(true);
  const [latestCars, setLatestCars] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const loadLatestCars = useCallback(async () => {
    try {
      setLoading(true);

      const response = await publicAPI.getCars({
        limit: 6,
        sort: "created_at",
        order: "desc",
      });

      const carData =
        response.data?.data?.listings ||
        response.data?.listings ||
        response.data?.data?.cars ||
        response.data?.cars ||
        response.data?.data?.fleet ||
        response.data?.fleet ||
        response.data?.data?.vehicles ||
        response.data?.vehicles ||
        [];
      const cars = Array.isArray(carData) ? carData.slice(0, 6) : [];
      setLatestCars(cars);
    } catch (error) {
      console.error("❌ Failed to load cars:", error);
      setLatestCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLatestCars();
  }, [loadLatestCars]);

  const handleViewCar = (carId) => {
    navigate(`/cars/${carId}`);
  };

  const handleViewAllCars = () => {
    navigate("/cars");
  };

  // Check if mobile viewport (EXACTLY like LatestNews)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Slider navigation (EXACTLY like LatestNews)
  const nextSlide = () => {
    if (latestCars.length > 0 && !isMobile) {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(latestCars.length / 3));
    }
  };

  const prevSlide = () => {
    if (latestCars.length > 0 && !isMobile) {
      setCurrentSlide(
        (prev) =>
          (prev - 1 + Math.ceil(latestCars.length / 3)) %
          Math.ceil(latestCars.length / 3)
      );
    }
  };

  // Auto-slide effect (disabled on mobile, EXACTLY like LatestNews)
  useEffect(() => {
    if (latestCars.length > 3 && !isMobile) {
      const interval = setInterval(nextSlide, 6000);
      return () => clearInterval(interval);
    }
  }, [latestCars.length, isMobile]);

  return (
    <section style={{ backgroundColor: "#f8f9fa", padding: "100px 0" }}>
      <div className="container-fluid px-5">
        {/* Section Header - Same as LatestNews */}
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
              En Yeni Araçlarımız
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
              Premium filomuzdan seçilen en yeni ve en kaliteli araçlarımızla
              konforlu yolculuğunuzu planlayın.
            </p>
          </div>
        </div>

        {/* Car Carousel - EXACTLY same structure as LatestNews */}
        <div className="row">
          <div className="col-12">
            <div
              className="cars-carousel-container"
              style={{
                position: "relative",
                overflow: isMobile ? "visible" : "hidden",
                minHeight: isMobile ? "auto" : "500px",
              }}
            >
              {loading ? (
                // Loading state - Same as LatestNews
                <div className="row">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="col-lg-4 col-md-6 col-sm-12 mb-4 cars-loading-card"
                    >
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
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Yükleniyor...</span>
                        </div>
                        <p style={{ marginTop: "15px", marginBottom: 0 }}>
                          Araçlar yükleniyor...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Slider Container - EXACTLY same as LatestNews */}
                  <div
                    ref={sliderRef}
                    className="cars-carousel-slides"
                    style={{
                      display: isMobile ? "block" : "flex",
                      transition: isMobile ? "none" : "transform 0.5s ease",
                      transform: isMobile
                        ? "none"
                        : `translateX(-${currentSlide * 100}%)`,
                    }}
                  >
                    {/* Group cars into slides of 3 - EXACTLY same as LatestNews */}
                    {isMobile ? (
                      // Mobile: Show all cars in a single column (EXACTLY same as LatestNews)
                      <div className="cars-slide">
                        {latestCars.map((car) => {
                          return (
                            <div
                              key={car.id || car._id}
                              className="cars-card-item"
                              style={{
                                marginBottom: "2rem",
                                width: "100%",
                              }}
                            >
                              <div
                                className="cars-card-content"
                                style={{
                                  backgroundColor: "white",
                                  borderRadius: "12px",
                                  overflow: "hidden",
                                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                  cursor: "pointer",
                                  height: "auto",
                                }}
                                onClick={() => handleViewCar(car.id || car._id)}
                              >
                                {/* Car Image - NO PRICE BADGE */}
                                <div
                                  style={{
                                    position: "relative",
                                    overflow: "hidden",
                                  }}
                                >
                                  <img
                                    src={
                                      car.mainImage?.url ||
                                      car.main_image?.url ||
                                      car.images?.[0]?.url ||
                                      car.image?.url ||
                                      "/images/cars/default-car.jpg"
                                    }
                                    alt={car.title}
                                    style={{
                                      width: "100%",
                                      height: "200px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>

                                <div style={{ padding: "1.5rem" }}>
                                  <h4
                                    style={{
                                      color: "#2c3e50",
                                      fontSize: "1.1rem",
                                      fontWeight: "700",
                                      marginBottom: "1rem",
                                      lineHeight: "1.4",
                                    }}
                                  >
                                    {car.title}
                                  </h4>

                                  <p
                                    style={{
                                      color: "#6c757d",
                                      fontSize: "0.9rem",
                                      lineHeight: "1.5",
                                      marginBottom: "1.5rem",
                                    }}
                                  >
                                    {car.seats || "5"} koltuk •{" "}
                                    {car.transmission || "Otomatik"} •{" "}
                                    {car.doors || "4"} kapı
                                  </p>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewCar(car.id || car._id);
                                    }}
                                    style={{
                                      backgroundColor: "#1ecb15",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "6px",
                                      padding: "0.75rem 1rem",
                                      fontSize: "0.85rem",
                                      fontWeight: "600",
                                      cursor: "pointer",
                                      width: "100%",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Detayları Görüntüle
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      // Desktop: Show carousel slides (EXACTLY same structure as LatestNews)
                      Array.from({
                        length: Math.ceil(latestCars.length / 3),
                      }).map((_, slideIndex) => (
                        <div
                          key={slideIndex}
                          className="cars-slide"
                          style={{
                            minWidth: "100%",
                            display: "flex",
                            gap: "40px",
                            padding: "0 20px",
                          }}
                        >
                          {latestCars
                            .slice(slideIndex * 3, slideIndex * 3 + 3)
                            .map((car) => {
                              return (
                                <div
                                  key={car.id || car._id}
                                  className="cars-card-item"
                                  style={{
                                    flex: "1",
                                    maxWidth: "calc(33.333% - 27px)",
                                    minHeight: "480px",
                                  }}
                                >
                                  <div
                                    className="cars-card-content"
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
                                    onClick={() =>
                                      handleViewCar(car.id || car._id)
                                    }
                                  >
                                    {/* Car Image - NO PRICE BADGE */}
                                    <div
                                      style={{
                                        position: "relative",
                                        overflow: "hidden",
                                      }}
                                    >
                                      <img
                                        src={
                                          car.mainImage?.url ||
                                          car.main_image?.url ||
                                          car.images?.[0]?.url ||
                                          car.image?.url ||
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
                                    </div>

                                    {/* Car Content */}
                                    <div
                                      style={{
                                        padding: "25px",
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "calc(100% - 250px)",
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

                                      <p
                                        style={{
                                          color: "#6c757d",
                                          fontSize: "1rem",
                                          lineHeight: "1.6",
                                          marginBottom: "20px",
                                          flex: "1",
                                        }}
                                      >
                                        {car.seats || "5"} koltuk •{" "}
                                        {car.transmission || "Otomatik"} •{" "}
                                        {car.doors || "4"} kapı
                                      </p>

                                      {/* View Details Button */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewCar(car.id || car._id);
                                        }}
                                        style={{
                                          backgroundColor: "#1ecb15",
                                          color: "white",
                                          border: "none",
                                          borderRadius: "8px",
                                          padding: "10px 20px",
                                          fontSize: "0.9rem",
                                          fontWeight: "600",
                                          cursor: "pointer",
                                          transition: "all 0.3s ease",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.5px",
                                          width: "100%",
                                          marginTop: "auto",
                                        }}
                                        onMouseEnter={(e) => {
                                          e.target.style.backgroundColor =
                                            "#179510";
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
                                        Detayları Görüntüle
                                      </button>

                                      {/* Bottom Border */}
                                      <div
                                        style={{
                                          marginTop: "20px",
                                          height: "3px",
                                          background:
                                            "linear-gradient(to right, #1ecb15, #179510)",
                                          borderRadius: "2px",
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Navigation Arrows - EXACTLY same as LatestNews */}
                  {latestCars.length > 3 && !isMobile && (
                    <>
                      <button
                        className="cars-nav-arrow"
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
                        className="cars-nav-arrow"
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

                  {/* Slide Indicators - EXACTLY same as LatestNews */}
                  {latestCars.length > 3 && !isMobile && (
                    <div
                      className="cars-indicators"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "15px",
                        marginTop: "40px",
                      }}
                    >
                      {Array.from({
                        length: Math.ceil(latestCars.length / 3),
                      }).map((_, index) => (
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
                              e.target.style.backgroundColor = "transparent";
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* View All Cars Button - EXACTLY same as LatestNews */}
        <div className="row">
          <div className="col-12 text-center mt-4">
            <button
              style={{
                backgroundColor: "transparent",
                color: "#1ecb15",
                border: "2px solid #1ecb15",
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
                e.target.style.background =
                  "linear-gradient(135deg, #1ecb15, #179510)";
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
              onClick={handleViewAllCars}
            >
              Tüm Araçları Görüntüle
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Styles - Price badge CSS removed */}
      <style jsx>{`
        @media (max-width: 768px) {
          /* Section header adjustments */
          .container-fluid {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          /* Convert carousel to stack layout on mobile */
          .cars-carousel-container {
            overflow: visible !important;
            min-height: auto !important;
          }

          .cars-carousel-slides {
            display: block !important;
            transform: none !important;
          }

          .cars-slide {
            min-width: 100% !important;
            display: block !important;
            gap: 20px !important;
            padding: 0 !important;
          }

          .cars-card-item {
            flex: none !important;
            max-width: 100% !important;
            min-height: auto !important;
            margin-bottom: 2rem !important;
          }

          .cars-card-content {
            border-radius: 12px !important;
          }

          /* Image adjustments */
          .cars-card-content img {
            height: 200px !important;
          }

          /* Content padding adjustments */
          .cars-card-content > div:last-child {
            padding: 1.5rem !important;
          }

          /* Title size adjustments */
          .cars-card-content h4 {
            font-size: 1.1rem !important;
            margin-bottom: 1rem !important;
          }

          /* Content text adjustments */
          .cars-card-content p {
            font-size: 0.9rem !important;
            line-height: 1.5 !important;
            margin-bottom: 1.5rem !important;
          }

          /* Button adjustments */
          .cars-card-content button {
            padding: 0.75rem 1rem !important;
            font-size: 0.85rem !important;
          }

          /* Hide navigation arrows on mobile */
          .cars-nav-arrow {
            display: none !important;
          }

          /* Hide indicators on mobile */
          .cars-indicators {
            display: none !important;
          }

          /* Loading cards */
          .cars-loading-card > div {
            padding: 1.5rem !important;
            border-radius: 12px !important;
          }
        }

        @media (max-width: 576px) {
          /* Section title */
          h2 {
            font-size: 2rem !important;
            margin-bottom: 15px !important;
          }

          /* Section description */
          p {
            font-size: 1rem !important;
          }

          /* Card image smaller on very small screens */
          .cars-card-content img {
            height: 180px !important;
          }

          /* More compact content */
          .cars-card-content > div:last-child {
            padding: 1.25rem !important;
          }

          .cars-card-content h4 {
            font-size: 1rem !important;
            line-height: 1.3 !important;
          }

          .cars-card-content p {
            font-size: 0.85rem !important;
          }

          .cars-card-content button {
            padding: 0.6rem 0.8rem !important;
            font-size: 0.8rem !important;
            border-radius: 6px !important;
          }
        }

        @media (max-width: 480px) {
          /* Even more compact for very small devices */
          .cars-card-content {
            border-radius: 10px !important;
          }

          .cars-card-content img {
            height: 160px !important;
          }

          .cars-card-content > div:last-child {
            padding: 1rem !important;
          }

          .cars-card-content h4 {
            font-size: 0.95rem !important;
            margin-bottom: 0.75rem !important;
          }

          .cars-card-content p {
            font-size: 0.8rem !important;
            margin-bottom: 1rem !important;
          }

          /* View All button adjustments */
          button:last-child {
            padding: 10px 20px !important;
            font-size: 0.9rem !important;
            border-radius: 6px !important;
          }
        }

        /* Override inline styles for mobile */
        @media (max-width: 768px) {
          .cars-card-item {
            flex: none !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CarsPartInHome;
