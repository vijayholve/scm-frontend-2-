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
    const username = authData?.data?.userName;
    console.log('Request made by user:', username);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
// pif post api call then created by and updated by
    if (userId) {
      if (config.method === 'POST') {
        config.data = {
          ...config.data,
          createdBy: userId,
          updatedBy: userId
        };
      } else if (config.method === 'put' || config.method === 'patch') {
        config.data = {
          ...config.data, 
          updatedBy: username  
        };
      }
    }
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
  getPermissions: () => getAuthData()?.data?.role?.permissions || [] ,
  getUserType: () => getAuthData()?.data?.type || 'GUEST',
  isLoggedIn: () => !!getAuthData()?.accessToken
};
export const getTodayBirthdays = async () => {
  const accountId = userDetails.getAccountId();
  const user = userDetails.getUser();
  const schoolId = user?.schoolId; // Get schoolId from logged-in user

  if (!accountId) {
    console.error('Account ID not available for fetching birthdays.');
    return [];
  }
  
  let url = `/api/users/birthdays/today/1`;
  if (schoolId) {
      // API endpoint includes schoolId as a query parameter: .../{accountID}?schoolId=1
      url += `?schoolId=${schoolId}`;
  }
  
  try {
    const response = await apiClient.get(url);
    // The API might return an array directly, or an object with a 'content'/'data' field.
    return response.data?.content || response.data || []; 
  } catch (error) {
    console.error("Failed to fetch today's birthdays:", error);
    // Silent error return empty array for UI consistency
    return [];
  }
};
// NEW: document helpers
export const getDocumentsByAccountAndUser = (accountId, userId) => {
  return apiClient.get(`/api/documents/${accountId}/${userId}`);
};

export const downloadUserDocument = (accountId, userId, documentId) => {
  return apiClient.get(`/api/documents/download/${accountId}/${userId}/${documentId}`, { responseType: 'blob' });
};

// Add this helper function to check enrollment status for a specific course
export const checkCourseEnrollmentStatus = async (accountId, courseId, studentId) => {
  try {
    const response = await apiClient.get(`/api/lms/courses/${accountId}/${courseId}/enroll/${studentId}/status`);
    return response.data;
  } catch (error) {
    console.error(`Failed to check enrollment for course ${courseId}:`, error);
    return { enrolled: false };
  }
};

// Helper function to check enrollment status across multiple courses
export const checkMultipleCourseEnrollments = async (accountId, courseIds, studentId) => {
  try {
    const enrollmentChecks = courseIds.map((courseId) => checkCourseEnrollmentStatus(accountId, courseId, studentId));

    const results = await Promise.all(enrollmentChecks);

    return courseIds
      .map((courseId, index) => ({
        courseId,
        enrollmentStatus: results[index]
      }))
      .filter((result) => result.enrollmentStatus.enrolled);
  } catch (error) {
    console.error('Failed to check multiple course enrollments:', error);
    return [];
  }
};

// --- Named export for 'api' (alias for apiClient) ---
export const api = apiClient;

// --- Default export ---
export default apiClient;
