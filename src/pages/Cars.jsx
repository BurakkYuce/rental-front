// src/pages/CarsPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Users, Calendar, Settings, CalendarIcon } from "lucide-react";
import Header from "../components/Header.jsx";
import BackToHomeButton from "../components/BackToHomeButton.jsx";
import { publicAPI } from "../services/api";
import { useCurrency } from "../contexts/CurrencyContext";

import "./CarsPage.css"; // CSS'i ayrı dosyaya taşı

const CarsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get currency context - sadece kullanılan değişkenler
  const { convertAndFormatPrice, getCurrentCurrencyInfo } = useCurrency();

  const [filters, setFilters] = useState({
    fuelType: [],
    bodyType: [],
    brand: [],
    transmission: [],
    priceRange: { min: 0, max: 2000 },
    pickupDate: "",
    dropoffDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Initialize filters from URL parameters
  useEffect(() => {
    const pickupDateParam = searchParams.get("pickupDate");
    const returnDateParam = searchParams.get("returnDate");

    if (pickupDateParam || returnDateParam) {
      setFilters((prev) => ({
        ...prev,
        pickupDate: pickupDateParam || "",
        dropoffDate: returnDateParam || "",
      }));
    }
  }, [searchParams]);
  const carsPerPage = 15;

  // State for real car data
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Create refs for date inputs
  const pickupDateRef = React.useRef(null);
  const dropoffDateRef = React.useRef(null);

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

      // Use effective pricing (seasonal) if available, otherwise use base pricing
      const pricing = apiCar.effectivePricing || apiCar.pricing || {};
      const isSeasonalPricing = !!apiCar.effectivePricing?.seasonalName;

      // Debug seasonal pricing
      if (apiCar.seasonal_pricing && apiCar.seasonal_pricing.length > 0) {
        console.log(
          "🎯 Car has seasonal_pricing:",
          apiCar.id,
          apiCar.seasonal_pricing
        );
        console.log("🎯 Effective pricing:", apiCar.effectivePricing);
        console.log("🎯 Base pricing:", apiCar.pricing);
        console.log("🎯 Final pricing used:", pricing);
        console.log(
          "🎯 Daily rates - Base:",
          apiCar.pricing?.daily,
          "Effective:",
          apiCar.effectivePricing?.daily,
          "Final:",
          pricing.daily
        );
      }

      return {
        id: carId,
        name: apiCar.title || apiCar.name || "Unknown Car",
        image:
          apiCar.mainImage?.url ||
          apiCar.main_image?.url ||
          "/images/cars/default-car.jpg",
        rating: apiCar.stats?.rating?.average || 4.5,
        reviews:
          apiCar.stats?.rating?.count || Math.floor(Math.random() * 100) + 20,
        seats: `${apiCar.seats || 4} koltuk`,
        transmission: apiCar.transmission || "Automatic",
        doors: apiCar.doors || 4,
        type: apiCar.category || apiCar.bodyType || "Sedan",
        vehicleType: "Car",
        engineCapacity: apiCar.engineCapacity || 2000,
        engineCapacityFormatted: `${apiCar.engineCapacity || 2000}cc`,
        dailyRate: pricing.daily || 0,
        weeklyRate: pricing.weekly || (pricing.daily || 0) * 7,
        monthlyRate: pricing.monthly || (pricing.daily || 0) * 30,
        currency: pricing.currency || "EUR",
        // Additional seasonal pricing info
        isSeasonalPricing,
        seasonalName: apiCar.effectivePricing?.seasonalName,
        seasonalPeriod: apiCar.effectivePricing?.seasonalPeriod,
        basePricing: apiCar.basePricing || apiCar.pricing,
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

      // Build API parameters including date filters
      const apiParams = {
        page: 1,
        limit: 100,
      };

      // Add date filters if selected
      if (filters.pickupDate) apiParams.pickupDate = filters.pickupDate;
      if (filters.dropoffDate) apiParams.dropoffDate = filters.dropoffDate;

      // Try public API first
      const response = await publicAPI.getCars(apiParams);

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
      console.log("Sample car for debugging:", carData[0]);

      // Transform API data ve null değerleri filtrele
      const transformedCars = carData
        .map(transformCarData)
        .filter((car) => car !== null);

      console.log("Transformed cars:", transformedCars);
      console.log("Sample transformed car:", transformedCars[0]);
      setCars(transformedCars);
    } catch (error) {
      console.error("Failed to load cars:", error);
      setError("Araçlar yüklenemedi. Lütfen daha sonra tekrar deneyin.");
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [transformCarData, filters.pickupDate, filters.dropoffDate]);

  // Load cars on component mount
  useEffect(() => {
    loadCars();
  }, [loadCars]);

  // Static filter options
  const brands = [
    "Citroën",
    "Fiat",
    "Ford",
    "Hyundai",
    "Mercedes-Benz",
    "MG",
    "Peugeot",
    "Renault",
  ];

  const bodyTypes = [
    "Belirtilmemiş",
    "Sedan",
    "Hatchback",
    "SUV",
    "Station Wagon",
    "Kombi",
    "Panelvan",
    "Minivan",
    "Minivan & Panelvan",
    "Pickup",
    "Otobüs",
    "Kamyonet",
    "Kamyon",
  ];

  const fuelTypes = [
    "Belirtilmemiş",
    "Benzin",
    "Dizel",
    "Benzin+LPG",
    "Elektrikli",
    "Hibrit",
  ];

  const transmissions = [
    "Belirtilmemiş",
    "Manuel",
    "Yarı Otomatik",
    "Otomatik",
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
      // Fuel Type filter
      if (
        filters.fuelType.length > 0 &&
        !filters.fuelType.includes(car.fuelType || car.fuel || "Benzin")
      ) {
        return false;
      }

      // Body Type filter
      if (
        filters.bodyType.length > 0 &&
        !filters.bodyType.includes(car.bodyType || car.type || "Sedan")
      ) {
        return false;
      }

      // Brand filter
      if (
        filters.brand.length > 0 &&
        !filters.brand.includes(car.brand || car.make || "Unknown")
      ) {
        return false;
      }

      // Transmission filter
      if (
        filters.transmission.length > 0 &&
        !filters.transmission.includes(
          car.transmission || car.gearbox || "Manuel"
        )
      ) {
        return false;
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

  // Handle date input changes
  const handleDateChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
    setCurrentPage(1);
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
      fuelType: [],
      bodyType: [],
      brand: [],
      transmission: [],
      priceRange: { min: 0, max: 2000 },
      pickupDate: "",
      dropoffDate: "",
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

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getMinDropoffDate = () => {
    if (filters.pickupDate) {
      const pickupDate = new Date(filters.pickupDate);
      pickupDate.setDate(pickupDate.getDate() + 1);
      return pickupDate.toISOString().split("T")[0];
    }
    return getTodayDate();
  };

  return (
    <div className="cars-page">
      {/* Additional CSS for date picker fixes */}
      <style>
        {`
          .date-input-wrapper {
            position: relative;
            width: 100%;
          }
          
          .date-display-input {
            width: 100% !important;
            padding: 8px 12px !important;
            padding-right: 35px !important;
            border: 1px solid #ddd !important;
            border-radius: 4px !important;
            font-size: 14px !important;
            background-color: white !important;
            color: #333 !important;
            cursor: pointer !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            font-family: monospace !important;
          }
          
          .date-display-input:focus {
            outline: none !important;
            border-color: #007bff !important;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25) !important;
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
            right: 10px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            cursor: pointer !important;
            color: #666 !important;
            z-index: 2 !important;
          }
          
          .calendar-icon:hover {
            color: #007bff !important;
          }
        `}
      </style>

      {/* Header */}
      <Header />

      {/* Back to Home Button */}
      <BackToHomeButton />

      {/* Hero Section */}
      <div className="cars-hero">
        <div className="container">
          <h1>Araçlar</h1>
          <p>Bir sonraki maceranız için mükemmel aracı bulun</p>
        </div>
      </div>

      <div className="container">
        <div className="cars-content">
          {/* Mobile Filter Toggle Button */}
          <div className="filter-toggle-container">
            <button
              className="filter-toggle-btn"
              onClick={() => setFiltersVisible(!filtersVisible)}
              type="button"
            >
              <Settings size={20} />
              Filtreler (
              {filters.fuelType.length +
                filters.bodyType.length +
                filters.brand.length +
                filters.transmission.length +
                (filters.pickupDate ? 1 : 0) +
                (filters.dropoffDate ? 1 : 0) +
                (filters.priceRange.min > 0 || filters.priceRange.max < 2000
                  ? 1
                  : 0)}
              )
              <span className={`toggle-arrow ${filtersVisible ? "open" : ""}`}>
                ▼
              </span>
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${filtersVisible ? "visible" : ""}`}>
            <div className="filters-header">
              <h2>Filtreler</h2>
            </div>
            {/* Date Range Filter */}
            <div className="filter-section">
              <h3>Tarih Aralığı</h3>
              <div className="filter-options">
                <div className="date-inputs">
                  <div className="date-input-group">
                    <label htmlFor="pickupDate">Alış (GG/AA/YYYY):</label>
                    <div className="date-input-wrapper">
                      <input
                        type="text"
                        id="pickupDate"
                        className="date-display-input"
                        value={formatDateForDisplay(filters.pickupDate)}
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
                        value={filters.pickupDate || ""}
                        min={getTodayDate()}
                      />
                      <Calendar
                        className="calendar-icon"
                        size={18}
                        onClick={() => triggerDatePicker(pickupDateRef)}
                      />
                    </div>
                  </div>
                  <div className="date-input-group">
                    <label htmlFor="dropoffDate">Teslim (GG/AA/YYYY):</label>
                    <div className="date-input-wrapper">
                      <input
                        type="text"
                        id="dropoffDate"
                        className="date-display-input"
                        value={formatDateForDisplay(filters.dropoffDate)}
                        placeholder="GG/AA/YYYY"
                        readOnly
                        onClick={() => triggerDatePicker(dropoffDateRef)}
                      />
                      <input
                        ref={dropoffDateRef}
                        type="date"
                        className="date-picker-hidden"
                        onChange={(e) => {
                          handleDateChange("dropoffDate", e.target.value);
                        }}
                        value={filters.dropoffDate || ""}
                        min={getMinDropoffDate()}
                      />
                      <Calendar
                        className="calendar-icon"
                        size={18}
                        onClick={() => triggerDatePicker(dropoffDateRef)}
                      />
                    </div>
                  </div>
                  {(filters.pickupDate || filters.dropoffDate) && (
                    <button
                      className="clear-dates-btn"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          pickupDate: "",
                          dropoffDate: "",
                        }))
                      }
                    >
                      Tarihleri Temizle
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* Fuel Type Filter */}
            <div className="filter-section">
              <h3>Yakıt Türü</h3>
              <div className="filter-options">
                {fuelTypes.map((type) => (
                  <label key={type} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.fuelType.includes(type)}
                      onChange={() => handleFilterChange("fuelType", type)}
                    />
                    <span className="checkmark"></span>
                    {type}
                  </label>
                ))}
              </div>
            </div>
            {/* Body Type Filter */}
            <div className="filter-section">
              <h3>Kasa Tipi</h3>
              <div className="filter-options">
                {bodyTypes.map((type) => (
                  <label key={type} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.bodyType.includes(type)}
                      onChange={() => handleFilterChange("bodyType", type)}
                    />
                    <span className="checkmark"></span>
                    {type}
                  </label>
                ))}
              </div>
            </div>
            {/* Brand Filter */}
            <div className="filter-section">
              <h3>Marka</h3>
              <div className="filter-options">
                {brands.map((type) => (
                  <label key={type} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.brand.includes(type)}
                      onChange={() => handleFilterChange("brand", type)}
                    />
                    <span className="checkmark"></span>
                    {type}
                  </label>
                ))}
              </div>
            </div>
            {/* Transmission Filter */}
            <div className="filter-section">
              <h3>Vites Türü</h3>
              <div className="filter-options">
                {transmissions.map((type) => (
                  <label key={type} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.transmission.includes(type)}
                      onChange={() => handleFilterChange("transmission", type)}
                    />
                    <span className="checkmark"></span>
                    {type}
                  </label>
                ))}
              </div>
            </div>
            {/* Price Range Filter */}
            <div className="filter-section">
              <h3>Fiyat ({getCurrencySymbol()})</h3>
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

            {/* Clear All Filters Button */}
            <button
              className="clear-filters-btn secondary"
              onClick={clearAllFilters}
              type="button"
              style={{ marginTop: "30px", width: "100%" }}
            >
              Tüm Filtreleri Temizle
            </button>
          </div>

          {/* Cars Grid */}
          <div className="cars-grid">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="car-card loading">
                  <div className="car-image loading-placeholder">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Yükleniyor...</span>
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
                <h3>Ups! Bir şeyler yanlış gitti</h3>
                <p>{error}</p>
                <button onClick={loadCars} className="retry-btn" type="button">
                  Tekrar Dene
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
                        <span>{car.doors} kapı</span>
                      </div>
                      <div className="feature car-type">
                        <span>{car.type}</span>
                      </div>
                    </div>

                    <div className="car-price">
                      <div className="price-info">
                        <div className="pricing-periods">
                          <div className="pricing-item">
                            <span className="period-label">Günlük</span>
                            <span className="period-price">
                              {car.dailyRate && convertAndFormatPrice
                                ? convertAndFormatPrice(car.dailyRate, "EUR")
                                : car.dailyRate
                                ? `€${car.dailyRate}`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="pricing-item">
                            <span className="period-label">Haftalık</span>
                            <span className="period-price">
                              {car.weeklyRate && convertAndFormatPrice
                                ? convertAndFormatPrice(car.weeklyRate, "EUR")
                                : car.weeklyRate
                                ? `€${car.weeklyRate}`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="pricing-item">
                            <span className="period-label">Aylık</span>
                            <span className="period-price">
                              {car.monthlyRate && convertAndFormatPrice
                                ? convertAndFormatPrice(car.monthlyRate, "EUR")
                                : car.monthlyRate
                                ? `€${car.monthlyRate}`
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="rent-btn"
                        onClick={() => handleRentNow(car.id)}
                        type="button"
                      >
                        Kirala
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <h3>Kriterlerinize uygun araç bulunamadı</h3>
                <p>Daha fazla sonuç görmek için filtrelerinizi ayarlayın.</p>
                <button
                  className="clear-filters-btn secondary"
                  onClick={clearAllFilters}
                  type="button"
                >
                  Tüm Filtreleri Temizle
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
                aria-label="Önceki sayfa"
              >
                Önceki
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
                    aria-label={`Sayfa ${page}`}
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
                aria-label="Sonraki sayfa"
              >
                Sonraki
              </button>
            </div>
          )}

          {/* Results Summary */}
          {!loading && !error && (
            <div className="results-summary">
              <p>
                Gösteriliyor {filteredCars.length === 0 ? 0 : startIndex + 1}-
                {Math.min(endIndex, filteredCars.length)} /{" "}
                {filteredCars.length} araç
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarsPage;
