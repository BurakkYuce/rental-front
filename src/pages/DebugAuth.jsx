// src/pages/DebugAuth.jsx - Debug authentication flow
import React, { useState, useEffect } from 'react';
import BackToHomeButton from '../components/BackToHomeButton';
import { authAPI, adminAPI, isAuthenticated, getAuthToken, setAuthToken } from '../services/api';

const DebugAuth = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, success, details) => {
    setTestResults(prev => [...prev, { 
      test, 
      success, 
      details, 
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  const runDebugTests = async () => {
    console.log('🧪 Starting debug tests...');
    setTestResults([]);
    
    // Test 1: Check localStorage
    const token = getAuthToken();
    const adminUser = localStorage.getItem('admin_user');
    addTestResult('LocalStorage Check', !!token, `Token: ${!!token}, Admin: ${!!adminUser}`);
    
    // Test 2: Test isAuthenticated function
    const isAuth = isAuthenticated();
    addTestResult('isAuthenticated()', isAuth, `Result: ${isAuth}`);
    
    // Test 3: Test token validation with backend
    if (token) {
      try {
        const response = await authAPI.getCurrentUser();
        addTestResult('/auth/admin/me', true, `Success: ${JSON.stringify(response.data)}`);
      } catch (error) {
        addTestResult('/auth/admin/me', false, `Error: ${error.response?.status} - ${error.response?.data?.error}`);
      }
    } else {
      addTestResult('/auth/admin/me', false, 'No token available');
    }
    
    // Test 4: Test admin dashboard stats
    if (token) {
      try {
        const response = await adminAPI.getDashboardStats();
        addTestResult('/admin/dashboard/stats', true, `Success: ${JSON.stringify(response.data)}`);
      } catch (error) {
        addTestResult('/admin/dashboard/stats', false, `Error: ${error.response?.status} - ${error.response?.data?.error}`);
      }
    } else {
      addTestResult('/admin/dashboard/stats', false, 'No token available');
    }
  };

  const testLogin = async () => {
    try {
      console.log('🧪 Testing login...');
      const response = await authAPI.login({ username: 'admin', password: 'admin123' });
      console.log('Login response:', response);
      
      const { data } = response.data;
      const { admin, token } = data;
      
      setAuthToken(token);
      localStorage.setItem('admin_user', JSON.stringify(admin));
      
      addTestResult('Login Test', true, `Login successful, token stored`);
      await runDebugTests();
    } catch (error) {
      addTestResult('Login Test', false, `Login failed: ${error.response?.data?.error}`);
    }
  };

  const clearTokens = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAuthToken(null);
    addTestResult('Clear Tokens', true, 'All tokens cleared');
  };

  useEffect(() => {
    const updateDebugInfo = () => {
      setDebugInfo({
        token: getAuthToken()?.substring(0, 20) + '...',
        tokenExists: !!getAuthToken(),
        adminUser: localStorage.getItem('admin_user'),
        isAuthenticated: isAuthenticated(),
        currentPath: window.location.pathname,
        timestamp: new Date().toLocaleString()
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      {/* Back to Home Button */}
      <BackToHomeButton />
      
      <h1>Auth Debug Panel</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Current State</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={runDebugTests} style={{ marginRight: '10px', padding: '10px 20px' }}>
          Run Debug Tests
        </button>
        <button onClick={testLogin} style={{ marginRight: '10px', padding: '10px 20px' }}>
          Test Login
        </button>
        <button onClick={clearTokens} style={{ padding: '10px 20px' }}>
          Clear Tokens
        </button>
      </div>

      <div>
        <h2>Test Results</h2>
        {testResults.map((result, index) => (
          <div 
            key={index} 
            style={{ 
              margin: '10px 0', 
              padding: '10px', 
              borderRadius: '5px',
              backgroundColor: result.success ? '#d4edda' : '#f8d7da',
              border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`
            }}
          >
            <strong>{result.timestamp} - {result.test}:</strong> 
            <span style={{ color: result.success ? 'green' : 'red' }}>
              {result.success ? ' ✅ PASS' : ' ❌ FAIL'}
            </span>
            <div style={{ marginTop: '5px', fontSize: '12px' }}>
              {result.details}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugAuth;