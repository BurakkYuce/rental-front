// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, authAPI } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Reset states when location changes
    setIsValidating(true);
    setIsValid(false);
    
    const validateToken = async () => {
      console.log('🔍 ProtectedRoute: Starting token validation...');
      console.log('🔍 ProtectedRoute: Current location pathname:', location.pathname);
      console.log('🔍 ProtectedRoute: Current window location:', window.location.pathname);
      console.log('🔍 ProtectedRoute: Current URL:', window.location.href);
      console.log('🔍 ProtectedRoute: isAuthenticated():', isAuthenticated());
      console.log('🔍 ProtectedRoute: admin_token in localStorage:', !!localStorage.getItem('admin_token'));
      console.log('🔍 ProtectedRoute: Token value preview:', localStorage.getItem('admin_token')?.substring(0, 20) + '...');
      console.log('🔍 ProtectedRoute: Admin user in localStorage:', !!localStorage.getItem('admin_user'));
      console.log('🔍 ProtectedRoute: Component render timestamp:', new Date().toLocaleTimeString());
      
      if (!isAuthenticated()) {
        console.log('❌ ProtectedRoute: No token found, redirecting to login');
        setIsValidating(false);
        setIsValid(false);
        return;
      }

      try {
        console.log('🔄 ProtectedRoute: Validating token with server...');
        console.log('🔄 ProtectedRoute: Making request to /auth/admin/me');
        const response = await authAPI.getCurrentUser();
        console.log('✅ ProtectedRoute: Token validation successful:', response.data);
        setIsValid(true);
      } catch (error) {
        console.error('❌ ProtectedRoute: Token validation failed:', error);
        console.error('❌ ProtectedRoute: Error response:', error.response?.data);
        console.error('❌ ProtectedRoute: Error status:', error.response?.status);
        
        // Clear invalid tokens
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setIsValid(false);
      } finally {
        setIsValidating(false);
        console.log('🏁 ProtectedRoute: Validation complete');
      }
    };

    validateToken();
  }, [location.pathname]); // Re-run validation when route changes
  
  // Add storage event listener to detect token changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'admin_token') {
        console.log('🔄 ProtectedRoute: Token change detected in localStorage');
        console.log('🔄 ProtectedRoute: New token value:', e.newValue ? 'EXISTS' : 'REMOVED');
        console.log('🔄 ProtectedRoute: Re-triggering validation...');
        
        // Re-trigger validation when token changes
        setIsValidating(true);
        setIsValid(false);
        
        setTimeout(() => {
          const validateTokenAgain = async () => {
            if (!isAuthenticated()) {
              console.log('❌ ProtectedRoute: No token after storage change, redirecting to login');
              setIsValidating(false);
              setIsValid(false);
              return;
            }

            try {
              console.log('🔄 ProtectedRoute: Re-validating token with server...');
              const response = await authAPI.getCurrentUser();
              console.log('✅ ProtectedRoute: Re-validation successful:', response.data);
              setIsValid(true);
            } catch (error) {
              console.error('❌ ProtectedRoute: Re-validation failed:', error);
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_user');
              setIsValid(false);
            } finally {
              setIsValidating(false);
            }
          };
          
          validateTokenAgain();
        }, 100);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  console.log('🎯 ProtectedRoute render - isValidating:', isValidating, 'isValid:', isValid);
  
  if (isValidating) {
    console.log('🎯 ProtectedRoute: Showing validation loading...');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px' 
      }}>
        Verifying authentication...
      </div>
    );
  }

  if (!isValid) {
    console.log('🎯 ProtectedRoute: Redirecting to login...');
    return <Navigate to="/admin/login" replace />;
  }
  
  console.log('🎯 ProtectedRoute: Rendering protected content...');
  return children;
};

export default ProtectedRoute;