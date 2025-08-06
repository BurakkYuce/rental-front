// src/pages/NewsSingle.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { blogAPI } from "../services/api";
import "../assets/css/bootstrap.min.css";
import "../assets/css/plugins.css";
import "../assets/css/style.css";

const NewsSingle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // State for blog data
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  // Load blog post
  useEffect(() => {
    if (slug) {
      loadBlogPost();
    }
  }, [slug]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await blogAPI.getBlogBySlug(slug);
      setBlog(response.data.data);
      setRelatedPosts(response.data.data.relatedPosts || []);
    } catch (error) {
      console.error("Failed to load blog post:", error);
      if (error.response?.status === 404) {
        setError("Blog post not found");
      } else {
        setError("Failed to load blog post");
      }
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
    });
  };

  const socialIcons = [
    { name: "twitter", icon: "fa-twitter" },
    { name: "facebook", icon: "fa-facebook" },
    { name: "reddit", icon: "fa-reddit" },
    { name: "linkedin", icon: "fa-linkedin" },
    { name: "pinterest", icon: "fa-pinterest" },
    { name: "stumbleupon", icon: "fa-stumbleupon" },
    { name: "delicious", icon: "fa-delicious" },
    { name: "envelope", icon: "fa-envelope" }
  ];

  return (
    <div className="news-single-page" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section
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
                <h1 style={{ fontSize: "3rem", fontWeight: "bold", margin: 0 }}>
                  {loading ? "Loading..." : error ? "Error" : blog?.title || "Blog Post"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div className="row">
            {/* Article Content */}
            <div className="col-md-8">
              {loading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p style={{ marginTop: "1rem", color: "#666" }}>Loading blog post...</p>
                </div>
              ) : error ? (
                <div style={{ textAlign: "center", padding: "50px", color: "#dc3545" }}>
                  <h3>Oops!</h3>
                  <p>{error}</p>
                  <Link to="/news" style={{ color: "#1ECB15", textDecoration: "none", fontWeight: "500" }}>
                    ← Back to Blog
                  </Link>
                </div>
              ) : blog ? (
                <div style={{ marginBottom: "40px" }}>
                  {/* Article Meta */}
                  <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #eee" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", fontSize: "0.9rem", color: "#666" }}>
                      <span>By {blog.author?.name || "Admin"}</span>
                      <span>•</span>
                      <span>{formatDate(blog.publishedAt)}</span>
                      <span>•</span>
                      <span>{blog.readingTimeDisplay}</span>
                      <span>•</span>
                      <span style={{ backgroundColor: "#1ECB15", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem" }}>
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  {/* Featured Image */}
                  <img
                    src={blog.featuredImage?.url || "/images/news/big.jpg"}
                    alt={blog.featuredImage?.alt || blog.title}
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "30px"
                    }}
                  />

                  {/* Excerpt */}
                  {blog.excerpt && (
                    <div style={{
                      backgroundColor: "#f8f9fa",
                      padding: "20px",
                      borderRadius: "8px",
                      borderLeft: "4px solid #1ECB15",
                      marginBottom: "30px",
                      fontSize: "1.1rem",
                      fontStyle: "italic",
                      lineHeight: "1.6",
                      color: "#555"
                    }}>
                      {blog.excerpt}
                    </div>
                  )}

                  {/* Article Content */}
                  <div 
                    style={{ 
                      fontSize: "1.1rem", 
                      lineHeight: "1.8", 
                      color: "#666",
                      marginBottom: "30px"
                    }}
                    dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br>') }}
                  />

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
                      <h5 style={{ marginBottom: "15px", fontWeight: "600", color: "#333" }}>Tags:</h5>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              display: "inline-block",
                              padding: "6px 12px",
                              backgroundColor: "#f8f9fa",
                              color: "#666",
                              borderRadius: "20px",
                              fontSize: "0.85rem",
                              border: "1px solid #e9ecef",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

            </div>

            {/* Sidebar */}
            <div className="col-md-4">
              {/* Share with Friends */}
              <div style={{ 
                backgroundColor: "white", 
                padding: "25px", 
                borderRadius: "12px", 
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                marginBottom: "30px" 
              }}>
                <h4 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "20px", color: "#333" }}>
                  Share With Friends
                </h4>
                <div
                  style={{
                    width: "50px",
                    height: "3px",
                    backgroundColor: "#1ECB15",
                    marginBottom: "25px",
                  }}
                ></div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {socialIcons.map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        color: "#666",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        border: "1px solid #e9ecef",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#1ECB15";
                        e.target.style.color = "white";
                        e.target.style.borderColor = "#1ECB15";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#f8f9fa";
                        e.target.style.color = "#666";
                        e.target.style.borderColor = "#e9ecef";
                      }}
                    >
                      <i className={`fa ${social.icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div style={{ 
                backgroundColor: "white", 
                padding: "25px", 
                borderRadius: "12px", 
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                marginBottom: "30px" 
              }}>
                <h4 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "20px", color: "#333" }}>
                  Recent Posts
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
                  {relatedPosts.map((post) => (
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
                          src={post.featuredImage?.url || "/images/news-thumbnail/pic-blog-1.jpg"}
                          alt={post.title}
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
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "#666",
                          }}
                        >
                          {formatDate(post.publishedAt)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About Us */}
              <div style={{ 
                backgroundColor: "white", 
                padding: "25px", 
                borderRadius: "12px", 
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                marginBottom: "30px" 
              }}>
                <h4 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "20px", color: "#333" }}>
                  About Us
                </h4>
                <div
                  style={{
                    width: "50px",
                    height: "3px",
                    backgroundColor: "#1ECB15",
                    marginBottom: "25px",
                  }}
                ></div>
                <p style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "#666", margin: 0 }}>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                </p>
              </div>

              {/* Tags */}
              <div style={{ 
                backgroundColor: "white", 
                padding: "25px", 
                borderRadius: "12px", 
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" 
              }}>
                <h4 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "20px", color: "#333" }}>
                  Tags
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
                  {blog?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        backgroundColor: "#f8f9fa",
                        color: "#666",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        border: "1px solid #e9ecef",
                      }}
                    >
                      {tag}
                    </span>
                  )) || (
                    <>
                      <span style={{ display: "inline-block", padding: "6px 12px", backgroundColor: "#f8f9fa", color: "#666", borderRadius: "20px", fontSize: "0.85rem", border: "1px solid #e9ecef" }}>travel</span>
                      <span style={{ display: "inline-block", padding: "6px 12px", backgroundColor: "#f8f9fa", color: "#666", borderRadius: "20px", fontSize: "0.85rem", border: "1px solid #e9ecef" }}>cars</span>
                      <span style={{ display: "inline-block", padding: "6px 12px", backgroundColor: "#f8f9fa", color: "#666", borderRadius: "20px", fontSize: "0.85rem", border: "1px solid #e9ecef" }}>rental</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsSingle;