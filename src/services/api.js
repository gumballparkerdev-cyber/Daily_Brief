// src/services/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    'REACT_APP_API_URL is not defined. Please set it in your environment variables.'
  );
}

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log(`🚀 API connected: ${this.baseURL}`);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'include',
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      try {
        const data = await response.json();
        errorMessage = data.error || errorMessage;
      } catch {
        // ignore JSON parse error
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // -------- API METHODS --------

  getTodaysBrief() {
    return this.request('/brief');
  }

  markBriefDone() {
    return this.request('/action/done', { method: 'POST' });
  }

  skipBrief() {
    return this.request('/action/skip', { method: 'POST' });
  }
}

// ✅ Proper named export (ESLint happy)
const apiService = new ApiService();
export default apiService;
