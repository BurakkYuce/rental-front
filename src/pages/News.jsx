// src/pages/News.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Header from "../components/Header";
import BackToHomeButton from "../components/BackToHomeButton";
import { publicAPI, blogAPI } from "../services/api";

const NewsLeftGrid = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State for blog data
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({});

  // URL params for filtering
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const currentCategory = searchParams.get("category") || "";
  const currentTag = searchParams.get("tag") || "";
  const currentSearch = searchParams.get("search") || "";

  // Load data on component mount
  useEffect(() => {
    loadBlogs();
    loadFeaturedBlogs();
    loadCategories();
    loadTags();
  }, [searchParams]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 6,
      };

      if (currentCategory) params.category = currentCategory;
      if (currentTag) params.tag = currentTag;
      if (currentSearch) params.search = currentSearch;

      const response = await publicAPI.getNews(params);
      console.log("📰 News API response:", response);

      // Handle different possible response structures
      let blogsData = [];
      let paginationData = {};

      if (response.data && response.data.success) {
        blogsData = response.data.data?.blogs || response.data.data || [];
        paginationData = response.data.data?.pagination || {};
      } else if (response.data && response.data.data) {
        blogsData = response.data.data.blogs || response.data.data || [];
        paginationData = response.data.data.pagination || {};
      }

      console.log("📰 Processed blogs data:", blogsData);

      // Debug image fields for first blog
      if (blogsData.length > 0) {
        console.log("🖼️ First blog image fields:", {
          featuredImage: blogsData[0].featuredImage,
          mainImage: blogsData[0].mainImage,
          main_image: blogsData[0].main_image,
          image: blogsData[0].image,
          images: blogsData[0].images,
          thumbnail: blogsData[0].thumbnail,
        });
      }

      setBlogs(blogsData);
      setPagination(paginationData);
    } catch (error) {
      console.error("Failed to load blogs:", error);
      setError("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedBlogs = async () => {
    try {
      const response = await publicAPI.getNews({ limit: 4, featured: true });
      console.log("🌟 Featured blogs API response:", response);

      // Handle different possible response structures
      let featuredData = [];
      if (response.data && response.data.success) {
        featuredData = response.data.data?.blogs || response.data.data || [];
      } else if (response.data && response.data.data) {
        featuredData = response.data.data.blogs || response.data.data || [];
      }

      console.log("🌟 Processed featured blogs:", featuredData);
      setFeaturedBlogs(featuredData);
    } catch (error) {
      console.error("Failed to load featured blogs:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await blogAPI.getCategories();
      // getCategories returns { success: true, data: [...] }
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadTags = async () => {
    try {
      const response = await blogAPI.getTags({ limit: 12 });
      // getTags returns { success: true, data: [...] }
      setTags(response.data.data);
    } catch (error) {
      console.error("Failed to load tags:", error);
    }
  };

  const handleReadMore = (slug) => {
    navigate(`/news/${slug}`);
  };

  const handleCategoryFilter = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category === currentCategory) {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleTagFilter = (tag) => {
    const params = new URLSearchParams(searchParams);
    if (tag === currentTag) {
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const testimonials = [
    {
      id: 1,
      name: "John, Pixar Studio",
      image: "/images/people/1.jpg",
      text: "Great support, like i have never seen before. Thanks to the support team, they are very helpfull. This company provide customers great solution, that makes them best.",
    },
    {
      id: 2,
      name: "Sarah, Microsoft",
      image: "/images/people/2.jpg",
      text: "Great support, like i have never seen before. Thanks to the support team, they are very helpfull. This company provide customers great solution, that makes them best.",
    },
    {
      id: 3,
      name: "Michael, Apple",
      image: "/images/people/3.jpg",
      text: "Great support, like i have never seen before. Thanks to the support team, they are very helpfull. This company provide customers great solution, that makes them best.",
    },
    {
      id: 4,
      name: "Thomas, Samsung",
      image: "/images/people/4.jpg",
      text: "Great support, like i have never seen before. Thanks to the support team, they are very helpfull. This company provide customers great solution, that makes them best.",
    },
  ];

  return (
    <div className="news-page">
      {/* Header */}
      <Header />

      {/* Back to Home Button */}
      <BackToHomeButton />

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url('/images/background/subheader.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "120px 0 80px",
          position: "relative",
          color: "white",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        ></div>
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1
                  style={{
                    fontSize: "3rem",
                    color: "white",
                    fontWeight: "bold",
                    margin: 0,
                  }}
                >
                  Haberler
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          {/* Blog & News Header */}
          <div className="row" style={{ marginBottom: "50px" }}>
            <div className="col-12 text-center">
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "#2c3e50",
                  marginBottom: "15px",
                }}
              >
                Bloglar
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#6c757d",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Son haberler, blog yazıları ve güncellemelerden haberdar olun
              </p>
            </div>
          </div>

          <div className="row">
            {/* Left Sidebar */}
            <div className="col-lg-4">
              {/* Recent Posts Widget */}
              <div className="widget" style={{ marginBottom: "40px" }}>
                <h4
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    marginBottom: "20px",
                    color: "#333",
                  }}
                >
                  Son Yayınlar
                </h4>
                <div
                  style={{
                    width: "50px",
                    height: "3px",
                    backgroundColor: "#1ECB15",
                    marginBottom: "25px",
                  }}
                ></div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {featuredBlogs.slice(0, 4).map((post) => (
                    <li
                      key={post._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                        paddingBottom: "20px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div style={{ marginRight: "15px", flexShrink: 0 }}>
                        <img
                          src={
                            post.featuredImage?.url ||
                            post.mainImage?.url ||
                            post.main_image?.url ||
                            post.image?.url ||
                            post.image ||
                            post.images?.main?.url ||
                            post.images?.featured?.url ||
                            post.thumbnail?.url ||
                            post.thumbnail ||
                            "/images/news-thumbnail/pic-blog-1.jpg"
                          }
                          alt={post.title}
                          onError={(e) => {
                            console.warn(
                              "🖼️ Featured blog thumbnail failed to load:",
                              e.target.src
                            );
                            e.target.src =
                              "/images/news-thumbnail/pic-blog-1.jpg";
                          }}
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                      <div>
                        <h4
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            marginBottom: "5px",
                            lineHeight: "1.3",
                          }}
                        >
                          <Link
                            to={`/news/${post.slug}`}
                            style={{
                              color: "#333",
                              textDecoration: "none",
                              transition: "color 0.3s ease",
                            }}
                          >
                            {post.title}
                          </Link>
                        </h4>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Tags Widget */}
              <div className="widget" style={{ marginBottom: "40px" }}>
                <h4
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    marginBottom: "20px",
                    color: "#333",
                  }}
                >
                  Popüler Etiketler
                </h4>
                <div
                  style={{
                    width: "50px",
                    height: "3px",
                    backgroundColor: "#1ECB15",
                    marginBottom: "25px",
                  }}
                ></div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {tags.map((tagItem, index) => (
                    <button
                      key={index}
                      onClick={() => handleTagFilter(tagItem.tag)}
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        backgroundColor:
                          currentTag === tagItem.tag ? "#1ECB15" : "#f8f9fa",
                        color: currentTag === tagItem.tag ? "white" : "#666",
                        textDecoration: "none",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        border: `1px solid ${
                          currentTag === tagItem.tag ? "#1ECB15" : "#e9ecef"
                        }`,
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (currentTag !== tagItem.tag) {
                          e.target.style.backgroundColor = "#1ECB15";
                          e.target.style.color = "white";
                          e.target.style.borderColor = "#1ECB15";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentTag !== tagItem.tag) {
                          e.target.style.backgroundColor = "#f8f9fa";
                          e.target.style.color = "#666";
                          e.target.style.borderColor = "#e9ecef";
                        }
                      }}
                    >
                      {tagItem.tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-lg-8">
              {loading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p style={{ marginTop: "1rem", color: "#666" }}>
                    Loading blog posts...
                  </p>
                </div>
              ) : error ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "50px",
                    color: "#dc3545",
                  }}
                >
                  {error}
                </div>
              ) : (
                <>
                  <div className="row">
                    {blogs.map((article) => {
                      return (
                        <div
                          key={article._id}
                          className="col-lg-6"
                          style={{ marginBottom: "30px" }}
                        >
                          <div
                            style={{
                              backgroundColor: "white",
                              borderRadius: "12px",
                              overflow: "hidden",
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                              transition:
                                "transform 0.3s ease, box-shadow 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateY(-5px)";
                              e.currentTarget.style.boxShadow =
                                "0 8px 25px rgba(0, 0, 0, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 6px rgba(0, 0, 0, 0.1)";
                            }}
                          >
                            <div style={{ position: "relative" }}>
                              <div
                                style={{
                                  position: "absolute",
                                  top: "15px",
                                  left: "15px",
                                  backgroundColor: "#1ECB15",
                                  color: "white",
                                  padding: "8px 12px",
                                  borderRadius: "8px",
                                  textAlign: "center",
                                  zIndex: 2,
                                  minWidth: "60px",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    lineHeight: "1.2",
                                  }}
                                ></div>
                                <div
                                  style={{
                                    fontSize: "0.8rem",
                                    fontWeight: "600",
                                  }}
                                ></div>
                              </div>
                              <img
                                src={
                                  article.featuredImage?.url ||
                                  article.mainImage?.url ||
                                  article.main_image?.url ||
                                  article.image?.url ||
                                  article.image ||
                                  article.images?.main?.url ||
                                  article.images?.featured?.url ||
                                  article.thumbnail?.url ||
                                  article.thumbnail ||
                                  "/images/news/pic-blog-1.jpg"
                                }
                                alt={article.title}
                                onError={(e) => {
                                  console.warn(
                                    "🖼️ Blog main image failed to load:",
                                    e.target.src
                                  );
                                  e.target.src = "/images/news/pic-blog-1.jpg";
                                }}
                                style={{
                                  width: "100%",
                                  height: "200px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                            <div style={{ padding: "25px" }}>
                              <div style={{ marginBottom: "10px" }}>
                                <span
                                  style={{
                                    backgroundColor: "#1ECB15",
                                    color: "white",
                                    padding: "4px 8px",
                                    borderRadius: "12px",
                                    fontSize: "0.75rem",
                                    fontWeight: "600",
                                  }}
                                >
                                  {article.category}
                                </span>
                              </div>
                              <h4
                                style={{
                                  fontSize: "1.2rem",
                                  fontWeight: "600",
                                  marginBottom: "15px",
                                  lineHeight: "1.4",
                                }}
                              >
                                <Link
                                  to={`/news/${article.slug}`}
                                  style={{
                                    color: "#333",
                                    textDecoration: "none",
                                    transition: "color 0.3s ease",
                                  }}
                                >
                                  {article.title}
                                </Link>
                              </h4>
                              <p
                                style={{
                                  fontSize: "0.9rem",
                                  color: "#666",
                                  lineHeight: "1.6",
                                  marginBottom: "20px",
                                }}
                              >
                                {article.excerpt}
                              </p>
                              <button
                                onClick={() => handleReadMore(article.slug)}
                                style={{
                                  display: "inline-block",
                                  backgroundColor: "#1ECB15",
                                  color: "white",
                                  border: "none",
                                  padding: "10px 20px",
                                  borderRadius: "6px",
                                  fontSize: "0.9rem",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = "#179510";
                                  e.target.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = "#1ECB15";
                                  e.target.style.transform = "translateY(0)";
                                }}
                              >
                                Devamını Oku
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div style={{ marginTop: "50px" }}>
                  <ul
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      gap: "5px",
                    }}
                  >
                    {pagination.hasPrev && (
                      <li>
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          style={{
                            display: "block",
                            padding: "10px 15px",
                            color: "#666",
                            backgroundColor: "transparent",
                            border: "1px solid #e9ecef",
                            borderRadius: "6px",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                        >
                          Prev
                        </button>
                      </li>
                    )}

                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const page = index + 1;
                      const isCurrentPage = page === pagination.page;

                      if (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= pagination.page - 1 &&
                          page <= pagination.page + 1)
                      ) {
                        return (
                          <li key={page}>
                            <button
                              onClick={() => handlePageChange(page)}
                              style={{
                                display: "block",
                                padding: "10px 15px",
                                color: isCurrentPage ? "white" : "#666",
                                backgroundColor: isCurrentPage
                                  ? "#1ECB15"
                                  : "transparent",
                                border: `1px solid ${
                                  isCurrentPage ? "#1ECB15" : "#e9ecef"
                                }`,
                                borderRadius: "6px",
                                transition: "all 0.3s ease",
                                minWidth: "45px",
                                textAlign: "center",
                                cursor: "pointer",
                                fontWeight: isCurrentPage ? "600" : "normal",
                              }}
                            >
                              {page}
                            </button>
                          </li>
                        );
                      } else if (
                        page === pagination.page - 2 ||
                        page === pagination.page + 2
                      ) {
                        return (
                          <li key={`dots-${page}`}>
                            <span style={{ padding: "10px", color: "#666" }}>
                              ...
                            </span>
                          </li>
                        );
                      }
                      return null;
                    })}

                    {pagination.hasNext && (
                      <li>
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          style={{
                            display: "block",
                            padding: "10px 15px",
                            color: "#666",
                            backgroundColor: "transparent",
                            border: "1px solid #e9ecef",
                            borderRadius: "6px",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                        >
                          Next
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsLeftGrid;
