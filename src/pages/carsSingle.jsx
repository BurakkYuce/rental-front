// src/pages/CarsSingle.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { adminAPI, publicAPI } from "../services/api";
import { useCurrency } from "../contexts/CurrencyContext";
import "./CarsSingle.css"; // CSS'i ayrı dosyaya taşı

// Location options for pickup and dropoff
const locationOptions = [
  "Antalya Havalimanı (AYT)",
  "Antalya Belek Otel Teslimi",
  "Antalya Merkez Ofis",
  "Antalya Otogar",
  "Antalya Lara",
  "Antalya Konyaaltı",
  "Antalya Kemer",
  "Antalya Alanya",
];

const CarsSingle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get currency context - sadece kullanılan fonksiyonlar
  const {
    currentCurrency,
    convertAndFormatPrice,
    formatPrice,
    convertAmount,
    getCurrentCurrencyInfo,
    isLoaded: currencyLoaded,
  } = useCurrency();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
  const [bookingLoading, setBookingLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [activePricingPeriod, setActivePricingPeriod] = useState("daily");

  // Additional options state
  const [additionalOptions, setAdditionalOptions] = useState({
    cocukKoltugu: 0, // max 3, 5€ per day
    ekSurucu: 0, // max 1, 8€ per day
    gencSurucu: 0, // max 1, 15€ per day
  });

  // Helper functions for date validation
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

  // Time options
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push(timeString);
      }
    }
    return options;
  }, []);

  // Calculate additional options total in current currency
  const calculateAdditionalOptionsTotal = useCallback(() => {
    if (!currencyLoaded || !convertAmount) return 0;

    const { cocukKoltugu, ekSurucu, gencSurucu } = additionalOptions;
    const totalEUR = cocukKoltugu * 5 + ekSurucu * 8 + gencSurucu * 15;
    return convertAmount(totalEUR, "EUR", currentCurrency);
  }, [additionalOptions, convertAmount, currencyLoaded, currentCurrency]);

  // Handle additional options change
  const handleAdditionalOptionChange = useCallback((option, increment) => {
    setAdditionalOptions((prev) => {
      const current = prev[option];
      let newValue = current + increment;

      // Apply limits
      if (option === "cocukKoltugu") {
        newValue = Math.max(0, Math.min(3, newValue));
      } else if (option === "ekSurucu" || option === "gencSurucu") {
        newValue = Math.max(0, Math.min(1, newValue));
      }

      return { ...prev, [option]: newValue };
    });
  }, []);

  // Load car data with improved error handling and API fallback
  const loadCarData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      console.log("🚗 Loading car with ID:", id);

      let response;
      try {
        // Try public API first
        response = await publicAPI.getCarById(id);
        console.log("✅ Public API response:", response);
      } catch (publicError) {
        console.log("⚠️ Public API failed, trying admin API:", publicError);
        // Fallback to admin API
        response = await adminAPI.getCarById(id);
        console.log("✅ Admin API response:", response);
      }

      // Handle different response structures
      let carData;
      if (response?.data?.data) {
        carData = response.data.data;
      } else if (response?.data) {
        carData = response.data;
      } else {
        throw new Error("Invalid response structure");
      }

      console.log("🔍 Parsed car data:", carData);
      setCar(carData);
    } catch (error) {
      console.error("❌ Failed to load car:", error);
      if (error.response?.status === 404) {
        setError("Car not found");
      } else {
        setError("Failed to load car details. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCarData();
  }, [loadCarData]);

  // Get car images with better fallback handling
  const carImages = useMemo(() => {
    if (!car) return ["/images/cars/default-car.jpg"];

    const images = [];

    // Add main image if available
    if (car.mainImage?.url) {
      images.push(car.mainImage.url);
    }

    // Add gallery images if available
    if (car.gallery && Array.isArray(car.gallery)) {
      car.gallery.forEach((img) => {
        if (img?.url) {
          images.push(img.url);
        }
      });
    }

    // If no images from API, use default
    if (images.length === 0) {
      images.push("/images/cars/default-car.jpg");
    }

    console.log("🖼️ Car images:", images);
    return images;
  }, [car]);

  // Handle image load errors
  const handleImageError = useCallback((index) => {
    console.log("❌ Image failed to load:", index);
    setImageLoadErrors((prev) => new Set([...prev, index]));
  }, []);

  // Get current image with fallback
  const getCurrentImage = useCallback(() => {
    if (imageLoadErrors.has(currentImageIndex)) {
      return "/images/cars/default-car.jpg";
    }
    return carImages[currentImageIndex] || "/images/cars/default-car.jpg";
  }, [carImages, currentImageIndex, imageLoadErrors]);

  // Handle form input changes
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error for this field when user starts typing
      if (formErrors[name]) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [formErrors]
  );

  // Validate form
  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.pickupLocation.trim()) {
      errors.pickupLocation = "Pickup location is required";
    }

    if (!formData.dropoffLocation.trim()) {
      errors.dropoffLocation = "Drop-off location is required";
    }

    if (!formData.pickupDate) {
      errors.pickupDate = "Pickup date is required";
    }

    if (!formData.pickupTime) {
      errors.pickupTime = "Pickup time is required";
    }

    if (!formData.returnDate) {
      errors.returnDate = "Return date is required";
    }

    if (!formData.returnTime) {
      errors.returnTime = "Return time is required";
    }

    // Validate date and time logic
    if (
      formData.pickupDate &&
      formData.returnDate &&
      formData.pickupTime &&
      formData.returnTime
    ) {
      const pickupDateTime = new Date(
        `${formData.pickupDate}T${formData.pickupTime}`
      );
      const returnDateTime = new Date(
        `${formData.returnDate}T${formData.returnTime}`
      );

      if (returnDateTime <= pickupDateTime) {
        errors.returnDate =
          "Return date and time must be after pickup date and time";
      }
    }

    return errors;
  }, [formData]);

  // Handle form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setBookingLoading(true);

    try {
      // Prepare booking data including additional options
      const bookingData = {
        carId: id,
        ...formData,
        additionalOptions,
        additionalOptionsTotal: calculateAdditionalOptionsTotal(),
      };

      console.log("📝 Booking data:", bookingData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Booking submitted successfully!");

      // Reset form
      setFormData({
        pickupLocation: "",
        dropoffLocation: "",
        pickupDate: "",
        pickupTime: "",
        returnDate: "",
        returnTime: "",
      });
      setAdditionalOptions({
        cocukKoltugu: 0,
        ekSurucu: 0,
        gencSurucu: 0,
      });
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to submit booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Car specifications with better API integration
  const specifications = useMemo(() => {
    if (!car) {
      return [
        { title: "Kategori", value: "Loading..." },
        { title: "Marka", value: "Loading..." },
        { title: "Model", value: "Loading..." },
      ];
    }

    return [
      { title: "Kategori", value: car.category || car.type || "Ekonomik" },
      { title: "Marka", value: car.brand || car.make || "Unknown" },
      { title: "Model", value: car.model || car.title || "Unknown" },
      { title: "Model Yılı", value: car.year || car.modelYear || "N/A" },
      { title: "Yakıt", value: car.fuelType || car.fuel || "Benzin" },
      { title: "Vites", value: car.transmission || "Manuel" },
      { title: "Kasa Tipi", value: car.bodyType || car.type || "Hatchback" },
      { title: "Koltuk Sayısı", value: `${car.seats || 4} seats` },
      { title: "Kapı Sayısı", value: `${car.doors || 4} doors` },
    ];
  }, [car]);

  // Dynamic features from API data
  const features = useMemo(() => {
    if (!car) return ["Loading..."];

    return (
      car?.features || [
        "Bluetooth",
        "Multimedia Player",
        "Central Lock",
        "Air Conditioning",
      ]
    );
  }, [car?.features]);

  // Price calculation with better error handling
  const calculatePrice = useCallback(
    (period) => {
      if (!car || !currencyLoaded || !convertAndFormatPrice) {
        return "Loading...";
      }

      try {
        const pricing = car.pricing || {};
        const baseCurrency = car.currency || "EUR";
        let amount = pricing[period];

        // Fallback for missing pricing periods
        if (!amount) {
          const dailyRate = pricing.daily || car.dailyRate || 50; // Default fallback
          switch (period) {
            case "weekly":
              amount = dailyRate * 7;
              break;
            case "monthly":
              amount = dailyRate * 30;
              break;
            default:
              amount = dailyRate;
          }
        }

        console.log(`💰 Price calculation for ${period}:`, {
          amount,
          baseCurrency,
          currentCurrency,
          pricing: car.pricing,
        });

        return convertAndFormatPrice(amount, baseCurrency);
      } catch (error) {
        console.error("Price calculation error:", error);
        return "Price not available";
      }
    },
    [car, currencyLoaded, convertAndFormatPrice, currentCurrency]
  );

  // Social sharing
  const socialIcons = [
    {
      name: "twitter",
      icon: "fa-twitter",
      url: `https://twitter.com/intent/tweet?text=Check out this car: ${
        car?.title || "Amazing Car"
      }&url=${window.location.href}`,
    },
    {
      name: "facebook",
      icon: "fa-facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
    },
    {
      name: "reddit",
      icon: "fa-reddit",
      url: `https://reddit.com/submit?url=${window.location.href}&title=${
        car?.title || "Amazing Car"
      }`,
    },
    {
      name: "linkedin",
      icon: "fa-linkedin",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
    },
    {
      name: "pinterest",
      icon: "fa-pinterest",
      url: `https://pinterest.com/pin/create/button/?url=${
        window.location.href
      }&description=${car?.title || "Amazing Car"}`,
    },
    {
      name: "envelope",
      icon: "fa-envelope",
      url: `mailto:?subject=Check out this car&body=I found this great car: ${window.location.href}`,
    },
  ];

  // Form input styles
  const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "0.95rem",
    transition: "border-color 0.3s ease",
    backgroundColor: "#ffffff",
    color: "#333",
  };

  const inputErrorStyle = {
    ...inputStyle,
    borderColor: "#dc3545",
  };

  // Currency symbol helper
  const getCurrencySymbol = () => {
    try {
      return getCurrentCurrencyInfo().symbol;
    } catch {
      return "€"; // Fallback
    }
  };

  return (
    <div className="cars-single-page">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1>
                  {loading
                    ? "Loading..."
                    : error
                    ? "Error"
                    : car?.title || car?.name || "Vehicle Details"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Car Details Section */}
      <section className="car-details-section">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading car details...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <h3>Oops!</h3>
              <p>{error}</p>
              <button
                onClick={() => navigate("/cars")}
                className="back-to-cars-btn"
              >
                ← Back to Cars
              </button>
            </div>
          ) : car ? (
            <div className="row">
              {/* Car Images */}
              <div className="col-lg-6">
                <div className="image-gallery">
                  <img
                    src={getCurrentImage()}
                    alt={`${car?.title || "Car"} - Image ${
                      currentImageIndex + 1
                    }`}
                    onError={() => handleImageError(currentImageIndex)}
                    className="main-image"
                  />

                  {/* Image Navigation Dots */}
                  <div className="image-dots">
                    {carImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`View image ${index + 1}`}
                        className={`dot ${
                          index === currentImageIndex ? "active" : ""
                        }`}
                      />
                    ))}
                  </div>

                  {/* Thumbnail Images */}
                  <div className="thumbnail-images">
                    {carImages.map((image, index) => (
                      <img
                        key={index}
                        src={
                          imageLoadErrors.has(index)
                            ? "/images/cars/default-car.jpg"
                            : image
                        }
                        alt={`${car?.title || "Car"} thumbnail ${index + 1}`}
                        onClick={() => setCurrentImageIndex(index)}
                        onError={() => handleImageError(index)}
                        className={`thumbnail ${
                          index === currentImageIndex ? "active" : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Car Information */}
              <div className="col-lg-3">
                <div className="car-info">
                  <h3 className="car-title">
                    {car?.title || car?.name || "Car Details"}
                  </h3>
                  <p className="car-description">
                    {car?.description ||
                      `Experience the luxury and performance of the ${
                        car?.title || car?.name || "this amazing vehicle"
                      }. Perfect for your next adventure with premium features and exceptional comfort.`}
                  </p>

                  {/* Specifications */}
                  <h4 className="section-title">Teknik Özellikler</h4>
                  <div className="specifications">
                    {specifications.map((spec, index) => (
                      <div key={index} className="spec-item">
                        <span className="spec-label">{spec.title}</span>
                        <span className="spec-value">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <h4 className="section-title">Features</h4>
                  <ul className="features-list">
                    {features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Booking Section */}
              <div className="col-lg-3">
                {/* Price */}
                <div className="price-card">
                  {/* Pricing Period Tabs */}
                  <div className="pricing-tabs">
                    {[
                      { code: "daily", name: "Daily" },
                      { code: "weekly", name: "Weekly" },
                      { code: "monthly", name: "Monthly" },
                    ].map((period) => (
                      <button
                        type="button"
                        key={period.code}
                        onClick={() => setActivePricingPeriod(period.code)}
                        className={`pricing-tab ${
                          activePricingPeriod === period.code ? "active" : ""
                        }`}
                      >
                        {period.name}
                      </button>
                    ))}
                  </div>

                  {/* Price Display */}
                  <div className="price-display">
                    <div className="price-label">
                      {activePricingPeriod.charAt(0).toUpperCase() +
                        activePricingPeriod.slice(1)}{" "}
                      rate
                    </div>
                    <h3 className="price-amount">
                      {calculatePrice(activePricingPeriod)}
                    </h3>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="booking-form-card">
                  <h4 className="form-title">Book this car</h4>

                  <form onSubmit={handleBookingSubmit}>
                    {/* Pick Up Location */}
                    <div className="form-group">
                      <label htmlFor="pickupLocation" className="form-label">
                        Pick Up Location *
                      </label>
                      <select
                        id="pickupLocation"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleInputChange}
                        style={
                          formErrors.pickupLocation
                            ? inputErrorStyle
                            : inputStyle
                        }
                        className="form-input"
                      >
                        <option value="">Select pickup location</option>
                        {locationOptions.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                      {formErrors.pickupLocation && (
                        <div className="error-message">
                          {formErrors.pickupLocation}
                        </div>
                      )}
                    </div>

                    {/* Drop Off Location */}
                    <div className="form-group">
                      <label htmlFor="dropoffLocation" className="form-label">
                        Drop Off Location *
                      </label>
                      <select
                        id="dropoffLocation"
                        name="dropoffLocation"
                        value={formData.dropoffLocation}
                        onChange={handleInputChange}
                        style={
                          formErrors.dropoffLocation
                            ? inputErrorStyle
                            : inputStyle
                        }
                        className="form-input"
                      >
                        <option value="">Select dropoff location</option>
                        {locationOptions.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                      {formErrors.dropoffLocation && (
                        <div className="error-message">
                          {formErrors.dropoffLocation}
                        </div>
                      )}
                    </div>

                    {/* Pick Up Date & Time */}
                    <div className="form-group">
                      <label className="form-label">
                        Pick Up Date & Time *
                      </label>
                      <div className="datetime-inputs">
                        <input
                          name="pickupDate"
                          type="date"
                          value={formData.pickupDate}
                          onChange={handleInputChange}
                          min={getTodayDate()}
                          style={{
                            ...inputStyle,
                            borderColor: formErrors.pickupDate
                              ? "#dc3545"
                              : "#e9ecef",
                          }}
                          className="form-input date-input"
                        />
                        <select
                          name="pickupTime"
                          value={formData.pickupTime}
                          onChange={handleInputChange}
                          style={{
                            ...inputStyle,
                            borderColor: formErrors.pickupTime
                              ? "#dc3545"
                              : "#e9ecef",
                          }}
                          className="form-input"
                        >
                          <option value="">Select time</option>
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                      {(formErrors.pickupDate || formErrors.pickupTime) && (
                        <div className="error-message">
                          {formErrors.pickupDate || formErrors.pickupTime}
                        </div>
                      )}
                    </div>

                    {/* Return Date & Time */}
                    <div className="form-group">
                      <label className="form-label">Return Date & Time *</label>
                      <div className="datetime-inputs">
                        <input
                          name="returnDate"
                          type="date"
                          value={formData.returnDate}
                          onChange={handleInputChange}
                          min={getMinReturnDate()}
                          style={{
                            ...inputStyle,
                            borderColor: formErrors.returnDate
                              ? "#dc3545"
                              : "#e9ecef",
                          }}
                          className="form-input date-input"
                        />
                        <select
                          name="returnTime"
                          value={formData.returnTime}
                          onChange={handleInputChange}
                          style={{
                            ...inputStyle,
                            borderColor: formErrors.returnTime
                              ? "#dc3545"
                              : "#e9ecef",
                          }}
                          className="form-input"
                        >
                          <option value="">Select time</option>
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                      {(formErrors.returnDate || formErrors.returnTime) && (
                        <div className="error-message">
                          {formErrors.returnDate || formErrors.returnTime}
                        </div>
                      )}
                    </div>

                    {/* Additional Options */}
                    <div className="additional-options">
                      <h5 className="options-title">Additional Options</h5>

                      {/* Çocuk Koltuğu */}
                      <div className="option-item">
                        <div className="option-header">
                          <div className="option-name">
                            <span>Çocuk Koltuğu</span>
                            <div
                              className="info-tooltip"
                              title="(1-3 Yaş aralığı içindir)"
                            >
                              i
                            </div>
                          </div>
                          <div className="option-controls">
                            <button
                              type="button"
                              onClick={() =>
                                handleAdditionalOptionChange("cocukKoltugu", -1)
                              }
                              disabled={additionalOptions.cocukKoltugu === 0}
                              className="option-btn"
                            >
                              -
                            </button>
                            <span className="option-value">
                              {additionalOptions.cocukKoltugu}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleAdditionalOptionChange("cocukKoltugu", 1)
                              }
                              disabled={additionalOptions.cocukKoltugu === 3}
                              className="option-btn"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="option-footer">
                          <span>
                            {additionalOptions.cocukKoltugu > 0
                              ? "Eklendi"
                              : "Eklenmedi"}
                          </span>
                          <span>
                            {convertAndFormatPrice
                              ? convertAndFormatPrice(5, "EUR")
                              : `${getCurrencySymbol()}5`}{" "}
                            Günlük
                          </span>
                        </div>
                      </div>

                      {/* Ek Sürücü */}
                      <div className="option-item">
                        <div className="option-header">
                          <div className="option-name">
                            <span>Ek Sürücü</span>
                            <div
                              className="info-tooltip"
                              title="(Aracı kullanacak tüm sürücülerin ehliyet bilgileri ve imzaları kiralama kontratında olmalıdır.)"
                            >
                              i
                            </div>
                          </div>
                          <div className="option-controls">
                            <button
                              type="button"
                              onClick={() =>
                                handleAdditionalOptionChange("ekSurucu", -1)
                              }
                              disabled={additionalOptions.ekSurucu === 0}
                              className="option-btn"
                            >
                              -
                            </button>
                            <span className="option-value">
                              {additionalOptions.ekSurucu}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleAdditionalOptionChange("ekSurucu", 1)
                              }
                              disabled={additionalOptions.ekSurucu === 1}
                              className="option-btn"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="option-footer">
                          <span>
                            {additionalOptions.ekSurucu > 0
                              ? "Eklendi"
                              : "Eklenmedi"}
                          </span>
                          <span>
                            {convertAndFormatPrice
                              ? convertAndFormatPrice(8, "EUR")
                              : `${getCurrencySymbol()}8`}{" "}
                            Günlük
                          </span>
                        </div>
                      </div>

                      {/* Genç Sürücü Paketi */}
                      <div className="option-item">
                        <div className="option-header">
                          <div className="option-name">
                            <span>Genç Sürücü Paketi</span>
                            <div
                              className="info-tooltip"
                              title="Kiralanacak araç için sürücü gereksinimleri karşılanmadığı durumlarda zorunludur."
                            >
                              i
                            </div>
                          </div>
                          <div className="option-controls">
                            <button
                              type="button"
                              onClick={() =>
                                handleAdditionalOptionChange("gencSurucu", -1)
                              }
                              disabled={additionalOptions.gencSurucu === 0}
                              className="option-btn"
                            >
                              -
                            </button>
                            <span className="option-value">
                              {additionalOptions.gencSurucu}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleAdditionalOptionChange("gencSurucu", 1)
                              }
                              disabled={additionalOptions.gencSurucu === 1}
                              className="option-btn"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="option-footer">
                          <span>
                            {additionalOptions.gencSurucu > 0
                              ? "Eklendi"
                              : "Eklenmedi"}
                          </span>
                          <span>
                            {convertAndFormatPrice
                              ? convertAndFormatPrice(15, "EUR")
                              : `${getCurrencySymbol()}15`}{" "}
                            Günlük
                          </span>
                        </div>
                      </div>

                      {/* Total Additional Options */}
                      {calculateAdditionalOptionsTotal() > 0 && (
                        <div className="total-options">
                          <div className="total-label">
                            Additional Options Total
                          </div>
                          <div className="total-amount">
                            {formatPrice
                              ? formatPrice(calculateAdditionalOptionsTotal())
                              : `${getCurrencySymbol()}${calculateAdditionalOptionsTotal()}`}{" "}
                            per day
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className={`submit-btn ${
                        bookingLoading ? "loading" : ""
                      }`}
                    >
                      {bookingLoading ? (
                        <>
                          <div
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Processing...
                        </>
                      ) : (
                        "Book Now"
                      )}
                    </button>
                  </form>
                </div>

                {/* Share Section */}
                <div className="share-card">
                  <h4 className="share-title">Share</h4>
                  <div className="social-icons">
                    {socialIcons.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Share on ${social.name}`}
                        className="social-icon"
                      >
                        <i className={`fa ${social.icon}`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default CarsSingle;
