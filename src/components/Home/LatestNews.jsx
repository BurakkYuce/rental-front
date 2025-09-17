// src/components/Home/LatestNews.jsx - Blue Theme
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
      const newsData = response.data.data.blogs || [];
      console.log("📰 Processed news data:", newsData);
      setBlogPosts(newsData);
    } catch (error) {
      console.error("Failed to load latest blogs:", error);
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

  // Check if mobile viewport
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Slider navigation
  const nextSlide = () => {
    if (blogPosts.length > 0 && !isMobile) {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(blogPosts.length / 3));
    }
  };

  const prevSlide = () => {
    if (blogPosts.length > 0 && !isMobile) {
      setCurrentSlide(
        (prev) =>
          (prev - 1 + Math.ceil(blogPosts.length / 3)) %
          Math.ceil(blogPosts.length / 3)
      );
    }
  };

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
              className="news-carousel-container"
              style={{
                position: "relative",
                overflow: isMobile ? "visible" : "hidden",
                minHeight: isMobile ? "auto" : "500px",
              }}
            >
              {loading ? (
                // Loading state
                <div className="row">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="col-lg-4 col-md-6 col-sm-12 mb-4 news-loading-card"
                    >
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
                    className="news-carousel-slides"
                    style={{
                      display: isMobile ? "block" : "flex",
                      transition: isMobile ? "none" : "transform 0.5s ease",
                      transform: isMobile
                        ? "none"
                        : `translateX(-${currentSlide * 100}%)`,
                    }}
                  >
                    {/* Group blog posts into slides of 3 */}
                    {isMobile ? (
                      // Mobile: Show all posts in a single column
                      <div className="news-slide">
                        {blogPosts.map((post) => {
                          const dateObj =
                            post.date ||
                            formatDate(post.publishedAt || new Date());
                          return (
                            <div
                              key={post.id || post._id}
                              className="news-card-item"
                              style={{
                                marginBottom: "2rem",
                                width: "100%",
                              }}
                            >
                              <div
                                className="news-card-content"
                                style={{
                                  backgroundColor: "white",
                                  borderRadius: "12px",
                                  overflow: "hidden",
                                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                  cursor: "pointer",
                                  height: "auto",
                                }}
                              >
                                {/* Rest of the card content - simplified for mobile */}
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
                                    alt={post.title}
                                    style={{
                                      width: "100%",
                                      height: "200px",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "15px",
                                      left: "15px",
                                      backgroundColor: "#4A90E2",
                                      borderRadius: "8px",
                                      padding: "6px 10px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <div
                                      style={{
                                        color: "white",
                                        fontSize: "1rem",
                                        fontWeight: "700",
                                      }}
                                    >
                                      {dateObj.day}
                                    </div>
                                    <div
                                      style={{
                                        color: "white",
                                        fontSize: "0.7rem",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {dateObj.month}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ padding: "1.5rem" }}>
                                  <h4
                                    style={{
                                      color: "#2c3e50",
                                      fontSize: "1.1rem",
                                      fontWeight: "700",
                                      marginBottom: "1rem",
                                      lineHeight: "1.4",
                                    }}
                                  >
                                    {post.title}
                                  </h4>

                                  <p
                                    style={{
                                      color: "#6c757d",
                                      fontSize: "0.9rem",
                                      lineHeight: "1.5",
                                      marginBottom: "1.5rem",
                                    }}
                                  >
                                    {post.excerpt}
                                  </p>

                                  <button
                                    onClick={() => handleReadMore(post.slug)}
                                    style={{
                                      backgroundColor: "#4A90E2",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "6px",
                                      padding: "0.75rem 1rem",
                                      fontSize: "0.85rem",
                                      fontWeight: "600",
                                      cursor: "pointer",
                                      width: "100%",
                                      textTransform: "uppercase",
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
                    ) : (
                      // Desktop: Show carousel slides
                      Array.from({
                        length: Math.ceil(blogPosts.length / 3),
                      }).map((_, slideIndex) => (
                        <div
                          key={slideIndex}
                          className="news-slide"
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
                                  className="news-card-item"
                                  style={{
                                    flex: "1",
                                    maxWidth: "calc(33.333% - 27px)",
                                    minHeight: "480px",
                                  }}
                                >
                                  <div
                                    className="news-card-content"
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
                                          backgroundColor: "#4A90E2",
                                          borderRadius: "10px",
                                          padding: "8px 12px",
                                          textAlign: "center",
                                          boxShadow:
                                            "0 2px 10px rgba(74, 144, 226, 0.3)",
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
                                        onClick={() =>
                                          handleReadMore(post.slug)
                                        }
                                        style={{
                                          backgroundColor: "#4A90E2",
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
                                            "#0077BE";
                                          e.target.style.transform =
                                            "translateY(-2px)";
                                        }}
                                        onMouseLeave={(e) => {
                                          e.target.style.backgroundColor =
                                            "#4A90E2";
                                          e.target.style.transform =
                                            "translateY(0)";
                                        }}
                                      >
                                        Devamını Oku
                                      </button>

                                      {/* Bottom Border */}
                                      <div
                                        style={{
                                          marginTop: "20px",
                                          height: "3px",
                                          background:
                                            "linear-gradient(to right, #4A90E2, #0077BE)",
                                          borderRadius: "2px",
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Navigation Arrows */}
                  {blogPosts.length > 3 && !isMobile && (
                    <>
                      <button
                        className="news-nav-arrow"
                        onClick={prevSlide}
                        style={{
                          position: "absolute",
                          left: "-70px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "#4A90E2",
                          border: "none",
                          borderRadius: "50%",
                          width: "60px",
                          height: "60px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 6px 20px rgba(74, 144, 226, 0.4)",
                          transition: "all 0.3s ease",
                          zIndex: 10,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#0077BE";
                          e.target.style.transform =
                            "translateY(-50%) scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#4A90E2";
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
                        className="news-nav-arrow"
                        onClick={nextSlide}
                        style={{
                          position: "absolute",
                          right: "-70px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "#4A90E2",
                          border: "none",
                          borderRadius: "50%",
                          width: "60px",
                          height: "60px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 6px 20px rgba(74, 144, 226, 0.4)",
                          transition: "all 0.3s ease",
                          zIndex: 10,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#0077BE";
                          e.target.style.transform =
                            "translateY(-50%) scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#4A90E2";
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
                  {blogPosts.length > 3 && !isMobile && (
                    <div
                      className="news-indicators"
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
                            border: "2px solid #4A90E2",
                            backgroundColor:
                              currentSlide === index
                                ? "#4A90E2"
                                : "transparent",
                            cursor: "pointer",
                            transition: "all 0.4s ease",
                            boxShadow:
                              currentSlide === index
                                ? "0 4px 12px rgba(74, 144, 226, 0.3)"
                                : "none",
                          }}
                          onMouseEnter={(e) => {
                            if (currentSlide !== index) {
                              e.target.style.backgroundColor =
                                "rgba(74, 144, 226, 0.1)";
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
                color: "#4A90E2",
                border: "2px solid #4A90E2",
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
                  "linear-gradient(135deg, #4A90E2, #0077BE)";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow =
                  "0 10px 30px rgba(74, 144, 226, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#4A90E2";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
              onClick={handleViewAllBlogs}
            >
              TÜMÜNÜ GÖRÜNTÜLE
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          /* Section header adjustments */
          .container-fluid {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          /* Convert carousel to stack layout on mobile */
          .news-carousel-container {
            overflow: visible !important;
            min-height: auto !important;
          }

          .news-carousel-slides {
            display: block !important;
            transform: none !important;
          }

          .news-slide {
            min-width: 100% !important;
            display: block !important;
            gap: 20px !important;
            padding: 0 !important;
          }

          .news-card-item {
            flex: none !important;
            max-width: 100% !important;
            min-height: auto !important;
            margin-bottom: 2rem !important;
          }

          .news-card-content {
            border-radius: 12px !important;
          }

          /* Image adjustments */
          .news-card-content img {
            height: 200px !important;
          }

          /* Content padding adjustments */
          .news-card-content > div:last-child {
            padding: 1.5rem !important;
          }

          /* Title size adjustments */
          .news-card-content h4 {
            font-size: 1.1rem !important;
            margin-bottom: 1rem !important;
          }

          /* Content text adjustments */
          .news-card-content p {
            font-size: 0.9rem !important;
            line-height: 1.5 !important;
            margin-bottom: 1.5rem !important;
          }

          /* Button adjustments */
          .news-card-content button {
            padding: 0.75rem 1rem !important;
            font-size: 0.85rem !important;
          }

          /* Date badge adjustments */
          .news-card-content > div:first-child > div:last-child {
            top: 15px !important;
            left: 15px !important;
            padding: 6px 10px !important;
          }

          .news-card-content
            > div:first-child
            > div:last-child
            > div:first-child {
            font-size: 1rem !important;
          }

          .news-card-content
            > div:first-child
            > div:last-child
            > div:last-child {
            font-size: 0.7rem !important;
          }

          /* Hide navigation arrows on mobile */
          .news-nav-arrow {
            display: none !important;
          }

          /* Hide indicators on mobile */
          .news-indicators {
            display: none !important;
          }

          /* Loading cards */
          .news-loading-card > div {
            padding: 1.5rem !important;
            border-radius: 12px !important;
          }
        }

        @media (max-width: 576px) {
          /* Section title */
          h2 {
            font-size: 2rem !important;
            margin-bottom: 15px !important;
          }

          /* Section description */
          p {
            font-size: 1rem !important;
          }

          /* Card image smaller on very small screens */
          .news-card-content img {
            height: 180px !important;
          }

          /* More compact content */
          .news-card-content > div:last-child {
            padding: 1.25rem !important;
          }

          .news-card-content h4 {
            font-size: 1rem !important;
            line-height: 1.3 !important;
          }

          .news-card-content p {
            font-size: 0.85rem !important;
          }

          .news-card-content button {
            padding: 0.6rem 0.8rem !important;
            font-size: 0.8rem !important;
            border-radius: 6px !important;
          }

          /* Date badge even smaller */
          .news-card-content > div:first-child > div:last-child {
            padding: 5px 8px !important;
          }

          .news-card-content
            > div:first-child
            > div:last-child
            > div:first-child {
            font-size: 0.9rem !important;
          }

          .news-card-content
            > div:first-child
            > div:last-child
            > div:last-child {
            font-size: 0.65rem !important;
          }
        }

        @media (max-width: 480px) {
          /* Even more compact for very small devices */
          .news-card-content {
            border-radius: 10px !important;
          }

          .news-card-content img {
            height: 160px !important;
          }

          .news-card-content > div:last-child {
            padding: 1rem !important;
          }

          .news-card-content h4 {
            font-size: 0.95rem !important;
            margin-bottom: 0.75rem !important;
          }

          .news-card-content p {
            font-size: 0.8rem !important;
            margin-bottom: 1rem !important;
          }

          /* View All button adjustments */
          button:last-child {
            padding: 10px 20px !important;
            font-size: 0.9rem !important;
            border-radius: 6px !important;
          }
        }

        /* Override inline styles for mobile */
        @media (max-width: 768px) {
          .news-card-item {
            flex: none !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
};

export default LatestNews;
