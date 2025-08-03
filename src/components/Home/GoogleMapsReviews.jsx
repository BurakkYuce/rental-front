// src/components/Home/GoogleMapsReviews.jsx
import React from "react";

const GoogleMapsReviews = () => {
  return (
    <section style={{ backgroundColor: "white", padding: "80px 0" }}>
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
              Find Us & Read Reviews
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#6c757d",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              Visit our location and check out what our customers are saying
              about MITCAR RENTAL services.
            </p>
          </div>
        </div>

        <div className="row align-items-center">
          {/* Sol Taraf - Google Maps */}
          <div className="col-lg-8 mb-4">
            <div
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                height: "450px",
              }}
            >
              {/* Google Maps iframe */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.4729896829666!2d27.1394!3d38.4237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbd9b6c3a4d4d1%3A0x6d4e4f8b2c7a8e9f!2zTcSwVENBUiBSRU5UQUw!5e0!3m2!1str!2str!4v1689765432123!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MITCAR RENTAL Location"
              ></iframe>
            </div>
          </div>

          {/* Sağ Taraf - Company Info & Quick Reviews */}
          <div className="col-lg-4">
            {/* Company Info Card */}
            <div
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "15px",
                padding: "30px",
                marginBottom: "20px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <h4
                style={{
                  color: "#2c3e50",
                  fontSize: "1.4rem",
                  fontWeight: "700",
                  marginBottom: "20px",
                }}
              >
                MITCAR RENTAL
              </h4>

              {/* Rating */}
              <div style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "5px",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{ color: "#ffc107", fontSize: "1.2rem" }}
                    >
                      ⭐
                    </span>
                  ))}
                  <span
                    style={{
                      marginLeft: "10px",
                      color: "#6c757d",
                      fontWeight: "600",
                    }}
                  >
                    4.8/5
                  </span>
                </div>
                <p
                  style={{ color: "#6c757d", fontSize: "0.9rem", margin: "0" }}
                >
                  150+ Google Reviews
                </p>
              </div>

              {/* Contact Info */}
              <div
                style={{ borderTop: "1px solid #dee2e6", paddingTop: "15px" }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ color: "#2c3e50" }}>📍 Address:</strong>
                  <p
                    style={{
                      color: "#6c757d",
                      margin: "5px 0",
                      fontSize: "0.9rem",
                    }}
                  >
                    Alsancak, İzmir, Turkey
                  </p>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ color: "#2c3e50" }}>📞 Phone:</strong>
                  <p
                    style={{
                      color: "#6c757d",
                      margin: "5px 0",
                      fontSize: "0.9rem",
                    }}
                  >
                    +90 555 123 45 67
                  </p>
                </div>

                <div>
                  <strong style={{ color: "#2c3e50" }}>🕒 Hours:</strong>
                  <p
                    style={{
                      color: "#6c757d",
                      margin: "5px 0",
                      fontSize: "0.9rem",
                    }}
                  >
                    Mon-Sun: 08:00 - 22:00
                  </p>
                </div>
              </div>
            </div>

            {/* Google Reviews Button */}
            <button
              onClick={() =>
                window.open(
                  "https://www.google.com/search?q=MITCAR+RENTAL+Yorumlar&rflfq=1&tbm=lcl",
                  "_blank"
                )
              }
              style={{
                width: "100%",
                backgroundColor: "#4285f4",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "15px 20px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#3367d6";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#4285f4";
                e.target.style.transform = "translateY(0)";
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>📱</span>
              View All Google Reviews
            </button>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <div
              style={{
                backgroundColor: "#00ff88",
                borderRadius: "10px",
                padding: "20px",
                color: "white",
              }}
            >
              <h5 style={{ margin: "0 0 10px 0", fontWeight: "700" }}>
                📍 Visit Us Today!
              </h5>
              <p style={{ margin: "0", fontSize: "1rem" }}>
                Come to our location or click the button above to read authentic
                customer reviews on Google Maps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleMapsReviews;
