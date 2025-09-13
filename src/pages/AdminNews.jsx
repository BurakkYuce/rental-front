// src/pages/AdminNews.jsx - Admin News Management
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Search,
  Calendar,
  Clock,
  Filter,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { adminAPI } from "../services/api";
import AdminLayout from "../components/AdminLayout";
import "../assets/css/bootstrap.min.css";
import "../assets/css/plugins.css";
import "../assets/css/style.css";

const AdminNews = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    category: "",
    search: "",
  });

  // Categories from backend
  const categories = [
    "General",
    "Company News",
    "Industry News",
    "Product Updates",
    "Events",
    "Announcements",
    "Press Release",
    "Technology"
  ];

  // Load news
  useEffect(() => {
    loadNews();
  }, [filters]);

  // Handle navigation with refresh state (simplified)
  useEffect(() => {
    if (location.state?.refresh) {
      window.history.replaceState({}, document.title);
      setTimeout(() => loadNews(), 100); // Small delay to avoid conflicts
    }
  }, [location.state]);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.getNews(filters);
      console.log("✅ News data loaded:", response.data.data);
      // The API returns data as { success: true, data: { articles: [...], pagination: {...} } }
      setNews(response.data.data.articles || []);
      setPagination(response.data.data.pagination || {});
    } catch (error) {
      console.error("Failed to load news:", error);
      setError("Failed to load news articles");
    } finally {
      setLoading(false);
    }
  };

  // Filter handlers
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchQuery = formData.get("search");
    setFilters({ ...filters, search: searchQuery, page: 1 });
  };

  const handleStatusFilter = (status) => {
    setFilters({ ...filters, status: status === filters.status ? "" : status, page: 1 });
  };

  const handleCategoryFilter = (category) => {
    setFilters({ ...filters, category: category === filters.category ? "" : category, page: 1 });
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 10, status: "", category: "", search: "" });
  };

  // CRUD operations
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news article?")) return;
    
    try {
      await adminAPI.deleteNews(id);
      loadNews();
    } catch (error) {
      console.error("Failed to delete news:", error);
      alert("Failed to delete news article");
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      // Note: Add this API endpoint to your backend if it doesn't exist
      await adminAPI.toggleNewsFeatured(id);
      loadNews();
    } catch (error) {
      console.error("Failed to toggle featured:", error);
      alert("Failed to update featured status");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminAPI.updateNewsStatus(id, { status: newStatus });
      loadNews();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status badge styles
  const getStatusBadge = (status) => {
    const styles = {
      draft: { backgroundColor: "#6c757d", color: "white" },
      published: { backgroundColor: "#28a745", color: "white" },
      archived: { backgroundColor: "#dc3545", color: "white" },
    };
    return styles[status] || styles.draft;
  };

  // Pagination
  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  return (
    <AdminLayout
      title="News Management"
      subtitle="Create, edit, and manage news articles"
    >
      <div className="container" style={{ maxWidth: "none", width: "100%" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <button
              onClick={() => navigate("/admin/news/new")}
              style={{
                backgroundColor: "#1ECB15",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "0.75rem 1.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: "500",
              }}
            >
              <Plus size={18} />
              New News Article
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <div className="row align-items-end">
            <div className="col-md-4">
              <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "0.5rem" }}>Search</label>
              <form onSubmit={handleSearch}>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    name="search"
                    defaultValue={filters.search}
                    placeholder="Search news articles..."
                    style={{
                      width: "100%",
                      padding: "0.75rem 2.5rem 0.75rem 1rem",
                      border: "2px solid #e9ecef",
                      borderRadius: "6px",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      position: "absolute",
                      right: "0.5rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#666",
                    }}
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>
            </div>
            <div className="col-md-3">
              <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "0.5rem" }}>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e9ecef",
                  borderRadius: "6px",
                }}
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="col-md-3">
              <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "0.5rem" }}>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e9ecef",
                  borderRadius: "6px",
                }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button
                onClick={clearFilters}
                style={{
                  width: "100%",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.75rem",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* News List */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ marginTop: "1rem", color: "#666" }}>Loading news articles...</p>
            </div>
          ) : error ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#dc3545" }}>
              {error}
            </div>
          ) : news.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <h3 style={{ color: "#666" }}>No news articles found</h3>
              <p style={{ color: "#999" }}>Create your first news article to get started.</p>
              <button
                onClick={() => navigate("/admin/news/new")}
                style={{
                  backgroundColor: "#1ECB15",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                  marginTop: "1rem",
                }}
              >
                Create News Article
              </button>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover" style={{ margin: 0 }}>
                  <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                      <th style={{ border: "none", padding: "1rem", fontWeight: "600" }}>Title</th>
                      <th style={{ border: "none", padding: "1rem", fontWeight: "600" }}>Category</th>
                      <th style={{ border: "none", padding: "1rem", fontWeight: "600" }}>Status</th>
                      <th style={{ border: "none", padding: "1rem", fontWeight: "600" }}>Featured</th>
                      <th style={{ border: "none", padding: "1rem", fontWeight: "600" }}>Views</th>
                      <th style={{ border: "none", padding: "1rem", fontWeight: "600" }}>Created</th>
                      <th style={{ border: "none", padding: "1rem", fontWeight: "600", textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.map((article) => (
                      <tr key={article._id}>
                        <td style={{ padding: "1rem", verticalAlign: "middle" }}>
                          <div>
                            <h6 style={{ margin: 0, fontSize: "1rem", fontWeight: "600" }}>
                              {article.title}
                            </h6>
                            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#666", lineHeight: "1.3" }}>
                              {article.excerpt}
                            </p>
                          </div>
                        </td>
                        <td style={{ padding: "1rem", verticalAlign: "middle" }}>
                          <span style={{
                            backgroundColor: "#e9ecef",
                            color: "#495057",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "12px",
                            fontSize: "0.8rem",
                          }}>
                            {article.category}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", verticalAlign: "middle" }}>
                          <select
                            value={article.status}
                            onChange={(e) => handleStatusChange(article._id, e.target.value)}
                            style={{
                              ...getStatusBadge(article.status),
                              border: "none",
                              borderRadius: "12px",
                              padding: "0.25rem 0.75rem",
                              fontSize: "0.8rem",
                              cursor: "pointer",
                            }}
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td style={{ padding: "1rem", verticalAlign: "middle" }}>
                          <button
                            onClick={() => handleToggleFeatured(article._id)}
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              cursor: "pointer",
                              color: article.featured ? "#ffc107" : "#dee2e6",
                            }}
                          >
                            <Star size={18} fill={article.featured ? "currentColor" : "none"} />
                          </button>
                        </td>
                        <td style={{ padding: "1rem", verticalAlign: "middle", fontSize: "0.85rem", color: "#666" }}>
                          {article.views || 0}
                        </td>
                        <td style={{ padding: "1rem", verticalAlign: "middle", fontSize: "0.85rem", color: "#666" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <Calendar size={14} />
                            {formatDate(article.createdAt)}
                          </div>
                        </td>
                        <td style={{ padding: "1rem", verticalAlign: "middle", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                            <Link
                              to={`/news/${article.slug}`}
                              target="_blank"
                              style={{
                                backgroundColor: "#17a2b8",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "0.5rem",
                                cursor: "pointer",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                              }}
                              title="View Article"
                            >
                              <Eye size={14} />
                            </Link>
                            <button
                              onClick={() => navigate(`/admin/news/edit/${article._id}`)}
                              style={{
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "0.5rem",
                                cursor: "pointer",
                              }}
                              title="Edit Article"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(article._id)}
                              style={{
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "0.5rem",
                                cursor: "pointer",
                              }}
                              title="Delete Article"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div style={{ padding: "1rem", borderTop: "1px solid #e9ecef", display: "flex", justifyContent: "center" }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    {pagination.hasPrev && (
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #dee2e6",
                          borderRadius: "4px",
                          padding: "0.5rem 1rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>
                    )}
                    
                    <span style={{ padding: "0.5rem 1rem", color: "#666", fontSize: "0.9rem" }}>
                      Page {pagination.page} of {pagination.totalPages}
                    </span>

                    {pagination.hasNext && (
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #dee2e6",
                          borderRadius: "4px",
                          padding: "0.5rem 1rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNews;