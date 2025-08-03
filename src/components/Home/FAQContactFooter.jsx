// src/components/Home/FAQContactFooter.jsx
import React, { useState } from "react";

const FAQContactFooter = () => {
  const [openFAQ, setOpenFAQ] = useState(1); // İlk FAQ açık olsun

  // FAQ verilerini buradan kolayca değiştirebilirsin
  const faqData = [
    {
      id: 1,
      question: "How do I get started with Car Rental?",
      answer:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
    },
    {
      id: 2,
      question: "Can I rent a car with a debit card?",
      answer:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
    },
    {
      id: 3,
      question: "What kind of Car Rental do I need?",
      answer:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
    },
    {
      id: 4,
      question: "What is a rental car security deposit?",
      answer:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
    },
    {
      id: 5,
      question: "Can I cancel or modify my reservation?",
      answer:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
    },
    {
      id: 6,
      question: "Is it possible to extend my rental period?",
      answer:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
    },
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <>
      {/* FAQ Section */}
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
                Have Any Questions?
              </h2>
            </div>
          </div>

          {/* FAQ Grid */}
          <div className="row">
            {/* Sol Taraf */}
            <div className="col-md-6">
              {faqData.slice(0, 3).map((faq) => (
                <div key={faq.id} style={{ marginBottom: "20px" }}>
                  <div
                    onClick={() => toggleFAQ(faq.id)}
                    style={{
                      backgroundColor: "white",
                      padding: "20px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      border:
                        openFAQ === faq.id
                          ? "2px solid #00ff88"
                          : "2px solid transparent",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5
                        style={{
                          color: "#2c3e50",
                          fontWeight: "600",
                          margin: "0",
                          fontSize: "1.1rem",
                        }}
                      >
                        {faq.question}
                      </h5>
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          backgroundColor: "#00ff88",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "1.2rem",
                          flexShrink: 0,
                          marginLeft: "10px",
                          transform:
                            openFAQ === faq.id
                              ? "rotate(45deg)"
                              : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        +
                      </div>
                    </div>

                    {openFAQ === faq.id && (
                      <div
                        style={{
                          marginTop: "15px",
                          paddingTop: "15px",
                          borderTop: "1px solid #e9ecef",
                          color: "#6c757d",
                          lineHeight: "1.6",
                          fontSize: "0.95rem",
                        }}
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Sağ Taraf */}
            <div className="col-md-6">
              {faqData.slice(3, 6).map((faq) => (
                <div key={faq.id} style={{ marginBottom: "20px" }}>
                  <div
                    onClick={() => toggleFAQ(faq.id)}
                    style={{
                      backgroundColor: "white",
                      padding: "20px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      border:
                        openFAQ === faq.id
                          ? "2px solid #00ff88"
                          : "2px solid transparent",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5
                        style={{
                          color: "#2c3e50",
                          fontWeight: "600",
                          margin: "0",
                          fontSize: "1.1rem",
                        }}
                      >
                        {faq.question}
                      </h5>
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          backgroundColor: "#00ff88",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "1.2rem",
                          flexShrink: 0,
                          marginLeft: "10px",
                          transform:
                            openFAQ === faq.id
                              ? "rotate(45deg)"
                              : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        +
                      </div>
                    </div>

                    {openFAQ === faq.id && (
                      <div
                        style={{
                          marginTop: "15px",
                          paddingTop: "15px",
                          borderTop: "1px solid #e9ecef",
                          color: "#6c757d",
                          lineHeight: "1.6",
                          fontSize: "0.95rem",
                        }}
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Green Contact Section */}
      <section style={{ backgroundColor: "#00ff88", padding: "60px 0" }}>
        <div className="container">
          <div className="row align-items-center">
            {/* Sol Taraf - Text */}
            <div className="col-lg-6">
              <p
                style={{
                  color: "white",
                  fontSize: "1.1rem",
                  margin: "0 0 10px 0",
                  opacity: "0.9",
                }}
              >
                Call us for further information
              </p>
              <h3
                style={{
                  color: "white",
                  fontSize: "2.2rem",
                  fontWeight: "700",
                  lineHeight: "1.3",
                  margin: "0",
                }}
              >
                Rentaly customer care
                <br />
                is here to help you
                <br />
                anytime.
              </h3>
            </div>

            {/* Sağ Taraf - Phone & Button */}
            <div className="col-lg-6 text-center">
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    fontSize: "3rem",
                    marginBottom: "10px",
                  }}
                >
                  📞
                </div>
                <p
                  style={{
                    color: "white",
                    fontSize: "1rem",
                    margin: "0 0 5px 0",
                    opacity: "0.9",
                  }}
                >
                  CALL US NOW
                </p>
                <h2
                  style={{
                    color: "white",
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    margin: "0 0 20px 0",
                  }}
                >
                  1 200 333 800
                </h2>
                <button
                  style={{
                    backgroundColor: "white",
                    color: "#00ff88",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 30px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.9)";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#2c3e50", padding: "60px 0 20px 0" }}>
        <div className="container">
          <div className="row">
            {/* About Rentaly */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h5
                style={{
                  color: "white",
                  fontSize: "1.3rem",
                  fontWeight: "700",
                  marginBottom: "20px",
                }}
              >
                About Rentaly
              </h5>
              <p
                style={{
                  color: "#bbb",
                  lineHeight: "1.6",
                  fontSize: "0.95rem",
                }}
              >
                Where quality meets affordability. We provide fast, reliable and
                secure Car Rental services.
              </p>
              <div style={{ marginTop: "20px" }}>
                <img
                  src="/images/logo/logo-light.png"
                  alt="Rentaly"
                  style={{ height: "40px" }}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h5
                style={{
                  color: "white",
                  fontSize: "1.3rem",
                  fontWeight: "700",
                  marginBottom: "20px",
                }}
              >
                Contact Info
              </h5>
              <div style={{ color: "#bbb", fontSize: "0.95rem" }}>
                <p style={{ marginBottom: "10px" }}>
                  📍 08 W 36th St, New York, NY 10001
                </p>
                <p style={{ marginBottom: "10px" }}>📞 1 200 333 800</p>
                <p style={{ marginBottom: "10px" }}>✉️ contact@rentaly.com</p>
                <p style={{ marginBottom: "0" }}>🕒 Mon - Sun: 08:00 - 18:00</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h5
                style={{
                  color: "white",
                  fontSize: "1.3rem",
                  fontWeight: "700",
                  marginBottom: "20px",
                }}
              >
                Quick Links
              </h5>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "About",
                  "Cars",
                  "Booking",
                  "FAQ",
                  "Contact",
                  "Terms & Conditions",
                  "Privacy Policy",
                ].map((link, index) => (
                  <li key={index} style={{ marginBottom: "8px" }}>
                    <a
                      href="#"
                      style={{
                        color: "#bbb",
                        textDecoration: "none",
                        fontSize: "0.95rem",
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#00ff88")}
                      onMouseLeave={(e) => (e.target.style.color = "#bbb")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Network */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h5
                style={{
                  color: "white",
                  fontSize: "1.3rem",
                  fontWeight: "700",
                  marginBottom: "20px",
                }}
              >
                Social Network
              </h5>
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                {[
                  { name: "Facebook", icon: "📘", url: "#" },
                  { name: "Twitter", icon: "🐦", url: "#" },
                  { name: "Instagram", icon: "📷", url: "#" },
                  { name: "LinkedIn", icon: "💼", url: "#" },
                  { name: "YouTube", icon: "📺", url: "#" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    style={{
                      width: "45px",
                      height: "45px",
                      backgroundColor: "#3b4a5a",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#00ff88";
                      e.target.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#3b4a5a";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div
            className="row"
            style={{
              borderTop: "1px solid #3b4a5a",
              paddingTop: "20px",
              marginTop: "20px",
            }}
          >
            <div className="col-12 text-center">
              <p style={{ color: "#bbb", margin: "0", fontSize: "0.9rem" }}>
                Copyright 2025 - Rentaly by Designesia. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FAQContactFooter;
