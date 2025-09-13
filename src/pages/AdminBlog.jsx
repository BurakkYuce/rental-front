// src/pages/AdminBlog.jsx - Fixed Version
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Search,
  Calendar,
  Filter,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
} from "lucide-react";
import { adminAPI } from "../services/api";
import AdminLayout from "../components/AdminLayout";
import "./AdminBlog.css";

const AdminBlog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRefs = useRef([]); // FIXED: Memory leak prevention

  // State
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    tag: "",
    search: "",
  });

  // FIXED: Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  // FIXED: Better timeout management
  const setTimedMessage = useCallback((setter, message, duration = 5000) => {
    setter(message);
    const timeout = setTimeout(() => setter(""), duration);
    timeoutRefs.current.push(timeout);
  }, []);

  // Load blogs
  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔄 Loading blogs with filters:", filters);
      const response = await adminAPI.getBlogPosts(filters);

      // FIXED: Simplified response handling
      console.log("📦 Full API Response:", response);
      console.log("📦 Response.data:", response?.data);
      
      let blogData, paginationData;
      
      // Check if response.data has the expected structure
      if (response?.data?.success && response.data.data) {
        // Backend returns { success: true, data: { blogs: [...], pagination: {...} } }
        blogData = response.data.data.blogs || [];
        paginationData = response.data.data.pagination || {};
      } else if (response?.data?.blogs) {
        // Direct structure: { blogs: [...], pagination: {...} }
        blogData = response.data.blogs || [];
        paginationData = response.data.pagination || {};
      } else if (Array.isArray(response?.data)) {
        // Array response
        blogData = response.data;
        paginationData = {};
      } else {
        console.error("❌ Unexpected response structure:", response);
        throw new Error("Invalid response structure");
      }

      console.log("✅ Blogs loaded:", blogData);
      setBlogs(Array.isArray(blogData) ? blogData : []);
      setPagination(paginationData);
    } catch (error) {
      console.error("❌ Failed to load blogs:", error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load blog posts"
      );
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  // Handle navigation with refresh state
  useEffect(() => {
    if (location.state?.refresh) {
      if (location.state?.message) {
        setTimedMessage(setSuccess, location.state.message);
      }
      // Clear the state to prevent repeated refreshes
      window.history.replaceState({}, document.title);
      loadBlogs();
    }
  }, [location.state, loadBlogs, setTimedMessage]);

  // Filter handlers
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchQuery = formData.get("search")?.trim() || "";
    setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }));
  }, []);

  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value === prev[field] ? "" : value,
      page: 1,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ page: 1, limit: 10, status: "", tag: "", search: "" });
  }, []);

  // CRUD operations
  const handleDelete = useCallback(
    async (id, title) => {
      if (
        !window.confirm(
          `Are you sure you want to delete "${title}"? This action cannot be undone.`
        )
      ) {
        return;
      }

      try {
        console.log("🗑️ Deleting blog:", id);
        await adminAPI.deleteBlogPost(id);
        setTimedMessage(setSuccess, "Blog post deleted successfully!", 3000);
        loadBlogs();
      } catch (error) {
        console.error("❌ Failed to delete blog:", error);
        setTimedMessage(
          setError,
          error.response?.data?.message || "Failed to delete blog post",
          3000
        );
      }
    },
    [loadBlogs, setTimedMessage]
  );

  // FIXED: Handle missing API functions gracefully
  const handleToggleFeatured = useCallback(
    async (id, currentFeatured) => {
      try {
        console.log("⭐ Toggling featured for blog:", id);

        // Check if the API function exists
        if (typeof adminAPI.toggleBlogFeatured === "function") {
          await adminAPI.toggleBlogFeatured(id);
        } else {
          // Fallback to update API
          await adminAPI.updateBlogPost(id, { featured: !currentFeatured });
        }

        setTimedMessage(
          setSuccess,
          `Blog post ${
            currentFeatured ? "removed from" : "added to"
          } featured!`,
          3000
        );
        loadBlogs();
      } catch (error) {
        console.error("❌ Failed to toggle featured:", error);
        setTimedMessage(
          setError,
          error.response?.data?.message || "Failed to update featured status",
          3000
        );
      }
    },
    [loadBlogs, setTimedMessage]
  );

  const handleStatusChange = useCallback(
    async (id, newStatus, title) => {
      try {
        console.log("📝 Updating status for blog:", id, "to:", newStatus);

        // Check if the API function exists
        if (typeof adminAPI.updateBlogStatus === "function") {
          await adminAPI.updateBlogStatus(id, { status: newStatus });
        } else {
          // Fallback to update API
          await adminAPI.updateBlogPost(id, { status: newStatus });
        }

        setTimedMessage(
          setSuccess,
          `"${title}" status updated to ${newStatus}!`,
          3000
        );
        loadBlogs();
      } catch (error) {
        console.error("❌ Failed to update status:", error);
        setTimedMessage(
          setError,
          error.response?.data?.message || "Failed to update status",
          3000
        );
      }
    },
    [loadBlogs, setTimedMessage]
  );

  // Format date - FIXED: Handle different date field names
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  }, []);

  // Status badge styles
  const getStatusBadge = useCallback((status) => {
    const styles = {
      draft: "status-draft",
      published: "status-published",
      archived: "status-archived",
    };
    return styles[status] || styles.draft;
  }, []);

  // Pagination
  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  // Truncate text
  const truncateText = useCallback((text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }, []);

  // FIXED: Safe blog property access
  const getBlogProperty = useCallback((blog, property, fallback = "") => {
    return blog?.[property] || fallback;
  }, []);

  // FIXED: Safe date extraction
  const getBlogDate = useCallback((blog) => {
    return (
      blog?.createdAt || blog?.created_at || blog?.publishDate || blog?.date
    );
  }, []);

  return (
    <AdminLayout
      title="Blog Management"
      subtitle="Create, edit, and manage blog posts"
    >
      <div className="admin-blog">
        {/* Header */}
        <div className="blog-header">
          <button
            onClick={() => navigate("/admin/blog/new")}
            className="new-blog-btn"
          >
            <Plus size={18} />
            New Blog Post
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && <div className="success-alert">{success}</div>}

        {error && <div className="error-alert">{error}</div>}

        {/* Filters */}
        <div className="filters-card">
          <div className="row align-items-end">
            <div className="col-md-4">
              <label className="filter-label">Search</label>
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-group">
                  <input
                    type="text"
                    name="search"
                    defaultValue={filters.search}
                    placeholder="Search blog posts..."
                    className="search-input"
                  />
                  <button type="submit" className="search-btn">
                    <Search size={18} />
                  </button>
                </div>
              </form>
            </div>
            <div className="col-md-3">
              <label className="filter-label">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="filter-select"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="filter-label">Tag Filter</label>
              <input
                type="text"
                value={filters.tag || ""}
                onChange={(e) => handleFilterChange("tag", e.target.value)}
                placeholder="Filter by tag..."
                className="filter-input"
              />
            </div>
            <div className="col-md-2">
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Blog List */}
        <div className="blog-list-card">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading blog posts...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="empty-state">
              <h3>No blog posts found</h3>
              <p>
                {filters.search || filters.status || filters.tag
                  ? "Try adjusting your filters to see more results."
                  : "Create your first blog post to get started."}
              </p>
              <button
                onClick={() => navigate("/admin/blog/new")}
                className="empty-state-btn"
              >
                Create Blog Post
              </button>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="blog-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Tags</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.id || blog._id}>
                        <td className="title-cell">
                          <div className="blog-title-info">
                            <h6 className="blog-title">
                              {getBlogProperty(blog, "title", "Untitled")}
                            </h6>
                            <p className="blog-excerpt">
                              {truncateText(getBlogProperty(blog, "excerpt"))}
                            </p>
                          </div>
                        </td>
                        <td className="category-cell">
                          <span className="category-badge">
                            {getBlogProperty(blog, "category", "Uncategorized")}
                          </span>
                        </td>
                        <td className="tags-cell">
                          <div className="tags-container">
                            {Array.isArray(blog.tags) &&
                            blog.tags.length > 0 ? (
                              <>
                                {blog.tags.slice(0, 2).map((tag, index) => (
                                  <span key={index} className="tag-badge">
                                    {tag}
                                  </span>
                                ))}
                                {blog.tags.length > 2 && (
                                  <span className="tag-more">
                                    +{blog.tags.length - 2}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="no-tags">No tags</span>
                            )}
                          </div>
                        </td>
                        <td className="status-cell">
                          <select
                            value={getBlogProperty(blog, "status", "draft")}
                            onChange={(e) =>
                              handleStatusChange(
                                blog.id || blog._id,
                                e.target.value,
                                getBlogProperty(blog, "title", "Untitled")
                              )
                            }
                            className={`status-select ${getStatusBadge(
                              getBlogProperty(blog, "status", "draft")
                            )}`}
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td className="featured-cell">
                          <button
                            onClick={() =>
                              handleToggleFeatured(
                                blog.id || blog._id,
                                Boolean(blog.featured)
                              )
                            }
                            className="featured-btn"
                            title={
                              blog.featured
                                ? "Remove from featured"
                                : "Add to featured"
                            }
                          >
                            <Star
                              size={18}
                              fill={blog.featured ? "#ffc107" : "none"}
                              color={blog.featured ? "#ffc107" : "#dee2e6"}
                            />
                          </button>
                        </td>
                        <td className="date-cell">
                          <div className="date-info">
                            <Calendar size={14} />
                            {formatDate(getBlogDate(blog))}
                          </div>
                        </td>
                        <td className="actions-cell">
                          <div className="action-buttons">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/blog/edit/${blog.id || blog._id}`
                                )
                              }
                              className="action-btn edit-btn"
                              title="Edit Post"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(
                                  blog.id || blog._id,
                                  getBlogProperty(blog, "title", "Untitled")
                                )
                              }
                              className="action-btn delete-btn"
                              title="Delete Post"
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
                <div className="pagination-container">
                  <div className="pagination-info">
                    Showing{" "}
                    {Math.max(1, (pagination.page - 1) * pagination.limit + 1)}{" "}
                    to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} entries
                  </div>
                  <div className="pagination-controls">
                    {pagination.hasPrev && (
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className="pagination-btn"
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>
                    )}

                    <span className="pagination-current">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>

                    {pagination.hasNext && (
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="pagination-btn"
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

export default AdminBlog;
