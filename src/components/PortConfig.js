import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const PortConfig = ({ onClose }) => {
  const [customPort, setCustomPort] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    // Get current connection info
    if (apiService.baseURL) {
      setCurrentUrl(apiService.baseURL);
    }
  }, []);

  const testConnection = async (port) => {
    setTesting(true);
    setTestResult(null);
    
    try {
      // Temporarily set the port for testing
      const testUrl = `http://localhost:${port}/api`;
      const originalUrl = apiService.baseURL;
      
      apiService.baseURL = testUrl;
      apiService.isConnected = false;
      
      const result = await apiService.testConnection();
      
      if (result.success) {
        setTestResult({ success: true, message: `✅ Connected to port ${port}!` });
        setCurrentUrl(result.url);
      } else {
        // Restore original URL if test failed
        apiService.baseURL = originalUrl;
        setTestResult({ success: false, message: `❌ Port ${port} not responding` });
      }
    } catch (error) {
      setTestResult({ success: false, message: `❌ Error: ${error.message}` });
    } finally {
      setTesting(false);
    }
  };

  const handlePortChange = async () => {
    if (!customPort || isNaN(customPort)) {
      setTestResult({ success: false, message: '❌ Please enter a valid port number' });
      return;
    }
    
    await testConnection(customPort);
  };

  const handleAutoDetect = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      // Reset connection to force auto-detection
      apiService.baseURL = null;
      apiService.isConnected = false;
      
      const result = await apiService.testConnection();
      
      if (result.success) {
        setTestResult({ success: true, message: '✅ Auto-detected backend successfully!' });
        setCurrentUrl(result.url);
      } else {
        setTestResult({ success: false, message: result.error });
      }
    } catch (error) {
      setTestResult({ success: false, message: `❌ Auto-detection failed: ${error.message}` });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      zIndex: 2000,
      minWidth: '300px',
      maxWidth: '90vw'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>🔧 Backend Port Configuration</h3>
      
      {currentUrl && (
        <div style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          <strong>Current:</strong> {currentUrl}
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Custom Port:
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="number"
            value={customPort}
            onChange={(e) => setCustomPort(e.target.value)}
            placeholder="e.g. 3001"
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handlePortChange}
            disabled={testing}
            style={{
              padding: '8px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: testing ? 'not-allowed' : 'pointer',
              opacity: testing ? 0.6 : 1
            }}
          >
            {testing ? 'Testing...' : 'Test'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={handleAutoDetect}
          disabled={testing}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: testing ? 'not-allowed' : 'pointer',
            opacity: testing ? 0.6 : 1
          }}
        >
          {testing ? 'Detecting...' : '🔍 Auto-Detect Backend'}
        </button>
      </div>

      {testResult && (
        <div style={{
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          backgroundColor: testResult.success ? '#d4edda' : '#f8d7da',
          color: testResult.success ? '#155724' : '#721c24',
          fontSize: '14px'
        }}>
          {testResult.message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            padding: '8px 15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>

      <div style={{ 
        marginTop: '15px', 
        fontSize: '12px', 
        color: '#666',
        borderTop: '1px solid #eee',
        paddingTop: '10px'
      }}>
        <strong>Common ports:</strong> 5000 (default), 3001, 8000, 4000
      </div>
    </div>
  );
};

export default PortConfig;