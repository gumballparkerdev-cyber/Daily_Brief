// API Service Layer - Professional backend integration with auto port detection
const POSSIBLE_PORTS = [5000, 3001, 8000, 4000];
const API_BASE_PATH = '/api';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

class ApiService {
  constructor() {
    this.baseURL = null;
    this.isConnected = false;
  }

  // Auto-detect working backend port (only in development)
  async detectBackendPort() {
    if (this.isConnected && this.baseURL) {
      return this.baseURL;
    }

    // In production, always use environment variable
    if (IS_PRODUCTION) {
      const envUrl = process.env.REACT_APP_API_URL;
      if (envUrl) {
        this.baseURL = envUrl;
        this.isConnected = true;
        console.log(`🚀 Production mode: Using ${envUrl}`);
        return this.baseURL;
      } else {
        throw new Error('❌ Production deployment requires REACT_APP_API_URL environment variable');
      }
    }

    // Development mode: First try environment variable
    const envUrl = process.env.REACT_APP_API_URL;
    if (envUrl) {
      try {
        const response = await fetch(envUrl.replace('/api', ''), { 
          method: 'GET',
          timeout: 3000 
        });
        if (response.ok) {
          this.baseURL = envUrl;
          this.isConnected = true;
          console.log(`✅ Connected to backend at: ${envUrl}`);
          return this.baseURL;
        }
      } catch (error) {
        console.log(`❌ Environment URL ${envUrl} not responding`);
      }
    }

    // Development mode: Try common ports
    for (const port of POSSIBLE_PORTS) {
      const testUrl = `http://localhost:${port}`;
      try {
        const response = await fetch(testUrl, { 
          method: 'GET',
          timeout: 3000 
        });
        if (response.ok) {
          this.baseURL = `${testUrl}${API_BASE_PATH}`;
          this.isConnected = true;
          console.log(`✅ Auto-detected backend at: ${testUrl}`);
          return this.baseURL;
        }
      } catch (error) {
        console.log(`❌ Port ${port} not responding`);
      }
    }

    throw new Error('❌ Could not connect to backend. Please ensure your backend is running on one of these ports: ' + POSSIBLE_PORTS.join(', '));
  }

  // Generic request handler with error handling and auto-detection
  async request(endpoint, options = {}) {
    if (!this.baseURL) {
      await this.detectBackendPort();
    }

    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session management
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // If connection fails, reset and try to reconnect
      if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        console.log('🔄 Connection lost, trying to reconnect...');
        this.isConnected = false;
        this.baseURL = null;
        
        try {
          await this.detectBackendPort();
          // Retry the request once
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, config);
          if (retryResponse.ok) {
            return await retryResponse.json();
          }
        } catch (retryError) {
          console.error('❌ Retry failed:', retryError);
        }
      }
      
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Brief API methods
  async getTodaysBrief() {
    return this.get('/brief');
  }

  // Action API methods
  async markBriefDone() {
    return this.post('/action/done');
  }

  async skipBrief() {
    return this.post('/action/skip');
  }

  // Manual connection test
  async testConnection() {
    try {
      await this.detectBackendPort();
      return { success: true, url: this.baseURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
const apiService = new ApiService();

export default apiService;
