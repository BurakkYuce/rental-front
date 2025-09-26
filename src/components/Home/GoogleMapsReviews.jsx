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
              Bizi Ziyaret Edin, Deneyimleri Keşfedin
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
              MITCAR RENTAL ayrıcalığını yerinde yaşayın ve memnun
              müşterilerimizin gerçek deneyimlerini okuyarak ilham alın.
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
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d797.7384654839356!2d30.735125999999998!3d36.891452!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c385ced440d121%3A0x6d4faf414ac05dee!2sM%C4%B0TCAR%20RENTAL!5e0!3m2!1str!2str!4v1755206717251!5m2!1str!2str"
                allowFullScreen=""
                loading="lazy"
                allow="accelerometer; gyroscope; camera; microphone; fullscreen"
                referrerPolicy="no-referrer-when-downgrade"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                title="MITCAR RENTAL Konumu"
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
                    5/5
                  </span>
                </div>
                <p
                  style={{ color: "#6c757d", fontSize: "0.9rem", margin: "0" }}
                >
                  30+ Google Değerlendirmesi
                </p>
              </div>

              {/* Contact Info */}
              <div
                style={{ borderTop: "1px solid #dee2e6", paddingTop: "15px" }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ color: "#2c3e50" }}>📍 Adres:</strong>
                  <p
                    style={{
                      color: "#6c757d",
                      margin: "5px 0",
                      fontSize: "0.9rem",
                    }}
                  >
                    Antalya , Muratpaşa , Türkiye
                  </p>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ color: "#2c3e50" }}>📞 Telefon:</strong>
                  <p
                    style={{
                      color: "#6c757d",
                      margin: "5px 0",
                      fontSize: "0.9rem",
                    }}
                  >
                    +90 536 603 99 07
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
                    Pazartesi - Cuma: 08:00 - 18:00
                  </p>
                </div>
              </div>
            </div>

            {/* Google Reviews Button */}
            <button
              onClick={() =>
                window.open(
                  "                  https://www.google.com/maps?q=M%C4%B0TCAR+RENTAL,+K%C4%B1z%C4%B1ltoprak,+939.+Sk.+6/B,+07300+Muratpa%C5%9Fa/Antalya&ftid=0x14c385ced440d121:0x6d4faf414ac05dee&entry=gps&lucs=,94284475,94224825,94227247,94227248,94231188,47071704,47069508,94218641,94282134,94203019,47084304,94286863&g_ep=CAISEjI1LjMzLjIuNzkzNTkyNzA0MBgAIIgnKmwsOTQyODQ0NzUsOTQyMjQ4MjUsOTQyMjcyNDcsOTQyMjcyNDgsOTQyMzExODgsNDcwNzE3MDQsNDcwNjk1MDgsOTQyMTg2NDEsOTQyODIxMzQsOTQyMDMwMTksNDcwODQzMDQsOTQyODY4NjNCAlRS&skid=6118a968-e1e8-4dfa-83b6-6ed0b6808a2d&g_st=ipc",
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
              Tüm Değerlendirmeleri Görüntüleyin
            </button>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <div
              style={{
                backgroundColor: "#00aeffff",
                borderRadius: "10px",
                padding: "20px",
                color: "white",
              }}
            >
              <h5 style={{ margin: "0 0 10px 0", fontWeight: "700" }}>
                📍 Bizi Ziyaret Edin! !
              </h5>
              <p style={{ margin: "0", fontSize: "1rem" }}>
                Lokasyonumuza uğrayın veya yukarıdaki butona tıklayarak Google
                Haritalar’daki gerçek müşteri yorumlarımızı okuyun.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleMapsReviews;
