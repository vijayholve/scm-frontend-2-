import api, { userDetails } from '../../../utils/apiService';


  export  const fetchData = async (endpoint, setter) => {
      try {
        const response = await api.post(`${endpoint}/${userDetails.getAccountId()}`, {
          page: 0,
          size: 1000, // Fetch all for dropdowns
          sortBy: 'id',
          sortDir: 'asc',
          search: ''
        });
        setter(response.data.content || []);
      } catch (err) {
        console.error(`Failed to fetch data from ${endpoint}:`, err);
      }
    };