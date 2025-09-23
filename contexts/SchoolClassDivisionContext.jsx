import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import api, { userDetails } from 'utils/apiService';
import { toast } from 'react-hot-toast';

const SchoolClassDivisionContext = createContext();

export const useSchoolClassDivision = () => {
  const context = useContext(SchoolClassDivisionContext);
  if (!context) {
    throw new Error('useSchoolClassDivision must be used within a SchoolClassDivisionProvider');
  }
  return context;
};

export const SchoolClassDivisionProvider = ({ children }) => {
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const [schoolNameMap, setSchoolNameMap] = useState({});
  const [classNameMap, setClassNameMap] = useState({});
  const [divisionNameMap, setDivisionNameMap] = useState({});

  const [loading, setLoading] = useState({
    schools: false,
    classes: false,
    divisions: false
  });

  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Use refs to track if data has been fetched
  const schoolsFetched = useRef(false);
  const classesFetched = useRef(false);
  const divisionsFetched = useRef(false);

  const accountId = userDetails.getAccountId();

  // Fetch schools
  const fetchSchools = useCallback(
    async (forceRefresh = false) => {
      if (!forceRefresh && schoolsFetched.current) return schools;

      setLoading((prev) => ({ ...prev, schools: true }));
      try {
        const response = await api.post(`/api/schoolBranches/getAll/${accountId}`, {
          page: 0,
          size: 1000,
          sortBy: 'id',
          sortDir: 'asc'
        });

        const schoolData = response.data.content || [];
        setSchools(schoolData);
        schoolsFetched.current = true;

        // Create name map
        const nameMap = {};
        schoolData.forEach((school) => {
          nameMap[school.id] = school.name;
        });
        setSchoolNameMap(nameMap);

        return schoolData;
      } catch (err) {
        console.error('Failed to fetch schools:', err);
        setError('Failed to fetch schools');
        toast.error('Failed to fetch schools');
        return [];
      } finally {
        setLoading((prev) => ({ ...prev, schools: false }));
      }
    },
    [accountId] // Remove schools.length dependency
  );

  // Fetch classes
  const fetchClasses = useCallback(
    async (schoolId = null, forceRefresh = false) => {
      if (!forceRefresh && !schoolId && classesFetched.current) return classes;

      setLoading((prev) => ({ ...prev, classes: true }));
      try {
        const payload = {
          page: 0,
          size: 1000,
          sortBy: 'id',
          sortDir: 'asc'
        };

        if (schoolId) {
          payload.schoolId = schoolId;
        }

        const response = await api.post(`/api/schoolClasses/getAll/${accountId}`, payload);
        const classData = response.data.content || [];

        if (!schoolId) {
          setClasses(classData);
          classesFetched.current = true;
          // Create name map for all classes
          const nameMap = {};
          classData.forEach((cls) => {
            nameMap[cls.id] = cls.name;
          });
          setClassNameMap(nameMap);
        }

        return classData;
      } catch (err) {
        console.error('Failed to fetch classes:', err);
        setError('Failed to fetch classes');
        toast.error('Failed to fetch classes');
        return [];
      } finally {
        setLoading((prev) => ({ ...prev, classes: false }));
      }
    },
    [accountId] // Remove classes.length dependency
  );

  // Fetch divisions
  const fetchDivisions = useCallback(
    async (classId = null, forceRefresh = false) => {
      if (!forceRefresh && !classId && divisionsFetched.current) return divisions;

      setLoading((prev) => ({ ...prev, divisions: true }));
      try {
        const payload = {
          page: 0,
          size: 1000,
          sortBy: 'id',
          sortDir: 'asc'
        };

        if (classId) {
          payload.classId = classId;
        }

        const response = await api.post(`/api/divisions/getAll/${accountId}`, payload);
        const divisionData = response.data.content || [];

        if (!classId) {
          setDivisions(divisionData);
          divisionsFetched.current = true;
          // Create name map for all divisions
          const nameMap = {};
          divisionData.forEach((division) => {
            nameMap[division.id] = division.name;
          });
          setDivisionNameMap(nameMap);
        }

        return divisionData;
      } catch (err) {
        console.error('Failed to fetch divisions:', err);
        setError('Failed to fetch divisions');
        toast.error('Failed to fetch divisions');
        return [];
      } finally {
        setLoading((prev) => ({ ...prev, divisions: false }));
      }
    },
    [accountId] // Remove divisions.length dependency
  );

  // Initialize all data on mount - ONLY RUNS ONCE
  useEffect(() => {
    const initializeData = async () => {
      if (initialized || !accountId) return;

      console.log('Initializing school/class/division data...'); // Debug log

      try {
        await Promise.all([fetchSchools(), fetchClasses(), fetchDivisions()]);
      } catch (err) {
        console.error('Failed to initialize school/class/division data:', err);
      } finally {
        setInitialized(true);
      }
    };

    initializeData();
  }, [accountId]); // Only depend on accountId, remove function dependencies

  // Refresh all data
  const refreshAll = useCallback(async () => {
    setLoading({ schools: true, classes: true, divisions: true });
    schoolsFetched.current = false;
    classesFetched.current = false;
    divisionsFetched.current = false;

    try {
      await Promise.all([fetchSchools(true), fetchClasses(null, true), fetchDivisions(null, true)]);
    } catch (err) {
      console.error('Failed to refresh all data:', err);
    }
  }, [fetchSchools, fetchClasses, fetchDivisions]);

  // Get school name by ID
  const getSchoolName = useCallback(
    (id) => {
      return schoolNameMap[id] || 'N/A';
    },
    [schoolNameMap]
  );

  // Get class name by ID
  const getClassName = useCallback(
    (id) => {
      return classNameMap[id] || 'N/A';
    },
    [classNameMap]
  );

  // Get division name by ID
  const getDivisionName = useCallback(
    (id) => {
      return divisionNameMap[id] || 'N/A';
    },
    [divisionNameMap]
  );

  const value = {
    // Data
    schools,
    classes,
    divisions,

    // Name maps
    schoolNameMap,
    classNameMap,
    divisionNameMap,

    // Helper functions
    getSchoolName,
    getClassName,
    getDivisionName,

    // Fetch functions
    fetchSchools,
    fetchClasses,
    fetchDivisions,
    refreshAll,

    // State
    loading,
    error,
    initialized
  };

  return <SchoolClassDivisionContext.Provider value={value}>{children}</SchoolClassDivisionContext.Provider>;
};
