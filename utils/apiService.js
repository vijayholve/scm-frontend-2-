import axios from 'axios';
import { toast } from 'react-hot-toast';

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
    'Content-Type': 'application/json'
  }
});

// --- Axios Interceptors ---
apiClient.interceptors.request.use(
  (config) => {
    const authData = getAuthData();
    const token = authData?.accessToken;
    const userId = authData?.data?.id;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // // Add userId as the last request param if available
    // if (userId) {
    //   // Ensure params exists
    //   config.params = config.params || {};

    //   // Add userId as a param, possibly overwriting if already present
    //   config.params.userId = userId;
    // }

    return config;
  },
  (error) => Promise.reject(error)
);
export const getUserSchoolClassDivision = () => {
  const user = userDetails.getUser();
  console.log('User Details:', user);
  if (user?.type === 'STUDENT') {
    return {
      schoolId: user.schoolId || null,
      classId: user.classId || null,
      divisionId: user.divisionId || null
    };
  }
  return {
    schoolId: null,
    classId: null,
    divisionId: null
  };
};

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
  getPermissions: () => getAuthData()?.data?.role?.permissions || []
};

// NEW: document helpers
export const getDocumentsByAccountAndUser = (accountId, userId) => {
  // GET /api/documents/{accountId}/{userId} - returns array or paged result
  return apiClient.get(`/api/documents/${accountId}/${userId}`);
};

export const downloadUserDocument = (accountId, userId, documentId) => {
  // Returns a blob response
  return apiClient.get(`/api/documents/download/${accountId}/${userId}/${documentId}`, { responseType: 'blob' });
};

// --- Default export ---
export default apiClient;
