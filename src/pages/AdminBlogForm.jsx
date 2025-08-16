// src/pages/AdminBlogForm.jsx - Fixed Version
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, X, Plus, Upload, Star } from "lucide-react";
import { adminAPI } from "../services/api";
import AdminLayout from "../components/AdminLayout";
import "./AdminBlogForm.css";

const AdminBlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const timeoutRef = useRef(null); // Memory leak fix

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: {
      url: "",
      alt: "",
      publicId: "",
    },
    author: {
      name: "Admin",
      avatar: "",
    },
    category: "Company News",
    tags: [],
    status: "draft",
    featured: false,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newTag, setNewTag] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // Categories
  const categories = [
    "Car Reviews",
    "Travel Tips",
    "Maintenance",
    "Insurance",
    "Road Safety",
    "Car Tech",
    "Company News",
    "Industry News",
  ];

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Load blog data for editing
  const loadBlog = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      console.log("🔄 Loading blog with ID:", id);
      const response = await adminAPI.getBlogPostById(id);

      // FIXED: Consistent response handling
      let blog;
      if (response?.data) {
        // Handle different response structures
        if (response.data.blog) {
          blog = response.data.blog;
        } else if (response.data.data) {
          blog = response.data.data;
        } else {
          blog = response.data;
        }
      } else {
        throw new Error("Invalid response structure");
      }

      console.log("✅ Blog loaded:", blog);

      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        featuredImage: blog.featuredImage || { url: "", alt: "", publicId: "" },
        author: blog.author || { name: "Admin", avatar: "" },
        category: blog.category || "Company News",
        tags: Array.isArray(blog.tags) ? blog.tags : [],
        status: blog.status || "draft",
        featured: Boolean(blog.featured),
      });

      if (blog.featuredImage?.url || blog.image) {
        setImagePreview(blog.featuredImage?.url || blog.image);
      }
    } catch (error) {
      console.error("❌ Failed to load blog:", error);
      setError("Failed to load blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode) {
      loadBlog();
    }
  }, [isEditMode, loadBlog]);

  // Generate slug from title
  const generateSlug = useCallback((title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, ""); // FIXED: Remove leading/trailing dashes
  }, []);

  // Handle input changes
  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };

        // Auto-generate slug when title changes (only for new posts)
        if (field === "title" && !isEditMode && !prev.slug) {
          updated.slug = generateSlug(value);
        }

        return updated;
      });
    },
    [isEditMode, generateSlug]
  );

  // Handle nested object changes
  const handleNestedChange = useCallback((parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  }, []);

  // Handle image selection (don't upload yet, wait for save)
  const handleImageUpload = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      // Clear previous error
      setError("");

      // Store the file for later upload and create preview
      setSelectedImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Set alt text to filename
      handleNestedChange("featuredImage", "alt", file.name);
      
      console.log("📁 Image selected for upload:", file.name);
    },
    [handleNestedChange]
  );

  // Handle tag management
  const addTag = useCallback(() => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      handleInputChange("tags", [...formData.tags, trimmedTag]);
      setNewTag("");
    }
  }, [newTag, formData.tags, handleInputChange]);

  const removeTag = useCallback(
    (tagToRemove) => {
      handleInputChange(
        "tags",
        formData.tags.filter((tag) => tag !== tagToRemove)
      );
    },
    [formData.tags, handleInputChange]
  );

  // FIXED: Better validation with detailed error messages
  const validateForm = useCallback(() => {
    const errors = [];

    if (!formData.title.trim()) {
      errors.push("Title is required");
    } else if (formData.title.length > 200) {
      errors.push("Title must be less than 200 characters");
    } else if (formData.title.length < 5) {
      errors.push("Title must be at least 5 characters");
    }

    // FIXED: Make excerpt validation match backend (optional with length limits)
    if (formData.excerpt.trim()) {
      if (formData.excerpt.length > 300) {
        errors.push("Excerpt must be less than 300 characters");
      } else if (formData.excerpt.length < 10) {
        errors.push("Excerpt must be at least 10 characters");
      }
    }

    if (!formData.content.trim()) {
      errors.push("Content is required");
    } else if (formData.content.length < 50) {
      errors.push("Content must be at least 50 characters");
    }

    // Validate slug
    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.push(
        "Slug can only contain lowercase letters, numbers, and hyphens"
      );
    }

    return errors;
  }, [formData]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      // FIXED: Better error display
      setError(
        <div>
          <strong>Please fix the following errors:</strong>
          <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Upload image to Cloudinary if a new image was selected
      let imageUrl = formData.featuredImage.url; // Keep existing URL for edits
      
      if (selectedImageFile) {
        console.log("🔄 Uploading image to Cloudinary...");
        try {
          const uploadResponse = await adminAPI.uploadCarImage(selectedImageFile);
          if (uploadResponse.data && uploadResponse.data.imageUrl) {
            imageUrl = uploadResponse.data.imageUrl;
            console.log("✅ Image uploaded successfully:", imageUrl);
          } else {
            throw new Error("Invalid upload response");
          }
        } catch (uploadError) {
          console.error("❌ Failed to upload image:", uploadError);
          setError("Failed to upload image. Please try again.");
          return; // Don't save the blog if image upload fails
        }
      }

      // FIXED: Prepare blog data to match backend expectations
      const blogData = {
        title: formData.title.trim(),
        excerpt:
          formData.excerpt.trim() ||
          formData.content.substring(0, 200).trim() + "...",
        content: formData.content.trim(),
        slug: formData.slug.trim() || generateSlug(formData.title),
        status: formData.status,
        featured: formData.featured,
        tags: formData.tags,
        category: formData.category,
        // Send author as the structure expected by backend
        author: formData.author,
        // Include featuredImage for backend processing
        featuredImage: {
          ...formData.featuredImage,
          url: imageUrl, // Use the uploaded image URL
        },
      };

      console.log("💾 Saving blog data:", blogData);

      let response;
      if (isEditMode) {
        response = await adminAPI.updateBlogPost(id, blogData);
      } else {
        response = await adminAPI.createBlogPost(blogData);
      }

      console.log("✅ Blog saved successfully:", response);

      // Navigate back to blog list
      navigate("/admin/blog", {
        state: {
          refresh: true,
          message: `Blog post ${
            isEditMode ? "updated" : "created"
          } successfully!`,
        },
      });
    } catch (error) {
      console.error("❌ Failed to save blog:", error);
      console.error("❌ Error response:", error.response);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.details?.[0]?.msg ||
        `Failed to ${isEditMode ? "update" : "create"} blog post`;

      setError(errorMessage);

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  // Handle preview
  const handlePreview = useCallback(() => {
    if (formData.slug && isEditMode) {
      window.open(`/blog/${formData.slug}`, "_blank");
    } else {
      alert("Please save the blog post first to preview");
    }
  }, [formData.slug, isEditMode]);

  // Handle key press for tag input
  const handleTagKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag();
      }
    },
    [addTag]
  );

  if (loading) {
    return (
      <AdminLayout title={isEditMode ? "Edit Blog Post" : "Create Blog Post"}>
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading blog post...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isEditMode ? "Edit Blog Post" : "Create Blog Post"}
      subtitle={
        isEditMode
          ? "Update your blog post content and settings"
          : "Create a new blog post"
      }
    >
      <div className="admin-blog-form">
        {/* Header */}
        <div className="form-header">
          <div className="header-left">
            <button
              onClick={() => navigate("/admin/blog")}
              className="back-btn"
              type="button"
            >
              <ArrowLeft size={18} />
            </button>
            <h1>{isEditMode ? "Edit Blog Post" : "Create New Blog Post"}</h1>
          </div>
          <div className="header-actions">
            {isEditMode && (
              <button
                onClick={handlePreview}
                className="preview-btn"
                type="button"
              >
                <Eye size={18} />
                Preview
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`save-btn ${saving ? "loading" : ""}`}
              type="button"
            >
              <Save size={18} />
              {saving ? "Saving..." : isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-alert">
            {typeof error === "string" ? error : error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              <div className="content-card">
                {/* Title */}
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter blog title..."
                    className="form-input title-input"
                    required
                    maxLength={200}
                  />
                  <div className="char-count">{formData.title.length}/200</div>
                </div>

                {/* Slug */}
                <div className="form-group">
                  <label className="form-label">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="url-slug"
                    className="form-input"
                    pattern="^[a-z0-9-]+$"
                    title="Only lowercase letters, numbers, and hyphens allowed"
                  />
                  <div className="field-help">
                    This will be the URL path for your blog post (lowercase
                    letters, numbers, and hyphens only)
                  </div>
                </div>

                {/* Excerpt */}
                <div className="form-group">
                  <label className="form-label">Excerpt (Optional)</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      handleInputChange("excerpt", e.target.value)
                    }
                    placeholder="Brief description of the blog post (optional)..."
                    rows="3"
                    className="form-textarea"
                    maxLength={300}
                  />
                  <div className="char-count">
                    {formData.excerpt.length}/300
                  </div>
                  <div className="field-help">
                    If left empty, will be auto-generated from content
                  </div>
                </div>

                {/* Content */}
                <div className="form-group">
                  <label className="form-label">Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      handleInputChange("content", e.target.value)
                    }
                    placeholder="Write your blog content here..."
                    rows="15"
                    className="form-textarea content-textarea"
                    required
                  />
                  <div className="field-help">
                    You can use Markdown formatting
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Publish Settings */}
              <div className="sidebar-card">
                <h4 className="card-title">Publish Settings</h4>

                {/* Status */}
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="form-select"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Featured */}
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        handleInputChange("featured", e.target.checked)
                      }
                      className="checkbox-input"
                    />
                    <Star
                      size={16}
                      fill={formData.featured ? "#ffc107" : "none"}
                      color="#ffc107"
                    />
                    Featured Post
                  </label>
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="form-select"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Featured Image */}
              <div className="sidebar-card">
                <h4 className="card-title">Featured Image</h4>

                {imagePreview ? (
                  <div className="image-preview">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="preview-image"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setSelectedImageFile(null);
                        handleNestedChange("featuredImage", "url", "");
                      }}
                      className="remove-image-btn"
                    >
                      <X size={16} />
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="image-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      id="featured-image"
                      className="file-input"
                    />
                    <label htmlFor="featured-image" className="upload-label">
                      <Upload size={32} />
                      <p>Click to upload image</p>
                      <span>Max size: 5MB</span>
                    </label>
                  </div>
                )}

                {/* Alt Text */}
                <div className="form-group">
                  <label className="form-label">Alt Text</label>
                  <input
                    type="text"
                    value={formData.featuredImage.alt}
                    onChange={(e) =>
                      handleNestedChange("featuredImage", "alt", e.target.value)
                    }
                    placeholder="Image description..."
                    className="form-input"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="sidebar-card">
                <h4 className="card-title">Tags</h4>

                {/* Tag Input */}
                <div className="tag-input-group">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add tag..."
                    className="tag-input"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="add-tag-btn"
                    disabled={
                      !newTag.trim() || formData.tags.includes(newTag.trim())
                    }
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Current Tags */}
                <div className="tags-list">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="tag-item">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="remove-tag-btn"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {formData.tags.length === 0 && (
                    <p className="no-tags">No tags added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogForm;
