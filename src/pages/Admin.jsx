// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
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
  Eye,
  X,
  Save,
  LogOut,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { adminAPI, authAPI, blogAPI } from "../services/api";
import "../assets/css/bootstrap.min.css";
import "../assets/css/plugins.css";
import "../assets/css/style.css";

const Admin = () => {
  console.log("🏠 Admin component mounted");
  console.log("🏠 Admin current location:", window.location.pathname);
  console.log("🏠 Admin token exists:", !!localStorage.getItem("admin_token"));
  console.log("🏠 Admin mount timestamp:", new Date().toLocaleTimeString());

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
  const [bookings, setBookings] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loadingStates, setLoadingStates] = useState({
    dashboard: false,
    cars: false,
    bookings: false,
    blogs: false,
  });

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "cars", label: "Cars Management", icon: Car },
    { id: "bookings", label: "Bookings", icon: Calendar },
    {
      id: "blog",
      label: "Blog Management",
      icon: FileText,
      route: "/admin/blog",
    },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

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
      case "bookings":
        loadBookingsData();
        break;
      case "blog":
        loadBlogsData();
        break;
    }
  }, [activeSection]);

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
          case "bookings":
            loadBookingsData();
            break;
          case "blog":
            loadBlogsData();
            break;
        }
      }
    }
  }, [location.state]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await loadDashboardData();
    } catch (error) {
      console.error("Failed to load initial data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    if (loadingStates.dashboard) {
      console.log("⏳ Dashboard already loading, skipping...");
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, dashboard: true }));
      setError(""); // Clear any previous errors
      console.log("🔄 Loading dashboard data...");
      const response = await adminAPI.getDashboardStats();
      console.log("✅ Dashboard data loaded:", response.data.data);
      setDashboardStats(response.data.data);
    } catch (error) {
      console.error("❌ Failed to load dashboard stats:", error);
      setError("Failed to load dashboard statistics.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, dashboard: false }));
    }
  };

  const loadCarsData = async () => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors
      console.log("🔄 Loading cars data...");
      const response = await adminAPI.getCars();
      console.log("✅ Cars data loaded:", response.data);
      // The API returns { success: true, data: { cars: [...] } }
      setCars(response.data.data?.cars || []);
    } catch (error) {
      console.error("❌ Failed to load cars:", error);
      setError("Failed to load cars data.");
    } finally {
      setLoading(false);
    }
  };

  const loadBookingsData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBookings();
      setBookings(response.data.data.bookings || []);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setError("Failed to load bookings data.");
    } finally {
      setLoading(false);
    }
  };

  const loadBlogsData = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, blogs: true }));
      const response = await adminAPI.getBlogPosts();
      console.log("📝 Admin blogs response:", response);
      console.log(
        "📝 Full response structure:",
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

      console.log("📝 Extracted blogs data:", blogsData);
      setBlogs(blogsData);
    } catch (error) {
      console.error("Failed to load blogs:", error);
      console.error("Error details:", error.response?.data || error.message);
      setError("Failed to load blogs data.");

      // Fallback: try to load from public API
      try {
        console.log("📝 Trying fallback to public blogs API...");
        const fallbackResponse = await blogAPI.getBlogs();
        const fallbackBlogs = fallbackResponse.data.data.blogs || [];
        console.log("📝 Fallback blogs:", fallbackBlogs);
        setBlogs(fallbackBlogs);
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, blogs: false }));
    }
  };

  const toggleCarStatus = async (carId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      // Call API to update car status
      await adminAPI.updateCarStatus(carId, newStatus);

      // Update local state
      setCars((prevCars) =>
        prevCars.map((car) =>
          car.id === carId ? { ...car, status: newStatus } : car
        )
      );

      console.log(`✅ Car status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to toggle car status:", error);
      setError("Failed to update car status.");
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate("/");
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "available":
        return "#1ECB15";
      case "active":
        return "#1ECB15";
      case "rented":
        return "#ff6b35";
      case "maintenance":
        return "#ffa500";
      case "completed":
        return "#6c757d";
      case "pending":
        return "#17a2b8";
      case "inactive":
        return "#dc3545";
      case "out of service":
        return "#dc3545";
      default:
        return "#6c757d";
    }
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
    if (
      !window.confirm(
        `Are you sure you want to delete this ${activeSection.slice(0, -1)}?`
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
      } else if (activeSection === "bookings") {
        await adminAPI.deleteBooking(selectedItem._id || selectedItem.id);
        await loadBookingsData();
      } else if (activeSection === "blog") {
        await adminAPI.deleteBlogPost(selectedItem.id);
        await loadBlogsData();
      }

      closeModal();
    } catch (error) {
      console.error("Delete failed:", error);
      setError(error.response?.data?.error || "Failed to delete item.");
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
        <h2 style={{ margin: 0, color: "#333" }}>Dashboard Overview</h2>
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
              Total Cars
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
              Total Bookings
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
            <BarChart3
              size={32}
              color="#ffa500"
              style={{ marginBottom: "15px" }}
            />
            <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>
              ${dashboardStats.totalRevenue || 0}
            </h3>
            <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
              Total Revenue
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
              Active Cars
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
              height: "400px",
            }}
          >
            <h4 style={{ marginBottom: "20px", color: "#333" }}>
              Recent Bookings
            </h4>
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking._id || booking.id}
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
                    {booking.customerName || booking.customer?.name}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
                    {booking.carName || booking.car?.title}
                  </p>
                </div>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.8rem",
                    backgroundColor: `${getStatusColor(booking.status)}20`,
                    color: getStatusColor(booking.status),
                  }}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-6">
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              height: "400px",
            }}
          >
            <h4 style={{ marginBottom: "20px", color: "#333" }}>
              Available Cars
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
                          }/day`
                        : "Price not set"}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
                      {car.available_units || 1} available
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
          <h2 style={{ margin: 0, color: "#333" }}>Cars Management</h2>
          <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
            Manage your car fleet and inventory
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
          Add New Car
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
          <div>Car Details</div>
          <div>Category</div>
          <div>Status</div>
          <div>Units</div>
          <div>Daily Rate</div>
          <div>Actions</div>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            Loading cars...
          </div>
        ) : cars.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            No cars found. Add your first car to get started.
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
                  src={
                    car.mainImage?.url ||
                    car.image ||
                    "/images/cars/default.jpg"
                  }
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
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.8rem",
                    backgroundColor:
                      car.status === "active" ? "#1ECB1520" : "#dc354520",
                    color: car.status === "active" ? "#1ECB15" : "#dc3545",
                  }}
                >
                  {car.status === "active" ? "Active" : "Inactive"}
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
                    : "No price"}
                </span>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => openModal("view", car)}
                  style={{
                    padding: "6px",
                    backgroundColor: "#17a2b8",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  <Eye size={14} />
                </button>
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
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => toggleCarStatus(car.id, car.status)}
                  style={{
                    padding: "6px",
                    backgroundColor:
                      car.status === "active" ? "#dc3545" : "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  title={
                    car.status === "active" ? "Deactivate car" : "Activate car"
                  }
                >
                  {car.status === "active" ? (
                    <ToggleLeft size={14} />
                  ) : (
                    <ToggleRight size={14} />
                  )}
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
              {modalType === "view"
                ? `View ${activeSection.slice(0, -1)}`
                : `Delete ${activeSection.slice(0, -1)}`}
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
                Are you sure you want to delete this{" "}
                {activeSection.slice(0, -1)}? This action cannot be undone.
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
                  Cancel
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
                  {loading ? "Deleting..." : "Delete"}
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
                    <strong>Category:</strong>{" "}
                    {selectedItem.category || "Uncategorized"}
                  </span>
                  <span style={{ margin: "0 15px" }}>•</span>
                  <span>
                    <strong>Status:</strong>
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
                      {selectedItem.status}
                    </span>
                  </span>
                  <span style={{ margin: "0 15px" }}>•</span>
                  <span>
                    <strong>Author:</strong> {selectedItem.author}
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
                      Tags:{" "}
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
              Content for {activeSection} {modalType} modal coming soon...
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
      case "bookings":
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
                <h2 style={{ margin: 0, color: "#333" }}>
                  Bookings Management
                </h2>
                <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                  Manage customer bookings and reservations
                </p>
              </div>
            </div>

            {/* Bookings Table */}
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
                  gridTemplateColumns: "1fr 1fr 1fr 1fr 120px",
                  padding: "20px",
                  backgroundColor: "#f8f9fa",
                  fontWeight: "600",
                  color: "#333",
                  borderBottom: "2px solid #e9ecef",
                }}
              >
                <div>Customer</div>
                <div>Car</div>
                <div>Dates</div>
                <div>Amount</div>
                <div>Status</div>
              </div>

              {loading ? (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Loading bookings...
                </div>
              ) : bookings.length === 0 ? (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  <Calendar
                    size={48}
                    color="#ccc"
                    style={{ marginBottom: "20px" }}
                  />
                  <h4>No bookings found</h4>
                  <p>When customers make bookings, they will appear here.</p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking._id || booking.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr 120px",
                      padding: "20px",
                      borderBottom: "1px solid #f1f1f1",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p
                        style={{ margin: 0, fontWeight: "600", color: "#333" }}
                      >
                        {booking.customerName ||
                          booking.customer?.name ||
                          "N/A"}
                      </p>
                      <p
                        style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}
                      >
                        {booking.customerEmail || booking.customer?.email || ""}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, color: "#333" }}>
                        {booking.carName || booking.car?.title || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, color: "#333" }}>
                        {booking.startDate || "N/A"} -{" "}
                        {booking.endDate || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "600",
                          color: "#1ECB15",
                        }}
                      >
                        ${booking.totalAmount || booking.amount || 0}
                      </p>
                    </div>
                    <div>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "0.8rem",
                          backgroundColor: `${getStatusColor(
                            booking.status
                          )}20`,
                          color: getStatusColor(booking.status),
                        }}
                      >
                        {booking.status || "pending"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
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
                <h2 style={{ margin: 0, color: "#333" }}>Blog Management</h2>
                <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                  Manage your blog posts and content
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
                New Blog Post
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
                <div>Title</div>
                <div>Category</div>
                <div>Status</div>
                <div>Created</div>
                <div>Actions</div>
              </div>

              {loadingStates.blogs ? (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Loading blogs...
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
                  <h3>No Blog Posts Found</h3>
                  <p>Start by creating your first blog post.</p>
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
                        {blog.excerpt || "No excerpt available"}
                      </div>
                    </div>
                    <div style={{ color: "#666" }}>
                      {blog.category || "Uncategorized"}
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
                        {blog.status}
                      </span>
                    </div>
                    <div style={{ color: "#666", fontSize: "0.9rem" }}>
                      {new Date(
                        blog.created_at || blog.createdAt
                      ).toLocaleDateString()}
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
                      >
                        <Eye size={14} />
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
            <h3>Coming Soon</h3>
            <p>This section is under development...</p>
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
            Admin Panel
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
                  console.log(`🔄 Switching to section: ${item.id}`);
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
            Logout
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
