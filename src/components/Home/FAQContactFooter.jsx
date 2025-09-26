// src/components/Home/FAQContactFooter.jsx
import React, { useState } from "react";

const FAQContactFooter = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  // FAQ verilerini buradan kolayca değiştirebilirsin
  const faqData = [
    {
      id: 1,
      question: "Ödeme Seçenekleri Nelerdir?",
      answer:
        "Önceden belirtmek koşulu ile kredi kartı, ile ödeme , Eft-Havale ve peşin.",
    },
    {
      id: 2,
      question: "Araç Kiralanırken Depozito Alıyor Musunuz? Neden?",
      answer:
        "Kiralanan aracın marka modeline ve araç yaşına bağlı olarak depozit alınmaktadır, bunun nedeni ise araç dönüşunde km farkı HGS ve yakıt durumu gibi durumlar kontrol edilir uygun olmayan durumlarda depozitten düşülür.",
    },
    {
      id: 3,
      question: "Kiraladığım Araçla Yurtdışına Çıkabilir Miyim?",
      answer:
        "Şirket prosedürleri gereği kiraladığınız araçla yurtdışına çıkamazsınız. ",
    },
    {
      id: 4,
      question: "Araçlarınızda Bulunan Sigortalar Nelerdir?",
      answer:
        "Araçlarımızda Zotunlu Trafik Sigortası , Muafiyeti Rent A Car Kaskosu, Hırsızlık Sigortası mevcuttur.",
    },
    {
      id: 5,
      question: "Sigorta Ve Kasko Hangi Koşullarda Geçerlidir?",
      answer:
        "Trafik ve alkol raporları kazadan hemen sonra tutulmalıdır. Kaza olduğu andaki fotoğraflar mutlaka çekilmelidir. Araçların neresinden hasar aldıysa oralar mutlaka fotoğraflarda açıkça belirtilmelidir. Kaza karşılıklı ise karşı tarafa ait ruhsat fotokopisi, sigorta poliçesi fotokopisi ve ehliyet fotokopisi kaza yerinde karşı taraftan alınmalı ve size ait aynı belgeler karşı tarafa verilmelidir. Kaza olduğu anda lütfen hemen bizi arayınız 0536 603 9907 Aracın alkollü, herhangi bir madde etkisi altında veya hız sınırlarının üzerinde kullanılması ve aracı kiralayan kişinin tamamen kusurlu olması durumunda aracı kiralayan kişi oluşabilecek tüm hasarlardan sorumlu tutulur. Rapor tutulmayan, eksik veya geçersiz evrak durumunda kiracı hiçbir şekilde sigortadan yararlanamaz ve yararlanmayı talep edemez. Belirtilen durumlarda sigortadan yararlanma talebi geçersiz sayılacak ve oluşan zararlar sigorta kapsamı dışında kalacaktır. Aracı kira sözleşmesi üzerinde belirtilen isim veya isimler dışında bir kişinin kullanması. Aracı normal koşullar dışında kullanma. (Motora zarar verecek kullanımlar, yol şartları, patlak veya hasarlı lastik ile kullanma, hatalı yakıt doldurma.) Trafik kuralları dışında kullanılması.(Hız sınırının aşılması, kırmızı ışık vb. diğer ihlaller, aracı alkol veya herhangi bir maddenin etkisi altında kullanma.) Araçta taşınan yükün bir kazaya sebebiyet vermesi. Aracın dikkatsiz kullanılması. (Aracın yağış veya yol durumuna göre kullanılmaması, öndeki aracın emniyet takip mesafesine uygun takip edilmemesi vb. durumlar.) Oluşan bir kaza, hasar veya çalınma durumunda verilen iletişim numarasından haber verilmemesi, aracın kaza yerinde terk edilmesi durumları. Oluşan kazanın üzerinden en çok 24 saat geçmesine rağmen trafik ve alkol raporunun alınmaması. Aracın çalınması durumunda orijinal anahtarının teslim edilmemesi. (Anahtar sizde olmalı mutlaka) Kira süresi bitmiş olmasına rağmen herhangi bir onay alınmadan aracın kullanılmaya devam edilmesi ve teslim edilmemesi. Lastik, far veya camlarda meydana gelen hasarlarda ilgili iletişim numaralarından haber verilmeden işlem yapılması. Gibi durumlar sigortaya dahil değildir. ARACI KİRALAYAN SORUMLU OLUR. Oluşan kazalarda 3. şahıslara verilen hasarlardan oluşacak maddi tazminat tutarı, mali mesuliyet sigortası teminatı altındadır. Teminat dışında kalan tutarlar müşterinin sorumluluğundadır. Teminat dışında kalan tutarlar için MİTCAR RENTAL sorumlu tutulamaz. LÜTFEN HIZ SINIRLARINA UYUNUZ. KEMER TAKINIZ. ARAÇ KULLANIM ESNASINDA TELEFON İLE GÖRÜŞMEYİNİZ. ALKOLLÜ vb. MADDELERİ ALARAK ARAÇ KULLANMAYINIZ.",
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
                Sıkça Sorulan Sorular
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
                          ? "2px solid #4A90E2"
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
                          backgroundColor: "#4A90E2",
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
                          ? "2px solid #4A90E2"
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
                          backgroundColor: "#4A90E2",
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

      {/* Blue Contact Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #4A90E2 0%, #0077BE 100%)",
          padding: "60px 0",
        }}
      >
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
                Bize Ulaşın
              </p>
              <h3
                style={{
                  color: "white",
                  fontSize: "2.2rem",
                  fontWeight: "700",
                  lineHeight: "1.3",
                  margin: "0",
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                Mitcar Rental
                <br />
                Her Zaman Sizin Hizmetinizde
                <br />
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
                  {" "}
                </p>
                <h2
                  style={{
                    color: "white",
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    margin: "0 0 20px 0",
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  0 (536) 603 9907
                </h2>
                <button
                  style={{
                    backgroundColor: "white",
                    color: "#4A90E2",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 30px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.95)";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                >
                  Bizi Arayın
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
                MITCAR RENTAL
              </h5>
              <p
                style={{
                  color: "#bbb",
                  lineHeight: "1.6",
                  fontSize: "0.95rem",
                }}
              >
                Kalite ile Uygun Fiyatın Buluştuğu Nokta Hızlı, güvenilir ve
                güvenli araç kiralama hizmetleri sunuyoruz.{" "}
              </p>
              <div style={{ marginTop: "20px" }}>
                <img
                  src="/images/logo/UMİT-2.png"
                  alt="ümit"
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
                İletişim Bilgileri
              </h5>
              <div style={{ color: "#bbb", fontSize: "0.95rem" }}>
                <p style={{ marginBottom: "10px" }}>
                  📍 Kızıltoprak Mah. 939 Sok. No.6/B MURATPAŞA / ANTALYA
                </p>
                <p style={{ marginBottom: "10px" }}>📞 0 (536) 603 9907</p>

                <p style={{ marginBottom: "0" }}>
                  🕒 Pazartesi - Cuma: 08:00 - 18:00
                </p>
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
                Hızlı Linkler
              </h5>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Hakkımızda",
                  "Araçlar",
                  "Rezervasyon",
                  "SSS",
                  "İletişim",
                  "Şartlar ve Koşullar",
                  "Gizlilik Politikası",
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
                      onMouseEnter={(e) => (e.target.style.color = "#4A90E2")}
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
                Sosyal Medya
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
                      e.target.style.backgroundColor = "#4A90E2";
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
                Copyright 2025 - MITCAR RENTAL. Tüm Hakları Saklıdır.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FAQContactFooter;
