// src/pages/TransferService.jsx - Transfer Service Page for Customers
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToHomeButton from "../components/BackToHomeButton.jsx";
import api from "../services/api.js";
import FAQContactFooter from "../components/Home/FAQContactFooter.jsx";

const TransferService = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedCapacity, setSelectedCapacity] = useState("capacity_1_4");
  let a = 5;
  console.log(a);
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    passengers: "1",
    pickupLocation: "",
    dropoffLocation: "",
    date: "",
    time: "",
    message: "",
  });

  const [contactFormSubmitting, setContactFormSubmitting] = useState(false);
  const [contactFormSuccess, setContactFormSuccess] = useState(false);

  // Capacity options
  const capacityOptions = [
    {
      key: "capacity_1_4",
      label: "1-4 Passengers",
      description: "Sedan / Standard Car",
      icon: "🚗",
      maxPassengers: 4,
    },
    {
      key: "capacity_1_6",
      label: "1-6 Passengers",
      description: "MPV / Minivan",
      icon: "🚐",
      maxPassengers: 6,
    },
    {
      key: "capacity_1_16",
      label: "1-16 Passengers",
      description: "Minibus / Coach",
      icon: "🚌",
      maxPassengers: 16,
    },
  ];

  // Fetch transfer zones

  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        // api.js'deki konfigürasyonu kullan
        const response = await api.get("/transfers");

        if (response.data.success) {
          setZones(response.data.data || []);
        } else {
          throw new Error(
            response.data.error || "Failed to load transfer zones"
          );
        }
      } catch (err) {
        console.error("❌ Failed to load transfer zones:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  // Generate WhatsApp message with transfer details
  const generateWhatsAppMessage = () => {
    const selectedCapacityInfo = getSelectedCapacityInfo();

    // Find the selected transfer zone for pricing
    const selectedZoneData = zones.find(
      (zone) =>
        contactForm.dropoffLocation
          .toLowerCase()
          .includes(zone.zoneName.toLowerCase()) ||
        zone.zoneName
          .toLowerCase()
          .includes(contactForm.dropoffLocation.toLowerCase())
    );

    const zonePricing = selectedZoneData
      ? selectedZoneData.pricing[selectedCapacity]
      : "Özel Fiyat";

    // Build the message
    let message = `Merhaba, transfer hizmeti için rezervasyon yapmak istiyorum 🚐\n\n`;

    message += `Ad Soyad: ${contactForm.name}\n`;
    message += `Email: ${contactForm.email}\n`;
    message += `Telefon: ${contactForm.phone}\n`;
    message += `Yolcu Sayısı: ${contactForm.passengers} kişi\n\n`;

    message += `Araç Tipi: ${selectedCapacityInfo?.label} - ${selectedCapacityInfo?.description}\n`;
    message += `Alış Yeri: ${contactForm.pickupLocation}\n`;
    message += `Varış Yeri: ${contactForm.dropoffLocation}\n`;
    message += `Tarih: ${contactForm.date}\n`;
    message += `Saat: ${contactForm.time}\n\n`;

    if (selectedZoneData) {
      message += `Bölge: ${selectedZoneData.zoneName}\n`;
      message += `Tahmini Fiyat: €${zonePricing}\n\n`;
    }

    if (contactForm.message.trim()) {
      message += `Ek Bilgiler: ${contactForm.message}\n\n`;
    }

    message += `Lütfen müsaitliği ve fiyatı teyit eder misiniz? 🙂`;

    return message;
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!contactForm.name.trim()) {
      errors.name = "Ad soyad gereklidir";
    }

    if (!contactForm.email.trim()) {
      errors.email = "Email adresi gereklidir";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = "Geçerli bir email adresi giriniz";
    }

    if (!contactForm.phone.trim()) {
      errors.phone = "Telefon numarası gereklidir";
    }

    if (!contactForm.pickupLocation.trim()) {
      errors.pickupLocation = "Alış yeri gereklidir";
    }

    if (!contactForm.dropoffLocation.trim()) {
      errors.dropoffLocation = "Varış yeri gereklidir";
    }

    if (!contactForm.date) {
      errors.date = "Tarih seçimi gereklidir";
    }

    if (!contactForm.time) {
      errors.time = "Saat seçimi gereklidir";
    }

    return errors;
  };

  // Handle contact form submission - Open WhatsApp instead
  const handleContactSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      // Show validation errors
      let errorMessage = "Lütfen şu alanları kontrol edin:\n";
      Object.values(errors).forEach((error) => {
        errorMessage += `• ${error}\n`;
      });
      alert(errorMessage);
      return;
    }

    setContactFormSubmitting(true);

    try {
      // Generate WhatsApp message
      const message = generateWhatsAppMessage();
      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber = "905530755678"; // Turkish number format
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Open WhatsApp in new tab
      window.open(whatsappURL, "_blank");

      // Show success message
      setContactFormSuccess(true);

      // Reset form after a short delay
      setTimeout(() => {
        setContactForm({
          name: "",
          email: "",
          phone: "",
          passengers: "1",
          pickupLocation: "",
          dropoffLocation: "",
          date: "",
          time: "",
          message: "",
        });
      }, 1000);
    } catch (error) {
      console.error("WhatsApp redirect failed:", error);
      alert("WhatsApp açılırken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setContactFormSubmitting(false);
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Get price for selected capacity and zone
  const getPrice = (zone, capacity) => {
    return zone.pricing?.[capacity] || 0;
  };

  // Get selected capacity info
  const getSelectedCapacityInfo = () => {
    return capacityOptions.find((option) => option.key === selectedCapacity);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div
          className="loading-container"
          style={{ padding: "100px 0", textAlign: "center" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p style={{ marginTop: "20px", color: "#666" }}>
            Loading transfer services...
          </p>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div>
      <Header />
      <BackToHomeButton />
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "80px 0",
          color: "white",
          textAlign: "center",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <i
                className="fa fa-plane"
                style={{ fontSize: "60px", marginBottom: "30px", opacity: 0.9 }}
              ></i>
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "700",
                  marginBottom: "20px",
                }}
              >
                Transfer Hizmetleri
              </h1>
              <p style={{ fontSize: "1.2rem", opacity: 0.9, lineHeight: 1.6 }}>
                Hedefinize profesyonel ve güvenilir transfer hizmetleri. Tüm
                yolcu kapasitelerine uygun, deneyimli şoförlerle donatılmış
                konforlu araçlar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Capacity Selection */}
      <section style={{ padding: "60px 0", backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: "50px" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "600",
                color: "#333",
                marginBottom: "15px",
              }}
            >
              Aracıınzı Seçin
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>
              Select the vehicle type that best fits your group size
            </p>
          </div>

          <div className="row">
            {capacityOptions.map((option) => (
              <div key={option.key} className="col-lg-4 col-md-6 mb-4">
                <div
                  className={`card h-100 ${
                    selectedCapacity === option.key
                      ? "border-primary bg-primary text-white"
                      : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border:
                      selectedCapacity === option.key
                        ? "3px solid #007bff"
                        : "1px solid #dee2e6",
                  }}
                  onClick={() => setSelectedCapacity(option.key)}
                >
                  <div
                    className="card-body text-center"
                    style={{ padding: "30px" }}
                  >
                    <div style={{ fontSize: "3rem", marginBottom: "20px" }}>
                      {option.icon}
                    </div>
                    <h5
                      className="card-title"
                      style={{ fontWeight: "600", marginBottom: "10px" }}
                    >
                      {option.label}
                    </h5>
                    <p
                      className="card-text"
                      style={{
                        opacity: selectedCapacity === option.key ? 0.9 : 0.7,
                        marginBottom: "15px",
                      }}
                    >
                      {option.description}
                    </p>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      <i className="fa fa-users"></i>
                      Maksimum {option.maxPassengers} Yolcu
                    </div>
                    {selectedCapacity === option.key && (
                      <div style={{ marginTop: "15px" }}>
                        <i
                          className="fa fa-check"
                          style={{ fontSize: "20px" }}
                        ></i>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transfer Zones & Pricing */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: "50px" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "600",
                color: "#333",
                marginBottom: "15px",
              }}
            >
              Güzergâhlar ve Fiyatlandırma
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>
              Pricing for {getSelectedCapacityInfo()?.label} -{" "}
              {getSelectedCapacityInfo()?.description}
            </p>
          </div>

          {error ? (
            <div className="alert alert-danger text-center">
              <h5>Unable to load transfer zones</h5>
              <p>{error}</p>
            </div>
          ) : zones.length === 0 ? (
            <div
              className="text-center"
              style={{ color: "#666", padding: "40px 0" }}
            >
              <i
                className="fa fa-car"
                style={{ fontSize: "60px", opacity: 0.3, marginBottom: "20px" }}
              ></i>
              <h5>No transfer zones available</h5>
              <p>
                Özel transfer düzenlemeleri için lütfen bizimle iletişime
                geçin..
              </p>
            </div>
          ) : (
            <div className="row">
              {zones.map((zone) => (
                <div key={zone.id} className="col-lg-6 col-md-6 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body" style={{ padding: "25px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "15px",
                        }}
                      >
                        <i
                          className="fa fa-map-marker"
                          style={{
                            fontSize: "24px",
                            color: "#007bff",
                            marginTop: "5px",
                            flexShrink: 0,
                          }}
                        ></i>
                        <div style={{ flex: 1 }}>
                          <h5
                            style={{
                              fontWeight: "600",
                              color: "#333",
                              marginBottom: "8px",
                            }}
                          >
                            {zone.zoneName}
                          </h5>
                          {zone.description && (
                            <p
                              style={{
                                color: "#666",
                                fontSize: "0.95rem",
                                marginBottom: "15px",
                              }}
                            >
                              {zone.description}
                            </p>
                          )}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              backgroundColor: "#f8f9fa",
                              padding: "15px",
                              borderRadius: "8px",
                            }}
                          >
                            <span style={{ color: "#666", fontSize: "0.9rem" }}>
                              {getSelectedCapacityInfo()?.label}
                            </span>
                            <span
                              style={{
                                fontSize: "1.5rem",
                                fontWeight: "700",
                                color: "#28a745",
                              }}
                            >
                              €{getPrice(zone, selectedCapacity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center" style={{ marginTop: "40px" }}>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              *Fiyatlar EUR cinsindendir ve KDV dahildir. Bekleme süresi, otoyol
              ücretleri veya özel talepler için ek ücret uygulanabilir.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "60px 0", backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: "50px" }}>
            <h2
              style={{ fontSize: "2.5rem", fontWeight: "600", color: "#333" }}
            >
              Neden Bizim Transfer Hizmetimizi Seçmelisiniz?{" "}
            </h2>
          </div>

          <div className="row">
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#007bff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    color: "white",
                  }}
                >
                  <i className="fa fa-car" style={{ fontSize: "30px" }}></i>
                </div>
                <h5
                  style={{
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  Profesyonel Sürücüler
                </h5>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Deneyimli, lisanslı, yerel güzergâhları bilen ve birden fazla
                  dil konuşabilen şoförler.{" "}
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#28a745",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    color: "white",
                  }}
                >
                  <i className="fa fa-check" style={{ fontSize: "30px" }}></i>
                </div>
                <h5
                  style={{
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  Güvenilir Servis
                </h5>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Gerçek zamanlı takip ve 7/24 müşteri desteği ile dakik alma ve
                  bırakma hizmeti..
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#ffc107",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    color: "white",
                  }}
                >
                  <i className="fa fa-users" style={{ fontSize: "30px" }}></i>
                </div>
                <h5
                  style={{
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  Comfortable Vehicles
                </h5>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Klimalı ve geniş iç mekâna sahip, modern, temiz ve bakımlı
                  araçlar.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#dc3545",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    color: "white",
                  }}
                >
                  <i className="fa fa-phone" style={{ fontSize: "30px" }}></i>
                </div>
                <h5
                  style={{
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  Kolay Rezervasyon
                </h5>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Kolay çevrimiçi rezervasyon süreci, anında onay ve esnek ödeme
                  seçenekleri.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center" style={{ marginBottom: "40px" }}>
                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "15px",
                  }}
                >
                  Transferinizi Rezerve Edin
                </h2>
                <p style={{ fontSize: "1.1rem", color: "#666" }}>
                  Bilgilerinizi doldurun ve WhatsApp üzerinden transfer
                  rezervasyonu yapın
                </p>
              </div>

              {contactFormSuccess ? (
                <div className="alert alert-success text-center">
                  <i
                    className="fa fa-whatsapp"
                    style={{
                      fontSize: "40px",
                      marginBottom: "15px",
                      color: "#25D366",
                    }}
                  ></i>
                  <h5>WhatsApp Açılıyor!</h5>
                  <p>
                    Transfer rezervasyon talebiniz hazırlandı. WhatsApp
                    üzerinden talebi gönderebilirsiniz.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setContactFormSuccess(false)}
                  >
                    Yeni Transfer Rezervasyonu
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleContactSubmit}
                  className="card"
                  style={{
                    padding: "30px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label
                        className="form-label"
                        style={{ fontWeight: "600", color: "#333" }}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={contactForm.name}
                        onChange={handleFormChange}
                        required
                        placeholder="Burak Yüce"
                        style={{ padding: "12px" }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label
                        className="form-label"
                        style={{ fontWeight: "600", color: "#333" }}
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={contactForm.email}
                        onChange={handleFormChange}
                        required
                        placeholder="user@example.com"
                        style={{ padding: "12px" }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label
                        className="form-label"
                        style={{ fontWeight: "600", color: "#333" }}
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={contactForm.phone}
                        onChange={handleFormChange}
                        required
                        placeholder="555 555 55 55"
                        style={{ padding: "12px" }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label
                        className="form-label"
                        style={{ fontWeight: "600", color: "#333" }}
                      >
                        Number of Passengers *
                      </label>
                      <select
                        name="passengers"
                        className="form-control"
                        value={contactForm.passengers}
                        onChange={handleFormChange}
                        required
                        style={{ padding: "12px" }}
                      >
                        {Array.from(
                          {
                            length:
                              getSelectedCapacityInfo()?.maxPassengers || 4,
                          },
                          (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} {i + 1 === 1 ? "passenger" : "passengers"}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label
                        className="form-label"
                        style={{ fontWeight: "600", color: "#333" }}
                      >
                        Pickup Location *
                      </label>
                      <input
                        type="text"
                        name="pickupLocation"
                        className="form-control"
                        value={contactForm.pickupLocation}
                        onChange={handleFormChange}
                        required
                        placeholder=""
                        style={{ padding: "12px" }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label
                        className="form-label"
                        style={{ fontWeight: "600", color: "#333" }}
                      >
                        Drop-off Location *
                      </label>
                      <input
                        type="text"
                        name="dropoffLocation"
                        className="form-control"
                        value={contactForm.dropoffLocation}
                        onChange={handleFormChange}
                        required
                        placeholder=""
                        style={{ padding: "12px" }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label
                        className="form-label"
                        style={{ fontWeight: "600", color: "#333" }}
                      >
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        value={contactForm.date}
                        onChange={handleFormChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        style={{ padding: "12px" }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label
                        className="form-label"
                        style={{ fontWeight: "600", color: "#333" }}
                      >
                        Time *
                      </label>
                      <input
                        type="time"
                        name="time"
                        className="form-control"
                        value={contactForm.time}
                        onChange={handleFormChange}
                        required
                        style={{ padding: "12px" }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      className="form-label"
                      style={{ fontWeight: "600", color: "#333" }}
                    >
                      Additional Information
                    </label>
                    <textarea
                      name="message"
                      className="form-control"
                      rows="4"
                      value={contactForm.message}
                      onChange={handleFormChange}
                      placeholder="Uçak saati, özel istekler, vb."
                      style={{ padding: "12px" }}
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn"
                      disabled={contactFormSubmitting}
                      style={{
                        padding: "12px 40px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        backgroundColor: "#25D366",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#128C7E")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#25D366")
                      }
                    >
                      {contactFormSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          WhatsApp Açılıyor...
                        </>
                      ) : (
                        <>
                          <i
                            className="fa fa-whatsapp"
                            style={{ marginRight: "8px" }}
                          ></i>
                          WhatsApp ile Transfer Rezervasyonu
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <FAQContactFooter />
    </div>
  );
};

export default TransferService;
