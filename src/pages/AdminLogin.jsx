// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, setAuthToken, isAuthenticated } from "../services/api";
import { LogIn, User, Lock, AlertCircle } from "lucide-react";
import "../assets/css/bootstrap.min.css";
import "../assets/css/plugins.css";
import "../assets/css/style.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      console.log('Attempting login with:', { username: formData.username });
      const response = await authAPI.login(formData);
      console.log('Login response:', response);
      
      // Backend response structure: { success: true, data: { admin: {...}, token: "..." } }
      const { data: responseData } = response;
      const { data } = responseData;
      const { admin, token } = data;
      console.log('Token received:', token ? 'Yes' : 'No');
      console.log('Admin data:', admin);
      
      // Clear any old tokens first
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      
      // Store token and user data
      setAuthToken(token);
      localStorage.setItem('admin_user', JSON.stringify(admin));
      
      console.log('Token stored successfully. Navigating to admin panel...');
      console.log('Current localStorage admin_token:', localStorage.getItem('admin_token')?.substring(0, 20) + '...');
      console.log('Current localStorage admin_user:', localStorage.getItem('admin_user'));
      
      // Navigate immediately - ProtectedRoute will handle validation
      console.log('Calling navigate(\'/admin\', { replace: true })...');
      
      // Force a small delay to ensure token is properly set before navigation
      setTimeout(() => {
        console.log('🚀 Navigating to /admin after token setup...');
        console.log('🚀 Final token check before navigate:', !!localStorage.getItem('admin_token'));
        navigate('/admin', { replace: true });
        console.log('🚀 Navigate call completed');
        
        // Additional verification after navigation attempt
        setTimeout(() => {
          console.log('🚀 Post-navigation check - current path:', window.location.pathname);
          console.log('🚀 Post-navigation check - token exists:', !!localStorage.getItem('admin_token'));
          
          // If navigation didn't work, try alternative method
          if (window.location.pathname !== '/admin') {
            console.log('⚠️ Navigation to /admin failed, trying window.location.href...');
            window.location.href = '/admin';
          }
        }, 100);
        
        // Additional monitoring for longer period
        setTimeout(() => {
          console.log('🚀 Extended post-navigation check - current path:', window.location.pathname);
          if (window.location.pathname !== '/admin') {
            console.log('⚠️ Still not on /admin page after 500ms');
            console.log('⚠️ Attempting force navigation via window.location.replace...');
            window.location.replace('/admin');
          }
        }, 500);
      }, 50);
      
      console.log('Navigate setup completed (will execute after 50ms)');
      
      // Set login success for manual navigation option
      setLoginSuccess(true);
    } catch (error) {
      console.error('Login failed:', error);
      console.error('Error response:', error.response);
      
      // Clear any tokens on login failure
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      
      setError(error.response?.data?.error || error.message || 'Login failed. Please check your credentials.');
      setLoginSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleManualNavigation = () => {
    console.log('🔧 Manual navigation button clicked');
    console.log('🔧 Current isAuthenticated:', isAuthenticated());
    console.log('🔧 Current token exists:', !!localStorage.getItem('admin_token'));
    
    // Try multiple navigation methods
    console.log('🔧 Trying navigate()...');
    navigate('/admin', { replace: true });
    
    setTimeout(() => {
      if (window.location.pathname !== '/admin') {
        console.log('🔧 Navigate failed, trying window.location.href...');
        window.location.href = '/admin';
      }
    }, 200);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        padding: "40px",
        width: "100%",
        maxWidth: "400px"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            backgroundColor: "#1ECB15",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px"
          }}>
            <LogIn size={24} color="white" />
          </div>
          <h2 style={{ margin: "0 0 10px 0", color: "#333", fontWeight: "600" }}>
            Admin Login
          </h2>
          <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
            Sign in to access the admin panel
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #f5c6cb"
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Success Message with Manual Navigation */}
        {loginSuccess && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "12px",
            backgroundColor: "#d4edda",
            color: "#155724",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #c3e6cb"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={16} />
              Login successful! Token stored. Attempting auto-navigation...
            </div>
            <button
              onClick={handleManualNavigation}
              style={{
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem"
              }}
            >
              Manual Navigation to Admin Panel
            </button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#333"
            }}>
              Username
            </label>
            <div style={{ position: "relative" }}>
              <User
                size={18}
                color="#666"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)"
                }}
              />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 45px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  transition: "border-color 0.3s ease",
                  ":focus": {
                    borderColor: "#1ECB15",
                    outline: "none"
                  }
                }}
                onFocus={(e) => e.target.style.borderColor = "#1ECB15"}
                onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
              />
            </div>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#333"
            }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                color="#666"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)"
                }}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 45px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  transition: "border-color 0.3s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "#1ECB15"}
                onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: "#1ECB15",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid transparent",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></div>
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Info */}
    
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;