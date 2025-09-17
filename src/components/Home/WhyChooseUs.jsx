// src/components/Home/WhyChooseUs.jsx
import React from "react";

const WhyChooseUs = () => {
  return (
    <>
      {/* Safari için CSS fix */}
      <style>{`
        @supports (-webkit-appearance: none) {
          .why-choose-section {
            background-color: #1a1a1a !important;
          }
        }
      `}</style>

      <section id="section-features" className="why-choose-section">
        <div className="container">
          {/* Section Header */}
          <div className="row">
            <div className="col-lg-12 text-center mb-5">
              <h2 style={{ color: "white" }}>Özelliklerimiz</h2>
              <p className="section-subtitle">
                Kolaylık, güvenlik ve kişiselleştirme dünyasını keşfedin;
                unutulmaz maceralar ve sorunsuz mobilite çözümleri için yol açın.
              </p>
            </div>
          </div>

          {/* Features Content */}
          <div className="row align-items-center">
            {/* Left Side Features */}
            <div className="col-lg-4">
              <div className="feature-item">
                <div className="feature-icon">
                  <img
                    src="/images/icons/1-green.svg"
                    alt="First class services"
                  />
                </div>
                <div className="feature-content">
                  <h4>Birinci Sınıf Hizmetler</h4>
                  <p>
                    Lüksün olağanüstü özenle buluştuğu yerde, beklentilerinizi
                    aşan ve unutulmaz anlar yaratan bir deneyim.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <img
                    src="/images/icons/2-green.svg"
                    alt="24/7 road assistance"
                  />
                </div>
                <div className="feature-content">
                  <h4>7/24 Yol Yardımı</h4>
                  <p>
                    En çok ihtiyacınız olduğu anda güvenilir destek; yolculuğunuza
                    güven ve huzur katar.
                  </p>
                </div>
              </div>
            </div>

            {/* Center Car Image */}
            <div className="col-lg-4 text-center">
              <div className="car-showcase">
                <img
                  src="/images/misc/car.png"
                  alt="Featured Car"
                  className="img-fluid"
                />
              </div>
            </div>

            {/* Right Side Features */}
            <div className="col-lg-4">
              <div className="feature-item feature-item-right">
                <div className="feature-content">
                  <h4>Minimum Maliyetle Maksimum Kalite</h4>
                  <p>
                    Kaliteden ödün vermeden, en uygun maliyetle üstün bir deneyim
                    sunuyoruz.
                  </p>
                </div>
                <div className="feature-icon">
                  <img src="/images/icons/3-green.svg" alt="Quality service" />
                </div>
              </div>

              <div className="feature-item feature-item-right">
                <div className="feature-content">
                  <h4>Ücretsiz Alım ve Teslimat</h4>
                  <p>
                    Ücretsiz araç alım ve teslimat hizmeti ile kiralama
                    deneyiminizi daha da kolaylaştırın.
                  </p>
                </div>
                <div className="feature-icon">
                  <img src="/images/icons/4-green.svg" alt="Free pickup" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUs;