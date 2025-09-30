// src/ui-component/SchoolClassDivisionSelector.jsx
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from '@mui/material';

// Presentational selector: does NOT call useSCDData directly.
// Accepts schools/classes/divisions/loading via props (so it can be reused/tested).
const SchoolClassDivisionSelector = ({ formik, schools = [], classes = [], divisions = [], loading = false }) => {
  // Defensive Check: Prevent crash if formik prop is not provided
  if (!formik) {
    console.error("SchoolClassDivisionSelector component requires a 'formik' prop, but it was not provided.");
    return <Typography color="error">Error: Selector is missing required form properties.</Typography>;
  }

  // Filter classes and divisions based on current formik values (safe guards)
  const filteredClasses = Array.isArray(classes) ? classes.filter((cls) => String(cls.schoolbranchId) === String(formik.values.schoolId)) : [];
  const filteredDivisions = Array.isArray(divisions) ? divisions.filter((div) => String(div.classId) === String(formik.values.classId)) : [];

  // Clear dependent fields when parents change
  useEffect(() => {
    // Clear class and division if school changes
    if (formik.values.schoolId !== formik.previousValues?.schoolId) {
      formik.setFieldValue('classId', '');
      formik.setFieldValue('divisionId', '');
    }
    // Clear division if class changes
    if (formik.values.classId !== formik.previousValues?.classId) {
      formik.setFieldValue('divisionId', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.schoolId, formik.values.classId]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth error={formik.touched.schoolId && Boolean(formik.errors.schoolId)}>
          <InputLabel>School</InputLabel>
          <Select
            name="schoolId"
            value={formik.values.schoolId || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="School"
            disabled={loading}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {schools.map((school) => (
              <MenuItem key={school.id} value={school.id}>
                {school.name}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.schoolId && formik.errors.schoolId && <FormHelperText>{formik.errors.schoolId}</FormHelperText>}
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={4}>
        <FormControl fullWidth error={formik.touched.classId && Boolean(formik.errors.classId)}>
          <InputLabel>Class</InputLabel>
          <Select
            name="classId"
            value={formik.values.classId || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Class"
            disabled={loading || !formik.values.schoolId}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {filteredClasses.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.name}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.classId && formik.errors.classId && <FormHelperText>{formik.errors.classId}</FormHelperText>}
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={4}>
        <FormControl fullWidth error={formik.touched.divisionId && Boolean(formik.errors.divisionId)}>
          <InputLabel>Division</InputLabel>
          <Select
            name="divisionId"
            value={formik.values.divisionId || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Division"
            disabled={loading || !formik.values.classId}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {filteredDivisions.map((division) => (
              <MenuItem key={division.id} value={division.id}>
                {division.name}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.divisionId && formik.errors.divisionId && <FormHelperText>{formik.errors.divisionId}</FormHelperText>}
        </FormControl>
      </Grid>
    </Grid>
  );
};

SchoolClassDivisionSelector.propTypes = {
  formik: PropTypes.object.isRequired,
  schools: PropTypes.array,
  classes: PropTypes.array,
  divisions: PropTypes.array,
  loading: PropTypes.bool
};

export default SchoolClassDivisionSelector;