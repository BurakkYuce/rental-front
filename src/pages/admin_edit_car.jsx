// src/pages/admin_edit_car.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Car,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
} from "lucide-react";
import { adminAPI } from "../services/api";
import AdminLayout from "../components/AdminLayout";
import "../assets/css/bootstrap.min.css";
import "../assets/css/plugins.css";
import "../assets/css/style.css";

// Move these OUTSIDE the component to prevent recreation on every render
const carTypes = [
  "Ekonomik",
  "Orta Sınıf",
  "Üst Sınıf",
  "SUV",
  "Geniş",
  "Lüks",
];

const bodyTypes = [
  "Belirtilmemiş",
  "Sedan",
  "Hatchback",
  "Suv",
  "Station Wagon",
  "Kombi",
  "Panelvan",
  "Minivan",
  "Minivan & Panelvan",
  "Pickup",
  "Otobüs",
  "Kamyonet",
  "Kamyon",
  "Convertible",
  "Coupe",
  "Exotic Cars",
  "Truck",
  "Sports Car",
  "SUV",
];

const transmissionTypes = [
  "Belirtilmemiş",
  "Manuel",
  "Yarı Otomatik",
  "Otomatik",
];
const fuelTypes = [
  "Belirtilmemiş",
  "Benzin",
  "Dizel",
  "Benzin+LPG",
  "Elektrikli",
  "Hibrit",
];

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

const pricingPeriods = [
  { code: "daily", name: "Daily Rate", unit: "/day" },
  { code: "weekly", name: "Weekly Rate", unit: "/week" },
  { code: "monthly", name: "Monthly Rate", unit: "/month" },
];

const carFeatures = [
  "Klima",
  "GPS Navigasyon",
  "Bluetooth",
  "USB Port",
  "Geri Görüş Kamerası",
  "Sunroof",
  "Deri Koltuklar",
  "Isıtmalı Koltuklar",
  "Hız Sabitleme",
  "Park Sensörü",
  "ABS Fren",
  "Hava Yastığı",
  "Hidrolik Direksiyon",
  "Elektrikli Camlar",
  "CD Player",
  "Xenon Far",
  "Alüminyum Jant",
  "Tavan Aralığı",
  "Multifonksiyon Direksiyon",
  "Otomatik Şanzıman",
];

// Separate Modal Component to prevent re-renders
const PricingModal = React.memo(({ 
  show, 
  onClose, 
  newPricing, 
  onPricingChange, 
  onAddPricing,
  pricingPeriods 
}) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "30px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h4 style={{ marginBottom: "15px", color: "#333" }}>
          Add Scheduled Pricing
        </h4>
        <div
          style={{
            backgroundColor: "#e3f2fd",
            border: "1px solid #90caf9",
            borderRadius: "6px",
            padding: "10px",
            marginBottom: "20px",
            fontSize: "0.85rem",
            color: "#1565c0",
          }}
        >
          💡 Enter prices in EUR (Euro). These will be automatically
          converted for customers.
        </div>

        <div className="row">
          <div className="col-md-12 mb-3">
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "600",
              }}
            >
              Pricing Name <span style={{ color: "#e74c3c" }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={newPricing.name}
              onChange={onPricingChange}
              placeholder="e.g. Summer Special, Holiday Rates"
              style={{
                width: "100%",
                padding: "10px",
                border: "2px solid #e9ecef",
                borderRadius: "6px",
                fontSize: "1rem",
              }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "600",
              }}
            >
              Start Date <span style={{ color: "#e74c3c" }}>*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={newPricing.startDate}
              onChange={onPricingChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "2px solid #e9ecef",
                borderRadius: "6px",
                fontSize: "1rem",
              }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "600",
              }}
            >
              End Date <span style={{ color: "#e74c3c" }}>*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={newPricing.endDate || ""}
              onChange={onPricingChange}
              min={newPricing.startDate}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "2px solid #e9ecef",
                borderRadius: "6px",
                fontSize: "1rem",
              }}
            />
          </div>

          {pricingPeriods.map((period) => (
            <div key={period.code} className="col-md-4 mb-3">
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "600",
                }}
              >
                {period.name} (€ EUR)
              </label>
              <input
                type="number"
                name={`prices.${period.code}`}
                value={newPricing.prices[period.code]}
                onChange={onPricingChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "2px solid #e9ecef",
                  borderRadius: "6px",
                  fontSize: "1rem",
                }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "25px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onAddPricing}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1ECB15",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Plus size={16} />
            Add Pricing
          </button>
        </div>
      </div>
    </div>
  );
});

// Car brands for selection (matching database enum values)
const carBrands = [
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Chery",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Dacia",
  "Daihatsu",
  "Dodge",
  "DS Automobiles",
  "Eagle",
  "Ferrari",
  "Fiat",
  "Ford",
  "GAZ",
  "Geely",
  "Honda",
  "Hyundai",
  "Ikco",
  "Infiniti",
  "Jaguar",
  "Kia",
  "Lada",
  "Lamborghini",
  "Lancia",
  "Lexus",
  "Mazda",
  "Mercedes - Benz",
  "MG",
  "Mini",
  "Mitsubishi",
  "Moskwitsch",
  "Nissan",
  "Opel",
  "Peugeot",
  "Plymouth",
  "Pontiac",
  "Porsche",
  "Proton",
  "Renault",
  "Rover",
  "Saab",
  "Seat",
  "Skoda",
  "Subaru",
  "Suzuki",
  "Tata",
  "Tesla",
  "Tofas",
  "Toyota",
  "Volkswagen",
  "Volvo",
  "Acura",
  "DFM",
  "GMC",
  "Hummer",
  "Isuzu",
  "Jeep",
  "Land Rover",
  "Mahindra",
  "Ssangyong",
  "BMC",
  "Ford - Otosan",
  "Iveco - Otoyol",
  "Karsan",
  "Magirus",
  "Temsa",
  "Iveco",
  "Bedford",
  "DAF",
  "DFSK",
  "FAW",
  "HFKanuni",
  "Mitsubishi - Temsa",
  "Scania",
];

const AdminEditCar = () => {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get car ID from either URL params or query params
  const carId = paramId || searchParams.get("id");
  const isEditMode = carId && carId !== "new";
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    category: "Lüks",
    fuelType: "Benzin",
    transmission: "Otomatik",
    pickupLocation: "",
    dropoffLocation: "",
    pricing: {
      daily: "",
      weekly: "",
      monthly: "",
    },
    currency: "EUR",
    mainImage: {
      url: "",
      alt: "",
    },
    gallery: [],
    status: true,
    featured: false,
    features: [],
  });

  // Separate state for file uploads (simplified to match blog pattern)
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [galleryImages, setGalleryImages] = useState([{ id: 1, url: "" }]);

  const [scheduledPricing, setScheduledPricing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [activePeriod, setActivePeriod] = useState("daily");
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [newPricing, setNewPricing] = useState({
    startDate: "",
    endDate: "",
    prices: {
      daily: "",
      weekly: "",
      monthly: "",
    },
    name: "",
  });

  useEffect(() => {
    if (!isEditMode) return;

    const fetchCar = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await adminAPI.getCarById(carId);
        const carData = response.data.data;

        if (carData) {
          setFormData((prev) => ({
            ...prev,
            ...carData,
            pricing: carData.pricing || { daily: "", weekly: "", monthly: "" },
            mainImage: carData.mainImage || { url: "", alt: "" },
            gallery: carData.gallery || [],
            featured: carData.featured || false,
            features: carData.features || [],
          }));

          // Set image preview if main image exists
          if (carData.mainImage?.url) {
            setImagePreview(carData.mainImage.url);
          }

          // Set up gallery images
          if (carData.gallery?.length > 0) {
            const existingGallery = carData.gallery.map(
              (img, index) => ({
                id: index + 1,
                url: img.url || "",
              })
            );
            setGalleryImages(existingGallery);
          }

          if (carData.seasonalPricing?.length > 0) {
            const formattedPricing = carData.seasonalPricing.map(
              (pricing, index) => ({
                id: index + 1,
                startDate: convertFromTurkishDate(pricing.startDate),
                endDate: convertFromTurkishDate(pricing.endDate),
                prices: {
                  daily: pricing.daily || "",
                  weekly: pricing.weekly || "",
                  monthly: pricing.monthly || "",
                },
                name: pricing.name || `Season ${index + 1}`,
              })
            );
            setScheduledPricing(formattedPricing);
          }
        }
      } catch (error) {
        console.error("Failed to load car data:", error);
        setError("Failed to load car data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCar();
  }, [carId, isEditMode]);

  const handleInputChange = useCallback((e) => {
    if (e) {
      e.stopPropagation();
    }
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        // Derin kopya için tüm ara seviyeleri kopyala
        const newData = { ...prev };
        let current = newData;

        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = finalValue;
        return newData;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: finalValue,
      }));
    }
  }, []);

  const addGalleryImage = () => {
    const newId = Math.max(...galleryImages.map((img) => img.id), 0) + 1;
    setGalleryImages((prev) => [...prev, { id: newId, url: "" }]);
  };

  const removeGalleryImage = (id) => {
    if (galleryImages.length > 1) {
      setGalleryImages((prev) => prev.filter((img) => img.id !== id));
      // Gallery image removed
    }
  };

  const handleGalleryImageChange = (id, field, value) => {
    setGalleryImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, [field]: value } : img))
    );
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...(prev.features || []), feature],
    }));
  };

  const handlePricingModalOpen = () => {
    console.log("🔵 Opening scheduled pricing modal...");
    setShowPricingModal(true);
    setError(""); // Clear any existing errors
  };

  useEffect(() => {
    if (showPricingModal) {
      setNewPricing({
        startDate: "",
        endDate: "",
        prices: { daily: "", weekly: "", monthly: "" },
        name: "",
      });
    }
  }, [showPricingModal]);

  const handlePricingInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("prices.")) {
      const period = name.split(".")[1];
      // Validate numeric inputs for prices
      const numericValue = value === "" ? "" : value;
      if (numericValue !== "" && (isNaN(numericValue) || parseFloat(numericValue) < 0)) {
        return; // Don't update if invalid number
      }
      
      setNewPricing((prev) => ({
        ...prev,
        prices: {
          ...prev.prices,
          [period]: numericValue,
        },
      }));
    } else {
      setNewPricing((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []); // Empty dependency array to prevent re-creation

  const addScheduledPricing = useCallback(() => {
    // Validate required fields
    if (!newPricing.startDate) {
      setError("Start date is required");
      return;
    }
    if (!newPricing.endDate) {
      setError("End date is required");
      return;
    }
    if (!newPricing.name) {
      setError("Pricing name is required");
      return;
    }

    // Validate date range
    if (new Date(newPricing.startDate) >= new Date(newPricing.endDate)) {
      setError("End date must be after start date");
      return;
    }

    // Check if at least one price is provided
    const hasPrice = Object.values(newPricing.prices).some(price => price && parseFloat(price) > 0);
    if (!hasPrice) {
      setError("At least one price must be provided");
      return;
    }

    // Clear any previous errors
    setError("");

    const pricing = {
      ...newPricing,
      id: Date.now(),
      // Convert dates to Turkish format for backend
      startDate: convertToTurkishDate(newPricing.startDate),
      endDate: convertToTurkishDate(newPricing.endDate),
    };
    
    setScheduledPricing((prev) => [...prev, pricing]);
    setShowPricingModal(false);
    
    console.log("✅ Scheduled pricing added successfully:", pricing);
  }, [newPricing]);

  const removeScheduledPricing = (pricingId) => {
    if (
      window.confirm("Are you sure you want to remove this pricing schedule?")
    ) {
      setScheduledPricing((prev) => prev.filter((p) => p.id !== pricingId));
    }
  };

  const handleSave = async (e) => {
    // Prevent form submission and page reload
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("🚀 Save button clicked!");
    console.log("📋 Form data:", formData);

    if (
      !formData.title ||
      !formData.brand ||
      !formData.model ||
      !formData.pricing?.daily
    ) {
      setError(
        "Please fill in required fields (Title, Brand, Model, and Daily Price)"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Upload main image to Cloudinary if a new image was selected (SAME AS BLOG)
      let mainImageUrl = formData.mainImage?.url || ""; // Keep existing URL for edits
      
      if (selectedImageFile) {
        console.log("🔄 Uploading main image to Cloudinary...");
        setUploadingImages(true);
        try {
          const uploadResponse = await adminAPI.uploadCarImage(selectedImageFile);
          if (uploadResponse.data && uploadResponse.data.imageUrl) {
            mainImageUrl = uploadResponse.data.imageUrl;
            console.log("✅ Main image uploaded successfully:", mainImageUrl);
          } else {
            throw new Error("Invalid upload response");
          }
        } catch (imageError) {
          console.error("❌ Image upload failed:", imageError);
          setError("Failed to upload image. Please try again.");
          return;
        } finally {
          setUploadingImages(false);
        }
      }

      // Upload gallery images to Cloudinary if any new files were selected
      let processedGallery = [];
      
      if (galleryImages && galleryImages.length > 0) {
        console.log("🔄 Processing gallery images...");
        setUploadingImages(true);
        
        for (const galleryImage of galleryImages) {
          if (galleryImage.file) {
            // New file needs to be uploaded
            try {
              console.log("🔄 Uploading gallery image to Cloudinary...", galleryImage.file.name);
              const uploadResponse = await adminAPI.uploadCarImage(galleryImage.file);
              if (uploadResponse.data && uploadResponse.data.imageUrl) {
                processedGallery.push({ url: uploadResponse.data.imageUrl });
                console.log("✅ Gallery image uploaded successfully:", uploadResponse.data.imageUrl);
              } else {
                throw new Error("Invalid gallery upload response");
              }
            } catch (galleryError) {
              console.error("❌ Gallery image upload failed:", galleryError);
              setError("Failed to upload gallery image. Please try again.");
              return;
            }
          } else if (galleryImage.url && !galleryImage.url.startsWith("data:")) {
            // Existing URL, keep it
            processedGallery.push({ url: galleryImage.url });
          }
        }
        
        setUploadingImages(false);
      }

      // Prepare data for API (SAME STRUCTURE AS BLOG)
      const saveData = {
        ...formData,
        // Ensure currency is always EUR
        currency: "EUR",
        // Use BLOG-STYLE mainImage structure
        mainImage: mainImageUrl ? {
          url: mainImageUrl,
          alt: formData.mainImage?.alt || `${formData.brand} ${formData.model}`
        } : null,
        // Use processed gallery images
        gallery: processedGallery,
        // Add seasonal pricing if exists
        seasonalPricing: scheduledPricing.map((pricing) => ({
          startDate: pricing.startDate,
          endDate: pricing.endDate,
          daily: pricing.prices.daily || formData.pricing.daily,
          weekly: pricing.prices.weekly || formData.pricing.weekly,
          monthly: pricing.prices.monthly || formData.pricing.monthly,
          name: pricing.name,
        })),
      };

      console.log("📤 Sending data to API:", saveData);
      console.log("🔧 Mode:", isEditMode ? "UPDATE" : "CREATE");
      console.log("🆔 Car ID:", carId);

      if (isEditMode) {
        console.log("📝 Calling updateCar API...");
        const response = await adminAPI.updateCar(carId, saveData);
        console.log("✅ Update response:", response);
      } else {
        console.log("➕ Calling createCar API...");
        const response = await adminAPI.createCar(saveData);
        console.log("✅ Create response:", response);
      }

      alert(`Car ${isEditMode ? "updated" : "created"} successfully!`);
      // Navigate with state to trigger refresh
      navigate("/admin", { state: { refresh: true, section: "cars" } });
    } catch (error) {
      console.error("❌ Save failed:", error);
      console.error("📄 Error response:", error.response?.data);
      console.error("🔍 Error message:", error.message);
      setError(error.response?.data?.error || "Failed to save car data.");
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Convert HTML date input (YYYY-MM-DD) to Turkish format (DD/MM/YYYY)
  const convertToTurkishDate = (htmlDate) => {
    if (!htmlDate) return '';
    const date = new Date(htmlDate);
    return formatDate(date);
  };

  // Convert Turkish format (DD/MM/YYYY) to HTML date input format (YYYY-MM-DD)
  const convertFromTurkishDate = (turkishDate) => {
    if (!turkishDate) return '';
    
    try {
      // Handle different date formats
      let day, month, year;
      
      if (turkishDate.includes('/')) {
        // Turkish format: DD/MM/YYYY
        const parts = turkishDate.split('/');
        if (parts.length === 3) {
          day = parts[0].padStart(2, '0');
          month = parts[1].padStart(2, '0');
          year = parts[2];
        } else {
          return '';
        }
      } else if (turkishDate.includes('-')) {
        // Already in YYYY-MM-DD format
        return turkishDate.split('T')[0]; // Remove time part if exists
      } else {
        return '';
      }
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error converting Turkish date:', error);
      return '';
    }
  };


  if (loading && isEditMode) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          padding: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "#666" }}>
          <div style={{ fontSize: "18px", marginBottom: "10px" }}>
            Loading car data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      title={isEditMode ? "Edit Car" : "Add New Car"}
      subtitle={
        isEditMode
          ? "Update car information and details"
          : "Add a new car to your fleet"
      }
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          backgroundColor: "white",
          padding: "20px 30px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            style={{
              padding: "10px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ArrowLeft size={20} color="#666" />
          </button>
          <div>
            <h2 style={{ margin: 0, color: "#333", fontWeight: "600" }}>
              {isEditMode ? "Edit Car" : "Add New Car"}
            </h2>
            <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
              {isEditMode
                ? "Update car information and pricing"
                : "Create a new car listing"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading || uploadingImages}
          style={{
            backgroundColor: "#1ECB15",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: loading || uploadingImages ? "not-allowed" : "pointer",
            fontWeight: "500",
            fontSize: "1rem",
            opacity: loading || uploadingImages ? 0.6 : 1,
          }}
        >
          <Save size={20} />
          {uploadingImages
            ? "Uploading Images..."
            : loading
            ? "Saving..."
            : isEditMode
            ? "Update Car"
            : "Save Car"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #f5c6cb",
          }}
        >
          {error}
        </div>
      )}

      <div className="row">
        {/* Left Column - Car Details */}
        <div className="col-lg-8">
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "30px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              marginBottom: "20px",
            }}
          >
            <h4
              style={{
                marginBottom: "25px",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Car size={24} color="#1ECB15" />
              Car Information
            </h4>

            <div className="row">
              <div className="col-md-8 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Car Title <span style={{ color: "#e74c3c" }}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  placeholder="e.g. BMW M2 2020"
                  autoComplete="off"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Year <span style={{ color: "#e74c3c" }}>*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year || ""}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  min="1980"
                  max={new Date().getFullYear() + 1}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Brand <span style={{ color: "#e74c3c" }}>*</span>
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                >
                  <option value="">Select Brand</option>
                  {carBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Model <span style={{ color: "#e74c3c" }}>*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model || ""}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  placeholder="e.g. M2, A4, Corolla"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                >
                  {carTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Body Type
                </label>
                <select
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                >
                  {bodyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Seats
                </label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats || ""}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  min="1"
                  max="50"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Doors
                </label>
                <input
                  type="number"
                  name="doors"
                  value={formData.doors}
                  onChange={handleInputChange}
                  min="2"
                  max="6"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Engine (cc)
                </label>
                <input
                  type="number"
                  name="engineCapacity"
                  value={formData.engineCapacity}
                  onChange={handleInputChange}
                  placeholder="e.g. 1600"
                  min="500"
                  max="10000"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                >
                  {transmissionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                >
                  {fuelTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Pickup Location
                </label>
                <select
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                >
                  <option value="">Select pickup location</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Dropoff Location
                </label>
                <select
                  name="dropoffLocation"
                  value={formData.dropoffLocation}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                >
                  <option value="">Select dropoff location</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Main Image
                </label>
                <div
                  style={{
                    border: "2px dashed #e9ecef",
                    borderRadius: "6px",
                    padding: "20px",
                    textAlign: "center",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Validate file type (same as blog)
                        if (!file.type.startsWith("image/")) {
                          setError("Please select a valid image file");
                          return;
                        }
                        
                        // Store file for upload (same as blog)
                        setSelectedImageFile(file);
                        
                        // Create preview URL for display (same as blog)
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setImagePreview(e.target.result);
                        };
                        reader.readAsDataURL(file);
                        
                        console.log("📁 Main image selected for upload:", file.name);
                      }
                    }}
                    style={{
                      display: "none",
                    }}
                    id="mainImageInput"
                  />
                  <label
                    htmlFor="mainImageInput"
                    style={{
                      cursor: "pointer",
                      display: "inline-block",
                      padding: "10px 20px",
                      backgroundColor: "#1ECB15",
                      color: "white",
                      borderRadius: "6px",
                      fontSize: "1rem",
                      fontWeight: "500",
                      border: "none",
                    }}
                  >
                    Choose Main Image
                  </label>
                  {(imagePreview || formData.mainImage?.url) && (
                    <div style={{ marginTop: "15px" }}>
                      <img
                        src={imagePreview || formData.mainImage.url}
                        alt="Main car image"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "150px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid #e9ecef",
                        }}
                      />
                      <p
                        style={{
                          margin: "10px 0 0 0",
                          fontSize: "0.9rem",
                          color: "#666",
                        }}
                      >
                        {selectedImageFile?.name || "Image selected"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe the car's features, condition, and unique selling points..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    resize: "vertical",
                  }}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "600",
                  }}
                >
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleInputChange}
                  />
                  Active Status
                </label>
              </div>

              <div className="col-md-6 mb-3">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "600",
                  }}
                >
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                  Featured Car
                </label>
              </div>

              {/* Gallery Images Section */}
              <div className="col-md-12 mb-3">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <h5 style={{ margin: 0, color: "#333" }}>Gallery Images</h5>
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    style={{
                      backgroundColor: "#1ECB15",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    <Plus size={16} />
                    Add Gallery Image
                  </button>
                </div>

                {galleryImages.map((image, index) => (
                  <div
                    key={image.id}
                    style={{
                      marginBottom: "15px",
                      padding: "15px",
                      border: "1px solid #e9ecef",
                      borderRadius: "6px",
                    }}
                  >
                    <div className="row">
                      <div className="col-md-10">
                        <label
                          style={{
                            display: "block",
                            marginBottom: "10px",
                            fontWeight: "600",
                          }}
                        >
                          Gallery Image {index + 1}
                        </label>
                        <div
                          style={{
                            border: "2px dashed #e9ecef",
                            borderRadius: "6px",
                            padding: "15px",
                            textAlign: "center",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                // Create preview URL for display (simplified)
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  handleGalleryImageChange(
                                    image.id,
                                    "url",
                                    e.target.result
                                  );
                                  handleGalleryImageChange(
                                    image.id,
                                    "file",
                                    file
                                  );
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            style={{
                              display: "none",
                            }}
                            id={`galleryImageInput-${image.id}`}
                          />
                          <label
                            htmlFor={`galleryImageInput-${image.id}`}
                            style={{
                              cursor: "pointer",
                              display: "inline-block",
                              padding: "8px 16px",
                              backgroundColor: "#1ECB15",
                              color: "white",
                              borderRadius: "4px",
                              fontSize: "0.9rem",
                              fontWeight: "500",
                              border: "none",
                            }}
                          >
                            Choose Image
                          </label>
                          {image.url && (
                            <div style={{ marginTop: "10px" }}>
                              <img
                                src={image.url}
                                alt={`Gallery image ${index + 1}`}
                                style={{
                                  maxWidth: "150px",
                                  maxHeight: "100px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                  border: "1px solid #e9ecef",
                                }}
                              />
                              <p
                                style={{
                                  margin: "5px 0 0 0",
                                  fontSize: "0.8rem",
                                  color: "#666",
                                }}
                              >
                                {image.file?.name || "Image selected"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-2 d-flex align-items-end">
                        {galleryImages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(image.id)}
                            style={{
                              backgroundColor: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "10px",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Section */}
            <div style={{ marginTop: "30px" }}>
              <h5 style={{ marginBottom: "15px", color: "#333" }}>Features</h5>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "10px",
                }}
              >
                {carFeatures.map((feature) => (
                  <label
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      backgroundColor: formData.features.includes(feature)
                        ? "#1ECB1515"
                        : "#f8f9fa",
                      border: `2px solid ${
                        formData.features.includes(feature)
                          ? "#1ECB15"
                          : "#e9ecef"
                      }`,
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      style={{ margin: 0 }}
                    />
                    <span style={{ fontSize: "0.9rem", color: "#333" }}>
                      {feature}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Pricing and Inventory */}
        <div className="col-lg-4">
          {/* Base Pricing */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              marginBottom: "20px",
            }}
          >
            <h4
              style={{
                marginBottom: "10px",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <DollarSign size={24} color="#1ECB15" />
              Pricing
            </h4>
            <div
              style={{
                backgroundColor: "#e3f2fd",
                border: "1px solid #90caf9",
                borderRadius: "6px",
                padding: "12px",
                marginBottom: "20px",
                fontSize: "0.9rem",
                color: "#1565c0",
              }}
            >
              💡 <strong>Important:</strong> Enter all prices in EUR (Euro). The
              system will automatically convert to other currencies for
              customers based on current exchange rates.
            </div>

            {pricingPeriods.map((period) => (
              <div key={period.code} style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "600",
                  }}
                >
                  {period.name} (€ EUR)
                  {period.code === "daily" && (
                    <span style={{ color: "#e74c3c" }}> *</span>
                  )}
                </label>
                <input
                  type="number"
                  name={`pricing.${period.code}`}
                  value={formData.pricing?.[period.code] || ""}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "2px solid #e9ecef",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Scheduled Pricing */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h4
                style={{
                  margin: 0,
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Calendar size={24} color="#1ECB15" />
                Scheduled Pricing
              </h4>
              <button
                type="button"
                onClick={handlePricingModalOpen}
                style={{
                  backgroundColor: "#1ECB15",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            {/* Pricing Period Tabs */}
            <div
              style={{
                display: "flex",
                marginBottom: "15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                padding: "4px",
              }}
            >
              {pricingPeriods.map((period) => (
                <button
                  type="button"
                  key={period.code}
                  onClick={() => setActivePeriod(period.code)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    backgroundColor:
                      activePeriod === period.code ? "#1ECB15" : "transparent",
                    color: activePeriod === period.code ? "white" : "#666",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                  }}
                >
                  {period.code.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Pricing List */}
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {scheduledPricing.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#666",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    border: "2px dashed #e9ecef",
                  }}
                >
                  <Calendar
                    size={32}
                    color="#ccc"
                    style={{ marginBottom: "10px" }}
                  />
                  <p style={{ margin: 0 }}>No scheduled pricing yet</p>
                  <p style={{ margin: 0, fontSize: "0.8rem" }}>
                    Add custom pricing for specific date ranges
                  </p>
                </div>
              ) : (
                scheduledPricing.map((pricing) => (
                  <div
                    key={pricing.id}
                    style={{
                      padding: "15px",
                      border: "2px solid #f1f3f4",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      backgroundColor: "#fafbfc",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                      }}
                    >
                      <div>
                        <h6
                          style={{
                            margin: 0,
                            color: "#333",
                            fontWeight: "600",
                          }}
                        >
                          {pricing.name}
                        </h6>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#666",
                            marginTop: "3px",
                          }}
                        >
                          {formatDate(pricing.startDate)} -{" "}
                          {formatDate(pricing.endDate)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeScheduledPricing(pricing.id)}
                        style={{
                          padding: "4px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        color: "#1ECB15",
                      }}
                    >
                      €{pricing.prices[activePeriod] || "0.00"}
                      {
                        pricingPeriods.find((p) => p.code === activePeriod)
                          ?.unit
                      }
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      <PricingModal 
        show={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        newPricing={newPricing}
        onPricingChange={handlePricingInputChange}
        onAddPricing={addScheduledPricing}
        pricingPeriods={pricingPeriods}
      />
    </AdminLayout>
  );
};

export default AdminEditCar;
