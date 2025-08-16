// src/components/AdminLayout.jsx - Reusable Admin Layout with Sidebar
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Car,
  Calendar,
  Settings,
  BarChart3,
  FileText,
  LogOut,
  MapPin,
} from "lucide-react";
import { authAPI } from "../services/api";
import "../assets/css/bootstrap.min.css";
import "../assets/css/plugins.css";
import "../assets/css/style.css";

const AdminLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, route: "/admin" },
    { id: "cars", label: "Cars Management", icon: Car, route: "/admin" },
    { id: "bookings", label: "Bookings", icon: Calendar, route: "/admin/bookings" },
    { id: "transfer-zones", label: "Transfer Zones", icon: MapPin, route: "/admin/transfer-zones" },
    { id: "blog", label: "Blog Management", icon: FileText, route: "/admin/blog" },
    { id: "reports", label: "Reports", icon: FileText, route: "/admin" },
    { id: "settings", label: "Settings", icon: Settings, route: "/admin" },
  ];

  const handleLogout = () => {
    authAPI.logout();
    navigate("/");
  };

  const isActiveRoute = (route) => {
    if (route === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(route);
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
              onClick={() => navigate(item.route)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "15px 20px",
                backgroundColor: isActiveRoute(item.route)
                  ? "#1ECB1515"
                  : "transparent",
                color: isActiveRoute(item.route) ? "#1ECB15" : "#666",
                border: "none",
                borderRight: isActiveRoute(item.route)
                  ? "3px solid #1ECB15"
                  : "none",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: isActiveRoute(item.route) ? "600" : "400",
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
        {/* Page Header */}
        {title && (
          <div
            style={{
              marginBottom: "30px",
              paddingBottom: "20px",
              borderBottom: "2px solid #f1f1f1",
            }}
          >
            <h1 style={{ margin: "0 0 5px 0", color: "#333", fontSize: "2rem" }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ margin: 0, color: "#666", fontSize: "1rem" }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;