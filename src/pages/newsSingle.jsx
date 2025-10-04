// src/pages/NewsSingle.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BackToHomeButton from "../components/BackToHomeButton";
import { publicAPI } from "../services/api";
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

  // Load blog post and related posts
  useEffect(() => {
    if (slug) {
      loadBlogPost();
      loadRecentPosts();
    }
  }, [slug]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔄 Blog yazısı yükleniyor, slug:", slug);

      const response = await publicAPI.getNewsById(slug);
      console.log("📰 Blog API yanıtı:", response);
      console.log("📊 Yanıt veri yapısı:", response.data);

      // Handle different possible response structures
      let blogData = null;
      if (response.data && response.data.success) {
        blogData = response.data.data || response.data.blog;
      } else if (response.data) {
        blogData = response.data;
      }

      console.log("📰 İşlenmiş blog verisi:", blogData);

      if (blogData) {
        // Debug image fields specifically
        console.log("🖼️ Blog resim alanları:", {
          featuredImage: blogData.featuredImage,
          mainImage: blogData.mainImage,
          main_image: blogData.main_image,
          image: blogData.image,
          images: blogData.images,
          thumbnail: blogData.thumbnail,
        });

        setBlog(blogData);
        // Don't set related posts from blog data, we load them separately
      } else {
        setError("Blog yazısı verisi bulunamadı");
      }
    } catch (error) {
      console.error("❌ Blog yazısı yüklenemedi:", error);
      if (error.response?.status === 404) {
        setError("Blog yazısı bulunamadı");
      } else {
        setError("Blog yazısı yüklenemedi. Lütfen daha sonra tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load recent posts for sidebar
  const loadRecentPosts = async () => {
    try {
      console.log("🔄 Son yazılar yükleniyor...");
      const response = await publicAPI.getNews({
        limit: 5,
        page: 1,
      });
      console.log("📰 Son yazılar API yanıtı:", response);

      // Handle different possible response structures
      let postsData = [];
      if (response.data && response.data.success) {
        postsData =
          response.data.data?.blogs || response.data.data?.posts || [];
      } else if (response.data && response.data.data) {
        postsData = response.data.data.blogs || response.data.data || [];
      }

      console.log("📰 Son yazılar işlenmiş veri:", postsData);

      // Filter out current post and take only 4 recent posts
      const filteredPosts = postsData
        .filter((post) => post.slug !== slug)
        .slice(0, 4);
      setRelatedPosts(filteredPosts);
    } catch (error) {
      console.error("❌ Son yazılar yüklenemedi:", error);
      // Don't set error for recent posts, just log it
    }
  };

  const socialIcons = [
    { name: "twitter", icon: "fa-twitter" },
    { name: "facebook", icon: "fa-facebook" },
    { name: "reddit", icon: "fa-reddit" },
    { name: "linkedin", icon: "fa-linkedin" },
    { name: "pinterest", icon: "fa-pinterest" },
    { name: "stumbleupon", icon: "fa-stumbleupon" },
    { name: "delicious", icon: "fa-delicious" },
    { name: "envelope", icon: "fa-envelope" },
  ];

  return (
    <div
      className="news-single-page"
      style={{ minHeight: "100vh", backgroundColor: "#fff" }}
    >
      {/* Header */}
      <Header />

      {/* Back to Home Button */}
      <BackToHomeButton />

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
                  {loading
                    ? "Yükleniyor..."
                    : error
                    ? "Hata"
                    : blog?.title || "Blog Yazısı"}
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
                    <span className="visually-hidden">Yükleniyor...</span>
                  </div>
                  <p style={{ marginTop: "1rem", color: "#666" }}>
                    Blog yazısı yükleniyor...
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
                  <h3>Ups!</h3>
                  <p>{error}</p>
                  <Link
                    to="/news"
                    style={{
                      color: "#1ECB15",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    ← Bloga Dön
                  </Link>
                </div>
              ) : blog ? (
                <div style={{ marginBottom: "40px" }}>
                  {/* Article Meta */}
                  <div
                    style={{
                      marginBottom: "20px",
                      paddingBottom: "20px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap",
                        fontSize: "0.9rem",
                        color: "#666",
                      }}
                    >
                      <span>Yazar: {blog.author?.name || "Admin"}</span>
                      <span>•</span>
                      <span>{blog.readingTimeDisplay}</span>
                      <span>•</span>
                      <span
                        style={{
                          backgroundColor: "#1ECB15",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "0.8rem",
                        }}
                      >
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  {/* Featured Image */}
                  <img
                    src={
                      blog.featuredImage?.url ||
                      blog.mainImage?.url ||
                      blog.main_image?.url ||
                      blog.image?.url ||
                      blog.image ||
                      blog.images?.main?.url ||
                      blog.images?.featured?.url ||
                      blog.thumbnail?.url ||
                      blog.thumbnail ||
                      "/images/news/big.jpg"
                    }
                    alt={
                      blog.featuredImage?.alt ||
                      blog.mainImage?.alt ||
                      blog.main_image?.alt ||
                      blog.image?.alt ||
                      blog.title
                    }
                    onError={(e) => {
                      console.warn(
                        "🖼️ Blog ana resmi yüklenemedi:",
                        e.target.src
                      );
                      e.target.src = "/images/news/big.jpg";
                    }}
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "30px",
                    }}
                  />

                  {/* Excerpt */}
                  {blog.excerpt &&
                    (() => {
                      // URL'yi bul ve temiz metni ayır
                      const words = blog.excerpt.split(" ");
                      const urlLink =
                        words.find((word) => word.includes("https")) ||
                        blog.excerpt;
                      const cleanText = blog.excerpt
                        .split(" ")
                        .filter((word) => !word.includes("https"))
                        .join(" ");

                      return (
                        <div
                          style={{
                            backgroundColor: "#f8f9fa",
                            padding: "20px",
                            borderRadius: "8px",
                            borderLeft: "4px solid #1ECB15",
                            marginBottom: "30px",
                            fontSize: "1.1rem",
                            fontStyle: "italic",
                            lineHeight: "1.6",
                            color: "#555",
                          }}
                        >
                          <a
                            href={urlLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "inherit",
                              textDecoration: "none",
                              display: "block",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.color = "#1ECB15";
                              e.target.style.textDecoration = "underline";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = "#555";
                              e.target.style.textDecoration = "none";
                            }}
                          >
                            {cleanText}
                          </a>
                        </div>
                      );
                    })()}

                  {/* Article Content */}
                  <div
                    style={{
                      fontSize: "1.1rem",
                      lineHeight: "1.8",
                      color: "#666",
                      marginBottom: "30px",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: blog.content
                        ? typeof blog.content === "string"
                          ? blog.content.replace(/\n/g, "<br>")
                          : blog.content
                        : blog.description ||
                          blog.excerpt ||
                          "İçerik mevcut değil",
                    }}
                  />

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div
                      style={{
                        marginTop: "30px",
                        paddingTop: "20px",
                        borderTop: "1px solid #eee",
                      }}
                    >
                      <h5
                        style={{
                          marginBottom: "15px",
                          fontWeight: "600",
                          color: "#333",
                        }}
                      >
                        Etiketler:
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
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
              <div
                style={{
                  backgroundColor: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  marginBottom: "30px",
                }}
              >
                <h4
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    marginBottom: "20px",
                    color: "#333",
                  }}
                >
                  Arkadaşlarınla Paylaş
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
              <div
                style={{
                  backgroundColor: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  marginBottom: "30px",
                }}
              >
                <h4
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    marginBottom: "20px",
                    color: "#333",
                  }}
                >
                  Son Yazılar
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
                  {relatedPosts.length > 0 ? (
                    relatedPosts.map((post) => (
                      <li
                        key={post._id || post.id}
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
                                "🖼️ Son yazı resmi yüklenemedi:",
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
                              onMouseEnter={(e) => {
                                e.target.style.color = "#1ECB15";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.color = "#333";
                              }}
                            >
                              {post.title}
                            </Link>
                          </h4>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#666",
                        fontSize: "0.9rem",
                      }}
                    >
                      Henüz gösterilecek yazı yok
                    </li>
                  )}
                </ul>
              </div>

              {/* About Us */}
              <div
                style={{
                  backgroundColor: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  marginBottom: "30px",
                }}
              >
                <h4
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    marginBottom: "20px",
                    color: "#333",
                  }}
                >
                  Hakkımızda
                </h4>
                <div
                  style={{
                    width: "50px",
                    height: "3px",
                    backgroundColor: "#1ECB15",
                    marginBottom: "25px",
                  }}
                ></div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: "1.6",
                    color: "#666",
                    margin: 0,
                  }}
                >
                  Yılların deneyimi ile araç kiralama sektöründe güvenilir hizmet anlayışımızla sizlere en kaliteli araçları sunuyoruz. Müşteri memnuniyetini ön planda tutarak, seyahat deneyiminizi konforlu ve güvenli hale getirmeyi hedefliyoruz. Modern araç filomuz ve profesyonel ekibimizle her zaman yanınızdayız.
                </p>
              </div>

              {/* Tags */}
              <div
                style={{
                  backgroundColor: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h4
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    marginBottom: "20px",
                    color: "#333",
                  }}
                >
                  Etiketler
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
                      <span
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
                        seyahat
                      </span>
                      <span
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
                        arabalar
                      </span>
                      <span
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
                        kiralama
                      </span>
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