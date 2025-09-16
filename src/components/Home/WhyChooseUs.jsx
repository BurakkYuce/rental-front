// src/components/Home/WhyChooseUs.jsx
import React from "react";

const WhyChooseUs = () => {
  const sectionStyle = {
    backgroundColor: '#1a1a1a',
    background: '#1a1a1a',
    WebkitBackgroundColor: '#1a1a1a',
    minHeight: '100vh',
    position: 'relative',
    backgroundAttachment: 'scroll',
    padding: '80px 0'
  };

  const featureItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '40px',
    gap: '20px'
  };

  const featureItemRightStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '40px',
    gap: '20px',
    flexDirection: 'row-reverse'
  };

  const featureIconStyle = {
    width: '80px',
    height: '80px',
    backgroundColor: '#00d4aa',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  };

  const featureContentStyle = {
    flex: 1
  };

  return (
    <section 
      id="section-features" 
      style={sectionStyle}
    >
      <div className="container">
        {/* Section Header */}
        <div className="row">
          <div className="col-lg-12 text-center mb-5">
            <h2 style={{ 
              color: "white", 
              marginBottom: "20px",
              fontSize: "2.5rem",
              fontWeight: "bold"
            }}>
              Özelliklerimiz
            </h2>
            <p style={{ 
              color: "#cccccc",
              fontSize: "1.1rem",
              maxWidth: "600px",
              margin: "0 auto"
            }}>
              Kolaylık, güvenlik ve kişiselleştirme dünyasını keşfedin;
              unutulmaz maceralar ve sorunsuz mobilite çözümleri için yol açın.
            </p>
          </div>
        </div>

        {/* Features Content */}
        <div className="row align-items-center">
          {/* Left Side Features */}
          <div className="col-lg-4">
            <div style={featureItemStyle}>
              <div style={featureIconStyle}>
                <img
                  src="/images/icons/1-green.svg"
                  alt="First class services"
                  style={{ width: '40px', height: '40px' }}
                />
              </div>
              <div style={featureContentStyle}>
                <h4 style={{ 
                  color: "white", 
                  fontSize: "1.3rem",
                  marginBottom: "10px",
                  fontWeight: "600"
                }}>
                  Birinci Sınıf Hizmetler
                </h4>
                <p style={{ 
                  color: "#cccccc",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  margin: "0"
                }}>
                  Lüksün olağanüstü özenle buluştuğu yerde, beklentilerinizi
                  aşan ve unutulmaz anlar yaratan bir deneyim.
                </p>
              </div>
            </div>

            <div style={featureItemStyle}>
              <div style={featureIconStyle}>
                <img
                  src="/images/icons/2-green.svg"
                  alt="24/7 road assistance"
                  style={{ width: '40px', height: '40px' }}
                />
              </div>
              <div style={featureContentStyle}>
                <h4 style={{ 
                  color: "white", 
                  fontSize: "1.3rem",
                  marginBottom: "10px",
                  fontWeight: "600"
                }}>
                  7/24 Yol Yardımı
                </h4>
                <p style={{ 
                  color: "#cccccc",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  margin: "0"
                }}>
                  En çok ihtiyacınız olduğu anda güvenilir destek; yolculuğunuza
                  güven ve huzur katar.
                </p>
              </div>
            </div>
          </div>

          {/* Center Car Image */}
          <div className="col-lg-4 text-center">
            <div style={{ padding: '40px 0' }}>
              <img
                src="/images/misc/car.png"
                alt="Featured Car"
                className="img-fluid"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>

          {/* Right Side Features */}
          <div className="col-lg-4">
            <div style={featureItemRightStyle}>
              <div style={featureIconStyle}>
                <img 
                  src="/images/icons/3-green.svg" 
                  alt="Quality service"
                  style={{ width: '40px', height: '40px' }}
                />
              </div>
              <div style={featureContentStyle}>
                <h4 style={{ 
                  color: "white", 
                  fontSize: "1.3rem",
                  marginBottom: "10px",
                  fontWeight: "600",
                  textAlign: "right"
                }}>
                  Minimum Maliyetle Maksimum Kalite
                </h4>
                <p style={{ 
                  color: "#cccccc",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  margin: "0",
                  textAlign: "right"
                }}>
                  Kaliteden ödün vermeden, en uygun maliyetle üstün bir deneyim
                  sunuyoruz.
                </p>
              </div>
            </div>

            <div style={featureItemRightStyle}>
              <div style={featureIconStyle}>
                <img 
                  src="/images/icons/4-green.svg" 
                  alt="Free pickup"
                  style={{ width: '40px', height: '40px' }}
                />
              </div>
              <div style={featureContentStyle}>
                <h4 style={{ 
                  color: "white", 
                  fontSize: "1.3rem",
                  marginBottom: "10px",
                  fontWeight: "600",
                  textAlign: "right"
                }}>
                  Ücretsiz Alım ve Teslimat
                </h4>
                <p style={{ 
                  color: "#cccccc",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  margin: "0",
                  textAlign: "right"
                }}>
                  Ücretsiz araç alım ve teslimat hizmeti ile kiralama
                  deneyiminizi daha da kolaylaştırın.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;