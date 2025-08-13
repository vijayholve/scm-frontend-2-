import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import apiClient from '../utils/apiService'; // Correctly import the default export

/**
 * A generic hook to fetch data using a POST request with a payload.
 * This version is more robust and constructs the payload internally.
 * @param {string | null} url - The API endpoint to fetch from. If null, the fetch is skipped.
 * @param {object} [paginationModel] - The pagination model from the DataGrid.
 * @param {object} [filters] - Additional filters to apply to the request.
 */
const useFetchData = (url, paginationModel, filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use useCallback to memoize the fetchData function
  const fetchData = useCallback(async () => {
    // If the URL is null or undefined, don't attempt to fetch
    if (!url) {
      setData(null); // Clear previous data if any
      return;
    }

    // DEFENSIVE PAYLOAD CONSTRUCTION: This robust approach prevents the "paginationModel is undefined" error
    // by checking for the existence and type of the properties before using them.
    const page = paginationModel && typeof paginationModel.page === 'number' ? paginationModel.page : 0;
    const pageSize = paginationModel && typeof paginationModel.pageSize === 'number' ? paginationModel.pageSize : 10;

    const payload = {
      page: page,
      size: pageSize,
      sortBy: 'id',
      sortDir: 'asc',
      search: '',
      ...filters // Merge any additional filters
    };

    setLoading(true);
    try {
      const response = await apiClient.post(url, payload);
      setData(response.data);
    } catch (error) {
      console.error(`Failed to fetch data from ${url}:`, error);
      toast.error('Could not load data. Please try refreshing.');
      setData(null); // Clear data on error
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(paginationModel), JSON.stringify(filters)]); // Deep-compare dependencies

  // The main effect to trigger the fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependency array includes the memoized fetchData function

  // Return the state and the refetch function
  return { data, loading, refetch: fetchData };
};

export default useFetchData;
