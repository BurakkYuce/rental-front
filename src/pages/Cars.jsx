// src/pages/CarsPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Users, Calendar, Settings } from "lucide-react";
import Header from "../components/Header.jsx";
import { publicAPI } from "../services/api";
import { useCurrency } from "../contexts/CurrencyContext";

import "./CarsPage.css"; // CSS'i ayrı dosyaya taşı

const CarsPage = () => {
  const navigate = useNavigate();

  // Get currency context - sadece kullanılan değişkenler
  const { convertAndFormatPrice, getCurrentCurrencyInfo } = useCurrency();

  const [filters, setFilters] = useState({
    vehicleType: [],
    carBodyType: [],
    carSeats: [],
    engineCapacity: [],
    priceRange: { min: 0, max: 2000 },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 15;

  // State for real car data
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likedCars, setLikedCars] = useState(new Set());
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());

  // Transform API car data to match component expected format
  const transformCarData = useCallback((apiCar) => {
    if (!apiCar) {
      console.warn("Invalid car data received:", apiCar);
      return null;
    }

    try {
      const carId = apiCar.id || apiCar._id;

      if (!carId) {
        console.warn("Car missing ID:", apiCar);
        return null;
      }

      return {
        id: carId,
        name: apiCar.title || apiCar.name || "Unknown Car",
        image: apiCar.mainImage?.url || apiCar.main_image?.url || "/images/cars/default-car.jpg",
        rating: apiCar.stats?.rating?.average || 4.5,
        reviews:
          apiCar.stats?.rating?.count || Math.floor(Math.random() * 100) + 20,
        seats: `${apiCar.seats || 4} seats`,
        transmission: apiCar.transmission || "Automatic",
        doors: apiCar.doors || 4,
        type: apiCar.category || apiCar.bodyType || "Sedan",
        vehicleType: "Car",
        engineCapacity: apiCar.engineCapacity || 2000,
        engineCapacityFormatted: `${apiCar.engineCapacity || 2000}cc`,
        dailyRate: apiCar.pricing?.daily || 0,
        liked: false,
      };
    } catch (error) {
      console.error("Error transforming car data:", error, apiCar);
      return null;
    }
  }, []);

  // Load cars function with useCallback to prevent infinite re-renders
  const loadCars = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Try public API first
      const response = await publicAPI.getCars({
        page: 1, // Load all cars for client-side filtering
        limit: 100, // Increase limit to get more cars
      });

      console.log("Full API Response:", response);
      console.log("Response data:", response.data);

      // Güvenli API response handling
      let carData = [];

      if (response?.data) {
        // PostgreSQL format: { success: true, data: { listings: [...], pagination: {...} } }
        if (response.data.data?.listings) {
          carData = response.data.data.listings;
        }
        // MongoDB format: { success: true, data: [...] }
        else if (Array.isArray(response.data.data)) {
          carData = response.data.data;
        }
        // Direct array format
        else if (Array.isArray(response.data)) {
          carData = response.data;
        }
      }

      console.log("Extracted car data:", carData);

      // Transform API data ve null değerleri filtrele
      const transformedCars = carData
        .map(transformCarData)
        .filter((car) => car !== null);

      setCars(transformedCars);
    } catch (error) {
      console.error("Failed to load cars:", error);
      setError("Failed to load cars. Please try again later.");
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [transformCarData]);

  // Load cars on component mount
  useEffect(() => {
    loadCars();
  }, [loadCars]);

  // Static filter options
  const vehicleTypes = ["Car", "Van", "Minibus", "Prestige"];
  const carBodyTypes = [
    "Convertible",
    "Coupe",
    "Exotic Cars",
    "Hatchback",
    "Minivan",
    "Truck",
    "Sedan",
    "Sports Car",
    "Station Wagon",
    "SUV",
  ];
  const carSeats = ["2 seats", "4 seats", "6 seats", "6+ seats"];
  const engineCapacities = [
    "1000 - 2000",
    "2000 - 4000",
    "4000 - 6000",
    "6000+",
    "Electric",
  ];

  // Helper function to check if engine capacity matches filter
  const matchesEngineCapacity = useCallback((carCapacity, filterCapacity) => {
    const capacity =
      typeof carCapacity === "number"
        ? carCapacity
        : parseInt(carCapacity) || 0;

    switch (filterCapacity) {
      case "1000 - 2000":
        return capacity >= 1000 && capacity <= 2000;
      case "2000 - 4000":
        return capacity > 2000 && capacity <= 4000;
      case "4000 - 6000":
        return capacity > 4000 && capacity <= 6000;
      case "6000+":
        return capacity > 6000;
      case "Electric":
        return capacity === 0 || carCapacity === "Electric";
      default:
        return false;
    }
  }, []);

  // Memoize filtered cars to improve performance
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Vehicle Type filter
      if (
        filters.vehicleType.length > 0 &&
        !filters.vehicleType.includes(car.vehicleType)
      ) {
        return false;
      }

      // Car Body Type filter
      if (
        filters.carBodyType.length > 0 &&
        !filters.carBodyType.includes(car.type)
      ) {
        return false;
      }

      // Car Seats filter
      if (
        filters.carSeats.length > 0 &&
        !filters.carSeats.includes(car.seats)
      ) {
        return false;
      }

      // Engine Capacity filter
      if (filters.engineCapacity.length > 0) {
        const matchesAny = filters.engineCapacity.some((filterCapacity) =>
          matchesEngineCapacity(car.engineCapacity, filterCapacity)
        );
        if (!matchesAny) {
          return false;
        }
      }

      // Price Range filter
      if (
        car.dailyRate < filters.priceRange.min ||
        car.dailyRate > filters.priceRange.max
      ) {
        return false;
      }

      return true;
    });
  }, [cars, filters, matchesEngineCapacity]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handlePriceRangeChange = useCallback((type, value) => {
    const numValue = parseInt(value) || 0;
    setFilters((prev) => {
      const newPriceRange = { ...prev.priceRange };

      if (type === "min") {
        newPriceRange.min = numValue;
        // Ensure max is not lower than min
        if (newPriceRange.max < numValue) {
          newPriceRange.max = numValue;
        }
      } else {
        newPriceRange.max = numValue;
        // Ensure min is not higher than max
        if (newPriceRange.min > numValue) {
          newPriceRange.min = numValue;
        }
      }

      return {
        ...prev,
        priceRange: newPriceRange,
      };
    });
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleLike = useCallback((carId) => {
    setLikedCars((prev) => {
      const newLikedCars = new Set(prev);
      if (newLikedCars.has(carId)) {
        newLikedCars.delete(carId);
      } else {
        newLikedCars.add(carId);
      }
      return newLikedCars;
    });
  }, []);

  const handleRentNow = useCallback(
    (carId) => {
      navigate(`/cars/${carId}`);
    },
    [navigate]
  );

  const handleImageError = useCallback((carId) => {
    setImageLoadErrors((prev) => new Set([...prev, carId]));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      vehicleType: [],
      carBodyType: [],
      carSeats: [],
      engineCapacity: [],
      priceRange: { min: 0, max: 2000 },
    });
    setCurrentPage(1);
  }, []);

  // Güvenli currency info alımı
  const getCurrencySymbol = () => {
    try {
      return getCurrentCurrencyInfo().symbol;
    } catch {
      return "€"; // Fallback
    }
  };

  return (
    <div className="cars-page">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="cars-hero">
        <div className="container">
          <h1>Cars</h1>
          <p>Find the perfect car for your next adventure</p>
        </div>
      </div>

      <div className="container">
        <div className="cars-content">
          {/* Filters Sidebar */}
          <div className="filters-sidebar">
            <div className="filters-header">
              <h2>Filters</h2>
              <button
                className="clear-filters-btn"
                onClick={clearAllFilters}
                type="button"
              >
                Clear All
              </button>
            </div>

            {/* Vehicle Type Filter */}
            <div className="filter-section">
              <h3>Vehicle Type</h3>
              <div className="filter-options">
                {vehicleTypes.map((type) => (
                  <label key={type} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.vehicleType.includes(type)}
                      onChange={() => handleFilterChange("vehicleType", type)}
                    />
                    <span className="checkmark"></span>
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Car Body Type Filter */}
            <div className="filter-section">
              <h3>Car Body Type</h3>
              <div className="filter-options">
                {carBodyTypes.map((type) => (
                  <label key={type} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.carBodyType.includes(type)}
                      onChange={() => handleFilterChange("carBodyType", type)}
                    />
                    <span className="checkmark"></span>
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Car Seats Filter */}
            <div className="filter-section">
              <h3>Car Seats</h3>
              <div className="filter-options">
                {carSeats.map((seats) => (
                  <label key={seats} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.carSeats.includes(seats)}
                      onChange={() => handleFilterChange("carSeats", seats)}
                    />
                    <span className="checkmark"></span>
                    {seats}
                  </label>
                ))}
              </div>
            </div>

            {/* Engine Capacity Filter */}
            <div className="filter-section">
              <h3>Car Engine Capacity (cc)</h3>
              <div className="filter-options">
                {engineCapacities.map((capacity) => (
                  <label key={capacity} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.engineCapacity.includes(capacity)}
                      onChange={() =>
                        handleFilterChange("engineCapacity", capacity)
                      }
                    />
                    <span className="checkmark"></span>
                    {capacity}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="filter-section">
              <h3>Price ({getCurrencySymbol()})</h3>
              <div className="price-range">
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange.min}
                    min="0"
                    max={filters.priceRange.max}
                    onChange={(e) =>
                      handlePriceRangeChange("min", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange.max}
                    min={filters.priceRange.min}
                    max="2000"
                    onChange={(e) =>
                      handlePriceRangeChange("max", e.target.value)
                    }
                  />
                </div>
                <div className="price-slider">
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={filters.priceRange.min}
                      onChange={(e) =>
                        handlePriceRangeChange("min", e.target.value)
                      }
                      className="slider slider-min"
                    />
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={filters.priceRange.max}
                      onChange={(e) =>
                        handlePriceRangeChange("max", e.target.value)
                      }
                      className="slider slider-max"
                    />
                  </div>
                  <div className="price-range-display">
                    <span>
                      {getCurrencySymbol()}
                      {filters.priceRange.min}
                    </span>
                    <span>-</span>
                    <span>
                      {getCurrencySymbol()}
                      {filters.priceRange.max}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          <div className="cars-grid">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="car-card loading">
                  <div className="car-image loading-placeholder">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                  <div className="car-info loading-content">
                    <div className="loading-title"></div>
                    <div className="loading-subtitle"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="error-container">
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button onClick={loadCars} className="retry-btn" type="button">
                  Try Again
                </button>
              </div>
            ) : currentCars.length > 0 ? (
              currentCars.map((car) => (
                <div key={car.id} className="car-card">
                  <div className="car-image">
                    <img
                      src={
                        imageLoadErrors.has(car.id)
                          ? "/images/cars/default-car.jpg"
                          : car.image
                      }
                      alt={car.name}
                      onError={() => handleImageError(car.id)}
                      loading="lazy"
                    />
                    <button
                      className={`like-btn ${
                        likedCars.has(car.id) ? "liked" : ""
                      }`}
                      onClick={() => toggleLike(car.id)}
                      aria-label={`${
                        likedCars.has(car.id) ? "Unlike" : "Like"
                      } ${car.name}`}
                      type="button"
                    >
                      <Heart
                        size={20}
                        fill={likedCars.has(car.id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  <div className="car-content">
                    <h3>{car.name}</h3>

                    <div className="car-features">
                      <div className="feature">
                        <Users size={16} />
                        <span>{car.seats}</span>
                      </div>
                      <div className="feature">
                        <Settings size={16} />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="feature">
                        <Calendar size={16} />
                        <span>{car.doors} doors</span>
                      </div>
                      <div className="feature car-type">
                        <span>{car.type}</span>
                      </div>
                    </div>

                    <div className="car-price">
                      <div className="price-info">
                        <span className="price-label">Daily rate from</span>
                        <span className="price">
                          {car.dailyRate && convertAndFormatPrice
                            ? convertAndFormatPrice(car.dailyRate, "EUR")
                            : car.dailyRate
                            ? `${getCurrencySymbol()}${car.dailyRate}`
                            : "Price not available"}
                        </span>
                      </div>
                      <button
                        className="rent-btn"
                        onClick={() => handleRentNow(car.id)}
                        type="button"
                      >
                        Rent Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <h3>No cars found matching your criteria</h3>
                <p>Try adjusting your filters to see more results.</p>
                <button
                  className="clear-filters-btn secondary"
                  onClick={clearAllFilters}
                  type="button"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                type="button"
                aria-label="Previous page"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                // Show first page, last page, current page, and pages adjacent to current
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);

                if (!showPage && page === 2 && currentPage > 4) {
                  return (
                    <span key="ellipsis1" className="pagination-ellipsis">
                      ...
                    </span>
                  );
                }

                if (
                  !showPage &&
                  page === totalPages - 1 &&
                  currentPage < totalPages - 3
                ) {
                  return (
                    <span key="ellipsis2" className="pagination-ellipsis">
                      ...
                    </span>
                  );
                }

                if (!showPage) return null;

                return (
                  <button
                    key={page}
                    className={`pagination-btn ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                    type="button"
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                type="button"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}

          {/* Results Summary */}
          {!loading && !error && (
            <div className="results-summary">
              <p>
                Showing {filteredCars.length === 0 ? 0 : startIndex + 1}-
                {Math.min(endIndex, filteredCars.length)} of{" "}
                {filteredCars.length} cars
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarsPage;
