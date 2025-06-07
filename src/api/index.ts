// src/api/index.ts
import axios from 'axios';
// Path adjusted assuming stores are now under features/<featureName>/store
import { useAuthStore } from '../features/auth/store/authStore';

// CRITICAL: Master Lith, you MUST replace 'YOUR_NGROK_OR_BACKEND_URL_HERE_REPLACE_ME_IMMEDIATELY'
// with your actual live backend URL (e.g., your ngrok URL for local development,
// or http://localhost:PORT if using an emulator that can access your local machine).
// This is the ONLY placeholder that should remain in the entire codebase.
export const API_BASE_URL = 'https://5a61-71-47-5-48.ngrok-free.app'; // NO trailing slash

// Base path for constructing full image URLs if images are served from the backend.
// For Phase 1, frontend primarily deals with local URIs for new images and receives filenames for existing ones.
// This path will be more relevant in later phases when displaying images from the server.
// Ensure this path aligns with your backend's image serving endpoint.
export const IMAGE_API_PATH = `${API_BASE_URL}/api/images/`; // Example, adjust if backend serves images differently

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`, // API routes are typically prefixed with /api
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for requests
});

// Request Interceptor: Adds the X-User-UUID header to authenticated requests.
// This is crucial for the backend to identify the user.
apiClient.interceptors.request.use(
  (config) => {
    const { uuid } = useAuthStore.getState(); // Get UUID from the auth store
    if (uuid && config.headers) {
      // Ensure the header key matches exactly what the backend expects.
      config.headers['X-User-UUID'] = uuid;
    }
    return config;
  },
  (error) => {
    console.error('API Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Basic error logging. Can be expanded for global error handling.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response Data:', error.response.data);
      console.error('API Error Response Status:', error.response.status);
      // console.error('API Error Response Headers:', error.response.headers); // Can be verbose
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response (Request Error):', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Message:', error.message);
    }
    // It's important to reject the promise so that .catch() blocks in services/stores can handle it.
    return Promise.reject(error);
  }
);

export default apiClient;
