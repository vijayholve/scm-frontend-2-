import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ListGridFilters from './ListGridFilters';
import { getUserSchoolClassDivision, userDetails } from 'utils/apiService';
import { useSCDData } from 'contexts/SCDProvider';

// Container enforces payload rules for Teacher / Student while reusing the presentational ListGridFilters
const ListGridFiltersContainer = ({
  filters = {},
  onFiltersChange,
  showSchool = true,
  showClass = true,
  showDivision = true,
  showClearAll = true,
  ActiveFiltersDisplay = true
}) => {
  const user = useSelector((state) => state.user.user) || null;
  const isStudent = String(user?.type || '').toUpperCase() === 'STUDENT';
  const isTeacher = String(user?.type || '').toUpperCase() === 'TEACHER';
  const teacherSchoolId = user?.schoolId ?? userDetails.getUser()?.schoolId ?? null;

  const { schools = [], classes = [], divisions = [], loading = false } = useSCDData();

  // Student defaults come from utility (if available)
  const studentDefaults = useMemo(() => {
    const sd = getUserSchoolClassDivision() || {};
    return {
      schoolId: sd.schoolId ?? user?.schoolId ?? null,
      classId: sd.classId ?? user?.classId ?? null,
      divisionId: sd.divisionId ?? user?.divisionId ?? null
    };
  }, [user]);

  // initial filters to pass to presentational component
  const initialFilters = useMemo(() => {
    if (isStudent) {
      return { ...filters, ...studentDefaults };
    }
    if (isTeacher) {
      return { ...filters, schoolId: teacherSchoolId ?? filters.schoolId ?? '' };
    }
    return filters;
  }, [filters, isStudent, isTeacher, studentDefaults, teacherSchoolId]);

  // wrapper to enforce payload rules before sending to parent
  const handleFiltersChange = useCallback(
    (f) => {
      let payload = { ...(f || {}) };

      if (isStudent) {
        payload = {
          schoolId: studentDefaults.schoolId ?? payload.schoolId ?? '',
          classId: studentDefaults.classId ?? payload.classId ?? '',
          divisionId: studentDefaults.divisionId ?? payload.divisionId ?? ''
        };
      } else if (isTeacher) {
        // If teacher selects a class or division, include them in the payload
        payload = {
          schoolId: teacherSchoolId ?? payload.schoolId ?? '',
          classId: payload.classId ?? '',
          divisionId: payload.divisionId ?? ''
        };
      }

      // Remove classList and divisionList from the payload
      delete payload.classList;
      delete payload.divisionList;

      // Remove empty or null values from the payload
      Object.keys(payload).forEach((k) => {
        if (payload[k] === '' || payload[k] == null) delete payload[k];
      });

      onFiltersChange(payload);
    },
    [isStudent, isTeacher, studentDefaults, teacherSchoolId, onFiltersChange]
  );

  return (
    <ListGridFilters
      filters={initialFilters}
      onFiltersChange={handleFiltersChange}
      showSchool={showSchool}
      showClass={showClass}
      showDivision={showDivision}
      showClearAll={showClearAll}
      ActiveFiltersDisplay={ActiveFiltersDisplay}
      // pass SCD lists into presentational component
      schools={schools}
      classes={classes}
      divisions={divisions}
      loading={loading}
    />
  );
};

ListGridFiltersContainer.propTypes = {
  filters: PropTypes.object,
  onFiltersChange: PropTypes.func.isRequired,
  showSchool: PropTypes.bool,
  showClass: PropTypes.bool,
  showDivision: PropTypes.bool,
  showClearAll: PropTypes.bool,
  ActiveFiltersDisplay: PropTypes.bool
};

export default ListGridFiltersContainer;
