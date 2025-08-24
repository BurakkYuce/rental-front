import React from "react";

const GooglePanorama = () => {
  return (
    <>
      {/* CSS Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .panorama-container {
            height: 450px;
          }
          
          @media (min-width: 576px) {
            .panorama-container {
              height: 450px;
            }
          }
          
          @media (min-width: 768px) {
            .panorama-container {
              height: 450px;
            }
            .panorama-section-container {
              max-width: 1200px;
            }
          }
          
          @media (min-width: 992px) {
            .panorama-container {
              height: 450px;
            }
            .panorama-section-container {
              max-width: 1400px;
            }
          }
          
          @media (min-width: 1200px) {
            .panorama-container {
              height: 450px;
            }
          }
          
          @media (min-width: 1400px) {
            .panorama-container {
              height: 450px;
            }
            .panorama-section-container {
              max-width: 1600px;
            }
          }
        `,
        }}
      />

      <section
        className="google-panorama-section"
        style={{
          padding: "80px 0",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          className="container panorama-section-container"
          style={{ maxWidth: "1000px" }}
        >
          <div className="row justify-content-center">
            <div className="col-12">
              {/* Section Header */}
              <div className="text-center mb-5">
                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    color: "#333",
                    marginBottom: "15px",
                  }}
                >
                  Konumumuzu Keşfedin
                </h2>
                <p
                  style={{
                    fontSize: "1.1rem",
                    color: "#666",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  360° panorama görünümü ile çevremizi sanal olarak gezin
                </p>
              </div>

              {/* Panorama Container */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "15px",
                  padding: "20px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  className="panorama-container"
                  style={{
                    position: "relative",
                    width: "100%",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!4v1755952719679!6m8!1m7!1sca-PtWn6CMhLbbgGSQYmJg!2m2!1d36.89151684751701!2d30.7356684993576!3f304.25307492118515!4f-7.274672841508789!5f0.7820865974627469"
                    width="100%"
                    allow="accelerometer; gyroscope; camera; microphone; fullscreen"
                    height="100%"
                    style={{
                      border: "0",
                      borderRadius: "10px",
                    }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="360° Panorama Görünümü"
                  />
                </div>

                {/* Info Box */}
                <div
                  style={{
                    marginTop: "20px",
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h4
                        style={{
                          color: "#333",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                          marginBottom: "10px",
                        }}
                      >
                        📍 Konum Bilgisi
                      </h4>
                      <p
                        style={{
                          color: "#666",
                          fontSize: "0.95rem",
                          margin: "0",
                        }}
                      >
                        Antalya, Türkiye
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h4
                        style={{
                          color: "#333",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                          marginBottom: "10px",
                        }}
                      >
                        🎯 Özellikler
                      </h4>
                      <p
                        style={{
                          color: "#666",
                          fontSize: "0.95rem",
                          margin: "0",
                        }}
                      >
                        360° Görünüm • Zoom • Navigasyon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GooglePanorama;
