import React, { useState } from 'react';
import { MessageCircle, Phone, X, Mail } from 'lucide-react';

const FloatingContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      icon: <MessageCircle size={20} />,
      label: 'WhatsApp',
      action: () => window.open('https://wa.me/905551234567?text=Merhaba, araç kiralama hakkında bilgi almak istiyorum.', '_blank'),
      color: '#25D366',
      hoverColor: '#128C7E'
    },
    {
      icon: <Phone size={20} />,
      label: 'Telefon',
      action: () => window.open('tel:+905551234567', '_self'),
      color: '#007bff',
      hoverColor: '#0056b3'
    },
    {
      icon: <Mail size={20} />,
      label: 'E-posta',
      action: () => window.open('mailto:info@mitcar.com?subject=Araç Kiralama Talebi', '_self'),
      color: '#dc3545',
      hoverColor: '#c82333'
    }
  ];

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
                  animationDelay: `${index * 0.1}s`
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
          className={`floating-contact-btn ${isOpen ? 'open' : ''}`}
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
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
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

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .floating-contact-container {
            bottom: 15px;
            right: 15px;
          }

          .floating-contact-btn {
            width: 55px;
            height: 55px;
          }

          .contact-option {
            padding: 10px 14px;
            font-size: 13px;
            min-width: 120px;
          }

          .contact-label {
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .floating-contact-container {
            bottom: 10px;
            right: 10px;
          }

          .floating-contact-btn {
            width: 50px;
            height: 50px;
          }

          .contact-option {
            padding: 8px 12px;
            font-size: 12px;
            min-width: 110px;
          }
        }

        /* Accessibility */
        .floating-contact-btn:focus {
          outline: 3px solid rgba(30, 203, 21, 0.5);
          outline-offset: 2px;
        }

        .contact-option:focus {
          outline: 2px solid rgba(255, 255, 255, 0.8);
          outline-offset: 1px;
        }

        /* Smooth animations */
        .floating-contact-container * {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </>
  );
};

export default FloatingContactButton;