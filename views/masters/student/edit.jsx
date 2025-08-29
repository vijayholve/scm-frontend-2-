import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    TextField,
    Tabs,
    Tab,
    Typography,
    AppBar
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast, Toaster } from 'react-hot-toast';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api, { userDetails } from '../../../utils/apiService';
import { gridSpacing } from 'store/constant';
import NavingateToOtherPage from 'ui-component/button/NavingateToOtherPage';
import BackButton from 'layout/MainLayout/Button/BackButton';
import { useSelector } from 'react-redux';

// Helper component for Tab Panel content
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component="div">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

// Function to generate accessibility props for tabs
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const EditStudent = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id: userId } = useParams();

    const [studentData, setStudentData] = useState({
        userName: '',
        password: '',
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        address: '',
        rollNo: '',
        schoolId: '',
        schoolName: '',
        classId: '',
        className: '',
        divisionId: '',
        divisionName: '',
        role: null,
        status: 'active',
    });

    const [classes, setClasses] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [schools, setSchools] = useState([]);
    const user = useSelector(state => state.user);
    const [value, setValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    // Generic function to fetch dropdown data
    const fetchData = useCallback(async (endpoint, setter, typeFilter = '') => {
        const accountId = userDetails.getAccountId();
        if (!accountId) {
            console.warn("Account ID not available. Skipping data fetch for:", endpoint);
            return;
        }
        let url = `${endpoint}/${accountId}`;
        if (typeFilter) {
            url += `?type=${typeFilter}`;
        }

        try {
            const response = await api.post(url, {
                page: 0,
                size: 1000,
                sortBy: "id",
                sortDir: "asc",
                search: ""
            });
            setter(response.data.content || []);
            console.log(`Fetched data from ${endpoint}:`, response.data.content); // Log fetched data
        } catch (error) {
            console.error(`Failed to fetch ${endpoint}:`, error);
            toast.error(`Failed to load data from ${endpoint.split('/')[1]}.`);
        }
    }, []);

    // Fetch specific student data for editing
    const fetchStudentData = useCallback(async (id) => {
        try {
            const response = await api.get(`api/users/getById?id=${id}`);
            const fetchedData = {
                ...response.data,
                // Ensure classId and divisionId are treated consistently (e.g., as strings)
                classId: response.data.classId ? String(response.data.classId) : '',
                divisionId: response.data.divisionId ? String(response.data.divisionId) : '',
                rollNo: response.data.rollNo ? String(response.data.rollNo) : '',
                schoolId: response.data.schoolId ? response.data.schoolId : '',
                role: response.data.role ? (roles.find(r => String(r.id) === String(response.data.role.id)) || { id: response.data.role.id, name: response.data.role.name }) : null
            };
            setStudentData(fetchedData);
            console.log("Fetched Student Data:", fetchedData); // Log fetched student data
        } catch (error) {
            console.error('Failed to fetch student data:', error);
            toast.error("Failed to load student data.");
        }
    }, [roles]);

    // Fetch initial data (classes, divisions, roles) on component mount
    useEffect(() => {
        fetchData('api/schoolClasses/getAll', setClasses);
        fetchData('api/divisions/getAll', setDivisions);
        fetchData('api/roles/getAll', setRoles);
        fetchData(`api/schoolBranches/getAll`, setSchools);
    }, [fetchData]);

    // Fetch student data if userId is present (for edit mode)
    useEffect(() => {
        if (userId && roles.length > 0) { // Ensure roles are loaded before fetching student data to map role object
            fetchStudentData(userId);
        } else if (!userId) {
            setStudentData({
                userName: '',
                password: '',
                firstName: '',
                lastName: '',
                mobile: '',
                email: '',
                address: '',
                rollNo: '',
                schoolId: '',
                schoolName: '',
                classId: '',
                className: '',
                divisionId: '',
                divisionName: '',
                role: null,
                status: 'active',
            });
        }
    }, [userId, roles, fetchStudentData]);

    const handleSubmit = async (values, { setSubmitting }) => {
        const userData = {
            ...values,
            id: userId || null,
            type: 'STUDENT',
            accountId: userDetails.getAccountId(),
            status: 'active',
            // Normalize role payload to expected shape
            role: values.role ? { id: values.role.id, name: values.role.name } : null
        };

        try {
            const apiCall = userId ? api.put(`api/users/update`, userData) : api.post(`api/users/save`, userData);
            const response = await apiCall;

            if (!response || (response.data?.status !== 200 && response.data?.status !== 201)) {
                const backendMessage = response?.data?.message || 'Unexpected server response.';
                toast.error(backendMessage);
                return;
            }

            toast.success(`Student ${userId ? 'updated' : 'added'} successfully`, {
                autoClose: 200,
                onClose: () => {
                    navigate('/masters/students');
                }
            });
        } catch (error) {
            const backendMessage = error?.response?.data?.message || error?.message || `Failed to ${userId ? 'update' : 'add'} student.`;
            console.error('Failed to save student data:', error);
            toast.error(backendMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const Title = userId ? 'Edit Student' : 'Add Student';

    return (
        <MainCard title={Title}>
            <Toaster position="top-right" reverseOrder={false} />
            <Box sx={{ width: '100%' }}>
                <AppBar position="static" color="default" elevation={0}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                        <Tabs value={value} onChange={handleTabChange} aria-label="student form tabs">
                            <Tab label="Student Details" {...a11yProps(0)} />
                        </Tabs>
                        <NavingateToOtherPage title="Back" PageUrl="/masters/students" />
                    </Box>
                </AppBar>

                <TabPanel value={value} index={0}>
                    <Formik
                        enableReinitialize
                        initialValues={studentData}
                        validateOnMount
                        validationSchema={Yup.object().shape({
                            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                            password: userId
                                ? Yup.string().max(255).notRequired()
                                : Yup.string().max(255).required('Password is required'),
                            userName: Yup.string().max(255).required('User Name is required'),
                            firstName: Yup.string().max(255).required('First Name is required'),
                            lastName: Yup.string().max(255).required('Last Name is required'),
                            mobile: Yup.string().matches(/^[0-9]+$/, "Mobile number must be digits only").min(10, "Mobile number must be at least 10 digits").max(15, "Mobile number cannot exceed 15 digits").required('Mobile number is required'),
                            rollNo: Yup.string().required('Roll No is required'),
                            classId: Yup.string().required('Class is required'),
                            divisionId: Yup.string().required('Division is required'),
                            role: Yup.object().nullable().required('Role is required'),
                        })}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={gridSpacing}>
                                    {/* User Name */}
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={Boolean(touched.userName && errors.userName)}>
                                            <InputLabel htmlFor="student-user-name">User Name</InputLabel>
                                            <OutlinedInput
                                                id="student-user-name"
                                                name="userName"
                                                value={values.userName}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="User Name"
                                            />
                                            {touched.userName && errors.userName && <FormHelperText>{errors.userName}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* Password (conditionally rendered/validated for add/edit) */}
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
                                            <InputLabel htmlFor="student-password">Password</InputLabel>
                                            <OutlinedInput
                                                id="student-password"
                                                name="password"
                                                type="text"
                                                value={values.password}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Password"
                                            />
                                            {touched.password && errors.password && <FormHelperText>{errors.password}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* First Name */}
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={Boolean(touched.firstName && errors.firstName)}>
                                            <InputLabel htmlFor="student-name">First Name</InputLabel>
                                            <OutlinedInput
                                                id="student-name"
                                                name="firstName"
                                                value={values.firstName}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="First Name"
                                            />
                                            {touched.firstName && errors.firstName && <FormHelperText>{errors.firstName}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* Last Name */}

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={Boolean(touched.lastName && errors.lastName)}>
                                            <InputLabel htmlFor="student-name">Last Name</InputLabel>
                                            <OutlinedInput
                                                id="student-name"
                                                name="lastName"
                                                value={values.lastName}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Last Name"
                                            />
                                            {touched.lastName && errors.lastName && <FormHelperText>{errors.lastName}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* Mobile No */}
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={Boolean(touched.mobile && errors.mobile)}>
                                            <InputLabel htmlFor="student-mobile-no">Mobile No</InputLabel>
                                            <OutlinedInput
                                                id="student-mobile-no"
                                                type="tel"
                                                name="mobile"
                                                value={values.mobile}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Mobile No"
                                            />
                                            {touched.mobile && errors.mobile && <FormHelperText>{errors.mobile}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* Email */}
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                                            <InputLabel htmlFor="student-email">Email</InputLabel>
                                            <OutlinedInput
                                                id="student-email"
                                                name="email"
                                                value={values.email}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Email"
                                            />
                                            {touched.email && errors.email && <FormHelperText>{errors.email}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* Address */}
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={Boolean(touched.address && errors.address)}>
                                            <InputLabel htmlFor="student-address">Address</InputLabel>
                                            <OutlinedInput
                                                id="student-address"
                                                name="address"
                                                value={values.address}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Address"
                                                multiline
                                                rows={2}
                                            />
                                            {touched.address && errors.address && <FormHelperText>{errors.address}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* Roll No */}
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={Boolean(touched.rollNo && errors.rollNo)}>
                                            <InputLabel htmlFor="student-roll-number">Roll No</InputLabel>
                                            <OutlinedInput
                                                id="student-roll-number"
                                                type="number"
                                                name="rollNo"
                                                value={values.rollNo}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Roll No"
                                            />
                                            {touched.rollNo && errors.rollNo && <FormHelperText>{errors.rollNo}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* School Selection */}

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={Boolean(touched.schoolId && errors.schoolId)}>
                                            <Autocomplete
                                                disablePortal
                                                id="school-autocomplete"
                                                options={schools}
                                                getOptionLabel={(option) => option.name || ''}
                                                value={schools.find((school) => school.id === values.schoolId) || null}
                                                onChange={(event, newValue) => {
                                                    setFieldValue('schoolId', newValue?.id ? newValue?.id : null);
                                                    setFieldValue('schoolName', newValue?.name ? newValue?.name : null);
                                                }}
                                                isOptionEqualToValue={(option, value) => String(option.id) === String(value?.id)}
                                                renderInput={(params) => <TextField {...params} label="School" />}
                                            />
                                            {touched.schoolId && errors.schoolId && <FormHelperText>{errors.schoolId}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* Class Selection */}
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={Boolean(touched.classId && errors.classId)}>
                                            <Autocomplete
                                                disablePortal
                                                id="class-autocomplete"
                                                options={classes}
                                                getOptionLabel={(option) => option.name || ''}
                                                value={classes.find((cls) => String(cls.id) === String(values.classId)) || null} // Ensure type consistency
                                                onChange={(event, newValue) => {
                                                    setFieldValue('classId', newValue ? String(newValue.id) : ''); // Store as string
                                                    setFieldValue('className', newValue?.name ? newValue?.name : null);
                                                }}
                                                isOptionEqualToValue={(option, value) => String(option.id) === String(value?.id)}
                                                renderInput={(params) => <TextField {...params} label="Class" />}
                                            />
                                            {touched.classId && errors.classId && <FormHelperText>{errors.classId}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* Division Selection */}
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={Boolean(touched.divisionId && errors.divisionId)}>
                                            <Autocomplete
                                                disablePortal
                                                id="division-autocomplete"
                                                options={divisions} // Filter divisions by selected class, ensure type consistency
                                                getOptionLabel={(option) => option.name || ''}
                                                value={divisions.find((div) => String(div.id) === String(values.divisionId)) || null} // Ensure type consistency
                                                onChange={(event, newValue) => {
                                                    setFieldValue('divisionId', newValue ? String(newValue.id) : ''); // Store as string
                                                    setFieldValue('divisionName', newValue?.name ? newValue?.name : null);
                                                }}
                                                renderInput={(params) => <TextField {...params} label="Division" />}
                                                disabled={!values.classId} // Disable if no class is selected
                                                isOptionEqualToValue={(option, value) => String(option.id) === String(value?.id)}
                                            />
                                            {touched.divisionId && errors.divisionId && <FormHelperText>{errors.divisionId}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* Role Selection */}
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={Boolean(touched.role && errors.role)}>
                                            <Autocomplete
                                                disablePortal
                                                id="role-autocomplete"
                                                options={roles}
                                                getOptionLabel={(option) => option.name || ''}
                                                value={values.role || null}
                                                onChange={(event, newValue) => {
                                                    setFieldValue('role', newValue);
                                                }}
                                                isOptionEqualToValue={(option, value) => String(option.id) === String(value?.id)}
                                                renderInput={(params) => <TextField {...params} label="Role" />}
                                            />
                                            {touched.role && errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* Action Buttons */}
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                        <NavingateToOtherPage title="Cancel" PageUrl="/masters/students" />
                                        <AnimateButton>
                                            <Button disableElevation disabled={isSubmitting} type="submit" variant="contained" color="secondary">
                                                Save
                                            </Button>
                                        </AnimateButton>
                                        {/* <BackButton/> */}

                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </TabPanel>
            </Box>
        </MainCard>
    );
};

export default EditStudent;
