// src/pages/Admin.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Car,
  Calendar,
  Settings,
  BarChart3,
  FileText,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  LogOut,
  ToggleLeft,
  ToggleRight,
  Truck,
} from "lucide-react";
import { adminAPI, authAPI, blogAPI } from "../services/api";
import "../assets/css/plugins.css";
import "../assets/css/style.css";

const Admin = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "view", "delete"
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for real data from API
  const [cars, setCars] = useState([]);
  
  const [blogs, setBlogs] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loadingStates, setLoadingStates] = useState({
    dashboard: false,
    cars: false,
    bookings: false,
    blogs: false,
  });

  const sidebarItems = [
    { id: "dashboard", label: "Kontrol Paneli", icon: BarChart3 },
    { id: "cars", label: "Araç Yönetimi", icon: Car },
    {
      id: "bookings",
      label: "Rezervasyonlar",
      icon: Calendar,
      route: "/admin/bookings",
    },
    {
      id: "blog",
      label: "Blog Yönetimi",
      icon: FileText,
      route: "/admin/blog",
    },
    {
      id: "transfers",
      label: "Transfer Bölgeleri",
      icon: Truck,
      route: "/admin/transfer-zones",
    },
  ];

  const loadDashboardData = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, dashboard: true }));
      setError(""); // Clear any previous errors
      const response = await adminAPI.getDashboardStats();
      setDashboardStats(response.data.data);
    } catch (error) {
      console.error("❌ Kontrol paneli istatistikleri yüklenemedi:", error);
      setError("Kontrol paneli istatistikleri yüklenemedi.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, dashboard: false }));
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadInitialData = async () => {
    setLoading(true);
    try {
      await loadDashboardData();
    } catch (error) {
      console.error("İlk veriler yüklenemedi:", error);
      setError("Veriler yüklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  // Load data from API on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load data when section changes
  useEffect(() => {
    switch (activeSection) {
      case "dashboard":
        loadDashboardData();
        break;
      case "cars":
        loadCarsData();
        break;
      case "blog":
        loadBlogsData();
        break;
    }
  }, [activeSection, loadDashboardData]);

  // Simple refresh handler for navigation state
  useEffect(() => {
    if (location.state?.refresh) {
      window.history.replaceState({}, document.title);

      if (location.state?.section) {
        setActiveSection(location.state.section);
      } else {
        // Just reload current section
        switch (activeSection) {
          case "dashboard":
            loadDashboardData();
            break;
          case "cars":
            loadCarsData();
            break;
          case "blog":
            loadBlogsData();
            break;
        }
      }
    }
  }, [activeSection, loadDashboardData, location.state]);

  const loadCarsData = async () => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors
      const response = await adminAPI.getCars();
      // The API returns { success: true, data: { cars: [...] } }
      setCars(response.data.data?.cars || []);
    } catch (error) {
      console.error("❌ Araçlar yüklenemedi:", error);
      setError("Araç verileri yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const loadBlogsData = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, blogs: true }));
      const response = await adminAPI.getBlogPosts();
      console.log(
        "📝 Tam yanıt yapısı:",
        JSON.stringify(response.data, null, 2)
      );

      // Handle different possible response structures
      let blogsData = [];
      if (response.data.success && response.data.data) {
        blogsData = response.data.data.blogs || response.data.data || [];
      } else if (response.data.blogs) {
        blogsData = response.data.blogs;
      } else if (Array.isArray(response.data)) {
        blogsData = response.data;
      }

      setBlogs(blogsData);
    } catch (error) {
      console.error("Bloglar yüklenemedi:", error);
      console.error("Hata detayları:", error.response?.data || error.message);
      setError("Blog verileri yüklenemedi.");

      // Fallback: try to load from public API
      try {
        const fallbackResponse = await blogAPI.getBlogs();
        const fallbackBlogs = fallbackResponse.data.data.blogs || [];
        setBlogs(fallbackBlogs);
      } catch (fallbackError) {
        console.error("Yedek yükleme de başarısız:", fallbackError);
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, blogs: false }));
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate("/");
  };

  // Modal Functions
  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setSelectedItem(null);
    setError("");
  };

  const handleDelete = async () => {
    const itemType = activeSection === "cars" ? "aracı" : 
                     activeSection === "blog" ? "blog yazısını" : "öğeyi";
    
    if (
      !window.confirm(
        `Bu ${itemType} silmek istediğinizden emin misiniz?`
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (activeSection === "cars") {
        await adminAPI.deleteCar(selectedItem._id || selectedItem.id);
        await loadCarsData();
      } else if (activeSection === "blog") {
        await adminAPI.deleteBlogPost(selectedItem.id);
        await loadBlogsData();
      }

      closeModal();
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
      setError(error.response?.data?.error || "Öğe silinemedi.");
    } finally {
      setLoading(false);
    }
  };

  // Dashboard Component
  const DashboardSection = () => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ margin: 0, color: "#333" }}>Kontrol Paneli Özeti</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <Bell size={24} color="#666" style={{ cursor: "pointer" }} />
          <Settings size={24} color="#666" style={{ cursor: "pointer" }} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-4">
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <Car size={32} color="#1ECB15" style={{ marginBottom: "15px" }} />
            <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>
              {dashboardStats.totalCars || 0}
            </h3>
            <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
              Toplam Araç
            </p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <Calendar
              size={32}
              color="#ff6b35"
              style={{ marginBottom: "15px" }}
            />
            <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>
              {dashboardStats.totalBookings || 0}
            </h3>
            <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
              Toplam Rezervasyon
            </p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <FileText
              size={32}
              color="#17a2b8"
              style={{ marginBottom: "15px" }}
            />
            <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>
              {dashboardStats.activeCars || 0}
            </h3>
            <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
              Aktif Araç
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col-lg-6">
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              width: "100%",
              minWidth: "100%",
              maxWidth: "1600px",
              minHeight: "450px",
              margin: "0 auto",
            }}
          >
            <h4 style={{ marginBottom: "20px", color: "#333" }}>
              Müsait Araçlar
            </h4>
            {cars
              .filter(
                (car) => car.status === "active" || car.available_units > 0
              )
              .slice(0, 5)
              .map((car) => (
                <div
                  key={car._id || car.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #f1f1f1",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", color: "#333" }}>
                      {car.title || car.name}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
                      {car.brand} {car.model} - {car.year}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{ margin: 0, fontWeight: "600", color: "#1ECB15" }}
                    >
                      {car.pricing?.daily || car.dailyRate
                        ? `${car.pricing?.daily || car.dailyRate} ${
                            car.currency || "EUR"
                          }/gün`
                        : "Fiyat belirlenmemiş"}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
                      {car.available_units || 1} müsait
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Cars Management Component
  const CarsSection = () => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#333" }}>Araç Yönetimi</h2>
          <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
            Araç filonuzu ve envanterinizi yönetin
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/editCar")}
          style={{
            backgroundColor: "#1ECB15",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          <Plus size={20} />
          Yeni Araç Ekle
        </button>
      </div>

      {/* Cars Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 150px 120px 100px 150px 120px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            fontWeight: "600",
            color: "#333",
            borderBottom: "2px solid #e9ecef",
          }}
        >
          <div>Araç Detayları</div>
          <div>Kategori</div>
          <div>Durum</div>
          <div>Adet</div>
          <div>Günlük Fiyat</div>
          <div>İşlemler</div>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            Araçlar yükleniyor...
          </div>
        ) : cars.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            Araç bulunamadı. Başlamak için ilk aracınızı ekleyin.
          </div>
        ) : (
          cars.map((car) => (
            <div
              key={car._id || car.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 150px 120px 100px 150px 120px",
                padding: "20px",
                borderBottom: "1px solid #f1f1f1",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <img
                  src={car.mainImage?.url || car.image}
                  alt={car.title || car.name}
                  style={{
                    width: "50px",
                    height: "35px",
                    borderRadius: "6px",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: "600", color: "#333" }}>
                    {car.title || car.name}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
                    {car.brand} {car.model} ({car.year})
                  </p>
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.9rem", color: "#666" }}>
                  {car.category || car.type}
                </span>
              </div>

              <div>
                <span style={{ fontSize: "0.9rem", color: "#333" }}>
                  {car.available_units || 1}/{car.total_units || 1}
                </span>
              </div>

              <div>
                <span style={{ fontWeight: "600", color: "#1ECB15" }}>
                  {car.pricing?.daily || car.dailyRate
                    ? `${car.pricing?.daily || car.dailyRate} ${
                        car.currency || "EUR"
                      }`
                    : "Fiyat yok"}
                </span>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() =>
                    navigate(`/admin/editCar?id=${car._id || car.id}`)
                  }
                  style={{
                    padding: "6px",
                    backgroundColor: "#ffa500",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  title="Düzenle"
                >
                  <Edit size={14} />
                </button>

                <button
                  onClick={() => openModal("delete", car)}
                  style={{
                    padding: "6px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  title="Sil"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Modal Component
  const Modal = () => {
    if (!showModal) return null;

    const getModalTitle = () => {
      const sectionName = activeSection === "cars" ? "araç" : 
                         activeSection === "blog" ? "blog yazısı" : "öğe";
      return modalType === "view" ? `${sectionName} Görüntüle` : `${sectionName} Sil`;
    };

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <h4 style={{ margin: 0, color: "#333" }}>
              {getModalTitle()}
            </h4>
            <button
              onClick={closeModal}
              style={{
                padding: "5px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X size={20} color="#666" />
            </button>
          </div>

          {error && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#f8d7da",
                color: "#721c24",
                borderRadius: "6px",
                marginBottom: "20px",
                border: "1px solid #f5c6cb",
              }}
            >
              {error}
            </div>
          )}

          {modalType === "delete" ? (
            <div>
              <p style={{ marginBottom: "25px", color: "#666" }}>
                Bu {activeSection === "cars" ? "aracı" : 
                     activeSection === "blog" ? "blog yazısını" : "öğeyi"} silmek istediğinizden emin misiniz? 
                Bu işlem geri alınamaz.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  onClick={closeModal}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  İptal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Siliniyor..." : "Sil"}
                </button>
              </div>
            </div>
          ) : activeSection === "blog" &&
            modalType === "view" &&
            selectedItem ? (
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
                  {selectedItem.title}
                </h3>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    marginBottom: "15px",
                  }}
                >
                  <span>
                    <strong>Kategori:</strong>{" "}
                    {selectedItem.category || "Kategorisiz"}
                  </span>
                  <span style={{ margin: "0 15px" }}>•</span>
                  <span>
                    <strong>Durum:</strong>
                    <span
                      style={{
                        backgroundColor:
                          selectedItem.status === "published"
                            ? "#28a745"
                            : selectedItem.status === "draft"
                            ? "#ffc107"
                            : "#6c757d",
                        color: "white",
                        padding: "2px 6px",
                        borderRadius: "3px",
                        fontSize: "0.8rem",
                        marginLeft: "5px",
                        textTransform: "capitalize",
                      }}
                    >
                      {selectedItem.status === "published" ? "Yayında" :
                       selectedItem.status === "draft" ? "Taslak" : selectedItem.status}
                    </span>
                  </span>
                  <span style={{ margin: "0 15px" }}>•</span>
                  <span>
                    <strong>Yazar:</strong> {selectedItem.author}
                  </span>
                </div>
                {selectedItem.excerpt && (
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "15px",
                      borderRadius: "6px",
                      marginBottom: "20px",
                      fontStyle: "italic",
                      color: "#666",
                    }}
                  >
                    {selectedItem.excerpt}
                  </div>
                )}
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <strong style={{ color: "#666", fontSize: "0.9rem" }}>
                      Etiketler:{" "}
                    </strong>
                    {selectedItem.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "#e9ecef",
                          color: "#495057",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "0.8rem",
                          marginRight: "8px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div
                  style={{
                    border: "1px solid #e9ecef",
                    borderRadius: "6px",
                    padding: "20px",
                    backgroundColor: "#fff",
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedItem.content }}
                />
              </div>
            </div>
          ) : (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#666" }}
            >
              {activeSection} {modalType} içeriği yakında gelecek...
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />;
      case "cars":
        return <CarsSection />;
      case "blog":
        return (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >
              <div>
                <h2 style={{ margin: 0, color: "#333" }}>Blog Yönetimi</h2>
                <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                  Blog yazılarınızı ve içeriklerinizi yönetin
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/create-blog")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                <Plus size={16} />
                Yeni Blog Yazısı
              </button>
            </div>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 120px",
                  padding: "20px",
                  backgroundColor: "#f8f9fa",
                  fontWeight: "600",
                  color: "#333",
                  borderBottom: "2px solid #e9ecef",
                }}
              >
                <div>Başlık</div>
                <div>Kategori</div>
                <div>Durum</div>
                <div>Oluşturulma</div>
                <div>İşlemler</div>
              </div>

              {loadingStates.blogs ? (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Bloglar yükleniyor...
                </div>
              ) : blogs.length === 0 ? (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  <FileText
                    size={48}
                    color="#ccc"
                    style={{ marginBottom: "20px" }}
                  />
                  <h3>Blog Yazısı Bulunamadı</h3>
                  <p>İlk blog yazınızı oluşturarak başlayın.</p>
                </div>
              ) : (
                blogs.map((blog) => (
                  <div
                    key={blog.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr 1fr 120px",
                      padding: "20px",
                      borderBottom: "1px solid #e9ecef",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "500",
                          color: "#333",
                          marginBottom: "4px",
                        }}
                      >
                        {blog.title}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>
                        {blog.excerpt || "Açıklama mevcut değil"}
                      </div>
                    </div>
                    <div style={{ color: "#666" }}>
                      {blog.category || "Kategorisiz"}
                    </div>
                    <div>
                      <span
                        style={{
                          backgroundColor:
                            blog.status === "published"
                              ? "#28a745"
                              : blog.status === "draft"
                              ? "#ffc107"
                              : "#6c757d",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          textTransform: "capitalize",
                        }}
                      >
                        {blog.status === "published" ? "Yayında" :
                         blog.status === "draft" ? "Taslak" : blog.status}
                      </span>
                    </div>
                    <div style={{ color: "#666", fontSize: "0.9rem" }}>
                      {new Date(
                        blog.created_at || blog.createdAt
                      ).toLocaleDateString("tr-TR")}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => {
                          setSelectedItem(blog);
                          setModalType("view");
                          setShowModal(true);
                        }}
                        style={{
                          padding: "6px",
                          border: "none",
                          borderRadius: "4px",
                          backgroundColor: "#17a2b8",
                          color: "white",
                          cursor: "pointer",
                        }}
                        title="Görüntüle"
                      >
                        <FileText size={14} />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/edit-blog/${blog.id}`)}
                        style={{
                          padding: "6px",
                          border: "none",
                          borderRadius: "4px",
                          backgroundColor: "#28a745",
                          color: "white",
                          cursor: "pointer",
                        }}
                        title="Düzenle"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(blog);
                          setModalType("delete");
                          setShowModal(true);
                        }}
                        style={{
                          padding: "6px",
                          border: "none",
                          borderRadius: "4px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          cursor: "pointer",
                        }}
                        title="Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            <Settings size={48} color="#ccc" style={{ marginBottom: "20px" }} />
            <h3>Yakında Gelecek</h3>
            <p>Bu bölüm geliştirme aşamasında...</p>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          backgroundColor: "white",
          boxShadow: "2px 0 4px rgba(0, 0, 0, 0.1)",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "30px 20px",
            borderBottom: "2px solid #f1f1f1",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: 0, color: "#1ECB15", fontWeight: "bold" }}>
            Yönetim Paneli
          </h3>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "20px 0" }}>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.route) {
                  navigate(item.route);
                } else {
                  setActiveSection(item.id);

                  // Log section navigation for analytics
                  if (window.localStorage.getItem("admin_token")) {
                    try {
                      fetch("/api/admin/log-navigation", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem(
                            "admin_token"
                          )}`,
                        },
                        body: JSON.stringify({
                          section: item.id,
                          timestamp: new Date().toISOString(),
                        }),
                      }).catch((err) =>
                        console.log("Navigation logging failed:", err)
                      );
                    } catch (err) {
                      console.log("Navigation logging error:", err);
                    }
                  }
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "15px 20px",
                backgroundColor:
                  activeSection === item.id ? "#1ECB1515" : "transparent",
                color: activeSection === item.id ? "#1ECB15" : "#666",
                border: "none",
                borderRight:
                  activeSection === item.id ? "3px solid #1ECB15" : "none",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: activeSection === item.id ? "600" : "400",
                textAlign: "left",
                transition: "all 0.3s ease",
              }}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            width: "100%",
            padding: "0 20px",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              width: "100%",
              padding: "15px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            <LogOut size={20} />
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: "250px",
          width: "calc(100% - 250px)",
          padding: "30px",
        }}
      >
        {renderContent()}
      </div>

      {/* Modal */}
      <Modal />
    </div>
  );
};

export default Admin;