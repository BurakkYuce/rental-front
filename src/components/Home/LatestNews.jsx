// src/components/Home/LatestNews.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { blogAPI } from "../../services/api";

const LatestNews = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");

  // Load latest blogs on component mount
  useEffect(() => {
    loadLatestBlogs();
  }, []);

  const loadLatestBlogs = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading latest blogs...");
      const response = await blogAPI.getBlogs({
        limit: 5,
        page: 1,
      });
      console.log("📰 News API response:", response);
      // publicAPI.getNews calls /blogs, which returns { success: true, data: { blogs: [...], pagination: {...} } }
      const newsData = response.data.data.blogs || [];
      console.log("📰 Processed news data:", newsData);
      setBlogPosts(newsData);
    } catch (error) {
      console.error("Failed to load latest blogs:", error);
      //  setError("Failed to load latest news");
      // Fallback to dummy data if API fails
      setBlogPosts([
        {
          _id: "1",
          title: "Enjoy Best Travel Experience",
          excerpt:
            "Dolore officia sint incididunt non excepteur ea mollit commodo ut enim reprehenderit cupidatat labore ad laborum consectetur.",
          featuredImage: { url: "/images/news/pic-blog-1.jpg" },
          publishedAt: new Date().toISOString(),
          slug: "enjoy-best-travel-experience",
        },
        {
          _id: "2",
          title: "The Future of Car Rent",
          excerpt:
            "Dolore officia sint incididunt non excepteur ea mollit commodo ut enim reprehenderit cupidatat labore ad laborum consectetur.",
          featuredImage: { url: "/images/news/pic-blog-2.jpg" },
          publishedAt: new Date().toISOString(),
          slug: "future-of-car-rent",
        },
        {
          _id: "3",
          title: "Holiday Tips For Backpacker",
          excerpt:
            "Dolore officia sint incididunt non excepteur ea mollit commodo ut enim reprehenderit cupidatat labore ad laborum consectetur.",
          featuredImage: { url: "/images/news/pic-blog-3.jpg" },
          publishedAt: new Date().toISOString(),
          slug: "holiday-tips-backpacker",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    };
  };

  const handleReadMore = (slug) => {
    navigate(`/news/${slug}`);
  };

  const handleViewAllBlogs = () => {
    navigate("/news");
  };

  return (
    <section style={{ backgroundColor: "#f8f9fa", padding: "80px 0" }}>
      <div className="container">
        {/* Section Header */}
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#2c3e50",
                marginBottom: "20px",
              }}
            >
              Latest News
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#6c757d",
                maxWidth: "700px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              Breaking news, fresh perspectives, and in-depth coverage - stay
              ahead with our
              <br />
              latest news, insights, and analysis.
            </p>
          </div>
        </div>

        {/* Blog Cards */}
        <div className="row">
          {loading
            ? // Loading skeleton
              [1, 2, 3].map((index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-4">
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: "15px",
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      padding: "25px",
                      textAlign: "center",
                      color: "#6c757d",
                    }}
                  >
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={{ marginTop: "15px", marginBottom: 0 }}>
                      Loading...
                    </p>
                  </div>
                </div>
              ))
            : (blogPosts || []).map((post) => {
                const dateObj =
                  post.date || formatDate(post.publishedAt || new Date());
                return (
                  <div
                    key={post.id || post._id}
                    className="col-lg-4 col-md-6 mb-4"
                  >
                    <div
                      style={{
                        backgroundColor: "white",
                        borderRadius: "15px",
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-10px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 30px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 20px rgba(0,0,0,0.1)";
                      }}
                    >
                      {/* Blog Image */}
                      <div style={{ position: "relative", overflow: "hidden" }}>
                        <img
                          src={
                            post.featuredImage?.url ||
                            post.image ||
                            "/images/news/pic-blog-1.jpg"
                          }
                          alt={post.featuredImage?.alt || post.title}
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                          }}
                        />

                        {/* Date Badge */}
                        <div
                          style={{
                            position: "absolute",
                            top: "20px",
                            left: "20px",
                            backgroundColor: "#00ff88",
                            borderRadius: "10px",
                            padding: "8px 12px",
                            textAlign: "center",
                            boxShadow: "0 2px 10px rgba(0, 255, 136, 0.3)",
                          }}
                        >
                          <div
                            style={{
                              color: "white",
                              fontSize: "1.2rem",
                              fontWeight: "700",
                              lineHeight: "1",
                            }}
                          >
                            {dateObj.day}
                          </div>
                          <div
                            style={{
                              color: "white",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                              lineHeight: "1",
                            }}
                          >
                            {dateObj.month}
                          </div>
                        </div>
                      </div>

                      {/* Blog Content */}
                      <div style={{ padding: "25px" }}>
                        <h4
                          style={{
                            color: "#2c3e50",
                            fontSize: "1.3rem",
                            fontWeight: "700",
                            marginBottom: "15px",
                            lineHeight: "1.4",
                          }}
                        >
                          {post.title}
                        </h4>

                        <p
                          style={{
                            color: "#6c757d",
                            fontSize: "1rem",
                            lineHeight: "1.6",
                            marginBottom: "20px",
                          }}
                        >
                          {post.excerpt}
                        </p>

                        {/* Read More Button */}
                        <button
                          onClick={() => handleReadMore(post.slug)}
                          style={{
                            backgroundColor: "#00ff88",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#00cc6a";
                            e.target.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#00ff88";
                            e.target.style.transform = "translateY(0)";
                          }}
                        >
                          Read More
                        </button>

                        {/* Bottom Border */}
                        <div
                          style={{
                            marginTop: "20px",
                            height: "3px",
                            background:
                              "linear-gradient(to right, #00ff88, #00cc6a)",
                            borderRadius: "2px",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* View All Blogs Button */}
        <div className="row">
          <div className="col-12 text-center mt-4">
            <button
              style={{
                backgroundColor: "transparent",
                color: "#00ff88",
                border: "2px solid #00ff88",
                borderRadius: "8px",
                padding: "12px 30px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#00ff88";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#00ff88";
              }}
              onClick={handleViewAllBlogs}
            >
              View All Blogs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
