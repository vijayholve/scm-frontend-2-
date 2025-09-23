import { useState, useEffect } from 'react';
import api, { userDetails } from 'utils/apiService';

/**
 * Custom hook to fetch and provide school, class, and division name maps and lists.
 * Returns: { schoolNameMap, classNameMap, divisionNameMap, schools, classes, divisions, loading, error }
 */
export default function useSchoolClassDivisionMaps() {
  const [schoolNameMap, setSchoolNameMap] = useState({});
  const [classNameMap, setClassNameMap] = useState({});
  const [divisionNameMap, setDivisionNameMap] = useState({});
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accountId = userDetails.getAccountId();

  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [schoolResponse, classResponse, divisionResponse] = await Promise.all([
          api.post(`/api/schoolBranches/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' }),
          api.post(`/api/schoolClasses/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' }),
          api.post(`/api/divisions/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' })
        ]);
        const schoolMap = {};
        (schoolResponse.data.content || []).forEach((sch) => {
          schoolMap[sch.id] = sch.name;
        });
        setSchoolNameMap(schoolMap);
        setSchools(schoolResponse.data.content || []);

        const classMap = {};
        (classResponse.data.content || []).forEach((cls) => {
          classMap[cls.id] = cls.name;
        });
        setClassNameMap(classMap);
        setClasses(classResponse.data.content || []);

        const divisionMap = {};
        (divisionResponse.data.content || []).forEach((div) => {
          divisionMap[div.id] = div.name;
        });
        setDivisionNameMap(divisionMap);
        setDivisions(divisionResponse.data.content || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDropdownData();
  }, [accountId]);

  return { schoolNameMap, classNameMap, divisionNameMap, schools, classes, divisions, loading, error };
}
