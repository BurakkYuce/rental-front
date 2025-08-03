// src/components/Home/LatestNews.jsx
import React from "react";

const LatestNews = () => {
  // Blog verilerini buradan kolayca değiştirebilirsin
  const blogPosts = [
    {
      id: 1,
      date: {
        day: "10",
        month: "MAR",
      },
      title: "Enjoy Best Travel Experience",
      excerpt:
        "Dolore officia sint incididunt non excepteur ea mollit commodo ut enim reprehenderit cupidatat labore ad laborum consectetur.",
      image: "/images/news/pic-blog-1.jpg",
      link: "/blog/enjoy-best-travel-experience",
    },
    {
      id: 2,
      date: {
        day: "12",
        month: "MAR",
      },
      title: "The Future of Car Rent",
      excerpt:
        "Dolore officia sint incididunt non excepteur ea mollit commodo ut enim reprehenderit cupidatat labore ad laborum consectetur.",
      image: "/images/news/pic-blog-2.jpg",
      link: "/blog/future-of-car-rent",
    },
    {
      id: 3,
      date: {
        day: "14",
        month: "MAR",
      },
      title: "Holiday Tips For Backpacker",
      excerpt:
        "Dolore officia sint incididunt non excepteur ea mollit commodo ut enim reprehenderit cupidatat labore ad laborum consectetur.",
      image: "/images/news/pic-blog-3.jpg",
      link: "/blog/holiday-tips-backpacker",
    },
  ];

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
          {blogPosts.map((post) => (
            <div key={post.id} className="col-lg-4 col-md-6 mb-4">
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
                    src={post.image}
                    alt={post.title}
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
                      {post.date.day}
                    </div>
                    <div
                      style={{
                        color: "white",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        lineHeight: "1",
                      }}
                    >
                      {post.date.month}
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
                    onClick={() => (window.location.href = post.link)}
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
                      background: "linear-gradient(to right, #00ff88, #00cc6a)",
                      borderRadius: "2px",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
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
              onClick={() => (window.location.href = "/blog")}
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
