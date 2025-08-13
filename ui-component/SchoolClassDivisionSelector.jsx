import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from '@mui/material';
import api from 'utils/apiService';
import { userDetails } from 'utils/apiService';

const SchoolClassDivisionSelector = ({ formik }) => {
    const [schools, setSchools] = useState([]);
    const [classes, setClasses] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const accountId = userDetails.getAccountId();

    // Defensive Check: Prevent crash if formik prop is not provided
    if (!formik) {
        console.error("SchoolClassDivisionSelector component requires a 'formik' prop, but it was not provided.");
        return <Typography color="error">Error: Selector is missing required form properties.</Typography>;
    }

    useEffect(() => {
        const fetchData = async (endpoint, setter) => {
            try {
                // Corrected payload to include sortBy and sortDir
                const payload = {
                    page: 0,
                    size: 1000,
                    sortBy: 'id',
                    sortDir: 'asc'
                };
                const response = await api.post(`/api/${endpoint}/getAll/${accountId}`, payload);
                setter(response.data.content || []);
            } catch (error) {
                console.error(`Failed to fetch ${endpoint}:`, error);
            }
        };

        fetchData('schoolBranches', setSchools);
        fetchData('schoolClasses', setClasses);
        fetchData('divisions', setDivisions);
    }, [accountId]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={formik.touched.schoolId && Boolean(formik.errors.schoolId)}>
                    <InputLabel>School</InputLabel>
                    <Select
                        name="schoolId"
                        value={formik.values.schoolId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
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
                        value={formik.values.classId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        {classes.map((cls) => (
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
                        value={formik.values.divisionId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        {divisions.map((division) => (
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
  formik: PropTypes.object.isRequired
};

export default SchoolClassDivisionSelector;