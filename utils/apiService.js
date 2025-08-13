import axios from 'axios';
import { toast } from 'react-hot-toast';

// --- Helper Function for Local Storage ---
/**
 * Safely retrieves and parses the authentication data from localStorage.
 */
const getAuthData = () => {
  try {
    const authDataString = localStorage.getItem('SCM-AUTH');
    return authDataString ? JSON.parse(authDataString) : null;
  } catch (error) {
    console.error('Failed to parse auth data from localStorage:', error);
    localStorage.removeItem('SCM-AUTH');
    return null;
  }
};

// --- Axios Client Configuration ---
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Axios Interceptors ---
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthData()?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error('Session expired. Please log in again.');
      // Here you would typically redirect to the login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- User Details Helper ---
export const userDetails = {
  getUser: () => getAuthData()?.data || null,
  getAccountId: () => getAuthData()?.data?.accountId || null,
  getPermissions: () => getAuthData()?.data?.role?.permissions || [],
};

// --- Default export ---
export default apiClient;
