// src/pages/TestPage.jsx
import React from "react";
import BackToHomeButton from "../components/BackToHomeButton";
// import CurrencySelector from "../components/CurrencySelector";
// import CurrencySelectorTest from "../components/CurrencySelectorTest";

const TestPage = () => {
  return (
    <div style={{ padding: "50px" }}>
      {/* Back to Home Button */}
      <BackToHomeButton />
      
      <h1>Frontend is Working!</h1>
      <p>If you can see this, the React app is running correctly.</p>
      
      {/* Currency selectors temporarily disabled */}
      {/* <div style={{ marginTop: "30px" }}>
        <h2>Original Currency Selector (with context)</h2>
        <CurrencySelector />
      </div>
      
      <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "30px" }}>
        <h2>Simple Test Currency Selector (no context)</h2>
        <CurrencySelectorTest />
      </div> */}
      
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <a href="/admin/login" style={{ 
          padding: "10px 20px", 
          backgroundColor: "#1ECB15", 
          color: "white", 
          textDecoration: "none", 
          borderRadius: "5px",
          marginRight: "10px"
        }}>
          Go to Admin Login
        </a>
        <a href="/admin" style={{ 
          padding: "10px 20px", 
          backgroundColor: "#007bff", 
          color: "white", 
          textDecoration: "none", 
          borderRadius: "5px"
        }}>
          Go to Admin Panel
        </a>
      </div>
    </div>
  );
};

export default TestPage;