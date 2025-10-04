// src/pages/CarsSingle.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import Header from "../components/Header";
import BackToHomeButton from "../components/BackToHomeButton";
import { publicAPI } from "../services/api";
import { useCurrency } from "../contexts/CurrencyContext";
import "./CarsSingle.css";

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

  // Currency context
  const {
    currentCurrency,
    convertAndFormatPrice,
    formatPrice,
    convertAmount,
    getCurrentCurrencyInfo,
    isLoaded: currencyLoaded,
  } = useCurrency();

  // State variables
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
  const [bookingLoading, setBookingLoading] = useState(false);

  // Date picker refs
  const pickupDateRef = React.useRef(null);
  const returnDateRef = React.useRef(null);

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
    cocukKoltugu: 0,
    ekSurucu: 0,
    gencSurucu: 0,
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

  // Handle date changes with iOS Safari validation
  const handleDateChange = (fieldName, value) => {
    let validatedValue = value;
    
    // iOS Safari için manuel tarih kontrolü
    if (fieldName === 'pickupDate') {
      const today = new Date().toISOString().split('T')[0];
      if (value < today) {
        validatedValue = today;
        alert('Alış tarihi bugünden önce olamaz!');
      }
    }
    
    if (fieldName === 'returnDate' && formData.pickupDate) {
      const pickupDate = new Date(formData.pickupDate);
      const selectedDate = new Date(value);
      
      // En az 1 gün sonra olmalı
      const minReturnDate = new Date(pickupDate);
      minReturnDate.setDate(minReturnDate.getDate() + 1);
      
      if (selectedDate <= pickupDate) {
        validatedValue = minReturnDate.toISOString().split('T')[0];
        alert('Dönüş tarihi alış tarihinden en az 1 gün sonra olmalıdır!');
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [fieldName]: validatedValue,
    }));

    // Clear error for this field
    if (formErrors[fieldName]) {
      setFormErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  // Trigger date picker for iOS Safari compatibility
  const triggerDatePicker = (inputRef) => {
    if (inputRef && inputRef.current) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      if (isIOS || isSafari) {
        inputRef.current.focus();
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.click();
            if (inputRef.current.showPicker) {
              try {
                inputRef.current.showPicker();
              } catch (e) {
                console.log("showPicker failed on iOS Safari");
              }
            }
          }
        }, 100);
      } else {
        inputRef.current.focus();
        inputRef.current.click();
        if (inputRef.current.showPicker) {
          try {
            inputRef.current.showPicker();
          } catch (error) {
            console.log("showPicker not supported");
          }
        }
      }
    }
  };

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

  // Calculate rental days
  const calculateRentalDays = useCallback(() => {
    if (!formData.pickupDate || !formData.returnDate) return 0;

    const pickupDate = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    const diffTime = returnDate - pickupDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(1, diffDays);
  }, [formData.pickupDate, formData.returnDate]);

  // Calculate car rental total
  const calculateCarRentalTotal = useCallback(() => {
    if (!car || !currencyLoaded || !convertAmount) return 0;

    const rentalDays = calculateRentalDays();
    if (rentalDays === 0) return 0;

    const pricing = car.effectivePricing || car.pricing || {};
    const baseCurrency = pricing.currency || car.currency || "EUR";

    const dailyRate = pricing.daily || car.dailyRate || 50;
    const weeklyRate = pricing.weekly || dailyRate * 7;

    const weeks = Math.floor(rentalDays / 7);
    const remainingDays = rentalDays % 7;

    const totalEUR = weeks * weeklyRate + remainingDays * dailyRate;

    return convertAmount(totalEUR, baseCurrency, currentCurrency);
  }, [car, currencyLoaded, convertAmount, currentCurrency, calculateRentalDays]);

  // Calculate additional options total
  const calculateAdditionalOptionsTotal = useCallback(() => {
    if (!currencyLoaded || !convertAmount) return 0;

    const rentalDays = calculateRentalDays();
    if (rentalDays === 0) return 0;

    const { cocukKoltugu, ekSurucu, gencSurucu } = additionalOptions;
    const dailyOptionsTotal = cocukKoltugu * 5 + ekSurucu * 8 + gencSurucu * 15;
    const totalEUR = dailyOptionsTotal * rentalDays;

    return convertAmount(totalEUR, "EUR", currentCurrency);
  }, [additionalOptions, convertAmount, currencyLoaded, currentCurrency, calculateRentalDays]);

  // Calculate grand total
  const calculateGrandTotal = useCallback(() => {
    return calculateCarRentalTotal() + calculateAdditionalOptionsTotal();
  }, [calculateCarRentalTotal, calculateAdditionalOptionsTotal]);

  // Handle additional options change
  const handleAdditionalOptionChange = useCallback((option, increment) => {
    setAdditionalOptions((prev) => {
      const current = prev[option];
      let newValue = current + increment;

      if (option === "cocukKoltugu") {
        newValue = Math.max(0, Math.min(3, newValue));
      } else if (option === "ekSurucu" || option === "gencSurucu") {
        newValue = Math.max(0, Math.min(1, newValue));
      }

      return { ...prev, [option]: newValue };
    });
  }, []);

  // Load car data
  const loadCarData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const response = await publicAPI.getCarById(id);
      
      let carData;
      if (response?.data?.data) {
        carData = response.data.data;
      } else if (response?.data) {
        carData = response.data;
      } else {
        throw new Error("Invalid response structure");
      }

      setCar(carData);
    } catch (error) {
      console.error("Failed to load car:", error);
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

  // Get car images
  const carImages = useMemo(() => {
    if (!car) return ["/images/cars/default-car.jpg"];

    const images = [];

    if (car.mainImage?.url) {
      images.push(car.mainImage.url);
    }

    if (car.gallery && Array.isArray(car.gallery)) {
      car.gallery.forEach((img) => {
        if (img?.url) {
          images.push(img.url);
        }
      });
    }

    if (images.length === 0) {
      images.push("/images/cars/default-car.jpg");
    }

    return images;
  }, [car]);

  // Handle image load errors
  const handleImageError = useCallback((index) => {
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
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }, [formErrors]);

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

  // Generate WhatsApp message
  const generateWhatsAppMessage = useCallback(() => {
    if (!car) return "Araç kiralama talebi - detaylar yakında paylaşılacak";

    const carName = car.title || car.name || "Araç";

    const pickupDateFormatted = formData.pickupDate
      ? formatDateForDisplay(formData.pickupDate)
      : "";
    const returnDateFormatted = formData.returnDate
      ? formatDateForDisplay(formData.returnDate)
      : "";

    const additionalOptionsText = [];

    if (additionalOptions.cocukKoltugu > 0) {
      additionalOptionsText.push(
        `- Çocuk Koltuğu: ${additionalOptions.cocukKoltugu} adet`
      );
    }
    if (additionalOptions.ekSurucu > 0) {
      additionalOptionsText.push(
        `- Ek Sürücü: ${additionalOptions.ekSurucu} adet`
      );
    }
    if (additionalOptions.gencSurucu > 0) {
      additionalOptionsText.push(
        `- Genç Sürücü Paketi: ${additionalOptions.gencSurucu} adet`
      );
    }

    let message = `Merhaba, aşağıdaki araç için rezervasyon yapmak istiyorum 🚗\n\n`;

    message += `Araç: ${carName}\n`;
    message += `Alış Yeri: ${formData.pickupLocation} – ${pickupDateFormatted} ${formData.pickupTime}\n`;
    message += `Dönüş Yeri: ${formData.dropoffLocation} – ${returnDateFormatted} ${formData.returnTime}\n`;

    if (additionalOptionsText.length > 0) {
      message += `\nEk Seçenekler:\n${additionalOptionsText.join("\n")}\n`;
    }

    message += `\nLütfen müsaitliği ve fiyatı teyit eder misiniz? 🙂`;

    return message;
  }, [car, formData, additionalOptions]);

  // Handle booking submission with WhatsApp redirect
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setBookingLoading(true);

    try {
      const message = generateWhatsAppMessage();
      console.log("Generated message:", message);
      
      if (!message || message.trim() === "") {
        throw new Error("Mesaj oluşturulamadı");
      }

      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber = "905366039907";
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      console.log("WhatsApp URL:", whatsappURL);

      // Browser detection
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      console.log("Browser detection:", { isIOS, isSafari, isAndroid });

      // Platform-specific WhatsApp handling
      if (isSafari || isIOS) {
        console.log("Safari/iOS detected - trying multiple approaches");
        
        try {
          window.location.assign(whatsappURL);
          console.log("Safari: location.assign attempted");
        } catch (error1) {
          console.log("Safari: location.assign failed, trying window.open");
          
          try {
            const popup = window.open(whatsappURL, '_blank', 'noopener,noreferrer');
            if (!popup) {
              throw new Error("Popup blocked");
            }
            console.log("Safari: window.open successful");
          } catch (error2) {
            console.log("Safari: window.open failed, trying location.href");
            window.location.href = whatsappURL;
            console.log("Safari: location.href attempted");
          }
        }
      } else if (isAndroid) {
        window.location.href = whatsappURL;
        console.log("Android: location.href used");
      } else {
        const newWindow = window.open(whatsappURL, "_blank");
        if (!newWindow) {
          window.location.href = whatsappURL;
        }
        console.log("Desktop: window.open used");
      }

      alert("WhatsApp açılıyor! Rezervasyon talebiniz hazırlandı.");

      // Reset form
      setTimeout(() => {
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
      }, 1000);
      
    } catch (error) {
      console.error("WhatsApp redirect failed:", error);
      alert("WhatsApp açılırken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Car specifications
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
      { title: "Koltuk Sayısı", value: `${car.seats || 4} koltuk`},
      { title: "Kapı Sayısı", value: `${car.doors || 4} kapı` },
    ];
  }, [car]);

  // Dynamic features
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

  // Calculate price
  const calculatePrice = useCallback((period) => {
    if (!car || !currencyLoaded || !convertAndFormatPrice) {
      return "Loading...";
    }

    try {
      const pricing = car.effectivePricing || car.pricing || {};
      const baseCurrency = pricing.currency || car.currency || "EUR";
      let amount = pricing[period];

      if (!amount) {
        const dailyRate = pricing.daily || car.dailyRate || 50;
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

      return convertAndFormatPrice(amount, baseCurrency);
    } catch (error) {
      console.error("Price calculation error:", error);
      return "Price not available";
    }
  }, [car, currencyLoaded, convertAndFormatPrice]);

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
      return "€";
    }
  };

  return (
    <div className="cars-single-page">
      {/* Additional CSS for date picker fixes */}
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
            border-radius: 8px !important;
            font-size: 0.95rem !important;
            background-color: #ffffff !important;
            color: #333 !important;
            cursor: pointer !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            font-family: monospace !important;
            transition: border-color 0.3s ease !important;
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
            right: 15px !important;
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
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1 style={{ color: "white" }}>
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
                    MITCAR RENTAL Müşteri memnuniyeti ilkesiyle yola çıkan
                    MİTCAR RENTAL şirketimiz, Antalya araç kiralama alanında en
                    iyi hizmeti verebilmek için 7 yıldır sektörde yoğun çaba
                    sarf etmektedir. Müşteri istekleri doğrultusunda yürütülen
                    araç temin faaliyetleri, güncel trend dizel otomatik
                    araçların da filoya katılımıyla yeterince geliştirilerek
                    sürdürülmektedir. 7 yıllık süreçte yalnızca Antalya ilindeki
                    deneyimimizle kaliteli bir hizmet sunmanın peşinde olan
                    şirketimiz, aynı hedef doğrultusunda tüm emeklerini seferber
                    etmeye devam etmektedir. Yaptığımız tek ve özel iş, kaliteli
                    ve konforlu araç kiralama hizmetidir.
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
                {/* Price Card */}
                <div className="price-card">
                  <div className="pricing-tabs">
                    {[
                      { code: "daily", name: "Günlük" },
                      { code: "weekly", name: "Haftalık" },
                      { code: "monthly", name: "Aylık" },
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

                  <div className="price-display">
                    <div className="price-label">
                      {activePricingPeriod.charAt(0).toUpperCase() +
                        activePricingPeriod.slice(1)}{" "}
                      rate
                      {car?.effectivePricing?.seasonalName && (
                        <span className="seasonal-badge">
                          🎯 {car.effectivePricing.seasonalName}
                        </span>
                      )}
                    </div>
                    <h3 className="price-amount">
                      {calculatePrice(activePricingPeriod)}
                    </h3>
                    {car?.effectivePricing?.seasonalPeriod && (
                      <div className="seasonal-period">
                        Valid: {car.effectivePricing.seasonalPeriod}
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Form */}
                <div className="booking-form-card">
                  <h4 className="form-title">Book this car</h4>

                  <form onSubmit={handleBookingSubmit}>
                    {/* Pick Up Location */}
                    <div className="form-group">
                      <label htmlFor="pickupLocation" className="form-label">
                        Alış Yeri *
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
                        <option value="">Alış Yeri Seçiniz</option>
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
                        Dönüş Yeri *
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
                        <option value="">Dönüş Yeri Seçiniz</option>
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
                        Alış Tarihi/Zamanı *
                      </label>
                      <div className="datetime-inputs">
                        <div className="date-input-wrapper">
                          <input
                            type="text"
                            className="date-display-input"
                            value={formatDateForDisplay(formData.pickupDate)}
                            placeholder="GG/AA/YYYY"
                            readOnly
                            onClick={() => triggerDatePicker(pickupDateRef)}
                            style={{
                              borderColor: formErrors.pickupDate
                                ? "#dc3545"
                                : "#e9ecef",
                            }}
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
                          <Calendar
                            className="calendar-icon"
                            size={18}
                            onClick={() => triggerDatePicker(pickupDateRef)}
                          />
                        </div>
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
                          <option value="">Saat seçiniz</option>
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
                      <label className="form-label">
                        Dönüş Tarihi/Zamanı *
                      </label>
                      <div className="datetime-inputs">
                        <div className="date-input-wrapper">
                          <input
                            type="text"
                            className="date-display-input"
                            value={formatDateForDisplay(formData.returnDate)}
                            placeholder="GG/AA/YYYY"
                            readOnly
                            onClick={() => triggerDatePicker(returnDateRef)}
                            style={{
                              borderColor: formErrors.returnDate
                                ? "#dc3545"
                                : "#e9ecef",
                            }}
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
                          <Calendar
                            className="calendar-icon"
                            size={18}
                            onClick={() => triggerDatePicker(returnDateRef)}
                          />
                        </div>
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
                          <option value="">Saat seçiniz</option>
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
                      <h5 className="options-title">Ek Opsiyonlar</h5>

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

                      {/* Rental Summary */}
                      {formData.pickupDate && formData.returnDate && (
                        <div className="rental-summary">
                          <div className="summary-title">Kiralama Özeti</div>

                          <div className="summary-row">
                            <span className="summary-label">
                              Kiralama Süresi:
                            </span>
                            <span className="summary-value">
                              {calculateRentalDays()} gün
                            </span>
                          </div>

                          {calculateCarRentalTotal() > 0 && (
                            <div className="summary-row">
                              <span className="summary-label">
                                Araç Kiralama:
                              </span>
                              <span className="summary-value">
                                {formatPrice
                                  ? formatPrice(calculateCarRentalTotal())
                                  : `${getCurrencySymbol()}${calculateCarRentalTotal().toFixed(
                                      2
                                    )}`}
                              </span>
                            </div>
                          )}

                          {calculateAdditionalOptionsTotal() > 0 && (
                            <div className="summary-row">
                              <span className="summary-label">
                                Ek Opsiyonlar:
                              </span>
                              <span className="summary-value">
                                {formatPrice
                                  ? formatPrice(
                                      calculateAdditionalOptionsTotal()
                                    )
                                  : `${getCurrencySymbol()}${calculateAdditionalOptionsTotal().toFixed(
                                      2
                                    )}`}
                              </span>
                            </div>
                          )}

                          {calculateGrandTotal() > 0 && (
                            <div className="summary-row total-row">
                              <span className="summary-label">
                                <strong>Toplam Tutar:</strong>
                              </span>
                              <span className="summary-value total-amount">
                                <strong>
                                  {formatPrice
                                    ? formatPrice(calculateGrandTotal())
                                    : `${getCurrencySymbol()}${calculateGrandTotal().toFixed(
                                        2
                                      )}`}
                                </strong>
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Additional Options Per Day Display */}
                      {(additionalOptions.cocukKoltugu > 0 ||
                        additionalOptions.ekSurucu > 0 ||
                        additionalOptions.gencSurucu > 0) && (
                        <div className="total-options">
                          <div className="total-label">
                            Ek Opsiyonlar (Günlük)
                          </div>
                          <div className="total-amount">
                            {(() => {
                              const { cocukKoltugu, ekSurucu, gencSurucu } =
                                additionalOptions;
                              const dailyTotal =
                                cocukKoltugu * 5 +
                                ekSurucu * 8 +
                                gencSurucu * 15;
                              const convertedDaily = convertAmount
                                ? convertAmount(
                                    dailyTotal,
                                    "EUR",
                                    currentCurrency
                                  )
                                : dailyTotal;
                              return formatPrice
                                ? formatPrice(convertedDaily)
                                : `${getCurrencySymbol()}${convertedDaily.toFixed(
                                    2
                                  )}`;
                            })()}{" "}
                            / gün
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className={`submit-btn whatsapp-btn ${
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
                          WhatsApp Açılıyor...
                        </>
                      ) : (
                        <>
                          <i
                            className="fa fa-whatsapp"
                            style={{ marginRight: "8px" }}
                          ></i>
                          WhatsApp ile Rezervasyon Yap
                        </>
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
                        <i
                          className={`fa ${social.icon}`}
                          style={{ color: "black" }}
                        />
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