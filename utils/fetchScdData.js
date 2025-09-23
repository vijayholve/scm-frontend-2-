import api from './apiService';
import { userDetails } from './apiService';

/**
 * Fetches and stores School, Class, and Division data in localStorage.
 * This function should be called once after a user logs in.
 */
export const fetchAndStoreSCDData = async () => {
  const accountId = userDetails.getAccountId();
  if (!accountId) {
    console.error('Account ID not available. Cannot fetch SCD data.');
    return;
  }

  try {
    const payload = { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' };
    const [schoolsRes, classesRes, divisionsRes] = await Promise.all([
      api.post(`/api/schoolBranches/getAll/${accountId}`, payload),
      api.post(`/api/schoolClasses/getAll/${accountId}`, payload),
      api.post(`/api/divisions/getAll/${accountId}`, payload),
    ]);

    const scdData = {
      schools: schoolsRes.data.content || [],
      classes: classesRes.data.content || [],
      divisions: divisionsRes.data.content || [],
    };

    localStorage.setItem('SCM_SCD_DATA', JSON.stringify(scdData));
    console.log('SCD data fetched and stored successfully.');
  } catch (error) {
    console.error('Failed to fetch and store SCD data:', error);
  }
};