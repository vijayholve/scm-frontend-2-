import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
import PropTypes from 'prop-types';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api, { userDetails } from 'utils/apiService';
import { gridSpacing } from 'store/constant';
import NavingateToOtherPage from 'ui-component/button/NavingateToOtherPage';
import BackButton from 'layout/MainLayout/Button/BackButton';
import { useSelector } from 'react-redux';
import ReusableLoader from 'ui-component/loader/ReusableLoader';
import UserDocumentManager from 'views/UserDocumentManager';
import SCDSelector from 'ui-component/SCDSelector';
import { useSCDData } from 'contexts/SCDProvider';
// Helper component for Tab Panel content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

TabPanel.defaultProps = {
  children: null
};

// Function to generate accessibility props for tabs
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const EditStudent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const [loader, setLoader] = useState(false);

  // roles state (was missing -> caused "roles is not defined")
  const [roles, setRoles] = useState([]);

  const [studentData, setStudentData] = useState({
    userName: '',
    password: '',
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: '',
    rollNo: '',
    // added dob for the form (ISO yyyy-mm-dd string)
    dob: '',
    schoolId: '',
    schoolName: '',
    classId: '',
    className: '',
    divisionId: '',
    divisionName: '',
    role: null,
    status: 'active'
  });

  const user = useSelector((state) => state.user);
  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  // Generic function to fetch dropdown data
  const fetchData = useCallback(async (endpoint, setter, typeFilter = '') => {
    const accountId = userDetails.getAccountId();
    if (!accountId) {
      console.warn('Account ID not available. Skipping data fetch for:', endpoint);
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
        sortBy: 'id',
        sortDir: 'asc',
        search: ''
      });
      setter(response.data.content || []);
      console.log(`Fetched data from ${endpoint}:`, response.data.content); // Log fetched data
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
      toast.error(`Failed to load data from ${endpoint.split('/')[1]}.`);
    }
  }, []);

  // Fetch specific student data for editing
  const fetchStudentData = useCallback(
    async (id) => {
      setLoader(true);
      try {
        const response = await api.get(`api/users/getById?id=${id}`);
        // helper to normalize date to yyyy-mm-dd for native date input
        const formatDateForInput = (val) => {
          if (!val) return '';
          const d = new Date(val);
          if (Number.isNaN(d.getTime())) return '';
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        };

        const fetchedData = {
          ...response.data,
          // Ensure classId and divisionId are treated consistently (e.g., as strings)
          classId: response.data.classId ? String(response.data.classId) : '',
          divisionId: response.data.divisionId ? String(response.data.divisionId) : '',
          rollNo: response.data.rollNo ? String(response.data.rollNo) : '',
          schoolId: response.data.schoolId || '',
          // map backend DOB (if present) to yyyy-mm-dd for the date input
          dob: formatDateForInput(response.data.dob || response.data.dob || response.data.date_of_birth),
          role: response.data.role
            ? roles.find((r) => String(r.id) === String(response.data.role.id)) || {
                id: response.data.role.id,
                name: response.data.role.name
              }
            : null
        };
        setStudentData(fetchedData);
        console.log('Fetched Student Data:', fetchedData); // Log fetched student data
      } catch (error) {
        console.error('Failed to fetch student data:', error);
        toast.error('Failed to load student data.');
      } finally {
        setLoader(false);
      }
    },
    [roles]
  );

  // Fetch initial data: only roles. SCD (school/class/division) is provided centrally via SCDSelector/useSCDData
  useEffect(() => {
    fetchData('api/roles/getAll', setRoles);
  }, [fetchData]);

  // Fetch student data if userId is present (for edit mode)
  useEffect(() => {
    if (userId && roles.length > 0) {
      // Ensure roles are loaded before fetching student data to map role object
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
        status: 'active'
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
      // include both dob and bateOfBirth as requested (backend may expect either)
      dob: values.dob || null,
      bateOfBirth: values.dob || null,
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

  const { t } = useTranslation('edit');
  const Title = userId ? t('student.title.edit') : t('student.title.add');
  if (loader) {
    return <ReusableLoader message={t('student.messages.loading')} />;
  }

  return (
    <MainCard title={Title}>
      <Toaster position="top-right" reverseOrder={false} />
      <Box sx={{ width: '100%' }}>
        <AppBar position="static" color="default" elevation={0}>
          <Box
            sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}
          >
            <Tabs value={value} onChange={handleTabChange} aria-label="student form tabs">
              <Tab label={t('student.tabs.details')} {...a11yProps(0)} />
              <Tab label={t('student.tabs.documents')} {...a11yProps(1)} />
            </Tabs>
          </Box>
        </AppBar>

        <TabPanel value={value} index={0}>
          <Formik
            enableReinitialize
            initialValues={studentData}
            validateOnMount
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: userId ? Yup.string().max(255).notRequired() : Yup.string().max(255).required('Password is required'),
              userName: Yup.string().max(255).required('User Name is required'),
              firstName: Yup.string().max(255).required('First Name is required'),
              lastName: Yup.string().max(255).required('Last Name is required'),
              mobile: Yup.string()
                .matches(/^[0-9]+$/, 'Mobile number must be digits only')
                .min(10, 'Mobile number must be at least 10 digits')
                .max(15, 'Mobile number cannot exceed 15 digits')
                .required('Mobile number is required'),
              rollNo: Yup.string().required('Roll No is required'),
              dob: Yup.date().nullable().max(new Date(), 'Date of Birth cannot be in the future').required('Date of Birth is required'),
              classId: Yup.string().required('Class is required'),
              divisionId: Yup.string().required('Division is required'),
              role: Yup.object().nullable().required('Role is required')
            })}
            onSubmit={handleSubmit}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={gridSpacing}>
                  {/* User Name */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={Boolean(touched.userName && errors.userName)}>
                      <InputLabel htmlFor="student-user-name">{t('student.fields.userName')}</InputLabel>
                      <OutlinedInput
                        id="student-user-name"
                        name="userName"
                        value={values.userName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label={t('student.fields.userName')}
                      />
                      {touched.userName && errors.userName && <FormHelperText>{errors.userName}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {/* Password (conditionally rendered/validated for add/edit) */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
                      <InputLabel htmlFor="student-password">{t('student.fields.password')}</InputLabel>
                      <OutlinedInput
                        id="student-password"
                        name="password"
                        type="text"
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label={t('student.fields.password')}
                      />
                      {touched.password && errors.password && <FormHelperText>{errors.password}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {/* First Name */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={Boolean(touched.firstName && errors.firstName)}>
                      <InputLabel htmlFor="student-name">{t('student.fields.firstName')}</InputLabel>
                      <OutlinedInput
                        id="student-name"
                        name="firstName"
                        value={values.firstName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label={t('student.fields.firstName')}
                      />
                      {touched.firstName && errors.firstName && <FormHelperText>{errors.firstName}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {/* Last Name */}

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={Boolean(touched.lastName && errors.lastName)}>
                      <InputLabel htmlFor="student-name">{t('student.fields.lastName')}</InputLabel>
                      <OutlinedInput
                        id="student-name"
                        name="lastName"
                        value={values.lastName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label={t('student.fields.lastName')}
                      />
                      {touched.lastName && errors.lastName && <FormHelperText>{errors.lastName}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {/* Mobile No */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={Boolean(touched.mobile && errors.mobile)}>
                      <InputLabel htmlFor="student-mobile-no">{t('student.fields.mobile')}</InputLabel>
                      <OutlinedInput
                        id="student-mobile-no"
                        type="tel"
                        name="mobile"
                        value={values.mobile}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label={t('student.fields.mobile')}
                      />
                      {touched.mobile && errors.mobile && <FormHelperText>{errors.mobile}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                      <InputLabel htmlFor="student-email">{t('student.fields.email')}</InputLabel>
                      <OutlinedInput
                        id="student-email"
                        name="email"
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label={t('student.fields.email')}
                      />
                      {touched.email && errors.email && <FormHelperText>{errors.email}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {/* Date of Birth */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={Boolean(touched.dob && errors.dob)}>
                      {/* native date input gives broad browser support without extra deps */}
                      <TextField
                        id="student-dob"
                        name="dob"
                        label={t('student.fields.dateOfBirth')}
                        type="date"
                        value={values.dob || ''}
                        onChange={(e) => setFieldValue('dob', e.target.value)}
                        onBlur={handleBlur}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ max: new Date().toISOString().split('T')[0] }}
                      />
                      {touched.dob && errors.dob && <FormHelperText>{errors.dob}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {/* Address */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={Boolean(touched.address && errors.address)}>
                      <InputLabel htmlFor="student-address">{t('student.fields.address')}</InputLabel>
                      <OutlinedInput
                        id="student-address"
                        name="address"
                        value={values.address}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label={t('student.fields.address')}
                        multiline
                        rows={2}
                      />
                      {touched.address && errors.address && <FormHelperText>{errors.address}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {/* Roll No */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={Boolean(touched.rollNo && errors.rollNo)}>
                      <InputLabel htmlFor="student-roll-number">{t('student.fields.rollNo')}</InputLabel>
                      <OutlinedInput
                        id="student-roll-number"
                        type="number"
                        name="rollNo"
                        value={values.rollNo}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label={t('student.fields.rollNo')}
                      />
                      {touched.rollNo && errors.rollNo && <FormHelperText>{errors.rollNo}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {/* School / Class / Division (reusable SCD selector) */}
                  <Grid item xs={12} sm={12}>
                    <SCDSelector formik={{ values, setFieldValue, touched, errors }} />
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
                        renderInput={(params) => <TextField {...params} label={t('student.fields.role')} />}
                      />
                      {touched.role && errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <NavingateToOtherPage title={t('common.cancel')} PageUrl="/masters/students" />
                    <AnimateButton>
                      <Button disableElevation disabled={isSubmitting} type="submit" variant="contained" color="secondary">
                        {isSubmitting ? t('common.loading') : t('common.save')}
                      </Button>
                    </AnimateButton>
                    {/* <BackButton/> */}
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <UserDocumentManager userId={userId} userType="STUDENT" />
        </TabPanel>
      </Box>
    </MainCard>
  );
};

export default EditStudent;
