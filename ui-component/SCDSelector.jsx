import React, { useEffect, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Grid, Autocomplete, TextField, FormHelperText } from '@mui/material';
import { useSCDData } from 'contexts/SCDProvider';
import { userDetails } from 'utils/apiService';

/*
  SCDSelector usage (inside Formik render):
  <SCDSelector formik={{ values, setFieldValue, touched, errors }} />
*/
const SCDSelector = ({ formik, showSchool = true, showClass = true, showDivision = true }) => {
  const { values, setFieldValue, touched = {}, errors = {} } = formik;
  const { schools = [], classes = [], divisions = [], loading } = useSCDData();
  const currentUser = userDetails.getUser();
  const isTeacher = String(currentUser?.type || '').toUpperCase() === 'TEACHER';
  const teacherSchoolId = currentUser?.schoolId ?? null;
  const teacherAllocatedClasses = useMemo(() => currentUser?.allocatedClasses || [], [currentUser?.allocatedClasses]);

  // helpers to normalize id fields
  const getClassIdFrom = (item) => item?.id ?? item?.schoolClassId ?? item?.classId ?? item?.schoolClass?.id ?? null;
  const getDivisionIdFrom = (item) => item?.id ?? item?.divisionId ?? item?.division?.id ?? null;
  const getDivisionClassKey = (d) => d?.classId ?? d?.schoolClassId ?? d?.schoolClass?.id ?? d?.class?.id ?? null;
  const getDivisionSchoolKey = (d) => d?.schoolId ?? d?.schoolBranchId ?? d?.schoolbranchId ?? null;

  // Ensure teacher's schoolId is always set in formik (and not editable)
  useEffect(() => {
    if (isTeacher && teacherSchoolId != null && values?.schoolId !== teacherSchoolId) {
      setFieldValue('schoolId', teacherSchoolId);
      // clear dependent fields if any mismatch
      setFieldValue('classId', '');
      setFieldValue('divisionId', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeacher, teacherSchoolId]);

  const currentSchoolId = isTeacher ? teacherSchoolId : values?.schoolId;

  const filteredClasses = useMemo(() => {
    if (!Array.isArray(classes)) {
      return [];
    }

    // For teachers, only show allocated classes
    if (isTeacher && teacherAllocatedClasses.length > 0) {
      const allocatedClassIds = teacherAllocatedClasses.map((ac) => ac.classId);
      return classes.filter((c) => {
        const classId = getClassIdFrom(c);
        return allocatedClassIds.includes(classId);
      });
    }

    // For non-teachers, filter by school as before
    return classes.filter((c) => {
      const schoolKey = c.schoolbranchId ?? c.schoolBranchId ?? c.schoolId ?? c.branchId ?? null;
      return currentSchoolId ? String(schoolKey) === String(currentSchoolId) : true;
    });
  }, [classes, currentSchoolId, isTeacher, teacherAllocatedClasses]);

  // CHANGE: show divisions irrespective of whether they belong to selected class.
  // Optionally still scope by school when a school is selected to reduce noise.
  const filteredDivisions = useMemo(() => {
    if (!Array.isArray(divisions)) {
      return [];
    }

    // For teachers, only show divisions from allocated classes
    if (isTeacher && teacherAllocatedClasses.length > 0) {
      const allocatedDivisionIds = teacherAllocatedClasses.map((ac) => ac.divisionId);
      return divisions.filter((d) => {
        const divisionId = getDivisionIdFrom(d);
        return allocatedDivisionIds.includes(divisionId);
      });
    }

    // For non-teachers, filter by school as before
    // If a school is selected (or teacher has a school), filter divisions by that school only.
    if (currentSchoolId) {
      return divisions.filter((d) => {
        const schoolKey = getDivisionSchoolKey(d);
        return schoolKey ? String(schoolKey) === String(currentSchoolId) : true;
      });
    }
    // No school selected -> return all divisions
    return divisions;
  }, [divisions, currentSchoolId, isTeacher, teacherAllocatedClasses]);

  // Early return check after all hooks are declared
  if (!formik || typeof formik.setFieldValue !== 'function') {
    console.error('SCDSelector requires a formik prop with setFieldValue and values');
    return null;
  }

  const handleSchoolChange = (e, newValue) => {
    const id = newValue?.id ?? newValue?.schoolbranchId ?? newValue?.schoolId ?? null;
    setFieldValue('schoolId', id);
    setFieldValue('classId', '');
    setFieldValue('divisionId', '');
  };

  const handleClassChange = (e, newValue) => {
    const id = getClassIdFrom(newValue);
    setFieldValue('classId', id);
    // Do NOT clear divisions here — user might want to pick a division that isn't strictly linked
    // setFieldValue('divisionId', '');
  };

  const handleDivisionChange = (e, newValue) => {
    const id = getDivisionIdFrom(newValue);
    setFieldValue('divisionId', id);
  };

  // value selectors that match against multiple possible id fields
  const classValue = (filteredClasses || []).find((c) => String(getClassIdFrom(c)) === String(values?.classId)) || null;
  const divisionValue = (filteredDivisions || []).find((d) => String(getDivisionIdFrom(d)) === String(values?.divisionId)) || null;
  const schoolValue = (schools || []).find((s) => String(s.id) === String(values?.schoolId)) || null;

  // Enable division selector when a school OR class is selected (teachers have school prefilled)
  const divisionDisabled = loading || (!isTeacher && !values?.schoolId && !values?.classId);

  return (
    <Grid container spacing={2}>
      {/* School: hidden for teachers (teacher's school enforced via effect) */}
      {!isTeacher && showSchool && (
        <Grid item xs={12} sm={6}>
          <Autocomplete
            disablePortal
            value={schoolValue}
            options={schools || []}
            getOptionLabel={(option) => option?.name || ''}
            onChange={handleSchoolChange}
            renderInput={(params) => <TextField {...params} label="School" />}
            disabled={loading}
          />
          {touched?.schoolId && errors?.schoolId && <FormHelperText error>{errors.schoolId}</FormHelperText>}
        </Grid>
      )}

      {/* If teacher, optionally show a disabled display of school (comment/uncomment if desired) */}
      {isTeacher && false && (
        <Grid item xs={12} sm={6}>
          <TextField fullWidth value={schools.find((s) => String(s.id) === String(teacherSchoolId))?.name || ''} label="School" disabled />
        </Grid>
      )}

      {showClass && (
        <Grid item xs={12} sm={6}>
          <Autocomplete
            disablePortal
            value={classValue}
            options={filteredClasses || []}
            getOptionLabel={(option) => option?.name || ''}
            onChange={handleClassChange}
            renderInput={(params) => <TextField {...params} label="Class" />}
            disabled={loading || (!isTeacher && !values?.schoolId)}
          />
          {touched?.classId && errors?.classId && <FormHelperText error>{errors.classId}</FormHelperText>}
        </Grid>
      )}

      {showDivision && (
        <Grid item xs={12} sm={6}>
          <Autocomplete
            disablePortal
            value={divisionValue}
            options={filteredDivisions || []}
            getOptionLabel={(option) => option?.name || ''}
            onChange={handleDivisionChange}
            renderInput={(params) => <TextField {...params} label="Division" />}
            disabled={divisionDisabled}
          />
          {touched?.divisionId && errors?.divisionId && <FormHelperText error>{errors.divisionId}</FormHelperText>}
        </Grid>
      )}
    </Grid>
  );
};

SCDSelector.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.object.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    touched: PropTypes.object,
    errors: PropTypes.object
  }).isRequired,
  showSchool: PropTypes.bool,
  showClass: PropTypes.bool,
  showDivision: PropTypes.bool
};

export default memo(SCDSelector);
