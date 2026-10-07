// api.js
// Central API helper using standard browser fetch

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = {
  // GET request helper
  async get(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();

    if (!response.ok) {
      const message = data.message || 'An error occurred';
      console.error('API Error in getting the message', message);
      throw new Error(message);
    }

    return data;
  },

  // POST request helper
  async post(endpoint, body = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      const message = data.message || 'An error occurred';
      console.error('API Error during the POST of message', message);
      throw new Error(message);
    }

    return data;
  },
};

export default api;
