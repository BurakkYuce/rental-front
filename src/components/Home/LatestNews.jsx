// src/components/Home/LatestNews.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { publicAPI } from "../../services/api";

const LatestNews = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  // const [error, setError] = useState("");

  // Load latest blogs on component mount
  useEffect(() => {
    loadLatestBlogs();
  }, []);

  const loadLatestBlogs = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading latest blogs...");
      const response = await publicAPI.getNews({
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

  // Slider navigation
  const nextSlide = () => {
    if (blogPosts.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(blogPosts.length / 3));
    }
  };

  const prevSlide = () => {
    if (blogPosts.length > 0) {
      setCurrentSlide(
        (prev) =>
          (prev - 1 + Math.ceil(blogPosts.length / 3)) %
          Math.ceil(blogPosts.length / 3)
      );
    }
  };

  // Auto-slide effect
  useEffect(() => {
    if (blogPosts.length > 3) {
      const interval = setInterval(nextSlide, 6000); // Auto slide every 6 seconds
      return () => clearInterval(interval);
    }
  }, [blogPosts.length]);

  return (
    <section style={{ backgroundColor: "#f8f9fa", padding: "100px 0" }}>
      <div className="container-fluid px-5">
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
              Son Haberler
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
              Güncel gelişmeler, taze bakış açıları ve derinlemesine analizlerle
              hep bir adım önde olun.
              <br />
            </p>
          </div>
        </div>

        {/* Blog Carousel */}
        <div className="row">
          <div className="col-12">
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: "500px",
              }}
            >
              {loading ? (
                // Loading state
                <div className="row">
                  {[1, 2, 3].map((index) => (
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
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p style={{ marginTop: "15px", marginBottom: 0 }}>
                          Loading news...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Slider Container */}
                  <div
                    ref={sliderRef}
                    style={{
                      display: "flex",
                      transition: "transform 0.5s ease",
                      transform: `translateX(-${currentSlide * 100}%)`,
                    }}
                  >
                    {/* Group blog posts into slides of 3 */}
                    {Array.from({
                      length: Math.ceil(blogPosts.length / 3),
                    }).map((_, slideIndex) => (
                      <div
                        key={slideIndex}
                        style={{
                          minWidth: "100%",
                          display: "flex",
                          gap: "40px",
                          padding: "0 20px",
                        }}
                      >
                        {blogPosts
                          .slice(slideIndex * 3, slideIndex * 3 + 3)
                          .map((post) => {
                            const dateObj =
                              post.date ||
                              formatDate(post.publishedAt || new Date());
                            return (
                              <div
                                key={post.id || post._id}
                                style={{
                                  flex: "1",
                                  maxWidth: "calc(33.333% - 27px)",
                                  minHeight: "480px",
                                }}
                              >
                                <div
                                  style={{
                                    backgroundColor: "white",
                                    borderRadius: "15px",
                                    overflow: "hidden",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                    transition:
                                      "transform 0.3s ease, box-shadow 0.3s ease",
                                    cursor: "pointer",
                                    height: "100%",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                      "translateY(-10px)";
                                    e.currentTarget.style.boxShadow =
                                      "0 8px 30px rgba(0,0,0,0.15)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                      "translateY(0)";
                                    e.currentTarget.style.boxShadow =
                                      "0 4px 20px rgba(0,0,0,0.1)";
                                  }}
                                >
                                  {/* Blog Image */}
                                  <div
                                    style={{
                                      position: "relative",
                                      overflow: "hidden",
                                    }}
                                  >
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
                                        "/images/news/pic-blog-1.jpg"
                                      }
                                      alt={
                                        post.featuredImage?.alt ||
                                        post.mainImage?.alt ||
                                        post.title
                                      }
                                      onError={(e) => {
                                        console.warn(
                                          "🖼️ Blog carousel image failed to load:",
                                          e.target.src
                                        );
                                        e.target.src =
                                          "/images/news/pic-blog-1.jpg";
                                      }}
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
                                        backgroundColor: "#1ecb15",
                                        borderRadius: "10px",
                                        padding: "8px 12px",
                                        textAlign: "center",
                                        boxShadow:
                                          "0 2px 10px rgba(30, 203, 21, 0.3)",
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
                                  <div
                                    style={{
                                      padding: "25px",
                                      display: "flex",
                                      flexDirection: "column",
                                      height: "calc(100% - 250px)",
                                    }}
                                  >
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
                                        flex: "1",
                                      }}
                                    >
                                      {post.excerpt}
                                    </p>

                                    {/* Read More Button */}
                                    <button
                                      onClick={() => handleReadMore(post.slug)}
                                      style={{
                                        backgroundColor: "#1ecb15",
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
                                        width: "100%",
                                        marginTop: "auto",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.backgroundColor =
                                          "#179510";
                                        e.target.style.transform =
                                          "translateY(-2px)";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.backgroundColor =
                                          "#1ecb15";
                                        e.target.style.transform =
                                          "translateY(0)";
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
                                          "linear-gradient(to right, #1ecb15, #179510)",
                                        borderRadius: "2px",
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  {blogPosts.length > 3 && (
                    <>
                      <button
                        onClick={prevSlide}
                        style={{
                          position: "absolute",
                          left: "-70px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "#1ecb15",
                          border: "none",
                          borderRadius: "50%",
                          width: "60px",
                          height: "60px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 6px 20px rgba(30, 203, 21, 0.4)",
                          transition: "all 0.3s ease",
                          zIndex: 10,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#179510";
                          e.target.style.transform =
                            "translateY(-50%) scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#1ecb15";
                          e.target.style.transform =
                            "translateY(-50%) scale(1)";
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          fill="white"
                          viewBox="0 0 24 24"
                        >
                          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                        </svg>
                      </button>

                      <button
                        onClick={nextSlide}
                        style={{
                          position: "absolute",
                          right: "-70px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "#1ecb15",
                          border: "none",
                          borderRadius: "50%",
                          width: "60px",
                          height: "60px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 6px 20px rgba(30, 203, 21, 0.4)",
                          transition: "all 0.3s ease",
                          zIndex: 10,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#179510";
                          e.target.style.transform =
                            "translateY(-50%) scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#1ecb15";
                          e.target.style.transform =
                            "translateY(-50%) scale(1)";
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          fill="white"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Slide Indicators */}
                  {blogPosts.length > 3 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "15px",
                        marginTop: "40px",
                      }}
                    >
                      {Array.from({
                        length: Math.ceil(blogPosts.length / 3),
                      }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          style={{
                            width: currentSlide === index ? "40px" : "15px",
                            height: "15px",
                            borderRadius: "25px",
                            border: "2px solid #1ecb15",
                            backgroundColor:
                              currentSlide === index
                                ? "#1ecb15"
                                : "transparent",
                            cursor: "pointer",
                            transition: "all 0.4s ease",
                            boxShadow:
                              currentSlide === index
                                ? "0 4px 12px rgba(30, 203, 21, 0.3)"
                                : "none",
                          }}
                          onMouseEnter={(e) => {
                            if (currentSlide !== index) {
                              e.target.style.backgroundColor =
                                "rgba(30, 203, 21, 0.1)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentSlide !== index) {
                              e.target.style.backgroundColor = "transparent";
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* View All Blogs Button */}
        <div className="row">
          <div className="col-12 text-center mt-4">
            <button
              style={{
                backgroundColor: "transparent",
                color: "#1ecb15",
                border: "2px solid #1ecb15",
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
                e.target.style.background =
                  "linear-gradient(135deg, #1ecb15, #179510)";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 10px 30px rgba(30, 203, 21, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#1ecb15";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
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
