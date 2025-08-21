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

    // Effect to fetch all schools on initial load
    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const payload = { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' };
                const response = await api.post(`/api/schoolBranches/getAll/${accountId}`, payload);
                setSchools(response.data.content || []);
            } catch (error) {
                console.error(`Failed to fetch schools:`, error);
            }
        };
        fetchSchools();
    }, [accountId]);

    // Effect to fetch classes when a school is selected
    useEffect(() => {
        const fetchClasses = async () => {
            if (formik.values.schoolId) {
                try {
                    const payload = {
                        page: 0,
                        size: 1000,
                        sortBy: 'id',
                        sortDir: 'asc',
                        schoolId: formik.values.schoolId
                    };
                    const response = await api.post(`/api/schoolClasses/getAll/${accountId}`, payload);
                    setClasses(response.data.content || []);
                } catch (error) {
                    console.error(`Failed to fetch classes for school ${formik.values.schoolId}:`, error);
                }
            } else {
                setClasses([]);
            }
        };

        // Reset class and division when school changes
        formik.setFieldValue('classId', '');
        formik.setFieldValue('divisionId', '');
        fetchClasses();

    }, [accountId, formik.values.schoolId, formik.setFieldValue]);

    // Effect to fetch divisions when a class is selected
    useEffect(() => {
        const fetchDivisions = async () => {
            if (formik.values.classId) {
                try {
                    const payload = {
                        page: 0,
                        size: 1000,
                        sortBy: 'id',
                        sortDir: 'asc',
                        classId: formik.values.classId
                    };
                    const response = await api.post(`/api/divisions/getAll/${accountId}`, payload);
                    setDivisions(response.data.content || []);
                } catch (error) {
                    console.error(`Failed to fetch divisions for class ${formik.values.classId}:`, error);
                }
            } else {
                setDivisions([]);
            }
        };

        // Reset division when class changes
        formik.setFieldValue('divisionId', '');
        fetchDivisions();

    }, [accountId, formik.values.classId, formik.setFieldValue]);


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
                        disabled={!formik.values.schoolId}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
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
                        value={formik.values.divisionId || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Division"
                        disabled={!formik.values.classId}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
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