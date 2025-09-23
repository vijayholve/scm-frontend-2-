import React, { createContext, useContext, useState, useCallback } from 'react';
import api from 'utils/apiService';
import { toast } from 'react-hot-toast';

const DataCacheContext = createContext();

export const useDataCache = () => {
  const context = useContext(DataCacheContext);
  if (!context) {
    throw new Error('useDataCache must be used within a DataCacheProvider');
  }
  return context;
};

export const DataCacheProvider = ({ children }) => {
  const [cache, setCache] = useState(new Map());
  const [loadingStates, setLoadingStates] = useState(new Map());

  const getCacheKey = useCallback((fetchUrl, filters = {}, searchText = '', page = 0, pageSize = 10) => {
    return JSON.stringify({ fetchUrl, filters, searchText, page, pageSize });
  }, []);

  const fetchData = useCallback(
    async (
      fetchUrl,
      {
        filters = {},
        searchText = '',
        page = 0,
        pageSize = 10,
        isPostRequest = true,
        requestMethod = 'POST',
        sendBodyOnGet = false,
        transformData = null,
        forceRefresh = false
      }
    ) => {
      const cacheKey = getCacheKey(fetchUrl, filters, searchText, page, pageSize);

      // Return cached data if available and not forcing refresh
      if (!forceRefresh && cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }

      // Check if already loading this request
      if (loadingStates.get(cacheKey)) {
        return new Promise((resolve) => {
          const checkCache = () => {
            if (cache.has(cacheKey)) {
              resolve(cache.get(cacheKey));
            } else {
              setTimeout(checkCache, 100);
            }
          };
          checkCache();
        });
      }

      // Set loading state
      setLoadingStates((prev) => new Map(prev).set(cacheKey, true));

      try {
        let response;
        const method = (requestMethod || (isPostRequest ? 'POST' : 'GET')).toUpperCase();

        if (method === 'POST') {
          const payload = {
            page,
            size: pageSize,
            sortBy: 'id',
            sortDir: 'asc',
            search: searchText,
            ...filters
          };
          response = await api.post(fetchUrl, payload);
        } else {
          const payload = {
            page,
            size: pageSize,
            sortBy: 'id',
            sortDir: 'asc',
            search: searchText,
            ...filters
          };
          if (sendBodyOnGet) {
            response = await api.get(fetchUrl, { data: payload });
          } else {
            const queryParams = new URLSearchParams({
              page,
              size: pageSize,
              search: searchText,
              ...filters
            });
            response = await api.get(`${fetchUrl}?${queryParams}`);
          }
        }

        const responseData = response.data.content || response.data || [];
        const transformedData = transformData ? responseData.map(transformData) : responseData;

        const result = {
          data: transformedData,
          totalElements: response.data.totalElements || response.data.length || 0,
          success: true
        };

        // Cache the result
        setCache((prev) => new Map(prev).set(cacheKey, result));

        return result;
      } catch (err) {
        console.error(`Failed to fetch data from ${fetchUrl}:`, err);
        toast.error('Could not fetch data.');

        const errorResult = {
          data: [],
          totalElements: 0,
          success: false,
          error: err.message
        };

        return errorResult;
      } finally {
        // Remove loading state
        setLoadingStates((prev) => {
          const newMap = new Map(prev);
          newMap.delete(cacheKey);
          return newMap;
        });
      }
    },
    [cache, getCacheKey]
  );

  const clearCache = useCallback((fetchUrl = null) => {
    if (fetchUrl) {
      // Clear cache for specific URL
      setCache((prev) => {
        const newCache = new Map();
        for (const [key, value] of prev) {
          const parsed = JSON.parse(key);
          if (parsed.fetchUrl !== fetchUrl) {
            newCache.set(key, value);
          }
        }
        return newCache;
      });
    } else {
      // Clear all cache
      setCache(new Map());
    }
  }, []);

  const isLoading = useCallback(
    (fetchUrl, filters = {}, searchText = '', page = 0, pageSize = 10) => {
      const cacheKey = getCacheKey(fetchUrl, filters, searchText, page, pageSize);
      return loadingStates.get(cacheKey) || false;
    },
    [getCacheKey, loadingStates]
  );

  const value = {
    fetchData,
    clearCache,
    isLoading,
    cache: cache.size // For debugging
  };

  return <DataCacheContext.Provider value={value}>{children}</DataCacheContext.Provider>;
};
