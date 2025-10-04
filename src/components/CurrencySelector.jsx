// src/components/CurrencySelector.jsx - Simple Form-Style Currency Selector
import React from "react";
import { useCurrency } from "../contexts/CurrencyContext";

const CurrencySelector = ({ variant = "header" }) => {
  const { currentCurrency, changeCurrency } = useCurrency();

  const handleChange = (event) => {
    const selectedCurrency = event.target.value;
    console.log("Currency changed to:", selectedCurrency); // Debug log
    changeCurrency(selectedCurrency);
  };

  const selectStyle = {
    padding: '6px 12px',
    backgroundColor: variant === 'header' ? 'rgba(255, 255, 255, 0.1)' : '#fff',
    border: variant === 'header' ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #ddd',
    borderRadius: '20px',
    color: variant === 'header' ? '#fff' : '#333',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '80px',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: variant === 'header' 
      ? "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e\")"
      : "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '16px',
    paddingRight: '32px',
  };

  const optionStyle = {
    backgroundColor: '#fff',
    color: '#333',
    padding: '8px',
  };

  return (
    <select 
      value={currentCurrency} 
      onChange={handleChange}
      style={selectStyle}
      onMouseEnter={(e) => {
        if (variant === 'header') {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        } else {
          e.target.style.borderColor = '#1ECB15';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'header') {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        } else {
          e.target.style.borderColor = '#ddd';
        }
      }}
    >
      <option value="EUR" style={optionStyle}>€ EUR</option>
      <option value="USD" style={optionStyle}>$ USD</option>
      <option value="TRY" style={optionStyle}>₺ TRY</option>
    </select>
  );
};

export default CurrencySelector;