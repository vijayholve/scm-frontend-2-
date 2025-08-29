
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button, // Keep Button for file input label if needed, or remove if not used directly
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Typography,
    Autocomplete
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';

import MainCard from 'ui-component/cards/MainCard';
import SaveButton from 'layout/MainLayout/Button/SaveButton';// Import the reusable SaveButton
import BackButton from 'layout/MainLayout/Button/BackButton';// Import the reusable BackButton
import api, { userDetails } from 'utils/apiService';
import { gridSpacing } from 'store/constant';

const userTypes = ['ALL', 'ADMIN', 'TEACHER', 'STUDENT'];

const DocumentUpload = ({ ...others }) => {
    const navigate = useNavigate();
    const accountId = userDetails.getAccountId();
    const [schools, setSchools] = useState([]);
    const [classes, setClasses] = useState([]);
    const [divisions, setDivisions] = useState([]);
    

    // Load all schools, classes, and divisions for the given accountId as soon as the page loads
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch schools
                const schoolsRes = await api.get(`/api/schoolBranches/getAllBy/${accountId}`);
                setSchools(schoolsRes.data || []);

                // Fetch classes
                const classesRes = await api.get(`/api/schoolClasses/getAllBy/${accountId}`);
                setClasses(classesRes.data || []);

                // Fetch divisions
                const divisionsRes = await api.get(`/api/divisions/getAllBy/${accountId}`);
                setDivisions(divisionsRes.data || []);
            } catch (error) {
                console.error('Failed to fetch school/class/division data:', error);
                toast.error('Failed to load school/class/division data.');
            }
        };
        fetchAllData();
    }, [accountId]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        const formData = new FormData();
        formData.append('file', values.file);
        formData.append('userType', values.userType);
        formData.append('schoolId', values.schoolId);
        // Only append classId and divisionId if they are selected
        if (values.classId) formData.append('classId', values.classId);
        if (values.divisionId) formData.append('divisionId', values.divisionId);

        try {
            await api.post(`/api/documents/upload/${accountId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Document uploaded successfully!');
            resetForm();
            navigate('/masters/document-hub');
        } catch (error) {
            console.error('Failed to upload document:', error);
            toast.error('Failed to upload document.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <MainCard title="Upload Document">
            <Formik
                initialValues={{
                    file: null,
                    userType: 'ALL',
                    schoolId: '',
                    classId: '',
                    divisionId: '',
                    schoolName: '',
                    className: '',
                    divisionName: '',
                }}
                validationSchema={Yup.object().shape({
                    file: Yup.mixed().required('A file is required'),
                    userType: Yup.string().required('User type is required'),
                    schoolId: Yup.string().required('School is required'),
                    classId: Yup.string().when('userType', {
                        is: val => val === 'STUDENT',
                        then: schema => schema.required('Class is required for students'),
                        otherwise: schema => schema.notRequired().nullable(), // Allow null if not student
                    }),
                    divisionId: Yup.string().when('userType', {
                        is: val => val === 'STUDENT',
                        then: schema => schema.required('Division is required for students'),
                        otherwise: schema => schema.notRequired().nullable(), // Allow null if not student
                    }),
                })}
                onSubmit={handleSubmit}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={Boolean(touched.schoolId && errors.schoolId)}>
                                    <InputLabel>School</InputLabel>
                                    <Select
                                        value={values.schoolId}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setFieldValue('schoolName', e.target.value);
                                            setFieldValue('classId', '');
                                            setFieldValue('divisionId', '');
                                        }}
                                        onBlur={handleBlur}
                                        name="schoolId"
                                        label="School"
                                    >
                                        <MenuItem value="">
                                            <em>Select a School</em>
                                        </MenuItem>
                                        {schools.map((school) => (
                                            <MenuItem key={school.id} value={school.id}>
                                                {school.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.schoolId && errors.schoolId && <FormHelperText>{errors.schoolId}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={Boolean(touched.userType && errors.userType)}>
                                    <InputLabel>Visible To</InputLabel>
                                    <Select
                                        value={values.userType}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // Reset class/division if userType changes from STUDENT
                                            if (e.target.value !== 'STUDENT') {
                                                setFieldValue('classId', '');
                                                setFieldValue('divisionId', '');
                                            }
                                        }}
                                        onBlur={handleBlur}
                                        name="userType"
                                        label="Visible To"
                                    >
                                        {userTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.userType && errors.userType && <FormHelperText>{errors.userType}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={Boolean(touched.classId && errors.classId)}>
                                    <InputLabel>Class</InputLabel>
                                    <Select
                                        value={values.classId}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setFieldValue('className', e.target.value);
                                            setFieldValue('divisionId', '');
                                        }}
                                        onBlur={handleBlur}
                                        name="classId"
                                        label="Class"
                                       // disabled={!values.schoolId || values.userType !== 'STUDENT'} // Only enable if school selected AND userType is STUDENT
                                    >
                                        <MenuItem value="">
                                            <em>Select a Class</em>
                                        </MenuItem>
                                        {classes.map((cls) => (
                                            <MenuItem key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.classId && errors.classId && <FormHelperText>{errors.classId}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={Boolean(touched.divisionId && errors.divisionId)}>
                                    <InputLabel>Division</InputLabel>
                                    <Select
                                        value={values.divisionId}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setFieldValue('divisionName', e.target.value);
                                        }}
                                        onBlur={handleBlur}
                                        name="divisionId"
                                        label="Division"
                                       // disabled={!values.classId || values.userType !== 'STUDENT'} // Only enable if class selected AND userType is STUDENT
                                    >
                                        <MenuItem value="">
                                            <em>Select a Division</em>
                                        </MenuItem>
                                        {divisions.map((division) => (
                                            <MenuItem key={division.id} value={division.id}>
                                                {division.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.divisionId && errors.divisionId && <FormHelperText>{errors.divisionId}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="file"
                                    label="Select File"
                                    onChange={(event) => {
                                        setFieldValue('file', event.currentTarget.files[0]);
                                    }}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.file && errors.file)}
                                    helperText={touched.file && errors.file ? errors.file : 'Select a document to upload'}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                    <BackButton backUrl="/masters/document-hub" />
                                    <SaveButton
                                        title="Upload"
                                        isSubmitting={isSubmitting}
                                        onClick={handleSubmit} // Pass Formik's handleSubmit
                                        disabled={isSubmitting || !values.file} // Disable if no file selected
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </MainCard>
    );
};

export default DocumentUpload;