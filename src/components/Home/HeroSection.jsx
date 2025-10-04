// src/components/Home/HeroSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          .hero-action-button {
            background: linear-gradient(135deg, #002efcff 0%, #001db8 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 12px !important;
            padding: 16px 24px !important;
            font-size: 1.1rem !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 15px rgba(0, 46, 252, 0.3) !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            text-align: center !important;
            text-decoration: none !important;
            line-height: 1.4 !important;
            box-sizing: border-box !important;
            display: block !important;
            width: 100% !important;
            min-height: 56px !important;
            margin: 0 !important;
            outline: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
          }

          .hero-action-button:hover {
            background: linear-gradient(135deg, #001db8 0%, #001299 100%) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(0, 46, 252, 0.4) !important;
          }

          .hero-action-button:active {
            transform: translateY(0px) !important;
            box-shadow: 0 2px 10px rgba(0, 46, 252, 0.3) !important;
          }

          .hero-button-container {
            display: flex !important;
            gap: 16px !important;
            justify-content: center !important;
            width: 100% !important;
            max-width: 600px !important;
            margin: 0 auto !important;
          }

          .hero-button-container .hero-action-button {
            flex: 1 !important;
          }

          @media (max-width: 768px) {
            .hero-button-container {
              flex-direction: column !important;
              padding: 0 20px !important;
            }
            
            .hero-action-button {
              padding: 14px 20px !important;
              font-size: 1.05rem !important;
            }
          }
        `}
      </style>
      <section
        id="section-hero"
        aria-label="section"
        className="hero-static jarallax"
        style={{
          width: "100%",
          maxWidth: "100%",
          padding: "50px",
          minHeight: "90vh",
          position: "relative",
          backgroundImage: "url(/images/background/16.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Background overlay */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
          }}
        ></div>

        {/* Full width content container */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            minHeight: "90vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "100px 0 60px 0",
          }}
        >
          <div
            className="container"
            style={{ width: "100%", maxWidth: "1200px" }}
          >
            <div className="row align-items-center">
              <div className="col-lg-12 text-center text-light mb-5">
                {/* Logo */}
                <div
                  style={{
                    marginBottom: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/images/logo/UMİT-2.png"
                    alt="Ümit a rent car"
                    className="hero-section-logo"
                    style={{
                      maxWidth: "300px",
                      width: "100%",
                      height: "auto",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>

                <h1
                  style={{
                    color: "white",
                    textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
                    fontSize: "2.8rem",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    lineHeight: "1.2",
                  }}
                >
                  Size en uygun aracı bulalım.
                </h1>
                <p
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                    fontSize: "1.2rem",
                    marginBottom: "40px",
                    maxWidth: "600px",
                    margin: "0 auto 40px auto",
                  }}
                >
                  ANTALYA YILLIK ARAÇ KİRALAMA | FİLO KİRALAMA ANTALYA AYLIK
                  ARAÇ KİRALAMA
                </p>

                {/* Action Buttons */}
                <div className="hero-button-container">
                  <button
                    type="button"
                    className="hero-action-button"
                    onClick={() => navigate("/cars")}
                  >
                    🚗 Araç Kiralama
                  </button>

                  <button
                    type="button"
                    className="hero-action-button"
                    onClick={() => navigate("/transfer-service")}
                  >
                    🚐 Transfer Hizmeti
                  </button>
                </div>
              </div>

              {/* Process Steps */}
              <div className="col-lg-12 mt-5">
                <div className="row text-center">
                  {[
                    {
                      number: "1",
                      title: "Araç Seçin",
                      desc: "Premium filomuzdan istediğinizi seçin",
                    },
                    {
                      number: "2",
                      title: "Konum ve Tarih Belirleyin",
                      desc: "Kiralama tercihlerinizi ayarlayın",
                    },
                    {
                      number: "3",
                      title: "Rezervasyon Yapın",
                      desc: "Yerinizin garantisini alın",
                    },
                    {
                      number: "4",
                      title: "Arkanıza Yaslanın",
                      desc: "Yolculuğunuzun keyfini çıkarın",
                    },
                  ].map((step, index) => (
                    <div key={index} className="col-lg-3 col-md-6 mb-4">
                      <div style={{ color: "white", textAlign: "center" }}>
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            backgroundColor: "#002efcff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 15px auto",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            boxShadow: "0 4px 15px rgba(0, 94, 255, 0.4)",
                          }}
                        >
                          {step.number}
                        </div>
                        <h4
                          style={{
                            color: "white",
                            textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                            marginBottom: "10px",
                          }}
                        >
                          {step.title}
                        </h4>
                        <p
                          style={{
                            color: "rgba(255,255,255,0.9)",
                            textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                          }}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;