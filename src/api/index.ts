import axios from 'axios';
import { useAuthStore } from '../features/auth/store/authStore'; // Adjust path if needed

// !! IMPORTANT: Replace with your actual backend URL (e.g., ngrok for local dev) !!
export const API_BASE_URL = 'https://your-backend-url.com'; // NO trailing slash

// Construct the base path for images served by the backend
// Adjust '/api/images/' if your image serving endpoint is different
export const IMAGE_API_PATH = `${API_BASE_URL}/api/images/`;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Append /api for actual API calls
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// Request interceptor to add User UUID Header (required by backend for user context)
apiClient.interceptors.request.use(
  (config) => {
    const { uuid } = useAuthStore.getState(); // Get UUID from auth store
    if (uuid && config.headers) {
      // Ensure header key matches backend expectation (e.g., 'X-User-UUID')
      config.headers['X-User-UUID'] = uuid;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for basic error logging (can be expanded)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error('API Error Response:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error('API No Response:', error.request);
    } else {
      // Error setting up the request
      console.error('API Error Message:', error.message);
    }
    // Reject the promise so downstream .catch() blocks can handle it
    return Promise.reject(error);
  }
);

export default apiClient;
