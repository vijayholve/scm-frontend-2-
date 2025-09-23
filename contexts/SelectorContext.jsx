import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import api, { userDetails } from 'utils/apiService';

const SelectorContext = createContext();

export const useSelectorData = () => {
  const context = useContext(SelectorContext);
  if (!context) {
    throw new Error('useSelectorData must be used within a SelectorProvider');
  }
  return context;
};

export const SelectorProvider = ({ children }) => {
  // Use useRef to persist data across re-renders and page navigations
  const schoolsCache = useRef([]);
  const classesCache = useRef(new Map()); // Map: schoolId -> classes[]
  const divisionsCache = useRef(new Map()); // Map: classId -> divisions[]
  const fetchPromises = useRef(new Map()); // Track ongoing promises to prevent duplicate calls

  const [loading, setLoading] = useState({
    schools: false,
    classes: false,
    divisions: false
  });

  const accountId = userDetails.getAccountId();

  // Fetch schools (with persistent cache)
  const fetchSchools = useCallback(async () => {
    // Return cached data immediately if available
    if (schoolsCache.current.length > 0) {
      console.log('🏫 Returning cached schools data');
      return schoolsCache.current;
    }

    // Check if fetch is already in progress
    if (fetchPromises.current.has('schools')) {
      console.log('🏫 Schools fetch already in progress, waiting...');
      return await fetchPromises.current.get('schools');
    }

    console.log('🏫 Fetching schools from API...');
    setLoading((prev) => ({ ...prev, schools: true }));

    const fetchPromise = (async () => {
      try {
        const payload = { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' };
        const response = await api.post(`/api/schoolBranches/getAll/${accountId}`, payload);
        const schools = response.data.content || [];

        // Store in persistent cache
        schoolsCache.current = schools;
        console.log(`🏫 Cached ${schools.length} schools`);

        return schools;
      } catch (error) {
        console.error('Failed to fetch schools:', error);
        return [];
      } finally {
        setLoading((prev) => ({ ...prev, schools: false }));
        fetchPromises.current.delete('schools');
      }
    })();

    fetchPromises.current.set('schools', fetchPromise);
    return await fetchPromise;
  }, [accountId]);

  // Fetch classes for a specific school (with persistent cache)
  const fetchClasses = useCallback(
    async (schoolId) => {
      if (!schoolId) return [];

      // Return cached data immediately if available
      if (classesCache.current.has(schoolId)) {
        console.log(`📚 Returning cached classes for school ${schoolId}`);
        return classesCache.current.get(schoolId);
      }

      const cacheKey = `classes_${schoolId}`;

      // Check if fetch is already in progress
      if (fetchPromises.current.has(cacheKey)) {
        console.log(`📚 Classes fetch for school ${schoolId} already in progress, waiting...`);
        return await fetchPromises.current.get(cacheKey);
      }

      console.log(`📚 Fetching classes for school ${schoolId} from API...`);
      setLoading((prev) => ({ ...prev, classes: true }));

      const fetchPromise = (async () => {
        try {
          const payload = {
            page: 0,
            size: 1000,
            sortBy: 'id',
            sortDir: 'asc',
            schoolId: schoolId
          };
          const response = await api.post(`/api/schoolClasses/getAll/${accountId}`, payload);
          const classes = response.data.content || [];

          // Store in persistent cache
          classesCache.current.set(schoolId, classes);
          console.log(`📚 Cached ${classes.length} classes for school ${schoolId}`);

          return classes;
        } catch (error) {
          console.error(`Failed to fetch classes for school ${schoolId}:`, error);
          return [];
        } finally {
          setLoading((prev) => ({ ...prev, classes: false }));
          fetchPromises.current.delete(cacheKey);
        }
      })();

      fetchPromises.current.set(cacheKey, fetchPromise);
      return await fetchPromise;
    },
    [accountId]
  );

  // Fetch divisions for a specific class (with persistent cache)
  const fetchDivisions = useCallback(
    async (schoolId, classId) => {
      if (!classId) return [];

      // Return cached data immediately if available
      if (divisionsCache.current.has(classId)) {
        console.log(`📂 Returning cached divisions for class ${classId}`);
        return divisionsCache.current.get(classId);
      }

      const cacheKey = `divisions_${classId}`;

      // Check if fetch is already in progress
      if (fetchPromises.current.has(cacheKey)) {
        console.log(`📂 Divisions fetch for class ${classId} already in progress, waiting...`);
        return await fetchPromises.current.get(cacheKey);
      }

      console.log(`📂 Fetching divisions for class ${classId} from API...`);
      setLoading((prev) => ({ ...prev, divisions: true }));

      const fetchPromise = (async () => {
        try {
          const payload = {
            page: 0,
            size: 1000,
            sortBy: 'id',
            sortDir: 'asc',
            schoolId: schoolId,
            classId: classId
          };
          const response = await api.post(`/api/divisions/getAll/${accountId}`, payload);
          const divisions = response.data.content || [];

          // Store in persistent cache
          divisionsCache.current.set(classId, divisions);
          console.log(`📂 Cached ${divisions.length} divisions for class ${classId}`);

          return divisions;
        } catch (error) {
          console.error(`Failed to fetch divisions for class ${classId}:`, error);
          return [];
        } finally {
          setLoading((prev) => ({ ...prev, divisions: false }));
          fetchPromises.current.delete(cacheKey);
        }
      })();

      fetchPromises.current.set(cacheKey, fetchPromise);
      return await fetchPromise;
    },
    [accountId]
  );

  // Force refresh - clears cache and refetches
  const refreshAll = useCallback(() => {
    console.log('🔄 Clearing all selector caches...');
    schoolsCache.current = [];
    classesCache.current.clear();
    divisionsCache.current.clear();
    fetchPromises.current.clear();
  }, []);

  // Get cache stats (for debugging)
  const getCacheStats = useCallback(
    () => ({
      schools: schoolsCache.current.length,
      classes: classesCache.current.size,
      divisions: divisionsCache.current.size,
      ongoingFetches: fetchPromises.current.size
    }),
    []
  );

  const value = {
    fetchSchools,
    fetchClasses,
    fetchDivisions,
    refreshAll,
    getCacheStats,
    loading
  };

  return <SelectorContext.Provider value={value}>{children}</SelectorContext.Provider>;
};
