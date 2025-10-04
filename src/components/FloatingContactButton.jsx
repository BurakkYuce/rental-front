import React, { useState, useEffect } from "react";
import { MessageCircle, Phone, X, Mail } from "lucide-react";

const FloatingContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile check
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const contactOptions = [
    {
      icon: <MessageCircle size={20} />,
      label: "WhatsApp",
      action: () =>
        window.open(
          "https://wa.me/905366039907?text=Merhaba, araç kiralama hakkında bilgi almak istiyorum.",
          "_blank"
        ),
      color: "#25D366",
      hoverColor: "#128C7E",
    },
    {
      icon: <Phone size={20} />,
      label: "Hemen Ara",
      action: () => window.open("tel:+905366039907", "_self"),
      color: "#FF8C00",
      hoverColor: "#FF7F00",
    },
    {
      icon: <Mail size={20} />,
      label: "E-posta",
      action: () =>
        window.open(
          "mailto:umityucce@gmail.com?subject=Araç Kiralama Talebi",
          "_self"
        ),
      color: "#dc3545",
      hoverColor: "#c82333",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      label: "Instagram",
      action: () =>
        window.open(
          "https://www.instagram.com/mitcarrental?igsh=cGdodXZkYXpqeGJk&utm_source=qr",
          "_blank"
        ),
      color: "#E4405F",
      hoverColor: "#C13584",
    },
  ];

  // Mobile Bottom Bar
  if (isMobile) {
    return (
      <>
        <div className="mobile-contact-bar">
          {contactOptions.map((option, index) => (
            <div
              key={index}
              className="mobile-contact-option"
              onClick={option.action}
              style={{ backgroundColor: option.color }}
            >
              {option.icon}
              <span className="mobile-contact-label">{option.label}</span>
            </div>
          ))}
        </div>

        <style jsx>{`
          .mobile-contact-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            background: white;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            border-top: 1px solid #eee;
          }

          .mobile-contact-option {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 12px 8px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            min-height: 70px;
            text-decoration: none;
            border: none;
            font-family: inherit;
          }

          .mobile-contact-option:hover {
            opacity: 0.9;
            transform: translateY(-2px);
          }

          .mobile-contact-option:active {
            transform: translateY(0);
          }

          .mobile-contact-label {
            font-size: 11px;
            font-weight: 600;
            margin-top: 4px;
            text-align: center;
            line-height: 1.2;
          }

          /* WhatsApp yeşil */
          .mobile-contact-option:nth-child(1) {
            background: #25d366;
          }

          /* Telefon turuncu */
          .mobile-contact-option:nth-child(2) {
            background: #ff8c00;
          }

          /* Facebook mavi */
          .mobile-contact-option:nth-child(3) {
            background: #4267b2;
          }

          /* Instagram pembe */
          .mobile-contact-option:nth-child(4) {
            background: #e4405f;
          }

          /* Ana içeriğe alt padding ekle */
          body {
            padding-bottom: 70px;
          }
        `}</style>
      </>
    );
  }

  // Desktop Floating Button
  return (
    <>
      <div className="floating-contact-container">
        {/* Contact Options */}
        {isOpen && (
          <div className="contact-options">
            {contactOptions.map((option, index) => (
              <div
                key={index}
                className="contact-option"
                onClick={option.action}
                style={{
                  backgroundColor: option.color,
                  animationDelay: `${index * 0.1}s`,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = option.hoverColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = option.color;
                }}
              >
                {option.icon}
                <span className="contact-label">{option.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Main Toggle Button */}
        <button
          className={`floating-contact-btn ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="İletişim seçenekleri"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      <style jsx>{`
        .floating-contact-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .contact-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 8px;
        }

        .contact-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 50px;
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          animation: slideInRight 0.4s ease forwards;
          opacity: 0;
          transform: translateX(20px);
          white-space: nowrap;
          min-width: 140px;
          font-weight: 500;
          font-size: 14px;
        }

        @keyframes slideInRight {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .contact-option:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }

        .contact-label {
          font-size: 14px;
          font-weight: 600;
        }

        .floating-contact-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1ecb15, #179510);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(30, 203, 21, 0.4);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .floating-contact-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .floating-contact-btn:hover {
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 8px 25px rgba(30, 203, 21, 0.5);
        }

        .floating-contact-btn:hover::before {
          opacity: 1;
        }

        .floating-contact-btn.open {
          background: linear-gradient(135deg, #ff4757, #ff3742);
          box-shadow: 0 4px 20px rgba(255, 71, 87, 0.4);
        }

        .floating-contact-btn.open:hover {
          box-shadow: 0 8px 25px rgba(255, 71, 87, 0.5);
        }

        .floating-contact-btn:focus {
          outline: 3px solid rgba(30, 203, 21, 0.5);
          outline-offset: 2px;
        }

        .contact-option:focus {
          outline: 2px solid rgba(255, 255, 255, 0.8);
          outline-offset: 1px;
        }

        .floating-contact-container * {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </>
  );
};

export default FloatingContactButton;
