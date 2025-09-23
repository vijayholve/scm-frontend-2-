import axios from 'axios';
import { toast } from 'react-hot-toast';

const getSCDData = () => {
  try {
    const sCDDataString = localStorage.getItem('SCM-SCD');
    return sCDDataString ? JSON.parse(sCDDataString) : null;
  } catch (error) {
    console.error('Failed to parse sCD data from localStorage:', error);
    localStorage.removeItem('SCM-SCD');
    return null;
  }
};

// --- Axios Client Configuration ---
const apiClientSCD = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Axios Interceptors ---
apiClientSCD.interceptors.request.use(
  (config) => {
    const token = getSCDData()?.accessToken;
    if (token) {
      config.headers.SCDorization = `Bearer ${token}`;
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
  getUser: () => getSCDData()?.data || null,
  getAccountId: () => getSCDData()?.data?.accountId || null,
  getPermissions: () => getSCDData()?.data?.role?.permissions || [],
};
// if user Type is Student then return schoolId, classId, divisionId from userDetails 
export const getUserSchoolClassDivision = () => {
  const user = getSCDData()?.data || null;
  console.log("User Details:", user);
  if (user?.type === 'STUDENT') {
    return {
      schoolId: user.schoolId || null,
      classId: user.classId || null,
      divisionId: user.divisionId || null,
    };
  }
  return {
    schoolId: null,
    classId: null,
    divisionId: null,
  };
}

// --- Default export ---
export default apiClient;
